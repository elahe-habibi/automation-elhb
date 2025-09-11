import { expect, Page } from '@playwright/test';

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

    const menuButton = this.page.locator('.document-menu button').nth(0);
    await expect(menuButton).toBeVisible();
    await menuButton.click();
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
    
    const fontButton = frame.locator('.ck-font-family-dropdown .ck-dropdown__button');
    await expect(fontButton).toBeVisible({ timeout: 10000 });
    await fontButton.click();
    await this.page.waitForTimeout(1000);

    const iranNastaliqOption = frame.locator('button:has-text("IranNastaliq")');
    await expect(iranNastaliqOption).toBeVisible({ timeout: 10000 });
    await iranNastaliqOption.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * تغییر فونت به B Nazanin
   */
  async changeToBNazanin(): Promise<void> {
    const frame = this.page.frameLocator('iframe');
    
    const fontButton = frame.locator('.ck-font-family-dropdown .ck-dropdown__button');
    await expect(fontButton).toBeVisible({ timeout: 10000 });
    await fontButton.click();
    await this.page.waitForTimeout(1000);

    const bNazaninOption = frame.locator('button:has-text("B Nazanin")');
    await expect(bNazaninOption).toBeVisible({ timeout: 10000 });
    await bNazaninOption.click();
    await this.page.waitForTimeout(1000);

    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

   // جایگزین کردن waitForLoadState با waitForTimeout

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText('تغییرات با موفقیت ذخیره شد.', {
      timeout: 3000,
    });
  
  }
}