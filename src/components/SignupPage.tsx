import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { CountryCode } from '../types';
import { InteractiveBackground } from './InteractiveBackground';
import { AssetFlowLogo } from './AssetFlowLogo';
import { COUNTRY_CODES } from '../data/mockData';
import { BACKGROUND_SLIDES } from '../data/backgroundSlides';
import {
  CreditCard,
  Users,
  Shield,
  Star,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  AlertCircle,
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { language, toggleLanguage, t, setCurrentPage, addToast, activeSlide, setActiveSlide } = useApp();

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [numTechnicians, setNumTechnicians] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);

  // 3D Card Interactive Tilt & Light Reflection
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [cardMousePos, setCardMousePos] = useState({ x: 240, y: 250 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;

    setCardTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
    setCardMousePos({ x, y });
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    setIsCardHovered(false);
  };

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const pwdScore = getPasswordStrength(password);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = language === 'ar' ? 'الاسم الأول مطلوب' : 'First name is required';
    if (!lastName.trim()) newErrors.lastName = language === 'ar' ? 'اسم العائلة مطلوب' : 'Last name is required';
    if (!companyName.trim()) newErrors.companyName = language === 'ar' ? 'اسم المنشأة مطلوب' : 'Company name is required';
    if (!numTechnicians.trim()) newErrors.numTechnicians = language === 'ar' ? 'يرجى تحديد عدد الفنيين' : 'Please select technicians';
    if (!mobileNumber.trim()) newErrors.mobileNumber = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    
    if (!email.trim()) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني للعمل مطلوب' : 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = language === 'ar' ? 'كلمة المرور يجب أن لا تقل عن 8 خانات' : 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully',
        description: language === 'ar'
          ? `مرحباً بك في AssetFlow. تم تهيئة حسابك بنجاح.`
          : `Welcome to AssetFlow. Your account has been initialized.`,
      });
      setCurrentPage('login');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#061224] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#0066FF] selection:text-white">
      
      {/* Dynamic Animated & Interactive Canvas Background */}
      <InteractiveBackground />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => setCurrentPage('login')}
          className="focus:outline-none transition-transform hover:scale-105 cursor-pointer"
          title="AssetFlow"
        >
          <AssetFlowLogo size="sm" />
        </button>

        {/* Right Corner: Navigation link & Language Switcher */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentPage('login')}
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {t.signIn}
          </button>
          
          <button
            onClick={toggleLanguage}
            type="button"
            title="Switch Language / تبديل اللغة"
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/90 hover:border-slate-500 text-slate-300 hover:text-white transition-all duration-300 text-xs font-medium cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,102,255,0.25)]"
          >
            <Globe className="w-4 h-4 text-[#0066FF] group-hover:rotate-180 transition-transform duration-500 ease-out" />
            <span className="font-semibold">{t.switchLanguage}</span>
          </button>
        </div>
      </header>

      {/* Main Signup Form Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 sm:py-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start w-full">
          
          {/* Left Column: Value Proposition & Trust Badges */}
          <div className="lg:col-span-6 flex flex-col justify-start text-start pt-2">
            
            {/* Logo on Left */}
            <div className="hidden lg:block mb-6">
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="focus:outline-none transition-transform hover:scale-105 cursor-pointer"
                title="AssetFlow"
              >
                <AssetFlowLogo size="lg" />
              </button>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-[1.2] tracking-tight mb-4">
              {t.signup.heroTitle}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-lg">
              {t.signup.heroSubtitle}
            </p>

            {/* 3 Bullet Points with glowing modern icons */}
            <div className="space-y-4 mb-8">
              
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-[#38BDF8] flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-500/25 transition-all duration-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-slate-200">
                  {t.signup.feature1}
                </span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-400/25 flex items-center justify-center text-[#34D399] flex-shrink-0 group-hover:scale-110 group-hover:bg-teal-500/25 transition-all duration-300">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-slate-200">
                  {t.signup.feature2}
                </span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/25 flex items-center justify-center text-[#818CF8] flex-shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/25 transition-all duration-300">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-slate-200">
                  {t.signup.feature3}
                </span>
              </div>

            </div>

            {/* G2 Awards Badges (Fall 2026) */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap my-3">
                
                {/* Leader */}
                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-center shadow-lg w-28 sm:w-32 backdrop-blur-sm hover:border-slate-500 transition-colors">
                  <div className="bg-[#FF3C4D] text-white text-[9px] font-bold py-0.5 rounded uppercase tracking-wider mb-1.5">
                    {t.signup.fall2026}
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-white block">
                    {t.signup.g2Leader}
                  </span>
                  <div className="w-4 h-0.5 bg-[#FF3C4D] mx-auto mt-1" />
                </div>

                {/* Easiest Setup */}
                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-center shadow-lg w-32 sm:w-36 backdrop-blur-sm hover:border-slate-500 transition-colors">
                  <div className="bg-[#FF3C4D] text-white text-[9px] font-bold py-0.5 rounded uppercase tracking-wider mb-1.5">
                    {t.signup.fall2026}
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-white block leading-tight">
                    {t.signup.g2Easiest}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {t.signup.g2Enterprise}
                  </span>
                </div>

                {/* Momentum Leader */}
                <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-center shadow-lg w-28 sm:w-32 backdrop-blur-sm hover:border-slate-500 transition-colors">
                  <div className="bg-[#FF3C4D] text-white text-[9px] font-bold py-0.5 rounded uppercase tracking-wider mb-1.5">
                    {t.signup.fall2026}
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-white block leading-tight">
                    {t.signup.g2Momentum}
                  </span>
                  <div className="w-4 h-0.5 bg-[#FF3C4D] mx-auto mt-1" />
                </div>

              </div>

              {/* 5-Star Reviews Proof */}
              <div className="flex items-center gap-2 pt-2 text-start">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                  {t.signup.reviewsCount}
                </span>
              </div>

              {/* Interactive Theme Indicators */}
              <div className="flex items-center gap-2 pt-6">
                {BACKGROUND_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    title={`Background ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      activeSlide === idx
                        ? 'w-8 bg-gradient-to-r from-[#0066FF] to-[#00D2FF]'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive White Registration Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: cardTransform,
                transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out',
              }}
              className={`w-full max-w-[480px] bg-white rounded-2xl p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(0,102,255,0.18)] text-gray-900 border border-gray-100/90 relative z-10 transition-transform overflow-hidden ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              {/* Dynamic 3D Cursor Light Sheen on Card */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                  isCardHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `radial-gradient(350px circle at ${cardMousePos.x}px ${cardMousePos.y}px, rgba(0, 102, 255, 0.08), transparent 70%)`,
                }}
              />
              
              {/* Header inside card */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {t.signup.cardTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {language === 'ar' ? 'ابدأ تجربتك المجانية خلال دقيقة واحدة' : 'Get started with your 7-day free trial'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignupSubmit} noValidate className="space-y-3.5">
                
                {/* First Name & Last Name (2 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 text-start">
                      {t.signup.firstName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                      }}
                      placeholder={t.signup.firstNamePlaceholder}
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                        errors.firstName
                          ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                          : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 text-start animate-fade-in">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.firstName}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 text-start">
                      {t.signup.lastName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                      }}
                      placeholder={t.signup.lastNamePlaceholder}
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                        errors.lastName
                          ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                          : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 text-start animate-fade-in">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.lastName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Mobile Number with Country Code Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 text-start">
                    {t.signup.phone} <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex rounded-lg border relative transition-all ${
                    errors.mobileNumber ? 'border-red-500 bg-red-50/20' : 'border-gray-300 focus-within:border-[#0066FF] focus-within:ring-3 focus-within:ring-[#0066FF]/15'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-e border-gray-300 rounded-s-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <span>{selectedCountry.flag}</span>
                      <span className="font-mono">{selectedCountry.dial_code}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: '' }));
                      }}
                      placeholder={t.signup.phonePlaceholder}
                      className="flex-1 px-3 py-2 text-sm text-gray-900 rounded-e-lg focus:outline-none bg-transparent"
                      dir="ltr"
                    />

                    {countryDropdownOpen && (
                      <div className="absolute top-full start-0 mt-1 w-64 max-h-48 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-1 text-start">
                        {COUNTRY_CODES.map((country: CountryCode) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setCountryDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 text-gray-900 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{language === 'ar' ? country.name_ar : country.name_en}</span>
                            </div>
                            <span className="font-mono text-gray-500">{country.dial_code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 text-start animate-fade-in">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.mobileNumber}</span>
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 text-start">
                    {t.signup.company} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: '' }));
                    }}
                    placeholder={t.signup.companyPlaceholder}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                      errors.companyName
                        ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                        : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                    }`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 text-start animate-fade-in">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.companyName}</span>
                    </p>
                  )}
                </div>

                {/* Number of Technicians Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 text-start">
                    {t.signup.technicians} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={numTechnicians}
                      onChange={(e) => {
                        setNumTechnicians(e.target.value);
                        if (errors.numTechnicians) setErrors((prev) => ({ ...prev, numTechnicians: '' }));
                      }}
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-white appearance-none cursor-pointer ${
                        errors.numTechnicians
                          ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                          : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                      }`}
                    >
                      <option value="">{t.signup.selectTechnicians}</option>
                      <option value="1-5">{t.signup.tech1}</option>
                      <option value="6-15">{t.signup.tech2}</option>
                      <option value="16-50">{t.signup.tech3}</option>
                      <option value="50+">{t.signup.tech4}</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute inset-y-0 end-0 my-auto me-3 pointer-events-none" />
                  </div>
                  {errors.numTechnicians && (
                    <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 text-start animate-fade-in">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.numTechnicians}</span>
                    </p>
                  )}
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 text-start">
                    {t.signup.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder={t.signup.emailPlaceholder}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all ${
                      errors.email
                        ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                        : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                    }`}
                    dir="ltr"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 text-start animate-fade-in">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password with Strength bar */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 text-start">
                    {t.signup.password} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      placeholder={t.signup.passwordPlaceholder}
                      className={`w-full px-3 py-2 rounded-lg border text-sm pe-10 transition-all ${
                        errors.password
                          ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                          : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 text-start animate-fade-in">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}

                  {/* Password strength progress bar */}
                  {password.length > 0 && (
                    <div className="mt-1.5">
                      <div className="grid grid-cols-4 gap-1 h-1 rounded-full overflow-hidden bg-gray-200">
                        <div className={`h-full ${pwdScore >= 1 ? 'bg-rose-500' : 'bg-transparent'}`} />
                        <div className={`h-full ${pwdScore >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                        <div className={`h-full ${pwdScore >= 3 ? 'bg-blue-500' : 'bg-transparent'}`} />
                        <div className={`h-full ${pwdScore >= 4 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Submit CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-[#0066FF]/25 hover:shadow-lg hover:shadow-[#0066FF]/40 hover:scale-[1.015] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{t.signup.submitBtn}</span>
                    )}
                  </button>
                </div>

                {/* Terms notice */}
                <div className="text-center pt-1">
                  <p className="text-[11px] text-gray-400 leading-normal">
                    {t.signup.termsNotice}
                  </p>
                </div>

                {/* Return to Sign in link */}
                <div className="text-center pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">
                    {t.signup.alreadyHaveAccount}{' '}
                    <button
                      type="button"
                      onClick={() => setCurrentPage('login')}
                      className="font-semibold text-[#0066FF] hover:text-[#0052CC] hover:underline transition-colors cursor-pointer"
                    >
                      {t.signup.signInLink}
                    </button>
                  </p>
                </div>

              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer: Partner Logos */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-[#050D1A]/85 backdrop-blur-md py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3 text-center">
            {t.login.trustedCompanies}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-14 opacity-75">
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-serif font-black tracking-widest text-base sm:text-lg">
              Marriott
            </span>
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-black tracking-widest text-sm sm:text-base flex items-center gap-1">
              <span className="text-yellow-500">▲</span> CATERPILLAR
            </span>
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-extrabold tracking-widest text-xs sm:text-sm">
              YAMAHA
            </span>
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-bold tracking-tight text-sm sm:text-base">
              Unilever
            </span>
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-bold tracking-wider text-sm sm:text-base lowercase italic">
              pepsi
            </span>
            <span className="text-slate-400 hover:text-yellow-400 hover:scale-105 transition-all duration-300 cursor-default font-sans font-black text-xl tracking-tighter font-serif">
              M
            </span>
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-bold tracking-wider text-xs sm:text-sm flex items-center gap-1">
              aramark <span className="text-red-500">★</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
