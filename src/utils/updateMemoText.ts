import type { Memo } from '../types'

export function updateMemoText(
  memos: Memo[],
  id: string,
  text: string,
): Memo[] {
  const trimmed = text.trim()
  if (!trimmed || !memos.some((m) => m.id === id)) return memos
  return memos.map((m) => (m.id === id ? { ...m, text: trimmed } : m))
}
