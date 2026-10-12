import { MemoCount } from './components/MemoCount'
import { MemoItem } from './components/MemoItem'
import type { Memo } from './types'
import { parseTags } from './utils/parseTags'
import { updateMemoText } from './utils/updateMemoText'
import { useEffect, useState, type FormEvent } from 'react'

const STORAGE_KEY = 'memos'

function loadMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Memo[]) : []
  } catch {
    return []
  }
}

const hasTag = (memo: Memo, tag: string) => parseTags(memo.text).includes(tag)

export default function App() {
  const [memos, setMemos] = useState<Memo[]>(loadMemos)
  const [text, setText] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // 선택한 태그의 메모가 모두 삭제되면 필터를 자동으로 해제한다
  const activeTag =
    selectedTag && memos.some((m) => hasTag(m, selectedTag))
      ? selectedTag
      : null

  const visibleMemos = activeTag
    ? memos.filter((m) => hasTag(m, activeTag))
    : memos

  const handleTagClick = (tag: string) =>
    setSelectedTag((prev) => (prev === tag ? null : tag))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  }, [memos])

  const handleAddMemo = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setMemos((prev) => [
      { id: crypto.randomUUID(), text: trimmed, createdAt: Date.now() },
      ...prev,
    ])
    setText('')
  }

  // 바뀐 목록에 선택한 태그의 메모가 하나도 없으면 선택 태그 state 도 해제한다
  const clearTagIfGone = (nextMemos: Memo[]) => {
    if (selectedTag && !nextMemos.some((m) => hasTag(m, selectedTag))) {
      setSelectedTag(null)
    }
  }

  const handleDeleteMemo = (id: string) => {
    const remaining = memos.filter((m) => m.id !== id)
    clearTagIfGone(remaining)
    setMemos(remaining)
  }

  const handleSaveEdit = (id: string, nextText: string) => {
    const updated = updateMemoText(memos, id, nextText)
    clearTagIfGone(updated)
    setMemos(updated)
    setEditingId(null)
  }

  const handleCancelEdit = () => setEditingId(null)

  return (
    <main className="mx-auto min-h-screen max-w-md p-6">
      <h1 className="mb-1 text-2xl font-bold">메모앱</h1>
      <MemoCount count={visibleMemos.length} />

      <form onSubmit={handleAddMemo} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메모를 입력하세요"
          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          추가
        </button>
      </form>

      {visibleMemos.length === 0 ? (
        <p className="text-gray-500">메모가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {visibleMemos.map((m) => (
            <MemoItem
              key={m.id}
              memo={m}
              editing={m.id === editingId}
              activeTag={activeTag}
              onStartEdit={setEditingId}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onDelete={handleDeleteMemo}
              onTagClick={handleTagClick}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
