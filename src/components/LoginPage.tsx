import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveBackground } from './InteractiveBackground';
import { Eye, EyeOff, Info, Globe, AlertCircle } from 'lucide-react';

import { AssetFlowLogo } from './AssetFlowLogo';
import { BACKGROUND_SLIDES } from '../data/backgroundSlides';

export const LoginPage: React.FC = () => {
  const {
    language,
    toggleLanguage,
    t,
    setCurrentPage,
    addToast,
    setIsSSOModalOpen,
    setIsForgotPasswordModalOpen,
    activeSlide,
    setActiveSlide,
  } = useApp();

  const currentSlide = BACKGROUND_SLIDES[activeSlide] || BACKGROUND_SLIDES[0];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isShaking, setIsShaking] = useState(false);

  // 3D Card Interactive Tilt & Light Reflection
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [cardMousePos, setCardMousePos] = useState({ x: 215, y: 250 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    setCardTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
    setCardMousePos({ x, y });
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    setIsCardHovered(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = language === 'ar' ? 'هذا الحقل مطلوب (يرجى إدخال البريد الإلكتروني)' : 'This field is required (Please enter your email)';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = language === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صحيح' : 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = language === 'ar' ? 'هذا الحقل مطلوب (يرجى إدخال كلمة المرور)' : 'This field is required (Please enter your password)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Realistic API network simulation
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully',
        description: language === 'ar'
          ? 'مرحباً بك مجدداً في AssetFlow. جاري نقلك إلى مساحة العمل.'
          : 'Welcome back to AssetFlow. Redirecting to your workspace.',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#061224] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#0066FF] selection:text-white">
      
      {/* Dynamic Animated & Interactive Canvas Background */}
      <InteractiveBackground />

      {/* Top Header Bar: Clean & Minimal with Animated Language Switcher */}
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

        {/* Right Corner: Sleek Interactive Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          type="button"
          title="Switch Language / تبديل اللغة"
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/90 hover:border-slate-500 text-slate-300 hover:text-white transition-all duration-300 text-xs font-medium cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,102,255,0.25)]"
        >
          <Globe className="w-4 h-4 text-[#0066FF] group-hover:rotate-180 transition-transform duration-500 ease-out" />
          <span className="font-semibold">{t.switchLanguage}</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 sm:py-12 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Heading & Value Statement */}
          <div className="lg:col-span-6 flex flex-col justify-center text-start">
            
            {/* Logo Brand on Left */}
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

            {/* Synchronized Headline & Subtitle matching the 5 background designs */}
            <div key={activeSlide} className="transition-all duration-700 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-[1.2] tracking-tight mb-4 min-h-[100px] flex items-center">
                {language === 'ar' ? currentSlide.titleAr : currentSlide.titleEn}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-lg min-h-[56px]">
                {language === 'ar' ? currentSlide.subtitleAr : currentSlide.subtitleEn}
              </p>
            </div>

            {/* Interactive Theme Indicators */}
            <div className="flex items-center gap-2 mt-8">
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

          {/* Right Column: Crisp White Card with Subtle 3D Depth */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: cardTransform,
                transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out',
              }}
              className={`w-full max-w-[430px] bg-white rounded-2xl p-8 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(0,102,255,0.18)] text-gray-900 border border-gray-100/90 relative z-10 transition-transform overflow-hidden ${
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
              
              {/* Card Title & Subtitle */}
              <div className="text-center mb-7">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {t.login.cardTitle}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-normal">
                  {t.login.cardSubtitle}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Email Field with validation */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-start">
                    {t.login.emailLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder={t.login.emailPlaceholder}
                    autoComplete="email"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 ${
                      errors.email
                        ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                        : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                    }`}
                    dir="ltr"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5 text-start animate-fade-in">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field with validation */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 text-start">
                      {t.login.passwordLabel} <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordModalOpen(true)}
                      className="text-xs font-medium text-[#0066FF] hover:text-[#0052CC] hover:underline transition-colors"
                    >
                      {t.login.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder={t.login.passwordPlaceholder}
                      autoComplete="current-password"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 pe-10 ${
                        errors.password
                          ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                          : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors active:scale-90"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5 text-start animate-fade-in">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button (Always clickable to trigger validation) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md shadow-[#0066FF]/25 hover:shadow-lg hover:shadow-[#0066FF]/40 hover:scale-[1.015] active:scale-[0.985] cursor-pointer btn-shimmer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{t.login.submitBtn}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-600">
                  {t.login.newToBrand}{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentPage('signup')}
                    className="font-semibold text-[#0066FF] hover:text-[#0052CC] hover:underline transition-colors"
                  >
                    {t.login.signUpLink}
                  </button>
                </p>
              </div>

              {/* "Or" Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400 font-medium">
                    {t.login.dividerOr}
                  </span>
                </div>
              </div>

              {/* Interactive SSO Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsSSOModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50/80 hover:border-gray-400 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm font-medium text-gray-800 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.login.ssoBtn}</span>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>

              {/* Terms notice */}
              <div className="text-center mt-6">
                <p className="text-[11px] text-gray-400 leading-normal">
                  {t.login.termsNotice}
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer: JOIN 4,000+ COMPANIES with Interactive Hover Logos */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-[#050D1A]/85 backdrop-blur-md py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3 text-center">
            {t.login.trustedCompanies}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-14 opacity-75">
            {/* Marriott */}
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-serif font-black tracking-widest text-base sm:text-lg">
              Marriott
            </span>
            {/* CATERPILLAR */}
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-black tracking-widest text-sm sm:text-base flex items-center gap-1">
              <span className="text-yellow-500">▲</span> CATERPILLAR
            </span>
            {/* YAMAHA */}
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-extrabold tracking-widest text-xs sm:text-sm">
              YAMAHA
            </span>
            {/* Unilever */}
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-bold tracking-tight text-sm sm:text-base">
              Unilever
            </span>
            {/* Pepsi */}
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-bold tracking-wider text-sm sm:text-base lowercase italic">
              pepsi
            </span>
            {/* McDonald's */}
            <span className="text-slate-400 hover:text-yellow-400 hover:scale-105 transition-all duration-300 cursor-default font-sans font-black text-xl tracking-tighter font-serif">
              M
            </span>
            {/* Aramark */}
            <span className="text-slate-400 hover:text-white hover:scale-105 transition-all duration-300 cursor-default font-sans font-bold tracking-wider text-xs sm:text-sm flex items-center gap-1">
              aramark <span className="text-red-500">★</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
