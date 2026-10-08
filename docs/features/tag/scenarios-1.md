# 이슈 #1 테스트 시나리오: 메모에 태그 추가/삭제

근거: GitHub 이슈 #1의 완료 체크리스트 (C1~C5)

## 함수 시그니처

| 함수 | 위치 | 입력 | 출력 | 에러 시 동작 |
|---|---|---|---|---|
| `parseTags` (기존) | `src/utils/parseTags.ts` | `text: string` | `string[]` (소문자, 중복 제거, 등장 순서) | 에러 메시지 없음. 태그가 없으면 `[]`을 돌려주고 던지지 않는다 |
| `TagChip` (기존) | `src/components/TagChip.tsx` | `tag: string`, `active: boolean`, `onClick: (tag: string) => void` | `#태그` 텍스트의 버튼 | 에러 메시지 없음 |
| 메모 추가·삭제 (기존) | `src/App.tsx` | 입력창 텍스트, 삭제 버튼 클릭 | 목록과 칩 렌더링 | 공백뿐인 텍스트는 추가하지 않고 조용히 무시한다 |

입력에 최댓값은 정하지 않는다(길이·개수 제한 없음). 그래서 최대 −1 / 최대 / 최대+1 경계는 해당 없음이고, 이 함수의 실제 경계를 다룬다.

## 시나리오

### [정상]

- N1. `parseTags` should return `['업무']` when the text is `"#업무 회의"` (C1)
- N2. `App` should show a `#업무` chip below the memo when a memo containing `#업무` is added (C1)
- N3. `parseTags` should return `['work']` once when the text is `"#Work #work"` (C2)
- N4. `App` should show a single `#work` chip when a memo containing `#Work #work` is added (C2)
- N5. `parseTags` should return `['a']` when the text is `"#a-b"` (C3)
- N6. `App` should show only the `#a` chip when a memo containing `#a-b` is added (C3)
- N7. `App` should show no chip when a memo without `#` is added (C4)
- N8. `App` should remove the memo and its chips together when the delete button of a tagged memo is pressed (C5)

### [경계]

- B1. `parseTags` should return `[]` when the text is the empty string `""` (C4)
- B2. `parseTags` should return `[]` when the text is only `"#"` (C4)
- B3. `parseTags` should return `[]` when `#` is followed by a space or `!` (`"# 공백"`, `"#!"`) (C4)
- B4. `parseTags` should return `['a']` / `['가']` when the tag is one character (`"#a"`, `"#가"`) (C1)
- B5. `parseTags` should return `['a_b']` when the text is `"#a_b"`, since `_` is allowed and `-` is not (C3)

### [예외]

- E1. `App` should not add a memo and should show no chip when the input is only whitespace (C4)
- E2. `parseTags` should return `[]` without throwing when `#` is followed only by unsupported characters such as an emoji (`"#😀"`) (C4)

## 체크리스트 대조표

| 항목 | 내용 | 시나리오 |
|---|---|---|
| C1 | `#업무` 있는 메모 추가 → 칩 표시 | N1, N2, B4 |
| C2 | `#Work #work` → `#work` 칩 하나 | N3, N4 |
| C3 | `#a-b` → `#a` 칩만 | N5, N6, B5 |
| C4 | `#` 없는 메모 → 칩 없음 | N7, B1, B2, B3, E1, E2 |
| C5 | 태그 달린 메모 삭제 → 메모와 칩 함께 사라짐 | N8 |

모든 항목에 시나리오가 1개 이상 있다. 시나리오는 총 15개이다.
