export function buildPinIcon(emoji: string, color: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">
  <path d="M22 0C9.85 0 0 9.85 0 22c0 16.5 22 34 22 34s22-17.5 22-34C44 9.85 34.15 0 22 0z" fill="${color}"/>
  <circle cx="22" cy="21" r="15" fill="#FDFBF6"/>
  <text x="22" y="27" font-size="18" text-anchor="middle">${emoji}</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}