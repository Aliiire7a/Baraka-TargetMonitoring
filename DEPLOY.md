# راهنمای Deploy سامانه باراکا روی ویندوز سرور
# (قدم به قدم، ریز به ریز)

---

# ═══════════════════════════════════════
# قدم ۱: نصب Node.js روی ویندوز سرور
# ═══════════════════════════════════════

1. روی سرور ویندوزت، مرورگر (Internet Explorer یا Edge) رو باز کن
2. برو به آدرس: https://nodejs.org
3. دکمه سبز رنگ "20.x.x LTS" رو کلیک کن — فایل .msi دانلود میشه
4. فایل دانلود شده رو دابل‌کلیک کن
5. صفحه Welcome → دکمه Next رو بزن
6. صفحه License Agreement → تیک "I accept..." رو بزن → Next
7. صفحه Installation Folder → بدون تغییر Next رو بزن
8. صفحه Custom Setup → مطمئن شو تیک "Node.js runtime" و "npm package manager" و "Add to PATH" خورده → Next
9. صفحه Tools for Native Modules → تیک "Automatically install the necessary tools" رو بزن → Next
10. دکمه Install رو بزن
11. اگر پنجره User Account Control باز شد → Yes رو بزن
12. صبر کن تا نصب تموم شه → Finish رو بزن

### بررسی نصب:
- کلید Windows + R رو بزن → تایپ کن `cmd` → Enter
- توی سیاه‌چاله (Command Prompt) تایپ کن:
```
node --version
```
- باید یه شماره مثل `v20.11.0` نشون بده

- بعد تایپ کن:
```
npm --version
```
- باید یه شماره مثل `10.2.3` نشون بده

- CMD رو ببند (تایپ کن `exit`)


# ═══════════════════════════════════════
# قدم ۲: نصب Bun روی ویندوز سرور
# ═══════════════════════════════════════

1. کلید Windows رو بزن → تایپ کن `PowerShell`
2. روی "Windows PowerShell" راست‌کلیک کن → "Run as administrator"
3. اگر پنجره User Account Control باز شد → Yes

4. حالا دستور زیر رو کپی کن و توی PowerShell پیست کن و Enter بزن:
```powershell
irm bun.sh/install.ps1 | iex
```

5. صبر کن تا نصب تموم شه (چند ثانیه)

6. PowerShell رو ببند (تایپ کن `exit`)


# ═══════════════════════════════════════
# قدم ۳: نصب PM2 روی ویندوز سرور
# ═══════════════════════════════════════

1. CMD رو باز کن (Windows + R → `cmd` → Enter)
2. تایپ کن:
```
npm install -g pm2
```
3. صبر کن تا نصب بشه
4. بررسی:
```
pm2 --version
```
5. CMD رو ببند


# ═══════════════════════════════════════
# قدم ۴: انتقال پروژه به سرور
# ═══════════════════════════════════════

### روش ۱: با Remote Desktop (RDP) — راحت‌ترین

1. روی کامپیوتر خودت، کلید Windows + R رو بزن → تایپ کن `mstsc` → Enter
2. آی‌پی سرور رو وارد کن → Connect
3. یوزر و پسورد سرور رو وارد کن → OK
4. حالا تو سرور هستی

5. روی کامپیوتر خودت، فولدر پروژه رو پیدا کن
   - تمام فایل‌های پروژه رو انتخاب کن (Ctrl+A)
   - کپی کن (Ctrl+C)

