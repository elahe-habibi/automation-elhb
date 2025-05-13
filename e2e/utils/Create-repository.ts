import { Page, expect } from '@playwright/test';
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
    async createRepository(name: string, description: string, shouldComplete: boolean = false) {
        // کلیک روی دکمه ایجاد مخزن جدید
        const createRepoButton = await this.page.locator('button:has-text("ایجاد مخزن جدید")');
        await createRepoButton.click();
        
        // انتظار برای نمایش فرم
        await this.page.waitForSelector('#repo-name');
        
        // پر کردن فرم
        await this.page.locator('#repo-name').fill(name);
        await this.page.locator('textarea[name="description"]').fill(description);
        
        // کلیک روی دکمه ادامه
        const continueButton = await this.page.locator('button:has-text("ادامه")');
        await continueButton.waitFor({ state: 'visible' });
        await continueButton.click();
        
        if (!shouldComplete) {
            // کلیک روی دکمه انصراف
            const cancelButton = await this.page.locator('button:has-text("انصراف")');
            await cancelButton.waitFor({ state: 'visible' });
            await cancelButton.click();
            
            // اطمینان از بسته شدن دیالوگ
            await expect(this.page.locator('div[placeholder="stepper-dialog"]')).not.toBeVisible();
        }
    }

    /**
     * ایجاد یک مخزن با نام یکتا (بر اساس تاریخ و زمان)
     * @param description توضیحات مخزن
     * @param shouldComplete اگر true باشد، مخزن ایجاد می‌شود، در غیر این صورت فقط فرم پر می‌شود و انصراف داده می‌شود
     * @returns نام یکتای مخزن ایجاد شده
     */
    async createRepositoryWithUniqueName(description: string, shouldComplete: boolean = false): Promise<string> {
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
        try {
            // تلاش برای یافتن توست موفقیت
            const toastSelector = '.toast-success';
            await this.page.waitForSelector(toastSelector, { timeout: 15000 });
            
            // اگر توست پیدا شد، محتوای آن را بررسی می‌کنیم
            const toastMessage = await this.page.locator(toastSelector).textContent();
            expect(toastMessage).toContain('کاربر با موفقیت به مخزن اضافه شد');

            console.log(">>>>>>>>>>>>>>>>>>>>>>> Toast message founded successfully.");
        } catch (error) {
            // اگر توست پیدا نشد، به کار ادامه می‌دهیم
            console.log('>>>>>>>>>>>>>>>>>>>>>>>  Toast notification not found, proceeding with Continue button');
        }
        
        // کلیک روی دکمه ادامه
        const continueButton = await this.page.locator('button:has-text("ادامه")');
        await continueButton.waitFor({ state: 'visible' });
        await continueButton.click();
    }

    /**
     * وارد کردن شناسه پادی
     * @param podId شناسه پادی کاربر
     */
    async enterPodId(podId: string) {
        // انتظار برای نمایش فیلد شناسه پادی
        await this.page.waitForSelector('input[id="username"][placeholder="شناسه پادی"]', { state: 'visible' });
        
        // پاک کردن فیلد قبل از پر کردن
        await this.page.locator('input[id="username"][placeholder="شناسه پادی"]').clear();
        
        // وارد کردن شناسه پادی با استفاده از متد type
        await this.page.locator('input[id="username"][placeholder="شناسه پادی"]').type(podId, { delay: 100 });
        
        // اطمینان از اینکه مقدار وارد شده در فیلد نمایش داده می‌شود
        await expect(this.page.locator('input[id="username"][placeholder="شناسه پادی"]')).toHaveValue(podId);
        
        // اضافه کردن تاخیر کوتاه برای اطمینان از پر شدن فیلد
        await this.page.waitForTimeout(1000);
    }

    async deleteRepos(repoIds: string[], token: string, baseUrl: string) {
        console.log(`شروع حذف ${repoIds.length} مخزن...`);
        
        // بررسی آرایه خالی
        if (repoIds.length === 0) {
            console.log("هیچ مخزنی برای حذف وجود ندارد.");
            return;
        }
        
        // حذف مخزن‌ها یکی یکی
        for (let i = 0; i < repoIds.length; i++) {
            const repoId = repoIds[i];
            console.log(`در حال حذف مخزن ${i+1}/${repoIds.length}: ${repoId}`);
            
            try {
                // حذف مخزن با استفاده از Playwright fetch API
                const response = await this.page.request.delete(`${baseUrl}/repositories/${repoId}?forceDelete=false`, {
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok()) {
                    console.log(`مخزن ${repoId} با موفقیت حذف شد.`);
                } else {
                    console.error(`خطا در حذف مخزن ${repoId}: ${response.status()} - ${await response.text()}`);
                }
            } catch (error) {
                console.error(`خطا در حذف مخزن ${repoId}:`, error);
            }
            
            // تاخیر بین درخواست‌ها
            if (i < repoIds.length - 1) {
                await this.page.waitForTimeout(500);
            }
        }
        
        console.log(`عملیات حذف ${repoIds.length} مخزن به پایان رسید.`);
    }

    /**
     * ایجاد تگ برای مخزن
     * @param tagName نام تگ
     */
    async createTag(tagName: string) {
        // انتظار برای نمایش فیلد عنوان تگ
        await this.page.waitForSelector('input[name="name"][placeholder="عنوان تگ"]', { state: 'visible' });
        
        // وارد کردن نام تگ
        await this.page.locator('input[name="name"][placeholder="عنوان تگ"]').fill(tagName);
        
        // کلیک روی دکمه افزودن
        await this.page.locator('button.repo-tags__add-button').click();
        
        // انتظار برای اطمینان از ایجاد تگ
        await this.page.waitForTimeout(1000);

        // کلیک روی دکمه ادامه
        await this.page.locator('button.repo-tags__dialog-next-button').click();
    }

    /**
     * انتخاب رادیو باتن تصویر سفارشی با متن و توضیحات
     */
    async selectCustomImageRadio() {
        try {
            // Select and click the radio button
            const radioButton = this.page.locator('.repo-attach-custom-image__radio');
            await expect(radioButton).toBeVisible();
            await radioButton.click();
            await expect(radioButton).toBeChecked();
            
            // Select and click the custom image button
            const customImageButton = this.page.locator('.repo-attach-custom-image-button');
            await customImageButton.click();

        } catch (error) {
            console.error('خطا در انتخاب رادیو باتن تصویر سفارشی:', error);
            throw error;
        }
    }

    /**
     * آپلود تصویر سفارشی برای مخزن با استفاده از رادیو باتن جدید
     * @param imagePath مسیر فایل تصویر
     */
    async uploadCustomRepositoryImage(imagePath: string) {
        try {
            // اطمینان از آماده بودن صفحه
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForLoadState('networkidle');
            
            // انتخاب رادیو باتن تصویر سفارشی
            await this.selectCustomImageRadio();

            // کمی صبر برای اطمینان از اعمال تغییرات
            await this.page.waitForTimeout(22000);

            // یافتن input نوع فایل مستقیما (بدون کلیک روی دکمه)
            const fileInput = this.page.locator('input[type="file"]');
            
            // Directly set the file input without clicking the upload button
            // این روش از باز شدن دیالوگ انتخاب فایل جلوگیری می‌کند
            await fileInput.setInputFiles(imagePath);
            
            // کمی صبر برای اطمینان از آپلود فایل
            await this.page.waitForTimeout(8000);
            
            const confirmButton = this.page.locator('.dialog-content__action-part .dialog-content__submit');         // بررسی اینکه دکمه در صفحه قابل مشاهده است
            await expect(confirmButton).toBeVisible({ timeout: 30000 });
  
            // کلیک روی دکمه تایید
            await confirmButton.click();

            // Wait for UI update after confirmation
            await this.page.waitForTimeout(3000);
            
            const firstItem = this.page.locator('tbody tr').first();
            await expect(firstItem).toBeVisible({ timeout: 10000 });
            await firstItem.click();

            const addButton = this.page.getByRole('button', { name: 'افزودن' });
            await expect(addButton).toBeVisible({ timeout: 10000 });
            await addButton.click();

            await this.page.waitForTimeout(2000);
            
            // استفاده از سلکتور دقیق‌تر که فقط دکمه 'ادامه' را پیدا کند
            const continueButton = this.page.getByRole('button', { name: 'ادامه' });
            await expect(continueButton).toBeVisible({ timeout: 10000 });
            await continueButton.click();

        } catch (error) {
            console.error('خطا در آپلود تصویر سفارشی:', error);
            throw error;
        }
    }
}
