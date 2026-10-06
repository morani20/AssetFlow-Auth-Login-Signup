export type UserRole = 'admin' | 'technician' | 'reporter';
export type AccountStatus = 'active' | 'inactive';
export type Language = 'ar' | 'en';
export type Page = 'landing' | 'login' | 'signup' | 'dashboard';

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  organizationName: string;
  avatarUrl?: string;
  token?: string;
}

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  status: AccountStatus;
  roleTitleAr: string;
  roleTitleEn: string;
  name: string;
  organization: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  badgeText?: string;
  actionText?: string;
  onAction?: () => void;
  meta?: {
    email?: string;
    company?: string;
    name?: string;
  };
}

export interface CountryCode {
  code: string;
  dial_code: string;
  name_en: string;
  name_ar: string;
  flag: string;
}
