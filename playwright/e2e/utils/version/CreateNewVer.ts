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
    await editor.fill(`
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
       `);

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await this.page.waitForLoadState('networkidle');

    const menuBButton = this.page.locator('.document-menu button').first();
    await menuBButton.click();

    const versionListButton = this.page
      .locator('.document-version-list')
      .first();
    await versionListButton.click();

    const versionMenuButton = this.page.locator('button.version-menu');
    await expect(versionMenuButton.first()).toBeVisible();
    await versionMenuButton.first().click();

    const cloneVersionButton = this.page.locator('button.clone-version');
    await expect(cloneVersionButton).toBeVisible();
    await cloneVersionButton.click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const nameInput = this.page.getByPlaceholder('نام نسخه');
    await expect(nameInput).toBeVisible();
    await nameInput.click();
    await nameInput.fill('۱۲۳');

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const submitButton = this.page.locator(
      'button.dialog-footer__submit-button',
    );
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText('با موفقیت ایجاد شد.', {
      timeout: 3000,
    });
  }

  /**
   * ویرایش سند
   */
  async editDocumentnewVer(): Promise<void> {
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
    await editor.fill(`
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
       `);

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await this.page.waitForLoadState('networkidle');

    const menuBButton = this.page.locator('.document-menu button').first();
    await menuBButton.click();

    const versionListButton = this.page
      .locator('.document-version-list')
      .first();
    await versionListButton.click();

    const versionMenuButton = this.page.locator('button.version-menu');
    await expect(versionMenuButton.first()).toBeVisible();
    await versionMenuButton.first().click();

    const cloneVersionButton = this.page.locator('button.clone-version');
    await expect(cloneVersionButton).toBeVisible();
    await cloneVersionButton.click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // const nameInput = this.page.getByPlaceholder('نام نسخه');
    // await expect(nameInput).toBeVisible();
    // await nameInput.click();
    // await nameInput.fill('۱۲۳');

    // await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // const submitButton = this.page.locator(
    //   'button.dialog-footer__submit-button',
    // );
    // await expect(submitButton).toBeVisible();
    // await submitButton.click();

    // await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText('با موفقیت ایجاد شد.', {
      timeout: 3000,
    });
  }

  /**
   * ویرایش سند
   */
  async CreateDocAdmin(): Promise<void> {
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
    await editor.fill(`
   ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
       `);

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await this.page.waitForLoadState('networkidle');

    // const menuBButton = this.page.locator('.document-menu button').first();
    // await menuBButton.click();

    // const versionListButton = this.page
    //   .locator('.document-version-list')
    //   .first();
    // await versionListButton.click();

    // const versionMenuButton = this.page.locator('button.version-menu');
    // await expect(versionMenuButton.first()).toBeVisible();
    // await versionMenuButton.first().click();

    // const cloneVersionButton = this.page.locator('button.clone-version');
    // await expect(cloneVersionButton).toBeVisible();
    // await cloneVersionButton.click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // const nameInput = this.page.getByPlaceholder('نام نسخه');
    // await expect(nameInput).toBeVisible();
    // await nameInput.click();
    // await nameInput.fill('۱۲۳');

    // await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // const submitButton = this.page.locator(
    //   'button.dialog-footer__submit-button',
    // );
    // await expect(submitButton).toBeVisible();
    // await submitButton.click();

    // await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const toastMessage = this.page.locator('.Toastify__toast-body');
    await expect(toastMessage).toBeVisible({ timeout: 3000 });
    await expect(toastMessage).toContainText('با موفقیت ایجاد شد.', {
      timeout: 3000,
    });
  }

  /**
   * ویرایش سند
   */
  async editDocumentnewVercharachtererror(): Promise<void> {
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
    await editor.fill(`
 ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
     `);

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await this.page.waitForLoadState('networkidle');

    const menuBButton = this.page.locator('.document-menu button').first();
    await menuBButton.click();

    const versionListButton = this.page
      .locator('.document-version-list')
      .first();
    await versionListButton.click();

    const versionMenuButton = this.page.locator('button.version-menu');
    await expect(versionMenuButton.first()).toBeVisible();
    await versionMenuButton.first().click();

    const cloneVersionButton = this.page.locator('button.clone-version');
    await expect(cloneVersionButton).toBeVisible();
    await cloneVersionButton.click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const nameInput = this.page.getByPlaceholder('نام نسخه');
    await expect(nameInput).toBeVisible();
    await nameInput.click();
    await nameInput.fill('//**۱۲۳');

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    await expect(
      this.page.getByText('نام نسخه شامل کاراکتر غیرمجاز است.'),
    ).toBeVisible();

    await this.page
      .locator('div.dialog-footer')
      .locator('button.cancel-button')
      .click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // const toastMessage = this.page.locator('.Toastify__toast-body');
    // await expect(toastMessage).toBeVisible({ timeout: 3000 });
    // await expect(toastMessage).toContainText('با موفقیت ایجاد شد.', {
    //   timeout: 3000,
    // });
  }

  /**
   * ویرایش سند
   */
  async editDocumentnewVerCancel(): Promise<void> {
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
    await editor.fill(`
 ماکیاولی اطمینان زیادی به توانایی شهریار برای حکومت کردن از طریق ترسی دارد که ناشی از قدرت او برای اعمال قهر و خشونت به اتباعش است. هابز با ماکیاولی هم‌عقیده نیست و فکر نمی‌کند فرمانفرما بتواند تنها با کمک ترس حکومت کند. در نظر هابز، اتباع هم باید از خودشان اشتیاقی به تسلیم و تبعیت نشان دهند، چون به نفع آنان است. بنابراین، ترس سیاسی صرفا چیزی نیست که از بالا بر شهروندان تحمیل شود. به‌عکس، ترس سیاسی یک فرایند جمعی است که هم شامل اشتیاق و آمادگی افراد می شود و هم شامل نهادهایی اجتماعی نظیر کلیسا است. افراد همدیگر را می‌پایندو اعمال همدیگر را رصد می‌کنند و به همدیگر درباره عواقب برهم زدن نظم اجتماعی هشدار می‌دهد. حکومت جبارانه - یعنی همان حکومتی که هابز از آن دفاع می‌کند - نمی‌تواند دوام بیاورد مگر اینکه همه شهروندان آگاه باشند که دیگر شهروندان آنان را می‌پایند و اعمالشان را رصد می‌کنند و می‌توانند آنها را به حکومت لو دهند.
     `);

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await this.page.waitForLoadState('networkidle');

    const menuBButton = this.page.locator('.document-menu button').first();
    await menuBButton.click();

    const versionListButton = this.page
      .locator('.document-version-list')
      .first();
    await versionListButton.click();

    const versionMenuButton = this.page.locator('button.version-menu');
    await expect(versionMenuButton.first()).toBeVisible();
    await versionMenuButton.first().click();

    const cloneVersionButton = this.page.locator('button.clone-version');
    await expect(cloneVersionButton).toBeVisible();
    await cloneVersionButton.click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    const nameInput = this.page.getByPlaceholder('نام نسخه');
    await expect(nameInput).toBeVisible();
    await nameInput.click();
    await nameInput.fill('۱۲۳');

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    await this.page
      .locator('div.dialog-footer')
      .locator('button.cancel-button')
      .click();

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

    // const toastMessage = this.page.locator('.Toastify__toast-body');
    // await expect(toastMessage).toBeVisible({ timeout: 3000 });
    // await expect(toastMessage).toContainText('با موفقیت ایجاد شد.', {
    //   timeout: 3000,
    // });
  }
  /**
   * ایجاد نسخه، سپس تلاش برای ایجاد نسخه دوم با همان نام
   */
  async CreateverSamename(): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    //----------------------------------
    // مرحله ۱: باز کردن منو و ایجاد نسخه اول
    //----------------------------------

    const menuButton = this.page.locator('.document-menu button').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const editButton = this.page.locator('button[role="menuitem"]').first();
    await expect(editButton).toBeVisible();
    await editButton.click();

    const editDocButton = this.page.locator('button.document-edit-content');
    await expect(editDocButton).toBeVisible();
    await editDocButton.click();

    // ویرایش محتوای سند
    const frame = this.page.frameLocator('iframe');
    const editor = frame.locator('[contenteditable="true"]');
    await editor.click();
    await editor.fill('متن تست برای نسخه اول');

    // ذخیره نسخه اول
    const saveBtn = this.page
      .locator('button.editor-footer__save-button')
      .filter({ visible: true });
    await saveBtn.waitFor({ state: 'visible' });
    await saveBtn.click();

    // بستن ادیتور
    const closeButton = this.page.locator('button.close-button');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await this.page.waitForLoadState('networkidle');

    //----------------------------------
    // مرحله ۲: باز کردن لیست نسخه‌ها و گرفتن نام نسخه اول
    //----------------------------------

    const menuBButton = this.page.locator('.document-menu button').first();
    await menuBButton.click();

    const versionListButton = this.page
      .locator('.document-version-list')
      .first();
    await versionListButton.click();

    // نسخه‌ها در یک جدول هستند، اولین نسخه = tr شماره 1
    const versionDialog = this.page.locator('div[role="dialog"]');

    // اولین سطر نسخه‌ها (tr شماره 1، چون tr صفر هدر است)
    const firstVersionRow = versionDialog.locator('table tr').nth(1);
    await expect(firstVersionRow).toBeVisible({ timeout: 5000 });

    // سلول اول نام نسخه است
    const firstVersionNameCell = firstVersionRow.locator('td').first();
    const firstVersionName =
      (await firstVersionNameCell.textContent())?.trim() || '';

    if (!firstVersionName) {
      throw new Error(
        '❌ نام نسخه اول استخراج نشد (سلول خالی یا لوکیتور اشتباه).',
      );
    }

    console.log('🎯 نسخه اول:', firstVersionName);

    console.log('✅ نسخه اول:', firstVersionName);

    //----------------------------------
    // مرحله ۳: ایجاد نسخه دوم با همان نام ذخیره‌شده
    //----------------------------------

    const versionMenuButton = this.page.locator('button.version-menu').first();
    await expect(versionMenuButton).toBeVisible();
    await versionMenuButton.click();

    const cloneVersionButton = this.page.locator('button.clone-version');
    await expect(cloneVersionButton).toBeVisible();
    await cloneVersionButton.click();

    // پیدا کردن دیالوگ ساخت نسخه جدید
    const newDialog = this.page.locator('div[role="dialog"]').last();
    const newNameInput = newDialog.getByPlaceholder('نام نسخه');
    await newNameInput.waitFor({ state: 'visible' });

    // قرار دادن نام نسخه اول در نسخه دوم
    await newNameInput.click();
    await newNameInput.press('Control+A');
    await newNameInput.press('Backspace');
    await newNameInput.fill(firstVersionName);

    await expect(newNameInput).toHaveValue(firstVersionName);

    // کلیک روی دکمه ایجاد
    const createButton = newDialog.getByRole('button', { name: 'ایجاد' });
    await expect(createButton).toBeVisible();
    await createButton.click();

    //----------------------------------
    // مرحله ۴: انتظار برای پیام خطای نسخه تکراری
    //----------------------------------

    const errorMessage = this.page.getByText('این شماره نسخه موجود است', {
      exact: false,
    });
    await expect(errorMessage).toBeVisible({ timeout: 6000 });
    await expect(errorMessage).toContainText('این شماره نسخه موجود است');

    console.log('✅ تست نسخه هم‌نام با موفقیت انجام شد.');

    await this.page.waitForTimeout(5000); // تاخیر ۲ ثانیه‌ای

  }
}
