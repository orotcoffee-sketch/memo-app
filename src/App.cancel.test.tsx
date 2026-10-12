import { render, screen } from '@testing-library/react'
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

async function startEdit(text: string) {
  seedMemos([text])
  render(<App />)
  const user = userEvent.setup()
  await user.dblClick(screen.getByText(text))
  return { user, input: screen.getByDisplayValue(text) }
}

function savedTexts(): string[] {
  const saved = JSON.parse(localStorage.getItem('memos') ?? '[]')
  return saved.map((m: { text: string }) => m.text)
}

describe('App 편집 취소와 바깥 클릭 저장', () => {
  beforeEach(() => localStorage.clear())

  // [정상]
  it('App should hide the input and show the original text when Escape is pressed after typing a new value', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '고친{Escape}')
    expect(screen.getByText('메모A')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('고친')).not.toBeInTheDocument()
  })

  it('App should keep the original text in localStorage when Escape is pressed after typing a new value', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '고친{Escape}')
    expect(savedTexts()).toEqual(['메모A'])
  })

  it('App should show the edited text and no input when the user clicks outside the input after typing a new value', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '고친')
    await user.click(document.body)
    expect(screen.getByText('고친')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('고친')).not.toBeInTheDocument()
  })

  it('App should keep the edited text in localStorage when the user clicks outside the input after typing a new value', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '고친')
    await user.click(document.body)
    expect(savedTexts()).toEqual(['고친'])
  })

  it('App should hide the input and keep the original text and the memo count when the input is cleared and Enter is pressed', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '{Enter}')
    expect(screen.getByText('메모A')).toBeInTheDocument()
    expect(screen.getByText('총 1개의 메모')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it('App should keep the original text in localStorage when the input is cleared and Enter is pressed', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '{Enter}')
    expect(savedTexts()).toEqual(['메모A'])
  })

  it('App should hide the input and show the original text when only whitespace is typed and the user clicks outside the input', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '   ')
    await user.click(document.body)
    expect(screen.getByText('메모A')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it('App should keep the original text in localStorage when only whitespace is typed and the user clicks outside the input', async () => {
    const { user, input } = await startEdit('메모A')
    await user.clear(input)
    await user.type(input, '   ')
    await user.click(document.body)
    expect(savedTexts()).toEqual(['메모A'])
  })
})
