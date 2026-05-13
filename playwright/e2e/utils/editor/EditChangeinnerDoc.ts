import { expect, Locator, Page } from '@playwright/test';
import clipboard from 'clipboardy';
import * as path from 'path';


/**
 * کلاس مدیریت ویرایش مخزن در سیستم
 * این کلاس شامل توابع مورد نیاز برای ویرایش مخزن است
 */



export class EditDocument {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ویرایش سند
   */
  async editDocument(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    // Wait for any potential overlays to disappear
    await this.page.waitForTimeout(3000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();

    // Try to click with retry mechanism
    let clickSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!clickSuccess && attempts < maxAttempts) {
      try {
        // First try normal click
        await menuButton.click({ timeout: 5000 });
        clickSuccess = true;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          // Last attempt: try to force click through any overlays
          try {
            await menuButton.click({ force: true, timeout: 10000 });
            clickSuccess = true;
          } catch (forceError) {
            throw new Error(
              `Failed to click menu button after ${maxAttempts} attempts and force click: ${forceError}`,
            );
          }
        }
        await this.page.waitForTimeout(1000);
      }
    }

    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    const editButton = this.page.locator('button[role="menuitem"]').nth(0);
    await expect(editButton).toBeVisible();
    await editButton.click();

    const ediitButton = this.page.locator('button.document-edit-content');
    await expect(ediitButton).toBeVisible();
    await ediitButton.click();

    await this.page.waitForTimeout(5000); // کاهش تاخیر
    const frame = this.page.frameLocator('iframe');
    const editor = frame.locator(
      '.ck-editor__editable:not(.ck-editor__nested-editable)',
    );

    await editor.click();
    await editor.fill(`الی ناز دار خوشگل
    
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
   
   الی نازدار خوشگل
    `);

    // انتخاب متن ساده‌تر برای جلوگیری از timeout
    await this.selectText('الی ناز دار خوشگل');

    // درج خط افقی بلافاصله پس از متن
    await this.clickRightAlignToolbarButton();
    await this.clickLinkButton();
    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    //await this.clickSelectAllButton();
    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    //await this.clickPageBreakButton();
    //await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    //await this.uploadAttachedFile();
    //await this.clickBlockQuote();
    //await this.clickEnableEditButton();
    //await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    //await this.clickSourceButton();
    //await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    //await this.manageClasorContents();
    //await this.uploadDocx(path.resolve(process.cwd(), 'e2e', 'assets', 'sample.docx'));
    // await this.toggleSuperscript();
    // await this.toggleSubscript();
    // await this.insertSpecialCharacter();
    // await this.clickNumberedListButton();
    // await this.clickInsertTableButton();
    // await this.insertChart();
    //await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    //await this.clickUndoButton();
    // await this.uploadExcelFile();
    // await this.insertCodeBlock();
    // await this.uploadImage(path.resolve(process.cwd(), 'e2e', 'assets', 'picture.jpg'),);
    //await this.clickSwaggerButton();

