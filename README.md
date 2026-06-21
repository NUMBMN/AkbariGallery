# راهنمای استفاده از مینی سایت گالری اکبری
# crated by mobin
## ساختار پوشه
```
project/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── background.jpg   ← عکس بک‌گراند (یا background.mp4 برای ویدیو)
    ├── music.mp3         ← موزیک پس‌زمینه
    ├── avatar.png         ← عکس پروفایل
    ├── resume.pdf         ← فایل قابل دانلود (رزومه/زیپ و ...)
    └── images/             ← تصاویر گالری (هر تعداد دلخواه)
```

## چیزهایی که باید اضافه کنی
این پروژه فقط کد است؛ فایل‌های رسانه‌ای واقعی (عکس/موزیک) را خودت اضافه کن:

1. `assets/background.jpg` یا `assets/background.mp4` را کنار بقیه فایل‌ها بگذار.
2. `assets/music.mp3` را اضافه کن.
3. `assets/avatar.png` را با عکس خودت جایگزین کن.
4. `assets/resume.pdf` (یا هر فایلی که می‌خواهی دانلودی باشد) را اضافه و در `index.html`
   داخل `download-btn` نام فایل را اصلاح کن.
5. عکس‌های گالری را داخل `assets/images/` بگذار و نام فایل‌ها را در `script.js`
   داخل آرایه‌ی `CONFIG.galleryImages` اضافه کن (چون مرورگر به‌تنهایی نمی‌تواند
   محتوای یک پوشه را بدون سرور بخواند):

```js
galleryImages: ["1.jpg", "2.jpg", "3.jpg"],
```

## تنظیمات قابل ویرایش
همه‌ی موارد زیر بالای فایل `script.js` داخل آبجکت `CONFIG` هستند:

- `name`, `tagline` — نام و زیرعنوان
- `typedWords` — کلمات متن تایپ‌شونده
- `social.telegram / instagram / discord / github` — لینک شبکه‌های اجتماعی
- `backgroundType` — `"image"` یا `"video"`
- `galleryImages` — لیست فایل‌های گالری
- `loadingLogo`, `loadingText` — متن صفحه‌ی لودینگ
- `primaryColor` — رنگ نئونی اصلی سایت

متن باکس معرفی (About) را هم می‌توانی مستقیم داخل `index.html`،
بخش `id="about-text"` ویرایش کنی.

## اجرا
چون گالری و برخی موارد به فچ فایل نیاز دارند، بهتر است پروژه را با یک
سرور لوکال ساده باز کنی، نه با دوبار-کلیک مستقیم روی `index.html`:

```bash
# با پایتون
python3 -m http.server 8000
# سپس در مرورگر باز کن:
# http://localhost:8000
```

یا با افزونه‌ی Live Server در VS Code.
