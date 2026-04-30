import React, { useState } from 'react';
import MobileLayout from '../Layouts/MobileLayout';
import { Head, Link } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon definitions
const wisataIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const kulinerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to recenter map when selecting a pin
const RecenterAutomatically = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
};

const MapScreen = ({ destinations = [] }) => {
  const [selectedPin, setSelectedPin] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPins = destinations.filter(p => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'wisata' && p.category === 'Wisata Alam') return true;
    if (activeCategory === 'kuliner' && p.category === 'Kuliner Lokal') return true;
    return false;
  });

  const handlePinClick = (pin) => {
    setSelectedPin(selectedPin?.id === pin.id ? null : pin);
  };

  return (
    <MobileLayout>
      <Head title="Map - Bali Pramana" />

      <div className="max-w-7xl mx-auto px-0 md:px-4 pb-8">
        {/* Filter Tabs */}
        <div className="px-4 pt-4 md:pt-8 pb-3 flex flex-wrap gap-2 md:gap-4 md:justify-center">
          {[
            { key: 'all', label: '🗺️ All' },
            { key: 'wisata', label: '🏞️ Wisata' },
            { key: 'kuliner', label: '🍜 Kuliner' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === key
                  ? 'bg-pramana-primary text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Map Area & List Wrapper */}
        <div className="md:grid md:grid-cols-3 md:gap-6 md:mt-4">
          
          {/* Map Area */}
          <div className="md:col-span-2 relative mx-4 md:mx-0 rounded-2xl overflow-hidden border border-gray-100 shadow-lg h-[380px] md:h-[600px] z-0">
            <MapContainer 
              center={[-8.1120, 115.0880]} 
              zoom={11} 
              scrollWheelZoom={true} 
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {selectedPin && (
                <RecenterAutomatically position={[selectedPin.latitude, selectedPin.longitude]} />
              )}

              {filteredPins.map((pin) => (
                <Marker
                  key={pin.id}
                  position={[pin.latitude, pin.longitude]}
                  icon={pin.category === 'Wisata Alam' ? wisataIcon : kulinerIcon}
                  eventHandlers={{
                    click: () => handlePinClick(pin),
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold">{pin.name}</p>
                      <p className="text-xs text-gray-500">{pin.category}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-6 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-gray-100 shadow-sm" style={{ zIndex: 1000 }}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[9px] text-gray-600 font-medium">Wisata Alam</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-[9px] text-gray-600 font-medium">Kuliner Lokal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Pin & List */}
          <div className="md:col-span-1 flex flex-col h-full">

            {/* Selected Pin Detail */}
            {selectedPin && (
              <div className="mx-4 md:mx-0 mt-4 md:mt-0 mb-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-md slide-up shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedPin.category === 'Wisata Alam'
                          ? 'bg-pramana-primary/10 text-pramana-primary'
                          : 'bg-pramana-accent/10 text-pramana-accent'
                      }`}>
                        {selectedPin.category}
                      </span>
                      <div className="flex gap-0.5">
                        <span className="text-[10px] text-yellow-500">★</span>
                        <span className="text-[10px] text-gray-500 ml-0.5">
                          {selectedPin.reviews?.length > 0 
                            ? (selectedPin.reviews.reduce((acc, r) => acc + r.rating, 0) / selectedPin.reviews.length).toFixed(1) 
                            : '5.0'}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-pramana-dark text-sm">{selectedPin.name}</h3>
                    <p className="text-xs text-pramana-primary font-semibold mt-0.5">Mulai Rp {selectedPin.price}/orang</p>
                  </div>
                  <button
                    onClick={() => setSelectedPin(null)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/destination/${selectedPin.slug}`}
                    className="flex-1 bg-pramana-primary text-white py-2 rounded-xl text-xs font-bold text-center hover:bg-green-700 transition-colors"
                  >
                    Lihat Detail
                  </Link>
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${selectedPin.latitude},${selectedPin.longitude}`, '_blank')}
                    className="flex-1 border border-pramana-primary text-pramana-primary py-2 rounded-xl text-xs font-bold hover:bg-pramana-primary hover:text-white transition-colors"
                  >
                    Buka di Maps
                  </button>
                </div>
              </div>
            )}

            {/* Location List */}
            <div className="px-4 md:px-0 mt-4 md:mt-0 pb-4 flex-1 overflow-y-auto max-h-[500px]">
              <h3 className="font-bold text-pramana-dark text-sm mb-3">
                {filteredPins.length} Lokasi Ditemukan
              </h3>
              <div className="space-y-2">
                {filteredPins.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => handlePinClick(pin)}
                    className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center gap-3 hover:border-pramana-primary/30 transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      pin.category === 'Wisata Alam' ? 'bg-pramana-primary/10' : 'bg-pramana-accent/10'
                    }`}>
                      <span className="text-base">{pin.category === 'Wisata Alam' ? '🏞' : '🍜'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-pramana-dark text-xs">{pin.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-yellow-500 text-[10px]">★</span>
                        <span className="text-[10px] text-gray-400">
                          {pin.reviews?.length > 0 
                            ? (pin.reviews.reduce((acc, r) => acc + r.rating, 0) / pin.reviews.length).toFixed(1) 
                            : '5.0'}
                        </span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-pramana-primary font-medium">Rp {pin.price}</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MapScreen;