6. برگرد به سرور (پنجره RDP)
7. فولدر `C:\` رو باز کن
8. راست‌کلیک → New → Folder → اسمش رو بذار `baraka-app`
9. وارد فولدر `baraka-app` بشو
10. راست‌کلیک → Paste (Ctrl+V)
11. صبر کن تا همه فایل‌ها کپی بشن

### ⚠️ فایل‌هایی که نباید کپی بشن:
- فولدر `.next` (بعداً روی سرور بیلد میشه)
- فولدر `node_modules` (بعداً روی سرور نصب میشه)
- فایل `dev.log`

### روش ۲: با FTP (اگه RDP نداری)
1. نرم‌افزار FileZilla رو از https://filezilla-project.org دانلود و نصب کن
2. بازش کن
3. بالا سمت راست:
   - Host: آی‌پی سرورت
   - Username: یوزر سرورت
   - Password: پسورد سرورت
   - Port: 22
4. Quickconnect رو بزن
5. سمت چپ: فولدر پروژه رو پیدا کن
6. سمت راست: برو به `C:\baraka-app`
7. فایل‌ها رو از چپ بکش و بنداز راست (Drag & Drop)


# ═══════════════════════════════════════
# قدم ۵: بیلد پروژه روی سرور
# ═══════════════════════════════════════

1. CMD رو باز کن (Windows + R → `cmd` → Enter)
2. برو به فولدر پروژه:
```
cd C:\baraka-app
```

3. نصب وابستگی‌ها:
```
bun install
```
صبر کن تا تموم بشه (ممکنه ۱-۲ دقیقه طول بکشه)

4. ساخت دیتابیس:
```
bun run db:push
```
وقتی پرسید "apply changes" → Enter بزن

5. تولید Prisma Client:
```
bun run db:generate
```

6. پر کردن دیتابیس با اطلاعات اولیه:
```
bun run prisma/seed.ts
```
باید بگه:
```
✅ Admin user created
✅ Regular user created
✅ Branches created
```

7. بیلد پروژه:
```
bun run build
```
صبر کن تا تموم بشه (ممکنه ۲-۳ دقیقه طول بکشه)
آخر باید بگه: `✓ Compiled successfully`

8. تست اجرا:
```
bun run start
```
صبر کن تا بگه: `Ready on http://localhost:3000`

9. مرورگر رو باز کن و برو به: `http://localhost:3000`
10. باید صفحه لاگین سامانه باراکا رو ببینی ✅

11. اگر کار کرد، برگرد CMD و Ctrl+C بزن تا متوقف بشه


# ═══════════════════════════════════════
# قدم ۶: اجرای دائمی با PM2
# ═══════════════════════════════════════

### ۶-۱. شروع اپلیکیشن

1. CMD رو باز کن (اگه بسته شده)
2. برو به فولدر پروژه:
```
cd C:\baraka-app
```

3. اجرا با PM2:
```
pm2 start bun --name "baraka-app" -- run start
```

4. باید جدولی نشون بده که توش:
   - name: baraka-app
   - status: online ✅

5. ذخیره تنظیمات:
```
pm2 save
```

### ۶-۲. بررسی وضعیت
```
pm2 status
```
باید بگه status: online

### ۶-۳. مشاهده لاگ‌ها
```
pm2 logs baraka-app
```
برای خروج: Ctrl+C

### ۶-۴. ریستارت کردن اپلیکیشن (اگه لازم شد)
```
pm2 restart baraka-app
```

### ۶-۵. توقف اپلیکیشن
```
pm2 stop baraka-app
```

### ۶-۶. اجرای خودکار بعد از ریستارت سرور

چون PM2 روی ویندوز خودکار بعد ریستارت اجرا نمیشه، باید یه Scheduled Task بسازی:

1. کلید Windows رو بزن → تایپ کن `Task Scheduler` → Enter
2. سمت راست، روی "Create Basic Task" کلیک کن
3. Name: تایپ کن `Baraka PM2 Start` → Next
4. Trigger: انتخاب کن "When the computer starts" → Next
5. Action: انتخاب کن "Start a program" → Next
6. Program/script: تایپ کن `pm2`
7. Add arguments: تایپ کن `resurrect` → Next
8. تیک "Open the Properties dialog" رو بزن → Finish
9. تو پنجره Properties:
   - تب General → تیک "Run whether user is logged on or not" رو بزن
   - تب Conditions → تیک "Start the task only if the computer is on AC power" رو **بردار**
   - OK رو بزن
   - پسورد ادمین رو وارد کن

10. حالا بعد از هر ریستارت سرور، اپلیکیشن خودکار بالا میاد ✅


# ═══════════════════════════════════════
# قدم ۷: نصب و تنظیم IIS (وب‌سرور ویندوز)
# ═══════════════════════════════════════

### ۷-۱. فعال‌سازی IIS

