# AssetFlow — Authentication Module (Login & Signup)

Enterprise-grade, bilingual (Arabic & English) authentication experience featuring dynamic hardware-accelerated canvas backgrounds, 3D perspective card physics, and robust client-side validation.

---

## 🌟 Key Architecture & Features

### 1. Dual Authentication Flows
- **`LoginPage`**: Corporate sign-in with email & password, interactive Single Sign-On (SSO) modal (Google Workspace, Microsoft Azure AD, Okta), and self-service Password Reset modal with real-time feedback.
- **`SignupPage`**: Multi-field onboarding registration (First/Last name, mobile number, company name, technician tier selector, business email, password) with G2 Fall 2026 awards badging and value propositions.

### 2. Interactive 3D & Canvas Animations
- **5 Synchronized Dynamic Canvas Backgrounds**: Polygonal crystals, undulating light ribbons, diagonal technical stripes, dotted wave mesh, and angular energy beams automatically cycling every 6 seconds with synchronized copy.
- **Zero-Latency Cursor Spotlight**: A fixed-layer, hardware-synced mouse sheen tracking cursor coordinates with 0ms displacement.
- **3D Card Perspective Tilt**: Smooth Cartesian tilt (`rotateX`, `rotateY`) reacting to mouse position with internal specular light sheen.

### 3. Internationalization & Accessibility
- **Bilingual First-Class Support**: Native Arabic (RTL) and English (LTR) with dynamic document direction switching (`dir="rtl"` / `dir="ltr"`).
- **Academic Form Validation**: Mandatory field enforcement with haptic shake animations, clear contextual alerts, and no redundant indicator markers.
- **Micro-interactions & Toasts**: Floating notification system with automatic decay and status icons.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** or **yarn**

### Installation & Launch

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser
http://localhost:5173/
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
assetflow-auth-pages/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── LoginPage.tsx              # Sign-In view with SSO & Forgot Password triggers
│   │   ├── SignupPage.tsx             # Full onboarding registration view
│   │   ├── InteractiveBackground.tsx  # Dynamic 5-mode canvas background & cursor light
│   │   ├── AssetFlowLogo.tsx          # Scalable vector logo component
│   │   ├── SSOModal.tsx               # Enterprise SSO identity provider selector
│   │   ├── ForgotPasswordModal.tsx    # Password reset modal with 3D reflection
│   │   └── ToastContainer.tsx         # Notification toast dispatcher
│   ├── context/
│   │   └── AppContext.tsx             # Global state (auth, language, active slide, toasts)
│   ├── data/
│   │   └── backgroundSlides.ts        # The 5 synced background themes and copy
│   ├── locales/
│   │   └── translations.ts            # Arabic (RTL) and English (LTR) language dictionaries
│   └── types/
│       └── index.ts                   # TypeScript definitions
```

---

## 🛡️ License & Rights
© 2026 AssetFlow Technologies, Inc. All rights reserved.
