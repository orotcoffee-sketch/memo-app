# 이슈 #6 테스트 시나리오: 한 번에 한 메모만 편집된다

근거: GitHub 이슈 #6의 완료 체크리스트 (C1~C3)

## 함수 시그니처

새 함수도, props 변경도 없다. 기존 동작의 조합을 `App` 통합 테스트로 검증한다.

| 함수 | 위치 | 입력 | 출력 | 이번에 바뀌는 점 |
|---|---|---|---|---|
| `MemoItem` (기존) | `src/components/MemoItem.tsx` | props 변경 없음 | JSX | 변경 없음. A의 입력창이 blur로 `onSaveEdit`을 호출하고, B의 텍스트 더블클릭이 `onStartEdit`을 호출한다 |
| `handleSaveEdit` (기존) | `src/App.tsx` 내부 | `id: string`, `nextText: string` | 없음 | 변경 없음. 저장하면서 `editingId`를 `null`로 한다 |
| `onStartEdit` = `setEditingId` (기존) | `src/App.tsx` | `id: string` | 없음 | 변경 없음. `editingId`는 하나뿐(`string \| null`)이라 새 메모를 편집하면 이전 편집은 자동으로 끝난다 |

- 입력 길이의 최댓값은 정하지 않는다(제한 없음). 그래서 최대 −1 / 최대 / 최대+1 경계는 해당 없다.
- "편집 입력창이 하나"는 `textbox` 전체가 2개(메모 추가 입력창 1개 + 편집 입력창 1개)인 것으로 확인한다.
- 구현 없이 이미 통과할 가능성이 높다. `/tdd-red`에서 "이미 통과"로 따로 표시하고, 회귀 방지 테스트로 남긴다.

## 시나리오

### [정상]

- N1. `App` should show the edited text of memo A when memo B's text is double-clicked while memo A is being edited (C1)
- N2. `App` should keep the edited text of memo A in localStorage when memo B's text is double-clicked while memo A is being edited (C1)
- N3. `App` should hide the input of memo A when memo B's text is double-clicked while memo A is being edited (C1)
- N4. `App` should show an input filled with the current text of memo B when memo B's text is double-clicked while memo A is being edited (C2)
- N5. `App` should focus the input of memo B when memo B's text is double-clicked while memo A is being edited (C2)
- N6. `App` should save the edited text of memo B when Enter is pressed after switching from memo A (C2)
- N7. `App` should show exactly one edit input when memo B's text is double-clicked while memo A is being edited (C3)

### [경계]

- B1. `App` should keep the original text of memo A and open memo B for editing when the input of memo A is cleared and memo B is double-clicked (C1, C2)
- B2. `App` should keep the original text of memo A and open memo B for editing when the input of memo A has only whitespace and memo B is double-clicked (C1, C2)
- B3. `App` should keep both texts unchanged and open memo B for editing when memo A has no changes and memo B is double-clicked (C1, C2)
- B4. `App` should show the saved text of memo A in a single input when memo A is double-clicked again after switching to memo B (C2, C3)
- B5. `App` should save the edit when memo A is edited again after Escape and the user clicks outside the input (체크리스트 대응 없음, #5 회귀 방지)

### [예외]

- 해당 없음. 빈 값과 공백만 있는 값은 B1, B2에서 다룬다.

## 체크리스트 대조표

| C | 체크리스트 항목 | 시나리오 |
|---|---|---|
| C1 | 메모 A를 편집 중에 메모 B의 텍스트를 더블클릭하면 A에 고친 내용이 저장되고 입력창이 사라진다 | N1, N2, N3, B1, B2, B3 |
| C2 | 이때 B가 편집 모드로 바뀌어 입력창이 나타난다 | N4, N5, N6, B1, B2, B3, B4 |
| C3 | 어느 시점에도 입력창은 하나만 보인다 | N7, B4 |
| — | 체크리스트 대응 없음 (#5 회귀 방지) | B5 |

B1~B3은 C1과 C2를 함께, B4는 C2와 C3을 함께 검증한다.
