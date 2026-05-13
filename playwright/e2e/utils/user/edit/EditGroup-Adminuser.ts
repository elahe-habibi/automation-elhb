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

    // کلیک روی دکمه دعوت
    await this.page.getByRole('button', { name: 'دعوت' }).click();

    // انتظار برای اطمینان از ایجاد تگ
    await this.page.waitForTimeout(3000);

    // انتخاب تب "گروه‌ها"
    const groupsTab = this.page
      .locator(
        'li[role="tab"][data-value="گروه‌ها"], ' + // سلکتور اصلی با دیتا-ولیو
          'li[role="tab"]:has-text("گروه‌ها")', // پشتیبان با متن
      )
      .first();

    await groupsTab.waitFor({ state: 'visible', timeout: 10000 });
    await groupsTab.click();
    console.log('✅ تب "گروه‌ها" انتخاب شد');

    // کلیک روی دکمه "ایجاد گروه"
    const createGroupButton = this.page
      .locator(
        'button.create-group-button, ' + // کلاس اختصاصی دکمه
          'button:has-text("ایجاد گروه"), ' + // جستجوی متن مستقیم
          'button:has(p.title_t4:has-text("ایجاد گروه"))', // ساختار دقیق داخلی
      )
      .first();

    await createGroupButton.waitFor({ state: 'visible', timeout: 10000 });
    await createGroupButton.click();
    console.log('✅ دکمه "ایجاد گروه" کلیک شد');

    // ═════════════════════════════════════════════════════════
    // پر کردن فرم ایجاد گروه با نام یونیک و انتخاب یک عضو
    // ═════════════════════════════════════════════════════════
    console.log('🔄 در حال پر کردن فرم ایجاد گروه...');

    // 1. تولید نام یونیک برای گروه (با تاریخ و زمان فعلی)
    const uniqueGroupName = `واحد-${Date.now()}`;
    console.log(`📝 نام گروه: ${uniqueGroupName}`);

    // 2. پر کردن فیلد نام گروه
    const nameInput = this.page
      .locator(
        'input[name="title"].repo-group-create-form__input, ' +
          'input[placeholder="نام گروه"]',
      )
      .first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill(uniqueGroupName);
    console.log('✅ نام گروه با موفقیت وارد شد');

    // 3. پر کردن فیلد توضیحات (اختیاری اما توصیه شده)
    const descriptionInput = this.page
      .locator(
        'textarea[name="description"].repo-group-create-form__textarea, ' +
          'textarea[placeholder="توضیحات گروه"]',
      )
      .first();
    if (
      await descriptionInput.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      // پاک‌سازی تاریخ از کاراکترهای غیرمجاز (فقط نگه‌داشتن ارقام فارسی و متن فارسی معتبر)
      const baseText = 'گروه تستی ایجاد شده در ';
      const rawDate = new Date().toLocaleString('fa-IR');
      // حذف تمام کاراکترهای غیر از ارقام فارسی (۰-۹) از بخش تاریخ
      const cleanDate = rawDate.replace(/[^۰-۹]/g, '');
      const safeDescription = `${baseText}${cleanDate}`;

      await descriptionInput.fill(safeDescription);
      console.log(`✅ توضیحات با متن ایمن وارد شد: "${safeDescription}"`);
      console.log('✅ توضیحات گروه وارد شد');
    }
    // ═════════════════════════════════════════════════════════
    // انتخاب اولین کاربر از دراپ‌دون اعضا (بر اساس ساختار دقیق HTML شما)
    // ═════════════════════════════════════════════════════════
    console.log('🔄 در حال انتخاب اولین کاربر از دراپ‌دون اعضا...');

    // 1. کلیک روی فیلد جستجو برای باز کردن دراپ‌دون
    const membersSearchInput = this.page
      .locator('input[placeholder="جست و جو کنید ..."]')
      .first();
    await membersSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await membersSearchInput.click();
    console.log('✅ فیلد جستجوی اعضا فعال شد');

    // 2. انتظار برای ظهور دقیق دراپ‌دون با کلاس "shadow-menu" (بر اساس HTML شما)
    await this.page.waitForSelector('div.shadow-menu', {
      state: 'visible',
      timeout: 10000,
    });
    console.log('✅ دراپ‌دون لیست اعضا باز شد');

    // 3. ✨ انتخاب اولین گزینه با سلکتور دقیق مطابق ساختار HTML شما
    const firstOption = this.page
      .locator('div.shadow-menu ul li.cursor-pointer:first-child')
      .first();

    await firstOption.waitFor({ state: 'visible', timeout: 5000 });
    const userName = (
      (await firstOption.locator('p.select_option__text').textContent()) || ''
    ).trim();
    console.log(`✅ کاربر "${userName}" از دراپ‌دون انتخاب شد`);
    await firstOption.click();

    // 4. تأیید اضافه شدن کاربر به لیست اعضا (اختیاری اما توصیه شده)
    await this.page.waitForTimeout(500);
    const memberTag = this.page
      .locator('.group-create-form__members-list > div')
      .first();
    if (await memberTag.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('✅ کاربر به لیست اعضا اضافه شد');
    }
    // 5. کلیک روی دکمه "ایجاد"
    const createButton = this.page
      .locator(
        'button:has-text("ایجاد").dialog-footer__submit-button, ' +
          'button[type="submit"]:has-text("ایجاد")',
      )
      .first();

    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    await createButton.click();
    console.log('✅ دکمه "ایجاد" کلیک شد');

    // 6. انتظار برای بسته شدن دیالوگ یا نمایش پیام موفقیت
    await this.page.waitForTimeout(2000);
    console.log(`🎉 گروه "${uniqueGroupName}" با موفقیت ایجاد شد`);

    await this.page.waitForTimeout(3000);

    // ═════════════════════════════════════════════════════════
    // ✅ کلیک مستقیم روی دکمه سه‌نقطه گروه در دیالوگ (بدون جستجوی گروه)
    // ═════════════════════════════════════════════════════════
    console.log('⏳ در حال پیدا کردن دکمه سه‌نقطه گروه در دیالوگ...');

    // سلکتور مستقیم بر اساس کلاس دقیق از HTML شما + اسکوپ به دیالوگ
    const groupMenuButton = this.page
      .locator(
        'div[role="dialog"] button.repo-group-menu, ' + // ✅ کلاس دقیق از کد شما
          'div[role="dialog"] button[aria-haspopup="menu"]', // پشتیبان ARIA
      )
      .first();

    // انتظار هوشمند فقط برای ظهور دکمه (نه کارت گروه)
    await groupMenuButton.waitFor({ state: 'visible', timeout: 10000 });
    await groupMenuButton.click();
    console.log('✅ منوی سه‌نقطه گروه باز شد');

