import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('태그 메모를 쓰고, 칩으로 필터링했다가 전체 목록으로 돌아온다', async ({
  page,
}) => {
  const input = page.getByPlaceholder('메모를 입력하세요')
  const addButton = page.getByRole('button', { name: '추가' })

  // 본문에 #태그만 써도 칩이 붙는다
  for (const text of ['회의록 정리 #업무', '장보기 #개인', '보고서 작성 #업무']) {
    await input.fill(text)
    await addButton.click()
  }
  await expect(page.getByText('총 3개의 메모')).toBeVisible()
  await expect(page.getByRole('button', { name: '#업무' })).toHaveCount(2)
  await expect(page.getByRole('button', { name: '#개인' })).toHaveCount(1)

  // 칩을 누르면 같은 태그의 메모만 보이고, 개수도 목록과 일치한다
  await page.getByRole('button', { name: '#업무' }).first().click()
  await expect(page.getByText('총 2개의 메모')).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(2)
  await expect(page.getByText('회의록 정리 #업무')).toBeVisible()
  await expect(page.getByText('보고서 작성 #업무')).toBeVisible()
  await expect(page.getByText('장보기 #개인')).toBeHidden()

  // 같은 칩을 다시 누르면 전체 목록으로 돌아온다
  await page.getByRole('button', { name: '#업무' }).first().click()
  await expect(page.getByText('총 3개의 메모')).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(3)
  await expect(page.getByText('장보기 #개인')).toBeVisible()
})
