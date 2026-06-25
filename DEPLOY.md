# راهنمای Deploy پروژه سامانه باراکا روی ویندوز سرور

---

## قدم ۱: نصب پیش‌نیازها روی ویندوز سرور

### ۱-۱. نصب Node.js
- از سایت https://nodejs.org نسخه **LTS (20+)** رو دانلود و نصب کنید
- تیک **"Add to PATH"** رو حتماً بزنید
- برای بررسی نصب، CMD رو باز کنید:
```cmd
node --version
npm --version
```

### ۱-۲. نصب Bun
- PowerShell رو باز کنید و اجرا کنید:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```
- یا از سایت https://bun.sh نسخه ویندوز رو دانلود کنید
- بررسی:
```cmd
bun --version
```

### ۱-۳. نصب PM2 (برای اجرای مداوم)
```cmd
npm install -g pm2 pm2-windows-startup
pm2-startup install
```

---

## قدم ۲: آپلود پروژه روی سرور

### روش RDP (Remote Desktop):
1. با RDP وصل بشید به سرور
2. فولدر پروژه رو از سیستم خودتون **Copy** کنید
3. روی سرور در مسیر دلخواه **Paste** کنید (مثلاً `C:\baraka-app`)

### روش SCP/SFTP:
```cmd
scp -r C:\my-project user@YOUR_SERVER_IP:C:/baraka-app
```

---

## قدم ۳: بیلد پروژه روی سرور

CMD رو باز کنید:
```cmd
cd C:\baraka-app

bun install
bun run db:push
bun run db:generate
bun run prisma/seed.ts
bun run build
```

---

## قدم ۴: اجرای اپلیکیشن

### تست اول:
```cmd
bun run start
```
بررسی کنید: مرورگر رو باز کنید و بزنید `http://localhost:3000`
اگر صفحات بارگزاری شد، Ctrl+C بزنید و برید قدم بعد.

### اجرای دائمی با PM2:
```cmd
pm2 start bun --name "baraka-app" -- run start
pm2 save
```

برای بررسی وضعیت:
```cmd
pm2 status
pm2 logs baraka-app
```

---

## قدم ۵: تنظیم IIS به عنوان Reverse Proxy

### ۵-۱. نصب IIS
1. **Server Manager** رو باز کنید
2. **Add Roles and Features** → **Web Server (IIS)** رو نصب کنید
3. تمام زیرمجموعه‌های **Application Development** رو هم نصب کنید

### ۵-۲. نصب Application Request Routing (ARR)
1. از سایت مایکروسافت دانلود و نصب کنید:
   https://www.iis.net/downloads/microsoft/application-request-routing
2. باز کنید IIS Manager → سرور رو انتخاب کنید → **Application Request Routing Cache**
3. سمت راست **Server Proxy Settings** → تیک **Enable proxy** رو بزنید → **Apply**

### ۵-۳. نصب URL Rewrite Module
از سایت مایکروسافت دانلود و نصب کنید:
https://www.iis.net/downloads/microsoft/url-rewrite

### ۵-۴. ساخت وب‌سایت در IIS
1. **IIS Manager** رو باز کنید
2. راست‌کلیک روی **Sites** → **Add Website**
   - **Site name**: `BarakaApp`
   - **Physical path**: `C:\inetpub\baraka` (یه فولدر خالی بسازید)
   - **Port**: `80`
   - **Host name**: `yourdomain.com`
3. **OK** رو بزنید

### ۵-۵. تنظیم Reverse Proxy
در فولدر `C:\inetpub\baraka` یه فایل به نام `web.config` بسازید:

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

---

## قدم ۶: تنظیم دامین (DNS)

وارد پنل مدیریت دایمتون بشید:

| نوع | نام | مقدار |
|-----|------|--------|
| **A** | @ | آی‌پی سرور ویندوز |
| **A** | www | آی‌پی سرور ویندوز |

منتظر بشید ۱ تا ۲۴ ساعت تا DNS فعال بشه.

---

## قدم ۷: SSL (HTTPS)

### روش ۱: ویندوز با win-acme (رایگان و خودکار)

1. دانلود: https://www.win-acme.com/
2. اکسترکت کنید و `wacs.exe` رو اجرا کنید
3. گزینه **M** (Full menu) → **2** (Create certificate - IIS binding)
4. سایت `BarakaApp` رو انتخاب کنید
5. دایمنت رو وارد کنید
6. تایید → گواهی SSL خودکار نصب میشه و هر ۶۰ روز تمدید میشه

### روش ۲: تنظیم دستی پورت ۴۴۳ در IIS
اگه گواهی SSL خریدید:
1. IIS Manager → سایت BarakaApp → **Bindings**
2. **Add** → **https** → پورت **443** → گواهی SSL رو انتخاب کنید

---

## قدم ۸: فایروال ویندوز

پورت‌های ۸۰ و ۴۴۳ رو باز کنید:

### از طریق GUI:
1. **Windows Firewall with Advanced Security** رو باز کنید
2. **Inbound Rules** → **New Rule** → **Port** → **TCP**
3. پورت‌های `80,443` رو وارد کنید → **Allow the connection**

### از طریق PowerShell (Run as Admin):
```powershell
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
```

---

## قدم ۷: تست نهایی

مرورگر رو باز کنید:
```
http://yourdomain.com
https://yourdomain.com
```

باید صفحه لاگین سامانه باراکا رو ببینید! ✅

---

## 🔧 نکات مهم

### اجرای خودکار بعد از ریستارت سرور
PM2 ممکنه بعد از ریستارت ویندوز اجرا نشه. برای حل این مشکل:

**روش ۱: Scheduled Task**
1. **Task Scheduler** رو باز کنید
2. **Create Basic Task**:
   - نام: `BarakaApp PM2`
   - Trigger: **When the computer starts**
   - Action: **Start a program**
   - Program: `pm2`
   - Arguments: `resurrect`
3. **Finish**

**روش ۲: فایل bat در Startup**
یه فایل `start-baraka.bat` بسازید:
```bat
@echo off
cd C:\baraka-app
pm2 resurrect
```
و یه شورتکات ازش بذارید توی:
```
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
```

### بکاپ دیتابیس
فایل `db\custom.db` رو مرتب بکاپ بگیرید:
```cmd
copy C:\baraka-app\db\custom.db C:\baraka-app\db\backup\custom-%date:~0,10%.db
```

### آپدیت اپلیکیشن
```cmd
cd C:\baraka-app
bun install
bun run build
pm2 restart baraka-app
```

### مشاهده لاگ‌ها
```cmd
pm2 logs baraka-app
```

---

## 📋 خلاصه ۶ قدمه

| # | اقدام | جزئیات |
|---|--------|---------|
| 1 | **نصب پیش‌نیازها** | Node.js + Bun + PM2 |
| 2 | **آپلود پروژه** | RDP یا SCP به `C:\baraka-app` |
| 3 | **بیلد** | `bun install` → `bun run build` |
| 4 | **PM2** | `pm2 start bun --name "baraka-app" -- run start` |
| 5 | **IIS Reverse Proxy** | ARR + URL Rewrite + web.config |
| 6 | **SSL + DNS** | win-acme یا گواهی خریدی + DNS A Record |
