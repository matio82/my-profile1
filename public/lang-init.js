// تنظیم فوری زبان/جهت قبل از رندر React، برای جلوگیری از فلش زبان اشتباه
// زبان از روی خودِ آدرس صفحه تشخیص داده می‌شه (نه localStorage)، چون هر URL باید همیشه یک زبان ثابت نشون بده
(function () {
  try {
    var isEnglish = location.pathname === '/en' || location.pathname.indexOf('/en/') === 0;
    var lang = isEnglish ? 'en' : 'fa';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  } catch (e) {}
})();
