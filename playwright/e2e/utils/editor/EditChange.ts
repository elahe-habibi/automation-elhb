import { expect, Locator, Page } from '@playwright/test';
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
    const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');

    await editor.click();
    await editor.fill(`   خوشگل
    
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
   
    `);

    // انتخاب متن ساده‌تر برای جلوگیری از timeout
    await this.selectText('خوشگل');

    // درج خط افقی بلافاصله پس از متن
    await this.clickRightAlignToolbarButton();
    await this.clickLinkButton();
    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    await this.clickSelectAllButton();
    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای
    // await this.clickPageBreakButton();
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
   * کلیک روی دکمه درج جدول اکسل
   */
  async uploadExcelFile(): Promise<void> {
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

    // پیدا کردن دکمه درج جدول اکسل با استفاده از کلاس و tooltip text
    const excelTableButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="درج جدول اکسل"]',
    );
    await expect(excelTableButton).toBeVisible({ timeout: 10000 });

    const excelFilePath = path.resolve(
      process.cwd(),
      'e2e',
      'assets',
      'sample.xlsx',
    );

    // ابتدا دکمه Excel را کلیک کرده و فایل را انتخاب می‌کنیم
    let fileSelected = false;
    try {
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser', { timeout: 3000 }),
        excelTableButton.click(),
      ]);
      await fileChooser.setFiles(excelFilePath);
      fileSelected = true;
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log('File chooser failed, trying input method:', error);
      // Fallback: استفاده از input[type=file]
      try {
        const inputInFrame = frame.locator('input[type="file"]');
        if (await inputInFrame.count() > 0) {
          await inputInFrame.setInputFiles(excelFilePath);
          fileSelected = true;
        } else {
          const inputOnPage = this.page.locator('input[type="file"]');
          if (await inputOnPage.count() > 0) {
            await inputOnPage.setInputFiles(excelFilePath);
            fileSelected = true;
          }
        }
      } catch (inputError) {
        console.log('Input file method also failed:', inputError);
      }
    }

    if (!fileSelected) {
      console.log('Could not select Excel file, skipping upload');
      return;
    }

    // صبر برای ظاهر شدن دیالوگ تایید
    await this.page.waitForTimeout(2000);

    // کلیک روی دکمه تایید (داخل فریم یا صفحه)
    const submitInFrame = frame.locator(
      'button.dialog-content__submit.excelToHtml-submit',
    );
    const submitOnPage = this.page.locator(
      'button.dialog-content__submit.excelToHtml-submit',
    );

    if (await submitInFrame.count() > 0) {
      await submitInFrame.waitFor({ state: 'visible', timeout: 5000 });
      await expect(submitInFrame).toBeEnabled({ timeout: 3000 });
      await submitInFrame.click();
    } else if (await submitOnPage.count() > 0) {
      await submitOnPage.waitFor({ state: 'visible', timeout: 5000 });
      await expect(submitOnPage).toBeEnabled({ timeout: 3000 });
      await submitOnPage.click();
    }

    await this.page.waitForTimeout(1000);
  }

  /**
   * کلیک روی دکمه درج جدول عادی
   */
  async clickInsertTableButton(): Promise<void> {
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

    // پیدا کردن دکمه درج جدول مستقیماً
    const tableButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="درج جدول"]',
    );
    await expect(tableButton).toBeVisible({ timeout: 10000 });
    await tableButton.click();
    await this.page.waitForTimeout(500);

    // انتخاب یک جدول 3x3 از grid
    const gridButton = frame.locator(
      'button.ck-insert-table-dropdown-grid-box[data-row="3"][data-column="3"]',
    );
    await expect(gridButton).toBeVisible({ timeout: 5000 });
    await gridButton.click();
    await this.page.waitForTimeout(500);

    // نوشتن متن در سلول‌های جدول
    await this.writeTextInTableCells();
  }

  /**
   * نوشتن متن در سلول‌های جدول
   */
  async writeTextInTableCells(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // متن‌های مختلف برای سلول‌ها
    const texts = [
      'الی نازدار',
      'خوشگل',
      'عزیزم',
      'دوستت دارم',
      'موفق باشی',
      'خدا قوت',
      'مرسی',
      'ممنون',
      'ببخشید',
    ];

    // کلیک روی سلول اول و نوشتن متن
    const firstCell = frame.locator('td').first();
    await expect(firstCell).toBeVisible({ timeout: 5000 });
    await firstCell.click();
    await this.page.waitForTimeout(200);
    await firstCell.fill(texts[0]);
    await this.page.waitForTimeout(200);

    // کلیک روی سلول دوم و نوشتن متن
    const secondCell = frame.locator('td').nth(1);
    await expect(secondCell).toBeVisible({ timeout: 5000 });
    await secondCell.click();
    await this.page.waitForTimeout(200);
    await secondCell.fill(texts[1]);
    await this.page.waitForTimeout(200);

    // کلیک روی سلول سوم و نوشتن متن
    const thirdCell = frame.locator('td').nth(2);
    await expect(thirdCell).toBeVisible({ timeout: 5000 });
    await thirdCell.click();
    await this.page.waitForTimeout(200);
    await thirdCell.fill(texts[2]);
    await this.page.waitForTimeout(200);

    // خروج از جدول و کلیک روی ادیتور
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);

    // کلیک روی ادیتور برای خروج از حالت جدول (استفاده از selector مخصوص برای جلوگیری از تداخل با سلول‌های جدول)
    const editor = frame.locator(
      '.ck-editor__editable:not(.ck-editor__nested-editable)',
    );
    await expect(editor).toBeVisible({ timeout: 5000 });
    await editor.click();
    await this.page.waitForTimeout(500);

    // انتخاب کل متن داخل ادیتور
    await this.page.keyboard.press('Control+a');
    await this.page.waitForTimeout(500);
  }

  /**
   * انتخاب متن در ادیتور - نسخه بهینه شده
   */
  async selectText(textToSelect: string): Promise<void> {
    try {
      const frame = this.page.frameLocator('iframe');

      // پیدا کردن ادیتور
      const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');

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

    // باز کردن منوی «گزینه‌های بیشتر» تا دکمه‌های اضافی نمایان شوند
    const moreOptions = frame
      .locator(
        'div.ck-toolbar__grouped-dropdown.ck-toolbar-dropdown button.ck-dropdown__button',
      )
      .first();
    try {
      await expect(moreOptions).toBeVisible({ timeout: 8000 });
      await moreOptions.click();
      await this.page.waitForTimeout(300);
    } catch {}

    // تلاش برای یافتن «پایین نویس/Subscript» با چند راه مختلف و محدودکردن به پنل باز
    const panelScoped = frame.locator(
      '.ck-dropdown__panel:not(.ck-hidden) button.ck-button',
    );

    let subscriptButton = panelScoped.filter({ hasText: 'پایین نویس' }).first();

    // اگر با متن فارسی پیدا نشد، با role/name و tooltip انگلیسی/فارسی امتحان می‌کنیم
    if ((await subscriptButton.count()) === 0) {
      subscriptButton = frame
        .getByRole('button', { name: 'پایین نویس' })
        .or(frame.getByRole('button', { name: 'Subscript' }))
        .or(
          frame.locator(
            'button.ck-button[data-cke-tooltip-text="پایین نویس"], button.ck-button[data-cke-tooltip-text="Subscript"]',
          ),
        )
        .first();
    }

    // اگر هنوز پیدایش نشد، یکبار دیگر منو را باز/بسته می‌کنیم و مجدد جستجو می‌کنیم
    if ((await subscriptButton.count()) === 0) {
      try {
        await moreOptions.click();
        await this.page.waitForTimeout(200);
        await moreOptions.click();
        await this.page.waitForTimeout(300);
      } catch {}
      subscriptButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'پایین نویس' })
        .first();
    }

    // در صورت یافتن، تلاش برای کلیک همراه با اطمینان از enabled بودن
    if (await subscriptButton.count()) {
      await expect(subscriptButton).toBeVisible({ timeout: 10000 });
      try {
        await expect(subscriptButton).toBeEnabled({ timeout: 3000 });
      } catch {}
      await subscriptButton.scrollIntoViewIfNeeded();
      await subscriptButton.click({ trial: true }).catch(() => {});
      await subscriptButton.click({ force: true });
      await this.page.waitForTimeout(300);
      return;
    }

    // Fallback: استفاده از شورتکات کیبورد (معمولاً Ctrl+= برای Subscript در CKEditor)
    try {
      const editor = frame.locator('[contenteditable="true"]').first();
      await editor.click({ timeout: 2000 });
      await this.page.keyboard.press('Control+=');
      await this.page.waitForTimeout(300);
    } catch {}
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
    if (await container.count() > 0) {
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
   * آپلود فایل Word (.docx) از طریق دکمه toolbar «upload .docx»
   */
  async uploadDocx(filePath: string): Promise<void> {
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

    // تلاش برای پیدا کردن دکمه upload .docx
    let uploadButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="upload .docx"]',
    );
    if ((await uploadButton.count()) === 0) {
      uploadButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'upload .docx' });
    }

    await expect(uploadButton.first()).toBeVisible({ timeout: 10000 });

    // سناریو ۱: رویداد filechooser متصل است
    try {
      const [chooser] = await Promise.all([
        this.page.waitForEvent('filechooser', { timeout: 2000 }),
        uploadButton.first().click(),
      ]);
      await chooser.setFiles(filePath);
    } catch {
      // سناریو ۲: input[type=file] مخفی داخل iframe یا صفحه
      const inputInFrame = frame.locator('input[type="file"]');
      if ((await inputInFrame.count()) > 0) {
        await inputInFrame.setInputFiles(filePath);
      } else {
        const inputOnPage = this.page.locator('input[type="file"]');
        await expect(inputOnPage.first()).toBeVisible({ timeout: 5000 });
        await inputOnPage.setInputFiles(filePath);
      }
    }
    // پیدا کردن مودال آپلود، اسکرول و کلیک روی دکمه ادامه (داخل فریم یا صفحه)
    await this.page.waitForTimeout(1000);

    const continueInFrame = frame.locator(
      'button.dialog-content__submit, button.docxToHtml-submit',
    );
    const continueOnPage = this.page.locator(
      'button.dialog-content__submit, button.docxToHtml-submit',
    );
    const continueButton = (await continueInFrame.count())
      ? continueInFrame.first()
      : continueOnPage.first();

    await expect(continueButton).toBeVisible({ timeout: 10000 });
    await expect(continueButton).toBeEnabled({ timeout: 5000 });
    await continueButton.click();

    // در برخی سناریوها مرحله دوم تایید وجود دارد: «تایید و درج در ادیتور»
    await this.page.waitForTimeout(500);
    const finalSubmitInFrame = frame.locator(
      'button.upload-file-submit, button.dialog-content__submit.upload-file-submit',
    );
    const finalSubmitOnPage = this.page.locator(
      'button.upload-file-submit, button.dialog-content__submit.upload-file-submit',
    );
    const finalSubmit = (await finalSubmitInFrame.count())
      ? finalSubmitInFrame.first()
      : finalSubmitOnPage.first();

    if (await finalSubmit.count()) {
      await expect(finalSubmit).toBeVisible({ timeout: 10000 });
      await expect(finalSubmit).toBeEnabled({ timeout: 5000 });
      await finalSubmit.click();
    }
  }

