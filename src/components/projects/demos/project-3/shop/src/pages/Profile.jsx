
import React, { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

// =============================================================================
// 🎨 آیکون‌های SVG
// =============================================================================
const Icons = {
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Location: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  CreditCard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Camera: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

// =============================================================================
// 📦 PROFILE PAGE COMPONENT
// =============================================================================
const Profile = () => {
  // ✅ اصلاح: حذف user از destructuring چون استفاده نمی‌شود
  const { updateUser } = useContext(AuthContext);

  // State ها
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // اطلاعات پروفایل
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    nationalId: "",
    birthDate: "",
    gender: "",
  });

  // تغییر رمز عبور
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // آدرس‌ها
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    title: "",
    fullAddress: "",
    city: "",
    province: "",
    postalCode: "",
    receiverName: "",
    receiverPhone: "",
    isDefault: false,
  });

  // ==========================================================================
  // 💬 نمایش پیام
  // ==========================================================================
  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  }, []);

  // ==========================================================================
  // 📥 دریافت اطلاعات کاربر - با useCallback
  // ==========================================================================
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data.user || res.data;
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        nationalId: userData.nationalId || "",
        birthDate: userData.birthDate ? userData.birthDate.split("T")[0] : "",
        gender: userData.gender || "",
      });
      setAddresses(userData.addresses || []);
    } catch (err) {
      console.error("❌ خطا در دریافت پروفایل:", err);
      showMessage("error", "خطا در دریافت اطلاعات پروفایل");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // ✅ useEffect با وابستگی صحیح
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ==========================================================================
  // 💾 ذخیره اطلاعات شخصی
  // ==========================================================================
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await axios.put("/auth/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage("success", "✅ اطلاعات با موفقیت ذخیره شد");

      // به‌روزرسانی context
      if (updateUser) {
        updateUser(res.data.user);
      }
    } catch (err) {
      showMessage("error", err.response?.data?.message || "خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // 🔐 تغییر رمز عبور
  // ==========================================================================
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showMessage("error", "رمز عبور جدید و تکرار آن مطابقت ندارند");
      return;
    }

    if (passwords.newPassword.length < 6) {
      showMessage("error", "رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await axios.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage("success", "✅ رمز عبور با موفقیت تغییر کرد");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showMessage("error", err.response?.data?.message || "خطا در تغییر رمز عبور");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // 📍 مدیریت آدرس‌ها
  // ==========================================================================
  const handleSaveAddress = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (editingAddress) {
        // ویرایش آدرس
        await axios.put(`/auth/addresses/${editingAddress._id}`, newAddress, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showMessage("success", "✅ آدرس با موفقیت ویرایش شد");
      } else {
        // افزودن آدرس جدید
        await axios.post("/auth/addresses", newAddress, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showMessage("success", "✅ آدرس جدید اضافه شد");
      }

      fetchProfile();
      closeAddressModal();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "خطا در ذخیره آدرس");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("آیا از حذف این آدرس مطمئن هستید؟")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/auth/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("success", "✅ آدرس حذف شد");
      fetchProfile();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "خطا در حذف آدرس");
    }
  };

  // ✅ اصلاح: حذف تابع بلااستفاده handleSetDefaultAddress
  // اگر نیاز دارید می‌توانید آن را نگه دارید، اما چون استفاده نمی‌شد حذف شد

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setNewAddress({ ...address });
    } else {
      setEditingAddress(null);
      setNewAddress({
        title: "",
        fullAddress: "",
        city: "",
        province: "",
        postalCode: "",
        receiverName: "",
        receiverPhone: "",
        isDefault: false,
      });
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setNewAddress({
      title: "",
      fullAddress: "",
      city: "",
      province: "",
      postalCode: "",
      receiverName: "",
      receiverPhone: "",
      isDefault: false,
    });
  };

  // ==========================================================================
  // 🎨 تب‌ها
  // ==========================================================================
  const tabs = [
    { id: "personal", label: "اطلاعات شخصی", icon: <Icons.User /> },
    { id: "security", label: "امنیت", icon: <Icons.Lock /> },
    { id: "addresses", label: "آدرس‌ها", icon: <Icons.Location /> },
  ];

  // ==========================================================================
  // ⏳ Loading State
  // ==========================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1929] flex items-center justify-center" dir="rtl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#00eaff]/30 border-t-[#00eaff] rounded-full"
        />
      </div>
    );
  }

  // ==========================================================================
  // 🎨 RENDER
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#0a1929] py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* ==================== هدر ==================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            پروفایل کاربری
          </h1>
          <p className="text-gray-400">
            مدیریت اطلاعات شخصی و تنظیمات حساب
          </p>
        </motion.div>

        {/* ==================== پیام ==================== */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl text-center font-medium ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== تب‌ها ==================== */}
        <div className="flex gap-2 mb-8 bg-[#102030] p-2 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#00eaff] to-[#00ff88] text-[#0a1929]"
                  : "text-gray-400 hover:text-white hover:bg-[#1a3a52]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ==================== محتوای تب‌ها ==================== */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#102030] border border-[#1a3a52] rounded-2xl p-6"
        >

          {/* ========== تب اطلاعات شخصی ========== */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Icons.User />
                اطلاعات شخصی
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* نام */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>

                {/* ایمیل */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-[#0a1929]/50 border border-[#1a3a52] rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ایمیل قابل تغییر نیست
                  </p>
                </div>

                {/* شماره تلفن */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    شماره موبایل
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                    placeholder="09123456789"
                    dir="ltr"
                  />
                </div>

                {/* کد ملی */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    کد ملی
                  </label>
                  <input
                    type="text"
                    value={profile.nationalId}
                    onChange={(e) => setProfile({ ...profile, nationalId: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                    placeholder="کد ملی ۱۰ رقمی"
                    maxLength={10}
                    dir="ltr"
                  />
                </div>

                {/* تاریخ تولد */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    تاریخ تولد
                  </label>
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                  />
                </div>

                {/* جنسیت */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    جنسیت
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                  </select>
                </div>
              </div>

              {/* دکمه ذخیره */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#00eaff] to-[#00ff88] text-[#0a1929] font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-[#00eaff]/30 transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-[#0a1929]/30 border-t-[#0a1929] rounded-full"
                    />
                  ) : (
                    <Icons.Check />
                  )}
                  <span>{saving ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========== تب امنیت ========== */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Icons.Lock />
                تغییر رمز عبور
              </h2>

              <div className="max-w-md space-y-4">
                {/* رمز فعلی */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    رمز عبور فعلی
                  </label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {/* رمز جدید */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                    placeholder="حداقل ۶ کاراکتر"
                  />
                </div>

                {/* تکرار رمز جدید */}
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">
                    تکرار رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full bg-[#0a1929] border border-[#1a3a52] rounded-xl px-4 py-3 text-white focus:border-[#00eaff] focus:outline-none transition-colors"
                    placeholder="تکرار رمز عبور جدید"
                  />
                </div>

                {/* دکمه تغییر رمز */}
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !passwords.currentPassword || !passwords.newPassword}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff6b6b] to-[#ffa500] text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <Icons.Lock />
                  )}
                  <span>{saving ? "در حال تغییر..." : "تغییر رمز عبور"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========== تب آدرس‌ها ========== */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Icons.Location />
                  آدرس‌های من
                </h2>
                <button
                  onClick={() => openAddressModal()}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#00eaff] to-[#00ff88] text-[#0a1929] font-bold py-2 px-4 rounded-xl hover:shadow-lg hover:shadow-[#00eaff]/30 transition-all duration-300"
                >
                  <Icons.Plus />
                  افزودن آدرس
                </button>
              </div>

              {/* ===== لیست آدرس‌ها ===== */}
              {addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Icons.Location />
                  <p className="mt-4">هنوز آدرسی ثبت نشده است</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {addresses.map((addr) => (
                    <motion.div
                      key={addr._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${
                        addr.isDefault
                          ? "border-[#00eaff] bg-[#0a1929]"
                          : "border-[#1a3a52] bg-[#0a1929]/60"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-bold">
                          {addr.title}
                          {addr.isDefault && (
                            <span className="ml-2 text-xs text-[#00eaff]">
                              (پیش‌فرض)
                            </span>
                          )}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openAddressModal(addr)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm leading-6">
                        {addr.fullAddress}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {addr.province}، {addr.city} – کدپستی:{" "}
                        {addr.postalCode}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        گیرنده: {addr.receiverName} | {addr.receiverPhone}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ==================== مودال آدرس ==================== */}
        <AnimatePresence>
          {showAddressModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#102030] w-full max-w-lg rounded-2xl p-6 border border-[#1a3a52]"
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  {editingAddress ? "ویرایش آدرس" : "افزودن آدرس جدید"}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <input
                    placeholder="عنوان آدرس (خانه، محل کار...)"
                    value={newAddress.title}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, title: e.target.value })
                    }
                    className="input"
                  />
                  <textarea
                    placeholder="آدرس کامل"
                    rows={3}
                    value={newAddress.fullAddress}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        fullAddress: e.target.value,
                      })
                    }
                    className="input"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="استان"
                      value={newAddress.province}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          province: e.target.value,
                        })
                      }
                      className="input"
                    />
                    <input
                      placeholder="شهر"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          city: e.target.value,
                        })
                      }
                      className="input"
                    />
                  </div>
                  <input
                    placeholder="کد پستی"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        postalCode: e.target.value,
                      })
                    }
                    className="input"
                  />
                  <input
                    placeholder="نام گیرنده"
                    value={newAddress.receiverName}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        receiverName: e.target.value,
                      })
                    }
                    className="input"
                  />
                  <input
                    placeholder="شماره تماس گیرنده"
                    value={newAddress.receiverPhone}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        receiverPhone: e.target.value,
                      })
                    }
                    className="input"
                    dir="ltr"
                  />

                  <label className="flex items-center gap-2 text-gray-300 text-sm">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          isDefault: e.target.checked,
                        })
                      }
                    />
                    به‌عنوان آدرس پیش‌فرض
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeAddressModal}
                    className="px-4 py-2 rounded-xl bg-gray-600 text-white"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00eaff] to-[#00ff88] text-[#0a1929] font-bold"
                  >
                    ذخیره
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
