/**
 * Escapes special regex characters in a string so it can be safely
 * used inside a RegExp constructor or `$regex` query.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
