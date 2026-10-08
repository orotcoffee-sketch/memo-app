import { render, screen } from '@testing-library/react'
import { MemoCount } from './MemoCount'

describe('MemoCount', () => {
  it('메모 개수를 보여준다', () => {
    render(<MemoCount count={3} />)
    expect(screen.getByText('총 3개의 메모')).toBeInTheDocument()
  })

  it('메모가 없으면 0개를 보여준다', () => {
    render(<MemoCount count={0} />)
    expect(screen.getByText('총 0개의 메모')).toBeInTheDocument()
  })
})
