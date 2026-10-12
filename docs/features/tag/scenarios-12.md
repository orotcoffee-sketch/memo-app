# 이슈 #12 테스트 시나리오: 메모를 고쳐서 필터 태그가 없어지면 필터가 완전히 풀린다

근거: GitHub 이슈 #12의 완료 체크리스트 (C1~C4)

## 함수 시그니처

새 컴포넌트와 props 변경은 없고, `App.tsx`의 저장 처리만 바뀐다.

| 함수 | 위치 | 입력 | 출력 | 이번에 바뀌는 점 |
|---|---|---|---|---|
| `handleSaveEdit` (기존) | `src/App.tsx` 내부 | `id: string`, `nextText: string` | 없음 | 저장한 뒤 남은 메모 중에 선택된 태그(`selectedTag`)가 달린 메모가 하나도 없으면 `selectedTag`를 `null`로 되돌린다. 있으면 그대로 둔다. 기존 동작(`updateMemoText`로 갱신, `editingId`를 `null`로)은 그대로다 |
| `handleDeleteMemo` (기존) | `src/App.tsx` 내부 | `id: string` | 없음 | 변경 없음. 같은 규칙을 이미 따른다 |
| `updateMemoText` (기존) | `src/utils/updateMemoText.ts` | `memos: Memo[]`, `id: string`, `text: string` | `Memo[]` | 변경 없음. 빈 값이나 없는 `id`면 같은 `memos`를 돌려주므로 이때 `selectedTag`는 바뀌지 않는다 |

- 입력 길이의 최댓값은 정하지 않는다(제한 없음). 그래서 최대 −1 / 최대 / 최대+1 경계는 해당 없다.
- "필터 태그의 메모가 남아 있지 않으면 `selectedTag`를 해제한다"는 규칙이 삭제 경로와 편집 경로 두 곳에 필요해진다. 중복은 `/tdd-refactor`에서 공용 헬퍼로 묶는 것을 검토한다.
- 현재 `activeTag`는 파생값이라 화면은 맞게 보이지만, `selectedTag` 상태에 값이 남아 이후 같은 태그의 메모를 추가하면 필터가 저절로 다시 켜진다. 같은 원인으로 새 칩을 한 번 누르면 토글(`prev === tag ? null : tag`)이 필터를 켜는 대신 끄려고 해서 첫 클릭이 먹히지 않는다.
- **`/tdd-red` 예상:** 실패가 예상되는 것은 N4, N5뿐이고 나머지는 이미 통과하는 회귀 방지 항목이다.

## 시나리오

### [정상]

- N1. `App` should show every memo when the only memo of the filtered tag is edited and saved without that tag (C1)
- N2. `App` should show the count of all memos when the only memo of the filtered tag is edited and saved without that tag (C1)
- N3. `App` should leave no chip pressed when the only memo of the filtered tag is edited and saved without that tag (C1)
- N4. `App` should show every memo and not turn the filter on again when a memo with the same tag is added after the tag was removed by editing (C2)
- N5. `App` should turn the filter on with a single click on the chip of the same tag when a memo with that tag is added after the tag was removed by editing (C2)
- N6. `App` should keep the filter and show only the remaining memo of the tag when one of two memos with the filtered tag is edited and saved without that tag (C3)
- N7. `App` should show the count of the remaining memo when one of two memos with the filtered tag is edited and saved without that tag (C3)
- N8. `App` should keep the filter when a memo with the filtered tag is edited and saved with the tag still in the text (C4)
- N9. `App` should show the edited text in the filtered list when a memo with the filtered tag is edited and saved with the tag still in the text (C4)

### [경계]

- B1. `App` should show every memo when the only memo of the filtered tag is edited so that it has a different tag instead (C1)
- B2. `App` should keep the filter when the edit is saved with an empty value (C4)
- B3. `App` should keep the filter when the edited text changes the tag only in letter case (C4)

### [예외]

- 해당 없음.

## 체크리스트 대조표

| C | 체크리스트 항목 | 시나리오 |
|---|---|---|
| C1 | 필터가 켜진 태그의 유일한 메모를 고쳐서 그 태그를 지우면 필터가 풀리고 전체 메모가 보인다 | N1, N2, N3, B1 |
| C2 | 위 상태에서 같은 태그가 달린 메모를 새로 추가해도 필터가 다시 켜지지 않고 전체 메모가 보인다 | N4, N5 |
| C3 | 필터가 켜진 태그의 메모가 둘 이상일 때 하나만 고쳐서 그 태그를 지우면 필터는 유지되고 남은 메모만 보인다 | N6, N7 |
| C4 | 필터가 켜진 태그의 메모를 고쳐도 그 태그가 그대로 남으면 필터는 유지된다 | N8, N9, B2, B3 |
