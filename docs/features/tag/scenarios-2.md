# 이슈 #2 테스트 시나리오: 태그 클릭으로 메모 필터

근거: GitHub 이슈 #2의 완료 체크리스트 (C1~C5)

## 함수 시그니처

| 함수 | 위치 | 입력 | 출력 | 에러 시 동작 |
|---|---|---|---|---|
| `TagChip` (기존) | `src/components/TagChip.tsx` | `tag: string`, `active: boolean`, `onClick: (tag: string) => void` | `#태그` 텍스트의 버튼. `active`이면 `aria-pressed="true"`와 채워진 스타일 | 에러 메시지 없음 |
| `MemoCount` (기존) | `src/components/MemoCount.tsx` | `count: number` | `"총 {count}개의 메모"` 문장 | 에러 메시지 없음 |
| `parseTags` (기존) | `src/utils/parseTags.ts` | `text: string` | `string[]` (소문자, 중복 제거) | 던지지 않고 태그가 없으면 `[]` |
| `handleTagClick` (기존) | `src/App.tsx` 내부 | `tag: string` | 없음. 선택된 태그가 같으면 해제(`null`), 다르면 그 태그로 바꾼다 | 에러 메시지 없음 |
| 필터 목록 계산 (기존) | `src/App.tsx` 내부 | 메모 목록, 선택된 태그 | 보이는 메모 목록. 선택된 태그의 메모가 하나도 없으면 필터를 해제한 것으로 본다 | 에러 메시지 없음 |

입력에 최댓값은 정하지 않는다. 그래서 최대 −1 / 최대 / 최대+1 경계는 해당 없음이고, 필터의 실제 경계(메모가 2개→1개→0개로 줄어드는 순간 등)를 다룬다.

## 시나리오

### [정상]

- N1. `App` should show only the `#업무` memos when the `#업무` chip is clicked while `#업무` and `#개인` memos are mixed (C1)
- N2. `App` should show every memo again when the same chip is clicked a second time (C2)
- N3. `MemoCount` should show `"총 2개의 메모"` when the filter is on and 2 of 5 memos have the tag (C3)
- N4. `TagChip` should set `aria-pressed="true"` when `active` is true, and `"false"` otherwise (C4)
- N5. `App` should mark only the selected tag's chips as pressed and leave the other chips unpressed when the filter is on (C4)
- N6. `App` should switch the filter to the other tag when a different chip is clicked while the filter is on (C1)
- N7. `App` should clear the filter and show the remaining memos when all memos of the filtered tag are deleted (C5)

### [경계]

- B1. `App` should keep the filter and show the remaining tagged memo when one of two memos of the filtered tag is deleted (2→1) (C5)
- B2. `App` should clear the filter at the moment the last memo of the filtered tag is deleted (1→0) (C5)
- B3. `App` should treat `#Work` and `#work` as the same filter and show both memos when either chip is clicked (C1)
- B4. `App` should show a memo with several tags under each of its tags' filters (C1)

### [예외]

- E1. `App` should show the remaining memos that have no tags when the filtered tag's memos are all deleted (C5)
- E2. `App` should show `"메모가 없습니다."` when the last remaining memo is deleted while the filter is on (C5)
- E3. `TagChip` should call `onClick` with its tag on every click, whether `active` is true or false (C2)

## 체크리스트 대조표

| 항목 | 내용 | 시나리오 |
|---|---|---|
| C1 | `#업무` 칩 클릭 → `#업무` 메모만 보임 | N1, N6, B3, B4, E3 |
| C2 | 같은 칩 다시 클릭 → 필터 해제, 전체 메모 | N2, E3 |
| C3 | 필터 중 `MemoCount`에 필터 결과 개수 | N3 |
| C4 | 선택된 칩이 다른 칩과 구분됨 | N4, N5 |
| C5 | 필터된 태그의 메모를 모두 삭제 → 필터 해제, 남은 메모 보임 | N7, B1, B2, E1, E2 |

모든 항목에 시나리오가 1개 이상 있다. 시나리오는 총 14개이다.
