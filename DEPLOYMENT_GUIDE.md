# دليل نشر موقع SCL Communication وربطه بالنطاق scl-communication.com

## 📋 نظرة عامة

هذا الدليل يشرح خطوات نشر موقع SCL Communication - Moov Mauritel وربطه بالنطاق **scl-communication.com**.

---

## 🌐 الخطوة 1: إعدادات DNS للنطاق

يجب عليك الدخول إلى لوحة تحكم النطاق الخاص بك (GoDaddy, Namecheap, أو أي مزود آخر) وإضافة السجلات التالية:

### إذا كنت ستستخدم خادم VPS خاص بك:

```
Type: A
Name: @
Value: [عنوان IP الخاص بخادمك]
TTL: 3600

Type: A
Name: www
Value: [عنوان IP الخاص بخادمك]
TTL: 3600
```

### إذا كنت ستستخدم خدمة استضافة سحابية (مثل Vercel, Netlify, Railway):

سيتم توفير السجلات المطلوبة من قبل مزود الخدمة.

---

## 🚀 الخطوة 2: خيارات النشر

### الخيار الأول: النشر على VPS (موصى به للتحكم الكامل)

#### المتطلبات:
- خادم VPS (Ubuntu 22.04 أو أحدث)
- 2GB RAM على الأقل
- Node.js 22.13.0+
- MySQL 8.0+
- Nginx (للبروكسي العكسي)

#### خطوات التثبيت:

**1. الاتصال بالخادم:**
```bash
ssh root@your-server-ip
```

**2. تثبيت المتطلبات:**
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت pnpm
npm install -g pnpm

# تثبيت MySQL
sudo apt install -y mysql-server

# تثبيت Nginx
sudo apt install -y nginx

# تثبيت Certbot لـ SSL
sudo apt install -y certbot python3-certbot-nginx
```

**3. إعداد قاعدة البيانات:**
```bash
sudo mysql
```

```sql
CREATE DATABASE moov_mauritel_fiber;
CREATE USER 'moov_user'@'localhost' IDENTIFIED BY 'كلمة_سر_قوية_هنا';
GRANT ALL PRIVILEGES ON moov_mauritel_fiber.* TO 'moov_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**4. رفع ملفات المشروع:**
```bash
# إنشاء مجلد للمشروع
mkdir -p /var/www/scl-communication
cd /var/www/scl-communication

# رفع الملفات (استخدم scp أو git)
# مثال باستخدام scp من جهازك المحلي:
# scp moov-mauritel-fiber-complete.tar.gz root@your-server-ip:/var/www/scl-communication/

# فك الضغط
tar -xzf moov-mauritel-fiber-complete.tar.gz
cd moov-mauritel-fiber

# تثبيت المكتبات
pnpm install
```

**5. إعداد ملف .env:**
```bash
nano .env
```

أضف المحتوى التالي:
```env
# Application
VITE_APP_ID=proj_scl_communication
VITE_APP_TITLE="SCL Communication - Moov Mauritel"
VITE_APP_LOGO="https://scl-communication.com/scl-logo-small.webp"

# OAuth (إذا كنت تستخدم نظام تسجيل الدخول)
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev

# Database
DATABASE_URL=mysql://moov_user:كلمة_السر_هنا@localhost:3306/moov_mauritel_fiber

# Security
JWT_SECRET=أنشئ_مفتاح_سري_قوي_هنا_32_حرف_على_الأقل

# Server
PORT=3001
NODE_ENV=production
```

**6. بناء المشروع:**
```bash
pnpm build
```

**7. إعداد PM2 للتشغيل المستمر:**
```bash
# تثبيت PM2
npm install -g pm2

# تشغيل التطبيق
pm2 start dist/index.js --name scl-communication

# حفظ التكوين
pm2 save

# تفعيل التشغيل التلقائي عند إعادة التشغيل
pm2 startup
```

**8. إعداد Nginx:**
```bash
sudo nano /etc/nginx/sites-available/scl-communication.com
```

أضف التكوين التالي:
```nginx
server {
    listen 80;
    server_name scl-communication.com www.scl-communication.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/scl-communication.com /etc/nginx/sites-enabled/

# اختبار التكوين
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

**9. تفعيل SSL (HTTPS):**
```bash
sudo certbot --nginx -d scl-communication.com -d www.scl-communication.com
```

اتبع التعليمات وأدخل بريدك الإلكتروني.

**10. تجديد SSL التلقائي:**
```bash
sudo certbot renew --dry-run
```

---

### الخيار الثاني: النشر على Railway (سريع وسهل)

**1. إنشاء حساب على Railway:**
- اذهب إلى [railway.app](https://railway.app)
- سجل الدخول باستخدام GitHub

**2. إنشاء مشروع جديد:**
- اضغط على "New Project"
- اختر "Deploy from GitHub repo"
- ارفع المشروع إلى GitHub أولاً

**3. إضافة قاعدة بيانات MySQL:**
- في لوحة Railway، اضغط على "+ New"
- اختر "Database" → "MySQL"

**4. إعداد متغيرات البيئة:**
في إعدادات المشروع، أضف:
```
DATABASE_URL=mysql://[سيتم توفيره تلقائياً من Railway]
JWT_SECRET=مفتاح_سري_قوي
PORT=3001
NODE_ENV=production
```

**5. ربط النطاق:**
- في إعدادات المشروع، اذهب إلى "Settings" → "Domains"
- اضغط على "Custom Domain"
- أدخل `scl-communication.com`
- سيعطيك Railway سجلات DNS لإضافتها في لوحة تحكم النطاق

---

### الخيار الثالث: النشر على Vercel (للواجهة الأمامية فقط)

⚠️ **ملاحظة:** Vercel مناسب للواجهة الأمامية فقط. ستحتاج إلى خادم منفصل للـ Backend.

**1. تثبيت Vercel CLI:**
```bash
npm install -g vercel
```

**2. تسجيل الدخول:**
```bash
vercel login
```

**3. نشر المشروع:**
```bash
cd /home/ubuntu/moov-mauritel-fiber
vercel --prod
```

**4. ربط النطاق:**
```bash
vercel domains add scl-communication.com
```

---

## 🔒 الخطوة 3: الأمان والصيانة

### 1. تأمين قاعدة البيانات:
```bash
sudo mysql_secure_installation
```

### 2. إعداد Firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 3. النسخ الاحتياطي التلقائي:
```bash
# إنشاء سكريبت للنسخ الاحتياطي
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
mkdir -p $BACKUP_DIR

