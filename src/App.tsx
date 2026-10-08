import { MemoCount } from './components/MemoCount'
import { TagChip } from './components/TagChip'
import { parseTags } from './utils/parseTags'
import { useEffect, useState, type FormEvent } from 'react'

type Memo = { id: string; text: string; createdAt: number }

const STORAGE_KEY = 'memos'

function loadMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Memo[]) : []
  } catch {
    return []
  }
}

export default function App() {
  const [memos, setMemos] = useState<Memo[]>(loadMemos)
  const [text, setText] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // 선택한 태그의 메모가 모두 삭제되면 필터를 자동으로 해제한다
  const activeTag =
    selectedTag && memos.some((m) => parseTags(m.text).includes(selectedTag))
      ? selectedTag
      : null

  const visibleMemos = activeTag
    ? memos.filter((m) => parseTags(m.text).includes(activeTag))
    : memos

  const handleTagClick = (tag: string) =>
    setSelectedTag((prev) => (prev === tag ? null : tag))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  }, [memos])

  const addMemo = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setMemos((prev) => [
      { id: crypto.randomUUID(), text: trimmed, createdAt: Date.now() },
      ...prev,
    ])
    setText('')
  }

  const deleteMemo = (id: string) =>
    setMemos((prev) => prev.filter((m) => m.id !== id))

  return (
    <main className="mx-auto min-h-screen max-w-md p-6">
      <h1 className="mb-1 text-2xl font-bold">메모앱</h1>
      <MemoCount count={visibleMemos.length} />

      <form onSubmit={addMemo} className="mb-6 flex gap-2">
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
            <li
              key={m.id}
              className="rounded border border-gray-200 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="break-all">{m.text}</span>
                <button
                  onClick={() => deleteMemo(m.id)}
                  className="ml-3 shrink-0 text-sm text-red-600 hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {parseTags(m.text).map((tag) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    active={tag === activeTag}
                    onClick={handleTagClick}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
