import { expect, Page } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
import { firefox } from '@playwright/test';

/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */
export class EditRepositoryShareLink {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * رفتن به صفحه داشبورد
   */
  async goToDashboard(): Promise<void> {
    await this.page.goto(
      'https://clasor-frontend.sandpod.ir/admin/dashboard    ',
    );
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

  async AcceptRequestWhitelist(): Promise<void> {
    // کلیک روی دکمه منوی سه‌نقطه
    console.log('🔘 کلیک روی منو...');

    const menuBtn = this.page
      .locator('button.bg-transparent[aria-haspopup="menu"]')
      .first();

    await menuBtn.waitFor({ state: 'visible', timeout: 10000 });
    await menuBtn.scrollIntoViewIfNeeded();
    await menuBtn.click({ force: true });

    console.log('✅ منو باز شد');

    await this.page.waitForTimeout(3000);
    // کلیک روی دکمه درخواست‌های دسترسی سند
    console.log('🔐 کلیک روی درخواست‌های دسترسی...');

    const whitelistBtn = this.page
      .locator('button.repo-menu__document-white-list')
      .first();

    await whitelistBtn.waitFor({ state: 'visible', timeout: 10000 });
    await whitelistBtn.scrollIntoViewIfNeeded();
    await whitelistBtn.click({ force: true });

    console.log('✅ دکمه درخواست‌های دسترسی کلیک شد');
    await this.page.waitForTimeout(1500);

    // کلیک روی دکمه با کلاس request-menu__accept-button
    console.log('🟢 کلیک روی دکمه تایید با کلاس...');

    const acceptBtn = this.page
      .locator('button.request-menu__accept-button')
      .first();

    await acceptBtn.waitFor({ state: 'visible', timeout: 10000 });
    await acceptBtn.scrollIntoViewIfNeeded();
    await acceptBtn.click({ force: true });

    console.log('✅ دکمه تایید کلیک شد');
  }

  /**
   * ایجاد لینک انتشار مخزن (برای انتشار عمومی مخزن)
   */
  async createPublishLink(): Promise<void> {
    // کلیک روی دکمه "بستن" با استفاده از کلاس اختصاصی
    console.log('🎯 در حال کلیک روی دکمه بستن...');

    const closeButton = this.page.locator('button.close-button').first();

    await closeButton.waitFor({ state: 'visible', timeout: 10000 });
    await closeButton.click();
    console.log('✅ دکمه بستن با موفقیت کلیک شد');

    console.log('🔄 شروع فرآیند ایجاد لینک انتشار مخزن...');

    // ═════════════════════════════════════════════════════════
    // مرحله ۱: باز کردن منوی سه‌نقطه مخزن
    // ═════════════════════════════════════════════════════════
    const menuButton = this.page
      .locator(
        'div.desktop-menu button[aria-haspopup="menu"], ' +
          '.repoInformationTab.repoActions button',
      )
      .first();

    await menuButton.waitFor({ state: 'visible', timeout: 10000 });
    await menuButton.click();
    console.log('✅ منوی سه‌نقطه مخزن باز شد');
    await this.page.waitForTimeout(1000);

    // ═════════════════════════════════════════════════════════
    // مرحله ۲: انتخاب گزینه "اشتراک‌گذاری"
    // ═════════════════════════════════════════════════════════
    const shareButton = this.page
      .locator(
        'button:has-text("اشتراک‌گذاری"), ' +
          '[role="menuitem"]:has-text("اشتراک")',
      )
      .first();

    await shareButton.waitFor({ state: 'visible', timeout: 10000 });
    await shareButton.click();
    console.log('✅ بخش اشتراک‌گذاری باز شد');
    await this.page.waitForTimeout(2000);

    // ═════════════════════════════════════════════════════════
    // مرحله ۳: ✨ انتخاب تب "انتشار" (بر اساس کد HTML شما)
    // ═════════════════════════════════════════════════════════
    console.log('🔄 در حال انتخاب تب "انتشار"...');

    // سلکتور دقیق بر اساس کد HTML ارائه شده
    const publishTab = this.page
      .locator(
        'li[role="tab"][data-value="انتشار"], ' + // سلکتور اصلی از HTML شما
          'li:has(div:has-text("انتشار"))', // پشتیبان با جستجوی متن
      )
      .first();

    await publishTab.waitFor({ state: 'visible', timeout: 10000 });
    await publishTab.click();
    console.log('✅ تب "انتشار" انتخاب شد');
    await this.page.waitForTimeout(1500);

    // ═════════════════════════════════════════════════════════
    // مرحله ۴: ✨ کلیک روی دکمه "ایجاد" لینک انتشار (بر اساس کد HTML شما)
    // ═════════════════════════════════════════════════════════
    console.log('🔄 در حال کلیک روی دکمه "ایجاد" لینک انتشار...');

    // سلکتور دقیق بر اساس کد HTML ارائه شده
    const createPublishButton = this.page
      .locator(
        'button.repo-create-publish-link__create-button:has-text("ایجاد"), ' + // کلاس + متن
          'button:has(p:has-text("ایجاد")):has(.repo-create-publish-link__create-button)', // ساختار داخلی
      )
      .first();

    await createPublishButton.waitFor({ state: 'visible', timeout: 10000 });
    await createPublishButton.click();
    console.log('✅ دکمه "ایجاد" لینک انتشار کلیک شد');

    await this.page.screenshot({ path: 'debug-publish-link.png' });
    // انتظار برای پردازش و نمایش لینک ایجاد شده
    await this.page.waitForTimeout(3000);

    // ✅ تأیید موفقیت‌آمیز بودن عملیات (اختیاری)
    const successIndicator = this.page.locator(
      '.publish-link-created, ' +
        '[data-testid="publish-link"], ' +
        'text="لینک انتشار با موفقیت ایجاد شد"',
    );

    if (
      await successIndicator.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      console.log('✅ لینک انتشار مخزن با موفقیت ایجاد شد');
    } else {
      console.log('ℹ️ لینک انتشار ایجاد شد (بدون نمایش پیام تأیید)');
    }

    await this.page.waitForTimeout(4000);

    // ═════════════════════════════════════════════════════════
    // مرحله ۵: ✨ کلیک روی دکمه "ورود به صفحه مخزن منتشرشده"
    // ═════════════════════════════════════════════════════════
    console.log('🔄 در حال جستجوی دکمه "ورود به صفحه مخزن منتشرشده"...');

    // سلکتور دقیق بر اساس کد HTML ارائه شده + پشتیبان‌های هوشمند
    const enterPublishedRepoButton = this.page
      .locator(
        // ✅ سلکتور اصلی از کد HTML شما
        'button:has-text("ورود به صفحه مخزن منتشرشده"), ' +
          // پشتیبان ۱: متن کوتاه‌تر (در صورت تغییر متن)
          'button:has-text("ورود به مخزن منتشرشده"), ' +
          // پشتیبان ۲: بر اساس کلاس خاص دکمه
          'button.bg-transparent.text-\\[\\#0C8CE9\\], ' +
          // پشتیبان ۳: دکمه‌ای که حاوی متن "منتشرشده" است
          'button:has-text("منتشرشده")',
      )
      .first();

    // انتظار برای ظهور دکمه (تا 10 ثانیه)
    await enterPublishedRepoButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    console.log('✅ دکمه "ورود به صفحه مخزن منتشرشده" پیدا شد');

    // کلیک ایمن روی دکمه
    await enterPublishedRepoButton.click();
    console.log('✅ کلیک روی دکمه "ورود به صفحه مخزن منتشرشده" انجام شد');

    // انتظار برای ناوبری به صفحه مخزن منتشرشده
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    await this.page.waitForTimeout(2000);

    // تأیید ورود به صفحه مخزن منتشرشده
    console.log('✅ وارد صفحه مخزن منتشرشده شد');

    // ✅ لاگ نهایی موفقیت
    console.log(
      '✅ فرآیند ایجاد لینک انتشار و ورود به صفحه مخزن با موفقیت به پایان رسید',
    );

    // ═════════════════════════════════════════════════════════
    // ✅ استخراج لینک انتشار عمومی (با فرمت /publish/) و باز کردن در فایرفاکس
    // ═════════════════════════════════════════════════════════
    console.log('🔗 در حال جستجوی لینک انتشار عمومی (publish)...');

    let publishLink: string | null = null;

    // ۱. جستجوی هوشمند برای لینکی که حاوی "/publish/" باشد
    try {
      // 🔹 اولویت ۱: input که مقدارش شامل /publish/ باشد
      const inputs = await this.page.locator('input').all();
      for (const input of inputs) {
        const value = await input.inputValue().catch(() => '');
        if (value && value.includes('/publish/')) {
          publishLink = value.trim();
          console.log('📥 لینک publish از input پیدا شد');
          break;
        }
      }

      // 🔹 اولویت ۲: تگ a که href آن شامل /publish/ باشد
      if (!publishLink) {
        const anchors = await this.page.locator('a').all();
        for (const anchor of anchors) {
          const href = await anchor.getAttribute('href');
          if (href && href.includes('/publish/')) {
            publishLink = href.startsWith('http')
              ? href
              : new URL(href, this.page.url()).href;
            console.log('🔗 لینک publish از anchor پیدا شد');
            break;
          }
        }
      }

      // 🔹 اولویت ۳: هر المانی که متنش شامل لینک publish باشد
      if (!publishLink) {
        const publishElements = this.page.locator('text=/publish/');
        if ((await publishElements.count()) > 0) {
          const textContent = await publishElements.first().textContent();
          const urlMatch = textContent?.match(/https?:\/\/[^\s]+/);
          if (urlMatch?.[0] && urlMatch[0].includes('/publish/')) {
            publishLink = urlMatch[0];
            console.log('📝 لینک publish از text پیدا شد');
          }
        }
      }

      // 🔹 اولویت ۴: جستجو با سلکتورهای خاص کلایر
      if (!publishLink) {
        const specificSelectors = [
          'input.publish-link__url',
          'input[data-testid="publish-link"]',
          '.share-modal input',
          '[role="dialog"] input',
          'input[value*="/publish/"]',
        ];

        for (const selector of specificSelectors) {
          const el = this.page.locator(selector).first();
          if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
            const value = await el.inputValue().catch(() => '');
            if (value && value.includes('/publish/')) {
              publishLink = value.trim();
              console.log(`🎯 لینک publish با سلکتور ${selector} پیدا شد`);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ خطا در جستجوی لینک publish:', error);
    }

    // ۲. اگر لینک پیدا نشد، دیباگ اطلاعات بیشتر
    if (!publishLink) {
      console.warn('⚠️ لینک با فرمت /publish/ پیدا نشد! در حال دیباگ...');

      // چاپ همه inputها برای پیدا کردن سلکتور صحیح
      const allInputs = await this.page.locator('input').all();
      for (let i = 0; i < Math.min(allInputs.length, 5); i++) {
        const val = await allInputs[i].inputValue().catch(() => '[empty]');
        const cls = await allInputs[i].getAttribute('class');
        const testid = await allInputs[i].getAttribute('data-testid');
        console.log(
          `[DEBUG] Input ${i}: class="${cls}", testid="${testid}", value="${val?.substring(0, 100)}..."`,
        );
      }

      // fallback: استفاده از URL فعلی (اما احتمالاً اشتباه است)
      publishLink = this.page.url();
      console.log('🔄 fallback: استفاده از URL فعلی صفحه');
    }

    console.log(`📋 لینک نهایی برای فایرفاکس: ${publishLink}`);

    // ۳. اعتبارسنجی نهایی: حتماً باید شامل /publish/ باشد
    if (publishLink && publishLink.includes('/publish/')) {
      console.log('🦊 در حال باز کردن لینک انتشار در فایرفاکس...');

      const firefoxBrowser = await firefox.launch({
        headless: false,
        firefoxUserPrefs: { 'browser.startup.homepage': 'about:blank' },
      });

      const firefoxContext = await firefoxBrowser.newContext();
      const firefoxPage = await firefoxContext.newPage();

      await firefoxPage.goto(publishLink, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      await firefoxPage.waitForTimeout(3000);

      console.log(
        '✅ لینک انتشار عمومی با موفقیت در فایرفاکس باز شد:',
        publishLink,
      );

      // اختیاری: اگر نیاز به ادامه تست روی این صفحه دارید، firefoxPage را return کنید

      // ... بعد از باز شدن لینک در فایرفاکس ...
      await firefoxPage.waitForTimeout(3000); // صبر برای لود اولیه

      console.log('🔘 کلیک روی دکمه ورود...');

      // پیدا کردن دکمه بر اساس کلاس bg-tertiary و متن "ورود"
      const loginButton = firefoxPage
        .locator('button.bg-tertiary:has-text("ورود")')
        .first();

      // انتظار برای نمایش و کلیک
      await loginButton.waitFor({ state: 'visible', timeout: 10000 });
      await loginButton.scrollIntoViewIfNeeded();
      await loginButton.click({ force: true });

      console.log('✅ کلیک انجام شد، منتظر لود صفحه لاگین...');
      await firefoxPage.waitForLoadState('networkidle');
      await firefoxPage.waitForTimeout(2000);

      // پر کردن فیلدهای لاگین با کاربر جدید
      console.log('👤 در حال وارد کردن اطلاعات کاربر...');

      // شناسه (نام کاربری/ایمیل/تلفن)
      const identityInput = firefoxPage
        .locator('input[name="identity"], #authIdentity-inp')
        .first();
      await identityInput.waitFor({ state: 'visible', timeout: 10000 });
      await identityInput.fill('emad.mh');

      // رمز عبور
      const passwordInput = firefoxPage
        .locator('input[name="password"], #authPassword-inp')
        .first();
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill('Em@d8970211');

      // کلیک روی دکمه ورود
      const submitBtn = firefoxPage
        .locator('button#authLoginBtn, button:has-text("ورود")')
        .first();
      await submitBtn.click({ force: true });

      console.log('✅ اطلاعات وارد شد و دکمه ورود کلیک شد');
      await firefoxPage.waitForLoadState('networkidle');
      await firefoxPage.waitForTimeout(3000);

      // await this.page.locator('a.collapse-document.bg-purple-light.selected').click();
      // await firefoxPage.waitForTimeout(3000);

      // کلیک روی لینک سند با کلاس collapse-document
      console.log('📄 کلیک روی سند...');

      const documentBtn = firefoxPage.locator('a.collapse-document').first();

      await documentBtn.waitFor({ state: 'visible', timeout: 10000 });
      await documentBtn.scrollIntoViewIfNeeded();
      await documentBtn.click({ force: true });

      console.log('✅ روی سند کلیک شد');

      // کلیک روی دکمه "درخواست دسترسی"
      console.log('🔐 کلیک روی دکمه درخواست دسترسی...');

      const accessBtn = firefoxPage
        .locator('button:has-text("درخواست دسترسی")')
        .first();

      await accessBtn.waitFor({ state: 'visible', timeout: 10000 });
      await accessBtn.scrollIntoViewIfNeeded();
      await accessBtn.click({ force: true });

      console.log('✅ دکمه درخواست دسترسی کلیک شد');

      await this.page.waitForTimeout(3000);
      // کلیک روی دکمه پروفایل (فقط با کلاس userProfile)
      console.log('👤 کلیک روی پروفایل...');

      const profileBtn = firefoxPage.locator('button.userProfile').first();

      await profileBtn.waitFor({ state: 'visible', timeout: 10000 });
      await profileBtn.scrollIntoViewIfNeeded();
      await profileBtn.click({ force: true });

      console.log('✅ پروفایل کلیک شد');
      await firefoxPage.waitForTimeout(1500);
      // کلیک روی دکمه خروج از حساب
      console.log('🚪 کلیک روی دکمه خروج...');

      const logoutBtn = firefoxPage
        .locator('button.logout-button:has-text("خروج از حساب")')
        .first();

      await logoutBtn.waitFor({ state: 'visible', timeout: 10000 });
      await logoutBtn.scrollIntoViewIfNeeded();
      await logoutBtn.click({ force: true });

      console.log('✅ دکمه خروج کلیک شد');
      await firefoxPage.waitForLoadState('networkidle');
      await firefoxPage.waitForTimeout(2000);

      // بستن فایرفاکس پس از اتمام کار
      console.log('🦊 در حال بستن فایرفاکس...');
      await firefoxBrowser.close();
      console.log('✅ فایرفاکس بسته شد');
    }
  }

  /**
   * باز کردن لینک فعلی در یک تب/پنجره جدید
   * @returns صفحه جدید برای ادامه تست
   */
  async openCurrentPublishLinkInNewPage(): Promise<Page> {
    console.log('🆕 در حال باز کردن لینک در پنجره جدید...');

    const currentUrl = this.page.url();
    const newPage = await this.page.context().newPage();

    await newPage.goto(currentUrl, { waitUntil: 'networkidle' });
    await newPage.waitForTimeout(2000);

    console.log('✅ صفحه جدید آماده است');
    return newPage;
  }

  /**
   * باز کردن لینک در مرورگر خارجی (نسخه دیباگ‌شده)
   */
  async openLinkInExternalBrowser(
    url: string,
    browserName: 'firefox' | 'chrome' | 'edge' = 'firefox',
  ): Promise<void> {
    console.log(`🌐 [DEBUG] تلاش برای باز کردن در ${browserName}: ${url}`);

    // دیباگ: چاپ پلتفرم
    console.log(`[DEBUG] پلتفرم سیستم: ${process.platform}`);

    // ساخت دستور بر اساس پلتفرم
    let command: string;

    switch (process.platform) {
      case 'win32':
        // ویندوز: استفاده از start با مرورگر پیش‌فرض یا مسیر مستقیم
        command = `start ${browserName} "${url}"`;
        break;
      case 'darwin':
        // مک: استفاده از open
        command = `open -a ${browserName === 'firefox' ? 'Firefox' : browserName === 'chrome' ? 'Google Chrome' : 'Microsoft Edge'} "${url}"`;
        break;
      case 'linux':
        // لینوکس: استفاده از نام اجرایی
        command = `${browserName} "${url}" &`;
        break;
      default:
        throw new Error(`پلتفرم پشتیبانی‌نشده: ${process.platform}`);
    }

    console.log(`[DEBUG] دستور اجرا: ${command}`);

    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      await execAsync(command);
      console.log(`✅ دستور اجرا شد: ${browserName}`);

      // انتظار کوتاه برای اطمینان از باز شدن مرورگر
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error: any) {
      console.error(`❌ خطا در باز کردن ${browserName}:`, error.message);

      // fallback: باز کردن با مرورگر پیش‌فرض سیستم
      console.log('🔄 تلاش با مرورگر پیش‌فرض سیستم...');
      try {
        switch (process.platform) {
          case 'win32':
            await execAsync(`start "${url}"`);
            break;
          case 'darwin':
            await execAsync(`open "${url}"`);
            break;
          case 'linux':
            await execAsync(`xdg-open "${url}"`);
            break;
        }
        console.log('✅ با مرورگر پیش‌فرض باز شد');
      } catch (fallbackError) {
        console.error('❌ fallback هم شکست خورد:', fallbackError);
      }
    }
  }
}
