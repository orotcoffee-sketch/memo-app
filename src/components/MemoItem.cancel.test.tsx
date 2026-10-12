import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoItem } from './MemoItem'

const memo = { id: 'm1', text: '회의 #업무', createdAt: 1 }

function renderEditing() {
  const handlers = {
    onStartEdit: vi.fn(),
    onSaveEdit: vi.fn(),
    onCancelEdit: vi.fn(),
    onDelete: vi.fn(),
    onTagClick: vi.fn(),
  }
  render(<MemoItem memo={memo} editing activeTag={null} {...handlers} />)
  return {
    user: userEvent.setup(),
    input: screen.getByRole('textbox'),
    ...handlers,
  }
}

describe('MemoItem 편집 취소와 바깥 클릭 저장', () => {
  // [정상]
  it('MemoItem should call onCancelEdit when Escape is pressed while editing', async () => {
    const { user, input, onCancelEdit } = renderEditing()
    await user.type(input, '{Escape}')
    expect(onCancelEdit).toHaveBeenCalledTimes(1)
  })

  it('MemoItem should not call onSaveEdit when Escape is pressed while editing', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.type(input, '{Escape}')
    expect(onSaveEdit).not.toHaveBeenCalled()
  })

  it('MemoItem should call onSaveEdit with the memo id and the typed value when the input loses focus', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.clear(input)
    await user.type(input, '고침')
    await user.click(document.body)
    expect(onSaveEdit).toHaveBeenCalledWith('m1', '고침')
  })

  it('MemoItem should call onSaveEdit with an empty string when the input is cleared and Enter is pressed', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.clear(input)
    await user.type(input, '{Enter}')
    expect(onSaveEdit).toHaveBeenCalledWith('m1', '')
  })

  // [경계]
  it('MemoItem should call onSaveEdit only once when Enter is pressed and the input then loses focus', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.type(input, '고침{Enter}')
    await user.click(document.body)
    expect(onSaveEdit).toHaveBeenCalledTimes(1)
  })

  it('MemoItem should not call onSaveEdit when Escape is pressed and the input then loses focus', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.type(input, '{Escape}')
    await user.click(document.body)
    expect(onSaveEdit).not.toHaveBeenCalled()
  })

  it('MemoItem should not call onCancelEdit when a key other than Escape is pressed', async () => {
    const { user, input, onCancelEdit } = renderEditing()
    await user.type(input, 'a')
    expect(onCancelEdit).not.toHaveBeenCalled()
  })
})