    await this.page.waitForTimeout(2000); // کاهش تاخیر
  }

  /**
   * کلیک روی «راست چین» با نام جدید: clickRightAlignToolbarButton
   */
  async clickRightAlignToolbarButton(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // تلاش اول: دکمه مستقیم در نوار ابزار
    const directRight = frame.getByRole('button', { name: 'راست چین' });
    try {
      await expect(directRight).toBeVisible({ timeout: 1500 });
      await directRight.click();
      await this.page.waitForTimeout(300);
      return;
    } catch {
      // ادامه به باز کردن دراپ‌داون «تراز متن»
    }

    // باز کردن دراپ‌داون «تراز متن»
    const alignmentDropdown = frame
      .locator('.ck-alignment-dropdown')
      .filter({ hasText: 'تراز متن' });
    const dropdownButton = alignmentDropdown.locator('.ck-dropdown__button');
    await expect(dropdownButton).toBeVisible({ timeout: 10000 });
    await dropdownButton.click();
    await this.page.waitForTimeout(300);

    // ابتدا با Role
    const rightByRole = frame.getByRole('button', { name: 'راست چین' });
    try {
      await expect(rightByRole).toBeVisible({ timeout: 5000 });
      await rightByRole.click();
    } catch {
      // سپس با متن در دکمه‌های داخل پنل
      const rightByText = frame
        .locator('.ck-alignment-dropdown .ck-dropdown__panel button.ck-button')
        .filter({ hasText: 'راست چین' })
        .first();
      await expect(rightByText).toBeVisible({ timeout: 10000 });
      await rightByText.click();
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * تغییر فونت به ایران نستعلیق
   */
  async changeToIranNastaliq(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    const fontButton = frame.locator(
      '.ck-font-family-dropdown .ck-dropdown__button',
    );
    await expect(fontButton).toBeVisible({ timeout: 10000 });
    await fontButton.click();
    await this.page.waitForTimeout(1000);

    const iranNastaliqOption = frame.locator('button:has-text("IranNastaliq")');
    await expect(iranNastaliqOption).toBeVisible({ timeout: 10000 });
    await iranNastaliqOption.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * تغییر اندازه فونت به صورت تصادفی از دراپ‌داون اندازه فونت
   */
  async changeFontSizeRandom(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    const sizeDropdownButton = frame.locator(
      '.ck-font-size-dropdown .ck-dropdown__button',
    );
    await expect(sizeDropdownButton).toBeVisible({ timeout: 10000 });
    await sizeDropdownButton.click();
    await this.page.waitForTimeout(500);

    // جمع‌آوری گزینه‌های قابل کلیک اندازه فونت
    const options = frame.locator(
      '.ck-font-size-dropdown .ck-dropdown__panel button.ck-button',
    );

    await expect(options.first()).toBeVisible({ timeout: 10000 });
    const count = await options.count();

    // حداقل باید یک گزینه وجود داشته باشد
    expect(count).toBeGreaterThan(0);

    // انتخاب تصادفی یکی از گزینه‌ها
    const randomIndex = Math.floor(Math.random() * count);
    const randomOption = options.nth(randomIndex);

    await randomOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * انتخاب متن در ادیتور - نسخه بهینه شده
   */
  async selectText(textToSelect: string): Promise<void> {
    try {
      const frame = this.page.frameLocator('iframe');

      // پیدا کردن ادیتور
      const editor = frame.locator(
        '.ck-editor__editable:not(.ck-editor__nested-editable)',
      );

      // کلیک روی ادیتور
      await editor.click({ timeout: 5000 });

      // انتخاب کل متن موجود
      await this.page.keyboard.press('Control+a');
      await this.page.waitForTimeout(200);
    } catch (error) {
      console.log('خطا در انتخاب متن:', error);
      // اگر مشکلی پیش آمد، ادامه بده
    }
  }

  /**
   * تغییر رنگ فونت بر اساس نام گزینه (مثلاً «زرد»)
   */
  async changeTextColorByName(colorName: string): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    const textColorDropdown = frame
      .locator('.ck-color-ui-dropdown')
      .filter({ hasText: 'رنگ فونت' });
    await expect(textColorDropdown).toBeVisible({ timeout: 10000 });
    const dropdownButton = textColorDropdown.locator('.ck-dropdown__button');

    await dropdownButton.click();
    await this.page.waitForTimeout(300);

    // پیدا کردن کاشی بر اساس متن برچسب (نام رنگ)
    let targetTile = frame
      .locator('.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile')
      .filter({ hasText: colorName });

    // اگر بار اول پیدا نشد، یک‌بار دیگر باز/بسته می‌کنیم
    if ((await targetTile.count()) === 0) {
      await dropdownButton.click();
      await this.page.waitForTimeout(300);
      await dropdownButton.click();
      await this.page.waitForTimeout(300);
      targetTile = frame
        .locator('.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile')
        .filter({ hasText: colorName });
    }

    await expect(targetTile.first()).toBeVisible({ timeout: 10000 });
    await targetTile.first().click();
    await this.page.waitForTimeout(300);
  }

  /**
   * تغییر رنگ پس‌زمینه فونت بر اساس نام گزینه (مثلاً «زرد»)
   */
  async changeBackgroundColorByName(colorName: string): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    const bgDropdown = frame
      .locator('.ck-color-ui-dropdown')
      .filter({ hasText: 'رنگ پس زمینه فونت' });
    await expect(bgDropdown).toBeVisible({ timeout: 10000 });
    const dropdownButton = bgDropdown.locator('.ck-dropdown__button');

    await dropdownButton.click();
    await this.page.waitForTimeout(300);

    let targetTile = frame
      .locator('.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile')
      .filter({ hasText: colorName });

    if ((await targetTile.count()) === 0) {
      await dropdownButton.click();
      await this.page.waitForTimeout(300);
      await dropdownButton.click();
      await this.page.waitForTimeout(300);
      targetTile = frame
        .locator('.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile')
        .filter({ hasText: colorName });
    }

    await expect(targetTile.first()).toBeVisible({ timeout: 10000 });
    await targetTile.first().click();
    await this.page.waitForTimeout(300);
  }

  /**
   * اعمال/لغو حالت خط‌خورده روی متن انتخاب‌شده
   */
  async toggleStrikethrough(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // دکمه «خط خورده» را بر اساس برچسب آن پیدا می‌کنیم
    const strikeButton = frame
      .locator('button.ck-button')
      .filter({ hasText: 'خط خورده' });

    await expect(strikeButton).toBeVisible({ timeout: 10000 });
    await strikeButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * اعمال/لغو حالت خط زیر روی متن انتخاب‌شده
   */
  async toggleUnderline(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // دکمه «خط زیر» را بر اساس برچسب آن پیدا می‌کنیم
    const underlineButton = frame
      .locator('button.ck-button')
      .filter({ hasText: 'خط زیر' });

    await expect(underlineButton).toBeVisible({ timeout: 10000 });
    await underlineButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * اعمال/لغو حالت کج (Italic) روی متن انتخاب‌شده
   */
  async toggleItalic(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // دکمه «کج» را بر اساس برچسب آن پیدا می‌کنیم
    const italicButton = frame
      .locator('button.ck-button')
      .filter({ hasText: 'کج' });

    await expect(italicButton).toBeVisible({ timeout: 10000 });
    await italicButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * اعمال/لغو حالت درشت (Bold) روی متن انتخاب‌شده
   */
  async toggleBold(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // دکمه «درشت» را بر اساس برچسب آن پیدا می‌کنیم
    const boldButton = frame
      .locator('button.ck-button')
      .filter({ hasText: 'درشت' });

    await expect(boldButton).toBeVisible({ timeout: 10000 });
    await boldButton.click();
    await this.page.waitForTimeout(300);
  }

  //* Locator دکمه «چپ چین» در ادیتور (نام جدید: getLeftAlignToolbarButton)
  //*
  getLeftAlignToolbarButton(): Locator {
    const frame = this.page.frameLocator('iframe');
    const byRole = frame.getByRole('button', { name: 'چپ چین' });
    const byText = frame
      .locator('button.ck-button')
      .filter({ hasText: 'چپ چین' })
      .first();
    return byRole.or(byText);
  }
  /**
   * تغییر تراز متن به صورت تصادفی از دراپ‌داون «تراز متن»
   */
  async changeAlignmentRandom(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // دراپ‌داون «تراز متن» را با متن برچسب پیدا می‌کنیم
    const alignmentDropdown = frame
      .locator('.ck-alignment-dropdown')
      .filter({ hasText: 'تراز متن' });

    const dropdownButton = alignmentDropdown.locator('.ck-dropdown__button');
    await expect(dropdownButton).toBeVisible({ timeout: 10000 });
    await dropdownButton.click();
    await this.page.waitForTimeout(300);

    // گزینه‌های تراز ممکن است به صورت دکمه‌های داخل پنل رندر شوند
    let options = frame.locator(
      '.ck-alignment-dropdown .ck-dropdown__panel button.ck-button',
    );
    let count = await options.count();

    // در صورت عدم رندر در تلاش اول، یکبار دیگر تلاش می‌کنیم
    if (count === 0) {
      await dropdownButton.click();
      await this.page.waitForTimeout(300);
      options = frame.locator(
        '.ck-alignment-dropdown .ck-dropdown__panel button.ck-button',
      );
      count = await options.count();
    }

    expect(count).toBeGreaterThan(0);
    const randomIndex = Math.floor(Math.random() * count);
    const randomOption = options.nth(randomIndex);
    await expect(randomOption).toBeVisible({ timeout: 10000 });
    await randomOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * تنظیم تراز متن روی «تراز وسط»
   */
  async alignCenter(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    const alignmentDropdown = frame
      .locator('.ck-alignment-dropdown')
      .filter({ hasText: 'تراز متن' });

    const dropdownButton = alignmentDropdown.locator('.ck-dropdown__button');
    await expect(dropdownButton).toBeVisible({ timeout: 10000 });
    await dropdownButton.click();
    await this.page.waitForTimeout(300);

    // گزینه «تراز وسط» را مستقیماً انتخاب می‌کنیم
    const centerOption = frame.locator('button.ck-button', {
      hasText: 'تراز وسط',
    });
    await expect(centerOption).toBeVisible({ timeout: 10000 });
    await centerOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * اعمال/لغو حالت بالانویس (Superscript) روی متن انتخاب‌شده
   */
  async toggleSuperscript(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // باز کردن منوی «گزینه‌های بیشتر» برای دسترسی به دکمه بالانویس
    const moreOptions = frame
      .locator(
        'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
      )
      .first();
    await expect(moreOptions).toBeVisible({ timeout: 5000 });
    await moreOptions.click();
    await this.page.waitForTimeout(300);

    // دکمه «بالانویس» را بر اساس برچسب آن پیدا می‌کنیم
    const superscriptButton = frame
      .locator('button.ck-button')
      .filter({ hasText: 'بالانویس' });

    await expect(superscriptButton).toBeVisible({ timeout: 5000 });
    await superscriptButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * کلیک روی دکمه پیوند در ادیتور و پر کردن فیلد URL
   */
  async clickLinkButton(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // جستجوی دکمه پیوند با استفاده از tooltip text
    const linkButton = frame.locator(
      'button[data-cke-tooltip-text="پیوند (Ctrl+K)"]',
    );

    await expect(linkButton).toBeVisible({ timeout: 10000 });
    await linkButton.click();

    console.log('دکمه پیوند کلیک شد');

    // انتظار برای باز شدن دیالوگ پیوند
    await this.page.waitForTimeout(1000);

    // پیدا کردن فیلد URL و پر کردن آن
    const urlInput = frame.locator('input[type="text"][inputmode="url"]');
    await expect(urlInput).toBeVisible({ timeout: 5000 });

    const linkUrl = 'https://zhikanwomen.com/product/0501226/';
    await urlInput.fill(linkUrl);

    console.log('فیلد URL با لینک پر شد:', linkUrl);

    // کلیک روی دکمه ذخیره (تیک سبز)
    const saveButton = frame.locator('button[data-cke-tooltip-text="ذخیره"]');
    await expect(saveButton).toBeVisible({ timeout: 5000 });
    await saveButton.click();

    console.log('دکمه ذخیره کلیک شد');

    // انتظار برای تکمیل فرآیند
    await this.page.waitForTimeout(1000);
  }

  /**
   * درج لیست عددی با انتخاب تصادفی نوع شماره‌گذاری
   */
  async insertNumberedListRandom(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // باز کردن منوی «گزینه‌های بیشتر» برای دسترسی به دکمه درج جدول اکسل
    const moreOptions = frame
      .locator(
        'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
      )
      .first();
    await expect(moreOptions).toBeVisible({ timeout: 5000 });
    await moreOptions.click();
    await this.page.waitForTimeout(500);

    // پیدا کردن دراپ‌داون لیست عددی
    const numberedListDropdown = frame.locator('.ck-list-styles-dropdown');
    await expect(numberedListDropdown).toBeVisible({ timeout: 10000 });

    // کلیک روی فلش دراپ‌داون برای باز کردن منو
    const dropdownArrow = numberedListDropdown.locator(
      '.ck-splitbutton__arrow',
    );
    await expect(dropdownArrow).toBeVisible({ timeout: 10000 });
    await dropdownArrow.click();
    await this.page.waitForTimeout(500);

    // جمع‌آوری گزینه‌های مختلف لیست عددی
    const listStyleButtons = frame.locator(
      '.ck-list-styles-list button.ck-button',
    );
    await expect(listStyleButtons.first()).toBeVisible({ timeout: 10000 });

    const count = await listStyleButtons.count();
    expect(count).toBeGreaterThan(0);

    // انتخاب تصادفی یکی از گزینه‌ها
    const randomIndex = Math.floor(Math.random() * count);
    const randomOption = listStyleButtons.nth(randomIndex);

    await expect(randomOption).toBeVisible({ timeout: 10000 });
    await randomOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * کلیک روی دکمه اصلی لیست عددی (بدون باز کردن دراپ‌داون)
   */
  async clickNumberedListButton(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // پیدا کردن دکمه لیست عددی با استفاده از tooltip text
    const numberedListButton = frame.locator(
      '.ck-list-styles-dropdown .ck-splitbutton__action[data-cke-tooltip-text="لیست عددی"]',
    );
    await expect(numberedListButton).toBeVisible({ timeout: 10000 });
    await numberedListButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * درج نمودار در ادیتور
   * تلاش می‌کند دکمه «نمودار» را پیدا و کلیک کند و سپس با دیالوگ پیش‌فرض ادامه دهد
   */
  async insertChart(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // باز کردن منوی «گزینه‌های بیشتر» برای دسترسی به دکمه درج جدول اکسل
    const moreOptions = frame
      .locator(
        'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
      )
      .first();
    await expect(moreOptions).toBeVisible({ timeout: 5000 });
    await moreOptions.click();
    await this.page.waitForTimeout(500);

    // تلاش اول: دکمه «نمودار» به صورت مستقیم در نوار ابزار (بر اساس tooltip)
    let chartButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="نمودار"]',
    );

    // اگر یافت نشد، از متن دکمه استفاده می‌کنیم
    if ((await chartButton.count()) === 0) {
      chartButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'نمودار' });
    }

    // اگر همچنان پیدایش نکرد، منوی گزینه‌های بیشتر را باز می‌کنیم و دوباره جستجو می‌کنیم
    if ((await chartButton.count()) === 0) {
      const moreOptions = frame
        .locator(
          'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
        )
        .first();
      await expect(moreOptions).toBeVisible({ timeout: 10000 });
      await moreOptions.click();
      await this.page.waitForTimeout(300);

      chartButton = frame.locator(
        'button.ck-button[data-cke-tooltip-text="نمودار"]',
      );
      if ((await chartButton.count()) === 0) {
        chartButton = frame
          .locator('button.ck-button')
          .filter({ hasText: 'نمودار' });
      }
    }

    await expect(chartButton.first()).toBeVisible({ timeout: 10000 });
    await chartButton.first().click();
    await this.page.waitForTimeout(300);

    // صبر برای ظاهر شدن فرم دیالوگ (داخل فریم یا بیرون)
    const dialogFormInFrame = frame.locator('form.dialog-content__form');
    const dialogFormOnPage = this.page.locator('form.dialog-content__form');
    const container = (await dialogFormInFrame.count())
      ? dialogFormInFrame
      : dialogFormOnPage;

    // Check if dialog form exists, if not, skip chart configuration
    if ((await container.count()) > 0) {
      await expect(container.first()).toBeVisible({ timeout: 5000 });
      const height = 80;

      // انتخاب نوع نمودار
      await container.locator('select[name="type"]').selectOption('bar');

      // پر کردن ارتفاع
      await container.locator('input[name="height"]').fill(height.toString());

      // پر کردن مقدارها و برچسب‌ها
      for (let i = 1; i <= 8; i++) {
        const value = Math.floor(height * (0.3 + 0.05 * i));
        const label = `برچسب ${i}`;
        await container.locator(`input[name="val${i}"]`).fill(value.toString());
        await container.locator(`input[name="tag${i}"]`).fill(label);
      }
    } else {
      console.log('Chart dialog form not found, skipping configuration');
    }

    // اگر دیالوگ پیکربندی نمودار باز شد، یک گزینه پیش‌فرض را تایید می‌کنیم
    const dialog = this.page.locator('.dialog-content');
    if (await dialog.count()) {
      const submitInFrame = frame.locator('button.dialog-content__submit');
      const submitOnPage = this.page.locator('button.dialog-content__submit');

      if (await submitInFrame.count()) {
        try {
          await expect(submitInFrame).toBeEnabled({ timeout: 5000 });
          await submitInFrame.click();
        } catch {
          // نادیده می‌گیریم و گزینه بیرون فریم را امتحان می‌کنیم
        }
      }

      if (await submitOnPage.count()) {
        try {
          await expect(submitOnPage).toBeEnabled({ timeout: 5000 });
          await submitOnPage.click();
        } catch {
          // در صورت نبودن دکمه فعال، ادامه می‌دهیم
        }
      }
    }
    // کلیک روی دکمه تایید (داخل فریم یا بیرون)
    const submitInFrame = frame.locator('button.dialog-content__submit');
    const submitOnPage = this.page.locator('button.dialog-content__submit');
    if (await submitInFrame.count()) {
      await submitInFrame.click();
    } else if (await submitOnPage.count()) {
      await submitOnPage.click();
    }

    await this.page.waitForTimeout(500);
  }

  /**
   * کلیک روی عنصر tbody جدول لیست فایل‌ها برای اعمال فوکوس/انتخاب
   */
  async clickFileTableTbody(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // اولویت: tbody داخل دیالوگ در فریم با جدول فایل‌ها
    let tbody = frame.locator('.dialog-content table.file-list__table tbody');
    if ((await tbody.count()) === 0) {
      // tbody داخل دیالوگ روی صفحه
      tbody = this.page.locator('.dialog-content table.file-list__table tbody');
    }
    if ((await tbody.count()) === 0) {
      // هر tbody جدول فایل‌ها در فریم
      tbody = frame.locator('table.file-list__table tbody');
    }
    if ((await tbody.count()) === 0) {
      // fallback: هر tbody داخل دیالوگ
      tbody = frame.locator('.dialog-content tbody');
      if ((await tbody.count()) === 0) {
        tbody = this.page.locator('.dialog-content tbody');
      }
    }
    if ((await tbody.count()) === 0) {
      // fallback نهایی: هر tbody موجود
      tbody = frame.locator('table tbody');
      if ((await tbody.count()) === 0) {
        tbody = this.page.locator('table tbody');
      }
    }

    await tbody.first().waitFor({ state: 'visible', timeout: 10000 });
    const target = tbody.first();
    await target.scrollIntoViewIfNeeded();
    try {
      await target.click({ timeout: 2000 });
    } catch {
      try {
        await target.click({ force: true, timeout: 2000 });
      } catch {
        try {
          await target.evaluate((el: HTMLElement) => el.click());
        } catch {
          const box = await target.boundingBox();
          if (box) {
            await this.page.mouse.move(
              box.x + box.width / 2,
              box.y + box.height / 2,
            );
            await this.page.mouse.down();
            await this.page.mouse.up();
          }
        }
      }
    }

    await this.page.waitForTimeout(200);
  }

  /**
   * درج خط افقی پس از متن جاری از طریق دکمه «خط افقی»
   */
  async insertHorizontalRule(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // تلاش اول: اگر دکمه «خط افقی» مستقیم در نوار ابزار قابل مشاهده بود، همان را کلیک کن
    const hrDirect = frame.getByRole('button', { name: 'خط افقی' });
    try {
      await expect(hrDirect).toBeVisible({ timeout: 1500 });
      await hrDirect.scrollIntoViewIfNeeded();
      await hrDirect.click({ trial: true }).catch(() => {});
      await hrDirect.click({ force: true });
      await this.page.waitForTimeout(300);
      return;
    } catch {
      // نادیده بگیر و به سناریوی باز کردن منوی «گزینه‌های بیشتر» برو
    }

    // تلاش دوم: باز کردن منوی «گزینه‌های بیشتر» و کلیک روی «خط افقی» از داخل منو
    const moreOptions = frame
      .locator(
        'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
      )
      .first();
    await expect(moreOptions).toBeVisible({ timeout: 10000 });
    await moreOptions.click();
    await this.page.waitForTimeout(300);

    // سعی کن با نقش پیدا کنی (پایدارتر)
    const hrButtonByRole = frame.getByRole('button', { name: 'خط افقی' });
    try {
      await expect(hrButtonByRole).toBeVisible({ timeout: 5000 });
      await hrButtonByRole.scrollIntoViewIfNeeded();
      await hrButtonByRole.click({ trial: true }).catch(() => {});
      await hrButtonByRole.click({ force: true });
    } catch {
      //Fallback با استفاده از متن داخل دکمه‌ها
      const hrButtonByText = frame
        .locator('button.ck-button')
        .filter({ hasText: 'خط افقی' })
        .first();
      await expect(hrButtonByText).toBeVisible({ timeout: 10000 });
      await hrButtonByText.scrollIntoViewIfNeeded();
      await hrButtonByText.click({ trial: true }).catch(() => {});
      await hrButtonByText.click({ force: true });
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * کلیک روی دکمه کاراکترهای ویژه و انتخاب یک کاراکتر
   */
  async insertSpecialCharacter(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // باز کردن منوی «گزینه‌های بیشتر» در صورت نیاز
    const moreOptions = frame
      .locator(
        'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
      )
      .first();
    try {
      await moreOptions.waitFor({ state: 'visible', timeout: 2000 });
      await moreOptions.click();
      await this.page.waitForTimeout(300);
    } catch {
      // اگر نبود، مشکلی نیست
    }

    // پیدا کردن دکمه کاراکترهای ویژه
    let specialCharButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="کاراکترهای ویژه"]',
    );
    if ((await specialCharButton.count()) === 0) {
      specialCharButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'کاراکترهای ویژه' });
    }

    await expect(specialCharButton.first()).toBeVisible({ timeout: 10000 });
    await specialCharButton.first().click();
    await this.page.waitForTimeout(500);

    // انتخاب اولین کاراکتر موجود در grid
    const characterTile = frame
      .locator('button.ck-character-grid__tile')
      .first();
    await expect(characterTile).toBeVisible({ timeout: 5000 });
    await characterTile.click();
    await this.page.waitForTimeout(300);

    // کلیک روی دکمه بستن
    const closeButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="بستن"]',
    );
    await expect(closeButton).toBeVisible({ timeout: 5000 });
    await closeButton.click();
    await this.page.waitForTimeout(300);

    console.log('کاراکتر ویژه اضافه شد و دیالوگ بسته شد');
  }

  /**
   * تغییر فونت به B Nazanin
   */
  async changeToBNazanin(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // استفاده از selector مخصوص برای جلوگیری از تداخل با سلول‌های جدول
    const editor = frame.locator(
      '.ck-editor__editable:not(.ck-editor__nested-editable)',
    );

    // اطمینان از آماده بودن ادیتور
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();

    // تایپ کردن متن کوتاه
    await editor.fill(`  الی ناز دار خوشگل
    
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
   
   الی نازدار خوشگل `);

    const fontButton = frame.locator(
      '.ck-font-family-dropdown .ck-dropdown__button',
    );
    await expect(fontButton).toBeVisible({ timeout: 5000 });
    await fontButton.click();
    await this.page.waitForTimeout(1000);

    const bNazaninOption = frame.locator('button:has-text("B Nazanin")');
    await expect(bNazaninOption).toBeVisible({ timeout: 3000 });
    await bNazaninOption.click();
    await this.page.waitForTimeout(3000);
  }

  /**
   * کلیک روی دکمه "انتخاب همه" در ادیتور
   */
  async clickSelectAllButton(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    console.log('شروع جستجو برای دکمه انتخاب همه...');

    // روش 1: جستجو مستقیم در toolbar بدون باز کردن منوی بیشتر
    let selectAllButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="انتخاب همه (Ctrl+A)"]',
    );

    if ((await selectAllButton.count()) === 0) {
      console.log('دکمه با tooltip پیدا نشد، جستجو با متن...');
      selectAllButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'انتخاب همه' });
    }

    if ((await selectAllButton.count()) === 0) {
      console.log('دکمه با متن پیدا نشد، جستجو با role...');
      selectAllButton = frame.getByRole('button', { name: 'انتخاب همه' });
    }

    if ((await selectAllButton.count()) === 0) {
      console.log('دکمه با role پیدا نشد، جستجو با aria-label...');
      selectAllButton = frame
        .locator('button[aria-labelledby*="ck-editor__aria-label"]')
        .filter({ hasText: 'انتخاب همه' });
    }

    // اگر هنوز پیدا نشد، منوی بیشتر را باز می‌کنیم
    if ((await selectAllButton.count()) === 0) {
      console.log('دکمه در toolbar اصلی پیدا نشد، باز کردن منوی بیشتر...');
      const moreOptions = frame
        .locator(
          'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
        )
        .first();

      try {
        await moreOptions.waitFor({ state: 'visible', timeout: 3000 });
        await moreOptions.click();
        await this.page.waitForTimeout(500);

        // جستجو مجدد در منوی باز شده
        selectAllButton = frame.locator(
          'button.ck-button[data-cke-tooltip-text="انتخاب همه (Ctrl+A)"]',
        );

        if ((await selectAllButton.count()) === 0) {
          selectAllButton = frame
            .locator('button.ck-button')
            .filter({ hasText: 'انتخاب همه' });
        }
      } catch (error) {
        console.log('خطا در باز کردن منوی بیشتر:', error);
      }
    }

    // اگر هنوز پیدا نشد، از کلیدهای میانبر استفاده می‌کنیم
    if ((await selectAllButton.count()) === 0) {
      console.log('دکمه انتخاب همه پیدا نشد، استفاده از Ctrl+A...');
      const editor = frame.locator(
        '.ck-editor__editable:not(.ck-editor__nested-editable)',
      );
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.waitForTimeout(500);
      console.log('انتخاب همه با Ctrl+A انجام شد');
      return;
    }

    // کلیک روی دکمه پیدا شده
    try {
      await expect(selectAllButton.first()).toBeVisible({ timeout: 5000 });
      await selectAllButton.first().scrollIntoViewIfNeeded();
      await selectAllButton.first().click({ force: true });
      await this.page.waitForTimeout(500);
      console.log('دکمه انتخاب همه با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه انتخاب همه:', error);
      // Fallback: استفاده از Ctrl+A
      const editor = frame.locator(
        '.ck-editor__editable:not(.ck-editor__nested-editable)',
      );
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.waitForTimeout(500);
      console.log('انتخاب همه با Ctrl+A انجام شد (fallback)');
    }

    // کلیک روی دکمه ذخیره
    console.log('شروع جستجو برای دکمه ذخیره...');

    // جستجوی دکمه ذخیره قابل مشاهده (بدون کلاس !hidden)
    let saveButton = this.page
      .locator('button.editor-footer__save-button:not([class*="!hidden"])')
      .filter({ hasText: 'ذخیره' });

    // اگر دکمه پیدا نشد، دکمه قابل مشاهده را با کلاس‌های بیشتر جستجو کن
    if ((await saveButton.count()) === 0) {
      saveButton = this.page
        .locator('button.editor-footer__save-button')
        .filter({ hasText: 'ذخیره' })
        .filter({ hasNot: this.page.locator('[class*="!hidden"]') });
    }

    // اگر هنوز پیدا نشد، دکمه با bg-primary-normal و متن ذخیره
    if ((await saveButton.count()) === 0) {
      saveButton = this.page
        .locator('button.bg-primary-normal')
        .filter({ hasText: 'ذخیره' });
    }

    // اگر هنوز پیدا نشد، هر دکمه با متن ذخیره و رنگ سفید
    if ((await saveButton.count()) === 0) {
      saveButton = this.page
        .locator('button')
        .filter({ hasText: 'ذخیره' })
        .filter({ has: this.page.locator('p.text-white') });
    }

    // اگر هنوز پیدا نشد، هر دکمه با متن ذخیره
    if ((await saveButton.count()) === 0) {
      saveButton = this.page.locator('button').filter({ hasText: 'ذخیره' });
    }

    try {
      await expect(saveButton.first()).toBeVisible({ timeout: 10000 });
      await saveButton.first().scrollIntoViewIfNeeded();
      await saveButton.first().click({ force: true });
      await this.page.waitForTimeout(1000);
      console.log('دکمه ذخیره با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه ذخیره:', error);

      // تلاش با روش‌های جایگزین
      try {
        const alternativeSaveButton = this.page
          .locator('button[type="button"]')
          .filter({ hasText: 'ذخیره' });
        await expect(alternativeSaveButton.first()).toBeVisible({
          timeout: 5000,
        });
        await alternativeSaveButton.first().click({ force: true });
        await this.page.waitForTimeout(1000);
        console.log('دکمه ذخیره با روش جایگزین کلیک شد');
      } catch (altError) {
        console.log('خطا در کلیک جایگزین روی دکمه ذخیره:', altError);
      }
    }
    await this.page.waitForTimeout(6000); // تاخیر ۱ ثانیه‌ای
    // کلیک روی دکمه بستن
    console.log('شروع جستجو برای دکمه بستن...');
    const closeButton = this.page.locator('button.close-button');

    try {
      await expect(closeButton).toBeVisible({ timeout: 10000 });
      await closeButton.click();
      await this.page.waitForTimeout(1000);
      console.log('دکمه بستن با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه بستن:', error);
    }
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    // Wait for any potential overlays to disappear
    await this.page.waitForTimeout(3000);

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();

    // Try to click with retry mechanism
    let clickSuccess = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!clickSuccess && attempts < maxAttempts) {
      try {
        // First try normal click
        await menuButton.click({ timeout: 5000 });
        clickSuccess = true;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          // Last attempt: try to force click through any overlays
          try {
            await menuButton.click({ force: true, timeout: 10000 });
            clickSuccess = true;
          } catch (forceError) {
            throw new Error(
              `Failed to click menu button after ${maxAttempts} attempts and force click: ${forceError}`,
            );
          }
        }
        await this.page.waitForTimeout(1000);
      }
    }

    const publicVersionButton = this.page.locator(
      'button.document-public-version',
    );
    await expect(publicVersionButton).toBeVisible({ timeout: 10000 });
    await publicVersionButton.click();

    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای

    // کلیک روی دکمه تایید
    console.log('شروع جستجو برای دکمه تایید...');
    const confirmButton = this.page
      .locator('button.dialog-footer__submit-button')
      .filter({ hasText: 'تایید' });

    try {
      await expect(confirmButton).toBeVisible({ timeout: 10000 });
      await confirmButton.click();
      await this.page.waitForTimeout(1000);
      console.log('دکمه تایید با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه تایید:', error);

      // تلاش با روش جایگزین
      try {
        const alternativeConfirmButton = this.page
          .locator('button')
          .filter({ hasText: 'تایید' })
          .filter({ has: this.page.locator('p.text-white') });
        await expect(alternativeConfirmButton).toBeVisible({ timeout: 5000 });
        await alternativeConfirmButton.click();
        await this.page.waitForTimeout(1000);
        console.log('دکمه تایید با روش جایگزین کلیک شد');
      } catch (altError) {
        console.log('خطا در کلیک جایگزین روی دکمه تایید:', altError);
      }
    }

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    // Wait for any potential overlays to disappear
    await this.page.waitForTimeout(3000);

    const menuButton2 = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton2).toBeVisible();

    // Try to click with retry mechanism
    let clickSuccess2 = false;
    let attempts2 = 0;
    const maxAttempts2 = 3;

    while (!clickSuccess2 && attempts2 < maxAttempts2) {
      try {
        // First try normal click
        await menuButton2.click({ timeout: 5000 });
        clickSuccess2 = true;
      } catch (error) {
        attempts2++;
        if (attempts2 >= maxAttempts2) {
          // Last attempt: try to force click through any overlays
          try {
            await menuButton2.click({ force: true, timeout: 10000 });
            clickSuccess2 = true;
          } catch (forceError) {
            throw new Error(
              `Failed to click menu button after ${maxAttempts2} attempts and force click: ${forceError}`,
            );
          }
        }
        await this.page.waitForTimeout(1000);
      }
    }

    await this.page.waitForTimeout(2000); // تاخیر ۲ ثانیه‌ای
    await this.page.waitForSelector(
      'button[role="menuitem"]:has-text("نسخه های سند")',
      { state: 'visible' },
    );
    await this.page
      .locator('button[role="menuitem"]:has-text("نسخه های سند")')
      .click();

    await this.page.waitForTimeout(5000);
    const versionMenuButton = this.page.locator('button.version-menu').nth(0);
    await versionMenuButton.waitFor({ state: 'visible' });
    await versionMenuButton.click();
    await this.page.waitForTimeout(2000);

    await this.page.locator('button.copy-version-hash').click();

    await this.page.waitForTimeout(2000);

    await this.page.locator('button.bg-primary-normal:has-text("ایجاد نسخه جدید")').click();

    await this.page.waitForTimeout(2000);

    const now = new Date();
    const formatted = now.toISOString().replace(/[:.]/g, '-');
    const versionName = `نسخه-${formatted}`;
    await this.page.locator('input[placeholder="نام نسخه"]').fill(versionName);

    await this.page.waitForTimeout(2000);

    await this.page.locator('button.dialog-footer__submit-button').click();


    await this.page.waitForTimeout(5000);
    const versionMeenuButton = this.page.locator('button.version-menu').nth(0);
    await versionMeenuButton.waitFor({ state: 'visible' });
    await versionMeenuButton.click();
    await this.page.waitForTimeout(2000);

    const editButton = this.page.locator('button.edit-version:has-text("ویرایش")');

    await expect(editButton).toBeVisible();
    await expect(editButton).toBeEnabled();
    await editButton.click();

    await this.page.waitForTimeout(5000); // کاهش تاخیر
    const internalFrame = this.page.frameLocator('iframe');
    const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');

    await editor.click();
    await editor.fill(`الی ناز دار خوشگل
    
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
   
   الی نازدار خوشگل
    `);

    // باز کردن منوی «گزینه‌های بیشتر» در صورت نیاز
    const moreOptions = internalFrame
    .locator(
      'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
    )
    .first();
  try {
    await moreOptions.waitFor({ state: 'visible', timeout: 2000 });
    await moreOptions.click();
    await this.page.waitForTimeout(300);
  } catch {
    // اگر نبود، مشکلی نیست
  }


const button = internalFrame.locator('button.ck-button:has-text("افزودن سند داخلی")');
await button.waitFor({ state: 'visible', timeout: 3000 });
await button.click()


const clipboard = await import('clipboardy');
const clipboardText = await clipboard.default.read();

// اگر فیلد داخل iframe هست:
await internalFrame.locator('input#hash').fill(clipboardText);

await internalFrame.locator('input#title').fill('سند داخلی تستی');

await this.page.waitForTimeout(2000);

await internalFrame.locator('button.external-document-submit').click();

await this.page.waitForTimeout(2000);

const saveBtn = this.page
.locator('button.editor-footer__save-button')
.filter({ visible: true });
await saveBtn.waitFor({ state: 'visible' });
await saveBtn.click();

await this.page.waitForTimeout(2000);

const previewBtn = this.page
  .locator('button.editor-footer__change-mode-button')
  .filter({ visible: true });

await previewBtn.waitFor({ state: 'visible' });
await previewBtn.click();


  }
}
