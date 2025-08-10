import { useCallback, useEffect, useState } from 'react';
import authService from '../services/authService.js';

// Lightweight auth state hook (could be expanded into context later)
export function useAuth() {
	const [user, setUser] = useState(() => authService.isAuthenticated() ? authService.getUserRole() : null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const login = useCallback(async (email, password) => {
		setLoading(true); setError(null);
		try {
			const res = await authService.login({ email, password });
			// backend returns { success, data: { user, token } }
			if (res?.data?.user) {
				// store user separately via apiService through authService if needed
			}
			setUser(res?.data?.user || null);
			return res;
		} catch (e) {
			setError(e.message);
			throw e;
		} finally {
			setLoading(false);
		}
	}, []);

	const register = useCallback(async (payload) => {
		setLoading(true); setError(null);
		try {
			const res = await authService.register(payload);
			setUser(res?.data?.user || null);
			return res;
		} catch (e) {
			setError(e.message);
			throw e;
		} finally { setLoading(false); }
	}, []);

	const logout = useCallback(async () => {
		await authService.logout();
		setUser(null);
	}, []);

	// Optional: attempt to fetch current user on mount if token exists
	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (authService.isAuthenticated()) {
				try {
					setLoading(true);
						const res = await authService.getCurrentUser();
						if (!cancelled) setUser(res?.data?.user || null);
				} catch (e) {
					if (!cancelled) setUser(null);
				} finally { if (!cancelled) setLoading(false); }
			}
		})();
		return () => { cancelled = true; };
	}, []);

	return { user, authLoading: loading, authError: error, login, register, logout, authenticated: !!user };
}

export default useAuth;
