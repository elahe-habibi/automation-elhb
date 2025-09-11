import { Page, expect } from '@playwright/test';
import { URLs, getFullUrl } from '../../constants';
import { WaitUtils } from '../core/waitutils';

export class RepositoryUtils {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * ایجاد یک مخزن جدید با نام و توضیحات مشخص
   * @param name نام مخزن
   * @param description توضیحات مخزن
   * @param shouldComplete اگر true باشد، مخزن ایجاد می‌شود، در غیر این صورت فقط فرم پر می‌شود و انصراف داده می‌شود
   */
  async createRepository(
    name: string,
    description: string,
    shouldComplete: boolean = false,
  ) {
    try {
      // کلیک روی دکمه ایجاد مخزن جدید
      const createRepoButton = this.page.locator(
        'button:has-text("ایجاد مخزن جدید")',
      );
      await createRepoButton.waitFor({ state: 'visible', timeout: 12000 });
      await createRepoButton.click();

      // انتظار برای نمایش فرم و اطمینان از بارگذاری کامل
      await this.page.waitForSelector('#repo-name', {
        state: 'visible',
        timeout: 12000,
      });

      // پر کردن فرم با مدیریت خطا
      try {
        // پر کردن نام مخزن
        await this.page.locator('#repo-name').fill(name);

        // پر کردن توضیحات
        await this.page
          .locator('textarea[name="description"]')
          .fill(description);

        // اطمینان از اینکه دیالوگ باز است
        const stepperDialog = this.page.locator(
          'div[placeholder="stepper-dialog"]',
        );
        await expect(stepperDialog).toBeVisible();

        // کلیک روی دکمه ادامه
        const continueButton = this.page.locator(
          '.repo-create-dialog__create-button',
        );
        await continueButton.waitFor({ state: 'visible' });
        await continueButton.click({ force: true });

        // انتظار برای اطمینان از حرکت به مرحله بعد
        await this.page.waitForTimeout(3000);

        if (!shouldComplete) {
          // کلیک روی دکمه انصراف
          const cancelButton = this.page.locator('button:has-text("انصراف")');
          await cancelButton.click();
        }
      } catch (error) {
        console.error('Error in form submission:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in createRepository:', error);
      throw error;
    }
  }

  /**
   * ایجاد یک مخزن با نام یکتا (بر اساس تاریخ و زمان)
   * @param description توضیحات مخزن
   * @param shouldComplete اگر true باشد، مخزن ایجاد می‌شود، در غیر این صورت فقط فرم پر می‌شود و انصراف داده می‌شود
   * @returns نام یکتای مخزن ایجاد شده
   */
  async createRepositoryWithUniqueName(
    description: string,
    shouldComplete: boolean = false,
  ): Promise<string> {
    // ایجاد نام یکتا برای مخزن
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}`;
    const uniqueRepoName = `test-repo-${formattedDate}`;

    // ایجاد مخزن با نام یکتا
    await this.createRepository(uniqueRepoName, description, shouldComplete);

    return uniqueRepoName;
  }

  /**
   * اشتراک‌گذاری مخزن با کاربر دیگر
   * @param username نام کاربری که می‌خواهیم مخزن را با او به اشتراک بگذاریم
   */
  async shareRepository(username: string) {
    // وارد کردن نام کاربری در فیلد شناسه پادی
    await this.page.getByPlaceholder('شناسه پادی').fill(username);

    // کلیک روی دکمه دعوت
    await this.page.getByRole('button', { name: 'دعوت' }).click();

    // انتظار برای اطمینان از ایجاد تگ
    await this.page.waitForTimeout(3000);

    try {
      // تلاش برای یافتن توست موفقیت
      const toastSelector = '.toast-success';
      await this.page.waitForSelector(toastSelector, { timeout: 15000 });

      // اگر توست پیدا شد، محتوای آن را بررسی می‌کنیم
      const toastMessage = await this.page.locator(toastSelector).textContent();
      expect(toastMessage).toContain('کاربر با موفقیت به مخزن اضافه شد');

      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>> Toast message founded successfully.',
      );
    } catch (error) {
      // اگر توست پیدا نشد، به کار ادامه می‌دهیم
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>  Toast notification not found, proceeding with Continue button',
      );
    }

    // کلیک روی دکمه ادامه
    const continueButton = this.page.locator('button:has-text("ادامه")');
    await continueButton.waitFor({ state: 'visible' });
    await continueButton.click();
  }

  /**
   * وارد کردن شناسه پادی
   * @param podId شناسه پادی کاربر
   */
  async enterPodId(podId: string) {
    // انتظار برای نمایش فیلد شناسه پادی
    await this.page.waitForSelector(
      'input[id="username"][placeholder="شناسه پادی"]',
      { state: 'visible' },
    );

    // پاک کردن فیلد قبل از پر کردن
    await this.page
      .locator('input[id="username"][placeholder="شناسه پادی"]')
      .clear();

    // وارد کردن شناسه پادی با استفاده از متد type
    await this.page
      .locator('input[id="username"][placeholder="شناسه پادی"]')
      .type(podId, { delay: 100 });

    // اطمینان از اینکه مقدار وارد شده در فیلد نمایش داده می‌شود
    await expect(
      this.page.locator('input[id="username"][placeholder="شناسه پادی"]'),
    ).toHaveValue(podId);

    // اضافه کردن تاخیر کوتاه برای اطمینان از پر شدن فیلد
    await this.page.waitForTimeout(3000);
  }

  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const editButton = this.page.locator('.repo-menu__item--share');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();
    // کلیک روی دکمه "ویرایش"
    await editButton.click();

    await this.page.waitForTimeout(5000);

    const closeButton = this.page.locator('.close-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(closeButton).toBeVisible();

    // کلیک روی دکمه "بستن"
    await closeButton.click();

    await this.page.waitForTimeout(5000);
  }

  async LogOut(): Promise<void> {
    const menuButton = this.page.locator('.userProfile').nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(3000);

    const editButton = this.page.locator('.logout-button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(editButton).toBeVisible();
    // کلیک روی دکمه "ویرایش"
    await editButton.click();
  }

  async AcceptRequest(): Promise<void> {
    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const menuButton = this.page
      .locator('.join-to-repo-requests__button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await this.page.waitForTimeout(3000);

    const firstAcceptButton = this.page
      .locator('.request-menu__accept-button')
      .first();
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(firstAcceptButton).toBeVisible();
    // کلیک روی اولین دکمه "تایید"
    await firstAcceptButton.click();

    await this.page.waitForTimeout(3000);

    const enterRepoButton = this.page.locator('.text__label__button');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(enterRepoButton).toBeVisible();
    // کلیک روی دکمه "ورود به مخزن"
    await enterRepoButton.click();

    await this.page.waitForTimeout(5000);
  }

  async SendReqPublicVersion(): Promise<void> {
    const versionMenuButton = this.page.locator('button.version-menu').nth(0);
    await versionMenuButton.waitFor({ state: 'visible' });
    await versionMenuButton.click();
    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const publicButton = this.page.locator('button.public-version');
    await expect(publicButton).toBeVisible();
    await publicButton.click();

    await this.page.waitForTimeout(2000);

    const confirmButton = this.page.locator(
      'button.dialog-footer__submit-button',
    );
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    await this.page.waitForTimeout(2000);

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText(
      'درخواست عمومی سازی نسخه برای مالک ارسال شد.',
      { timeout: 3000 },
    );

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  async AcceptReqPublic(): Promise<void> {
    await this.page.waitForTimeout(5000);

    await this.page.setViewportSize({ width: 1280, height: 800 }); // سایز دسکتاپ

    const firstRepoCard = this.page.locator('.repo-card').first();
    const menuuButton = firstRepoCard.locator('.desktop-menu button');

    await expect(menuuButton).toBeVisible({ timeout: 5000 });
    await menuuButton.click();

    await this.page.waitForTimeout(5000);

    const versionRequestItem = this.page.locator(
      '.repo-menu__item--version-requests',
    );
    await expect(versionRequestItem).toBeVisible();
    await versionRequestItem.click();

    await this.page.waitForTimeout(5000);

    const button = this.page.getByRole('tab', {
      name: 'نسخه‌های در انتظار عمومی شدن',
    });
    await button.click();

    await this.page.setViewportSize({ width: 600, height: 800 });

    const allButtons = this.page.locator('button.repo-version-request-menu');
    const count = await allButtons.count();

    for (let i = 0; i < count; i++) {
      const btn = allButtons.nth(i);
      if (await btn.isVisible()) {
        console.log(`✅ کلیک روی دکمه شماره ${i}`);
        await btn.click();
        break;
      }
    }

    await this.page.waitForTimeout(5000);

    const acceptButton = this.page.locator(
      'button.repo-version-request__accept-request',
    );
    await expect(acceptButton).toBeVisible();
    await acceptButton.click();

    await this.page.waitForTimeout(3000);

    const confirmButton = this.page.locator(
      'button.dialog-footer__submit-button',
    );
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
  }

  /**
   * لاگین با امکان انجام اکشن بعد از ورود (پنل ادمین، خبرنامه یا هیچکدام)
   */
  async loginn(
    username: string,
    password: string,
    afterLoginAction: 'admin' | 'newsletter' | null = null,
  ): Promise<void> {
    // رفتن به صفحه لاگین
    await this.page.goto(getFullUrl(URLs.LOGIN));
    await this.waitUtils.waitForPageLoad();

    // کلیک روی دکمه ورود
    const loginButton = this.page.getByRole('button', { name: 'ورود' });
    await loginButton.click();

    await this.page.locator('#authSelAccBtn').click();

    // // انتظار برای بارگذاری فرم
    // await this.page.waitForSelector('#authIdentity-inp', { state: 'visible' });

    // پر کردن فرم با سلکتورهای دقیق
    const usernameInput = this.page.locator('#authIdentity-inp');
    await usernameInput.waitFor({ state: 'visible' });
    await usernameInput.fill(username);

    const passwordInput = this.page.locator('#authPassword-inp');
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(password);

    // کلیک روی دکمه ورود در فرم
    const submitButton = this.page.locator('#authLoginBtn');
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();

    await this.page.waitForTimeout(3000);
    await this.waitUtils.waitForPageLoad();
    //await this.page.waitForURL(getFullUrl(URLs.DASHBOARD));
  }
}
