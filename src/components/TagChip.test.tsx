import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagChip } from './TagChip'

describe('TagChip', () => {
  it('#태그 형태로 보여 준다', () => {
    render(<TagChip tag="업무" active={false} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: '#업무' })).toBeInTheDocument()
  })

  it('클릭하면 태그를 넘겨 onClick을 호출한다', async () => {
    const onClick = vi.fn()
    render(<TagChip tag="업무" active={false} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button', { name: '#업무' }))
    expect(onClick).toHaveBeenCalledWith('업무')
  })

  it('active이면 aria-pressed가 true다', () => {
    render(<TagChip tag="업무" active onClick={() => {}} />)
    expect(screen.getByRole('button', { name: '#업무' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
