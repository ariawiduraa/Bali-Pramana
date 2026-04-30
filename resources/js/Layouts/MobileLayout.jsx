import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const BaliPramanaLogo = ({ className = "w-10 h-10" }) => (
  <img src="/images/balipramana_logo.png" className={className} alt="Bali Pramana Logo" />
);

const HomeIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-pramana-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MapIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-pramana-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-pramana-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShieldIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-pramana-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChatBubbleIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-pramana-primary' : 'text-gray-500'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
  </svg>
);

const MobileLayout = ({ children, hideNav = false, isAdmin = false }) => {
  const { url, props } = usePage();
  const auth = props.auth;
  const dbUser = auth?.user;
  const userRole = dbUser?.role || 'guest';
  const isAdminView = isAdmin || userRole === 'admin';

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Halo! Saya asisten Bali Pramana. Ada yang bisa saya bantu? 🌿' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { from: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Prepare typing state
    setChatMessages(prev => [...prev, { from: 'bot', text: '...', isTyping: true }]);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': import.meta.env.VITE_GROQ_API_KEY
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'Anda adalah asisten Bali Pramana yang ramah. Bantu pengguna menemukan destinasi wisata alam (seperti Air Terjun Sekumpul, Candi Kuning) dan kuliner lokal (seperti Siobak, Blayag) di Kabupaten Buleleng, Bali. Gunakan bahasa Indonesia yang sopan dan sesekali tambahkan emoji yang relevan.' },
            { role: 'user', content: chatInput }
          ],
          temperature: 0.7,
          max_tokens: 256
        })
      });

      const data = await response.json();
      const botResponseText = data.choices[0].message.content;
      
      setChatMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { from: 'bot', text: botResponseText }];
      });
    } catch (error) {
      console.error('Groq Error:', error);
      setChatMessages(prev => {
        const filtered = prev.filter(m => !m.isTyping);
        return [...filtered, { from: 'bot', text: 'Maaf, saya sedang mengalami kendala koneksi. Coba lagi nanti ya! 🙏' }];
      });
    }
  };

  let navLinks = [
    { href: '/', icon: HomeIcon, label: 'Home' },
    { href: '/map', icon: MapIcon, label: 'Map' },
  ];

  if (userRole === 'admin') {
    navLinks.push({ href: '/admin', icon: ShieldIcon, label: 'Admin' });
  } else if (userRole === 'contributor') {
    navLinks.push({ href: '/my-business', icon: ShieldIcon, label: 'My Business' });
    navLinks.push({ href: '/mailbox', icon: ChatBubbleIcon, label: 'Mailbox' });
  }
  
  if (userRole !== 'guest') {
    navLinks.push({ href: '/profile', icon: UserIcon, label: 'Profile' });
  }

  return (
    <div className="bg-pramana-bg min-h-screen font-sans text-pramana-dark flex flex-col">
      <div className="w-full flex-1 relative flex flex-col">

        {/* TOP HEADER */}
        {!hideNav && (
          <header className="flex justify-between items-center px-4 md:px-8 py-3 md:py-5 bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-30 shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 -ml-2 rounded-xl hover:bg-gray-100/80 transition-colors md:hidden"
                aria-label="Open menu"
              >
              <svg className="w-6 h-6 text-pramana-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

              <Link href="/" className="flex items-center hover:opacity-80 transition-transform hover:scale-105 duration-300">
                <BaliPramanaLogo className="h-10 w-auto md:h-12 md:w-auto object-contain drop-shadow-sm" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 bg-gray-50/80 px-6 py-2.5 rounded-full border border-gray-100">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-all duration-300 hover:text-pramana-primary relative group ${
                    (item.href === '/' ? url === '/' : url.startsWith(item.href)) ? 'text-pramana-primary' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-pramana-primary rounded-full transition-all duration-300 ${
                    (item.href === '/' ? url === '/' : url.startsWith(item.href)) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                  }`}></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {!dbUser ? (
                <Link href="/login" className="px-5 py-2.5 rounded-full bg-pramana-primary text-white text-sm font-bold shadow-pramana hover:shadow-pramana-lg hover:-translate-y-0.5 transition-all duration-300" aria-label="Login/Register">
                  Masuk
                </Link>
              ) : (
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pramana-primary to-pramana-light flex items-center justify-center text-white font-bold shadow-sm">
                    {dbUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-pramana-dark pr-2 hidden md:block">{dbUser.name}</span>
                </div>
              )}
            </div>
          </header>
        )}

        {/* SIDEBAR DRAWER */}
        <div
          className={`absolute inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        <div className={`absolute top-0 left-0 w-4/5 max-w-[320px] h-full bg-white/95 backdrop-blur-xl border-r border-white/20 text-pramana-dark z-50 transform transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col shadow-2xl ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Drawer Header */}
            <div className="bg-gradient-hero p-8 text-white flex flex-col items-center relative overflow-hidden rounded-br-3xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <BaliPramanaLogo className="h-20 w-auto object-contain drop-shadow-md relative z-10" />
              <p className="text-xs font-medium text-white/90 mt-3 tracking-wider relative z-10">Eco-Tourism Platform</p>
            </div>

          <div className="p-6 space-y-2 flex-1 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4 ml-2">Menu Navigasi</p>
            {[
              { label: 'Beranda', href: '/', icon: HomeIcon },
              { label: 'Peta Interaktif', href: '/map', icon: MapIcon },
              { label: 'Profil Saya', href: '/profile', icon: UserIcon },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-gray-600 hover:text-pramana-primary hover:bg-pramana-primary/5 rounded-2xl transition-all duration-300 font-semibold text-sm group"
              >
                <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all">
                  <item.icon active={url === item.href || url.startsWith(item.href + '/')} />
                </div>
                {item.label}
              </Link>
            ))}
            
            {!dbUser && (
               <Link
               href="/login"
               onClick={() => setIsDrawerOpen(false)}
               className="flex items-center gap-4 px-4 py-3.5 text-gray-600 hover:text-pramana-primary hover:bg-pramana-primary/5 rounded-2xl transition-all duration-300 font-semibold text-sm group mt-4"
             >
               <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all">
                 <UserIcon active={false} />
               </div>
               Masuk / Daftar
             </Link>
            )}
          </div>

          <div className="p-6 border-t border-gray-100">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-full py-3.5 bg-gray-50 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 hover:text-pramana-dark transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              Tutup Menu
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className={`flex-1 overflow-x-hidden ${hideNav ? '' : 'pb-24 md:pb-8'} relative`}>
          {children}
        </main>



        {/* BOTTOM NAVIGATION (Mobile Only) */}
        {!hideNav && (
          <div className="md:hidden fixed bottom-4 w-full px-4 z-40 pointer-events-none">
            <nav className="w-full bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl px-2 py-2 flex justify-around items-center pointer-events-auto max-w-sm mx-auto">
              {navLinks.map(({ href, icon: Icon, label }) => {
                const isActive = href === '/' ? url === '/' : url.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className="relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 group"
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-pramana-primary/10 rounded-2xl scale-100 transition-transform"></span>
                    )}
                    <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:-translate-y-1'}`}>
                      <Icon active={isActive} />
                    </div>
                    <span className={`relative z-10 text-[9px] font-bold tracking-wide transition-colors ${isActive ? 'text-pramana-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {label}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-1 w-1 h-1 bg-pramana-primary rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* FLOATING ASSISTANT - FORCED VISIBILITY WITH INLINE STYLES */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '30px', 
          right: '30px', 
          zIndex: 999999,
          display: 'block' 
        }}
      >
        {isChatOpen ? (
          <div className="bg-white w-80 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden slide-up">
            {/* Header */}
            <div className="bg-pramana-primary px-5 py-4 flex items-center justify-between" style={{ backgroundColor: '#2d6a4f' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Pramana Assistant</p>
                  <p className="text-white/60 text-[10px]">Siap membantu Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.from === 'bot' && (
                    <div className="w-8 h-8 bg-pramana-primary rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-auto shadow-sm" style={{ backgroundColor: '#2d6a4f' }}>
                      <span className="text-white text-xs">🌿</span>
                    </div>
                  )}
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-pramana-primary text-white rounded-tr-none shadow-md'
                      : 'bg-white text-pramana-dark border border-gray-100 rounded-tl-none shadow-sm'
                  }`} style={msg.from === 'user' ? { backgroundColor: '#2d6a4f' } : {}}>
                    {msg.isTyping ? (
                      <div className="flex gap-1.5 py-1.5">
                        <div className="w-2 h-2 bg-pramana-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pramana-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-pramana-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pramana-primary transition-colors"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-pramana-primary rounded-2xl flex items-center justify-center hover:bg-green-700 transition-all shadow-pramana"
                style={{ backgroundColor: '#2d6a4f' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 text-white rounded-full flex items-center justify-center shadow-[0_12px_40px_rgb(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all"
            style={{ backgroundColor: '#2d6a4f', border: 'none', cursor: 'pointer' }}
            title="Tanya Assistant"
          >
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileLayout;