---
name: mermaid-diagram
description: src/ 의 컴포넌트·훅·유틸 파일을 수집하고 import 관계를 분석해 docs/architecture/index.html 에 Mermaid flowchart TD 로 그린 뒤 브라우저로 연다. "아키텍처 다이어그램", "import 관계도", "의존성 그래프" 요청 시 사용.
---

# mermaid-diagram

`src/` 의 구조를 Mermaid 다이어그램으로 시각화한다.

## 절차

1. **파일 수집** — Glob으로 `src/**/*.{ts,tsx}` 를 모은다. 테스트 파일(`*.test.ts(x)`)과 `setupTests.ts`, `*.d.ts` 는 제외한다. 각 파일을 아래처럼 분류한다.
   - 컴포넌트: `src/components/` 및 `src/App.tsx`, `src/main.tsx`
   - 훅: 파일 이름이 `use`로 시작하는 파일 (`src/hooks/` 등)
   - 유틸: `src/utils/`, `src/lib/` 및 위 어디에도 속하지 않는 나머지 모듈

2. **import 분석** — Grep으로 각 파일의 `import ... from '...'` 줄을 읽는다. 상대 경로(`./`, `../`)만 대상으로 하고, 확장자 없는 경로는 수집한 파일 목록과 매칭(`.ts`, `.tsx`, `/index.ts(x)`)해 실제 파일로 해석한다. `react` 같은 외부 패키지와 CSS 등 에셋 import는 무시한다. `import type` 도 관계에 포함한다.

3. **Mermaid 작성** — `flowchart TD` 로 작성한다.
   - 노드 ID는 파일 경로에서 영숫자만 남긴 값(예: `srccomponentsMemoCount`), 라벨은 파일명(확장자 제외).
   - 분류별로 `subgraph` 를 만든다 (`컴포넌트`, `훅`, `유틸`). 비어 있는 분류는 생략한다.
   - 화살표 방향은 `importer --> imported`.
   - 라벨에 한글·특수문자가 있으면 `A["라벨"]` 처럼 따옴표로 감싼다.

4. **HTML 생성** — `docs/architecture/index.html` 을 Write로 만든다(폴더는 Write가 생성). 아래 템플릿에 다이어그램을 넣는다. 이미 파일이 있으면 덮어쓴다.

   ```html
   <!doctype html>
   <html lang="ko">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>아키텍처 다이어그램</title>
     </head>
     <body>
       <h1>아키텍처 다이어그램</h1>
       <pre class="mermaid">
   flowchart TD
     ...
       </pre>
       <script type="module">
         import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.4.0/dist/mermaid.esm.min.mjs'
         mermaid.initialize({ startOnLoad: true })
       </script>
     </body>
   </html>
   ```

5. **브라우저로 열기** — PowerShell로 실행한다.

   ```powershell
   Start-Process "docs\architecture\index.html"
   ```

6. **보고** — 수집한 파일 수와 import 관계 수를 한 줄로 알려 준다. 어떤 import를 해석하지 못했다면 그 목록도 함께 알려 준다.

## 주의

- `src/` 의 소스 코드는 수정하지 않는다. 변경하는 파일은 `docs/architecture/index.html` 뿐이다.
- Mermaid 문법 오류가 의심되면 브라우저에서 확인하기 전에 노드 ID 중복, 따옴표 누락부터 점검한다.
- 순환 import가 있으면 다이어그램에 그대로 그리고 보고에 언급한다.
