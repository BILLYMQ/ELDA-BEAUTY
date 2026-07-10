export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatPrice(price?: number): string {
  if (price === undefined || price === null || Number.isNaN(price)) {
    return "Prix à confirmer avec ELDA BEAUTY.";
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function placeholderThumbnail(
  label: string,
  colorFrom = "#4B1D6B",
  colorTo = "#C9A24B"
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colorFrom}"/>
        <stop offset="100%" stop-color="${colorTo}"/>
      </linearGradient>
    </defs>
    <rect width="480" height="270" fill="url(#g)"/>
    <circle cx="240" cy="115" r="34" fill="rgba(251,248,243,0.9)"/>
    <polygon points="230,98 230,132 262,115" fill="#4B1D6B"/>
    <text x="240" y="200" font-family="Georgia, serif" font-size="20" fill="#FBF8F3" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
