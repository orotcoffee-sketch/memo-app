type EmptyStateProps = {
  message?: string
}

export function EmptyState({ message = '메모가 없습니다.' }: EmptyStateProps) {
  return <p className="py-8 text-center text-sm text-gray-400">{message}</p>
}
