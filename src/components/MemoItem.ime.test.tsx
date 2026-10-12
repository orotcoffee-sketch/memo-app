import { fireEvent, render, screen } from '@testing-library/react'
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

const composingEnter = { key: 'Enter', isComposing: true }
const finishedEnter = { key: 'Enter', isComposing: false }

describe('MemoItem 한글 조합(IME) 중 키 처리', () => {
  // [정상]
  it('MemoItem should not call onSaveEdit when Enter is pressed during IME composition', () => {
    const { input, onSaveEdit } = renderEditing()
    fireEvent.keyDown(input, composingEnter)
    expect(onSaveEdit).not.toHaveBeenCalled()
  })

  it('MemoItem should keep the input and its typed value when Enter is pressed during IME composition', async () => {
    const { user, input } = renderEditing()
    await user.clear(input)
    await user.type(input, '고')
    fireEvent.keyDown(input, composingEnter)
    expect(screen.getByRole('textbox')).toHaveValue('고')
  })

  it('MemoItem should call onSaveEdit with the memo id and the input value when Enter is pressed after the composition has ended', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.clear(input)
    await user.type(input, '고침')
    fireEvent.keyDown(input, finishedEnter)
    expect(onSaveEdit).toHaveBeenCalledWith('m1', '고침')
  })

  it('MemoItem should call onSaveEdit exactly once when Enter is pressed during composition and then pressed again after the composition has ended', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.clear(input)
    await user.type(input, '고침')
    fireEvent.keyDown(input, composingEnter)
    fireEvent.keyDown(input, finishedEnter)
    expect(onSaveEdit).toHaveBeenCalledTimes(1)
  })

  it('MemoItem should call onSaveEdit with the typed letters when Enter is pressed after typing English letters', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.clear(input)
    await user.type(input, 'abc{Enter}')
    expect(onSaveEdit).toHaveBeenCalledWith('m1', 'abc')
  })

  it('MemoItem should call onSaveEdit with the typed digits when Enter is pressed after typing digits', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.clear(input)
    await user.type(input, '123{Enter}')
    expect(onSaveEdit).toHaveBeenCalledWith('m1', '123')
  })

  // [경계]
  it('MemoItem should not call onSaveEdit when the Enter keydown has keyCode 229 even if isComposing is false', () => {
    const { input, onSaveEdit } = renderEditing()
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229, isComposing: false })
    expect(onSaveEdit).not.toHaveBeenCalled()
  })

  it('MemoItem should still save the typed value when the input loses focus after Enter was ignored during composition', async () => {
    const { user, input, onSaveEdit } = renderEditing()
    await user.clear(input)
    await user.type(input, '고침')
    fireEvent.keyDown(input, composingEnter)
    await user.click(document.body)
    expect(onSaveEdit).toHaveBeenCalledTimes(1)
    expect(onSaveEdit).toHaveBeenCalledWith('m1', '고침')
  })

  it('MemoItem should not call onCancelEdit when Escape is pressed during IME composition', () => {
    const { input, onCancelEdit } = renderEditing()
    fireEvent.keyDown(input, { key: 'Escape', isComposing: true })
    expect(onCancelEdit).not.toHaveBeenCalled()
  })
})
