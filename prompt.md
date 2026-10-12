.claude/skills/create-pr/SKILL.md 스킬을 만들어줘.

1. npm run test:e2e 실행. 실패하면 PR 생성을중단하고
"npx playwright show-report" 로 실패 지점 확인 -> 단위 테스트 추가 -> 코드 수정" 안내
E2E 테스트 코드를 고쳐서 통과시키는건 금지
2. 통과하면 git push -> gh pr create(본문에 Closes #번호)
사용자가 "PR 올려줘"라고만 말해도 이스킬이 실행되도록 description 을 써줘.