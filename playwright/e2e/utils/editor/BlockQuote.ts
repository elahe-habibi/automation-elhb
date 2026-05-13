import { expect, Locator, Page } from '@playwright/test';

/**
 * کلاس کمکی برای کار با دکمه «بلوک نقل قول» در ادیتور
 */
export class BlockQuote {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Locator دکمه «بلوک نقل قول» (هم در نوار ابزار اصلی و هم داخل منوی «گزینه‌های بیشتر»)
   */
  getBlockQuoteButton(): Locator {
    const frame = this.page.frameLocator('iframe');

    // اول تلاش با tooltip دقیق
    const byTooltip = frame.locator(
      'button.ck-button[data-cke-tooltip-text=" بلوک نقل قول"]',
    ).first();

    // سپس با متن برچسب دکمه
    const byText = frame
      .locator('button.ck-button')
      .filter({ hasText: ' بلوک نقل قول' })
      .first();

    // نهایتاً با نقش/نام دسترس‌پذیر
    const byRole = frame.getByRole('button', { name: ' بلوک نقل قول' }).first();

    return byTooltip.or(byText).or(byRole);
  }

  /**
   * کلیک روی دکمه «بلوک نقل قول» با رعایت بهترین پرکتیس‌ها
   */
  async clickBlockQuote(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // اطمینان از آماده بودن نوار ابزار ادیتور
    await expect(frame.locator('.ck-toolbar')).toBeVisible({ timeout: 10000 });

    // ابتدا دکمه را در نوار ابزار اصلی امتحان می‌کنیم
    let button = this.getBlockQuoteButton();
    if ((await button.count()) === 0 || !(await button.first().isVisible().catch(() => false))) {
      // اگر دیده نشد، منوی «گزینه‌های بیشتر» را باز می‌کنیم و دوباره جست‌وجو می‌کنیم
      await frame
        .locator(
          'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
        )
        .first()
        .click()
        .catch(() => {});

      // پس از باز شدن منو، مجدد locator را می‌سازیم تا داخل پنل باز نیز پوشش داده شود
      button = this.getBlockQuoteButton();
    }

    // اگر همچنان وجود ندارد، به‌صورت ایمن از متد خارج می‌شویم
    if ((await button.count()) === 0) {
      console.warn('Block Quote button not found in the editor toolbar.');
      return;
    }

    const target = button.first();
    await expect(target).toBeVisible({ timeout: 10000 });
    await target.scrollIntoViewIfNeeded();

    // کلیک پایدار
    await target.click({ trial: true }).catch(() => {});
    await target.click({ force: true });
  }
}


