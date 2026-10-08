type TagChipProps = {
  tag: string
  active: boolean
  onClick: (tag: string) => void
}

export function TagChip({ tag, active, onClick }: TagChipProps) {
  const handleClick = () => onClick(tag)

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={`rounded-full px-2 py-0.5 text-xs ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
    >
      #{tag}
    </button>
  )
}
