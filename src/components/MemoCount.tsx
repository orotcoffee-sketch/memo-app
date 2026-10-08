type MemoCountProps = {
  count: number
}

export function MemoCount({ count }: MemoCountProps) {
  return <p className="mb-4 text-sm text-gray-500">총 {count}개의 메모</p>
}
