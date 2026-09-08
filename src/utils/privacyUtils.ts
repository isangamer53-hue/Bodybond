/**
 * Privacy and Data Protection Utilities
 * Protects customer personally identifiable information (PII) on public views
 */

/**
 * Mask customer full name for public tracking & toasts
 * e.g. "Nusrat Jahan" -> "Nusrat J***" or "N****t J."
 * e.g. "Sumaiya Islam" -> "Sumaiya I***"
 */
export function maskCustomerName(name: string): string {
  if (!name) return 'Customer';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    const single = parts[0];
    if (single.length <= 2) return `${single}*`;
    return `${single.slice(0, 2)}${'*'.repeat(Math.min(4, single.length - 2))}${single.slice(-1)}`;
  }
  
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${firstName} ${lastInitial}***`;
}

/**
 * Mask customer phone number for public display
 * e.g. "01712345678" -> "017****5678"
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '01*********';
  const clean = phone.replace(/[\s\-_]/g, '');
  if (clean.length < 7) {
    return `${clean.slice(0, 3)}****`;
  }
  const prefix = clean.slice(0, 3);
  const suffix = clean.slice(-4);
  return `${prefix}****${suffix}`;
}

/**
 * Mask customer address to hide holding/house numbers while showing area & city
 * e.g. "House 42, Road 9/A, Dhanmondi" -> "Dhanmondi, Dhaka" or "Road 9/A, Dhanmondi (Protected)"
 */
export function maskAddress(address: string, city: string): string {
  if (!address) return city || 'Bangladesh';
  const parts = address.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    // Return last 2 segments (usually Area + District)
    const area = parts[parts.length - 1];
    return `***, ${area}`;
  }
  return `Protected Address, ${city}`;
}
