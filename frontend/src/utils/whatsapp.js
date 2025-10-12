// Utility functions for WhatsApp integration
const DEFAULT_CC = import.meta.env.VITE_WHATSAPP_DEFAULT_COUNTRY_CODE || '94';

export const normalizePhoneForWhatsApp = (raw, countryCode = DEFAULT_CC) => {
  if (!raw) return null;
  let phone = String(raw).trim();

  // Keep digits and + for preprocessing, then drop leading +
  phone = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');

  // Convert 00 prefix to international
  if (phone.startsWith('00')) phone = phone.slice(2);

  // National numbers starting with 0 -> prepend country code
  if (/^0\d{8,12}$/.test(phone)) phone = countryCode + phone.slice(1);

  // Final guard: 9–15 digits
  if (!/^\d{9,15}$/.test(phone)) return null;
  return phone;
};

export const buildWhatsAppUrl = ({ phoneNumber, text = '' }) => {
  const phone = normalizePhoneForWhatsApp(phoneNumber);
  if (!phone) return null;
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  return `https://wa.me/${phone}${params.toString() ? `?${params.toString()}` : ''}`;
};
