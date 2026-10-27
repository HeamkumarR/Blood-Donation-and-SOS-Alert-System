import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BloodGroup, UserRole } from '../../types';
import {
  AlertOctagon,
  Shield,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  LogIn,
  KeyRound,
  Phone,
  Mail,
  MapPin,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { loginWithGoogle, loginWithEmail, registerWithVerification, showToast } = useApp();

  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'REGISTER'>('SIGN_IN');

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manual Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState<BloodGroup>('O+');
  const [regCity, setRegCity] = useState('Chennai');
  const [regRole, setRegRole] = useState<UserRole>('USER');
  const [regIsDonor, setRegIsDonor] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);

  // Google Account Flow State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleAccount, setGoogleAccount] = useState({
    name: 'Rhea Kumar',
    email: 'rheamkumaar@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });
  const [googlePhone, setGooglePhone] = useState('+91 98401 23456');
  const [googleBloodGroup, setGoogleBloodGroup] = useState<BloodGroup>('O+');
  const [googleCity, setGoogleCity] = useState('Chennai');
  const [googleRole, setGoogleRole] = useState<UserRole>('USER');
  const [googleIsDonor, setGoogleIsDonor] = useState(true);

  // OTP Verification Modal State
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationTarget, setVerificationTarget] = useState<'GOOGLE' | 'MANUAL'>('MANUAL');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [otpTimer, setOtpTimer] = useState(45);
  const [otpError, setOtpError] = useState<string | null>(null);

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const cities = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode'];

  // Timer countdown effect for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showVerificationModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showVerificationModal, otpTimer]);

  const generateNewOTP = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(code);
    setOtpTimer(45);
    setEnteredOTP('');
    setOtpError(null);
    return code;
  };

  // 1. Handle Manual Login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email or phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = loginWithEmail(loginIdentifier, loginPassword);
      setIsSubmitting(false);

      if (result.success) {
        onSuccess();
      } else {
        setLoginError(result.error || 'Failed to authenticate.');
      }
    }, 400);
  };

  // 2. Handle Starting Manual Registration
  const handleStartManualRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 8) {
      setRegError('Please enter a valid phone number for emergency contact.');
      return;
    }
    if (regPassword && regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    // Launch OTP verification step
    generateNewOTP();
    setVerificationTarget('MANUAL');
    setShowVerificationModal(true);
  };

  // 3. Handle Starting Google Sign-In
  const handleStartGoogleSignIn = () => {
    setShowGoogleModal(true);
  };

  // 4. Continue Google Account with Verification
  const handleProceedGoogleToVerify = () => {
    if (!googlePhone.trim()) {
      showToast('Please provide a phone number for emergency contact dispatch.', 'danger');
      return;
    }
    setShowGoogleModal(false);
    generateNewOTP();
    setVerificationTarget('GOOGLE');
    setShowVerificationModal(true);
  };

  // 5. Submit OTP Verification Code
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (enteredOTP.trim() !== generatedOTP.trim()) {
      setOtpError('Invalid verification code. Please check the code and try again.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowVerificationModal(false);

      if (verificationTarget === 'GOOGLE') {
        loginWithGoogle({
          name: googleAccount.name,
          email: googleAccount.email,
          avatar: googleAccount.avatar,
          phone: googlePhone,
          bloodGroup: googleBloodGroup,
          city: googleCity,
          role: googleRole,
          isDonor: googleIsDonor,
        });
      } else {
        registerWithVerification({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
          bloodGroup: regBloodGroup,
          city: regCity,
          role: regRole,
          isDonor: regIsDonor,
        });
      }

      onSuccess();
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-600/20">
          <AlertOctagon className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          PulsePoint Emergency
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Emergency Blood Donor & SOS Alert System · Chennai & Tamil Nadu
        </p>

        {/* Tab switch */}
        <div className="inline-flex items-center p-1 bg-slate-200/80 rounded-xl text-xs font-semibold mt-5 shadow-inner">
          <button
            onClick={() => {
              setAuthMode('SIGN_IN');
              setLoginError(null);
            }}
            className={`px-5 py-2 rounded-lg transition-all ${
              authMode === 'SIGN_IN'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('REGISTER');
              setRegError(null);
            }}
            className={`px-5 py-2 rounded-lg transition-all ${
              authMode === 'REGISTER'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Verified Account
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {/* Google Authentication Quick Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleStartGoogleSignIn}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-xs"
          >
            {/* Google SVG G icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Account</span>
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">
              or sign in with credentials
            </span>
          </div>
        </div>

        {authMode === 'SIGN_IN' ? (
          /* MANUAL SIGN IN FORM */
          <form onSubmit={handleManualLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="name@example.com or +91 98401 23456"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">
                  Default: any password
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs mt-5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Sign In to Dashboard</span>
            </button>

            {/* Quick Demo Credentials Banner */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Clinical Administrator Sign In:</span>
              </p>
              <div className="flex items-center justify-between font-mono text-[11px] bg-white p-2 rounded border border-slate-200/80">
                <span>admin@pulsepoint.org</span>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('admin@pulsepoint.org');
                    setLoginPassword('admin123');
                  }}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Auto-fill Admin
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* MANUAL REGISTER FORM */
          <form onSubmit={handleStartManualRegister} className="space-y-4">
            {regError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="e.g. Ananya Ramakrishnan"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone (SMS Alerts) *
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="+91 98401 23456"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group *
                </label>
                <select
                  value={regBloodGroup}
                  onChange={e => setRegBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-bold"
                >
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / District *
                </label>
                <select
                  value={regCity}
                  onChange={e => setRegCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('USER')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    regRole === 'USER'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-rose-600" />
                  <span>Citizen / Donor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('ADMIN')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    regRole === 'ADMIN'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Clinical Admin</span>
                </button>
              </div>
            </div>

            {regRole === 'USER' && (
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer pt-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={regIsDonor}
                  onChange={e => setRegIsDonor(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span>Register as an active voluntary donor on the Chennai & TN map</span>
              </label>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs mt-3"
            >
              <span>Continue to Phone / Email Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* ========================================================= */}
      {/* GOOGLE ACCOUNT SETUP MODAL                                */}
      {/* ========================================================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="text-sm font-bold text-slate-900">
                  Google Account Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Google Profile Card */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                <img
                  src={googleAccount.avatar}
                  alt={googleAccount.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {googleAccount.name}
                  </h4>
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono truncate">
                  {googleAccount.email}
                </p>
              </div>
            </div>

            {/* Profile setup fields required for medical dispatch */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={googleAccount.name}
                  onChange={e => setGoogleAccount(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={googlePhone}
                    onChange={e => setGooglePhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={googleBloodGroup}
                    onChange={e => setGoogleBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-bold"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Location
                </label>
                <select
                  value={googleCity}
                  onChange={e => setGoogleCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Workspace Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoogleRole('USER')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      googleRole === 'USER'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Donor / User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoogleRole('ADMIN')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      googleRole === 'ADMIN'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {googleRole === 'USER' && (
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={googleIsDonor}
                    onChange={e => setGoogleIsDonor(e.target.checked)}
                    className="w-3.5 h-3.5 text-rose-600 rounded"
                  />
                  <span>Active volunteer blood donor ready for emergencies</span>
                </label>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-1/3 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedGoogleToVerify}
                className="w-2/3 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Verify Emergency OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* OTP VERIFICATION MODAL                                    */}
      {/* ========================================================= */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Verify Your Account
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit security code sent to{' '}
                <span className="font-semibold text-slate-800 font-mono">
                  {verificationTarget === 'GOOGLE' ? googlePhone : regPhone}
                </span>
              </p>
            </div>

            {/* Instant Demo Helper Banner */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-4 text-xs text-emerald-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Your One-Time Code:
                </span>
                <button
                  type="button"
                  onClick={() => setEnteredOTP(generatedOTP)}
                  className="font-bold underline text-emerald-700 hover:text-emerald-900"
                >
                  Auto-fill Code
                </button>
              </div>
              <p className="font-mono text-base font-extrabold tracking-widest text-emerald-950 mt-1">
                {generatedOTP}
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {otpError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{otpError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={enteredOTP}
                  onChange={e => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full py-3 text-center text-xl font-mono font-extrabold tracking-widest rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Expires in: <strong>{otpTimer}s</strong>
                </span>
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={() => generateNewOTP()}
                  className="text-rose-600 font-semibold hover:underline disabled:text-slate-400 disabled:no-underline"
                >
                  Resend Code
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="w-1/3 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || enteredOTP.length < 6}
                  className="w-2/3 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Verify & Activate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
