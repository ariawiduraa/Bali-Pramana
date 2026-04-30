import React, { useState } from 'react';
import MobileLayout from '../Layouts/MobileLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('database/images/')) {
    return '/db-images/' + path.replace('database/images/', '');
  }
  return `/storage/${path}`;
};

const Profile = ({ userReviews = [], totalReviews = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { auth } = usePage().props;
  const dbUser = auth.user;

  const { data, setData, post, processing, errors, reset } = useForm({
    name: dbUser.name,
    password: '',
    password_confirmation: '',
    avatar: null,
  });

  const user = {
    name: dbUser.name,
    role: dbUser.role === 'contributor' ? 'Contributor' : dbUser.role === 'admin' ? 'Admin' : 'Explorer',
    totalReviews: totalReviews,
    avatar: dbUser.avatar,
    joinDate: new Date(dbUser.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('profile.update'), {
      forceFormData: true,
      onSuccess: () => {
        setIsEditing(false);
        reset('password', 'password_confirmation');
      },
    });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pramana-primary focus:ring-2 focus:ring-pramana-primary/20 transition-all bg-gray-50";
  const labelClass = "block text-xs font-semibold text-pramana-dark mb-1.5";

  return (
    <MobileLayout>
      <Head title="Profile - Bali Pramana" />

      {!isEditing ? (
        /* Profile View Mode */
        <div className="p-5 max-w-2xl mx-auto flex flex-col items-center w-full">
          {/* Greeting */}
          <div className="w-full mb-5">
            <h2 className="font-black text-pramana-dark text-lg text-center">Hi, {user.name} 👋</h2>
          </div>

          {/* Avatar */}
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden border-4 border-pramana-primary/20">
            {user.avatar ? (
              <img src={getImageUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="text-pramana-primary text-xs font-semibold underline mb-2 hover:text-green-700 transition-colors"
          >
            edit
          </button>

          {/* Role Badge */}
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-bold text-pramana-dark text-base">{user.role}</h3>
            <span className="bg-pramana-primary/10 text-pramana-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              {user.role === 'Explorer' ? '🔍' : user.role === 'Contributor' ? '🏪' : '⚙️'} {user.role}
            </span>
          </div>

          {/* Stats Cards */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            {/* Total Reviews */}
            <div className="bg-pramana-primary/5 rounded-2xl p-5 flex flex-col items-center border border-pramana-primary/10">
              <span className="text-xs font-bold text-pramana-primary uppercase tracking-wide mb-2">Total Review</span>
              <span className="text-4xl font-black text-pramana-dark">{user.totalReviews}</span>
            </div>

            {/* Member Since */}
            <div className="bg-pramana-accent/5 rounded-2xl p-5 flex flex-col items-center border border-pramana-accent/10">
              <span className="text-xs font-bold text-pramana-accent uppercase tracking-wide mb-2">Member Since</span>
              <span className="text-sm font-black text-pramana-dark text-center leading-tight">{user.joinDate}</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="w-full mb-6">
            <h3 className="font-bold text-pramana-dark text-sm mb-3">Ulasan Terbaru</h3>
            <div className="space-y-3">
              {userReviews.length > 0 ? (
                userReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-pramana-dark text-xs">{review.destination?.name}</h4>
                      <div className="flex text-yellow-500 text-[10px]">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{review.comment}</p>
                    <p className="text-gray-300 text-[9px] mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-400 text-sm">Belum ada ulasan yang Anda berikan.</p>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <Link
            href="/logout"
            method="post"
            as="button"
            className="w-full text-center border-2 border-red-200 text-red-400 py-3 rounded-2xl font-bold text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-all"
          >
            🚪 Log Out
          </Link>
        </div>
      ) : (
        /* Edit Profile Mode */
        <div className="p-5 max-w-xl mx-auto w-full">
          {/* Back button */}
          <div className="flex items-center gap-2 mb-5">
            <button onClick={() => { setIsEditing(false); reset(); }} className="flex items-center gap-1 text-pramana-dark hover:text-pramana-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-bold text-sm">Edit Profile</span>
            </button>
          </div>

          {/* Avatar with Change Option */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden border-4 border-pramana-primary/20 relative">
              {data.avatar ? (
                <img src={URL.createObjectURL(data.avatar)} className="w-full h-full object-cover" />
              ) : user.avatar ? (
                <img src={getImageUrl(user.avatar)} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <label className="text-pramana-primary text-xs font-semibold underline hover:text-green-700 transition-colors flex items-center gap-1 cursor-pointer">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Change Photo
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setData('avatar', e.target.files[0])} />
            </label>
            {errors.avatar && <p className="text-red-500 text-[10px] mt-1">{errors.avatar}</p>}
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Nama</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nama Anda"
                className={inputClass}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                className={inputClass}
              />
              {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="Ulangi password baru"
                className={inputClass}
              />
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-pramana-primary text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); reset(); }}
                className="w-full border border-gray-200 text-gray-400 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </MobileLayout>
  );
};

export default Profile;