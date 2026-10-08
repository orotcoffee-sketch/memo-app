import { parseTags } from './parseTags'

describe('parseTags', () => {
  it('본문에서 #태그를 추출한다', () => {
    expect(parseTags('오늘 할 일 #업무 #todo_1')).toEqual(['업무', 'todo_1'])
  })

  it('태그가 없으면 빈 배열을 돌려준다', () => {
    expect(parseTags('태그 없는 메모')).toEqual([])
  })

  it('허용되지 않은 문자에서 태그가 끝난다', () => {
    expect(parseTags('#a-b #끝.')).toEqual(['a', '끝'])
  })

  it('대소문자를 무시하고 중복을 제거한다', () => {
    expect(parseTags('#Work #work #WORK')).toEqual(['work'])
  })

  it('# 뒤에 문자가 없으면 태그가 아니다', () => {
    expect(parseTags('# 공백 # ')).toEqual([])
  })

  it('빈 문자열이면 빈 배열을 돌려준다', () => {
    expect(parseTags('')).toEqual([])
  })

  it('#만 있으면 빈 배열을 돌려준다', () => {
    expect(parseTags('#')).toEqual([])
  })

  it('#! 처럼 허용되지 않는 문자가 바로 오면 태그가 아니다', () => {
    expect(parseTags('#!')).toEqual([])
  })

  it('한 글자 태그도 추출한다', () => {
    expect(parseTags('#a #가')).toEqual(['a', '가'])
  })

  it('_는 태그에 포함되고 -는 포함되지 않는다', () => {
    expect(parseTags('#a_b #c-d')).toEqual(['a_b', 'c'])
  })

  it('이모지만 오면 던지지 않고 빈 배열을 돌려준다', () => {
    expect(parseTags('#😀')).toEqual([])
  })
})
