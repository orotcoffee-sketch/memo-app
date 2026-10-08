import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

async function addMemo(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByPlaceholderText('메모를 입력하세요'), text)
  await user.click(screen.getByRole('button', { name: '추가' }))
}

describe('App 태그 칩', () => {
  beforeEach(() => localStorage.clear())

  // [정상]
  it('should show a #업무 chip below the memo when a memo containing #업무 is added', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addMemo(user, '회의 #업무')
    expect(screen.getByRole('button', { name: '#업무' })).toBeInTheDocument()
  })

  it('should show a single #work chip when a memo containing #Work #work is added', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addMemo(user, '#Work #work')
    expect(screen.getAllByRole('button', { name: '#work' })).toHaveLength(1)
  })

  it('should show only the #a chip when a memo containing #a-b is added', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addMemo(user, '#a-b')
    expect(screen.getByRole('button', { name: '#a' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '#a-b' })).not.toBeInTheDocument()
  })

  it('should show no chip when a memo without # is added', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addMemo(user, '태그 없는 메모')
    expect(screen.getByText('태그 없는 메모')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^#/ })).not.toBeInTheDocument()
  })

  it('should remove the memo and its chips together when the delete button is pressed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addMemo(user, '회의 #업무 #개인')
    await user.click(screen.getByRole('button', { name: '삭제' }))
    expect(screen.queryByText('회의 #업무 #개인')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^#/ })).not.toBeInTheDocument()
  })

  // [예외]
  it('should not add a memo and should show no chip when the input is only whitespace', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addMemo(user, '   ')
    expect(screen.getByText('메모가 없습니다.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^#/ })).not.toBeInTheDocument()
  })
})
