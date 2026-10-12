.github/workflows/ci.yml을 만들어줘.
main으로 가는 PR마다 ubuntu 에서: 
npm ci -> npm run lint -> npx tsc -- noEmit ->
npm audit --audit-level=moderate -> npm test 