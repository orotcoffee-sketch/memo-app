Playwright 설치하고 (npm init playwright@latest, 기본값으로)
.claude/skills/e2e-write/SKILL.md 스킬 만들어줘.

절차 : 
1. prd.md 에 있는 사용자 이야기를 읽고, 정상 흐름만 하나의 여정으로 시나리오 작성
2. 예외/경계는 단위 테스트 담당이기 때문에 넣지 않는다.
3. 셀렉터 : getByRole > getByText > getByPlaceholder > getByTestId(최후)
4. beforeEach 에서 localStorage를 비워서 테스트 끼리 섞이지 않게
5. playwright.onfig 의 webServer 로 개발 서버 자동실행
6. npm run test:e2e 실행