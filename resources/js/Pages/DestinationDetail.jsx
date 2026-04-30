import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import MobileLayout from '../Layouts/MobileLayout';
import Viewer360 from '../Components/Viewer360';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('database/images/')) {
    return '/db-images/' + path.replace('database/images/', '');
  }
  return `/storage/${path}`;
};

// --- Star Rating ---
const StarRating = ({ rating, max = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-amber-500' : 'text-gray-200'}`}>★</span>
    ))}
  </div>
);

// --- Cultural Agreement Modal ---
const CulturalAgreementModal = ({ onAgree, onDecline }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-scale-in">
      <div className="bg-gradient-to-br from-pramana-accent to-orange-400 px-6 py-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 tropical-pattern"></div>
        <div className="text-4xl mb-2 relative z-10">⚠️</div>
        <h2 className="text-white font-display text-xl relative z-10">Perhatian</h2>
      </div>
      <div className="px-6 py-6">
        <p className="text-pramana-dark text-sm font-semibold text-center mb-5 leading-relaxed">
          Anda harus mematuhi dan siap bertanggung jawab atas aturan yang berlaku di setiap destinasi.
        </p>
        <div className="bg-pramana-bg rounded-2xl p-4 space-y-3 mb-6 border border-pramana-primary/10">
          {[
            '🌿 Berpakaian sopan dan menghormati adat setempat',
            '♻️ Tidak membuang sampah sembarangan di area wisata',
            '🛕 Hormati prosesi adat dan ritual yang berlangsung',
            '📵 Tidak mengambil foto di area yang dilarang',
          ].map((rule, i) => (
            <p key={i} className="text-[13px] text-gray-600 flex items-start gap-2.5">
              <span className="flex-shrink-0 text-base">{rule.split(' ')[0]}</span>
              <span className="pt-0.5">{rule.split(' ').slice(1).join(' ')}</span>
            </p>
          ))}
        </div>
        <button onClick={onAgree} className="w-full bg-pramana-primary text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-green-800 transition-all shadow-pramana hover:shadow-pramana-lg hover:-translate-y-0.5 mb-2">
          OK — Saya Setuju
        </button>
        <button onClick={onDecline} className="w-full text-gray-400 text-sm py-2 hover:text-pramana-dark transition-colors font-medium">
          ← Kembali
        </button>
      </div>
    </div>
  </div>
);

