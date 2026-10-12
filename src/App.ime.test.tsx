import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

function seedMemos(texts: string[]) {
  const memos = texts.map((text, i) => ({
    id: `memo-${i}`,
    text,
    createdAt: i,
  }))
  localStorage.setItem('memos', JSON.stringify(memos))
}

function savedTexts(): string[] {
  const saved = JSON.parse(localStorage.getItem('memos') ?? '[]')
  return saved.map((m: { text: string }) => m.text)
}

async function startEditing(from: string, typed: string) {
  seedMemos([from])
  render(<App />)
  const user = userEvent.setup()
  await user.dblClick(screen.getByText(from))
  const input = screen.getByDisplayValue(from)
  await user.clear(input)
  await user.type(input, typed)
  return input
}

describe('App 한글 조합(IME) 중 Enter', () => {
  beforeEach(() => localStorage.clear())

  // [정상]
  it('App should keep the input open and the saved text unchanged when Enter is pressed during IME composition', async () => {
    const input = await startEditing('메모A', '고친')
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
    expect(screen.getByDisplayValue('고친')).toBeInTheDocument()
    expect(savedTexts()).toEqual(['메모A'])
  })

  it('App should show the typed text and no input when Enter is pressed after the composition has ended', async () => {
    const input = await startEditing('메모A', '고친')
    fireEvent.keyDown(input, { key: 'Enter', isComposing: false })
    expect(screen.getByText('고친')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('고친')).not.toBeInTheDocument()
  })
})
