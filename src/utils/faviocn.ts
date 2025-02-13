export function getPrimaryColor(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--primary-color")
    .trim();
}

export function generateFaviconSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="${color}" d="M20.76 1.593A2.36 2.36 0 0 0 19.572.225c-.54-.27-1.188-.336-2.256.02L5.187 4.29c-1.068.357-1.548.795-1.818 1.338a2.36 2.36 0 0 0 1.059 3.174c.54.27 1.188.336 2.256-.021l12.129-4.044c1.068-.354 1.548-.795 1.818-1.338a2.35 2.35 0 0 0 .13-1.806zm0 7.485a2.36 2.36 0 0 0-1.188-1.368c-.54-.27-1.188-.336-2.256.021L5.187 11.775c-1.068.357-1.548.795-1.818 1.338a2.36 2.36 0 0 0 1.059 3.174c.54.27 1.188.336 2.256-.021l12.129-4.041c1.068-.357 1.548-.795 1.818-1.341a2.35 2.35 0 0 0 .13-1.806zm0 7.488a2.36 2.36 0 0 0-1.188-1.368c-.54-.27-1.188-.336-2.256.021L5.187 19.263c-1.068.357-1.548.795-1.818 1.338a2.36 2.36 0 0 0 1.059 3.174c.54.27 1.188.336 2.256-.02l12.129-4.045c1.068-.354 1.548-.795 1.818-1.338a2.35 2.35 0 0 0 .13-1.806z"></path></svg>`;
}

export function updateFavicon(color: string): void {
  const svgString = generateFaviconSvg(color);
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  const dataUrl = `data:image/svg+xml,${encoded}`;
  let link = document.querySelector(
    'link[rel="icon"]'
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = dataUrl;
}
