import React, { useState } from 'react';
import MobileLayout from '../Layouts/MobileLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('database/images/')) {
    return '/db-images/' + path.replace('database/images/', '');
  }
  return `/storage/${path}`;
};

// Destination Detail Modal (for admin to see full detail before accepting)
const DestinationDetailModal = ({ item, onClose, onAccept, onDecline }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-48 bg-gray-200">
        {item.images && item.images.length > 0 ? (
          <img src={getImageUrl(item.images[0].image_path)} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.category === 'Wisata Alam' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="font-black text-pramana-dark text-lg mb-1">{item.name}</h2>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <svg className="w-3.5 h-3.5 text-pramana-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
          {item.location}
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Harga</p>
            <p className="font-bold text-pramana-primary text-sm">Rp {item.price}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Koordinat</p>
            <p className="font-bold text-pramana-dark text-xs">{item.latitude}, {item.longitude}</p>
          </div>
        </div>

        {item.rules && (
          <div className="mb-4">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Aturan / Rules</p>
            <p className="text-gray-600 text-xs bg-yellow-50 p-3 rounded-xl border border-yellow-100 italic">{item.rules}</p>
          </div>
        )}

        {/* Contributor info */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-pramana-dark">{item.user?.name || 'Unknown'}</p>
            <p className="text-[10px] text-gray-400">Contributor</p>
          </div>
        </div>

        {/* All photos */}
        {item.images && item.images.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-pramana-dark mb-2">Foto ({item.images.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {item.images.map(img => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={getImageUrl(img.image_path)} alt="" className="w-full h-full object-cover" />
                  {img.is_360 && <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">360°</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={() => { onAccept(item.id); onClose(); }} className="flex-1 bg-pramana-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors">
            ✅ Accept
          </button>
          <button onClick={() => { onDecline(item.id); onClose(); }} className="flex-1 bg-red-400 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-500 transition-colors">
            ❌ Decline
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Destination Waiting List Card
const WaitingCard = ({ item, onAccept, onDecline, onViewDetail }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-pramana-dark text-sm">{item.name}</h3>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.category === 'Wisata Alam' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {item.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-pramana-dark mb-1">
          <svg className="w-3 h-3 text-pramana-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          </svg>
          {item.location}
        </div>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">{item.description}</p>
        <p className="text-[10px] text-gray-400 mb-2">By: {item.user?.name || '?'} • Rp {item.price}</p>

        <div className="flex gap-2">
          <button onClick={() => onViewDetail(item)} className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-blue-600 transition-colors">
            Detail
          </button>
          <button onClick={() => onAccept(item.id)} className="bg-pramana-primary text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-green-700 transition-colors">
            Accept
          </button>
          <button onClick={() => onDecline(item.id)} className="bg-red-400 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-red-500 transition-colors">
            Decline
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img src={getImageUrl(item.images[0].image_path)} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
    </div>
  </div>
);

// Contributor Row
const ContributorRow = ({ contributor, onReview }) => (
  <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-pramana-dark text-sm">{contributor.name}</p>
      <p className="text-xs text-gray-400">{contributor.businessCount} Business</p>
    </div>
    <button onClick={() => onReview(contributor)} className="text-pramana-primary text-xs font-bold underline hover:text-green-700 transition-colors">
      Review
    </button>
  </div>
);

// Contributor Detail Modal
const ContributorDetailModal = ({ contributor, onClose, onDeleteDestination, onSendMessage }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-pramana-bg w-full max-w-md rounded-t-3xl p-5 slide-up max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-pramana-dark">Detail Contributor</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onSendMessage(contributor)}
            className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors"
          >
            ✉️ Pesan
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center mb-5">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <h3 className="font-bold text-pramana-dark">{contributor.name}</h3>
        <p className="text-gray-400 text-xs">{contributor.businessCount} Business</p>
      </div>

      <div className="space-y-3 mb-4">
        {contributor.destinations?.map((dest, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <h4 className="font-bold text-pramana-dark text-sm">{dest.name}</h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    dest.status === 'approved' ? 'bg-green-100 text-green-700' :
                    dest.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{dest.status}</span>
                </div>
                <div className="flex items-center gap-0.5 text-[10px] text-pramana-dark">
                  <svg className="w-3 h-3 text-pramana-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  {dest.location}
                </div>
                <p className="text-gray-400 text-xs mt-1">{dest.description}</p>
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {dest.images && dest.images.length > 0 ? (
                  <img src={getImageUrl(dest.images[0].image_path)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>
            <button
              onClick={() => onDeleteDestination(dest.id)}
              className="mt-2 bg-red-400 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-red-500 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Prompt Modal for Reasons and Messages
const PromptModal = ({ title, placeholder, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
        <h3 className="font-bold text-pramana-dark mb-3">{title}</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-pramana-primary min-h-[100px] mb-4"
        />
        <div className="flex gap-2">
          <button 
            onClick={() => onSubmit(text)}
            className="flex-1 bg-pramana-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-700"
          >
            Kirim
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ pendingDestinations, contributors, stats }) => {
  const [activeTab, setActiveTab] = useState('waiting');
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [viewingDetail, setViewingDetail] = useState(null);
  
  // Modal states
  const [declineReasonModal, setDeclineReasonModal] = useState(null);
  const [deleteReasonModal, setDeleteReasonModal] = useState(null);
  const [sendMessageModal, setSendMessageModal] = useState(null);

  const handleAccept = (id) => {
    router.put(`/admin/destinations/${id}`, { status: 'approved' });
  };

  const handleDecline = (id) => {
    setDeclineReasonModal(id);
  };

  const submitDecline = (reason) => {
    if (declineReasonModal) {
      router.put(`/admin/destinations/${declineReasonModal}`, { status: 'rejected', reason });
      setDeclineReasonModal(null);
      setViewingDetail(null);
    }
  };

  const handleDeleteDestination = (destId) => {
    setDeleteReasonModal(destId);
  };

  const submitDelete = (reason) => {
    if (deleteReasonModal) {
      router.delete(`/admin/destinations/${deleteReasonModal}`, { 
        data: { reason },
        onSuccess: () => {
          if (selectedContributor) {
            setSelectedContributor(prev => ({
              ...prev,
              destinations: prev.destinations.filter(d => d.id !== deleteReasonModal),
              businessCount: prev.businessCount - 1
            }));
          }
          setDeleteReasonModal(null);
        }
      });
    }
  };

  const submitSendMessage = (text) => {
    if (sendMessageModal) {
      router.post('/mailbox/send', {
        receiver_id: sendMessageModal.id,
        subject: 'Pesan dari Admin',
        body: text
      }, {
        onSuccess: () => setSendMessageModal(null)
      });
    }
  };

  return (
    <MobileLayout isAdmin={true}>
      <Head title="Admin Dashboard - Bali Pramana" />

      {/* Modals */}
      {declineReasonModal && (
        <PromptModal
          title="Alasan Penolakan"
          placeholder="Jelaskan mengapa bisnis ini ditolak..."
          onClose={() => setDeclineReasonModal(null)}
          onSubmit={submitDecline}
        />
      )}
      {deleteReasonModal && (
        <PromptModal
          title="Alasan Penghapusan"
          placeholder="Jelaskan mengapa bisnis ini dihapus..."
          onClose={() => setDeleteReasonModal(null)}
          onSubmit={submitDelete}
        />
      )}
      {sendMessageModal && (
        <PromptModal
          title={`Kirim Pesan ke ${sendMessageModal.name}`}
          placeholder="Tulis pesan peringatan atau informasi..."
          onClose={() => setSendMessageModal(null)}
          onSubmit={submitSendMessage}
        />
      )}

      <div className="px-4 md:px-8 pt-4 md:pt-8 pb-8 max-w-7xl mx-auto w-full">
        {/* Dashboard Header */}
        <div className="bg-pramana-primary rounded-2xl p-4 mb-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-white/70 text-xs">Welcome back,</p>
              <p className="font-black text-white text-sm">Super Admin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Pending', value: stats.pending, icon: '⏳' },
              { label: 'Contributors', value: stats.contributors, icon: '🏪' },
              { label: 'Wisata Alam', value: stats.destinations, icon: '📍' },
              { label: 'Kuliner Lokal', value: stats.kuliner, icon: '🍜' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white/20 rounded-xl p-2.5 text-center">
                <p className="text-lg">{icon}</p>
                <p className="font-black text-white text-sm">{value}</p>
                <p className="text-white/60 text-[10px] truncate">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
          <button
            onClick={() => setActiveTab('waiting')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'waiting' ? 'bg-white text-pramana-primary shadow' : 'text-gray-400'
            }`}
          >
            ⏳ Waiting List ({pendingDestinations.length})
          </button>
          <button
            onClick={() => setActiveTab('contributors')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contributors' ? 'bg-white text-pramana-primary shadow' : 'text-gray-400'
            }`}
          >
            🏪 Contributors ({contributors.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'waiting' ? (
          <div className="space-y-3">
            <h2 className="font-bold text-pramana-dark text-sm mb-2">Menunggu Persetujuan</h2>
            {pendingDestinations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-400 text-sm">Tidak ada konten yang menunggu</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDestinations.map(item => (
                  <WaitingCard
                    key={item.id}
                    item={item}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onViewDetail={(item) => setViewingDetail(item)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="font-bold text-pramana-dark text-sm mb-2">Daftar Contributor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributors.map(contributor => (
                <ContributorRow
                  key={contributor.id}
                  contributor={contributor}
                  onReview={(c) => setSelectedContributor(c)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Destination Detail Modal */}
      {viewingDetail && (
        <DestinationDetailModal
          item={viewingDetail}
          onClose={() => setViewingDetail(null)}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}

      {/* Contributor Detail Modal */}
      {selectedContributor && (
        <ContributorDetailModal
          contributor={selectedContributor}
          onClose={() => setSelectedContributor(null)}
          onDeleteDestination={handleDeleteDestination}
          onSendMessage={(c) => setSendMessageModal(c)}
        />
      )}
    </MobileLayout>
  );
};

export default AdminDashboard;