mysqldump -u moov_user -p'كلمة_السر' moov_mauritel_fiber > $BACKUP_DIR/backup_$DATE.sql

# حذف النسخ الاحتياطية الأقدم من 7 أيام
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
# جعل السكريبت قابل للتنفيذ
sudo chmod +x /usr/local/bin/backup-db.sh

# إضافة مهمة cron يومية
sudo crontab -e
# أضف السطر التالي:
0 2 * * * /usr/local/bin/backup-db.sh
```

### 4. مراقبة الأداء:
```bash
# عرض حالة PM2
pm2 status

# عرض السجلات
pm2 logs scl-communication

# عرض استخدام الموارد
pm2 monit
```

---

## 📊 الخطوة 4: التحقق من النشر

بعد إكمال الخطوات أعلاه:

1. **اختبار الموقع:**
   - افتح المتصفح واذهب إلى `https://scl-communication.com`
   - تأكد من أن الموقع يعمل بشكل صحيح
   - اختبر جميع الصفحات والميزات

2. **اختبار SSL:**
   - تأكد من ظهور القفل الأخضر في شريط العنوان
   - اختبر على [SSL Labs](https://www.ssllabs.com/ssltest/)

3. **اختبار الأداء:**
   - استخدم [Google PageSpeed Insights](https://pagespeed.web.dev/)
   - استخدم [GTmetrix](https://gtmetrix.com/)

4. **اختبار التوافق:**
   - اختبر على مختلف الأجهزة (موبايل، تابلت، ديسكتوب)
   - اختبر على مختلف المتصفحات (Chrome, Firefox, Safari, Edge)

---

## 🛠️ استكشاف الأخطاء

### المشكلة: الموقع لا يظهر بعد تغيير DNS
**الحل:** انتظر 24-48 ساعة لانتشار DNS عالمياً. يمكنك التحقق من [whatsmydns.net](https://www.whatsmydns.net/)

### المشكلة: خطأ في الاتصال بقاعدة البيانات
**الحل:** 
```bash
# تحقق من أن MySQL يعمل
sudo systemctl status mysql

# تحقق من صحة بيانات الاتصال في .env
cat .env | grep DATABASE_URL
```

### المشكلة: الموقع بطيء
**الحل:**
```bash
# تحقق من استخدام الموارد
htop

# تحقق من سجلات PM2
pm2 logs scl-communication --lines 100
```

### المشكلة: SSL لا يعمل
**الحل:**
```bash
# تجديد الشهادة
sudo certbot renew --force-renewal

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

---

## 📞 معلومات الاتصال

- **الموقع:** https://scl-communication.com
- **البريد:** info@scl-communication.mr
- **الهاتف:** 0022244292222

---

## 📝 ملاحظات إضافية

### تحديث المشروع:
```bash
cd /var/www/scl-communication/moov-mauritel-fiber
git pull  # إذا كنت تستخدم Git
pnpm install
pnpm build
pm2 restart scl-communication
```

### إضافة مستخدم إداري:
يجب إضافة المستخدمين الإداريين مباشرة في قاعدة البيانات:
```sql
INSERT INTO staffUsers (userId, role, canViewRegistrations, canEditRegistrations, canDeleteRegistrations, canManageUsers, canExportReports)
VALUES ('user_id_here', 'admin', 'yes', 'yes', 'yes', 'yes', 'yes');
```

---

## ✅ قائمة التحقق النهائية

- [ ] DNS مُعد بشكل صحيح
- [ ] الخادم يعمل ويمكن الوصول إليه
- [ ] MySQL مثبت ويعمل
- [ ] قاعدة البيانات منشأة والجداول موجودة
- [ ] ملف .env مُعد بالقيم الصحيحة
- [ ] المشروع مبني بنجاح
- [ ] PM2 يشغل التطبيق
- [ ] Nginx مُعد كبروكسي عكسي
- [ ] SSL مفعل ويعمل
- [ ] النسخ الاحتياطي التلقائي مُعد
- [ ] Firewall مُعد
- [ ] الموقع يعمل على https://scl-communication.com

---

**تم إعداد هذا الدليل بواسطة Manus AI**  
**آخر تحديث: نوفمبر 2025**
