import type { ReactElement } from 'react'
import type { Memo } from '../types'

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

export function MemoItem(_props: MemoItemProps): ReactElement {
  throw new Error('not implemented')
}
