/**
 * Utility helper for masking student IDs on public-facing views
 * Example: 0112330182 -> 01123****182
 */
export function maskStudentId(id) {
  if (!id || typeof id !== 'string') return id || '';
  const clean = id.trim();
  if (clean.length < 6 || clean.toLowerCase().includes('not') || clean.toLowerCase().includes('added')) {
    return clean;
  }
  // Standard 10-digit UIU ID format: 0112330182 -> 01123****182
  if (clean.length >= 8) {
    const prefix = clean.slice(0, 5);
    const suffix = clean.slice(-3);
    return `${prefix}****${suffix}`;
  }
  return `${clean.slice(0, 2)}****${clean.slice(-2)}`;
}