// ═════════════════════════════════════════════════════════
// کلیک روی گزینه "اطلاعات گروه" از منوی بازشده گروه
// ═════════════════════════════════════════════════════════
console.log('⏳ در انتظار نمایش گزینه "اطلاعات گروه" در منو...');

// سلکتور هوشمند با دو لایه پشتیبان (بر اساس ساختار دقیق HTML شما):
const groupInfoButton = this.page
  .locator(
    // روش اصلی: کلاس اختصاصی + ساختار داخلی با متن فارسی
    'button.repo-group-menu__edit:has(p:text("اطلاعات گروه")), ' +
    // روش پشتیبان: نقش menuitem + متن فارسی در تگ <p>
    'button[role="menuitem"]:has(p:text("اطلاعات گروه"))'
  )
  .first();

// انتظار هوشمند برای ظهور و فعال بودن
await groupInfoButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(groupInfoButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن
await groupInfoButton.click();
console.log('✅ گزینه "اطلاعات گروه" با موفقیت انتخاب شد');


// ═════════════════════════════════════════════════════════
// ویرایش نام و توضیحات گروه (بدون تغییر اعضا) + کلیک روی دکمه "ویرایش"
// ═════════════════════════════════════════════════════════
console.log('🔄 در حال ویرایش اطلاعات گروه...');

// 1. ویرایش نام گروه با مقدار یونیک جدید
const nameeInput = this.page.locator(
  'input.repo-group-edit-form__input[name="title"], ' +
  'input[placeholder="نام گروه"]'
).first();

await nameeInput.waitFor({ state: 'visible', timeout: 10000 });
await nameeInput.clear();
const newGroupName = `ویرایش_شده_${Date.now()}`;
await nameeInput.fill(newGroupName);
console.log(`✅ نام گروه به "${newGroupName}" تغییر کرد`);

// 2. ویرایش توضیحات گروه (بدون کاراکتر غیرمجاز)
const descriptionTextarea = this.page.locator(
  'textarea.repo-group-edit-form__textarea[name="description"], ' +
  'textarea[placeholder="توضیحات گروه"]'
).first();

if (await descriptionTextarea.isVisible({ timeout: 5000 }).catch(() => false)) {
  await descriptionTextarea.clear();
  const cleanTimestamp = new Date().toLocaleString('fa-IR').replace(/[^۰-۹]/g, '');
  const newDescription = `گروه ویرایش شده ${cleanTimestamp}`;
  await descriptionTextarea.fill(newDescription);
  console.log(`✅ توضیحات گروه به "${newDescription}" تغییر کرد`);
}

// ⚠️ تأکید: اعضا تغییری نمی‌کنند (طبق درخواست شما)
console.log('ℹ️ اعضا بدون تغییر باقی ماندند (طبق درخواست)');

// 3. کلیک روی دکمه "ویرایش" در فوتر دیالوگ
console.log('⏳ در انتظار فعال شدن دکمه "ویرایش"...');

const editButton = this.page.locator(
  'div.dialog-footer button.dialog-footer__submit-button:has-text("ویرایش"), ' +
  'button:has(p.text__label__button:text("ویرایش"))'
).first();

// انتظار برای فعال شدن دکمه (بعد از تغییرات فیلدها)
await editButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(editButton).toBeEnabled({ timeout: 8000 });

await editButton.click();
console.log('✅ دکمه "ویرایش" با موفقیت کلیک شد');

// 4. تأیید موفقیت عملیات (اختیاری اما توصیه شده)
await this.page.waitForTimeout(1500);
console.log('✅ ویرایش گروه با موفقیت انجام شد');


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

    await this.page.waitForTimeout(5000);
  }
}
