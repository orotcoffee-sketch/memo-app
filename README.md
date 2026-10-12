# 메모앱

React 19 + TypeScript + Vite + Tailwind CSS v4 로 만든 작은 한글 메모 앱이다. 메모 추가·삭제·인라인 수정, `#태그` 칩, 태그 필터를 지원하고 데이터는 `localStorage` 의 `memos` 키에 저장한다.

## 시작하기

```bash
npm ci
npm run dev
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | Vite 개발 서버 |
| `npm run build` | 타입 검사(`tsc -b`) 후 빌드 |
| `npm run lint` | Oxlint |
| `npm test` | Vitest (감시 모드). 한 번만 돌리려면 `npm test -- --run` |
| `npm run test:e2e` | Playwright E2E (개발 서버를 자동으로 띄운다) |

코딩 규칙, 커밋 규칙, 아키텍처는 [`CLAUDE.md`](./CLAUDE.md) 에 있다.

## 작업 흐름

기능 하나는 **기획 → 이슈 → 구현(TDD) → PR → 병합** 순서로 진행한다. 정해진 순서를 따르는 일은 **스킬**, 독립적인 판단은 **에이전트**가 맡는다.

```
/feature-planner <기능>          기획: 스펙 → PRD → 이슈 등록
        │
        ▼
/tdd-loop <이슈번호>             이슈 하나를 구현
   0. 브랜치 생성  feat/<기능>-<번호>
   1. /test-scenarios            시그니처·시나리오·대조표 (사람 승인 3번)
   2. /tdd-red                   실패하는 테스트 먼저
   3. /tdd-green                 최소 구현으로 통과
   4. @ac-verifier               이슈 체크리스트 충족 여부 독립 검증
   5. /tdd-refactor              동작은 그대로, 구조만 개선
   6. /security-review           보안 점검
   7. /create-pr                 E2E 통과 후 push, PR 생성 (Closes #번호)
        │
        ▼
CI 통과 확인 → 병합(merge commit) → 브랜치 정리
```

### 1. 기획 — `/feature-planner <기능>`

`docs/features/<기능>/` 에 문서를 만들고 GitHub 이슈까지 등록한다. 사람이 판단할 곳에서는 반드시 멈추고 묻는다.

1. `spec-original.md` 작성 (없으면 초안 → 승인)
2. 한 번에 하나씩 인터뷰(추천 답 포함) → `spec-fixed.md`
3. `prd.md` 작성 (개요 / 사용자 이야기 / 기술 결정 / 안 만들 것 / 용어)
   - 기술 결정은 3안을 표로 비교 → **[멈춤] 사람이 고름** → 상황·대안·결정·결과로 기록
4. **[멈춤]** "안 만들 것" 목록 확인
5. 이슈 분해: 하나만 끝내도 사용자가 화면에서 볼 수 있게, 체크리스트는 "~일 때 / ~하면 / ~된다" 형식
6. **[멈춤]** 이슈 목록 확인 후 `gh issue create` 로 등록

### 2. 구현 — `/tdd-loop <이슈번호>`

위 0~7단계를 순서대로 실행한다. 각 단계의 사람 승인 질문은 건너뛰지 않고, 멈추면 어느 단계에서 멈췄는지 `진행 상황: n/7` 로 보고한다.

- 시그니처와 시나리오는 **반드시 사람이 승인**한다.
- 테스트 이름은 `함수명 should ... when ...` 형식이고, 시나리오 하나가 `it` 하나다.
- Red 단계에서 이미 통과하는 테스트는 따로 표시한다(회귀 방지용).
- E2E 가 실패하면 PR 을 만들지 않는다. **E2E 테스트 코드를 고쳐서 통과시키지 않는다.** `npx playwright show-report` 로 실패 지점을 확인 → 단위 테스트 추가 → 코드 수정 순서로 고친다.

### 3. PR 과 병합

- PR 은 기본 브랜치 `master` 로 보내고 본문에 `Closes #번호` 를 넣는다.
- PR 마다 CI(`.github/workflows/ci.yml`)가 `npm ci` → `npm run lint` → `npx tsc -b` → `npm audit --audit-level=moderate` → `npm test -- --run` 을 실행한다.
- CI 통과를 확인한 뒤 merge commit 으로 병합하고, 병합된 로컬·원격 브랜치는 지운다.

## 스킬과 에이전트

| 이름 | 종류 | 역할 |
|---|---|---|
| `feature-planner` | 스킬 | 스펙 인터뷰 → PRD → 이슈 분해·등록 |
| `tdd-loop` | 스킬 | 이슈 하나를 TDD 사이클 전체로 구현 |
| `test-scenarios` | 스킬 | 이슈 체크리스트 → 시그니처·시나리오·대조표 |
| `tdd-red` | 스킬 | 시나리오 → 실패하는 Vitest 테스트 |
| `tdd-green` | 스킬 | 테스트 하나씩 최소 구현, 매번 전체 테스트 실행 |
| `tdd-refactor` | 스킬 | 중복/이름/함수 책임/매직넘버/CLAUDE.md 규칙을 한 번에 하나씩 개선 |
| `ac-verifier` | 에이전트 | 이슈 체크리스트를 코드와 테스트가 만족하는지 독립 판단 (코드 수정 안 함) |
| `create-pr` | 스킬 | E2E 통과 시에만 push + PR 생성 |
| `e2e-write` | 스킬 | PRD 사용자 이야기 → Playwright E2E 여정 |
| `mermaid-diagram` | 스킬 | `src/` import 관계를 `docs/architecture/index.html` 에 그림 |

스킬 정의는 `.claude/skills/<이름>/SKILL.md`, 에이전트는 `.claude/agents/` 에 있다.

## 문서 구조

```
docs/
├── architecture/index.html          import 관계도
└── features/<기능>/
    ├── spec-original.md             처음 요구사항 (한두 줄)
    ├── spec-fixed.md                인터뷰로 확정한 스펙
    ├── prd.md                       PRD (기술 결정 포함)
    └── scenarios-<이슈번호>.md      이슈별 테스트 시나리오와 체크리스트 대조표
```

기능별 문서는 현재 `docs/features/tag/`(태그 칩, 필터)와 `docs/features/memo-edit/`(인라인 수정)가 있다.

## 커밋 규칙

`타입(범위): 설명` 형식이고 타입은 `feat` / `fix` / `test` / `refactor` / `chore` / `docs` 중 하나다. 커밋할 때 husky 가 변경된 파일에 Oxlint 를 돌리고, commitlint(Conventional Commits)가 메시지를 검사한다. 제목이 영문 대문자로 시작하면 `subject-case` 규칙에 걸리므로 한글로 시작하거나 소문자로 쓴다.