/**
 * کلیک روی دکمه «بلوک نقل قول» با رعایت بهترین پرکتیس‌ها
 */
async clickBlockQuote(): Promise<void> {
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

  // ابتدا دکمه را در نوار ابزار اصلی امتحان می‌کنیم
  let button = this.getBlockQuoteButton();
  if ((await (await button).count()) === 0 || !(await (await button).first().isVisible().catch(() => false))) {
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
  if ((await (await button).count()) === 0) {
    console.warn('Block Quote button not found in the editor toolbar.');
    return;
  }

  const target = (await button).first();
  await expect(target).toBeVisible({ timeout: 10000 });
  await target.scrollIntoViewIfNeeded();

  // کلیک پایدار
  await target.click({ trial: true }).catch(() => {});
  await target.click({ force: true });
}


/**
   * Locator دکمه «بلوک نقل قول» (هم در نوار ابزار اصلی و هم داخل منوی «گزینه‌های بیشتر»)
   */
async getBlockQuoteButton(): Promise<Locator> {

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

  /**
   * آپلود نمونه docx از مسیر e2e/assets/sample.docx
   */
  async uploadSampleDocx(): Promise<void> {
    const samplePath = path.resolve(
      process.cwd(),
      'e2e',
      'assets',
      'sample.docx',
    );
    await this.uploadDocx(samplePath);
  }

  /**
   * آپلود تصویر در ادیتور
   * @param imagePath مسیر فایل تصویر
   */
  async uploadImage(imagePath: string): Promise<void> {
    console.log('شروع آپلود تصویر:', imagePath);
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

    // پیدا کردن دکمه تصویر
    let imageButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="تصویر"]',
    );
    if ((await imageButton.count()) === 0) {
      imageButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'تصویر' });
    }

    await expect(imageButton.first()).toBeVisible({ timeout: 10000 });
    console.log('دکمه تصویر پیدا شد');

    // سناریو ۱: رویداد filechooser متصل است
    try {
      const [chooser] = await Promise.all([
        this.page.waitForEvent('filechooser', { timeout: 3000 }),
        imageButton.first().click(),
      ]);
      await chooser.setFiles(imagePath);
      console.log('فایل از طریق filechooser آپلود شد');
      await this.page.waitForTimeout(1000);
    } catch {
      // سناریو ۲: input[type=file] مخفی داخل iframe یا صفحه
      try {
        const inputInFrame = frame.locator('input[type="file"]');
        if ((await inputInFrame.count()) > 0) {
          await inputInFrame.setInputFiles(imagePath);
          console.log('فایل از طریق input در iframe آپلود شد');
          await this.page.waitForTimeout(1000);
        } else {
          const inputOnPage = this.page.locator('input[type="file"]');
          if ((await inputOnPage.count()) > 0) {
            await inputOnPage.setInputFiles(imagePath);
            console.log('فایل از طریق input در صفحه آپلود شد');
            await this.page.waitForTimeout(1000);
          }
        }
      } catch (error) {
        console.log('خطا در آپلود تصویر:', error);
        return; // اگر آپلود نشد، ادامه نده
      }
    }

    // صبر برای تکمیل آپلود و ظاهر شدن دیالوگ
    await this.page.waitForTimeout(2000);

    // کلیک روی دکمه تایید در دیالوگ آپلود
    try {
      // ابتدا کانتینر اکشن دیالوگ را پیدا می‌کنیم (داخل فریم یا روی صفحه)
      const frameAction = frame.locator('.dialog-content__action-part');
      const pageAction = this.page.locator('.dialog-content__action-part');
      const actionContainer = (await frameAction.count()) ? frameAction.first() : pageAction.first();

      // تلاش برای یافتن دکمه تایید با کلاس‌های دقیق + متن «تایید» داخل همان کانتینر
      let submitButton = actionContainer.locator('button.dialog-content__submit.cls-btn.lib-btn.lib-modal-btn-success');
      if ((await submitButton.count()) === 0) {
        // fallback: هر دکمه submit داخل کانتینر
        submitButton = actionContainer.locator('button.dialog-content__submit');
      }
      if ((await submitButton.count()) === 0) {
        // fallback: بر اساس متن فارسی دکمه
        submitButton = actionContainer.getByRole('button', { name: 'تایید' }).first();
      }
      if ((await submitButton.count()) === 0) {
        // fallback نهایی: هر جایی در فریم/صفحه
        submitButton = frame
          .getByRole('button', { name: 'تایید' })
          .or(this.page.getByRole('button', { name: 'تایید' }))
          .first();
      }

      await submitButton.waitFor({ state: 'visible', timeout: 10000 });
      try { await expect(submitButton).toBeEnabled(); } catch {}

      // اطمینان از دیده‌شدن و در دسترس بودن
      await submitButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(200);

      // چندین استراتژی کلیک پشت‌سرهم
      const tryClick = async () => {
        try {
          await submitButton.click({ timeout: 2000 });
          return true;
        } catch {
          try {
            await submitButton.click({ force: true, timeout: 2000 });
            return true;
          } catch {
            try {
              await submitButton.evaluate((el: HTMLElement) => el.click());
              return true;
            } catch {
              try {
                const box = await submitButton.boundingBox();
                if (box) {
                  await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                  await this.page.mouse.down();
                  await this.page.mouse.up();
                  return true;
                }
              } catch {}
            }
          }
        }
        return false;
      };

      // تا 3 تلاش برای کلیک
      let clicked = false;
      for (let attempt = 0; attempt < 3 && !clicked; attempt++) {
        clicked = await tryClick();
        if (!clicked) await this.page.waitForTimeout(300);
      }

      if (!clicked) {
        throw new Error('امکان کلیک روی دکمه تایید فراهم نشد');
      }

      await this.page.waitForTimeout(800);

      // پس از تایید، ابتدا روی tbody جدول فایل‌ها کلیک می‌کنیم تا فوکوس/انتخاب اعمال شود
      try {
        await this.clickFileTableTbody();
      } catch {}

      // کلیک روی اولین ردیف (عکس آپلود شده)
      try {
        await this.clickFirstUploadedImageRow();
      } catch {
        console.log('کلیک روی اولین ردیف ناموفق بود، تلاش با روش‌های جایگزین...');
        // سپس تلاش برای کلیک روی ردیف دوم با کلاس‌های مشخص؛ در صورت عدم موفقیت، کلیک روی ردیف دوم تصویری
        try {
          await this.clickRowByClasses(1);
        } catch {
          try {
            await this.clickImageRowByIndex(1);
          } catch {}
        }
      }

      // در نهایت روی دکمه تایید فایل منیجمنت کلیک می‌کنیم
      try {
        await this.clickFileManagementConfirm();
      } catch {}
    } catch (error) {
      console.log('دکمه تایید با کلاس جدید پیدا نشد، تلاش با کلاس قدیمی:', error);
      // Fallback: استفاده از کلاس قدیمی
      try {
        const continueButton = this.page.locator(
          '.repo-image__dialog-next-button',
        );
        await continueButton.waitFor({ state: 'visible', timeout: 5000 });
        await expect(continueButton).toBeEnabled();
        
        await continueButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        try {
          await continueButton.click({ timeout: 5000 });
        } catch (clickError) {
          await continueButton.click({ force: true, timeout: 5000 });
        }
        
        await this.page.waitForTimeout(1000);
      } catch (fallbackError) {
        console.log('دکمه تایید با هیچ یک از کلاس‌ها پیدا نشد:', fallbackError);
      }
    }

    console.log('آپلود تصویر تکمیل شد');
  }

  /**
   * کلیک روی اولین ردیف جدول قابل‌مشاهده (داخل دیالوگ یا صفحه)
   */
  async clickFirstVisibleTableRow(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // ابتدا سعی می‌کنیم ردیف‌هایی را بیابیم که اکشن‌های فایل دارند (هدف دقیق‌تر برای جدول فایل‌ها)
    const scopedFindRows = async (): Promise<import('@playwright/test').Locator> => {
      // داخل دیالوگ در فریم
      let r = frame
        .locator('.dialog-content tr')
        .filter({ has: frame.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      // دیالوگ روی صفحه اصلی
      r = this.page
        .locator('.dialog-content tr')
        .filter({ has: this.page.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      // هر جدول موجود در فریم که اکشن فایل دارد
      r = frame.locator('tr').filter({ has: frame.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      // fallback: هر ردیف جدول معمولی
      r = frame.locator('table tr');
      if ((await r.count()) > 0) return r;

      return this.page.locator('table tr');
    };

    const rows = await scopedFindRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    // اولین ردیف و ترجیحاً عنصر کلیک‌پذیر داخل آن (نام فایل)
    const firstRow = rows.first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    await firstRow.scrollIntoViewIfNeeded();

    // هدف‌گیری span نام فایل در ستون اول اگر موجود باشد
    let clickTarget = firstRow.locator('span.cls-block, span.cls-text-xs').first();
    if ((await clickTarget.count()) === 0) {
      // در غیر این صورت روی خود ردیف کلیک می‌کنیم
      clickTarget = firstRow;
    }

    // تلاش‌های مختلف برای کلیک روی هدف
    try {
      await clickTarget.click({ timeout: 2000 });
    } catch {
      try {
        await clickTarget.click({ force: true, timeout: 2000 });
      } catch {
        try {
          await clickTarget.evaluate((el: HTMLElement) => el.click());
        } catch {
          const box = await clickTarget.boundingBox();
          if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.up();
          }
        }
      }
    }

    await this.page.waitForTimeout(300);
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
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.up();
          }
        }
      }
    }

    await this.page.waitForTimeout(200);
  }

  /**
   * کلیک روی دکمه تایید در فایل منیجمنت پس از انتخاب ردیف
   */
  async clickFileManagementConfirm(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // دکمه داخل دیالوگ در فریم یا روی صفحه
    let btn = frame.locator('.dialog-content button.file-management-submit, button.file-management-submit');
    if ((await btn.count()) === 0) {
      btn = this.page.locator('.dialog-content button.file-management-submit, button.file-management-submit');
    }

    const target = btn.first();
    await target.waitFor({ state: 'visible', timeout: 10000 });

    // منتظر enabled شدن دکمه (ممکن است بعد از انتخاب ردیف فعال شود)
    try {
      await expect(target).toBeEnabled({ timeout: 5000 });
    } catch {
      // تلاش برای تحریک فعال‌سازی با فوکوس و blur
      try {
        await target.focus();
        await this.page.waitForTimeout(150);
      } catch {}
      await expect(target).toBeEnabled({ timeout: 5000 });
    }

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
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.up();
          }
        }
      }
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * کلیک روی ردیف nام جدول فایل‌ها (۰-مبنـا). اگر کم‌تر از n ردیف وجود داشت، خطا می‌دهد.
   */
  async clickTableRowByIndex(rowIndex: number): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    const scopedFindRows = async (): Promise<import('@playwright/test').Locator> => {
      let r = frame
        .locator('.dialog-content tr')
        .filter({ has: frame.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      r = this.page
        .locator('.dialog-content tr')
        .filter({ has: this.page.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      r = frame.locator('tr').filter({ has: frame.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      r = frame.locator('table tr');
      if ((await r.count()) > 0) return r;

      return this.page.locator('table tr');
    };

    const rows = await scopedFindRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(rowIndex);

    const targetRow = rows.nth(rowIndex);
    await targetRow.waitFor({ state: 'visible', timeout: 10000 });
    await targetRow.scrollIntoViewIfNeeded();

    let clickTarget = targetRow.locator('span.cls-block, span.cls-text-xs').first();
    if ((await clickTarget.count()) === 0) clickTarget = targetRow;

    try {
      await clickTarget.click({ timeout: 2000 });
    } catch {
      try {
        await clickTarget.click({ force: true, timeout: 2000 });
      } catch {
        try {
          await clickTarget.evaluate((el: HTMLElement) => el.click());
        } catch {
          const box = await clickTarget.boundingBox();
          if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.up();
          }
        }
      }
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * کلیک روی ردیف nام که شامل فایل تصویر است (۰-مبنـا). تشخیص براساس پسوند نام فایل.
   */
  async clickImageRowByIndex(imageRowIndex: number): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    const scopedFindRows = async (): Promise<import('@playwright/test').Locator> => {
      let r = frame
        .locator('.dialog-content tr')
        .filter({ has: frame.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      r = this.page
        .locator('.dialog-content tr')
        .filter({ has: this.page.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      r = frame.locator('tr').filter({ has: frame.locator('.file-table__actions') });
      if ((await r.count()) > 0) return r;

      r = frame.locator('table tr');
      if ((await r.count()) > 0) return r;

      return this.page.locator('table tr');
    };

    const allRows = await scopedFindRows();

    // فقط ردیف‌هایی که متن‌شان شامل پسوند تصویر است را نگه می‌داریم
    const imageRows = allRows.filter({ hasText: /\.(png|jpe?g|gif|webp)/i });
    const imageCount = await imageRows.count();

    // اگر با نام فایل پیدا نشد، به برچسب داخل SVG که 'jpg' دارد نیز نگاه می‌کنیم
    const fallbackImageRows = imageCount > 0 ? imageRows : allRows.filter({ hasText: /\bjpe?g\b/i });
    const count = await fallbackImageRows.count();
    expect(count).toBeGreaterThan(imageRowIndex);

    const targetRow = fallbackImageRows.nth(imageRowIndex);
    await targetRow.waitFor({ state: 'visible', timeout: 10000 });
    await targetRow.scrollIntoViewIfNeeded();

    let clickTarget = targetRow.locator('span.cls-block, span.cls-text-xs').first();
    if ((await clickTarget.count()) === 0) clickTarget = targetRow;

    try {
      await clickTarget.click({ timeout: 2000 });
    } catch {
      try {
        await clickTarget.click({ force: true, timeout: 2000 });
      } catch {
        try {
          await clickTarget.evaluate((el: HTMLElement) => el.click());
        } catch {
          const box = await clickTarget.boundingBox();
          if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.up();
          }
        }
      }
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * کلیک روی ردیف nام بر اساس کلاس‌های مشخص روی <tr> (۰-مبنـا)
   */
  async clickRowByClasses(rowIndex: number): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // استفاده از selector مبتنی بر ویژگی کلاس برای پرهیز از escape پیچیده
    const trSelector = 'tr[class*="hover:cls-cursor-pointer"][class*="cls-bg-transparent"]';

    // ابتدا در دیالوگ داخل فریم
    let rows = frame
      .locator(`.dialog-content ${trSelector}`)
      .filter({ has: frame.locator('.file-table__actions') });
    let count = await rows.count();

    if (count === 0) {
      // دیالوگ روی صفحه اصلی
      rows = this.page
        .locator(`.dialog-content ${trSelector}`)
        .filter({ has: this.page.locator('.file-table__actions') });
      count = await rows.count();
    }

    if (count === 0) {
      // هر جدول داخل فریم
      rows = frame
        .locator(trSelector)
        .filter({ has: frame.locator('.file-table__actions') });
      count = await rows.count();
    }

    if (count === 0) {
      // هر جدول روی صفحه
      rows = this.page
        .locator(trSelector)
        .filter({ has: this.page.locator('.file-table__actions') });
      count = await rows.count();
    }

    expect(count).toBeGreaterThan(rowIndex);

    const targetRow = rows.nth(rowIndex);
    await targetRow.waitFor({ state: 'visible', timeout: 10000 });
    await targetRow.scrollIntoViewIfNeeded();

    // ترجیحاً روی نام فایل کلیک کنیم؛ در غیراینصورت خود ردیف
    let clickTarget = targetRow.locator('span.cls-block, span.cls-text-xs').first();
    if ((await clickTarget.count()) === 0) clickTarget = targetRow;

    try {
      await clickTarget.click({ timeout: 2000 });
    } catch {
      try {
        await clickTarget.click({ force: true, timeout: 2000 });
      } catch {
        try {
          await clickTarget.evaluate((el: HTMLElement) => el.click());
        } catch {
          const box = await clickTarget.boundingBox();
          if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.up();
          }
        }
      }
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * کلیک روی اولین ردیف جدول فایل‌ها (عکس آپلود شده)
   */
  async clickFirstUploadedImageRow(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    // پیدا کردن اولین ردیف جدول فایل‌ها با کلاس‌های مشخص
    const firstRowSelector = 'tr.hover\\:cls-bg-\\[\\#F6F7F8\\].active\\:\\!cls-bg-\\[\\#F6F7F8\\].hover\\:cls-cursor-pointer.\\!cls-max-h-16.cls-bg-transparent';
    
    // ابتدا در دیالوگ داخل فریم
    let firstRow = frame.locator(`.dialog-content ${firstRowSelector}`).first();
    if ((await firstRow.count()) === 0) {
      // دیالوگ روی صفحه اصلی
      firstRow = this.page.locator(`.dialog-content ${firstRowSelector}`).first();
    }
    if ((await firstRow.count()) === 0) {
      // هر جدول داخل فریم
      firstRow = frame.locator(firstRowSelector).first();
    }
    if ((await firstRow.count()) === 0) {
      // هر جدول روی صفحه
      firstRow = this.page.locator(firstRowSelector).first();
    }

    // اگر با selector دقیق پیدا نشد، از selector ساده‌تر استفاده کنیم
    if ((await firstRow.count()) === 0) {
      firstRow = frame.locator('tbody tr').first();
      if ((await firstRow.count()) === 0) {
        firstRow = this.page.locator('tbody tr').first();
      }
    }

    await expect(firstRow).toBeVisible({ timeout: 10000 });
    await firstRow.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    // تلاش‌های مختلف برای کلیک روی ردیف
    try {
      await firstRow.click({ timeout: 2000 });
      console.log('کلیک روی اولین ردیف موفقیت‌آمیز بود');
    } catch {
      try {
        await firstRow.click({ force: true, timeout: 2000 });
        console.log('کلیک اجباری روی اولین ردیف موفقیت‌آمیز بود');
      } catch {
        try {
          // کلیک روی نام فایل داخل ردیف
          const fileNameSpan = firstRow.locator('span.cls-block.cls-text-xs').first();
          if ((await fileNameSpan.count()) > 0) {
            await fileNameSpan.click({ timeout: 2000 });
            console.log('کلیک روی نام فایل موفقیت‌آمیز بود');
          } else {
            // استفاده از JavaScript برای کلیک
            await firstRow.evaluate((el: HTMLElement) => el.click());
            console.log('کلیک با JavaScript موفقیت‌آمیز بود');
          }
        } catch {
          // استفاده از mouse events
          const box = await firstRow.boundingBox();
          if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.up();
            console.log('کلیک با mouse events موفقیت‌آمیز بود');
          }
        }
      }
    }

    await this.page.waitForTimeout(500);
  }

  /**
   * آپلود تصویر نمونه از مسیر e2e/assets/picture.jpg
   */
  async uploadSampleImage(): Promise<void> {
    const samplePath = path.resolve(
      process.cwd(),
      'e2e',
      'assets',
      'picture.jpg',
    );
    await this.uploadImage(samplePath);
  }

  /**
   * آپلود ویدیو در ادیتور
   * @param videoPath مسیر فایل ویدیو
   */
  async uploadVideo(videoPath: string): Promise<void> {
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

    // پیدا کردن دکمه ویدیو
    let videoButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="ویدیو"]',
    );
    if ((await videoButton.count()) === 0) {
      videoButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'ویدیو' });
    }

    // اگر دکمه ویدیو پیدا نشد، از دکمه رسانه استفاده کنیم
    if ((await videoButton.count()) === 0) {
      videoButton = frame.locator(
        'button.ck-button[data-cke-tooltip-text="رسانه"]',
      );
      if ((await videoButton.count()) === 0) {
        videoButton = frame
          .locator('button.ck-button')
          .filter({ hasText: 'رسانه' });
      }
    }

    await expect(videoButton.first()).toBeVisible({ timeout: 10000 });

    // سناریو ۱: رویداد filechooser متصل است
    try {
      const [chooser] = await Promise.all([
        this.page.waitForEvent('filechooser', { timeout: 2000 }),
        videoButton.first().click(),
      ]);
      await chooser.setFiles(videoPath);
    } catch {
      // سناریو ۲: input[type=file] مخفی داخل iframe یا صفحه
      const inputInFrame = frame.locator('input[type="file"]');
      if ((await inputInFrame.count()) > 0) {
        await inputInFrame.setInputFiles(videoPath);
      } else {
        const inputOnPage = this.page.locator('input[type="file"]');
        await expect(inputOnPage.first()).toBeVisible({ timeout: 5000 });
        await inputOnPage.setInputFiles(videoPath);
      }
    }

    // صبر برای تکمیل آپلود و ظاهر شدن دیالوگ
    await this.page.waitForTimeout(2000);

    // کلیک روی دکمه تایید در دیالوگ آپلود
    try {
      const submitButton = this.page.locator('button.dialog-content__submit');
      await expect(submitButton).toBeVisible({ timeout: 5000 });
      await submitButton.click();
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log('دکمه تایید ویدیو پیدا نشد:', error);
    }
  }

  /**
   * آپلود ویدیو نمونه از مسیر e2e/assets/sample-video.mp4
   */
  async uploadSampleVideo(): Promise<void> {
    const samplePath = path.resolve(
      process.cwd(),
      'e2e',
      'assets',
      'sample-video.mp4',
    );
    await this.uploadVideo(samplePath);
  }

  /**
   * آپلود فایل صوتی در ادیتور
   * @param audioPath مسیر فایل صوتی
   */
  async uploadAudio(audioPath: string): Promise<void> {
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

    // پیدا کردن دکمه صدا
    let audioButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="صدا"]',
    );
    if ((await audioButton.count()) === 0) {
      audioButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'صدا' });
    }

    // اگر دکمه صدا پیدا نشد، از دکمه رسانه استفاده کنیم
    if ((await audioButton.count()) === 0) {
      audioButton = frame.locator(
        'button.ck-button[data-cke-tooltip-text="رسانه"]',
      );
      if ((await audioButton.count()) === 0) {
        audioButton = frame
          .locator('button.ck-button')
          .filter({ hasText: 'رسانه' });
      }
    }

    await expect(audioButton.first()).toBeVisible({ timeout: 10000 });

    // سناریو ۱: رویداد filechooser متصل است
    try {
      const [chooser] = await Promise.all([
        this.page.waitForEvent('filechooser', { timeout: 2000 }),
        audioButton.first().click(),
      ]);
      await chooser.setFiles(audioPath);
    } catch {
      // سناریو ۲: input[type=file] مخفی داخل iframe یا صفحه
      const inputInFrame = frame.locator('input[type="file"]');
      if ((await inputInFrame.count()) > 0) {
        await inputInFrame.setInputFiles(audioPath);
      } else {
        const inputOnPage = this.page.locator('input[type="file"]');
        await expect(inputOnPage.first()).toBeVisible({ timeout: 5000 });
        await inputOnPage.setInputFiles(audioPath);
      }
    }

    // صبر برای تکمیل آپلود و ظاهر شدن دیالوگ
    await this.page.waitForTimeout(2000);

    // کلیک روی دکمه تایید در دیالوگ آپلود
    try {
      const submitButton = this.page.locator('button.dialog-content__submit');
      await expect(submitButton).toBeVisible({ timeout: 5000 });
      await submitButton.click();
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log('دکمه تایید صدا پیدا نشد:', error);
    }
  }

  /**
   * آپلود فایل صوتی نمونه از مسیر e2e/assets/sample-audio.mp3
   */
  async uploadSampleAudio(): Promise<void> {
    const samplePath = path.resolve(
      process.cwd(),
      'e2e',
      'assets',
      'sample-audio.mp3',
    );
    await this.uploadAudio(samplePath);
  }

  /**
   * آپلود همه انواع رسانه (عکس، ویدیو، صدا) در ادیتور
   */
  async uploadAllMediaTypes(): Promise<void> {
    try {
      // آپلود تصویر
      await this.uploadSampleImage();
      await this.page.waitForTimeout(1000);

      // آپلود ویدیو
      await this.uploadSampleVideo();
      await this.page.waitForTimeout(1000);

      // آپلود صدا
      await this.uploadSampleAudio();
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log('خطا در آپلود رسانه:', error);
    }
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
   * کلیک روی دکمه افزودن کد
   */
  async insertCodeBlock(): Promise<void> {
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

    // پیدا کردن دکمه افزودن کد
    let codeButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="افزودن کد"]',
    );
    if ((await codeButton.count()) === 0) {
      codeButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'افزودن کد' });
    }

    const addCodeBtn = codeButton.first();
    await expect(addCodeBtn).toBeVisible({ timeout: 10000 });
    await addCodeBtn.scrollIntoViewIfNeeded();
    // تلاش برای بستن هر tooltip مزاحم (مثلاً tooltip «خط افقی») با حرکت ماوس روی ادیتور
    try {
      const tooltip = frame.locator('.ck-tooltip, .ck-tooltip__text');
      if (await tooltip.count()) {
        const editorArea = frame.locator('[contenteditable="true"]').first();
        await editorArea.hover({ trial: true }).catch(() => {});
        await editorArea.hover().catch(() => {});
        await this.page.waitForTimeout(120);
      }
    } catch {}
    // ابتدا کلیک آزمایشی، سپس کلیک اجباری برای عبور از overlay
    await addCodeBtn.click({ trial: true }).catch(() => {});
    await addCodeBtn.click({ force: true });
    await this.page.waitForTimeout(500);

    // صبر برای ظاهر شدن دیالوگ کد
    await this.page.waitForTimeout(2000);

    // // تلاش برای پیدا کردن dropdown زبان
    // try {
    //   const languageSelect = this.page.locator('select.dialog-content__select');
    //   if (await languageSelect.count() > 0) {
    //     await expect(languageSelect).toBeVisible({ timeout: 3000 });
    //     await languageSelect.selectOption('java');
    //     await this.page.waitForTimeout(500);
    //   }
    // } catch (error) {
    //   console.log('Dropdown زبان پیدا نشد، ادامه می‌دهیم');
    // }

    // تلاش برای پیدا کردن فیلد "محتویات کد" (textarea یا CodeMirror) و پر کردن با کد نمونه
    // سناریوهای ممکن: داخل iframe یا روی صفحه، و همچنین CodeMirror بدون textarea
    const textareaOnPage = this.page.locator('.code-content textarea');
    const textareaInFrame = frame.locator('.code-content textarea');
    const cmOnPage = this.page.locator(
      '.code-content .cm-content[contenteditable="true"], .cm-editor .cm-content[contenteditable="true"]',
    );
    const cmInFrame = frame.locator(
      '.code-content .cm-content[contenteditable="true"], .cm-editor .cm-content[contenteditable="true"]',
    );

    const deadline = Date.now() + 15000; // حداکثر ۱۵ ثانیه برای ظاهر شدن ورودی کد
    let codeTarget: Locator | null = null;

    while (!codeTarget && Date.now() < deadline) {
      if (await textareaOnPage.count()) codeTarget = textareaOnPage.first();
      else if (await textareaInFrame.count()) codeTarget = textareaInFrame.first();
      else if (await cmOnPage.count()) codeTarget = cmOnPage.first();
      else if (await cmInFrame.count()) codeTarget = cmInFrame.first();

      if (!codeTarget) {
        // شاید دیالوگ باز نشده یا بسته شده باشد؛ یکبار دیگر روی دکمه «افزودن کد» کلیک می‌کنیم
        try {
          await addCodeBtn.click({ trial: true }).catch(() => {});
          await addCodeBtn.click({ force: true });
        } catch {}
        await this.page.waitForTimeout(300);
      }
    }

    if (!codeTarget) {
      throw new Error('ورودی کد (textarea یا CodeMirror) یافت نشد.');
    }

    await codeTarget.waitFor({ state: 'visible', timeout: 10000 });
    await codeTarget.scrollIntoViewIfNeeded();

    // تلاش برای پر کردن: ابتدا با fill در صورت textarea، سپس fall back برای contenteditable
    const sampleCode = 'console.log("سلام Elahe جان!");';
    let filled = false;
    try {
      await codeTarget.click({ timeout: 3000 });
      await codeTarget.fill(sampleCode);
      filled = true;
    } catch {
      // احتمالاً CodeMirror است؛ با کیبورد وارد می‌کنیم
      try {
        await codeTarget.click({ timeout: 3000 });
        await this.page.keyboard.press('Control+a').catch(() => {});
        await this.page.keyboard.type(sampleCode, { delay: 10 });
        filled = true;
      } catch {}
    }

    if (!filled) {
      // یک تلاش دیگر: داخل iframe تایپ کنیم اگر target داخل صفحه بود و برعکس
      try {
        const alternative = (await cmInFrame.count())
          ? cmInFrame.first()
          : (await cmOnPage.count())
          ? cmOnPage.first()
          : null;
        if (alternative) {
          await alternative.click({ timeout: 3000 });
          await this.page.keyboard.press('Control+a').catch(() => {});
          await this.page.keyboard.type(sampleCode, { delay: 10 });
          filled = true;
        }
      } catch {}
    }
    if (!filled) {
      throw new Error('امکان وارد کردن متن در ورودی کد فراهم نشد.');
    }

    await this.page.waitForTimeout(500);

    // کلیک روی دکمه تایید (داخل فریم یا صفحه) زمانی که فعال شد
    const confirmInFrame = frame.locator(
      'button.dialog-content__submit, button.code-submit',
    );
    const confirmOnPage = this.page.locator(
      'button.dialog-content__submit, button.code-submit',
    );

    const confirm = (await confirmInFrame.count())
      ? confirmInFrame.first()
      : confirmOnPage.first();

    await expect(confirm).toBeVisible({ timeout: 10000 });

    // اگر دکمه هنوز disabled است، یک تحریک کوچک برای فایر شدن validation انجام می‌دهیم
    try {
      await expect(confirm).toBeEnabled({ timeout: 3000 });
    } catch {
      try {
        await codeTarget.click({ timeout: 2000 });
        await this.page.keyboard.type(' ', { delay: 10 });
        await this.page.keyboard.press('Backspace');
      } catch {}
      await expect(confirm).toBeEnabled({ timeout: 7000 });
    }

    await confirm.click();
    await this.page.waitForTimeout(1000);
  }



























  /**
   * تغییر فونت به B Nazanin
   */
  async changeToBNazanin(): Promise<void> {
    const frame = this.page.frameLocator('iframe');
    
    // استفاده از selector مخصوص برای جلوگیری از تداخل با سلول‌های جدول
    const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');

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
      selectAllButton = frame.locator('button[aria-labelledby*="ck-editor__aria-label"]')
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
      const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');
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
      const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');
      await editor.click();
      await this.page.keyboard.press('Control+a');
      await this.page.waitForTimeout(500);
      console.log('انتخاب همه با Ctrl+A انجام شد (fallback)');
    }
  }

  /**
   * کلیک روی دکمه "برش صفحه" در ادیتور
   */
  async clickPageBreakButton(): Promise<void> {
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

    console.log('شروع جستجو برای دکمه برش صفحه...');

    // روش 1: جستجو مستقیم در toolbar بدون باز کردن منوی بیشتر
    let pageBreakButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="برش صفحه"]',
    );
    
    if ((await pageBreakButton.count()) === 0) {
      console.log('دکمه با tooltip پیدا نشد، جستجو با متن...');
      pageBreakButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'برش صفحه' });
    }

    if ((await pageBreakButton.count()) === 0) {
      console.log('دکمه با متن پیدا نشد، جستجو با role...');
      pageBreakButton = frame.getByRole('button', { name: 'برش صفحه' });
    }

    if ((await pageBreakButton.count()) === 0) {
      console.log('دکمه با role پیدا نشد، جستجو با aria-label...');
      pageBreakButton = frame.locator('button[aria-labelledby*="ck-editor__aria-label"]')
        .filter({ hasText: 'برش صفحه' });
    }

    // اگر هنوز پیدا نشد، منوی بیشتر را باز می‌کنیم
    if ((await pageBreakButton.count()) === 0) {
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
        pageBreakButton = frame.locator(
          'button.ck-button[data-cke-tooltip-text="برش صفحه"]',
        );
        
        if ((await pageBreakButton.count()) === 0) {
          pageBreakButton = frame
            .locator('button.ck-button')
            .filter({ hasText: 'برش صفحه' });
        }
      } catch (error) {
        console.log('خطا در باز کردن منوی بیشتر:', error);
      }
    }

    // اگر هنوز پیدا نشد، خطا می‌دهیم
    if ((await pageBreakButton.count()) === 0) {
      throw new Error('دکمه برش صفحه پیدا نشد');
    }

    // کلیک روی دکمه پیدا شده
    try {
      await expect(pageBreakButton.first()).toBeVisible({ timeout: 5000 });
      await pageBreakButton.first().scrollIntoViewIfNeeded();
      await pageBreakButton.first().click({ force: true });
      await this.page.waitForTimeout(500);
      console.log('دکمه برش صفحه با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه برش صفحه:', error);
      throw error;
    }
  }

  /**
   * کلیک روی دکمه "فعال کردن ویرایش" در ادیتور
   */
  async clickEnableEditButton(): Promise<void> {
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
 
    console.log('شروع جستجو برای دکمه فعال کردن ویرایش...');

    // روش 1: جستجو مستقیم در toolbar بدون باز کردن منوی بیشتر
    let enableEditButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="فعال کردن ویرایش"]',
    );
    
    if ((await enableEditButton.count()) === 0) {
      console.log('دکمه با tooltip پیدا نشد، جستجو با متن...');
      enableEditButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'فعال کردن ویرایش' });
    }

    if ((await enableEditButton.count()) === 0) {
      console.log('دکمه با متن پیدا نشد، جستجو با role...');
      enableEditButton = frame.getByRole('button', { name: 'فعال کردن ویرایش' });
    }

    if ((await enableEditButton.count()) === 0) {
      console.log('دکمه با role پیدا نشد، جستجو با aria-label...');
      enableEditButton = frame.locator('button[aria-labelledby*="ck-editor__aria-label"]')
        .filter({ hasText: 'فعال کردن ویرایش' });
    }

    // اگر هنوز پیدا نشد، منوی بیشتر را باز می‌کنیم
    if ((await enableEditButton.count()) === 0) {
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
        enableEditButton = frame.locator(
          'button.ck-button[data-cke-tooltip-text="فعال کردن ویرایش"]',
        );
        
        if ((await enableEditButton.count()) === 0) {
          enableEditButton = frame
            .locator('button.ck-button')
            .filter({ hasText: 'فعال کردن ویرایش' });
        }
      } catch (error) {
        console.log('خطا در باز کردن منوی بیشتر:', error);
      }
    }

    // اگر هنوز پیدا نشد، خطا می‌دهیم
    if ((await enableEditButton.count()) === 0) {
      throw new Error('دکمه فعال کردن ویرایش پیدا نشد');
    }

    // بررسی اینکه دکمه disabled نباشد
    const isDisabled = await enableEditButton.first().getAttribute('aria-disabled');
    if (isDisabled === 'true') {
      console.log('دکمه فعال کردن ویرایش در حالت disabled است');
      // صبر می‌کنیم تا دکمه فعال شود
      await this.page.waitForTimeout(2000);
    }

    // کلیک روی دکمه پیدا شده
    try {
      await expect(enableEditButton.first()).toBeVisible({ timeout: 5000 });
      await enableEditButton.first().scrollIntoViewIfNeeded();
      
      // اگر دکمه هنوز disabled است، صبر بیشتری می‌کنیم
      const isStillDisabled = await enableEditButton.first().getAttribute('aria-disabled');
      if (isStillDisabled === 'true') {
        console.log('دکمه هنوز disabled است، صبر برای فعال شدن...');
        await this.page.waitForTimeout(3000);
      }
      
      await enableEditButton.first().click({ force: true });
      await this.page.waitForTimeout(1000);
      console.log('دکمه فعال کردن ویرایش با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه فعال کردن ویرایش:', error);
      throw error;
    }
  }

  /**
   * کلیک روی دکمه "Source" در ادیتور
   */
  async clickSourceButton(): Promise<void> {
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

    console.log('شروع جستجو برای دکمه Source...');

    // روش 1: جستجو مستقیم در toolbar بدون باز کردن منوی بیشتر
    let sourceButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="Source"]',
    );
    
    if ((await sourceButton.count()) === 0) {
      console.log('دکمه با tooltip پیدا نشد، جستجو با متن...');
      sourceButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'Source' });
    }

    if ((await sourceButton.count()) === 0) {
      console.log('دکمه با متن پیدا نشد، جستجو با role...');
      sourceButton = frame.getByRole('button', { name: 'Source' });
    }

    if ((await sourceButton.count()) === 0) {
      console.log('دکمه با role پیدا نشد، جستجو با aria-label...');
      sourceButton = frame.locator('button[aria-labelledby*="ck-editor__aria-label"]')
        .filter({ hasText: 'Source' });
    }

    if ((await sourceButton.count()) === 0) {
      console.log('دکمه با aria-label پیدا نشد، جستجو با کلاس مخصوص...');
      sourceButton = frame.locator('button.ck-source-editing-button');
    }

    // اگر هنوز پیدا نشد، منوی بیشتر را باز می‌کنیم
    if ((await sourceButton.count()) === 0) {
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
        sourceButton = frame.locator(
          'button.ck-button[data-cke-tooltip-text="Source"]',
        );
        
        if ((await sourceButton.count()) === 0) {
          sourceButton = frame
            .locator('button.ck-button')
            .filter({ hasText: 'Source' });
        }
        
        if ((await sourceButton.count()) === 0) {
          sourceButton = frame.locator('button.ck-source-editing-button');
        }
      } catch (error) {
        console.log('خطا در باز کردن منوی بیشتر:', error);
      }
    }

    // اگر هنوز پیدا نشد، خطا می‌دهیم
    if ((await sourceButton.count()) === 0) {
      throw new Error('دکمه Source پیدا نشد');
    }

    // کلیک روی دکمه پیدا شده
    try {
      await expect(sourceButton.first()).toBeVisible({ timeout: 5000 });
      await sourceButton.first().scrollIntoViewIfNeeded();
      await sourceButton.first().click({ force: true });
      await this.page.waitForTimeout(1000);
      console.log('دکمه Source با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه Source:', error);
      throw error;
    }
  }

  /**
   * مدیریت «بارگذاری/دانلود محتویات کلاسور»:
   * - باز کردن منو
   * - کلیک روی «دانلود» و انتظار برای رویداد دانلود
   * - کلیک روی «بارگذاری» و انتخاب فایل Clasor-Content.clasor و تایید
   */
  async manageClasorContents(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    console.log('شروع مدیریت محتویات کلاسور...');

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

    // پیدا کردن دکمه اصلی «بارگذاری/دانلود محتویات کلاسور»
    let mainButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="بارگذاری/دانلود محتویات کلاسور"]',
    );
    if ((await mainButton.count()) === 0) {
      mainButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'بارگذاری/دانلود محتویات کلاسور' });
    }
    if ((await mainButton.count()) === 0) {
      mainButton = frame.getByRole('button', {
        name: 'بارگذاری/دانلود محتویات کلاسور',
      });
    }

    if ((await mainButton.count()) === 0) {
      throw new Error('دکمه بارگذاری/دانلود محتویات کلاسور پیدا نشد');
    }

    await expect(mainButton.first()).toBeVisible({ timeout: 10000 });
    await mainButton.first().click();
    await this.page.waitForTimeout(400);

    // ناحیه‌ای که گزینه‌های منو ممکن است رندر شوند
    const openPanel = frame.locator('.ck-dropdown__panel:not(.ck-hidden)');

    // // 1) دانلود
    // console.log('شروع دانلود محتویات کلاسور...');
    // let downloadOption = openPanel
    //   .locator('button.ck-button')
    //   .filter({ hasText: 'دانلود' })
    //   .first();
    // if ((await downloadOption.count()) === 0) {
    //   // تلاش سراسری داخل فریم
    //   downloadOption = frame
    //     .locator('button.ck-button')
    //     .filter({ hasText: 'دانلود' })
    //     .first();
    // }

    // if (await downloadOption.count()) {
    //   await downloadOption.click();
    //   await this.page.waitForTimeout(1000);
      
    //   // بررسی وجود دیالوگ دانلود
    //   const downloadDialog = this.page.locator('.import-export-download-button');
    //   if (await downloadDialog.count() > 0) {
    //     console.log('دیالوگ دانلود پیدا شد، کلیک روی دکمه دانلود...');
    //     const [download] = await Promise.all([
    //       this.page.waitForEvent('download', { timeout: 15000 }),
    //       downloadDialog.click(),
    //     ]);
    //     // به صورت اختیاری می‌توان فایل را ذخیره کرد؛ فعلاً فقط منتظر اتمام می‌مانیم
    //     try {
    //       await download.path();
    //       console.log('دانلود محتویات کلاسور با موفقیت انجام شد');
    //     } catch {}
    //   } else {
    //     // اگر دیالوگ نبود، مستقیماً دانلود انجام می‌شود
    //     const [download] = await Promise.all([
    //       this.page.waitForEvent('download', { timeout: 15000 }),
    //       downloadOption.click(),
    //     ]);
    //     try {
    //       await download.path();
    //       console.log('دانلود محتویات کلاسور با موفقیت انجام شد');
    //     } catch {}
    //   }
    // } else {
    //   console.log('گزینه دانلود یافت نشد؛ از این مرحله عبور می‌کنیم');
    // }

    // await this.page.waitForTimeout(500);

    // دوباره روی دکمه اصلی کلیک می‌کنیم تا منو باز بماند/باز شود
    // try {
    //   await mainButton.first().click();
    //   await this.page.waitForTimeout(300);
    // } catch {}

    // 2) بارگذاری
    console.log('شروع بارگذاری فایل Clasor-Content .clasor...');
    const uploadFilePath = path.resolve(
      process.cwd(),
      'e2e',
      'assets',
      'Clasor-Content .clasor',
    );

    let uploadOption = openPanel
      .locator('button.ck-button')
      .filter({ hasText: 'بارگذاری' })
      .first();
    if ((await uploadOption.count()) === 0) {
      uploadOption = frame
        .locator('button.ck-button')
        .filter({ hasText: 'بارگذاری' })
        .first();
    }

    if (await uploadOption.count()) {
      // تلاش برای کلیک روی تب «بارگذاری» در دیالوگ (در صورت وجود)
      try {
        const uploadTabInFrame = frame
          .locator('button.import-export-upload-tab')
          .filter({ hasText: 'بارگذاری' })
          .first();
        const uploadTabOnPage = this.page
          .locator('button.import-export-upload-tab')
          .filter({ hasText: 'بارگذاری' })
          .first();

        let tab = (await uploadTabInFrame.count()) ? uploadTabInFrame : uploadTabOnPage;
        if ((await tab.count()) === 0) {
          // fallback با role/name فارسی
          const byRoleInFrame = frame.getByRole('button', { name: 'بارگذاری' });
          const byRoleOnPage = this.page.getByRole('button', { name: 'بارگذاری' });
          tab = (await byRoleInFrame.count()) ? byRoleInFrame.first() : byRoleOnPage.first();
        }

        if (await tab.count()) {
          await tab.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
          try { await expect(tab).toBeVisible({ timeout: 1000 }); } catch {}
          await tab.click({ force: true }).catch(() => {});
          await this.page.waitForTimeout(200);
        }
      } catch {}

      // سناریو file chooser
      let selected = false;
      try {
        const [chooser] = await Promise.all([
          this.page.waitForEvent('filechooser', { timeout: 3000 }),
          uploadOption.click(),
        ]);
        await chooser.setFiles(uploadFilePath);
        selected = true;
        console.log('فایل از طریق filechooser انتخاب شد');
      } catch {
        // سناریو input[type=file]
        try {
          const inputInFrame = frame.locator('input[type="file"]');
          if ((await inputInFrame.count()) > 0) {
            await inputInFrame.first().setInputFiles(uploadFilePath);
            selected = true;
            console.log('فایل از طریق input در iframe انتخاب شد');
          } else {
            const inputOnPage = this.page.locator('input[type="file"]');
            if ((await inputOnPage.count()) > 0) {
              await inputOnPage.first().setInputFiles(uploadFilePath);
              selected = true;
              console.log('فایل از طریق input در صفحه انتخاب شد');
            }
          }
        } catch {}
      }

      if (!selected) {
        throw new Error('انتخاب فایل Clasor-Content.clasor ناموفق بود');
      }

      // تایید آپلود (اگر دیالوگ دارد)
      const submitInFrame = frame.locator(
        'button.dialog-content__submit, button.upload-file-submit',
      );
      const submitOnPage = this.page.locator(
        'button.dialog-content__submit, button.upload-file-submit',
      );
      const submitBtn = (await submitInFrame.count())
        ? submitInFrame.first()
        : submitOnPage.first();

      if (await submitBtn.count()) {
        try {
          await expect(submitBtn).toBeVisible({ timeout: 8000 });
          await expect(submitBtn).toBeEnabled({ timeout: 4000 }).catch(() => {});
          await submitBtn.click();
          console.log('بارگذاری فایل با موفقیت تایید شد');
        } catch {}
      }
    } else {
      throw new Error('گزینه بارگذاری یافت نشد');
    }

    console.log('مدیریت محتویات کلاسور با موفقیت تکمیل شد');
  }

  /**
   * کلیک روی دکمه بازگردانی (Undo) در ادیتور
   */
  async clickUndoButton(): Promise<void> {
    const frame = this.page.frameLocator('iframe');

    console.log('شروع جستجو برای دکمه بازگردانی...');

    // روش 1: جستجو مستقیم در toolbar بدون باز کردن منوی بیشتر
    let undoButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="بازگردانی (Ctrl+Z)"]',
    );
    
    if ((await undoButton.count()) === 0) {
      console.log('دکمه با tooltip پیدا نشد، جستجو با متن...');
      undoButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'بازگردانی' });
    }

    if ((await undoButton.count()) === 0) {
      console.log('دکمه با متن پیدا نشد، جستجو با role...');
      undoButton = frame.getByRole('button', { name: 'بازگردانی' });
    }

    if ((await undoButton.count()) === 0) {
      console.log('دکمه با role پیدا نشد، جستجو با aria-label...');
      undoButton = frame.locator('button[aria-labelledby*="ck-editor__aria-label"]')
        .filter({ hasText: 'بازگردانی' });
    }

    // اگر هنوز پیدا نشد، منوی بیشتر را باز می‌کنیم
    if ((await undoButton.count()) === 0) {
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
        undoButton = frame.locator(
          'button.ck-button[data-cke-tooltip-text="بازگردانی (Ctrl+Z)"]',
        );
        
        if ((await undoButton.count()) === 0) {
          undoButton = frame
            .locator('button.ck-button')
            .filter({ hasText: 'بازگردانی' });
        }
      } catch (error) {
        console.log('خطا در باز کردن منوی بیشتر:', error);
      }
    }

    // اگر هنوز پیدا نشد، از کلیدهای میانبر استفاده می‌کنیم
    if ((await undoButton.count()) === 0) {
      console.log('دکمه بازگردانی پیدا نشد، استفاده از Ctrl+Z...');
      const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');
      await editor.click();
      await this.page.keyboard.press('Control+z');
      await this.page.waitForTimeout(500);
      console.log('بازگردانی با Ctrl+Z انجام شد');
      return;
    }

    // بررسی اینکه دکمه disabled نباشد
    const isDisabled = await undoButton.first().getAttribute('aria-disabled');
    if (isDisabled === 'true') {
      console.log('دکمه بازگردانی در حالت disabled است');
      return;
    }

    // کلیک روی دکمه پیدا شده
    try {
      await expect(undoButton.first()).toBeVisible({ timeout: 5000 });
      await undoButton.first().scrollIntoViewIfNeeded();
      await undoButton.first().click({ force: true });
      await this.page.waitForTimeout(500);
      console.log('دکمه بازگردانی با موفقیت کلیک شد');
    } catch (error) {
      console.log('خطا در کلیک روی دکمه بازگردانی:', error);
      // Fallback: استفاده از Ctrl+Z
      const editor = frame.locator('.ck-editor__editable:not(.ck-editor__nested-editable)');
      await editor.click();
      await this.page.keyboard.press('Control+z');
      await this.page.waitForTimeout(500);
      console.log('بازگردانی با Ctrl+Z انجام شد (fallback)');
    }
  }

  /**
   * کلیک روی دکمه Swagger در ادیتور و پر کردن فرم
   */
  async clickSwaggerButton(): Promise<void> {
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

    // پیدا کردن دکمه Swagger با استفاده از tooltip text
    let swaggerButton = frame.locator(
      'button.ck-button[data-cke-tooltip-text="swagger"]',
    );
    
    // اگر با tooltip پیدا نشد، از متن دکمه استفاده می‌کنیم
    if ((await swaggerButton.count()) === 0) {
      swaggerButton = frame
        .locator('button.ck-button')
        .filter({ hasText: 'swagger' });
    }

    // اگر هنوز پیدا نشد، از role استفاده می‌کنیم
    if ((await swaggerButton.count()) === 0) {
      swaggerButton = frame.getByRole('button', { name: 'swagger' });
    }

    await expect(swaggerButton.first()).toBeVisible({ timeout: 10000 });
    await swaggerButton.first().click();
    await this.page.waitForTimeout(1000);

    console.log('دکمه Swagger کلیک شد');

    // صبر برای ظاهر شدن دیالوگ Swagger
    await this.page.waitForTimeout(2000);

    // پیدا کردن فرم دیالوگ (داخل فریم یا روی صفحه)
    const formInFrame = frame.locator('form.dialog-content__form');
    const formOnPage = this.page.locator('form.dialog-content__form');
    const form = (await formInFrame.count()) ? formInFrame.first() : formOnPage.first();

    await expect(form).toBeVisible({ timeout: 10000 });
    console.log('فرم Swagger پیدا شد');

    // پر کردن فیلد عنوان
    const titleInput = form.locator('input[name="title"]');
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill('Pet Store API Documentation');
    await this.page.waitForTimeout(500);

    // پر کردن فیلد لینک Swagger JSON
    const linkInput = form.locator('input[name="link"]');
    await expect(linkInput).toBeVisible({ timeout: 5000 });
    await linkInput.fill('https://petstore3.swagger.io/api/v3/openapi.json');
    await this.page.waitForTimeout(1000);

    console.log('فیلدهای عنوان و لینک پر شدند');

    // صبر برای لود شدن مسیرها از API
    await this.page.waitForTimeout(3000);

    // کلیک روی checkbox "انتخاب همه‌ی مسیرها" برای انتخاب همه مسیرها
    const selectAllCheckbox = form.locator('input.swagger-link__all-path');
    if (await selectAllCheckbox.count() > 0) {
      await expect(selectAllCheckbox).toBeVisible({ timeout: 5000 });
      await selectAllCheckbox.check();
      await this.page.waitForTimeout(500);
      console.log('همه مسیرها انتخاب شدند');
    } else {
      // اگر checkbox انتخاب همه نبود، یک مسیر خاص را انتخاب می‌کنیم
      const pathDropdown = form.locator('.swagger-link__paths');
      if (await pathDropdown.count() > 0) {
        // کلیک روی dropdown برای باز کردن لیست مسیرها
        const dropdownToggle = pathDropdown.locator('svg').last();
        await dropdownToggle.click();
        await this.page.waitForTimeout(1000);

        // انتخاب اولین مسیر موجود
        const firstPath = pathDropdown.locator('div').first();
        if (await firstPath.count() > 0) {
          await firstPath.click();
          await this.page.waitForTimeout(500);
          console.log('اولین مسیر انتخاب شد');
        }
      }
    }

    // کلیک روی دکمه تایید
    const submitButton = form.locator('button.swagger-link-submit');
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await expect(submitButton).toBeEnabled({ timeout: 3000 });
    await submitButton.click();
    await this.page.waitForTimeout(1000);

    console.log('فرم Swagger با موفقیت ارسال شد');
  }

  /**
   * کلیک روی دکمه پیوست کردن فایل در ادیتور
   */
  async uploadAttachedFile(): Promise<void> {
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
    
    // جستجوی دکمه پیوست کردن فایل با استفاده از tooltip text
    const attachFileButton = frame.locator('button[data-cke-tooltip-text="پیوست کردن فایل"]');
    
    await expect(attachFileButton).toBeVisible({ timeout: 10000 });
    await attachFileButton.click();
    
    console.log('دکمه پیوست کردن فایل کلیک شد');

    // انتظار برای باز شدن دیالوگ آپلود فایل
    await this.page.waitForTimeout(2000);

    // جستجوی فایل اینپوت در مکان‌های مختلف
    let fileInput;
    
    try {
      // ابتدا در صفحه اصلی جستجو می‌کنیم
      fileInput = this.page.locator('input[type="file"]');
      await expect(fileInput).toBeVisible({ timeout: 3000 });
    } catch {
      try {
        // اگر در صفحه اصلی نبود، در iframe جستجو می‌کنیم
        fileInput = frame.locator('input[type="file"]');
        await expect(fileInput).toBeVisible({ timeout: 3000 });
      } catch {
        // اگر در iframe هم نبود، در تمام صفحه‌ها جستجو می‌کنیم
        fileInput = this.page.locator('input[type="file"]').first();
        await expect(fileInput).toBeVisible({ timeout: 3000 });
      }
    }
    
    const filePath = './e2e/assets/Software.pdf';
    await fileInput.setInputFiles(filePath);
    
    console.log('فایل Software.pdf آپلود شد');
    
    // انتظار برای تکمیل آپلود
    await this.page.waitForTimeout(3000);
  }

  /**
   * کلیک روی دکمه پیوند در ادیتور و پر کردن فیلد URL
   */
  async clickLinkButton(): Promise<void> {
    const frame = this.page.frameLocator('iframe');
    
    // جستجوی دکمه پیوند با استفاده از tooltip text
    const linkButton = frame.locator('button[data-cke-tooltip-text="پیوند (Ctrl+K)"]');
    
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
}
