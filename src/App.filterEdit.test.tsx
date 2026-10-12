import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

type User = ReturnType<typeof userEvent.setup>

function renderApp(texts: string[]) {
  const memos = texts.map((text, i) => ({
    id: `memo-${i}`,
    text,
    createdAt: i,
  }))
  localStorage.setItem('memos', JSON.stringify(memos))
  render(<App />)
  return userEvent.setup()
}

async function clickChip(user: User, name: string) {
  await user.click(screen.getAllByRole('button', { name })[0])
}

async function editMemo(user: User, from: string, to: string) {
  await user.dblClick(screen.getByText(from))
  const input = screen.getByDisplayValue(from)
  await user.clear(input)
  await user.type(input, `${to}{Enter}`)
}

async function addMemo(user: User, text: string) {
  await user.type(screen.getByPlaceholderText('메모를 입력하세요'), text)
  await user.click(screen.getByRole('button', { name: '추가' }))
}

describe('App 편집과 태그 필터', () => {
  beforeEach(() => localStorage.clear())

  // [정상]
  it('App should show every memo when the only memo of the filtered tag is edited and saved without that tag', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 끝')
    expect(screen.getByText('회의 끝')).toBeInTheDocument()
    expect(screen.getByText('운동 #개인')).toBeInTheDocument()
  })

  it('App should show the count of all memos when the only memo of the filtered tag is edited and saved without that tag', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 끝')
    expect(screen.getByText('총 2개의 메모')).toBeInTheDocument()
  })

  it('App should leave no chip pressed when the only memo of the filtered tag is edited and saved without that tag', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 끝')
    expect(screen.getByRole('button', { name: '#개인' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('App should show every memo and not turn the filter on again when a memo with the same tag is added after the tag was removed by editing', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 끝')
    await addMemo(user, '새 #업무')
    expect(screen.getByText('운동 #개인')).toBeInTheDocument()
    expect(screen.getByText('총 3개의 메모')).toBeInTheDocument()
  })

  it('App should turn the filter on with a single click on the chip of the same tag when a memo with that tag is added after the tag was removed by editing', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 끝')
    await addMemo(user, '새 #업무')
    await clickChip(user, '#업무')
    expect(screen.queryByText('운동 #개인')).not.toBeInTheDocument()
    expect(screen.getByText('총 1개의 메모')).toBeInTheDocument()
  })

  it('App should keep the filter and show only the remaining memo of the tag when one of two memos with the filtered tag is edited and saved without that tag', async () => {
    const user = renderApp(['회의 #업무', '보고 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 끝')
    expect(screen.getByText('보고 #업무')).toBeInTheDocument()
    expect(screen.queryByText('회의 끝')).not.toBeInTheDocument()
    expect(screen.queryByText('운동 #개인')).not.toBeInTheDocument()
  })

  it('App should show the count of the remaining memo when one of two memos with the filtered tag is edited and saved without that tag', async () => {
    const user = renderApp(['회의 #업무', '보고 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 끝')
    expect(screen.getByText('총 1개의 메모')).toBeInTheDocument()
  })

  it('App should keep the filter when a memo with the filtered tag is edited and saved with the tag still in the text', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 수정 #업무')
    expect(screen.queryByText('운동 #개인')).not.toBeInTheDocument()
  })

  it('App should show the edited text in the filtered list when a memo with the filtered tag is edited and saved with the tag still in the text', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 수정 #업무')
    expect(screen.getByText('회의 수정 #업무')).toBeInTheDocument()
  })

  // [경계]
  it('App should show every memo when the only memo of the filtered tag is edited so that it has a different tag instead', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await editMemo(user, '회의 #업무', '회의 #개인')
    expect(screen.getByText('회의 #개인')).toBeInTheDocument()
    expect(screen.getByText('운동 #개인')).toBeInTheDocument()
    expect(screen.getByText('총 2개의 메모')).toBeInTheDocument()
  })

  it('App should keep the filter when the edit is saved with an empty value', async () => {
    const user = renderApp(['회의 #업무', '운동 #개인'])
    await clickChip(user, '#업무')
    await user.dblClick(screen.getByText('회의 #업무'))
    const input = screen.getByDisplayValue('회의 #업무')
    await user.clear(input)
    await user.type(input, '{Enter}')
    expect(screen.getByText('회의 #업무')).toBeInTheDocument()
    expect(screen.queryByText('운동 #개인')).not.toBeInTheDocument()
  })

  it('App should keep the filter when the edited text changes the tag only in letter case', async () => {
    const user = renderApp(['meet #Work', 'run #home'])
    await clickChip(user, '#work')
    await editMemo(user, 'meet #Work', 'meet #WORK')
    expect(screen.getByText('meet #WORK')).toBeInTheDocument()
    expect(screen.queryByText('run #home')).not.toBeInTheDocument()
  })
})
