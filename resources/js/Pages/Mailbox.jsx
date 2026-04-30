import React, { useState } from 'react';
import MobileLayout from '../Layouts/MobileLayout';
import { Head, router } from '@inertiajs/react';

const Mailbox = ({ messages, adminContact }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const markAsRead = (id) => {
    router.put(route('mailbox.read', id), {}, { preserveScroll: true });
  };

  const handleMessageClick = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read_at) {
      markAsRead(msg.id);
    }
  };

  return (
    <MobileLayout>
      <Head title="Mailbox - Bali Pramana" />

      <div className="p-4 md:px-8 max-w-4xl mx-auto w-full pb-24">
        <h1 className="text-2xl font-black text-pramana-dark mb-6">Mailbox</h1>

        {/* Message List */}
        <div className="space-y-4 mb-8">
          {messages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <span className="text-4xl mb-3 block">📭</span>
              <p className="text-gray-500 font-semibold">Kotak masuk kosong</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleMessageClick(msg)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  !msg.read_at 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'bg-white border-gray-100 shadow-sm hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-sm ${!msg.read_at ? 'text-blue-900' : 'text-pramana-dark'}`}>
                    {msg.subject}
                  </h3>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{msg.body}</p>
              </div>
            ))
          )}
        </div>

        {/* Admin Contact Info */}
        {adminContact && (
          <div className="bg-pramana-primary/10 rounded-2xl p-5 border border-pramana-primary/20">
            <h3 className="font-bold text-pramana-dark text-sm mb-2 text-center">Butuh Bantuan? Hubungi Admin</h3>
            <p className="text-xs text-gray-600 text-center mb-4">
              Jika Anda memiliki pertanyaan atau ingin mengajukan banding, silakan hubungi kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href={`https://wa.me/${adminContact.phone}?text=Halo%20Admin%20Bali%20Pramana`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-green-600 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                WhatsApp Admin
              </a>
              <a 
                href={`mailto:${adminContact.email}?subject=Bantuan%20Bali%20Pramana`} 
                className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Email Admin
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-pramana-primary px-5 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm truncate pr-4">{selectedMessage.subject}</h3>
              <button onClick={() => setSelectedMessage(null)} className="text-white/80 hover:text-white transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">🛡️</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-pramana-dark">Admin Bali Pramana</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(selectedMessage.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.body}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};

export default Mailbox;
