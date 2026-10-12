# 이슈 #5 테스트 시나리오: 편집을 취소하거나, 바깥을 클릭해 저장하거나, 비운 채로 저장해도 안전하다

근거: GitHub 이슈 #5의 완료 체크리스트 (C1~C4)

## 함수 시그니처

새 함수는 없다. #4에서 만든 것을 재사용하고 `MemoItem`의 동작만 늘린다.

| 함수 | 위치 | 입력 | 출력 | 이번에 바뀌는 점 |
|---|---|---|---|---|
| `MemoItem` (기존) | `src/components/MemoItem.tsx` | props 변경 없음 (`onCancelEdit`은 이미 있음) | JSX | 편집 중 **Esc**를 누르면 `onCancelEdit()`을 호출한다. 입력창이 **포커스를 잃으면(blur)** `onSaveEdit(memo.id, 입력값)`을 호출한다. Enter 또는 Esc로 편집이 끝난 직후의 blur로는 **중복 호출하지 않는다** |
| `handleSaveEdit` (기존) | `src/App.tsx` 내부 | `id: string`, `nextText: string` | 없음 | 변경 없음. `updateMemoText`가 빈 값이면 같은 `memos`를 돌려주고, 이어서 `editingId`를 `null`로 하므로 빈 값 저장 시 "원래 내용 유지 + 편집 종료"가 이미 된다 |
| `handleCancelEdit` (기존) | `src/App.tsx` 내부 | 없음 | 없음 | 변경 없음. `editingId`를 `null`로 한다 |
| `updateMemoText` (기존) | `src/utils/updateMemoText.ts` | `memos: Memo[]`, `id: string`, `text: string` | `Memo[]` | 변경 없음. 공백만이거나 빈 문자열이면 같은 `memos`를 돌려준다 |

- 입력 길이의 최댓값은 정하지 않는다(제한 없음, #4에서 확정). 그래서 최대 −1 / 최대 / 최대+1 경계는 해당 없다.
- 구현 전에도 통과할 가능성이 있는 시나리오(4, 9, 10, 13, 15)는 회귀 방지용이다. `/tdd-red`에서 "이미 통과"로 따로 표시한다.

## 시나리오

### [정상]

- N1. `MemoItem` should call onCancelEdit when Escape is pressed while editing (C1)
- N2. `MemoItem` should not call onSaveEdit when Escape is pressed while editing (C1)
- N3. `MemoItem` should call onSaveEdit with the memo id and the typed value when the input loses focus (C2)
- N4. `MemoItem` should call onSaveEdit with an empty string when the input is cleared and Enter is pressed (C3)
- N5. `App` should hide the input and show the original text when Escape is pressed after typing a new value (C1)
- N6. `App` should keep the original text in localStorage when Escape is pressed after typing a new value (C1)
- N7. `App` should show the edited text and no input when the user clicks outside the input after typing a new value (C2)
- N8. `App` should keep the edited text in localStorage when the user clicks outside the input after typing a new value (C2)
- N9. `App` should hide the input and keep the original text and the memo count when the input is cleared and Enter is pressed (C3)
- N10. `App` should keep the original text in localStorage when the input is cleared and Enter is pressed (C3)
- N11. `App` should hide the input and show the original text when only whitespace is typed and the user clicks outside the input (C4)
- N12. `App` should keep the original text in localStorage when only whitespace is typed and the user clicks outside the input (C4)

### [경계]

- B1. `MemoItem` should call onSaveEdit only once when Enter is pressed and the input then loses focus (C2, 중복 호출 방지)
- B2. `MemoItem` should not call onSaveEdit when Escape is pressed and the input then loses focus (C1, 취소 무효화 방지)
- B3. `MemoItem` should not call onCancelEdit when a key other than Escape is pressed (C1)

### [예외]

- 해당 없음. 빈 값과 공백만 있는 값은 N4, N9~N12에서 다룬다.

## 체크리스트 대조표

| C | 체크리스트 항목 | 시나리오 |
|---|---|---|
| C1 | 편집 중에 Esc를 누르면 입력창이 사라지고 메모는 원래 내용 그대로다 | N1, N2, N5, N6, B2, B3 |
| C2 | 편집 중에 입력창 밖을 클릭하면 고친 내용이 저장되고 입력창이 사라진다 | N3, N7, N8, B1 |
| C3 | 내용을 모두 지우고 Enter를 누르면 저장되지 않고 메모는 원래 내용 그대로이며 입력창이 사라진다 | N4, N9, N10 |
| C4 | 공백만 입력하고 입력창 밖을 클릭해도 저장되지 않고 메모는 원래 내용 그대로다 | N11, N12 |

B1과 B2는 체크리스트에 직접 적힌 문장이 아니라 각각 C2, C1이 제대로 동작하기 위한 보호 조건이다.