1. **Server Manager** رو باز کن (آیکونش تو Taskbar هست یا Start منو سرچ کن)
2. بالای صفحه، روی **"Manage"** کلیک کن → **"Add Roles and Features"**
3. صفحه Before You Begin → Next
4. Installation Type → انتخاب کن **"Role-based or feature-based installation"** → Next
5. Server Selection → سرورت رو انتخاب کن → Next
6. Server Roles:
   - تیک **"Web Server (IIS)"** رو بزن
   - پنجره‌ای باز میشه که میگه.features هم اضافه بشه → **"Add Features"** رو بزن → Next
7. Features → بدون تغییر Next رو بزن
8. Web Server Role (IIS):
   - سمت چپ **"Role Services"** رو بزن
   - مطمئن شو اینا تیک خوردن:
     ✅ Common HTTP Features (همه)
     ✅ Health and Diagnostics (همه)
     ✅ Performance (همه)
     ✅ Security (Request Filtering)
     ✅ Application Development:
        ✅ .NET Extensibility 4.8
        ✅ ASP.NET 4.8
        ✅ ISAPI Extensions
        ✅ ISAPI Filters
   → Next
9. Confirmation → **Install** رو بزن
10. صبر کن تا نصب تموم شه → Close

### ۷-۲. بررسی IIS
- مرورگر رو باز کن → برو به `http://localhost`
- باید صفحه پیش‌فرض IIS رو ببینی ✅


# ═══════════════════════════════════════
# قدم ۸: نصب URL Rewrite Module برای IIS
# ═══════════════════════════════════════

1. مرورگر رو باز کن و برو به:
   https://www.iis.net/downloads/microsoft/url-rewrite

2. دکمه **"Install this extension"** یا **"Download"** رو بزن

3. اگر مایکروسافت اکانت خواست یا Web Platform Installer باز شد:
   - از طریق Web Platform Installer:
     - سرچ کن "URL Rewrite"
     - دکمه Add رو بزن → Install

   - یا مستقیم دانلود:
     - فایل .msi رو دانلود کن
     - دابل‌کلیک → Next → Next → Install → Finish

4. بررسی: IIS Manager رو باز کن → یه سایت رو انتخاب کن → سمت راست باید "URL Rewrite" آیکون رو ببینی


# ═══════════════════════════════════════
# قدم ۹: نصب Application Request Routing (ARR)
# ═══════════════════════════════════════

1. مرورگر رو باز کن و برو به:
   https://www.iis.net/downloads/microsoft/application-request-routing

2. دکمه **"Install this extension"** رو بزن

3. از طریق Web Platform Installer:
   - سرچ کن "Application Request Routing"
   - دکمه Add رو بزن → Install

   - یا مستقیم دانلود:
     - فایل .msi رو دانلود کن
     - دابل‌کلیک → Next → Next → Install → Finish

4. **فعال‌سازی Proxy:**
   - **IIS Manager** رو باز کن
   - سمت چپ، روی اسم سرورت کلیک کن (بالای همه)
   - وسط صفحه، روی **"Application Request Routing Cache"** دابل‌کلیک کن
   - سمت راست، روی **"Server Proxy Settings..."** کلیک کن
   - تیک **"Enable proxy"** رو بزن ✅
   - دکمه **Apply** سمت راست رو بزن
   - این خیلی مهمه! بدون این، Reverse Proxy کار نمیکنه


# ═══════════════════════════════════════
# قدم ۱۰: ساخت وب‌سایت در IIS
# ═══════════════════════════════════════

### ۱۰-۱. ساخت فولدر برای IIS

1. File Explorer رو باز کن
2. برو به `C:\inetpub`
3. داخلش یه فولدر جدید بساز به اسم `baraka`
4. داخل فولدر `baraka` یه فایل تکست بساز:
   - راست‌کلیک → New → Text Document
   - اسمش رو بذار `web.config`
   - ⚠️ مراقب باش که اسمش `web.config.txt` نشه! اگه شد، بعداً تغییرش بده

### ۱۰-۲. نوشتن تنظیمات Reverse Proxy

1. فایل `C:\inetpub\baraka\web.config` رو با Notepad باز کن
2. تمام محتواش رو پاک کن
3. متن زیر رو کپی و پیست کن:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxyToBaraka" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:3000/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
            <set name="HTTP_X_FORWARDED_FOR" value="{REMOTE_ADDR}" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

