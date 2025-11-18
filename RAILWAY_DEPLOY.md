# 🚀 نشر موقع SCL Communication على Railway

## ✅ الموقع جاهز للنشر!

تم رفع الموقع إلى GitHub Repository:
**https://github.com/yebibeiba-pixel/scl-website**

---

## 📋 خطوات النشر على Railway

### الخطوة 1️⃣: إنشاء حساب Railway

1. اذهب إلى: **https://railway.app**
2. اضغط **"Login"** في الأعلى
3. اختر **"Login with GitHub"**
4. وافق على الأذونات المطلوبة

### الخطوة 2️⃣: إنشاء مشروع جديد

1. بعد تسجيل الدخول، اضغط **"New Project"**
2. اختر **"Deploy from GitHub repo"**
3. ابحث عن واختر: **`scl-website`**
4. اضغط **"Deploy Now"**

### الخطوة 3️⃣: إضافة قاعدة بيانات MySQL

1. في صفحة المشروع، اضغط **"+ New"**
2. اختر **"Database"**
3. اختر **"Add MySQL"**
4. انتظر حتى يتم إنشاء قاعدة البيانات

### الخطوة 4️⃣: ربط قاعدة البيانات بالموقع

1. اضغط على خدمة الموقع (scl-website)
2. اذهب إلى **"Variables"**
3. أضف المتغيرات التالية:

```
DATABASE_URL=${{MySQL.DATABASE_URL}}
NODE_ENV=production
SESSION_SECRET=scl-communication-secret-2024-secure
PORT=3001
```

4. اضغط **"Deploy"** لإعادة النشر

### الخطوة 5️⃣: تشغيل قاعدة البيانات

1. اذهب إلى خدمة MySQL
2. اضغط على **"Data"** أو **"Connect"**
3. انسخ معلومات الاتصال
4. استخدم أي MySQL client للاتصال وتشغيل السكريبت:

```sql
CREATE TABLE IF NOT EXISTS registrations (
  id varchar(64) PRIMARY KEY,
  fullName text NOT NULL,
  phoneNumber varchar(20) NOT NULL,
  email varchar(320),
  packageType enum('100mbps','200mbps','500mbps') NOT NULL,
  status enum('pending','contacted','scheduled','in_progress','completed','cancelled','out_of_coverage') NOT NULL DEFAULT 'pending',
  createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  latitude varchar(50),
  longitude varchar(50),
  locationShared varchar(10) DEFAULT 'no',
  scheduledDate timestamp NULL,
  technicianName varchar(100),
  technicianPhone varchar(20),
  contractSigned varchar(10) DEFAULT 'no',
  contractSignedAt timestamp NULL,
  signatureData text,
  contractPdfUrl text
);

CREATE TABLE IF NOT EXISTS staff_users (
  id int AUTO_INCREMENT PRIMARY KEY,
  username varchar(50) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  role enum('admin','staff') NOT NULL DEFAULT 'staff',
  createdAt timestamp DEFAULT CURRENT_TIMESTAMP
);

-- إضافة حساب الأدمن (كلمة المرور: scl2024)
INSERT INTO staff_users (username, password, role) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere', 'admin');
```

### الخطوة 6️⃣: ربط الدومين المخصص

1. في صفحة المشروع، اضغط على خدمة الموقع
2. اذهب إلى **"Settings"**
3. ابحث عن **"Domains"**
4. اضغط **"+ Custom Domain"**
5. أدخل: **`scl-communication.com`**
6. سيعطيك Railway سجل CNAME مثل:
   ```
   CNAME: scl-communication.com → your-app.up.railway.app
   ```

### الخطوة 7️⃣: إعداد DNS في Namecheap

1. اذهب إلى **Namecheap** وسجل دخولك
2. اذهب إلى **Domain List** واختر `scl-communication.com`
3. اضغط **"Manage"**
4. اذهب إلى **"Advanced DNS"**
5. أضف السجلات التالية:

| Type  | Host | Value | TTL |
|-------|------|-------|-----|
| CNAME | @ | your-app.up.railway.app | Automatic |
| CNAME | www | your-app.up.railway.app | Automatic |

6. احفظ التغييرات

⏰ **ملاحظة:** قد يستغرق تفعيل DNS من 5 دقائق إلى 48 ساعة

---

## 🎉 بعد النشر

### الروابط:
- **الموقع الرئيسي:** https://scl-communication.com
- **لوحة التحكم:** https://scl-communication.com/staff-admin.html

### بيانات الدخول:
- **اسم المستخدم:** admin
- **كلمة المرور:** scl2024

---

## 💰 التكلفة المتوقعة

- **Railway Hobby Plan:** $5/شهر
- **MySQL Database:** مضمن في الخطة
- **500GB Bandwidth:** مضمن
- **8GB RAM:** مضمن

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Logs في Railway
2. تأكد من إضافة جميع المتغيرات البيئية
3. تأكد من تشغيل قاعدة البيانات بشكل صحيح

---

**🚀 موفق في النشر!**
