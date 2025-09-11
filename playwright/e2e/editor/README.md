# تست‌های CKEditor

این پوشه شامل تست‌های مختلف برای CKEditor است که عملیات مختلف روی متن را بررسی می‌کند.

## فایل‌های موجود

### 1. `CKEditorOperations.ts`
کلاس کمکی که شامل تمام عملیات ممکن برای CKEditor است:

- **تغییر فونت**: `changeFont(fontName)`
- **تغییر سایز فونت**: `changeFontSize(size)`
- **تغییر رنگ متن**: `changeTextColor(color)`
- **تغییر رنگ پس‌زمینه**: `changeBackgroundColor(color)`
- **اعمال Bold**: `makeBold()`
- **اعمال Italic**: `makeItalic()`
- **اعمال Underline**: `makeUnderline()`
- **اعمال Strike Through**: `makeStrikeThrough()`
- **تراز کردن متن**: `alignText(alignment)`
- **ایجاد لیست شماره‌دار**: `createNumberedList()`
- **ایجاد لیست نقطه‌ای**: `createBulletList()`
- **ایجاد لینک**: `createLink(url, text)`
- **درج تصویر**: `insertImage(imageUrl)`
- **ایجاد جدول**: `createTable(rows, columns)`

### 2. `CKEditorComprehensiveTest.spec.ts`
تست جامع که تمام عملیات CKEditor را بررسی می‌کند:

- **Test Font Operations**: تست تغییر فونت و سایز
- **Test Text Formatting Operations**: تست فرمت‌بندی متن (Bold, Italic, رنگ)
- **Test Text Alignment and Lists**: تست تراز متن و لیست‌ها
- **Test Link and Image Operations**: تست درج لینک و تصویر
- **Test Table Creation**: تست ایجاد جدول
- **Test Complex Text Operations**: تست عملیات پیچیده روی متن

### 3. `CKEditorFontSizeTest.spec.ts`
تست‌های مخصوص تغییر فونت و سایز:

- **Change Font Family**: تست تغییر نوع فونت
- **Change Font Size**: تست تغییر سایز فونت
- **Change Font and Size Together**: تست تغییر همزمان فونت و سایز
- **Test Different Font Combinations**: تست ترکیب‌های مختلف فونت

## نحوه اجرای تست‌ها

### اجرای تمام تست‌های CKEditor:
```bash
npx playwright test e2e/editor/
```

### اجرای تست خاص:
```bash
# اجرای تست جامع
npx playwright test e2e/editor/CKEditorComprehensiveTest.spec.ts

# اجرای تست فونت و سایز
npx playwright test e2e/editor/CKEditorFontSizeTest.spec.ts
```

### اجرای تست خاص با نمایش مرورگر:
```bash
npx playwright test e2e/editor/CKEditorFontSizeTest.spec.ts --headed
```

## مثال استفاده

```typescript
import { CKEditorOperations } from '../utils/editor/CKEditorOperations';

// ایجاد نمونه کلاس
const editorOps = new CKEditorOperations(page);

// تایپ متن
await editorOps.typeText('متن تست');

// انتخاب متن
await editorOps.selectText('متن تست');

// تغییر فونت
await editorOps.changeFont('Arial');

// تغییر سایز
await editorOps.changeFontSize('18');

// اعمال Bold
await editorOps.makeBold();

// ذخیره تغییرات
await editorOps.saveChanges();
```

## نکات مهم

1. **انتظار برای بارگذاری**: قبل از هر عملیات، صبر کنید تا صفحه کاملاً بارگذاری شود
2. **انتخاب متن**: قبل از اعمال هر فرمت، متن مورد نظر را انتخاب کنید
3. **ذخیره تغییرات**: بعد از هر تغییر، حتماً تغییرات را ذخیره کنید
4. **بررسی پیام موفقیت**: بعد از ذخیره، پیام موفقیت را بررسی کنید

## عیب‌یابی

اگر تست‌ها با خطا مواجه شدند:

1. **بررسی اتصال اینترنت**: مطمئن شوید که اتصال اینترنت برقرار است
2. **بررسی لاگین**: مطمئن شوید که کاربر لاگین شده است
3. **بررسی دسترسی**: مطمئن شوید که کاربر دسترسی لازم را دارد
4. **بررسی عناصر**: مطمئن شوید که عناصر مورد نظر در صفحه وجود دارند

## توسعه تست‌های جدید

برای اضافه کردن تست جدید:

1. فایل تست جدید ایجاد کنید
2. از کلاس `CKEditorOperations` استفاده کنید
3. مراحل تست را به ترتیب بنویسید
4. بررسی‌های لازم را اضافه کنید
5. تست را اجرا کنید
