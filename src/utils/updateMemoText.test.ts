import type { Memo } from '../types'
import { updateMemoText } from './updateMemoText'

const memos: Memo[] = [
  { id: 'a', text: '첫째', createdAt: 1 },
  { id: 'b', text: '둘째', createdAt: 2 },
  { id: 'c', text: '셋째', createdAt: 3 },
]

describe('updateMemoText', () => {
  // [정상]
  it('updateMemoText should replace the text of the memo with the given id when the new text is not empty', () => {
    const result = updateMemoText(memos, 'b', '고친 둘째')
    expect(result.find((m) => m.id === 'b')?.text).toBe('고친 둘째')
  })

  it('updateMemoText should trim leading and trailing whitespace when saving the new text', () => {
    const result = updateMemoText(memos, 'b', '  고친 둘째  ')
    expect(result[1].text).toBe('고친 둘째')
  })

  it("updateMemoText should keep the memo's position in the list when its text is replaced", () => {
    const result = updateMemoText(memos, 'b', '고친 둘째')
    expect(result.map((m) => m.id)).toEqual(['a', 'b', 'c'])
  })

  it("updateMemoText should keep the memo's id and createdAt when its text is replaced", () => {
    const result = updateMemoText(memos, 'b', '고친 둘째')
    expect(result[1].id).toBe('b')
    expect(result[1].createdAt).toBe(2)
  })

  it('updateMemoText should leave the other memos unchanged when one memo is replaced', () => {
    const result = updateMemoText(memos, 'b', '고친 둘째')
    expect(result[0]).toEqual(memos[0])
    expect(result[2]).toEqual(memos[2])
  })

  // [경계]
  it('updateMemoText should save the text when it is exactly one character long', () => {
    const result = updateMemoText(memos, 'b', '가')
    expect(result[1].text).toBe('가')
  })

  it('updateMemoText should return the same memos when the text is whitespace only', () => {
    expect(updateMemoText(memos, 'b', '   ')).toBe(memos)
  })

  it('updateMemoText should return the same memos when the text is an empty string', () => {
    expect(updateMemoText(memos, 'b', '')).toBe(memos)
  })

  // [예외]
  it('updateMemoText should return the same memos when no memo has the given id', () => {
    expect(updateMemoText(memos, 'zzz', '고침')).toBe(memos)
  })

  it('updateMemoText should not mutate the original memos array when a memo is replaced', () => {
    const snapshot = structuredClone(memos)
    updateMemoText(memos, 'b', '고친 둘째')
    expect(memos).toEqual(snapshot)
  })
})
