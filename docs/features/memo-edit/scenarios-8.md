# 이슈 #8 테스트 시나리오: 한글 입력 조합 중 Enter를 눌러도 저장되지 않는다

근거: GitHub 이슈 #8의 완료 체크리스트 (C1~C3)

## 함수 시그니처

새 함수도 props 변경도 없다. `MemoItem`의 키 처리만 바뀐다.

| 함수 | 위치 | 입력 | 출력 | 이번에 바뀌는 점 |
|---|---|---|---|---|
| `MemoItem` (기존) | `src/components/MemoItem.tsx` | props 변경 없음 | JSX | 편집 중 입력창의 keydown 이벤트가 **IME 조합 중**이면 Enter와 Escape를 무시한다(`onSaveEdit`, `onCancelEdit` 호출 없음, 편집 상태 유지). 조합 중이 아니면 지금처럼 동작한다 |
| `handleKeyDown` (기존) | `src/components/MemoItem.tsx` 내부 | `e: KeyboardEvent<HTMLInputElement>` | 없음 | 조합 중 판정은 `e.nativeEvent.isComposing \|\| e.keyCode === 229`로 한다. 조합 중 키는 `finishedRef`도 건드리지 않아 이후 blur 저장이 막히지 않는다 |

- 입력 길이의 최댓값은 정하지 않는다(제한 없음). 그래서 최대 −1 / 최대 / 최대+1 경계는 해당 없다.
- `keyCode === 229`를 함께 보는 이유: 사파리는 조합 확정 직후 `isComposing`이 이미 `false`인 상태로 Enter keydown을 보내고 `keyCode`만 229로 남긴다.
- **한계:** `user-event`와 `jsdom`은 실제 한글 IME를 재현하지 못한다. 그래서 `fireEvent.keyDown`으로 조합 중 상태(`isComposing: true`, `keyCode: 229`)를 흉내 낸다. 실제 브라우저에서의 IME 동작은 이 테스트로 검증되지 않는다.

## 시나리오

### [정상]

- N1. `MemoItem` should not call onSaveEdit when Enter is pressed during IME composition (C1)
- N2. `MemoItem` should keep the input and its typed value when Enter is pressed during IME composition (C1)
- N3. `MemoItem` should call onSaveEdit with the memo id and the input value when Enter is pressed after the composition has ended (C2)
- N4. `MemoItem` should call onSaveEdit exactly once when Enter is pressed during composition and then pressed again after the composition has ended (C1, C2)
- N5. `MemoItem` should call onSaveEdit with the typed letters when Enter is pressed after typing English letters (C3)
- N6. `MemoItem` should call onSaveEdit with the typed digits when Enter is pressed after typing digits (C3)
- N7. `App` should keep the input open and the saved text unchanged when Enter is pressed during IME composition (C1)
- N8. `App` should show the typed text and no input when Enter is pressed after the composition has ended (C2)

### [경계]

- B1. `MemoItem` should not call onSaveEdit when the Enter keydown has keyCode 229 even if isComposing is false (C1)
- B2. `MemoItem` should still save the typed value when the input loses focus after Enter was ignored during composition (C1)
- B3. `MemoItem` should not call onCancelEdit when Escape is pressed during IME composition (체크리스트 대응 없음, 같은 유형의 버그 방지)

### [예외]

- 해당 없음.

## 체크리스트 대조표

| C | 체크리스트 항목 | 시나리오 |
|---|---|---|
| C1 | 한글을 조합하는 중에 Enter를 누르면 조합만 확정되고 메모는 저장되지 않으며 입력창이 그대로 남는다 | N1, N2, N4, N7, B1, B2 |
| C2 | 조합이 끝난 뒤 Enter를 다시 누르면 메모가 저장된다 | N3, N4, N8 |
| C3 | 영문·숫자를 입력하고 Enter를 누르면 지금처럼 바로 저장된다 | N5, N6 |
| — | 체크리스트 대응 없음 (조합 중 Esc 방지) | B3 |

N4는 C1과 C2를 함께 검증한다.
