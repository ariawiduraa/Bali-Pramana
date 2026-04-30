import React, { useState } from 'react';
import MobileLayout from '../Layouts/MobileLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';

const MyBusiness = ({ destinations }) => {
  const { auth } = usePage().props;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    category: 'Wisata Alam',
    location: '',
    description: '',
    rules: '',
    price: 0,
    contact_number: '',
    latitude: '',
    longitude: '',
    images: [],
    image_360: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      post(`/destinations/${editingId}?_method=PUT`, {
        forceFormData: true,
        onSuccess: () => {
          setEditingId(null);
          setIsAdding(false);
          reset();
        },
      });
    } else {
      post('/destinations', {
        forceFormData: true,
        onSuccess: () => {
          setIsAdding(false);
          reset();
        },
      });
    }
  };

  const handleEdit = (dest) => {
    setData({
      name: dest.name,
      category: dest.category,
      location: dest.location,
      description: dest.description,
      rules: dest.rules || '',
      price: dest.price,
      contact_number: dest.contact_number || '',
      latitude: dest.latitude || '',
      longitude: dest.longitude || '',
      images: [],
      image_360: null,
    });
    setEditingId(dest.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus bisnis ini? Semua data dan foto akan dihapus.')) {
      router.delete(`/destinations/${id}`);
    }
  };

  const handleDeleteImage = (imageId) => {
    if (confirm('Hapus foto ini?')) {
      router.delete(`/destination-images/${imageId}`);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pramana-primary focus:ring-2 focus:ring-pramana-primary/20 bg-gray-50";
  const labelClass = "block text-xs font-semibold text-pramana-dark mb-1.5";

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('database/images/')) {
      return '/db-images/' + path.replace('database/images/', '');
    }
    return `/storage/${path}`;
  };

  return (
    <MobileLayout>
      <Head title="My Business - Bali Pramana" />
      
      <div className="p-5 max-w-2xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-black text-pramana-dark text-xl">My Business</h1>
            <p className="text-gray-400 text-xs">Kelola destinasi wisata dan kuliner Anda</p>
          </div>
          {!isAdding && (
            <button 
              onClick={() => { setIsAdding(true); setEditingId(null); reset(); }}
              className="bg-pramana-primary text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              + Tambah Baru
            </button>
          )}
        </div>

        {isAdding ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-pramana-dark mb-4">{editingId ? 'Edit Bisnis' : 'Tambah Bisnis/Destinasi Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Nama Tempat / Bisnis</label>
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} placeholder="Contoh: Warung Siobak Singaraja" />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className={labelClass}>Kategori</label>
                <select value={data.category} onChange={e => setData('category', e.target.value)} className={inputClass}>
                  <option value="Wisata Alam">Wisata Alam</option>
                  <option value="Kuliner Lokal">Kuliner Lokal</option>
                </select>
                {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
              </div>
              <div>
                <label className={labelClass}>Lokasi (Area)</label>
                <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} className={inputClass} placeholder="Contoh: Buleleng" />
                {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Latitude</label>
                  <input type="text" value={data.latitude} onChange={e => setData('latitude', e.target.value)} className={inputClass} placeholder="Contoh: -8.1120" />
                  {errors.latitude && <div className="text-red-500 text-xs mt-1">{errors.latitude}</div>}
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Longitude</label>
                  <input type="text" value={data.longitude} onChange={e => setData('longitude', e.target.value)} className={inputClass} placeholder="Contoh: 115.0880" />
                  {errors.longitude && <div className="text-red-500 text-xs mt-1">{errors.longitude}</div>}
                </div>
              </div>
              <div>
                <label className={labelClass}>Foto Bisnis / Tempat (bisa lebih dari 1)</label>
                <input 
                  type="file" 
                  onChange={e => setData('images', Array.from(e.target.files))} 
                  className={inputClass} 
                  accept="image/*" 
                  multiple 
                />
                {errors.images && <div className="text-red-500 text-xs mt-1">{errors.images}</div>}
              </div>

              {data.category === 'Wisata Alam' && (
                <div>
                  <label className={labelClass}>Foto 360° (Opsional - khusus Wisata Alam)</label>
                  <input 
                    type="file" 
                    onChange={e => setData('image_360', e.target.files[0])} 
                    className={inputClass} 
                    accept="image/*" 
                  />
                  <p className="text-gray-400 text-[10px] mt-1">Upload foto panorama/360° untuk pengalaman virtual</p>
                  {errors.image_360 && <div className="text-red-500 text-xs mt-1">{errors.image_360}</div>}
                </div>
              )}

              <div>
                <label className={labelClass}>Deskripsi Singkat</label>
                <textarea value={data.description} onChange={e => setData('description', e.target.value)} className={inputClass} rows="3" placeholder="Jelaskan tentang tempat ini..."></textarea>
                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
              </div>
              <div>
                <label className={labelClass}>Aturan / Peraturan (Opsional)</label>
                <textarea value={data.rules} onChange={e => setData('rules', e.target.value)} className={inputClass} rows="2" placeholder="Contoh: Dilarang membuang sampah sembarangan..."></textarea>
                {errors.rules && <div className="text-red-500 text-xs mt-1">{errors.rules}</div>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Harga Rata-Rata (Rp)</label>
                  <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className={inputClass} />
                  {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Nomor Telepon (WhatsApp)</label>
                  <input type="text" value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} className={inputClass} placeholder="Contoh: 08123456789" />
                  {errors.contact_number && <div className="text-red-500 text-xs mt-1">{errors.contact_number}</div>}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={processing} className="flex-1 bg-pramana-primary text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                  {processing ? 'Menyimpan...' : editingId ? 'Update & Ajukan Ulang' : 'Simpan & Ajukan'}
                </button>
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); reset(); }} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-sm font-bold">
                  Batal
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {destinations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm">Belum ada bisnis yang ditambahkan.</p>
              </div>
            ) : (
              destinations.map(dest => (
                <div key={dest.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {dest.images && dest.images.length > 0 ? (
                        <img src={getImageUrl(dest.images[0].image_path)} alt={dest.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🏪</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-pramana-dark">{dest.name}</h3>
                      <p className="text-xs text-gray-400 mb-1">{dest.category} • {dest.location}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dest.status === 'approved' ? 'bg-green-100 text-green-700' :
                          dest.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {dest.status.toUpperCase()}
                        </span>
                        {dest.images && dest.images.length > 0 && (
                          <span className="text-[10px] text-gray-400">{dest.images.length} foto</span>
                        )}
                      </div>
                      {dest.contact_number && (
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                          📞 {dest.contact_number}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Images thumbnails */}
                  {dest.images && dest.images.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {dest.images.map(img => (
                        <div key={img.id} className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                          <img src={getImageUrl(img.image_path)} alt="" className="w-full h-full object-cover" />
                          {img.is_360 && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[7px] px-1 rounded-bl">360°</div>
                          )}
                          <button 
                            onClick={() => handleDeleteImage(img.id)} 
                            className="absolute bottom-0 right-0 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-tl"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => handleEdit(dest)} className="flex-1 text-xs font-bold text-pramana-primary border border-pramana-primary py-2 rounded-xl hover:bg-pramana-primary hover:text-white transition-colors">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(dest.id)} className="flex-1 text-xs font-bold text-red-500 border border-red-300 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default MyBusiness;