4. Ctrl+S بزن تا سیو بشه
5. Notepad رو ببند

### ۱۰-۳. اضافه کردن وب‌سایت به IIS

1. **IIS Manager** رو باز کن:
   - کلید Windows → تایپ کن `IIS` → Enter

2. سمت چپ، روی **"Sites"** راست‌کلیک کن → **"Add Website..."**

3. پر کن:
   - **Site name**: `BarakaApp`
   - **Physical path**: دکمه `...` رو بزن → برو به `C:\inetpub\baraka` → OK
   - **Binding**:
     - Type: `http`
     - IP Address: `All Unassigned`
     - Port: `80`
     - Host name: `yourdomain.com` ← دایمنت رو اینجا بنویس
   - دکمه **OK** رو بزن

4. اگر پیام خطا داد که پورت ۸۰ قبلاً در استفاده‌ست:
   - اول سایت پیش‌فرض "Default Web Site" رو متوقف کن:
   - سمت چپ روی "Default Web Site" کلیک کن
   - سمت راست روی "Stop" کلیک کن
   - دوباره تلاش کن وب‌سایت جدید بسازی


# ═══════════════════════════════════════
# قدم ۱۱: تنظیم DNS دامین
# ═══════════════════════════════════════

1. برو به سایت خرید دایمنت (مثلاً ایرنیک، لیترا، یا هر جا که دایمنت رو خریدی)

2. وارد پنل مدیریت دامین بشو

3. بخش **"DNS Management"** یا **"مدیریت DNS"** رو پیدا کن

4. یه رکورد جدید اضافه کن:
   - نوع (Type): **A**
   - نام (Name/Host): `@`
   - مقدار (Value/Address): **آی‌پی سرور ویندوزت** (مثلاً `185.234.56.78`)
   - TTL: پیش‌فرض رو بذار

5. یه رکورد دیگه اضافه کن:
   - نوع (Type): **A**
   - نام (Name/Host): `www`
   - مقدار (Value/Address): **آی‌پی سرور ویندوزت** (همون آی‌پی)
   - TTL: پیش‌فرض رو بذار

6. ذخیره کن

7. ⏰ صبر کن — معمولاً بین ۱ تا ۲۴ ساعت طول می‌کشه تا DNS فعال بشه

8. برای بررسی:
   - CMD رو باز کن
   - تایپ کن: `ping yourdomain.com`
   - باید آی‌پی سرورت رو نشون بده


# ═══════════════════════════════════════
# قدم ۱۲: باز کردن پورت‌های فایروال
# ═══════════════════════════════════════

### روش ۱: با PowerShell (سریع‌تر)

1. PowerShell رو باز کن (Run as administrator)
2. دستورات زیر رو یکی‌یکی اجرا کن:

```powershell
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
```

### روش ۲: با GUI

1. کلید Windows → تایپ کن `Windows Defender Firewall` → Enter
2. سمت چپ، روی **"Advanced Settings"** کلیک کن
3. سمت چپ، روی **"Inbound Rules"** کلیک کن
4. سمت راست، روی **"New Rule..."** کلیک کن
5. Rule Type: انتخاب کن **"Port"** → Next
6. Protocol and Ports:
   - TCP رو انتخاب کن
   - Specific local ports: تایپ کن `80,443`
   → Next
7. Action: **"Allow the connection"** → Next
8. Profile: هر سه تیک رو بزن (Domain, Private, Public) → Next
9. Name: تایپ کن `Allow HTTP and HTTPS` → Finish


# ═══════════════════════════════════════
# قدم ۱۳: تست بدون SSL
# ═══════════════════════════════════════

حالا باید سایتت کار کنه!

1. مرورگر رو باز کن
2. برو به: `http://yourdomain.com`
3. باید صفحه لاگین سامانه باراکا رو ببینی ✅

اگه نشد:
- CMD رو باز کن → `pm2 status` → مطمئن شو status: online هست
- IIS Manager رو باز کن → مطمئن شو سایت BarakaApp در حال اجراست
- `ping yourdomain.com` → مطمئن شو DNS درسته


# ═══════════════════════════════════════
# قدم ۱۴: نصب SSL (HTTPS) — رایگان
# ═══════════════════════════════════════

