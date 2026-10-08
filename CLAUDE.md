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
