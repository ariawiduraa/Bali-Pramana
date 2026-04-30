import React, { useState } from 'react';
import MobileLayout from '../Layouts/MobileLayout';
import { Head, Link } from '@inertiajs/react';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('database/images/')) {
    return '/db-images/' + path.replace('database/images/', '');
  }
  return `/storage/${path}`;
};

// Star Rating Component
const StarRating = ({ rating, max = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={`text-xs ${i < Math.floor(rating) ? 'text-amber-500' : 'text-gray-200'}`}>
        ★
      </span>
    ))}
  </div>
);

// Category Badge
const CategoryBadge = ({ category }) => {
  const isNature = category === 'Wisata Alam';
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
      isNature
        ? 'bg-emerald-500/90 text-white'
        : 'bg-amber-500/90 text-white'
    }`}>
      {isNature ? '🌿' : '🍜'} {category}
    </span>
  );
};

// Destination Card
const DestinationCard = ({ item, index }) => {
  const avgRating = item.reviews?.length > 0
    ? item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length
    : 5;

  return (
    <Link
      href={`/destination/${item.slug}`}
      className="block group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="destination-card bg-white rounded-3xl overflow-hidden shadow-card h-full flex flex-col">

        {/* Image */}
        <div className="w-full h-52 md:h-56 relative overflow-hidden">
          <img
            src={item.images?.[0]?.image_path ? getImageUrl(item.images[0].image_path) : 'https://images.unsplash.com/photo-1554481923-a6918bd997bc?auto=format&fit=crop&w=800&q=80'}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-full h-full bg-pramana-cream items-center justify-center absolute inset-0">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 left-3">
            <CategoryBadge category={item.category} />
          </div>
          <div className="absolute bottom-3 right-3 glass px-3 py-1.5 rounded-xl">
            <p className="text-white font-extrabold text-xs drop-shadow-md">
              Rp {Number(item.price).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3 h-3 text-pramana-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <span className="text-xs font-semibold text-gray-500 truncate">{item.location}</span>
          </div>

          <h3 className="font-display text-pramana-dark text-lg leading-snug mb-1.5 group-hover:text-pramana-primary transition-colors duration-300">
            {item.name}
          </h3>
          <p className="text-gray-400 text-[13px] line-clamp-2 leading-relaxed mb-4 flex-1">
            {item.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <StarRating rating={avgRating} />
              <span className="text-[10px] text-gray-400 font-medium">
                ({item.reviews?.length || 0})
              </span>
            </div>
            <span className="text-[10px] font-bold text-pramana-primary bg-pramana-primary/8 px-2.5 py-1 rounded-full group-hover:bg-pramana-primary group-hover:text-white transition-all">
              Lihat Detail →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Home = ({ destinations = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high'

  const filtered = destinations.filter(item => {
    const matchesFilter = activeFilter === 'all'
      || (activeFilter === 'wisata' && item.category === 'Wisata Alam')
      || (activeFilter === 'kuliner' && item.category === 'Kuliner Lokal');
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <MobileLayout>
      <Head title="Bali Pramana — Discover Hidden Gems" />

      {/* Hero Banner */}
      <div className="relative h-[280px] md:h-[420px] lg:h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1800&q=80"
          alt="Bali Nature"
          className="w-full h-full object-cover scale-105 animate-pulse-soft"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pramana-dark/30 via-pramana-primary/50 to-pramana-dark/90" />

        {/* Tropical pattern overlay */}
        <div className="absolute inset-0 tropical-pattern" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-white/80 text-[10px] md:text-sm font-semibold mb-2 md:mb-3 uppercase tracking-[0.35em]">
            Selamat Datang di
          </p>
          <h1 className="text-white font-display text-3xl md:text-6xl lg:text-7xl leading-tight mb-3 md:mb-4 drop-shadow-lg">
            Discover Bali's<br />
            <span className="text-gradient-gold" style={{WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, #e9c46a, #e07a5f, #f4a261)'}}>
              Hidden Gems
            </span>
          </h1>
          <p className="text-white/70 text-[11px] md:text-base max-w-lg leading-relaxed px-4 md:px-0">
            Jelajahi keindahan wisata alam tersembunyi dan cita rasa kuliner autentik Kabupaten Buleleng.
          </p>
        </div>

        {/* Bottom curve */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80V30C360 80 720 0 1080 30C1260 45 1380 65 1440 80H0Z" fill="#f8f6f0"/>
          </svg>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 md:px-8 max-w-2xl mx-auto -mt-6 md:-mt-10 relative z-20">
        <div className="glass bg-white/80 rounded-2xl shadow-glass flex items-center gap-3 px-5 py-3.5">
          <svg className="w-5 h-5 text-pramana-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari wisata atau kuliner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-pramana-dark placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="bg-gray-100 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Quick Categories & Sort */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mt-8 space-y-4">
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
          {[
            { key: 'all', label: 'Semua', emoji: '🌏' },
            { key: 'wisata', label: 'Wisata Alam', emoji: '🏞️' },
            { key: 'kuliner', label: 'Kuliner Lokal', emoji: '🍜' },
          ].map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex-none py-2 px-4 md:py-2.5 md:px-5 rounded-full text-[11px] md:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeFilter === key
                  ? 'bg-pramana-primary text-white shadow-pramana'
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-pramana-primary/30 hover:text-pramana-primary hover:shadow-sm'
              }`}
            >
              <span>{emoji}</span> {label}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2 px-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[10px] md:text-xs font-bold bg-white border border-gray-100 rounded-xl px-3 py-1.5 focus:ring-pramana-primary focus:border-pramana-primary text-gray-500 shadow-sm"
          >
            <option value="default">Urutkan: Default</option>
            <option value="price-low">Harga: Terendah</option>
            <option value="price-high">Harga: Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Destination List */}
      <div className="px-4 md:px-8 mt-6 pb-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-pramana-dark text-xl md:text-2xl">
            {activeFilter === 'all' ? 'Jelajahi Destinasi' : activeFilter === 'wisata' ? 'Wisata Alam' : 'Kuliner Lokal'}
          </h2>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            {filtered.length} tempat
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-card">
            <div className="text-6xl mb-4 animate-float">🔍</div>
            <p className="text-pramana-dark font-display text-xl mb-1">Tidak ditemukan</p>
            <p className="text-gray-400 text-sm">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {filtered.map((item, index) => <DestinationCard key={item.id} item={item} index={index} />)}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Home;