---
name: create-pr
description: PR을 올릴 때 사용한다. 먼저 E2E 테스트(npm run test:e2e)를 돌려 통과해야만 git push 와 gh pr create 를 진행하고, 실패하면 PR 생성을 중단한다. 사용자가 "PR 올려줘", "PR 만들어줘", "풀 리퀘스트 생성", "푸시하고 PR" 처럼 PR 관련 말만 해도 이 스킬을 실행한다.
argument-hint: [이슈 번호]
---

# create-pr

E2E 테스트를 통과한 경우에만 push 하고 PR 을 만든다. 인자(`$ARGUMENTS`)는 이슈 번호이며, 없으면 브랜치 이름·커밋 메시지·최근 대화에서 찾아보고, 그래도 모르면 사용자에게 묻는다.

## 규칙

- **E2E 가 실패하면 PR 을 만들지 않는다.** push 도 하지 않는다.
- **E2E 테스트 코드(`tests/`)를 고쳐서 통과시키는 것은 금지**다. 테스트·설정·셀렉터·타임아웃을 건드리지 않는다. 실패는 앱이 사용자 여정을 못 지킨다는 신호다.
- PR 본문에는 반드시 `Closes #번호` 를 넣는다.
- `master`/`main` 에서 바로 push 하지 않는다. 현재 브랜치가 기본 브랜치면 먼저 새 브랜치를 만든다.
- force push 는 하지 않는다.

## 절차

1. **사전 확인** — `git status` 로 커밋 안 된 변경이 있는지 본다. 있으면 사용자에게 알리고, 커밋할지 묻는다(커밋 규칙: `타입(범위): 설명`).

2. **E2E 실행** — `npm run test:e2e` 를 실행한다.

3. **실패하면 중단** — push, PR 생성을 하지 않고 아래를 안내한 뒤 끝낸다.
   1. `npx playwright show-report` 로 실패 지점을 확인한다.
   2. 원인이 되는 동작에 대한 **단위 테스트를 추가**한다.
   3. **코드(`src/`)를 수정**해 단위 테스트와 E2E 가 통과하게 한다.

   E2E 테스트 코드를 고치는 방법은 안내하지 않는다. 실패한 테스트 이름과 에러 요약을 함께 알려 준다.

4. **통과하면 push** — `git push -u origin <현재 브랜치>` 를 실행한다.

5. **PR 생성** — `gh pr create` 로 만든다. base 는 저장소의 기본 브랜치(`gh repo view --json defaultBranchRef`)다. 제목은 커밋 규칙 형식, 본문에는 변경 요약과 `Closes #번호` 를 넣는다.

   ```
   gh pr create --base <기본 브랜치> --title "타입(범위): 설명" --body "$(cat <<'EOF'
   ## 변경 사항
   - ...

   Closes #번호

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

6. **보고** — PR 주소, E2E 결과(통과 개수), 연결한 이슈 번호를 짧게 알린다.

## 주의

- 이미 같은 브랜치의 PR 이 열려 있으면(`gh pr list --head <브랜치>`) 새로 만들지 말고 push 만 하고 기존 PR 주소를 알린다.
- 단위 테스트·lint·타입 검사는 CI 가 PR 에서 돌린다. 이 스킬은 E2E 만 게이트로 쓴다.
