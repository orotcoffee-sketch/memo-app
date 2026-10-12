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

function savedTexts(): string[] {
  const saved = JSON.parse(localStorage.getItem('memos') ?? '[]')
  return saved.map((m: { text: string }) => m.text)
}

// 메모 A, B 를 그리고 A 를 더블클릭해 편집 중인 상태로 만든다
async function startEditingA() {
  seedMemos(['메모A', '메모B'])
  render(<App />)
  const user = userEvent.setup()
  await user.dblClick(screen.getByText('메모A'))
  return { user, inputA: screen.getByDisplayValue('메모A') }
}

describe('App 한 번에 한 메모만 편집', () => {
  beforeEach(() => localStorage.clear())

  // [정상]
  it("App should show the edited text of memo A when memo B's text is double-clicked while memo A is being edited", async () => {
    const { user, inputA } = await startEditingA()
    await user.clear(inputA)
    await user.type(inputA, '고친A')
    await user.dblClick(screen.getByText('메모B'))
    expect(screen.getByText('고친A')).toBeInTheDocument()
  })

  it("App should keep the edited text of memo A in localStorage when memo B's text is double-clicked while memo A is being edited", async () => {
    const { user, inputA } = await startEditingA()
    await user.clear(inputA)
    await user.type(inputA, '고친A')
    await user.dblClick(screen.getByText('메모B'))
    expect(savedTexts()).toEqual(['고친A', '메모B'])
  })

  it("App should hide the input of memo A when memo B's text is double-clicked while memo A is being edited", async () => {
    const { user, inputA } = await startEditingA()
    await user.clear(inputA)
    await user.type(inputA, '고친A')
    await user.dblClick(screen.getByText('메모B'))
    expect(screen.queryByDisplayValue('고친A')).not.toBeInTheDocument()
  })

  it("App should show an input filled with the current text of memo B when memo B's text is double-clicked while memo A is being edited", async () => {
    const { user } = await startEditingA()
    await user.dblClick(screen.getByText('메모B'))
    expect(screen.getByDisplayValue('메모B')).toBeInTheDocument()
  })

  it("App should focus the input of memo B when memo B's text is double-clicked while memo A is being edited", async () => {
    const { user } = await startEditingA()
    await user.dblClick(screen.getByText('메모B'))
    expect(screen.getByDisplayValue('메모B')).toHaveFocus()
  })

  it('App should save the edited text of memo B when Enter is pressed after switching from memo A', async () => {
    const { user } = await startEditingA()
    await user.dblClick(screen.getByText('메모B'))
    const inputB = screen.getByDisplayValue('메모B')
    await user.clear(inputB)
    await user.type(inputB, '고친B{Enter}')
    expect(screen.getByText('고친B')).toBeInTheDocument()
    expect(savedTexts()).toEqual(['메모A', '고친B'])
  })

  it("App should show exactly one edit input when memo B's text is double-clicked while memo A is being edited", async () => {
    const { user } = await startEditingA()
    await user.dblClick(screen.getByText('메모B'))
    // 메모 추가 입력창 1개 + 편집 입력창 1개
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  // [경계]
  it('App should keep the original text of memo A and open memo B for editing when the input of memo A is cleared and memo B is double-clicked', async () => {
    const { user, inputA } = await startEditingA()
    await user.clear(inputA)
    await user.dblClick(screen.getByText('메모B'))
    expect(screen.getByText('메모A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('메모B')).toBeInTheDocument()
  })

  it('App should keep the original text of memo A and open memo B for editing when the input of memo A has only whitespace and memo B is double-clicked', async () => {
    const { user, inputA } = await startEditingA()
    await user.clear(inputA)
    await user.type(inputA, '   ')
    await user.dblClick(screen.getByText('메모B'))
    expect(screen.getByText('메모A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('메모B')).toBeInTheDocument()
  })

  it('App should keep both texts unchanged and open memo B for editing when memo A has no changes and memo B is double-clicked', async () => {
    const { user } = await startEditingA()
    await user.dblClick(screen.getByText('메모B'))
    expect(screen.getByText('메모A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('메모B')).toBeInTheDocument()
    expect(savedTexts()).toEqual(['메모A', '메모B'])
  })

  it('App should show the saved text of memo A in a single input when memo A is double-clicked again after switching to memo B', async () => {
    const { user, inputA } = await startEditingA()
    await user.clear(inputA)
    await user.type(inputA, '고친A')
    await user.dblClick(screen.getByText('메모B'))
    await user.dblClick(screen.getByText('고친A'))
    expect(screen.getByDisplayValue('고친A')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  it('App should save the edit when memo A is edited again after Escape and the user clicks outside the input', async () => {
    const { user, inputA } = await startEditingA()
    await user.type(inputA, '{Escape}')
    await user.dblClick(screen.getByText('메모A'))
    const again = screen.getByDisplayValue('메모A')
    await user.clear(again)
    await user.type(again, '다시')
    await user.click(document.body)
    expect(screen.getByText('다시')).toBeInTheDocument()
    expect(savedTexts()).toEqual(['다시', '메모B'])
  })
})
