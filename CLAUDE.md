# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then build with Vite
- `npm run lint` — Oxlint (config in `.oxlintrc.json`)
- `npm test` — Vitest in watch mode (jsdom, globals enabled, setup in `src/setupTests.ts`)
- Single test: `npx vitest run path/to/file.test.tsx` or `npx vitest run -t "test name"`

## Architecture

A small Korean-language memo app: React 19 + TypeScript + Vite, styled with Tailwind CSS v4 (via the `@tailwindcss/vite` plugin, no separate Tailwind config).

- All state lives in `src/App.tsx`: the `Memo` type, the `memos` list, and persistence. Memos are persisted to `localStorage` under the key `memos` (loaded via a lazy `useState` initializer, written back in a `useEffect`).
- `src/components/` holds small presentational components that receive data via props; they don't touch storage or own memo state.
- Tests use Vitest with Testing Library (`@testing-library/react`, `user-event`, `jest-dom`).

## 코딩 규칙

- 컴포넌트는 **named export**만 사용 (`export default` 금지). (`src/App.tsx`의 `App`은 이 규칙 이전에 작성되어 아직 default export)
- 이벤트 함수 이름은 `handle`로 시작 (`handleClick`, `handleSubmit`)
- 파일 이름: 컴포넌트는 PascalCase, 그 외는 camelCase
- 테스트 파일은 대상 파일과 같은 폴더에 `.test.ts(x)` 이름으로 둠
- 파일은 200줄을 넘기지 않음

## 커밋 규칙

- 형식: `타입(범위): 설명`
- 타입: `feat` / `fix` / `test` / `refactor` / `chore` / `docs`
- 예시: `feat(tag): 노트에 태그 추가`
- 커밋 메시지는 commitlint(Conventional Commits)가 commit-msg 훅에서 검사함

## TDD 사이클

순서: `/test-scenarios` → `/tdd-red` → `/tdd-green` → `@ac-verifier` → `/tdd-refactor` → `/security-review` → PR

1. `/test-scenarios <이슈번호>` — 이슈 체크리스트로 함수 시그니처와 테스트 시나리오를 만든다.
2. `/tdd-red` — 시나리오를 실패하는 테스트로 바꾼다.
3. `/tdd-green` — 테스트를 통과시키는 최소 구현을 작성한다.
4. `@ac-verifier` — 이슈의 완료 체크리스트를 코드와 테스트가 만족하는지 검증한다.
5. `/tdd-refactor` — 동작은 바꾸지 않고 구조만 개선한다.
6. `/security-review` — 변경사항의 보안을 점검한다.
7. PR 생성

주의:
- **함수 시그니처와 테스트 시나리오는 반드시 사람이 승인한다.** 승인 전에는 다음 단계로 넘어가지 않는다.
- **절차는 스킬, 판단은 에이전트**가 맡는다. 정해진 순서를 따르는 일은 스킬, 충족 여부 같은 독립적인 판단은 에이전트(`ac-verifier`)가 한다.
