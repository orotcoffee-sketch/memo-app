---
name: tdd-red
description: docs/features/tag/scenarios-<번호>.md 의 시나리오를 Vitest 테스트로 바꾸고, 구현 파일은 본문이 throw new Error('not implemented') 인 껍데기만 만든 뒤, 모든 테스트가 "not implemented" 때문에 실패하는지(Red) 확인한다. "TDD Red", "실패하는 테스트 먼저", "시나리오를 테스트로" 요청 시 사용.
argument-hint: <이슈 번호>
---

# tdd-red

TDD의 Red 단계다. 시나리오를 실패하는 테스트로 만들고, 그 실패가 올바른 이유(`not implemented`)인지 확인한다. **구현 코드는 절대 작성하지 않는다.**

인자(`$ARGUMENTS`)가 숫자가 아니거나 `docs/features/tag/scenarios-$ARGUMENTS.md` 가 없으면 사용자에게 알리고 멈춘다.

## 절차

1. **시나리오를 테스트로 변환** — `docs/features/tag/scenarios-$ARGUMENTS.md` 를 읽고 `[정상]`, `[경계]`, `[예외]` 시나리오를 Vitest 테스트로 바꾼다.
   - 시나리오 하나가 `it` 하나다. `it` 이름은 시나리오의 `함수명 should ... when ...` 문장을 그대로 쓴다.
   - 시그니처 표에 적힌 함수·파일 위치를 따른다.
   - 테스트 파일은 대상 파일과 같은 폴더에 `.test.ts(x)` 로 둔다. 파일은 200줄을 넘기지 않으므로 넘기면 나눈다.
   - 이미 같은 시나리오의 테스트가 있으면 중복해서 만들지 않는다.

2. **구현 파일은 껍데기만** — 시그니처 표의 함수가 아직 없을 때만, 시그니처(이름, 매개변수, 반환 타입)를 갖춘 파일을 만들고 본문은 아래 한 줄로 한다.

   ```ts
   throw new Error('not implemented')
   ```

   - React 컴포넌트도 같다. 컴포넌트 본문을 `throw new Error('not implemented')` 로 둔다.
   - 이미 구현된 함수는 건드리지 않는다. 이미 구현돼 있어서 테스트가 통과하는 시나리오는 Red가 될 수 없으므로 결과 보고에서 따로 표시한다.

3. **구현 코드는 절대 작성 금지** — 로직, 분기, 반환값, JSX, 스타일을 쓰지 않는다. 테스트를 통과시키려는 어떤 수정도 이 스킬의 범위 밖이다. Green은 다음 단계에서 한다.

4. **실행하고 실패 이유를 확인** — 감시 모드에 걸리지 않도록 아래로 실행한다. (`npm test` 는 `vitest` 감시 모드다.)

   ```bash
   npm test -- --run
   ```

   모든 새 테스트가 **`not implemented` 때문에** 실패해야 한다. 실패 메시지를 읽고 분류한다.
   - **실패(Red, 정상)**: 메시지가 `not implemented` 다.
   - **고장(broken)**: `Cannot find module`, `is not a function`, 문법·타입 오류, 잘못된 import, 쿼리 대상이 없는 `Unable to find` 등. 이는 실패가 아니라 고장이므로 **고친다.** 테스트의 import 경로, 껍데기 파일의 export 이름·위치, 시그니처를 바로잡고 다시 실행한다. 고장이 없어질 때까지 반복한다.
   - **통과**: 이미 구현된 동작이다. 껍데기를 만든 함수에서는 통과하면 안 된다. 원인을 확인한다.

   `npx tsc -b` 와 `npm run lint` 도 실행해 껍데기와 테스트가 타입·린트 오류 없이 컴파일되는지 확인한다.

5. **React 컴포넌트 테스트 작성 규칙**
   - 요소 조회는 `getByRole` 을 우선하고, 역할로 찾기 어려울 때만 `getByText` 를 쓴다. (`getByTestId` 는 마지막 수단이다.)
   - 컴포넌트 내부 state, ref, 훅의 반환값을 검사하지 않는다. 화면에 보이는 결과와 접근성 속성(`aria-pressed` 등)만 확인한다.
   - 사용자 동작은 `@testing-library/user-event` 로 재현한다.

6. **보고** — 아래를 짧게 알린다.
   - 만든 테스트 파일과 껍데기 파일
   - 테스트 개수, `not implemented` 로 실패한 개수
   - 고장을 고친 내용
   - 이미 통과해서 Red가 아닌 시나리오 목록

## 주의

- 커밋은 하지 않는다. 사용자가 요청할 때만 한다.
- `not implemented` 이외의 이유로 실패하는 테스트를 "Red 완료"로 보고하지 않는다.
