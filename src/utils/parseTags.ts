const TAG_PATTERN = /#([가-힣A-Za-z0-9_]+)/g

export function parseTags(text: string): string[] {
  const tags = Array.from(text.matchAll(TAG_PATTERN), (m) => m[1].toLowerCase())
  return [...new Set(tags)]
}
