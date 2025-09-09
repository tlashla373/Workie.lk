// Centralized API service with token handling and helper methods
import { API_ENDPOINTS } from '../config/api.js';
import { 
  NetworkError, 
  isNetworkError, 
  retryWithBackoff, 
  createTimeoutSignal,
  checkOnlineStatus 
} from '../utils/networkUtils.js';

const API_BASE_URL = API_ENDPOINTS.AUTH.LOGIN.replace(/\/auth\/login$/, ''); // derive base

class ApiService {
	constructor() {
		this.tokenKey = 'auth_token';
		this.userKey = 'auth_user';
		this.defaultHeaders = {
			'Content-Type': 'application/json'
		};
		this.defaultTimeout = 15000; // 15 seconds
		this.maxRetries = 3;
	}

	// Token management
	setAuthToken(token) {
		if (token) localStorage.setItem(this.tokenKey, token);
	}

	getAuthToken() {
		return localStorage.getItem(this.tokenKey);
	}

	removeAuthToken() {
		localStorage.removeItem(this.tokenKey);
	}

	setUser(user) {
		if (user) localStorage.setItem(this.userKey, JSON.stringify(user));
	}

	getUser() {
		const raw = localStorage.getItem(this.userKey);
		try { return raw ? JSON.parse(raw) : null; } catch { return null; }
	}

	removeUser() {
		localStorage.removeItem(this.userKey);
	}

	// Core request method
	async request(path, { method = 'GET', body, headers = {}, includeAuth = true, signal, timeout = this.defaultTimeout } = {}) {
		// Check if we're offline
		if (!checkOnlineStatus()) {
			throw new NetworkError('No internet connection', true);
		}

		return retryWithBackoff(async () => {
			const finalHeaders = { ...this.defaultHeaders, ...headers };
			const token = this.getAuthToken();
			if (includeAuth && token) {
				finalHeaders.Authorization = `Bearer ${token}`;
			}

			// Create timeout signal if none provided
			let timeoutCleanup;
			if (!signal) {
				const timeoutInfo = createTimeoutSignal(timeout);
				signal = timeoutInfo.signal;
				timeoutCleanup = timeoutInfo.cleanup;
			}

			try {
				const response = await fetch(this._resolveUrl(path), {
					method,
					headers: finalHeaders,
					body: body ? JSON.stringify(body) : undefined,
					signal
				});

				const contentType = response.headers.get('content-type') || '';
				let data;
				if (contentType.includes('application/json')) {
					data = await response.json();
				} else {
					data = await response.text();
				}

				if (!response.ok) {
					const message = data?.message || `Request failed (${response.status})`;
					const error = new NetworkError(message, false, response.status);
					error.status = response.status;
					throw error;
				}

				return data;
			} catch (error) {
				if (timeoutCleanup) timeoutCleanup();
				
				// Handle network errors
				if (isNetworkError(error) || error.name === 'AbortError') {
					throw new NetworkError(
						error.name === 'AbortError' ? 'Request timeout' : 'Network connection failed',
						true
					);
				}
				
				throw error;
			} finally {
				if (timeoutCleanup) timeoutCleanup();
			}
		}, this.maxRetries);
	}

	// FormData request method (for file uploads)
	async requestFormData(path, { method = 'POST', formData, headers = {}, includeAuth = true, signal, onUploadProgress, timeout = this.defaultTimeout } = {}) {
		// Check if we're offline
		if (!checkOnlineStatus()) {
			throw new NetworkError('No internet connection', true);
		}

		return retryWithBackoff(async () => {
			const finalHeaders = { ...headers }; // Don't set Content-Type for FormData
			const token = this.getAuthToken();
			if (includeAuth && token) {
				finalHeaders.Authorization = `Bearer ${token}`;
			}

			// For upload progress tracking
			if (onUploadProgress && typeof XMLHttpRequest !== 'undefined') {
				return new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					
					// Set timeout
					xhr.timeout = timeout;
					
					xhr.upload.addEventListener('progress', (e) => {
						if (e.lengthComputable) {
							onUploadProgress(e);
						}
					});

					xhr.addEventListener('load', () => {
						if (xhr.status >= 200 && xhr.status < 300) {
							try {
								const response = JSON.parse(xhr.responseText);
								resolve(response);
							} catch {
								resolve(xhr.responseText);
							}
						} else {
							const error = new NetworkError(`Request failed (${xhr.status})`, false, xhr.status);
							error.status = xhr.status;
							reject(error);
						}
					});

					xhr.addEventListener('error', () => reject(new NetworkError('Network error', true)));
					xhr.addEventListener('abort', () => reject(new NetworkError('Request aborted', true)));
					xhr.addEventListener('timeout', () => reject(new NetworkError('Request timeout', true)));

					xhr.open(method, this._resolveUrl(path));
					
					// Set headers
					Object.entries(finalHeaders).forEach(([key, value]) => {
						xhr.setRequestHeader(key, value);
					});

					xhr.send(formData);
				});
			}

			// Fallback to fetch for browsers that don't support XMLHttpRequest upload progress
			// Create timeout signal if none provided
			let timeoutCleanup;
			if (!signal) {
				const timeoutInfo = createTimeoutSignal(timeout);
				signal = timeoutInfo.signal;
				timeoutCleanup = timeoutInfo.cleanup;
			}

			try {
				const response = await fetch(this._resolveUrl(path), {
					method,
					headers: finalHeaders,
					body: formData,
					signal
				});

				const contentType = response.headers.get('content-type') || '';
				let data;
				if (contentType.includes('application/json')) {
					data = await response.json();
				} else {
					data = await response.text();
				}

				if (!response.ok) {
					const message = data?.message || `Request failed (${response.status})`;
					const error = new NetworkError(message, false, response.status);
					error.status = response.status;
					throw error;
				}

				return data;
			} catch (error) {
				if (timeoutCleanup) timeoutCleanup();
				
				// Handle network errors
				if (isNetworkError(error) || error.name === 'AbortError') {
					throw new NetworkError(
						error.name === 'AbortError' ? 'Request timeout' : 'Network connection failed',
						true
					);
				}
				
				throw error;
			} finally {
				if (timeoutCleanup) timeoutCleanup();
			}
		}, this.maxRetries);
	}

	get(path, opts) { return this.request(path, { method: 'GET', ...opts }); }
	post(path, body, opts) { return this.request(path, { method: 'POST', body, ...opts }); }
	put(path, body, opts) { return this.request(path, { method: 'PUT', body, ...opts }); }
	patch(path, body, opts) { return this.request(path, { method: 'PATCH', body, ...opts }); }
	delete(path, opts) { return this.request(path, { method: 'DELETE', ...opts }); }

	// FormData methods
	postFormData(path, formData, opts) { return this.requestFormData(path, { method: 'POST', formData, ...opts }); }
	putFormData(path, formData, opts) { return this.requestFormData(path, { method: 'PUT', formData, ...opts }); }
	patchFormData(path, formData, opts) { return this.requestFormData(path, { method: 'PATCH', formData, ...opts }); }

	_resolveUrl(path) {
		// If already absolute (http) return as-is
		if (/^https?:/i.test(path)) return path;
		// If starts with /api assume same origin override
		if (path.startsWith('/api')) return path;
		// Ensure no duplicate slashes
		return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
	}
}

const apiService = new ApiService();
export default apiService;
