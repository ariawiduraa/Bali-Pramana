import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Fix Icon Marker (Wajib di React agar marker muncul)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BaliMap = () => {
    const [locations, setLocations] = useState([]);

    // 1. Koordinat Batas Bali (Barat Laut & Tenggara)
    const boundsBali = [
        [-8.95, 114.3], // Titik bawah kiri (Barat Daya)
        [-8.0, 115.8]   // Titik atas kanan (Timur Laut)
    ];

    // 2. Ambil data dari Laravel API
    useEffect(() => {
        axios.get('/api/bali-locations')
            .then(res => setLocations(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer 
                center={[-8.4095, 115.1889]} // Tengah-tengah Bali
                zoom={10} 
                minZoom={9}  // Biar user gak bisa zoom out sampe liat Jakarta
                maxBounds={boundsBali} 
                maxBoundsViscosity={1.0} // Efek mental saat geser keluar batas
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Mapping marker dari database Laravel */}
                {locations.map(loc => (
                    <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                        <Popup>
                            <strong>{loc.name}</strong> <br />
                            Lokasi ini berada di wilayah Bali.
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default BaliMap;