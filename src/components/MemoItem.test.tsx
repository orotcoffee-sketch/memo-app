import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoItem } from './MemoItem'

const memo = { id: 'm1', text: '회의 #업무', createdAt: 1 }

function renderItem(props: Partial<Parameters<typeof MemoItem>[0]> = {}) {
  const handlers = {
    onStartEdit: vi.fn(),
    onSaveEdit: vi.fn(),
    onCancelEdit: vi.fn(),
    onDelete: vi.fn(),
    onTagClick: vi.fn(),
  }
  render(
    <MemoItem
      memo={memo}
      editing={false}
      activeTag={null}
      {...handlers}
      {...props}
    />,
  )
  return { user: userEvent.setup(), ...handlers }
}

describe('MemoItem', () => {
  // [정상]
  it('MemoItem should show the text, the tag chips and the delete button when editing is false', () => {
    renderItem()
    expect(screen.getByText('회의 #업무')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '#업무' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })

  it('MemoItem should call onStartEdit with the memo id when the text is double-clicked', async () => {
    const { user, onStartEdit } = renderItem()
    await user.dblClick(screen.getByText('회의 #업무'))
    expect(onStartEdit).toHaveBeenCalledWith('m1')
  })

  it('MemoItem should show a one-line input instead of the text when editing is true', () => {
    renderItem({ editing: true })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByText('회의 #업무')).not.toBeInTheDocument()
  })

  it('MemoItem should fill the input with the current memo text when editing is true', () => {
    renderItem({ editing: true })
    expect(screen.getByRole('textbox')).toHaveValue('회의 #업무')
  })

  it('MemoItem should focus the input when editing is true', () => {
    renderItem({ editing: true })
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('MemoItem should hide the tag chips and the delete button when editing is true', () => {
    renderItem({ editing: true })
    expect(
      screen.queryByRole('button', { name: '#업무' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '삭제' }),
    ).not.toBeInTheDocument()
  })

  it('MemoItem should call onSaveEdit with the memo id and the input value when Enter is pressed', async () => {
    const { user, onSaveEdit } = renderItem({ editing: true })
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '고친 내용{Enter}')
    expect(onSaveEdit).toHaveBeenCalledWith('m1', '고친 내용')
  })

  // [경계]
  it('MemoItem should not call onStartEdit when the text is clicked only once', async () => {
    const { user, onStartEdit } = renderItem()
    await user.click(screen.getByText('회의 #업무'))
    expect(onStartEdit).not.toHaveBeenCalled()
  })

  it('MemoItem should not call onSaveEdit when a key other than Enter is pressed', async () => {
    const { user, onSaveEdit } = renderItem({ editing: true })
    await user.type(screen.getByRole('textbox'), 'a')
    expect(onSaveEdit).not.toHaveBeenCalled()
  })
})
