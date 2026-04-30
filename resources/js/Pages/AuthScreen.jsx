import React, { useState } from 'react';
import MobileLayout from '../Layouts/MobileLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const BaliPramanaLogo = ({ className = "w-16 h-16" }) => (
  <img src="/images/balipramana_logo.png" className={className} alt="Bali Pramana Logo" />
);

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    isContributor: false,
  });

  const submit = (e) => {
    e.preventDefault();
    if (isLogin) {
      post('/login', {
        onFinish: () => reset('password'),
      });
    } else {
      post('/register', {
        onFinish: () => reset('password', 'password_confirmation'),
      });
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pramana-primary focus:ring-2 focus:ring-pramana-primary/20 transition-all bg-white placeholder-gray-400";
  const labelClass = "block text-xs font-semibold text-pramana-dark mb-1.5 uppercase tracking-wide";

  return (
    <MobileLayout hideNav={true}>
      <Head title={isLogin ? 'Login - Bali Pramana' : 'Register - Bali Pramana'} />

      <div className="min-h-screen flex flex-col md:flex-row md:items-center md:justify-center bg-pramana-bg md:bg-gray-50 md:py-12">
        {/* Header Banner (Mobile Only or Left Side on Desktop) */}
        <div className="relative bg-pramana-primary px-8 pt-12 pb-16 md:pb-12 flex flex-col items-center md:rounded-t-3xl md:hidden">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-3">Welcome to</p>
          <BaliPramanaLogo className="h-24 w-auto object-contain mb-2" />
          <p className="text-white/60 text-xs mt-1">Discover Hidden Gems of Bali</p>
        </div>

        {/* Curved Card (Centered on Desktop) */}
        <div className="relative -mt-6 md:mt-0 flex-1 md:flex-none w-full md:max-w-md bg-pramana-bg md:bg-white rounded-t-3xl md:rounded-3xl md:shadow-2xl overflow-hidden">
          {/* Desktop Logo Header (Hidden on Mobile) */}
          <div className="hidden md:flex flex-col items-center bg-pramana-primary p-8">
            <BaliPramanaLogo className="h-24 w-auto object-contain" />
          </div>
          {/* Tab Toggle */}
          <div className="flex mx-6 mt-6 bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isLogin ? 'bg-white text-pramana-primary shadow-md' : 'text-gray-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                !isLogin ? 'bg-white text-pramana-primary shadow-md' : 'text-gray-400'
              }`}
            >
              Register
            </button>
          </div>

          <form className="px-6 space-y-4 pb-10" onSubmit={submit}>

            {/* Profile Photo (Register only) */}
            {!isLogin && (
              <div className="flex flex-col items-center mb-2">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative">
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-pramana-primary rounded-full flex items-center justify-center border-2 border-white"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button type="button" className="text-pramana-primary text-xs font-semibold underline">
                  Change Photo
                </button>
              </div>
            )}

            {/* Email (Register only) */}
            {!isLogin && (
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="nama@email.com"
                  className={inputClass}
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
            )}

            {/* Name / Email field */}
            <div>
              <label className={labelClass}>{isLogin ? 'Email' : 'Nama/Username'}</label>
              <input
                type={isLogin ? 'email' : 'text'}
                value={isLogin ? data.email : data.name}
                onChange={(e) => isLogin ? setData('email', e.target.value) : setData('name', e.target.value)}
                placeholder={isLogin ? 'Masukkan email' : 'Pilih nama unik Anda'}
                className={inputClass}
              />
              {!isLogin && errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              {isLogin && errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Ulangi password Anda"
                  className={inputClass}
                />
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right -mt-2">
                <a href="#" className="text-xs text-pramana-primary font-semibold hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Contributor Checkbox (Register only) */}
            {!isLogin && (
              <div className="bg-pramana-primary/5 rounded-xl p-3 border border-pramana-primary/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.isContributor}
                    onChange={(e) => setData('isContributor', e.target.checked)}
                    className="w-4 h-4 accent-pramana-primary mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs text-pramana-dark font-semibold">I Have a Business and Want to be a Contributor</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">Daftarkan UMKM atau tempat wisata Anda</p>
                  </div>
                </label>
              </div>
            )}

            {/* Terms (Register only) */}
            {!isLogin && (
              <p className="text-center text-xs text-gray-400">
                Dengan mendaftar, Anda menyetujui{' '}
                <a href="#" className="text-pramana-primary font-semibold hover:underline">Terms and Conditions</a>{' '}
                kami
              </p>
            )}

            {/* Submit Button */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={processing}
                className={`w-full bg-pramana-primary text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${processing ? 'opacity-50' : ''}`}
              >
                {isLogin ? '🚀 Login' : '✨ Create Account'}
              </button>

              <p className="text-center text-xs text-gray-400">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-pramana-primary font-bold hover:underline"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AuthScreen;