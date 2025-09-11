import { expect, Locator, Page } from '@playwright/test';

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

    await this.page.waitForTimeout(10000); // تاخیر ۲ ثانیه‌ای
    const frame = this.page.frameLocator('iframe');
    const editor = frame.locator('[contenteditable="true"]');

    await editor.click();
    await editor.fill(`الی ناز دار خوشگل
    
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
   
   الی نازدار خوشگل
    `);



    await this.selectText('الی ناز دار خوشگل');

    // درج خط افقی بلافاصله پس از متن
    await this.clickRightAlignToolbarButton();
    await this.toggleSuperscript();
    await this.toggleSubscript();
    await this.clickNumberedListButton();

    //await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    await this.page.waitForTimeout(3000);
  }
  /**
   * انتخاب متن در ادیتور
   */
  async selectText(textToSelect: string): Promise<void> {
    const frame = this.page.frameLocator('iframe');
    const editor = frame.locator('[contenteditable="true"]');

    await editor.click();
    await this.page.keyboard.press('Control+a');
    await this.page.waitForTimeout(500);
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
   * تغییر رنگ پس‌زمینه فونت به صورت تصادفی از دراپ‌داون «رنگ پس زمینه فونت»
   */
  async changeBackgroundColorRandom(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // هدف قرار دادن دراپ‌داون «رنگ پس زمینه فونت» به‌صورت دقیق
    const colorDropdown = frame
      .locator('.ck-color-ui-dropdown')
      .filter({ hasText: 'رنگ پس زمینه فونت' });
    await expect(colorDropdown).toBeVisible({ timeout: 10000 });
    const colorDropdownButton = colorDropdown.locator('.ck-dropdown__button');

    await colorDropdownButton.click();
    await this.page.waitForTimeout(300);

    // کاشی‌های رنگ ممکن است خارج از نود دراپ‌داون رندر شوند، بنابراین به‌صورت سراسری در فریم جستجو می‌کنیم
    let colorTiles = frame.locator(
      '.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile',
    );
    let tilesCount = await colorTiles.count();

    // اگر بار اول لیست رنگ‌ها ظاهر نشد، یک‌بار دیگر تلاش می‌کنیم
    if (tilesCount === 0) {
      await colorDropdownButton.click();
      await this.page.waitForTimeout(300);
      colorTiles = frame.locator(
        '.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile',
      );
      tilesCount = await colorTiles.count();
    }

    expect(tilesCount).toBeGreaterThan(0);

    // Try to find a visible tile by checking multiple indices
    let randomTile = colorTiles.first(); // Default to first tile
    let attempts = 0;
    const maxAttempts = Math.min(tilesCount, 10); // Try at most 10 times or the total count, whichever is smaller

    while (attempts < maxAttempts) {
      const randomIndex = Math.floor(Math.random() * tilesCount);
      const testTile = colorTiles.nth(randomIndex);

      try {
        // Check if the tile is visible with a shorter timeout
        await expect(testTile).toBeVisible({ timeout: 2000 });
        randomTile = testTile;
        break; // Found a visible tile, exit the loop
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          // If we can't find a visible tile after max attempts, try the first visible one
          for (let i = 0; i < tilesCount; i++) {
            try {
              const visibleTile = colorTiles.nth(i);
              await expect(visibleTile).toBeVisible({ timeout: 1000 });
              randomTile = visibleTile;
              break;
            } catch {
              continue;
            }
          }
          break;
        }
      }
    }

    // Final check to ensure we have a visible tile
    await expect(randomTile).toBeVisible({ timeout: 10000 });
    await randomTile.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * تغییر رنگ فونت (متن) به صورت تصادفی از دراپ‌داون «رنگ فونت»
   */
  async changeTextColorRandom(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // هدف قرار دادن دراپ‌داون «رنگ فونت» با متن برچسب آن
    const textColorDropdown = frame
      .locator('.ck-color-ui-dropdown')
      .filter({ hasText: 'رنگ فونت' });
    await expect(textColorDropdown).toBeVisible({ timeout: 10000 });
    const dropdownButton = textColorDropdown.locator('.ck-dropdown__button');

    await dropdownButton.click();
    await this.page.waitForTimeout(300);

    // فقط کاشی‌های رنگ داخل شبکه‌های قابل‌مشاهده را هدف بگیریم (برخی شبکه‌ها hidden هستند)
    let tiles = frame.locator(
      '.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile',
    );
    let count = await tiles.count();
    if (count === 0) {
      await dropdownButton.click();
      await this.page.waitForTimeout(300);
      tiles = frame.locator(
        '.ck-color-grid:not(.ck-hidden) .ck-color-grid__tile',
      );
      count = await tiles.count();
    }

    expect(count).toBeGreaterThan(0);

    // Try to find a visible tile by checking multiple indices
    let randomTile = tiles.first(); // Default to first tile
    let attempts = 0;
    const maxAttempts = Math.min(count, 10); // Try at most 10 times or the total count, whichever is smaller

    while (attempts < maxAttempts) {
      const randomIndex = Math.floor(Math.random() * count);
      const testTile = tiles.nth(randomIndex);

      try {
        // Check if the tile is visible with a shorter timeout
        await expect(testTile).toBeVisible({ timeout: 2000 });
        randomTile = testTile;
        break; // Found a visible tile, exit the loop
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          // If we can't find a visible tile after max attempts, try the first visible one
          for (let i = 0; i < count; i++) {
            try {
              const visibleTile = tiles.nth(i);
              await expect(visibleTile).toBeVisible({ timeout: 1000 });
              randomTile = visibleTile;
              break;
            } catch {
              continue;
            }
          }
          break;
        }
      }
    }

    // Final check to ensure we have a visible tile
    await expect(randomTile).toBeVisible({ timeout: 10000 });
    await randomTile.click();
    await this.page.waitForTimeout(300);
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

    /**
   * اعمال/لغو حالت پایین نویس (Subscript) روی متن انتخاب‌شده
   */
  async toggleSubscript(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // تلاش دوم: باز کردن منوی «گزینه‌های بیشتر» و کلیک روی «خط افقی» از داخل منو
    const moreOptions = frame.locator(
      'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
    ).first();
    await expect(moreOptions).toBeVisible({ timeout: 10000 });
    await moreOptions.click();
    await this.page.waitForTimeout(300);

    // دکمه «پایین نویس» را بر اساس برچسب آن پیدا می‌کنیم
    const subscriptButton = frame
      .locator('button.ck-button')
      .filter({ hasText: 'پایین نویس' });

    await expect(subscriptButton).toBeVisible({ timeout: 10000 });
    await subscriptButton.click();
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
    const moreOptions = frame.locator(
      'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
    ).first();
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
   * درج لیست عددی با انتخاب تصادفی نوع شماره‌گذاری
   */
  async insertNumberedListRandom(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // پیدا کردن دراپ‌داون لیست عددی
    const numberedListDropdown = frame.locator('.ck-list-styles-dropdown');
    await expect(numberedListDropdown).toBeVisible({ timeout: 10000 });

    // کلیک روی فلش دراپ‌داون برای باز کردن منو
    const dropdownArrow = numberedListDropdown.locator('.ck-splitbutton__arrow');
    await expect(dropdownArrow).toBeVisible({ timeout: 10000 });
    await dropdownArrow.click();
    await this.page.waitForTimeout(500);

    // جمع‌آوری گزینه‌های مختلف لیست عددی
    const listStyleButtons = frame.locator('.ck-list-styles-list button.ck-button');
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

    // پیدا کردن دکمه اصلی لیست عددی (نه فلش دراپ‌داون)
    const numberedListButton = frame.locator('.ck-list-styles-dropdown .ck-splitbutton__action');
    await expect(numberedListButton).toBeVisible({ timeout: 10000 });
    await numberedListButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Locator دکمه «راست چین» در ادیتور (نام جدید: getRightAlignToolbarButton)
   */
  getRightAlignToolbarButton(): Locator {
    const frame = this.page.frameLocator('iframe');
    const byRole = frame.getByRole('button', { name: 'راست چین' });
    const byText = frame
      .locator('button.ck-button')
      .filter({ hasText: 'راست چین' })
      .first();
    return byRole.or(byText);
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
   * درج خط افقی پس از متن جاری از طریق دکمه «خط افقی»
   */
  async insertHorizontalRule(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // تلاش اول: اگر دکمه «خط افقی» مستقیم در نوار ابزار قابل مشاهده بود، همان را کلیک کن
    const hrDirect = frame.getByRole('button', { name: 'خط افقی' });
    try {
      await expect(hrDirect).toBeVisible({ timeout: 1500 });
      await hrDirect.click();
      await this.page.waitForTimeout(300);
      return;
    } catch {
      // نادیده بگیر و به سناریوی باز کردن منوی «گزینه‌های بیشتر» برو
    }

    // تلاش دوم: باز کردن منوی «گزینه‌های بیشتر» و کلیک روی «خط افقی» از داخل منو
    const moreOptions = frame.locator(
      'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
    ).first();
    await expect(moreOptions).toBeVisible({ timeout: 10000 });
    await moreOptions.click();
    await this.page.waitForTimeout(300);

    // سعی کن با نقش پیدا کنی (پایدارتر)
    const hrButtonByRole = frame.getByRole('button', { name: 'خط افقی' });
    try {
      await expect(hrButtonByRole).toBeVisible({ timeout: 5000 });
      await hrButtonByRole.click();
    } catch {
      //Fallback با استفاده از متن داخل دکمه‌ها
      const hrButtonByText = frame
        .locator('button.ck-button')
        .filter({ hasText: 'خط افقی' });
      await expect(hrButtonByText.first()).toBeVisible({ timeout: 10000 });
      await hrButtonByText.first().click();
    }

    await this.page.waitForTimeout(300);
}

  /**
   * تغییر فونت به B Nazanin
   */
  async changeToBNazanin(): Promise<void> {
    const frame = this.page.frameLocator('iframe');
    await this.page.waitForTimeout(10000); // تاخیر ۲ ثانیه‌ای
    const editor = frame.locator('[contenteditable="true"]');

    await editor.click();
    await editor.fill(`الی ناز دار خوشگل
    
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
   
   الی نازدار خوشگل
    `);

    const fontButton = frame.locator(
      '.ck-font-family-dropdown .ck-dropdown__button',
    );
    await expect(fontButton).toBeVisible({ timeout: 5000 });
    await fontButton.click();
    await this.page.waitForTimeout(1000);

    const bNazaninOption = frame.locator('button:has-text("B Nazanin")');
    await expect(bNazaninOption).toBeVisible({ timeout: 3000 });
    await bNazaninOption.click();
    await this.page.waitForTimeout(1000);

    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

    await this.page.waitForTimeout(3000);

    // جایگزین کردن waitForLoadState با waitForTimeout

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText('تغییرات با موفقیت ذخیره شد.', {
      timeout: 3000,
    });

    await this.page.waitForTimeout(2000);
  }
}
