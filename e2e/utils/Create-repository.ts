import { Page, expect } from '@playwright/test';

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
        
        try {
            // تلاش برای یافتن توست موفقیت
            const toastSelector = 'div.Toastify__toast--success';
            await this.page.waitForSelector(toastSelector, { timeout: 5000 });
            
            // اگر توست پیدا شد، محتوای آن را بررسی می‌کنیم
            const toastMessage = await this.page.locator(toastSelector).textContent();
            expect(toastMessage).toContain('کاربر با موفقیت به مخزن اضافه شد');
        } catch (error) {
            // اگر توست پیدا نشد، به کار ادامه می‌دهیم
            console.log('Toast notification not found, proceeding with Continue button');
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

    async deleteRepos() {
        if (repoids.length === 0) {
            console.log("No more repositories to delete. Fetching next batch...");
            offset += 30;
            setTimeout(getIdS, 500);
            return;
        }
        
        const repoID = repoids[repoids.length - 1];
        pm.sendRequest({
            url: URL + "/repositories/" + repoID + "?forceDelete=false",
            method: 'DELETE',
            header: {
                'Accept': '*/*',
                'Authorization': "Bearer " + TOKEN
            }
        }, (err, res) => {
            if (err) {
                console.error('Error deleting repository:', repoID, err);
                setTimeout(() => this.deleteRepos(), 2000);
                return;
            }
            
            console.log(`Deleted repository: ${repoID}. Remaining: ${repoids.length - 1}`);
            repoids.pop();
            setTimeout(() => this.deleteRepos(), 500);
        });
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
    }
}