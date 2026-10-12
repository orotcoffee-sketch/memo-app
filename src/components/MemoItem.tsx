import { useRef, type FocusEvent, type KeyboardEvent } from 'react'
import type { Memo } from '../types'
import { parseTags } from '../utils/parseTags'
import { TagChip } from './TagChip'

type MemoItemProps = {
  memo: Memo
  editing: boolean
  activeTag: string | null
  onStartEdit: (id: string) => void
  onSaveEdit: (id: string, text: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
  onTagClick: (tag: string) => void
}

const ITEM_CLASS = 'rounded border border-gray-200 px-3 py-2'

export function MemoItem({
  memo,
  editing,
  activeTag,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onTagClick,
}: MemoItemProps) {
  // Enter/Esc 로 편집이 끝난 직후 발생하는 blur 로 다시 저장되지 않게 막는다
  const finishedRef = useRef(false)

  const handleDoubleClick = () => {
    finishedRef.current = false
    onStartEdit(memo.id)
  }
  const handleDelete = () => onDelete(memo.id)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishedRef.current = true
      onSaveEdit(memo.id, e.currentTarget.value)
    }
    if (e.key === 'Escape') {
      finishedRef.current = true
      onCancelEdit()
    }
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (finishedRef.current) return
    onSaveEdit(memo.id, e.currentTarget.value)
  }

  if (editing) {
    return (
      <li className={ITEM_CLASS}>
        <input
          defaultValue={memo.text}
          autoFocus
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </li>
    )
  }

  return (
    <li className={ITEM_CLASS}>
      <div className="flex items-center justify-between">
        <span className="break-all" onDoubleClick={handleDoubleClick}>
          {memo.text}
        </span>
        <button
          onClick={handleDelete}
          className="ml-3 shrink-0 text-sm text-red-600 hover:underline"
        >
          삭제
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {parseTags(memo.text).map((tag) => (
          <TagChip
            key={tag}
            tag={tag}
            active={tag === activeTag}
            onClick={onTagClick}
          />
        ))}
      </div>
    </li>
  )
}
