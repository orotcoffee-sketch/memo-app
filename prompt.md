.claude/skills/tdd-red/SKILL.md 스킬을 만들어줘.
절차: 
1. scenarios-<번호>.md의 시나리오를 Vitest 테스트로 변환
2. 구현 파일은 함수 모양만 만들고 본문은 throw new Error('not implemented')
3. 구현코드는 절대 작성 금지 
4. npm test 실행 -> 모든 테스트가 "not implemented" 때문에 실패하는지 확인
 "cannot find module" 같은 에러가 뜨면 실패가 아니라 고장(broken) 이니 고친다.
 5. react 컴포넌트 테스트는 getByRole > getByText 우선, 내부 state 검사 금지