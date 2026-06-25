# راهنمای Deploy پروژه سامانه باراکا

## ۱. آماده‌سازی پروژه برای Production

### فایل `.env` را تنظیم کنید:
```env
DATABASE_URL="file:./db/custom.db"
NODE_ENV="production"
PORT=3000
```

### بیلد پروژه:
```bash
bun run build
```

---

## ۲. روش‌های Deploy

### روش اول: اجرای مستقیم با PM2 (ساده‌ترین)

#### مرحله ۱: نصب پیش‌نیازها روی سرور
```bash
# نصب Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# نصب bun
curl -fsSL https://bun.sh/install | bash

# نصب PM2
sudo npm install -g pm2
```

#### مرحله ۲: آپلود پروژه روی سرور
```bash
# از روی سیستم локال فایل‌ها رو به سرور منتقل کنید
scp -r /home/z/my-project user@your-server-ip:/home/user/baraka-app
```

#### مرحله ۳: نصب و بیلد روی سرور
```bash
cd /home/user/baraka-app
bun install
bun run db:push
bun run db:generate
bun run prisma/seed.ts
bun run build
```

#### مرحله ۴: اجرا با PM2
```bash
# اجرای اپلیکیشن
pm2 start bun --name "baraka-app" -- run start

# ذخیره کردن پروسه (تا بعد از ریستارت سرور هم اجرا بشه)
pm2 save
pm2 startup
```

#### مرحله ۵: تنظیم Nginx (Reverse Proxy)
```bash
sudo apt install nginx -y
```

فایل `/etc/nginx/sites-available/baraka-app` رو بسازید:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

فعال‌سازی:
```bash
sudo ln -s /etc/nginx/sites-available/baraka-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### مرحله ۶: SSL رایگان با Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### روش دوم: Docker (حرفه‌ای‌تر)

#### فایل `Dockerfile`:
```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client & build
RUN bun run db:generate
RUN bun run build

# Seed database (only first time)
RUN bun run prisma/seed.ts || true

EXPOSE 3000
CMD ["bun", "run", "start"]
```

#### فایل `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: always
    volumes:
      - ./db:/app/db
```

#### اجرا:
```bash
docker compose up -d --build
```

---

## ۳. تنظیم دامین

### مرحله ۱: تنظیم DNS
وارد پنل مدیریت دامین بشید و رکوردهای زیر رو اضافه کنید:

| نوع | نام | مقدار |
|-----|------|--------|
| A | @ | IP سرور شما |
| A | www | IP سرور شما |

### مرحله ۲: منتظر بشید تا DNS فعال بشه
معمولاً بین ۱ تا ۲۴ ساعت طول می‌کشه.
برای بررسی:
```bash
ping yourdomain.com
```

---

## ۴. نکات مهم

- **فایروال**: پورت‌های ۸۰ و ۴۴۳ رو باز کنید:
  ```bash
  sudo ufw allow 80
  sudo ufw allow 443
  sudo ufw allow 22
  ```

- **بکاپ دیتابیس**: فایل `db/custom.db` رو مرتب بکاپ بگیرید:
  ```bash
  cp db/custom.db db/backup/custom-$(date +%Y%m%d).db
  ```

- **آپدیت اپلیکیشن**: برای آپدیت بعدی:
  ```bash
  git pull  # یا scp فایل‌های جدید
  bun install
  bun run build
  pm2 restart baraka-app
  ```

---

## ۵. خلاصه سریع (۵ قدم)

1. **سرور لینوکس بگیر** + دامین تنظیم کن (DNS → IP سرور)
2. **پروژه رو آپلود کن** + `bun install` + `bun run build`
3. **PM2 اجرا کن**: `pm2 start bun --name "baraka-app" -- run start`
4. **Nginx تنظیم کن**: Reverse Proxy به پورت ۳۰۰۰
5. **SSL بزن**: `certbot --nginx`
