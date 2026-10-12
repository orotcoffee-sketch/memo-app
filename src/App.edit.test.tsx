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

async function editMemo(
  user: ReturnType<typeof userEvent.setup>,
  from: string,
  to: string,
) {
  await user.dblClick(screen.getByText(from))
  const input = screen.getByDisplayValue(from)
  await user.clear(input)
  await user.type(input, `${to}{Enter}`)
}

describe('App 메모 인라인 수정', () => {
  beforeEach(() => localStorage.clear())

  // [정상]
  it('App should show the edited text and no input when Enter is pressed after editing a memo', async () => {
    seedMemos(['메모A'])
    render(<App />)
    const user = userEvent.setup()
    await editMemo(user, '메모A', '고친 메모')
    expect(screen.getByText('고친 메모')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('고친 메모')).not.toBeInTheDocument()
  })

  it('App should show the edited text without surrounding spaces when the saved text had spaces', async () => {
    seedMemos(['메모A'])
    render(<App />)
    const user = userEvent.setup()
    await editMemo(user, '메모A', '  고친 메모  ')
    const saved = JSON.parse(localStorage.getItem('memos') ?? '[]')
    expect(saved[0].text).toBe('고친 메모')
  })

  it('App should keep the edited memo in the same list position after saving', async () => {
    seedMemos(['메모A', '메모B', '메모C'])
    render(<App />)
    const user = userEvent.setup()
    await editMemo(user, '메모B', '고친 B')
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('메모A')
    expect(items[1]).toHaveTextContent('고친 B')
    expect(items[2]).toHaveTextContent('메모C')
  })

  it('App should keep the edited text in localStorage so it is shown again after reload', async () => {
    seedMemos(['메모A'])
    const first = render(<App />)
    const user = userEvent.setup()
    await editMemo(user, '메모A', '고친 메모')
    first.unmount()
    render(<App />)
    expect(screen.getByText('고친 메모')).toBeInTheDocument()
  })

  it('App should show tag chips that match the edited text when the #태그 in the text is changed and saved', async () => {
    seedMemos(['회의 #업무'])
    render(<App />)
    const user = userEvent.setup()
    await editMemo(user, '회의 #업무', '회의 #개인')
    expect(screen.getByRole('button', { name: '#개인' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '#업무' }),
    ).not.toBeInTheDocument()
  })
})
