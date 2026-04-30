import React, { useEffect, useRef, useState } from 'react';

/**
 * Interactive 360° panorama viewer using Pannellum (loaded via CDN).
 * Drag with mouse/touch to rotate. Scroll to zoom.
 */
const Viewer360 = ({ imageUrl, height = '400px' }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 15; // 3 seconds total
    let active = true;

    const initPannellum = () => {
      if (!active || !containerRef.current || !imageUrl) return;

      // Ensure container has dimensions
      if (containerRef.current.clientWidth === 0 || containerRef.current.clientHeight === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initPannellum, 200);
        }
        return;
      }

      if (typeof window.pannellum === 'undefined') {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initPannellum, 200);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
        return;
      }

      // Cleanup existing viewer
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying pannellum:', e);
        }
        viewerRef.current = null;
      }

      // Ensure container is ready and clean
      containerRef.current.innerHTML = '';

      try {
        const viewer = window.pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          // Add cache buster to avoid Chrome CORS cache issues
          panorama: `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${new Date().getTime()}`,
          autoLoad: true,
          autoRotate: -2,
          compass: false,
          showControls: true,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          mouseZoom: true,
          draggable: true,
          friction: 0.15,
          hfov: 110,
          minHfov: 50,
          maxHfov: 120,
          pitch: 0,
          yaw: 0,
          hotSpotDebug: false,
          crossOrigin: 'anonymous',
          strings: {
            loadButtonLabel: 'Klik untuk memuat 360°',
            loadingLabel: 'Memuat...',
            errorPano: 'Foto 360° tidak dapat dimuat atau terlalu besar.',
            errorGeneric: 'Terjadi kesalahan teknis pada browser Anda.',
          },
        });

        viewer.on('load', () => {
          if (active) {
            setIsLoading(false);
            setHasError(false);
          }
        });

        viewer.on('error', (err) => {
          console.error('Pannellum error:', err);
          if (active) {
            setIsLoading(false);
            setHasError(true);
          }
        });

        viewerRef.current = viewer;

        const timer = setTimeout(() => {
          if (active && isLoading) setIsLoading(false);
        }, 10000);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Pannellum exception:', err);
        if (active) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    setHasError(false);
    
    const startTimer = setTimeout(initPannellum, 150);

    return () => {
      active = false;
      clearTimeout(startTimer);
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) { /* ignore */ }
        viewerRef.current = null;
      }
    };
  }, [imageUrl]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg" style={{ height }}>
      {/* Pannellum Container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ background: '#111' }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="text-3xl mb-2 animate-spin">⟳</div>
            <p className="text-sm">Memuat Virtual Tour 360°...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10 px-6 text-center">
          <div className="text-white">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm font-bold mb-1">Gagal memuat foto 360°</p>
            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
              Pastikan koneksi internet stabil atau coba muat ulang komponen ini.
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                // The useEffect will re-run if we toggle a dummy state or just call init again
                // but since imageUrl hasn't changed, we can force a re-init by just calling it
                // Actually, let's just use a key or a signal to force re-run if needed.
                // For now, let's just reload the page as a safe fallback or manually trigger init.
                window.location.reload(); 
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/20 transition-all"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      )}

      {/* Hint overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
          Seret untuk menjelajahi • Scroll untuk zoom
        </div>
      </div>

      {/* 360° badge */}
      <div className="absolute top-3 left-3 pointer-events-none z-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          360° Virtual Tour
        </div>
      </div>
    </div>
  );
};

export default Viewer360;
