# 🚀 آپلود پروژه روی GitHub

## قدم‌به‌قدم — از کامپیوتر خودت انجام بده

---

### قدم ۱: ریپازیتوری بساز روی GitHub

1. برو به https://github.com/login → وارد شو
2. بالا سمت راست، روی **"+"** کلیک کن → **"New repository"**
3. پر کن:
   - **Repository name**: `Baraka-TargetMonitoring`
   - **Description**: `سامانه مدیریت ارسال تارگت شعب پخش سراسری باراکا`
   - **Public** یا **Private**: هرکدوم رو دوست داری
   - تیک **"Add a README"** رو **نزن** ❌ (چون ما خودمون فایل‌ها رو پوش می‌کنیم)
   - تیک **.gitignore** رو **نزن** ❌
   - تیک **License** رو **نزن** ❌
4. دکمه **"Create repository"** رو بزن

---

### قدم ۲: فایل‌های پروژه رو دانلود کن

از پنل پیش‌نمایش سمت راست، یا از مسیر پروژه، کل فولدر پروژه رو روی کامپیوترت ذخیره کن.

یا اگه پروژه رو روی سرور داری، با SCP دانلود کن:
```bash
scp -r user@server-ip:/path/to/project ./Baraka-TargetMonitoring
```

---

### قدم ۳: تنظیم Git و پوش

یه ترمینال (CMD یا PowerShell یا Git Bash) باز کن:

```bash
# برو به فولدر پروژه
cd C:\path\to\Baraka-TargetMonitoring

# تنظیمات گیت (اگه قبلاً نکردی)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# پاک کردن گیت قبلی (اگه هست)
rm -rf .git

# شروع گیت جدید
git init
git branch -M main

# اضافه کردن همه فایل‌ها
git add .

# کامیت اول
git commit -m "🎉 سامانه مدیریت ارسال تارگت شعب پخش سراسری باراکا"

# اضافه کردن ریموت گیت‌هاب
git remote add origin https://github.com/YOUR-USERNAME/Baraka-TargetMonitoring.git

# پوش به گیت‌هاب
git push -u origin main
```

وقتی پرسید:
- **Username**: یوزرنیم گیت‌هابت رو وارد کن
- **Password**: باید **Personal Access Token** وارد کنی (نه پسورد گیت‌هاب)

---

### قدم ۳-۱: ساخت Personal Access Token (اگه نداری)

گیت‌هاب دیگه پسورد قبول نمیکنه، باید توکن بسازی:

1. برو به https://github.com/settings/tokens
2. دکمه **"Generate new token"** → **"Generate new token (classic)"**
3. پر کن:
   - **Note**: `Baraka Upload`
   - **Expiration**: `30 days`
   - تیک **"repo"** رو بزن (همه زیرمجموعه‌ها هم تیک میخورن)
4. دکمه **"Generate token"** رو بزن
5. 🔴 توکن رو کپی کن (دیگه دوباره نشون داده نمیشه!)
6. وقتی گیت پرسید Password، توکن رو پیست کن

---

### قدم ۴: بررسی

برو به:
```
https://github.com/YOUR-USERNAME/Baraka-TargetMonitoring
```
باید همه فایل‌های پروژه رو ببینی ✅

---

### ⚠️ فایل‌هایی که نباید آپلود بشن (در .gitignore هستن):

- `node_modules/` — وابستگی‌ها (بعداً با `bun install` نصب میشن)
- `.next/` — فایل‌های بیلد (بعداً با `bun run build` ساخته میشن)
- `db/` — دیتابیس (روی سرور ساخته میشه)
- `.env` — متغیرهای محیطی (روی سرور ساخته میشه)
- `dev.log` — لاگ توسعه
