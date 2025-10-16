/**
 * Formatiert große Zahlen mit K, M, B, T, Q, Qt, Sx, Sp, O, N, D Suffixen
 * @param num - Die zu formatierende Zahl
 * @returns Formatierter String (z.B. "1.5M", "2.3B")
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();

  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Qt', 'Sx', 'Sp', 'O', 'N', 'D'];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (tier === 0) return num.toString();
  
  const suffix = suffixes[tier] || '';
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  
  // Zeige bis zu 2 Dezimalstellen, aber entferne unnötige Nullen
  return scaled.toFixed(2).replace(/\.?0+$/, '') + suffix;
}

/**
 * Formatiert Zahlen für die Anzeige mit Tausendertrennzeichen
 * @param num - Die zu formatierende Zahl
 * @returns Formatierter String mit Punkten als Tausendertrennzeichen
 */
export function formatNumberWithSeparator(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}