import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  KeyRound,
  Mail,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

type RecoveryMethod = 'email' | 'google' | 'microsoft' | 'okta';
type Step = 'select_method' | 'enter_code' | 'new_password' | 'success';

export const ForgotPasswordModal: React.FC = () => {
  const { language, isForgotPasswordModalOpen, setIsForgotPasswordModalOpen, addToast } = useApp();

  const [step, setStep] = useState<Step>('select_method');
  const [method, setMethod] = useState<RecoveryMethod>('email');
  const [email, setEmail] = useState('');
  const [ssoIdentifier, setSsoIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // 3D Card Interactive Tilt & Dynamic Light
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [mousePos, setMousePos] = useState({ x: 240, y: 200 });

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
    setMousePos({ x, y });
  };

  const handleCardMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resending code
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'enter_code' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isForgotPasswordModalOpen) return null;

  const handleClose = () => {
    setIsForgotPasswordModalOpen(false);
    // Reset state after transition
    setTimeout(() => {
      setStep('select_method');
      setErrorMsg(null);
      setInputError(null);
      setOtp(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    }, 250);
  };

  // Step 1: Send Code
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInputError(null);

    const targetAddress = method === 'email' ? email : ssoIdentifier;
    if (!targetAddress.trim()) {
      const msg = language === 'ar'
        ? 'هذا الحقل مطلوب (يرجى إدخال عنوان البريد الإلكتروني أو معرّف الهوية)'
        : 'This field is required (Please enter your email or identity ID)';
      setInputError(msg);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('enter_code');
      setCountdown(45);
      addToast({
        type: 'info',
        title: language === 'ar' ? 'تم إرسال رمز الأمان' : 'Verification Code Sent',
        description: language === 'ar' ? `رمز التحقق التجريبي هو: 123456` : `Demo verification code is: 123456`,
      });
    }, 700);
  };

  // OTP box input handling
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handle
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify Code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال الرمز المكون من 6 أرقام' : 'Please enter the complete 6-digit code');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Valid code
      setStep('new_password');
      addToast({
        type: 'success',
        title: language === 'ar' ? 'تم التحقق من الرمز بنجاح' : 'Code Verified Successfully',
      });
    }, 600);
  };

  // Step 3: Set New Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg(language === 'ar' ? 'كلمة المرور يجب أن لا تقل عن 8 أحرف' : 'Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      addToast({
        type: 'success',
        title: language === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password Updated Successfully!',
        description: language === 'ar' ? 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.' : 'You can now sign in with your new password.',
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030914]/75 backdrop-blur-md animate-fade-in">
      <div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          transform: cardTransform,
          transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out',
        }}
        className={`relative w-full max-w-[480px] bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-gray-100 p-7 sm:p-9 text-start text-gray-900 overflow-hidden transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Dynamic 3D Light Spotlight Effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 opacity-60"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 102, 255, 0.08), transparent 70%)`,
          }}
        />
        
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-[#00A3FF] to-[#34D399]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 end-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: SELECT RECOVERY METHOD ================= */}
        {step === 'select_method' && (
          <div>
            {/* Header Icon & Title */}
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] flex-shrink-0 shadow-sm">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password'}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {language === 'ar' ? 'اختر طريقة استلام رمز الأمان' : 'Choose your verification method'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 my-4 leading-relaxed">
              {language === 'ar'
                ? 'حدد الطريقة المناسبة لمؤسستك لإرسال رمز التحقق السريع، عبر البريد أو موفري الهوية المعتمدة (SSO):'
                : 'Select how you want to receive your security code, via email or through your enterprise SSO provider:'}
            </p>

            {/* Methods Selection Grid */}
            <div className="space-y-2 mb-4">
              
              {/* Option 1: Work Email */}
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  method === 'email'
                    ? 'border-[#0066FF] bg-blue-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${method === 'email' ? 'bg-[#0066FF] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-start">
                    <span className="font-bold text-gray-900 block">
                      {language === 'ar' ? 'البريد الإلكتروني للعمل' : 'Corporate Work Email'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {language === 'ar' ? 'إرسال الرمز مباشرة لبريدك المسجل' : 'Send code directly to registered inbox'}
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'email' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'}`}>
                  {method === 'email' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Option 2: Google Workspace */}
              <button
                type="button"
                onClick={() => setMethod('google')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  method === 'google'
                    ? 'border-[#0066FF] bg-blue-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div className="text-start">
                    <span className="font-bold text-gray-900 block">
                      Google Workspace SSO
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {language === 'ar' ? 'رمز تحقق عبر حساب Google المؤسسي' : 'Security code via Google ID'}
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'google' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'}`}>
                  {method === 'google' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Option 3: Microsoft Azure AD */}
              <button
                type="button"
                onClick={() => setMethod('microsoft')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  method === 'microsoft'
                    ? 'border-[#0066FF] bg-blue-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z" />
                      <path fill="#00A4EF" d="M1 13h10v10H1z" />
                      <path fill="#7FBA00" d="M13 1h10v10H13z" />
                      <path fill="#FFB900" d="M13 13h10v10H13z" />
                    </svg>
                  </div>
                  <div className="text-start">
                    <span className="font-bold text-gray-900 block">
                      Microsoft Azure AD / Entra
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {language === 'ar' ? 'رمز تحقق عبر حساب Microsoft' : 'Security code via Microsoft ID'}
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'microsoft' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'}`}>
                  {method === 'microsoft' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Option 4: Okta */}
              <button
                type="button"
                onClick={() => setMethod('okta')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  method === 'okta'
                    ? 'border-[#0066FF] bg-blue-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-xs text-[#0066FF]">
                    O
                  </div>
                  <div className="text-start">
                    <span className="font-bold text-gray-900 block">
                      Okta Enterprise SSO
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {language === 'ar' ? 'رمز تحقق عبر بوابة Okta' : 'Security code via Okta ID'}
                    </span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'okta' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'}`}>
                  {method === 'okta' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendCode} noValidate className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {method === 'email'
                    ? (language === 'ar' ? 'البريد الإلكتروني للعمل *' : 'Work Email *')
                    : (language === 'ar' ? 'حساب أو نطاق الهوية المؤسسية *' : 'Enterprise Identity Account *')}
                </label>
                <input
                  type={method === 'email' ? 'email' : 'text'}
                  value={method === 'email' ? email : ssoIdentifier}
                  onChange={(e) => {
                    if (method === 'email') setEmail(e.target.value);
                    else setSsoIdentifier(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder={method === 'email' ? 'name@company.com' : 'user@domain.com'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                    inputError
                      ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-3 focus:ring-red-500/15'
                      : 'border-gray-300 focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15'
                  }`}
                  dir="ltr"
                />
                {inputError && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5 animate-fade-in text-start">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{inputError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#0066FF]/25 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'ar' ? 'إرسال رمز التحقق' : 'Send Verification Code'}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: ENTER OTP CODE ================= */}
        {step === 'enter_code' && (
          <div>
            <button
              onClick={() => setStep('select_method')}
              className="flex items-center gap-1 text-xs text-[#0066FF] font-semibold mb-3 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{language === 'ar' ? 'تغيير طريقة الإرسال' : 'Change method'}</span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#34D399] flex-shrink-0 shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {language === 'ar' ? 'أدخل رمز التحقق' : 'Enter Verification Code'}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {language === 'ar' ? 'رمز الأمان المؤلف من 6 أرقام' : '6-digit security code'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 my-4 leading-relaxed">
              {language === 'ar'
                ? `تم إرسال رمز الأمان إلى: `
                : `A security code has been sent to: `}
              <span className="font-bold text-gray-900 dir-ltr inline-block">
                {method === 'email' ? email : ssoIdentifier}
              </span>
            </p>

            {errorMsg && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* 6 OTP Inputs */}
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex items-center justify-between gap-2 dir-ltr" dir="ltr">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-13 text-center text-xl font-black text-gray-900 border-2 rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15 transition-all shadow-2xs"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>{language === 'ar' ? 'لم يصلك الرمز؟' : "Didn't receive code?"}</span>
                {countdown > 0 ? (
                  <span className="font-mono text-gray-400">
                    {language === 'ar' ? `إعادة الإرسال خلال (${countdown} ث)` : `Resend in (${countdown}s)`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCountdown(45);
                      addToast({
                        type: 'info',
                        title: language === 'ar' ? 'تمت إعادة الإرسال' : 'Code Resent',
                        description: language === 'ar' ? 'كود الاختبار: 123456' : 'Demo code: 123456',
                      });
                    }}
                    className="font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إعادة الإرسال الآن' : 'Resend now'}</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#0066FF]/25 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{language === 'ar' ? 'التحقق من الرمز والمتابعة' : 'Verify & Continue'}</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 3: SET NEW PASSWORD ================= */}
        {step === 'new_password' && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {language === 'ar' ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {language === 'ar' ? 'أنشئ كلمة مرور قوية لحماية حسابك' : 'Create a strong new password'}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 my-4 leading-relaxed">
              {language === 'ar'
                ? 'تم تأكيد هويتك بنجاح! يرجى إدخال كلمة المرور الجديدة وتأكيدها أدناه:'
                : 'Your identity has been verified! Please set your new password below:'}
            </p>

            {errorMsg && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'ar' ? 'كلمة المرور الجديدة *' : 'New Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15 pe-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'ar' ? 'تأكيد كلمة المرور الجديدة *' : 'Confirm New Password *'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0066FF] focus:ring-3 focus:ring-[#0066FF]/15"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#0066FF]/25 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS STATE ================= */}
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {language === 'ar' ? 'تم تحديث كلمة المرور!' : 'Password Updated!'}
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs mx-auto mb-6">
              {language === 'ar'
                ? 'تم تغيير كلمة المرور بنجاح. يمكنك الآن استخدام بيانات الدخول الجديدة لمواصلة عملك.'
                : 'Your password has been successfully reset. You can now log in with your updated credentials.'}
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {language === 'ar' ? 'العودة لتسجيل الدخول الآن' : 'Back to Sign In'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
