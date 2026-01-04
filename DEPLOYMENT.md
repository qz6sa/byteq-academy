# 🚀 دليل النشر - ByTeq Academy

## 📋 المتطلبات الأساسية

- Node.js 20.x أو أحدث
- MongoDB 7.0 أو أحدث
- Nginx (للإنتاج)
- PM2 (لإدارة Node.js)

## 🔧 الإعداد المحلي

### 1. تثبيت المتطلبات

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. إعداد المتغيرات البيئية

انسخ ملف `.env.example` إلى `.env` في مجلد `backend`:

```bash
cp .env.example backend/.env
```

عدّل القيم في ملف `backend/.env` حسب إعداداتك.

أنشئ ملف `.env` في مجلد `frontend`:

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### 3. تشغيل المشروع

```bash
# Backend (في terminal منفصل)
cd backend
npm run dev

# Frontend (في terminal منفصل)
cd frontend
npm run dev
```

## 🌐 النشر على VPS

### 1. تحديث السيرفر وتثبيت المتطلبات

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# تشغيل MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# تثبيت PM2 و Nginx
sudo npm install -g pm2
sudo apt install -y nginx
```

### 2. رفع الكود

```bash
# استنساخ المشروع من GitHub
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/byteq-academy.git
cd byteq-academy
```

### 3. إعداد Backend

```bash
cd /var/www/byteq-academy/backend
npm install --production

# إنشاء ملف .env (عدّل القيم حسب حاجتك)
sudo nano .env
```

محتوى ملف `.env` للإنتاج:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://localhost:27017/byteq-academy
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
CLIENT_URL=https://yourdomain.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# تشغيل Backend مع PM2
pm2 start server.js --name byteq-backend
pm2 save
pm2 startup
```

### 4. إعداد Frontend

```bash
cd /var/www/byteq-academy/frontend

# إنشاء ملف .env
echo "VITE_API_URL=https://yourdomain.com/api" > .env

# بناء Frontend
npm install
npm run build
```

### 5. إعداد Nginx

```bash
sudo nano /etc/nginx/sites-available/byteq-academy
```

محتوى ملف Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/byteq-academy/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /var/www/byteq-academy/backend/uploads;
        expires 30d;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/byteq-academy /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 6. تثبيت SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7. إعداد Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 📝 ملاحظات مهمة

1. **قاعدة البيانات:** تأكد من إعداد المستخدم والمصادقة لـ MongoDB في الإنتاج
2. **النسخ الاحتياطي:** اضبط cron job للنسخ الاحتياطي اليومي
3. **المراقبة:** استخدم `pm2 logs` لمراقبة الأخطاء
4. **التحديثات:** استخدم `git pull` لتحديث الكود

## 🔄 تحديث الموقع

```bash
cd /var/www/byteq-academy
sudo git pull

# تحديث Backend
cd backend
npm install --production
pm2 restart byteq-backend

# تحديث Frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

## 📞 الدعم

للمزيد من المساعدة، راجع الملفات:
- `README.md` - معلومات عامة
- `backend/README.md` - توثيق Backend
- `API_ENDPOINTS.md` - توثيق API
