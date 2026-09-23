# ارائه تعاملی GitHub Spec Kit

ارائهٔ دوزبانه (فارسی و انگلیسی) درباره [GitHub Spec Kit](https://github.com/github/spec-kit). بدون React یا bundler؛ فقط HTML، CSS و JavaScript خالص.

**نسخه آنلاین:** [https://alirezafarin.github.io/speckit-presentation/](https://alirezafarin.github.io/speckit-presentation/)

## اجرا

فایل `index.html` را در مرورگر باز کنید، یا از ریشه پروژه:

```bash
python3 -m http.server 5000
```

سپس به `http://localhost:5000` بروید.

## GitHub Pages

سایت استاتیک است و از ریشهٔ `main` با GitHub Actions منتشر می‌شود.

1. این تغییرات را commit و push کنید.
2. در GitHub: **Settings → Pages → Build and deployment → Source** را روی **GitHub Actions** بگذارید (یک‌بار).
3. اگر workflow از قبل اجرا شده باشد، از تب **Actions** همان workflow را **Re-run** کنید، یا یک commit خالی روی `main` بزنید.
4. بعد از سبز شدن job، آدرس بالا فعال است. انگلیسی: `?lang=en`

## تغییر زبان

هر دو نسخه در همان `index.html` قرار دارند و نیازی به باز کردن فایل دیگری نیست.

- دکمهٔ زبان در نوار پایین: فارسی ↔ English
- جهت صفحه (RTL/LTR)، فونت، دکمه‌ها و بازخورد quiz خودکار عوض می‌شود
- شمارهٔ اسلاید فعلی حفظ می‌شود
- انتخاب زبان در مرورگر ذخیره می‌شود و در آدرس هم می‌آید: `?lang=fa` یا `?lang=en`

## کنترل‌ها

- دکمه‌های قبلی / بعدی
- در فارسی (RTL): کلید ← یا Space اسلاید بعد، کلید → اسلاید قبل
- در انگلیسی (LTR): کلید → یا Space اسلاید بعد، کلید ← اسلاید قبل
- آدرس مستقیم: `#slide-1` تا `#slide-17`
- quiz، درخت فایل و گردش‌کار با کلیک کار می‌کنند

۱۷ اسلاید روی CLI، فرمان‌ها، آرتیفکت‌ها، constitution، محتویات پوشهٔ `.specify/`، اسکریپت‌های bash، extension و حلقه converge تمرکز دارند — نه تکرار کامل مبانی SDD.

## فایل‌ها

- `index.html` — هر دو دک فارسی و انگلیسی
- `styles.css` — تم مشترک به‌همراه اصلاحات LTR
- `app.js` — ناوبری، تغییر زبان، quiz و اجزای تعاملی
- `fonts/` — فونت Vazirmatn