// --- Review Card ---
const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100/60 shadow-card hover:shadow-sm transition-shadow">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-pramana-primary/20 to-pramana-light/20 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-pramana-primary font-bold text-sm">{(review.user?.name || 'U').charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-pramana-dark text-[13px]">{review.user?.name || 'User'}</p>
          <StarRating rating={review.rating} />
        </div>
        <p className="text-gray-500 text-[13px] leading-relaxed mb-2">{review.comment}</p>
        {review.image_path && (
          <img src={getImageUrl(review.image_path)} alt="Review" className="w-full h-36 object-cover rounded-xl mb-2" />
        )}
        <div className="flex items-center justify-between">
          <p className="text-gray-300 text-[11px] font-medium">{new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          {review.user_id === currentUserId && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(review)} className="text-blue-500 text-[11px] font-bold hover:underline">Edit</button>
              <button onClick={() => onDelete(review.id)} className="text-red-500 text-[11px] font-bold hover:underline">Hapus</button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// --- Review Modal ---
const ReviewModal = ({ destinationId, editReview, onClose }) => {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    rating: editReview?.rating || 5,
    comment: editReview?.comment || '',
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editReview) {
      put(`/reviews/${editReview.id}`, { onSuccess: () => { reset(); onClose(); } });
    } else {
      post(`/destinations/${destinationId}/reviews`, {
        forceFormData: true,
        onSuccess: () => { reset(); onClose(); },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-pramana-dark">{editReview ? 'Edit Ulasan' : 'Tulis Ulasan'}</h3>
          <button onClick={onClose} className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Rating Anda:</p>
            <div className="flex gap-2 text-2xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} onClick={() => setData('rating', s)}
                  className={`cursor-pointer transition-transform hover:scale-125 ${s <= data.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
          </div>
          {!editReview && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Foto (Opsional):</p>
              <input type="file" accept="image/*" onChange={e => setData('image', e.target.files[0])}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none" />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>
          )}
          <textarea value={data.comment} onChange={e => setData('comment', e.target.value)}
            placeholder="Ceritakan pengalaman Anda di sini..." rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pramana-primary transition-colors resize-none mb-2" />
          {errors.comment && <p className="text-red-500 text-xs">{errors.comment}</p>}
          <button type="submit" disabled={processing}
            className="w-full mt-2 bg-pramana-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50">
            {processing ? 'Mengirim...' : editReview ? 'Update Ulasan' : 'Kirim Ulasan'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Media Gallery (main component) ---
const MediaGallery = ({ images360, imagesRegular, destinationName }) => {
  const [activeRegularIdx, setActiveRegularIdx] = useState(0);
  const [viewMode, setViewMode] = useState(images360.length > 0 ? '360' : 'gallery');

  const has360 = images360.length > 0;
  const hasRegular = imagesRegular.length > 0;

  const goNext = () => setActiveRegularIdx(i => (i + 1) % imagesRegular.length);
  const goPrev = () => setActiveRegularIdx(i => (i - 1 + imagesRegular.length) % imagesRegular.length);

  return (
    <div className="flex flex-col gap-3">
      {/* View mode tabs (only if both exist) */}
      {has360 && hasRegular && (
        <div className="flex gap-2 px-4 md:px-0">
          <button
            onClick={() => setViewMode('360')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === '360' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Virtual Tour 360°
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'gallery' ? 'bg-pramana-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Galeri Foto ({imagesRegular.length})
          </button>
        </div>
      )}

      {/* 360 Viewer */}
      {viewMode === '360' && has360 && (
        <div className="mx-4 md:mx-0">
          <Viewer360
            imageUrl={getImageUrl(images360[0].image_path)}
            height="var(--gallery-h, 280px)"
          />
        </div>
      )}

      {/* Regular Gallery */}
      {viewMode === 'gallery' && hasRegular && (
        <div className="relative mx-4 md:mx-0 rounded-2xl overflow-hidden shadow-lg h-[280px] md:h-[420px] lg:h-[500px]">
          {/* Main image */}
          <img
            src={imagesRegular[activeRegularIdx]}
            alt={`${destinationName} foto ${activeRegularIdx + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Prev / Next buttons */}
          {imagesRegular.length > 1 && (
            <>
              <button onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imagesRegular.map((_, i) => (
                  <button key={i} onClick={() => setActiveRegularIdx(i)}
                    className={`rounded-full transition-all ${i === activeRegularIdx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`} />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {activeRegularIdx + 1} / {imagesRegular.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Fallback if no images at all */}
      {!has360 && !hasRegular && (
        <div className="mx-4 md:mx-0 rounded-2xl overflow-hidden shadow-lg h-[280px] md:h-[420px] bg-gray-200 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Thumbnails (regular only, show when in gallery mode) */}
      {viewMode === 'gallery' && imagesRegular.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 md:px-0 pb-1">
          {imagesRegular.map((url, i) => (
            <button key={i} onClick={() => setActiveRegularIdx(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeRegularIdx ? 'border-pramana-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// === MAIN PAGE ===
const DestinationDetail = ({ destination }) => {
  const { auth } = usePage().props;
  const currentUserId = auth?.user?.id;
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Separate 360 and regular images
  const images360 = (destination.images || []).filter(img => img.is_360);
  const imagesRegular = (destination.images || [])
    .filter(img => !img.is_360)
    .map(img => getImageUrl(img.image_path));

  // If no regular images, use a placeholder
  const displayImagesRegular = imagesRegular.length > 0
    ? imagesRegular
    : ['https://images.unsplash.com/photo-1554481923-a6918bd997bc?auto=format&fit=crop&w=800&q=80'];

  const reviews = destination.reviews || [];
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 5.0;

  const handleDeleteReview = (reviewId) => {
    if (confirm('Yakin ingin menghapus ulasan ini?')) {
      router.delete(`/reviews/${reviewId}`);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  return (
    <div className="bg-pramana-bg min-h-screen text-pramana-dark font-sans">
      <Head title={`${destination.name} - Bali Pramana`} />

      {!hasAgreed && (
        <CulturalAgreementModal
          onAgree={() => setHasAgreed(true)}
          onDecline={() => window.history.back()}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          destinationId={destination.id}
          editReview={editingReview}
          onClose={() => { setShowReviewModal(false); setEditingReview(null); }}
        />
      )}

      <div className={`transition-all duration-500 max-w-7xl mx-auto ${hasAgreed ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>

        {/* Back navigation */}
        <div className="flex items-center gap-3 px-4 md:px-8 pt-4 md:pt-8 pb-2 md:pb-4">
          <Link href="/" className="flex items-center gap-2 text-pramana-dark hover:text-pramana-primary transition-colors group">
            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-bold">{destination.name}</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:gap-8 px-0 md:px-8 pb-12">

          {/* ─── Left: Media Gallery ─── */}
          <div className="md:w-1/2 lg:w-3/5 flex flex-col gap-3">
            <MediaGallery
              images360={images360}
              imagesRegular={displayImagesRegular}
              destinationName={destination.name}
            />
          </div>

          {/* ─── Right: Details ─── */}
          <div className="px-4 md:px-0 mt-6 md:mt-0 md:w-1/2 lg:w-2/5 flex flex-col">

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-pramana-accent text-xs font-bold bg-pramana-accent/10 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
                {destination.location}
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={avgRating} />
                <span className="text-[11px] text-gray-400 font-medium">({reviews.length})</span>
              </div>
            </div>

            <h1 className="font-display text-pramana-dark text-2xl md:text-3xl leading-tight mb-4">{destination.name}</h1>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => {
                  const phone = destination.contact_number ? destination.contact_number.replace(/^0/, '62').replace(/[^\d]/g, '') : '6281234567890';
                  window.open(`https://wa.me/${phone}?text=Saya ingin bertanya tentang ${destination.name}`, '_blank');
                }}
                className="flex-1 bg-pramana-primary text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-pramana hover:shadow-pramana-lg hover:-translate-y-0.5"
              >
                💬 Chat Guide
              </button>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${destination.latitude},${destination.longitude}`, '_blank')}
                className="flex-1 border-2 border-pramana-primary text-pramana-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-pramana-primary hover:text-white transition-all hover:-translate-y-0.5"
              >
                📍 Google Maps
              </button>
            </div>

            <div className="mb-5">
              <h2 className="font-display text-pramana-dark text-base mb-2">Deskripsi</h2>
              <p className="text-gray-500 text-[13px] leading-relaxed">{destination.description}</p>
            </div>

            {destination.rules && (
              <div className="mb-5 bg-amber-50/80 rounded-2xl p-4 border border-amber-100">
                <h2 className="font-display text-pramana-dark text-base mb-2 flex items-center gap-2">📋 Aturan</h2>
                <p className="text-gray-600 text-[13px] leading-relaxed">{destination.rules}</p>
              </div>
            )}

            <div className="bg-gradient-to-br from-pramana-primary/8 to-pramana-light/8 rounded-2xl p-5 mb-6 border border-pramana-primary/10">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Tiket Masuk</p>
              <p className="font-display text-pramana-primary text-2xl">
                Rp {Number(destination.price).toLocaleString('id-ID')}
                <span className="text-sm font-sans font-normal text-gray-400 ml-1">/orang</span>
              </p>
            </div>

            {/* Reviews */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-pramana-dark text-base">Ulasan ({reviews.length})</h2>
                <button
                  onClick={() => { setEditingReview(null); setShowReviewModal(true); }}
                  className="bg-pramana-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-green-800 transition-all shadow-sm hover:shadow-pramana"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  Tulis
                </button>
              </div>

              <div className="space-y-3">
                {reviews.length === 0 && <p className="text-gray-400 text-xs italic">Belum ada ulasan.</p>}
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={currentUserId}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Override gallery height via CSS custom property */}
      <style>{`
        @media (min-width: 768px) { :root { --gallery-h: 420px; } }
        @media (min-width: 1024px) { :root { --gallery-h: 500px; } }
        :root { --gallery-h: 280px; }
        .pnlm-container { border-radius: 1rem !important; }
        .pnlm-render-container { border-radius: 1rem !important; }
        .pnlm-ui { border-radius: 1rem !important; }
        .pnlm-about-msg { display: none !important; }
        .pnlm-load-box { border-radius: 1rem !important; }
        .pnlm-lbar { border-radius: 4px !important; }
        .pnlm-lbar-fill { border-radius: 4px !important; }
      `}</style>
    </div>
  );
};

export default DestinationDetail;