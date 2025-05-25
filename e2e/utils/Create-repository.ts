import { Page, expect } from '@playwright/test';
import path from 'path';
import { URLs, getFullUrl } from '../constants';

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
        try {
            // کلیک روی دکمه ایجاد مخزن جدید
            const createRepoButton = await this.page.locator('button:has-text("ایجاد مخزن جدید")');
            await createRepoButton.waitFor({ state: 'visible', timeout: 12000 });
            await createRepoButton.click();
            
            // انتظار برای نمایش فرم و اطمینان از بارگذاری کامل
            await this.page.waitForSelector('#repo-name', { state: 'visible', timeout: 12000 });
            await this.page.waitForLoadState('networkidle');
            
            // پر کردن فرم با مدیریت خطا
            try {
                const nameInput = this.page.locator('#repo-name');
                await nameInput.waitFor({ state: 'visible', timeout: 5000 });
                await nameInput.fill(name);
                
                const descInput = this.page.locator('textarea[name="description"]');
                await descInput.waitFor({ state: 'visible', timeout: 5000 });
                await descInput.fill(description);

                // انتظار برای اطمینان از پر شدن فرم
                await this.page.waitForLoadState('networkidle');
                
                // اطمینان از اینکه فرم همچنان باز است
                const stepperDialog = this.page.locator('div[placeholder="stepper-dialog"]');
                await expect(stepperDialog).toBeVisible({ timeout: 5000 });
                
                // کلیک روی دکمه ادامه با مدیریت خطا
                const continueButton = this.page.locator('.repo-create-dialog__create-button');
                await continueButton.waitFor({ state: 'visible', timeout: 12000 });
                
                // اطمینان از اینکه دکمه قابل کلیک است
                await expect(continueButton).toBeEnabled();
                
                // اضافه کردن تاخیر کوتاه قبل از کلیک
                await this.page.waitForTimeout(2000);
                
                // کلیک روی دکمه ادامه
                await continueButton.click();
                
                // انتظار برای بارگذاریs کامل صفحه بعد از کلیک
                await this.page.waitForLoadState('networkidle');
                
                // اطمینان از اینکه دیالوگ همچنان باز است
                await expect(stepperDialog).toBeVisible({ timeout: 5000 });
            } catch (error) {
                console.error('Error in form submission:', error);
                throw error;
            }
            
            if (!shouldComplete) {
                // کلیک روی دکمه انصراف
                const cancelButton = await this.page.locator('button:has-text("انصراف")');
                await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
                await cancelButton.click();
                
                // اطمینان از بسته شدن دیالوگ
                const stepperDialog = this.page.locator('div[placeholder="stepper-dialog"]');
                await expect(stepperDialog).not.toBeVisible();
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

    async deleteRepos(repoIds: string[], token: string) {
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
                const response = await this.page.request.delete(getFullUrl(URLs.REPOSITORY_DETAIL(repoId)), {
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
     * آپلود تصویر سفارشی برای مخزن
     * @param imagePath مسیر تصویر
     */
    async uploadCustomRepositoryImage(imagePath: string) {
        try {
            // انتخاب رادیو باتن تصویر سفارشی
            await this.selectCustomImageRadio();
            
            // آپلود تصویر - استفاده از سلکتور دقیق‌تر و بدون انتظار برای نمایش
            const fileInput = this.page.locator('#file-upload');
            await fileInput.setInputFiles(imagePath);
            
            // انتظار برای اطمینان از تکمیل آپلود
            await this.page.waitForTimeout(3000);
            
            // کلیک روی دکمه ادامه با استفاده از سلکتور دقیق‌تر
            const continueButton = this.page.locator('.repo-attach-custom-image__dialog-next-button');
            await continueButton.waitFor({ state: 'visible', timeout: 5000 });
            await continueButton.click();
            
            // انتظار برای اطمینان از تکمیل عملیات
            await this.page.waitForLoadState('networkidle');
            
        } catch (error) {
            console.error('خطا در آپلود تصویر سفارشی:', error);
            throw error;
        }
    }
}
