import { useState } from 'react';
import { Plus, X, Upload, Palette, Tag, DollarSign, FileText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MintNFT = ({ onMintNFT, isConnected }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    price: '',
    rarity: 'Common'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    
    if (type === 'file') {
      if (files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Crear preview de imagen
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.image || !formData.price) {
      alert('Por favor, rellena todos los campos y selecciona una imagen.');
      return;
    }
    console.log("Mint NFT con datos:", {
      ...formData,
      price: Number(formData.price)
    });

    setIsSubmitting(true);
    try {
      await onMintNFT({
        ...formData,
        price: Number(formData.price)
      });
      setFormData({
        name: '',
        description: '',
        image: null,
        price: '',
        rarity: 'Common'
      });
      setImagePreview(null);
      navigate('/collection')
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Common': return 'from-gray-500 to-gray-600';
      case 'Uncommon': return 'from-green-500 to-green-600';
      case 'Rare': return 'from-blue-500 to-blue-600';
      case 'Epic': return 'from-purple-500 to-purple-600';
      case 'Legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!isConnected) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda */}
                <div className="space-y-6">
                  {/* Nombre del NFT */}
                  <div>
                    <label htmlFor="name" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                      <Tag className="w-4 h-4" />
                      <span>Nombre del NFT</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Ingresa el nombre de tu NFT"
                      required
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label htmlFor="description" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                      <FileText className="w-4 h-4" />
                      <span>Descripción</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Describe tu NFT"
                      required
                    />
                  </div>

                  {/* Rareza */}
                  <div>
                    <label htmlFor="rarity" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                      <Star className="w-4 h-4" />
                      <span>Rareza</span>
                    </label>
                    <select
                      id="rarity"
                      name="rarity"
                      value={formData.rarity}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="Common" className="bg-slate-800">Común</option>
                      <option value="Uncommon" className="bg-slate-800">Poco común</option>
                      <option value="Rare" className="bg-slate-800">Raro</option>
                      <option value="Epic" className="bg-slate-800">Épico</option>
                      <option value="Legendary" className="bg-slate-800">Legendario</option>
                      
                    </select>
                    <div className="mt-2">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(formData.rarity)} text-white`}>
                        {formData.rarity === 'Common' ? 'Común' : 
                         formData.rarity === 'Uncommon' ? 'Poco común' : 
                         formData.rarity === 'Rare' ? 'Raro' : 
                         formData.rarity === 'Epic' ? 'Épico' : 'Legendario'}
                      </div>
                    </div>
                  </div>

                  {/* Precio */}
                  <div>
                    <label htmlFor="price" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                      <DollarSign className="w-4 h-4" />
                      <span>Precio de Listado (MTK)</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="1"
                      step="1"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Precio en MTK"
                      required
                    />
                  </div>
                </div>

                {/* Columna derecha - Upload de imagen */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="image" className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                      <Upload className="w-4 h-4" />
                      <span>Imagen del NFT</span>
                    </label>
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      
                      {imagePreview ? (
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
                            <Palette className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-all duration-300">
                          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-purple-400" />
                          </div>
                          <p className="text-gray-300 mb-2">Arrastra y suelta tu imagen aquí</p>
                          <p className="text-gray-500 text-sm">o haz clic para seleccionar</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Card */}
                  {(formData.name || formData.description || imagePreview) && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Vista Previa</h3>
                      <div className="bg-white/5 rounded-lg p-4 space-y-3">
                        {imagePreview && (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-white">{formData.name || 'Nombre del NFT'}</h4>
                          <p className="text-gray-400 text-sm">{formData.description || 'Descripción del NFT'}</p>
                          {formData.price && (
                            <p className="text-purple-400 font-bold mt-2">{formData.price} MTK</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex cursor-pointer items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando NFT...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Crear NFT</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 cursor-pointer py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
};

export default MintNFT;