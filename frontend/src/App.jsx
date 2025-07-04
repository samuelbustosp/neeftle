import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WalletConnection from './components/wallet/WalletConnection';
import MintNFT from './components/nft/MintNFT';
import UserNFTCollection from './components/nft/UserNFTCollection';
import Marketplace from './components/nft/MarketPlace';
import { useBlockchain } from './hooks/useBlockchain';
import PrivateLayout from './components/layout/PrivateLayout';
import WalletInfo from './components/wallet/WalletInfo';

const App = () => {
  const blockchain = useBlockchain();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            blockchain.isConnected ? (
              <Navigate to="/marketplace" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        <Route path="/login" element={
          <WalletConnection
            isConnected={blockchain.isConnected}
            currentAccount={blockchain.currentAccount}
            mtkBalance={blockchain.mtkBalance}
            onConnect={blockchain.connectWallet}
            onAddNetwork={blockchain.addHardhatNetwork}
          />
        }/>


        {blockchain.isConnected && (
        <Route
          element={
            <PrivateLayout
              currentAccount={blockchain.currentAccount}
              onLogout={blockchain.disconnectWallet}
              logs={blockchain.logs}
              mtkBalance={blockchain.mtkBalance}
            />
          }
        >
          <Route path="/marketplace" element={
            <Marketplace
              marketplaceNFTs={blockchain.marketplaceNFTs}
              isLoading={blockchain.isLoadingMarketplace}
              onBuyNFT={blockchain.buyNFT}
              onCancelListing={blockchain.cancelListing}
              onLoadMarketplace={blockchain.loadMarketplaceNFTs}
              currentAccount={blockchain.currentAccount}
            />
          } />

          <Route path="/mint" element={
            <MintNFT onMintNFT={blockchain.mintNFT} isConnected />
          } />

          <Route path="/collection" element={
            <UserNFTCollection
              userNFTs={blockchain.userNFTs}
              isLoading={blockchain.isLoadingUser}
              onListNFT={blockchain.listNFT}
              onCancelListing={blockchain.cancelListing}
              onListAllNFTs={blockchain.listAllUserNFTs}
               onBurnNFT={blockchain.burnNFT}
            />
          } />

          <Route path='/account' element={
            <WalletInfo 
              account={blockchain.currentAccount} 
              mtkBalance={blockchain.mtkBalance}
              activityLogs={blockchain.activityLogs}
            />
          }/>
        </Route>
      )}
      </Routes>

          
    </Router>
  );
};

export default App;
