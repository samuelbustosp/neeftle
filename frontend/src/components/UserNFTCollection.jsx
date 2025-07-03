import React from 'react';
import NFTCard from './NFTCard';

const UserNFTCollection = ({ 
  userNFTs, 
  isLoading, 
  onListNFT, 
  onCancelListing, 
  onListAllNFTs 
}) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-white">
        Mi Colección ({userNFTs.length} NFTs)
      </h2>
      {userNFTs.length > 0 && (
        <button
          onClick={onListAllNFTs}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Listar Todos los NFTs
        </button>
      )}
    </div>

    {isLoading ? (
      <p className="text-gray-400">Cargando tus NFTs...</p>
    ) : userNFTs.length === 0 ? (
      <p className="text-gray-400">No tienes NFTs en tu billetera. ¡Mintea uno!</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userNFTs.map((nft) => (
          <NFTCard
            key={nft.tokenId}
            nft={nft}
            onAction={nft.isListed ? onCancelListing : onListNFT}
            actionType={nft.isListed ? 'cancel' : 'list'}
          />
        ))}
      </div>
    )}
  </div>
);

export default UserNFTCollection;