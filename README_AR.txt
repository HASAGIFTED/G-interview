تعليمات رفع الموقع على GitHub Pages

1. ارفع محتويات مجلد talibat_mawhubat_site إلى مستودع GitHub.
2. من Settings ثم Pages اختر النشر من الفرع main والمجلد root.
3. الموقع مرتبط حاليًا بخدمة Google Apps Script التالية:
https://script.google.com/macros/s/AKfycbw6AOuvz1NSLk8rtQ3527FORblZI49LUaTy5AqNKL_0K-VjOwFDry1HUSoMqN1dW2YnHg/exec
4. لا ترفع ملف Excel أو بيانات الطالبات إلى GitHub. البيانات تبقى داخل Google Sheets.
5. عند تعديل بيانات الشيت لا تحتاج إلى إعادة رفع الموقع.
6. عند تعديل كود Apps Script يجب إنشاء إصدار نشر جديد، ثم تحديث رابط API_URL داخل app.js إذا تغيّر الرابط.

ملاحظة أمنية:
الموقع لا يحمل قاعدة البيانات كاملة، بل يرسل رقم الهوية فقط ويستقبل سجل الطالبة المطابق عند وجوده.
