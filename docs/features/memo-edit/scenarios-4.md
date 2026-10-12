# 이슈 #4 테스트 시나리오: 메모를 더블클릭해서 고치고 Enter로 저장한다

근거: GitHub 이슈 #4의 완료 체크리스트 (C1~C8)

## 함수 시그니처

| 함수 | 위치 | 입력 | 출력 | 에러 시 동작 |
|---|---|---|---|---|
| `updateMemoText` (신규) | `src/utils/updateMemoText.ts` | `memos: Memo[]`, `id: string`, `text: string` | `Memo[]`. `id`가 같은 메모의 `text`만 `trim()`한 값으로 바꾸고 위치·`id`·`createdAt`은 그대로 | 던지지 않는다. `trim()`한 값이 비었거나 `id`가 없으면 **같은 `memos`를 그대로** 돌려준다 |
| `MemoItem` (신규) | `src/components/MemoItem.tsx` | `memo: Memo`, `editing: boolean`, `activeTag: string \| null`, `onStartEdit(id)`, `onSaveEdit(id, text)`, `onCancelEdit()`, `onDelete(id)`, `onTagClick(tag)` | `editing`이 `false`면 텍스트·태그 칩·`삭제` 버튼, `true`면 한 줄 입력창만 | 에러 메시지 없음 |
| `handleSaveEdit` (신규) | `src/App.tsx` 내부 | `id: string`, `text: string` | 없음. `updateMemoText`로 `memos`를 갱신하고 `editingId`를 `null`로 한다 | 에러 메시지 없음 |

- `Memo` 타입은 `src/types.ts`로 옮겨 export한다(구현 단계에서).
- 입력 길이의 최댓값은 **정하지 않는다(제한 없음)**. 그래서 최대 −1 / 최대 / 최대+1 경계는 해당 없고, 비어 있지 않은 최소 길이(1글자)와 최소 −1(공백만)을 경계로 다룬다.
- Esc 취소, 바깥 클릭 저장, 다른 메모 더블클릭 전환은 이슈 #5, #6의 범위다.

## 시나리오

### [정상]

- N1. `updateMemoText` should replace the text of the memo with the given id when the new text is not empty (C4)
- N2. `updateMemoText` should trim leading and trailing whitespace when saving the new text (C5)
- N3. `updateMemoText` should keep the memo's position in the list when its text is replaced (C6)
- N4. `updateMemoText` should keep the memo's id and createdAt when its text is replaced (C6)
- N5. `updateMemoText` should leave the other memos unchanged when one memo is replaced (C6)
- N6. `MemoItem` should show the text, the tag chips and the delete button when editing is false (C3의 반대 확인)
- N7. `MemoItem` should call onStartEdit with the memo id when the text is double-clicked (C1)
- N8. `MemoItem` should show a one-line input instead of the text when editing is true (C1)
- N9. `MemoItem` should fill the input with the current memo text when editing is true (C2)
- N10. `MemoItem` should focus the input when editing is true (C2)
- N11. `MemoItem` should hide the tag chips and the delete button when editing is true (C3)
- N12. `MemoItem` should call onSaveEdit with the memo id and the input value when Enter is pressed (C4)
- N13. `App` should show the edited text and no input when Enter is pressed after editing a memo (C4)
- N14. `App` should show the edited text without surrounding spaces when the saved text had spaces (C5)
- N15. `App` should keep the edited memo in the same list position after saving (C6)
- N16. `App` should keep the edited text in localStorage so it is shown again after reload (C7)
- N17. `App` should show tag chips that match the edited text when the `#태그` in the text is changed and saved (C8)

### [경계]

- B1. `updateMemoText` should save the text when it is exactly one character long (C4)
- B2. `updateMemoText` should return the same memos when the text is whitespace only (체크리스트 대응 없음, 이슈 #5와 겹침)
- B3. `updateMemoText` should return the same memos when the text is an empty string (체크리스트 대응 없음, 이슈 #5와 겹침)
- B4. `MemoItem` should not call onStartEdit when the text is clicked only once (C1)
- B5. `MemoItem` should not call onSaveEdit when a key other than Enter is pressed (C4)

### [예외]

- E1. `updateMemoText` should return the same memos when no memo has the given id (체크리스트 대응 없음)
- E2. `updateMemoText` should not mutate the original memos array when a memo is replaced (C6)

## 체크리스트 대조표

| C | 체크리스트 항목 | 시나리오 |
|---|---|---|
| C1 | 메모 텍스트를 더블클릭하면 텍스트 자리에 한 줄 입력창이 나타난다 | N7, N8, B4 |
| C2 | 입력창에는 메모의 현재 내용이 채워져 있고 커서가 들어가 있다(자동 포커스) | N9, N10 |
| C3 | 편집 중인 메모에서는 태그 칩과 `삭제` 버튼이 보이지 않는다 | N11, N6(반대 확인) |
| C4 | 내용을 고치고 Enter를 누르면 입력창이 사라지고 고친 내용이 메모에 표시된다 | N1, N12, N13, B1, B5 |
| C5 | 저장하면 앞뒤 공백은 제거되어 표시된다 | N2, N14 |
| C6 | 저장해도 메모가 목록의 같은 자리에 그대로 있다 | N3, N4, N5, N15, E2 |
| C7 | 저장한 뒤 페이지를 새로고침해도 고친 내용이 유지된다 | N16 |
| C8 | 본문의 `#태그`를 고쳐서 저장하면 메모 아래의 태그 칩도 그에 맞게 바뀐다 | N17 |
| — | 체크리스트 대응 없음 (시그니처 동작) | B2, B3, E1 |

C7은 `App` 통합 테스트에서 localStorage를 직접 확인한다. 실제 새로고침은 E2E의 몫이다.
