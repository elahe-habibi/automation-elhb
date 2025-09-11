# Utils Folder Structure

این فولدر شامل تمام توابع کمکی (utilities) مورد نیاز برای تست‌های Playwright است که بر اساس عملکرد گروه‌بندی شده‌اند.

## ساختار فولدرها

### 📁 `core/`
فایل‌های اصلی و پایه سیستم
- `auth.ts` - مدیریت احراز هویت و لاگین
- `waitutils.ts` - توابع انتظار و صبر

### 📁 `document/`
عملیات مربوط به اسناد
- ایجاد، ویرایش، حذف اسناد
- مدیریت نسخه‌ها
- کنترل دسترسی به اسناد
- برچسب‌گذاری و دسته‌بندی اسناد

### 📁 `repository/`
عملیات مربوط به مخازن
- ایجاد، ویرایش، حذف مخازن
- مدیریت کلیدها و دسترسی‌ها
- اشتراک‌گذاری مخازن

### 📁 `category/`
عملیات مربوط به دسته‌بندی‌ها
- ایجاد، ویرایش، حذف دسته‌بندی‌ها
- مدیریت زیردسته‌ها
- جابجایی و مخفی کردن دسته‌بندی‌ها

### 📁 `user/`
عملیات مربوط به کاربران
- اضافه کردن، ویرایش، حذف کاربران
- تغییر مالکیت مخازن
- مدیریت دسترسی‌های کاربران

### 📁 `version/`
عملیات مربوط به نسخه‌ها
- ایجاد نسخه‌های جدید
- مقایسه نسخه‌ها
- مدیریت درخواست‌های نسخه
- کپی آدرس‌ها و هش فایل‌ها

### 📁 `file-management/`
مدیریت فایل‌ها
- آپلود، دانلود، ویرایش فایل‌ها
- مدیریت فایل‌های مخازن

### 📁 `access-control/`
کنترل دسترسی‌ها
- مدیریت دسترسی به اسناد و مخازن
- کنترل محدودیت‌های دسترسی

## نحوه استفاده

برای استفاده از توابع، می‌توانید از فایل‌های index.ts هر فولدر استفاده کنید:

### روش 1: Import از فولدرهای خاص
```typescript
// استفاده از توابع اصلی
import { AuthUtils, WaitUtils } from './core';

// استفاده از توابع اسناد
import { DocumentManager, CreateDocument } from './document';

// استفاده از توابع مخازن
import { CreateRepository, EditRepository } from './repository';

// استفاده از توابع دسته‌بندی
import { CreateCategory, EditCategoty } from './category';

// استفاده از توابع کاربران
import { AddUserRepos, EditUserRepos } from './user';

// استفاده از توابع نسخه‌ها
import { CreateNewVer, CompareTwoVers } from './version';

// استفاده از توابع مدیریت فایل
import { FilemanagmentRepo, DownloadFilemanagementRepo } from './file-management';

// استفاده از توابع کنترل دسترسی
import { AccessCat, AccessDoc } from './access-control';
```

### روش 2: Import از فولدر اصلی (پیشنهادی)
```typescript
// Import همه توابع از یک جا
import { 
  AuthUtils, 
  DocumentManager, 
  CreateRepository, 
  CreateCategory,
  AddUserRepos,
  CreateNewVer,
  FilemanagmentRepo,
  AccessCat
} from './utils';
```

## مزایای ساختار جدید

1. **سازماندهی بهتر**: فایل‌ها بر اساس عملکرد گروه‌بندی شده‌اند
2. **قابلیت نگهداری**: پیدا کردن و ویرایش فایل‌ها راحت‌تر است
3. **Import های تمیزتر**: استفاده از index.ts ها باعث تمیزتر شدن import ها می‌شود
4. **مقیاس‌پذیری**: اضافه کردن فایل‌های جدید راحت‌تر است
5. **خوانایی بهتر**: ساختار پروژه واضح‌تر و قابل فهم‌تر است
6. **قابلیت استفاده مجدد**: فایل‌های index.ts امکان import آسان‌تر را فراهم می‌کنند

## فایل‌های Index.ts

هر فولدر دارای یک فایل `index.ts` است که تمام export های آن فولدر را در یک جا جمع‌آوری می‌کند:

- `core/index.ts` - توابع اصلی
- `document/index.ts` - توابع اسناد
- `repository/index.ts` - توابع مخازن
- `category/index.ts` - توابع دسته‌بندی
- `user/index.ts` - توابع کاربران
- `version/index.ts` - توابع نسخه‌ها
- `file-management/index.ts` - توابع مدیریت فایل
- `access-control/index.ts` - توابع کنترل دسترسی
- `index.ts` - فایل اصلی که همه فولدرها را export می‌کند

