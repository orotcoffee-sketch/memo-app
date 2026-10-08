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

function renderApp(texts: string[]) {
  seedMemos(texts)
  render(<App />)
  return userEvent.setup()
}

describe('App 태그 필터', () => {
  beforeEach(() => localStorage.clear())

  // [정상]
  it('should show only the #업무 memos when the #업무 chip is clicked', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인', '보고 #업무'])
    await user.click(screen.getAllByRole('button', { name: '#업무' })[0])
    expect(screen.getByText('회의 #업무')).toBeInTheDocument()
    expect(screen.getByText('보고 #업무')).toBeInTheDocument()
    expect(screen.queryByText('운동 #개인')).not.toBeInTheDocument()
  })

  it('should show every memo again when the same chip is clicked a second time', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인', '보고 #업무'])
    const chip = () => screen.getAllByRole('button', { name: '#업무' })[0]
    await user.click(chip())
    await user.click(chip())
    expect(screen.getByText('운동 #개인')).toBeInTheDocument()
    expect(screen.getByText('총 3개의 메모')).toBeInTheDocument()
  })

  it('should show the filtered count when the filter is on', async () => {
    const user = renderApp(['a #업무', 'b #개인', 'c', 'd #업무', 'e'])
    await user.click(screen.getAllByRole('button', { name: '#업무' })[0])
    expect(screen.getByText('총 2개의 메모')).toBeInTheDocument()
  })

  it('should mark only the selected tag chips as pressed when the filter is on', async () => {
    const user = renderApp(['x #업무 #개인', 'y #업무'])
    await user.click(screen.getAllByRole('button', { name: '#업무' })[0])
    for (const chip of screen.getAllByRole('button', { name: '#업무' })) {
      expect(chip).toHaveAttribute('aria-pressed', 'true')
    }
    expect(screen.getByRole('button', { name: '#개인' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('should switch the filter to the other tag when a different chip is clicked', async () => {
    const user = renderApp(['a #업무 #개인', 'b #개인', 'c #업무'])
    await user.click(screen.getAllByRole('button', { name: '#업무' })[0])
    expect(screen.queryByText('b #개인')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '#개인' }))
    expect(screen.getByText('a #업무 #개인')).toBeInTheDocument()
    expect(screen.getByText('b #개인')).toBeInTheDocument()
    expect(screen.queryByText('c #업무')).not.toBeInTheDocument()
  })

  it('should clear the filter and show the remaining memos when all memos of the filtered tag are deleted', async () => {
    const user = renderApp(['a #업무', 'b #개인'])
    await user.click(screen.getByRole('button', { name: '#업무' }))
    await user.click(screen.getByRole('button', { name: '삭제' }))
    expect(screen.getByText('b #개인')).toBeInTheDocument()
    expect(screen.getByText('총 1개의 메모')).toBeInTheDocument()
  })

  // [경계]
  it('should keep the filter when one of two memos of the filtered tag is deleted', async () => {
    const user = renderApp(['a #업무', 'b #업무', 'c'])
    await user.click(screen.getAllByRole('button', { name: '#업무' })[0])
    await user.click(screen.getAllByRole('button', { name: '삭제' })[0])
    expect(screen.getByText('b #업무')).toBeInTheDocument()
    expect(screen.queryByText('c')).not.toBeInTheDocument()
    expect(screen.getByText('총 1개의 메모')).toBeInTheDocument()
  })

  it('should clear the filter when the last memo of the filtered tag is deleted', async () => {
    const user = renderApp(['a #업무', 'c #개인'])
    await user.click(screen.getByRole('button', { name: '#업무' }))
    await user.click(screen.getByRole('button', { name: '삭제' }))
    expect(screen.getByRole('button', { name: '#개인' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('should treat #Work and #work as the same filter', async () => {
    const user = renderApp(['A #Work', 'b #work', 'c'])
    await user.click(screen.getAllByRole('button', { name: '#work' })[0])
    expect(screen.getByText('A #Work')).toBeInTheDocument()
    expect(screen.getByText('b #work')).toBeInTheDocument()
    expect(screen.queryByText('c')).not.toBeInTheDocument()
  })

  it("should show a memo with several tags under each of its tags' filters", async () => {
    const user = renderApp(['a #업무 #개인', 'b #개인'])
    await user.click(screen.getAllByRole('button', { name: '#개인' })[0])
    expect(screen.getByText('a #업무 #개인')).toBeInTheDocument()
    expect(screen.getByText('b #개인')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: '#개인' })[0])
    await user.click(screen.getByRole('button', { name: '#업무' }))
    expect(screen.getByText('a #업무 #개인')).toBeInTheDocument()
    expect(screen.queryByText('b #개인')).not.toBeInTheDocument()
  })

  // [예외]
  it('should show the remaining memos that have no tags when the filtered tag memos are all deleted', async () => {
    const user = renderApp(['a #업무', 'plain'])
    await user.click(screen.getByRole('button', { name: '#업무' }))
    await user.click(screen.getByRole('button', { name: '삭제' }))
    expect(screen.getByText('plain')).toBeInTheDocument()
  })

  it('should show the empty message when the last remaining memo is deleted while the filter is on', async () => {
    const user = renderApp(['a #업무'])
    await user.click(screen.getByRole('button', { name: '#업무' }))
    await user.click(screen.getByRole('button', { name: '삭제' }))
    expect(screen.getByText('메모가 없습니다.')).toBeInTheDocument()
  })
})
