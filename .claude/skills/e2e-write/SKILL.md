---
name: e2e-write
description: PRD(prd.md)의 사용자 이야기를 읽고 정상 흐름만 하나의 여정으로 묶어 Playwright E2E 테스트를 작성하고 npm run test:e2e 로 실행한다. 예외·경계는 단위 테스트 몫이라 넣지 않는다. "E2E 작성", "e2e-write", "Playwright 테스트", "사용자 여정 테스트" 요청 시 사용.
argument-hint: [prd.md 경로 (기본: docs/features/tag/prd.md)]
---

# e2e-write

PRD의 사용자 이야기를 **정상 흐름 하나의 여정**으로 만들어 Playwright E2E 테스트로 작성한다. 인자(`$ARGUMENTS`)가 있으면 그 `prd.md`를, 없으면 `docs/features/tag/prd.md`를 읽는다.

## 규칙

- **정상 흐름만** 다룬다. 예외·경계(빈 입력, 중복 태그, 대소문자, 특수문자 등)는 단위 테스트 담당이므로 E2E에 넣지 않는다.
- 구현 코드(`src/`)는 수정하지 않는다. E2E가 실패하면 고치지 말고 원인을 보고한다.
- 파일은 `tests/` 에 camelCase 이름으로 둔다 (예: `tests/tagJourney.spec.ts`). 200줄을 넘기지 않는다.
- `tests/example.spec.ts` 같은 Playwright 기본 예제는 건드리지 않는다.

## 절차

1. **사용자 이야기 읽기** — `prd.md` 의 "사용자 이야기" 섹션과 "용어 정의"를 읽는다. 화면에 보이는 실제 문구는 `src/` 에서 확인한다(버튼 이름, placeholder 등).

2. **여정 시나리오 작성** — 사용자 이야기들을 시간 순서의 **하나의 여정**으로 이어 붙인다. 코드 전에 단계 목록으로 먼저 적어 사용자에게 보여 준다. (예: 메모 2개 추가 → 태그 칩 확인 → 칩 클릭으로 필터 → 개수가 목록과 일치 → 같은 칩 다시 클릭해 전체 복귀) 예외·경계 단계는 넣지 않는다.

3. **셀렉터 우선순위** — 위에서부터 가능한 것을 쓴다.
   1. `getByRole` (예: `getByRole('button', { name: '추가' })`)
   2. `getByText`
   3. `getByPlaceholder`
   4. `getByTestId` — **최후의 수단**. 위 셋으로 안 될 때만 쓰고, 그 경우 `src/` 에 `data-testid` 추가가 필요하다고 보고한다(직접 수정하지 않는다).

4. **테스트 격리** — `test.beforeEach` 에서 `localStorage` 를 비우고 다시 불러와 테스트끼리 섞이지 않게 한다.

   ```ts
   test.beforeEach(async ({ page }) => {
     await page.goto('/')
     await page.evaluate(() => localStorage.clear())
     await page.reload()
   })
   ```

5. **개발 서버** — `playwright.config.ts` 의 `webServer`(`npm run dev`, `http://localhost:5173`)가 서버를 자동으로 띄운다. 테스트 안에서 서버를 직접 실행하지 않고, `page.goto('/')` 처럼 `baseURL` 기준 경로만 쓴다. `webServer` 나 `baseURL` 설정이 없으면 추가한다.

6. **실행** — `npm run test:e2e` 를 실행한다. 감시 모드가 없으므로 그대로 돌리면 된다.
   - 통과 → 결과를 보고한다.
   - 실패 → 에러 메시지와 실패 단계를 보고한다. 셀렉터 문제면 우선순위에 맞게 고쳐 다시 실행한다. 앱 동작 문제로 보이면 테스트를 억지로 맞추지 말고 멈춰서 보고한다.

7. **보고** — 여정 단계 목록, 만든/바꾼 파일, 사용한 셀렉터 중 `getByTestId` 가 있었는지, 실행 결과를 짧게 알린다. 단위 테스트(`npm test -- --run`)가 영향받지 않았는지도 확인한다.

## 주의

- 커밋은 하지 않는다. 사용자가 요청할 때만 한다(형식: `test(범위): 설명`).
- `test-results/`, `playwright-report/` 는 `.gitignore` 대상이다.
