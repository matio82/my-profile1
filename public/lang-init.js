// تنظیم فوری زبان/جهت قبل از رندر React، برای جلوگیری از فلش زبان اشتباه
(function () {
  try {
    var lang = localStorage.getItem('language') || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  } catch (e) {}
})();
