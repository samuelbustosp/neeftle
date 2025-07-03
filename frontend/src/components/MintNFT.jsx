import React, { useState } from 'react';
import { LISTING_PRICE_DEFAULT } from '../config/constants';

const MintNFT = ({ onMintNFT, isConnected }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    price: LISTING_PRICE_DEFAULT,
    rarity: 'Common' // ✅ Agregado campo rarity
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        price: LISTING_PRICE_DEFAULT,
        rarity: 'Common' // ✅ Resetear rarity también
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Crear NFT</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          {showForm ? 'Ocultar Formulario' : 'Mostrar Formulario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del NFT
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa el nombre de tu NFT"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe tu NFT"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Imagen del NFT
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              required
            />
          </div>

          {/* ✅ Nuevo campo para Rarity */}
          <div>
            <label htmlFor="rarity" className="block text-sm font-medium text-gray-300 mb-2">
              Rareza
            </label>
            <select
              id="rarity"
              name="rarity"
              value={formData.rarity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Common">Común</option>
              <option value="Uncommon">Poco común</option>
              <option value="Rare">Raro</option>
              <option value="Epic">Épico</option>
              <option value="Legendary">Legendario</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
              Precio de Listado (MTK)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="1"
              step="1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Precio en MTK"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold"
            >
              {isSubmitting ? 'Creando NFT...' : 'Crear NFT'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MintNFT;