### ۱۴-۱. دانلود win-acme

1. برو به: https://www.win-acme.com/
2. روی **"Downloads"** کلیک کن
3. آخرین نسخه رو دانلود کن (فایل .zip)
4. فایل zip رو اکسترکت کن به فولدر `C:\win-acme`

### ۱۴-۲. اجرای win-acme

1. برو به فولدر `C:\win-acme`
2. روی فایل `wacs.exe` دابل‌کلیک کن
   - اگر پنجره Firewall باز شد → Allow access

3. منوی اصلی نمایش داده میشه. این مراحل رو دنبال کن:

   **مرحله ۱:** تایپ کن `M` و Enter بزن (Full menu)

   **مرحله ۲:** تایپ کن `2` و Enter بزن (Create certificate - IIS binding)

   **مرحله ۳:** لیست سایت‌های IIS نشون داده میشه. شماره سایت `BarakaApp` رو وارد کن و Enter بزن

   **مرحله ۴:** برای Host name، دایمنت رو وارد کن (مثلاً `yourdomain.com`) و Enter بزن

   **مرحله ۵:** اگه پرسید دامین دیگه‌ای هم اضافه کنی، تایپ کن `www.yourdomain.com` و Enter بزن
   بعد تایپ کن `n` (برای نه، دیگه دامین اضافه نمیکنی) و Enter

   **مرحله ۶:** برای validation:
   - تایپ کن `[http-01]` رو انتخاب کن (معمولاً پیش‌فرضه) و Enter

   **مرحله ۷:** برای Certificate path:
   - پیش‌فرض رو قبول کن → Enter

   **مرحله ۸:** برای Store:
   - پیش‌فرض رو قبول کن → Enter

   **مرحله ۹:** برای Installation:
   - تایپ کن `IIS` رو انتخاب کن → Enter

   **مرحله ۱۰:** تایید نهایی → Enter

4. صبر کن تا گواهی SSL ساخته و نصب بشه ✅

5. حالا اگه ببری به `https://yourdomain.com` باید با HTTPS باز بشه 🔒

### ۱۴-۳. تمدید خودکار SSL

win-acme خودکار یه Scheduled Task میسازه که هر ۶۰ روز SSL رو تمدید میکنه. نیازی به کار اضافه نیست.

برای بررسی:
1. Task Scheduler رو باز کن
2. سمت چپ، روی "Task Scheduler Library" کلیک کن
3. باید یه تسک با اسم `win-acme` یا `letsencrypt` ببینی


# ═══════════════════════════════════════
# قدم ۱۵: توقف سایت پیش‌فرض IIS
# ═══════════════════════════════════════

اگه کسی با آی‌پی سرور باز کن، نباید صفحه IIS پیش‌فرض رو ببینه:

1. IIS Manager رو باز کن
2. سمت چپ، روی "Default Web Site" کلیک کن
3. سمت راست، روی "Stop" کلیک کن


# ═══════════════════════════════════════
# قدم ۱۶: تست نهایی
# ═══════════════════════════════════════

مرورگر رو باز کن و برو به:

✅ `https://yourdomain.com` — باید صفحه لاگین سامانه باراکا رو ببینی
✅ قفل سبز 🔒 کنار آدرس باید باشه (SSL فعال)
✅ با یوزر admin و پسورد admin123 وارد بش
✅ با یوزر user و پسورد user123 وارد بش


# ═══════════════════════════════════════
# نکات مهم بعد از Deploy
# ═══════════════════════════════════════

### بکاپ دیتابیس
فایل `C:\baraka-app\db\custom.db` حاوی تمام اطلاعات دیتابیسه.
هر هفته یه کپی ازش بگیر و جایی دیگه ذخیره کن.

### آپدیت اپلیکیشن
اگه نسخه جدیدی از پروژه گرفتی:
1. فایل‌های جدید رو روی سرور کپی کن (جایگزین قبلی)
2. CMD رو باز کن:
```
cd C:\baraka-app
bun install
bun run build
pm2 restart baraka-app
```

### ریستارت دستی اپلیکیشن
```
pm2 restart baraka-app
```

### مشاهده لاگ خطاها
```
pm2 logs baraka-app
```

### وضعیت PM2
```
pm2 status
```
