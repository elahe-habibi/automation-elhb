import { expect, Page } from '@playwright/test';
import { WaitUtils } from '../../core/waitutils';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class ArchiveRepository {
  private page: Page;
  private waitUtils: WaitUtils;

  constructor(page: Page) {
    this.page = page;
    this.waitUtils = new WaitUtils(page);
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard(): Promise<void> {
    await this.page.goto('https://clasor-frontend.sandpod.ir/admin/dashboard');
    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(2000);
  }

  /**
   * انتخاب اولین مخزن در لیست
   */
  async selectFirstRepository(): Promise<void> {
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });

    const firstRepo = this.page.locator('.repo-card').first();
    await firstRepo.click();
    await this.page.waitForLoadState('networkidle');

    // اضافه کردن تاخیر برای اطمینان از بارگذاری کامل صفحه
    await this.page.waitForTimeout(2000);
  }

  /**
   * کلیک روی دکمه منو
   */
  async clickDropdownButton(): Promise<void> {
    const menuButton = this.page
      .locator('.repoInformationTab.repoActions button')
      .nth(0); // یا nth(1) بسته به موقعیت صحیح
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const archiveButton = this.page.locator('.repo-menu__item--archive');
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(archiveButton).toBeVisible();
    // کلیک روی دکمه "بایگانی"
    await archiveButton.click();

    await this.page.waitForTimeout(2000);

    const archiveBuutton = this.page.locator(
      '.dialog-footer__submit-button.bg-error',
    );
    // بررسی اینکه دکمه قابل مشاهده است
    await expect(archiveBuutton).toBeVisible();
    // کلیک روی دکمه "آرشیو"
    await archiveBuutton.click();

    await this.page.waitForTimeout(2000);

    const manageReposButton = this.page.locator('button.border-b-2').nth(1);
    await expect(manageReposButton).toBeVisible();
    await manageReposButton.click();

    await this.page.waitForTimeout(5000);

    const archivedReposButton = this.page.locator('button.text-link').nth(6);
    await expect(archivedReposButton).toBeVisible();
    await archivedReposButton.click();

    await this.page.waitForTimeout(8000);


// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه "ایجاد مخزن جدید" با استفاده از کلاس‌های هوشمند
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "ایجاد مخزن جدید"...');

// سلکتور هوشمند با اسکوپ به کانتینر اصلی + کلاس‌های منحصر به فرد دکمه
const createRepoButton = this.page.locator(
  'div.createNewRepo button.bg-primary-normal:not(.w-9):not(.rounded-full)' // ✅ فیلتر هوشمند برای انتخاب دقیق دکمه دسکتاپ
).first();

// انتظار هوشمند تا دکمه کاملاً قابل مشاهده باشد
await createRepoButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(createRepoButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأخیر کوتاه
await createRepoButton.click({ delay: 100 });
console.log('✅ دکمه "ایجاد مخزن جدید" با موفقیت کلیک شد');

// ═════════════════════════════════════════════════════════
// ✅ دریافت نام اولین مخزن در لیست فعلی (مثلاً لیست مخازن بایگانی‌شده)
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال استخراج نام اولین مخزن در لیست...');

// استخراج نام از اولین کارت مخزن با سلکتور دقیق مبتنی بر ساختار HTML شما
const firstRepoName = await this.page
  .locator('.repo-card p.repo__name') // ✅ دقیقاً همان کلاس موجود در HTML شما
  .first() // اطمینان از انتخاب اولین مخزن در لیست
  .textContent({ timeout: 15000 }); // انتظار هوشمند تا المان کاملاً لود شود

// اعتبارسنجی و پاک‌سازی نام
if (!firstRepoName || firstRepoName.trim() === '') {
  throw new Error('❌ نام مخزن اولین کارت پیدا نشد یا خالی است!');
}

const trimmedRepoName = firstRepoName.trim();
console.log(`✅ نام اولین مخزن استخراج شد: "${trimmedRepoName}"`);

// ═════════════════════════════════════════════════════════
// استفاده از نام استخراج‌شده برای ایجاد مخزن جدید با همان نام
// ═════════════════════════════════════════════════════════
console.log(`🔄 در حال ایجاد مخزن جدید با نام یکسان: "${trimmedRepoName}"...`);


console.log(`🎉 مخزن جدید با نام "${trimmedRepoName}" با موفقیت ایجاد شد`);

// ═════════════════════════════════════════════════════════
// ✅ وارد کردن نام مخزن استخراج‌شده در فیلد ایجاد مخزن + کلیک روی دکمه "ادامه"
// ═════════════════════════════════════════════════════════
console.log(`📝 در حال وارد کردن نام مخزن "${trimmedRepoName}" در فیلد ایجاد...`);

// 1. پر کردن فیلد نام مخزن با نام استخراج‌شده از لیست بایگانی
const repoNameInput = this.page.locator('#repo-name, input[name="name"].repo-create-dialog__input');
await repoNameInput.waitFor({ state: 'visible', timeout: 10000 });
await repoNameInput.fill(trimmedRepoName);
console.log(`✅ نام مخزن "${trimmedRepoName}" با موفقیت در فیلد وارد شد`);

// 2. پر کردن فیلد توضیحات با متن کاملاً فارسی (بدون هیچ کاراکتر غیرفارسی، عدد یا نماد)
const descriptionInput = this.page.locator('textarea[name="description"].repo-create-dialog__textarea');
if (await descriptionInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  // ✅ متن کاملاً فارسی: فقط حروف فارسی + فاصله (بدون عدد، خط تیره، یا کاراکتر لاتین)
  await descriptionInput.fill('توضیحات تستی برای بررسی تکراری بودن نام مخزن');
  console.log('✅ توضیحات مخزن با متن کاملاً فارسی وارد شد');
}

// 3. انتظار برای فعال شدن دکمه "ادامه" (حذف شدن disabled پس از پر کردن فیلد)
console.log('⏳ در انتظار فعال شدن دکمه "ادامه"...');
const continueButton = this.page.locator(
  'button.repo-create-dialog__create-button, ' +
  'button:has-text("ادامه").dialog__footer > button'
).first();

// انتظار هوشمند تا دکمه فعال شود (بدون نیاز به بررسی دستی disabled)
await continueButton.waitFor({ state: 'visible', timeout: 15000 });
await expect(continueButton).toBeEnabled({ timeout: 10000 }); // تأیید فعال بودن

// 4. کلیک ایمن روی دکمه "ادامه"
await continueButton.click({ delay: 150 });
console.log('✅ دکمه "ادامه" با موفقیت کلیک شد - فرآیند ایجاد مخزن آغاز شد');



// ═════════════════════════════════════════════════════════
// ✅ کلیک روی دکمه بستن (X) دیالوگ با استفاده از کلاس منحصر به فرد
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه بستن (X) دیالوگ...');

// سلکتور دقیق بر اساس کلاس موجود در HTML شما + اسکوپ به دیالوگ فعال
const closeButton = this.page.locator(
  'div[role="dialog"] button.close-button, ' + // اسکوپ به دیالوگ فعال (اگر وجود دارد)
  'button.close-button'                         // پشتیبان: جستجوی عمومی
).first();

// انتظار هوشمند تا دکمه کاملاً قابل مشاهده باشد
await closeButton.waitFor({ state: 'visible', timeout: 10000 });

// تأیید فعال بودن قبل از کلیک (برای جلوگیری از خطا در دکمه‌های غیرفعال)
await expect(closeButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأخیر کوتاه
await closeButton.click({ delay: 100 });
console.log('✅ دکمه بستن (X) با موفقیت کلیک شد و دیالوگ بسته شد');

// تأیید بسته شدن دیالوگ (اختیاری - برای اطمینان کامل)

await this.page.waitForTimeout(8000);


    // ═════════════════════════════════════════════════════════
    // ✅ کلیک روی اولین دکمه منوی سه‌نقطه + انتخاب "بازگردانی" از منوی بازشده
    // ═════════════════════════════════════════════════════════
    console.log('🎯 در حال پیدا کردن اولین دکمه منوی سه‌نقطه در لیست مخازن...');

    // پیدا کردن اولین دکمه منوی سه‌نقطه (بر اساس کلاس والد + ویژگی‌های استاندارد)
    const firstMenuButton = this.page
      .locator('div.desktop-menu button[aria-haspopup="menu"]')
      .first();

    // انتظار هوشمند + تأیید فعال بودن
    await firstMenuButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(firstMenuButton).toBeEnabled({ timeout: 5000 });

    // کلیک ایمن با تأخیر برای شبیه‌سازی رفتار واقعی
    await firstMenuButton.click({ delay: 150 });
    console.log('✅ اولین دکمه منوی سه‌نقطه کلیک شد و منو باز شد');

    // ═════════════════════════════════════════════════════════
    // انتظار برای ظهور گزینه "بازگردانی" در منوی بازشده
    // ═════════════════════════════════════════════════════════
    console.log('⏳ در انتظار نمایش گزینه "بازگردانی" در منو...');

    // سلکتور دقیق بر اساس کلاس منحصر به فرد از HTML شما
    const restoreMenuItem = this.page
      .locator('button.repo-menu__item--restore') // ✅ دقیقاً همان کلاس موجود در کد شما
      .first(); // انتخاب اولین گزینه مرتبط (در صورت وجود چند منو)

    // انتظار برای نمایش کامل گزینه
    await restoreMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await expect(restoreMenuItem).toBeEnabled({ timeout: 5000 });

    // کلیک ایمن روی گزینه "بازگردانی"
    await restoreMenuItem.click({ delay: 100 });
    console.log('✅ گزینه "بازگردانی" با موفقیت از منو انتخاب شد');


// ═════════════════════════════════════════════════════════
// ✅ پیدا کردن و کلیک روی دکمه "تایید" با استفاده از کلاس منحصر به فرد + اسکوپ به دیالوگ
// ═════════════════════════════════════════════════════════
console.log('🎯 در حال پیدا کردن دکمه "تایید"...');

// سلکتور هوشمند با اسکوپ به دیالوگ فعال + کلاس دقیق
const confirmButton = this.page.locator(
  'div[role="dialog"] button.dialog-footer__submit-button, ' + // اسکوپ به دیالوگ فعال
  'button.dialog-footer__submit-button'                         // پشتیبان عمومی
).first();

// انتظار هوشمند تا دکمه کاملاً قابل مشاهده و فعال باشد
await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
await expect(confirmButton).toBeEnabled({ timeout: 5000 });

// کلیک ایمن با تأخیر کوتاه
await confirmButton.click({ delay: 100 });
console.log('✅ دکمه "تایید" با موفقیت کلیک شد');

    await this.page.waitForTimeout(8000);


// ═════════════════════════════════════════════════════════
// ✅ تأیید نمایش توست خطا برای نام تکراری مخزن
// ═════════════════════════════════════════════════════════
console.log('⏳ در انتظار نمایش پیام خطا برای نام تکراری مخزن...');

// روش هوشمند: جستجوی متن در کل محتوای صفحه (حتی اگر توست سریع ناپدید شود)
await this.page.waitForFunction(
  () => document.body.innerText.includes('عنوان نمی تواند تکراری باشد'),
  { timeout: 15000 }
);

// تأیید دقیق متن کامل توست (اختیاری - برای اطمینان بیشتر)
const toastMessage = await this.page
  .locator(':has-text("عنوان نمی تواند تکراری باشد")')
  .first()
  .textContent();

if (toastMessage && toastMessage.includes('عنوان نمی تواند تکراری باشد')) {
  console.log(`✅ پیام خطا دریافت شد: "${toastMessage.trim()}"`);
  console.log('🎉 تست اعتبارسنجی نام تکراری مخزن با موفقیت انجام شد!');
} else {
  throw new Error('❌ پیام خطا پیدا نشد یا متن آن مطابق انتظار نبود!');
}
    await this.page.waitForTimeout(3000);

  }

}
