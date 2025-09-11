# راهنمای ESLint و قوانین کدنویسی

## 🎯 اهداف

این پروژه از ESLint برای حفظ کیفیت کد و رعایت استانداردهای کدنویسی استفاده
می‌کند.

## 📋 قوانین اصلی

### TypeScript Rules

- **`@typescript-eslint/explicit-function-return-type`**: همه توابع باید نوع
  بازگشت مشخص داشته باشند
- **`@typescript-eslint/no-unused-vars`**: متغیرهای استفاده نشده باید با `_`
  شروع شوند
- **`@typescript-eslint/no-explicit-any`**: استفاده از `any` ممنوع است
- **`@typescript-eslint/prefer-nullish-coalescing`**: استفاده از `??` به جای
  `||`

### Playwright Rules

- **`playwright/no-wait-for-timeout`**: استفاده از `page.waitForTimeout()` ممنوع
  است
- **`playwright/no-networkidle`**: استفاده از `networkidle` ممنوع است
- **`playwright/no-wait-for-selector`**: استفاده از `page.waitForSelector()`
  ممنوع است
- **`playwright/no-force-option`**: استفاده از `{ force: true }` ممنوع است
- **`playwright/expect-expect`**: همه تست‌ها باید assertion داشته باشند

### Code Style Rules

- **`comma-dangle`**: کاما در آخر آرایه‌ها و آبجکت‌ها
- **`quotes`**: استفاده از single quote
- **`no-multiple-empty-lines`**: حداکثر یک خط خالی
- **`no-trailing-spaces`**: فاصله در انتهای خط ممنوع

## 🛠️ نحوه رفع مشکلات

### 1. رفع مشکلات خودکار

```bash
npm run lint:fix
npm run format
```

### 2. رفع مشکلات دستی

#### متغیرهای استفاده نشده

```typescript
// ❌ اشتباه
const unusedVar = 'value';

// ✅ درست
const _unusedVar = 'value';
```

#### نوع بازگشت تابع

```typescript
// ❌ اشتباه
function myFunction() {
  return 'hello';
}

// ✅ درست
function myFunction(): string {
  return 'hello';
}
```

#### کاما در آخر

```typescript
// ❌ اشتباه
const obj = {
  name: 'test',
  age: 25,
};

// ✅ درست
const obj = {
  name: 'test',
  age: 25,
};
```

#### استفاده از nullish coalescing

```typescript
// ❌ اشتباه
const value = config.timeout || 5000;

// ✅ درست
const value = config.timeout ?? 5000;
```

## 🚀 Script های مفید

```bash
# بررسی کد
npm run lint

# رفع مشکلات خودکار
npm run lint:fix

# فرمت کردن کد
npm run format

# بررسی فرمت
npm run format:check

# بررسی کامل
npm run check

# رفع مشکلات و فرمت کردن
npm run check:fix
```

## 📁 فایل‌های تنظیمات

- **`.eslintrc.json`**: تنظیمات ESLint
- **`.prettierrc`**: تنظیمات Prettier
- **`.editorconfig`**: تنظیمات Editor
- **`tsconfig.json`**: تنظیمات TypeScript

## ⚠️ نکات مهم

1. **قبل از commit**: حتماً `npm run check` اجرا کنید
2. **قوانین Playwright**: برای تست‌ها بعضی قوانین سختگیرانه نیستند
3. **Type Safety**: همیشه نوع‌ها را مشخص کنید
4. **Code Style**: از Prettier برای فرمت کردن استفاده کنید

## 🔧 تنظیمات Editor

### VS Code

- نصب extension های ESLint و Prettier
- فعال کردن `Format on Save`
- فعال کردن `Fix on Save`

### WebStorm

- فعال کردن ESLint در Settings
- فعال کردن Prettier در Settings
- تنظیم `Fix on Save`

## 📊 گزارش‌گیری

```bash
# ایجاد گزارش HTML
npm run lint:report
```

## 🆘 حل مشکلات رایج

### مشکل TypeScript Config

اگر با خطای `TSConfig does not include this file` مواجه شدید:

1. فایل را به `tsconfig.json` اضافه کنید
2. یا فایل را از ESLint exclude کنید

### مشکل Prettier

اگر با خطای line endings مواجه شدید:

1. `npm run format` اجرا کنید
2. تنظیمات `.editorconfig` را بررسی کنید

### مشکل Playwright Rules

برای تست‌ها بعضی قوانین در `overrides` غیرفعال شده‌اند.

