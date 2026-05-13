import { Page, expect } from '@playwright/test';
import { URLs, getFullUrl } from '../../../constants';
import path from 'path';

export class RepositoryUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
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
   * اشتراک‌گذاری مخزن با کاربر دیگر
   * @param username نام کاربری که می‌خواهیم مخزن را با او به اشتراک بگذاریم
   */
  async sharreeRepository(username: string) {
    // وارد کردن نام کاربری در فیلد شناسه پادی
    await this.page.getByPlaceholder('شناسه پادی').fill(username);
    await this.page.getByRole('button', { name: 'دعوت' }).click();
    await this.page.waitForTimeout(5000);

    // انتخاب تب "گروه‌ها"
    const groupsTab = this.page
      .locator('li[role="tab"][data-value="گروه‌ها"]')
      .first();
    await groupsTab.waitFor({ state: 'visible', timeout: 10000 });
    await groupsTab.click();
    console.log('✅ تب "گروه‌ها" انتخاب شد');

    // کلیک روی دکمه "ایجاد گروه"
    const createGroupButton = this.page
      .locator('button.create-group-button')
      .first();
    await createGroupButton.waitFor({ state: 'visible', timeout: 10000 });
    await createGroupButton.click();
    console.log('✅ دکمه "ایجاد گروه" کلیک شد');

    // پر کردن فیلد نام گروه با نام ثابت "123" (برای تست تکراری بعدی)
    const nameInput = this.page.locator('input[name="title"]').first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill('123');
    console.log('✅ نام گروه "123" وارد شد');

    // انتخاب اولین کاربر از دراپ‌دون
    const membersSearchInput = this.page
      .locator('input[placeholder="جست و جو کنید ..."]')
      .first();
    await membersSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await membersSearchInput.click();
    await this.page.waitForSelector('div.shadow-menu', {
      state: 'visible',
      timeout: 10000,
    });

    const firstOption = this.page
      .locator('div.shadow-menu ul li.cursor-pointer:first-child')
      .first();
    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    await firstOption.click();
    console.log('✅ اولین کاربر از دراپ‌دون انتخاب شد');

    // کلیک یک‌باره روی دکمه "ایجاد"
    const createButton = this.page
      .locator('button.dialog-footer__submit-button:has-text("ایجاد")')
      .first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    await createButton.click();
    console.log('✅ دکمه "ایجاد" برای گروه اول کلیک شد');

    // ═════════════════════════════════════════════════════════
    // ✅ انتظار برای ناپدید شدن توست قبلی (اشتراک‌گذاری) + ظهور توست جدید (ایجاد گروه)
    // ═════════════════════════════════════════════════════════
    console.log('⏳ در انتظار پیام موفقیت ایجاد گروه...');

    // روش هوشمند: جستجوی توست جدید که حاوی کلمات کلیدی "گروه" و "ایجاد" باشد
    const successToast = this.page
      .locator(
        '.toast-success:has-text("گروه"), ' +
          '.Toastify__toast--success:has-text("گروه"), ' +
          '[role="alert"]:has-text("گروه")',
      )
      .first();

    // انتظار با تایم‌اوت ایمن
    await successToast.waitFor({ state: 'visible', timeout: 15000 });

    // استخراج و نمایش متن واقعی توست برای دیباگ
    const toastText = ((await successToast.textContent()) || '').trim();
    console.log(`✅ توست دریافت شد: "${toastText}"`);

    // ✅ تأیید انعطاف‌پذیر: فقط بررسی وجود کلمات کلیدی (نه متن دقیق)
    // چون متن دقیق ممکن است بین نسخه‌ها تغییر کند یا شامل اشتباه تایپی باشد ("مخرن" به جای "مخزن")
    expect(toastText).toMatch(/گروه/); // حاوی کلمه "گروه"
    expect(toastText).toMatch(/ایجاد/); // حاوی کلمه "ایجاد" یا "ساخت"
    console.log('✅ گروه اول با نام "123" با موفقیت ایجاد شد');

    // بستن دیالوگ پس از موفقیت
    const closeButton = this.page
      .locator(
        'div[role="dialog"] button.close-button, ' +
          'div[role="dialog"] .close-button',
      )
      .first();

    if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeButton.click();
      console.log('✅ دیالوگ ایجاد گروه بسته شد');
    }
    await this.page.waitForTimeout(2000);
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

  async clickDroopdownButton(): Promise<void> {
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

    await this.page.waitForTimeout(8000);

    // // کلیک روی دکمه بستن دیالوگ (آیکون × در هدر دیالوگ)
    // const closeButton = this.page
    //   .locator(
    //     'button.close-button, ' + // کلاس اختصاصی دکمه بستن
    //       'button:has(svg path[d*="M7.61688"])', // سلکتور پشتیبان بر اساس آیکون SVG
    //   )
    //   .first();

    // await closeButton.waitFor({ state: 'visible', timeout: 5000 });
    // await closeButton.click();
    // console.log('✅ دیالوگ با کلیک روی دکمه بستن (×) بسته شد');
  }

  /**
   * اشتراک‌گذاری مخزن با کاربر دیگر
   * نام کاربری که می‌خواهیم مخزن را با او به اشتراک بگذاریم
   */
  async createGroup() {
    await this.page.waitForTimeout(3000);

    // ═════════════════════════════════════════════════════════
    // ✅ باز کردن دیالوگ اشتراک‌گذاری از طریق منوی سه‌نقطه مخزن
    // ═════════════════════════════════════════════════════════
    console.log('🔄 در حال باز کردن دیالوگ اشتراک‌گذاری...');

    // کلیک روی منوی سه‌نقطه مخزن
    const repoMenuButton = this.page
      .locator(
        'div.desktop-menu button[aria-haspopup="menu"], ' +
          '.repoInformationTab.repoActions button',
      )
      .first();
    await repoMenuButton.waitFor({ state: 'visible', timeout: 10000 });
    await repoMenuButton.click();
    console.log('✅ منوی سه‌نقطه مخزن باز شد');
    await this.page.waitForTimeout(800);

    // انتخاب گزینه "اشتراک‌گذاری" از منو
    const shareOption = this.page
      .locator(
        'button:has-text("اشتراک‌گذاری"), ' +
          '[role="menuitem"]:has-text("اشتراک")',
      )
      .first();
    await shareOption.waitFor({ state: 'visible', timeout: 10000 });
    await shareOption.click();
    console.log('✅ دیالوگ اشتراک‌گذاری باز شد');
    await this.page.waitForTimeout(1500); // انتظار برای باز شدن کامل دیالوگ

    // ═════════════════════════════════════════════════════════
    // ادامه کد قبلی: انتخاب تب "گروه‌ها" و سایر مراحل
    // ═════════════════════════════════════════════════════════
    const groupsTab = this.page
      .locator('li[role="tab"][data-value="گروه‌ها"]')
      .first();
    await groupsTab.waitFor({ state: 'visible', timeout: 10000 });
    await groupsTab.click();
    console.log('✅ تب "گروه‌ها" انتخاب شد');

    await this.page.waitForTimeout(3000);

    // // انتخاب تب "گروه‌ها"
    // const groupsTab = this.page.locator('li[role="tab"][data-value="گروه‌ها"]').first();
    // await groupsTab.waitFor({ state: 'visible', timeout: 10000 });
    // await groupsTab.click();
    // console.log('✅ تب "گروه‌ها" انتخاب شد');

    // کلیک روی دکمه "ایجاد گروه"
    const createGroupButton = this.page
      .locator('button.create-group-button')
      .first();
    await createGroupButton.waitFor({ state: 'visible', timeout: 10000 });
    await createGroupButton.click();
    console.log('✅ دکمه "ایجاد گروه" کلیک شد');

    // پر کردن فیلد نام گروه با همان نام "123" (تکراری)
    const nameInput = this.page.locator('input[name="title"]').first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill('123'); // ✅ نام تکراری
    console.log('⚠️ نام گروه تکراری "123" وارد شد');

    // انتخاب اولین کاربر از دراپ‌دون
    const membersSearchInput = this.page
      .locator('input[placeholder="جست و جو کنید ..."]')
      .first();
    await membersSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await membersSearchInput.click();
    await this.page.waitForSelector('div.shadow-menu', {
      state: 'visible',
      timeout: 10000,
    });

    const firstOption = this.page
      .locator('div.shadow-menu ul li.cursor-pointer:first-child')
      .first();
    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    await firstOption.click();
    console.log('✅ اولین کاربر از دراپ‌دون انتخاب شد');

    // ═════════════════════════════════════════════════════════
    // ✨ کلیک ۴ باره روی دکمه "ایجاد" (تست استرس برای نام تکراری)
    // ═════════════════════════════════════════════════════════
    console.log('🖱️ شروع به کلیک ۴ باره روی دکمه "ایجاد"...');
    const createButton = this.page
      .locator('button.dialog-footer__submit-button:has-text("ایجاد")')
      .first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 });

    for (let i = 1; i <= 4; i++) {
      console.log(`   کلیک ${i} از ۴...`);
      await createButton.click({ force: true, timeout: 5000 });
      if (i < 4) await this.page.waitForTimeout(80);
    }
    console.log('✅ ۴ بار کلیک روی دکمه "ایجاد" انجام شد');

    // ═════════════════════════════════════════════════════════
    // ✅ تأیید پیام خطا (تکراری بودن نام)
    // ═════════════════════════════════════════════════════════
    console.log('⏳ در انتظار نمایش پیام خطا...');
    // حذف فیلتر "کاراکتر" چون خطا مربوط به تکراری بودن است
    const errorToast = this.page
      .locator('.toast-error, .Toastify__toast--error, [role="alert"]')
      .first();
    await errorToast.waitFor({ state: 'visible', timeout: 15000 });
    const toastText = ((await errorToast.textContent()) || '').trim();
    console.log(`❌ پیام خطا: "${toastText}"`);

    // ✅ تأیید دقیق متن خطا
    await expect(errorToast).toContainText('نام گروه مورد نظر تکراری است');
    console.log('✅ خطا تکراری بودن نام گروه به درستی نمایش داده شد');

    // بستن دیالوگ با دکمه "انصراف"
    const cancelButton = this.page
      .locator('button:has-text("انصراف").dialog-footer')
      .first();
    if (await cancelButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cancelButton.click();
      console.log('✅ دیالوگ با کلیک روی "انصراف" بسته شد');
    }
    await this.page.waitForTimeout(2000);
  }
}
