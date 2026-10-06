import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield } from 'lucide-react';

export const SSOModal: React.FC = () => {
  const { language, t, isSSOModalOpen, setIsSSOModalOpen, addToast } = useApp();
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3D Card Interactive Tilt & Dynamic Light
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [mousePos, setMousePos] = useState({ x: 200, y: 180 });

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

  if (!isSSOModalOpen) return null;

  const handleProviderLogin = (provider: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSSOModalOpen(false);

      addToast({
        type: 'success',
        title: language === 'ar' ? `تم تسجيل الدخول عبر ${provider}` : `Signed in via ${provider}`,
        description: domain || 'Enterprise Workspace',
      });
    }, 600);
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
        className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-gray-100 p-6 sm:p-8 text-start text-gray-900 overflow-hidden"
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
          onClick={() => setIsSSOModalOpen(false)}
          className="absolute top-4 end-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {t.sso.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-5 leading-relaxed">
          {t.sso.subtitle}
        </p>

        {/* Domain Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProviderLogin('Corporate SSO');
          }}
          className="space-y-3 mb-5"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t.sso.inputLabel}
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={t.sso.inputPlaceholder}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t.sso.submitBtn}</span>
          </button>
        </form>

        {/* Providers List */}
        <div className="space-y-2 pt-3 border-t border-gray-100">
          <span className="text-[11px] font-semibold text-gray-500 block mb-2">
            {t.sso.orProvider}
          </span>
          
          <button
            type="button"
            onClick={() => handleProviderLogin('Google Workspace')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-start"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{t.sso.google}</span>
          </button>

          <button
            type="button"
            onClick={() => handleProviderLogin('Microsoft Azure AD')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-start"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#00A4EF" d="M1 13h10v10H1z" />
              <path fill="#7FBA00" d="M13 1h10v10H13z" />
              <path fill="#FFB900" d="M13 13h10v10H13z" />
            </svg>
            <span>{t.sso.microsoft}</span>
          </button>

          <button
            type="button"
            onClick={() => handleProviderLogin('Okta')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-start"
          >
            <div className="w-4 h-4 rounded-full border-2 border-[#0066FF] flex items-center justify-center font-bold text-[8px] text-[#0066FF]">
              O
            </div>
            <span>{t.sso.okta}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
