/** Minimal UTF-8 base64 encoder for React Native (no Buffer/btoa). */
export function utf8ToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i]!;
    const b1 = i + 1 < bytes.length ? bytes[i + 1]! : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2]! : 0;
    const n = (b0 << 16) | (b1 << 8) | b2;
    output += chars[(n >> 18) & 63];
    output += chars[(n >> 12) & 63];
    output += i + 1 < bytes.length ? chars[(n >> 6) & 63] : '=';
    output += i + 2 < bytes.length ? chars[n & 63] : '=';
  }
  return output;
}
