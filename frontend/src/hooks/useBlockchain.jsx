import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { CONTRACTS, MarketplaceABI, MyNFTABI, MyTokenABI } from '../config/constants';
import { uploadMetadataToPinata, uploadToPinata } from '../services/ipfs';

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

const convertIpfsUriToHttp = (ipfsUri) => {
  if (!ipfsUri) return "";
  if (ipfsUri.startsWith("ipfs://")) {
    let path = ipfsUri.substring(7);
    path = path.replace(/^\/+/, "");
    return `${IPFS_GATEWAY}${path}`;
  }
  return ipfsUri;
};

export const useBlockchain = () => {
  const [state, setState] = useState({
    isConnected: false,
    currentAccount: null,
    mtkBalance: '0.00',
    provider: null,
    signer: null,
    contracts: {}
  });

  const [logs, setLogs] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingMarketplace, setIsLoadingMarketplace] = useState(false);

  // Ref para evitar cargas múltiples
  const loadingRef = useRef(false);

  const addLog = useCallback((message, type = 'info') => {
    const newLog = { message, type, timestamp: Date.now() };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("Necesitas tener MetaMask instalado.");
      addLog("❌ MetaMask no está instalado.", 'error');
      return;
    }

    try {
      addLog("⏳ Solicitando conexión a MetaMask...", 'info');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        addLog("No hay cuentas conectadas.", 'error');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const currentAccount = accounts[0];

      const contracts = {
        myToken: new ethers.Contract(CONTRACTS.MY_TOKEN_ADDRESS, MyTokenABI, signer),
        myNFT: new ethers.Contract(CONTRACTS.MY_NFT_ADDRESS, MyNFTABI, signer),
        marketplace: new ethers.Contract(CONTRACTS.MARKETPLACE_ADDRESS, MarketplaceABI, signer)
      };

      setState({
        isConnected: true,
        currentAccount,
        mtkBalance: '1000.00',
        provider,
        signer,
        contracts
      });

      // Reset refs
      loadingRef.current = false;
      
      addLog("✅ Billetera conectada.", 'success');
      
      // Cargar NFTs inmediatamente después de conectar
      setTimeout(() => {
        loadUserNFTsInternal(provider, currentAccount, contracts);
      }, 100);

    } catch (error) {
      addLog("❌ Error conectando billetera: " + error.message, 'error');
    }
  }, [addLog]);

  // Función interna para cargar NFTs sin dependencias circulares
  const loadUserNFTsInternal = async (provider, currentAccount, contracts, forceReload = false) => {
    if (!provider || !currentAccount || !contracts.myNFT) {
      console.log("❌ Faltan datos para cargar NFTs:", { provider: !!provider, currentAccount: !!currentAccount, contracts: !!contracts.myNFT });
      return;
    }

    if (loadingRef.current && !forceReload) {
      console.log("⏸️ Ya hay una carga en progreso");
      return;
    }

    console.log("🔄 Iniciando carga de NFTs del usuario...");
    loadingRef.current = true;
    setIsLoadingUser(true);

    try {
      const myNFTReadOnly = new ethers.Contract(CONTRACTS.MY_NFT_ADDRESS, MyNFTABI, provider);
      const marketplaceReadOnly = new ethers.Contract(CONTRACTS.MARKETPLACE_ADDRESS, MarketplaceABI, provider);

      const balance = await myNFTReadOnly.balanceOf(currentAccount);
      console.log(`👤 Usuario ${currentAccount} tiene ${balance.toString()} NFTs`);

      const nfts = [];

      for (let i = 0; i < Number(balance); i++) {
        try {
          const tokenId = await myNFTReadOnly.tokenOfOwnerByIndex(currentAccount, i);
          console.log(`🔍 Procesando NFT con ID: ${tokenId.toString()}`);

          const tokenURI = await myNFTReadOnly.tokenURI(tokenId);

          if (!tokenURI || tokenURI.trim() === '') {
            console.log(`⚠️ NFT ID ${tokenId} no tiene tokenURI válido`);
            nfts.push({
              tokenId: tokenId.toString(),
              name: `NFT #${tokenId} (Sin Metadatos)`,
              description: 'Este NFT no tiene metadatos válidos',
              image: '',
              price: "0",
              status: "Sin metadatos",
              isListed: false,
              hasError: true
            });
            continue;
          }

          let metadata = null;
          let metadataError = null;

          try {
            const httpUrl = convertIpfsUriToHttp(tokenURI);
            console.log(`📡 Cargando metadatos desde: ${httpUrl}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const metaResponse = await fetch(httpUrl, {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
              }
            });
            
            clearTimeout(timeoutId);

            if (!metaResponse.ok) {
              throw new Error(`HTTP ${metaResponse.status}: ${metaResponse.statusText}`);
            }

            const contentType = metaResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('La respuesta no es JSON válido');
            }

            metadata = await metaResponse.json();
            console.log(`✅ Metadatos cargados para NFT ${tokenId}:`, metadata);
            
            if (typeof metadata !== 'object' || metadata === null) {
              throw new Error('Metadatos no son un objeto válido');
            }

          } catch (error) {
            metadataError = error.message;
            console.log(`⚠️ Error cargando metadatos para NFT ID ${tokenId}: ${error.message}`);
            
            metadata = {
              name: `NFT #${tokenId}`,
              description: 'Error al cargar metadatos desde IPFS',
              image: ''
            };
          }

          let isListed = false;
          let price = "0";

          // 1. Intentar obtener precio desde el marketplace
          try {
            if (marketplaceReadOnly) {
              const listing = await marketplaceReadOnly.idToListing(tokenId);
              isListed = listing.isListed;
              if (isListed) {
                price = ethers.formatUnits(listing.price, 18);
              }
            }
          } catch (error) {
            console.log(`⚠️ Error verificando listado para NFT ID ${tokenId}: ${error.message}`);
          }

          // ✅ 2. Si no está listado, intentar obtener el precio desde los metadatos
          if (!isListed && metadata?.attributes) {
            const priceAttr = metadata.attributes.find(attr => attr.trait_type === "Listing Price");
            if (priceAttr && priceAttr.value) {
              price = priceAttr.value.toString(); // o `String(priceAttr.value)`
            }
          }


          const nftData = {
            tokenId: tokenId.toString(),
            name: metadata.name || `NFT #${tokenId}`,
            description: metadata.description || 'Sin descripción',
            image: metadata.image ? convertIpfsUriToHttp(metadata.image) : '',
            price,
            status: isListed ? `Listado por ti por ${price} MTK` : "No listado",
            isListed,
            hasError: !!metadataError,
            errorMessage: metadataError,
            rawTokenURI: tokenURI
          };

          nfts.push(nftData);
          console.log(`✅ NFT ${tokenId} procesado correctamente:`, nftData);

        } catch (error) {
          console.log(`❌ Error procesando NFT en índice ${i}: ${error.message}`);
          continue;
        }
      }

      console.log(`🎉 Carga completada. Total NFTs procesados: ${nfts.length}`);
      console.log("📋 NFTs cargados:", nfts);

      setUserNFTs(nfts);
      
      const errorsCount = nfts.filter(nft => nft.hasError).length;
      const successCount = nfts.length - errorsCount;
      
      addLog(
        `✅ NFTs del usuario cargados. Total: ${nfts.length} (${successCount} exitosos, ${errorsCount} con errores)`, 
        errorsCount > 0 ? 'warning' : 'success'
      );

    } catch (error) {
      console.error("❌ Error crítico cargando NFTs del usuario:", error);
      addLog("❌ Error crítico cargando NFTs del usuario: " + error.message, 'error');
    } finally {
      setIsLoadingUser(false);
      loadingRef.current = false;
    }
  };

  // Función pública para cargar NFTs
  const loadUserNFTs = useCallback(async (forceReload = false) => {
    console.log("🔄 loadUserNFTs llamado - Estado actual:", {
      isConnected: state.isConnected,
      currentAccount: state.currentAccount,
      hasProvider: !!state.provider,
      hasContracts: !!state.contracts.myNFT,
      forceReload
    });

    if (!state.isConnected || !state.currentAccount || !state.provider || !state.contracts.myNFT) {
      console.log("❌ No se puede cargar NFTs - faltan datos de conexión");
      return;
    }

    await loadUserNFTsInternal(state.provider, state.currentAccount, state.contracts, forceReload);
  }, [state.isConnected, state.currentAccount, state.provider, state.contracts, addLog]);

  const addHardhatNetwork = useCallback(async () => {
    if (!window.ethereum) {
      alert("No tienes MetaMask instalado.");
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x7A69',
          chainName: 'Hardhat Localhost',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['http://127.0.0.1:8545'],
          blockExplorerUrls: []
        }]
      });
      addLog("✅ Red Hardhat añadida a MetaMask.", 'success');
    } catch (error) {
      addLog("❌ Error añadiendo red: " + error.message, 'error');
    }
  }, [addLog]);

  const mintNFT = useCallback(async (formData) => {
    if (!state.isConnected) {
      throw new Error("Conecta tu billetera primero");
    }

    try {
      addLog(`⏳ Subiendo imagen a IPFS...`, 'info');

      const imageCID = await uploadToPinata(formData.image, formData.image.name);

      if (!imageCID || imageCID.length < 10) {
        throw new Error("La imagen no se subió correctamente a IPFS.");
      }

      const imageUrl = `ipfs://${imageCID}`;
      addLog(`✅ Imagen subida correctamente: ${imageUrl}`, 'success');

      addLog(`⏳ Subiendo metadatos a IPFS...`, 'info');

      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        external_url: "",
      
        attributes: [
          {
            trait_type: "Rarity",
            value: formData.rarity || "Common"
          },
          {
            trait_type: "Creator",
            value: state.currentAccount
          },
          {
            trait_type: "Listing Price",
            value: formData.price,
            display_type: "number"
          },
          {
            trait_type: "Creation Date",
            value: Math.floor(Date.now() / 1000),
            display_type: "date"
          }
        ]
      };

      console.log("📦 Metadata a subir:", JSON.stringify(metadata, null, 2));
      const metadataCID = await uploadMetadataToPinata(metadata);

      if (!metadataCID || metadataCID.length < 10) {
        throw new Error("Los metadatos no se subieron correctamente a IPFS.");
      }

      const tokenURI = `ipfs://${metadataCID}`;
      addLog(`✅ Metadata subida: ${tokenURI}`, 'success');

      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${metadataCID}`);
      if (!response.ok) {
        throw new Error("La metadata no está disponible públicamente en IPFS.");
      }

      addLog(`⏳ Minteando NFT en blockchain...`, 'info');

      const tx = await state.contracts.myNFT.safeMint(state.currentAccount, tokenURI);
      await tx.wait();

      addLog(`🎉 NFT '${formData.name}' minteado exitosamente!`, 'success');

      // Recargar NFTs después del mint
      setTimeout(() => {
        loadUserNFTs(true);
      }, 2000);

    } catch (error) {
      addLog(`❌ Error minteando NFT: ${error.message}`, 'error');
      throw error;
    }
  }, [state.isConnected, state.currentAccount, state.contracts.myNFT, addLog, loadUserNFTs]);

  const loadMarketplaceNFTs = useCallback(async () => {
    if (isLoadingMarketplace || !state.contracts.marketplace) return;
    setIsLoadingMarketplace(true);

    try {
      const tokenIds = await state.contracts.marketplace.getListedTokenIds();

      const listedItems = await Promise.all(tokenIds.map(async (tokenId) => {
        const item = await state.contracts.marketplace.listedItems(tokenId);
        const tokenURI = await state.contracts.myNFT.tokenURI(tokenId);
        const response = await fetch(convertIpfsUriToHttp(tokenURI));
        const metadata = await response.json();

        return {
          tokenId: tokenId.toString(),
          name: metadata.name,
          description: metadata.description,
          image: convertIpfsUriToHttp(metadata.image),
          price: ethers.formatUnits(item.price, 18),
          seller: item.seller,
          status: item.isListed ? 'Disponible' : 'No disponible'
        };
      }));
      
      setMarketplaceNFTs(listedItems);
      addLog(`✅ Marketplace cargado con ${listedItems.length} NFTs listados.`, 'success');

    } catch (error) {
      addLog("❌ Error cargando marketplace: " + error.message, 'error');
    } finally {
      setIsLoadingMarketplace(false);
    }
  }, [isLoadingMarketplace, addLog, state.contracts]);

  const listNFT = useCallback(async (tokenId, price) => {
    if (!state.isConnected) {
      addLog("❌ Conecta tu billetera primero.", "error");
      return;
    }

    try {
      addLog(`⏳ Verificando aprobaciones para NFT ID ${tokenId}...`, "info");

      // Verificar si el marketplace ya está aprobado para todos los tokens
      const isApprovedForAll = await state.contracts.myNFT.isApprovedForAll(
        state.currentAccount,
        CONTRACTS.MARKETPLACE_ADDRESS
      );

      // Verificar si el token específico ya está aprobado
      const approvedAddress = await state.contracts.myNFT.getApproved(tokenId);
      const isTokenApproved = approvedAddress.toLowerCase() === CONTRACTS.MARKETPLACE_ADDRESS.toLowerCase();

      // Si no está aprobado de ninguna manera, hacer ambas aprobaciones
      if (!isApprovedForAll && !isTokenApproved) {
        addLog("🔐 Aprobando Marketplace para transferir tus NFTs...", "info");
        
        // Primero aprobar el token específico
        const approveTx = await state.contracts.myNFT.approve(CONTRACTS.MARKETPLACE_ADDRESS, tokenId);
        await approveTx.wait();
        addLog("✅ NFT específico aprobado.", "success");

        // Luego aprobar para todos (opcional pero recomendado para futuros listados)
        const approveAllTx = await state.contracts.myNFT.setApprovalForAll(CONTRACTS.MARKETPLACE_ADDRESS, true);
        await approveAllTx.wait();
        addLog("✅ Marketplace aprobado para todos los NFTs.", "success");
      } else if (!isTokenApproved) {
        // Si solo falta la aprobación del token específico
        addLog("🔐 Aprobando NFT específico para el Marketplace...", "info");
        const approveTx = await state.contracts.myNFT.approve(CONTRACTS.MARKETPLACE_ADDRESS, tokenId);
        await approveTx.wait();
        addLog("✅ NFT específico aprobado.", "success");
      } else {
        addLog("✅ NFT ya está aprobado para el Marketplace.", "success");
      }

      addLog(`⏳ Listando NFT ID ${tokenId} por ${price} MTK...`, "info");

      const priceParsed = ethers.parseUnits(price.toString(), 18);
      const tx = await state.contracts.marketplace.listItem(tokenId, priceParsed);
      await tx.wait();

      addLog(`🎉 NFT ID ${tokenId} listado exitosamente!`, "success");

      loadUserNFTs(true);
      loadMarketplaceNFTs();

    } catch (error) {
      addLog(`❌ Error listando NFT: ${error.message}`, "error");
      console.error("Error detallado:", error);
    }
  }, [state.isConnected, state.contracts.marketplace, state.contracts.myNFT, state.currentAccount, addLog, loadUserNFTs, loadMarketplaceNFTs]);

  const cancelListing = useCallback(async (tokenId) => {
    if (!state.contracts.marketplace) {
      addLog("❌ Contrato Marketplace no disponible.", 'error');
      return;
    }

    try {
      addLog(`⏳ Cancelando listado para NFT ID ${tokenId}...`, 'info');

      const tx = await state.contracts.marketplace.cancelListing(tokenId);
      await tx.wait();

      addLog(`🎉 Listado para NFT ID ${tokenId} cancelado.`, 'success');

      loadUserNFTs(true);
      loadMarketplaceNFTs();
    } catch (error) {
      addLog(`❌ Error cancelando listado: ${error.message}`, 'error');
    }
  }, [state.contracts.marketplace, addLog, loadUserNFTs, loadMarketplaceNFTs]);

  const buyNFT = useCallback(async (tokenId, price) => {
    if (!state.contracts.marketplace || !state.contracts.myToken) {
      addLog("❌ Contratos no inicializados correctamente.", 'error');
      return;
    }

    try {
      addLog(`⏳ Comprando NFT ID ${tokenId} por ${price} MTK...`, 'info');

      const approveTx = await state.contracts.myToken.approve(CONTRACTS.MARKETPLACE_ADDRESS, ethers.parseUnits(price.toString(), 18));
      await approveTx.wait();
      addLog("✅ Tokens MTK aprobados para el Marketplace.", 'success');

      const tx = await state.contracts.marketplace.buyItem(tokenId);
      await tx.wait();

      addLog(`🎉 NFT ID ${tokenId} comprado exitosamente!`, 'success');

      loadUserNFTs(true);
      loadMarketplaceNFTs();
    } catch (error) {
      addLog(`❌ Error comprando NFT: ${error.message}`, 'error');
    }
  }, [state.contracts.marketplace, state.contracts.myToken, addLog, loadUserNFTs, loadMarketplaceNFTs]);

  const listAllUserNFTs = useCallback(async () => {
    if (!state.contracts.myNFT || !state.contracts.marketplace) return;

    try {
      addLog("⏳ Intentando listar todos los NFTs no listados...", 'info');

      const balance = await state.contracts.myNFT.balanceOf(state.currentAccount);
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await state.contracts.myNFT.tokenOfOwnerByIndex(state.currentAccount, i);

        // Aprobar el token específico
        const approveTx = await state.contracts.myNFT.approve(CONTRACTS.MARKETPLACE_ADDRESS, tokenId);
        await approveTx.wait();

        const price = ethers.parseUnits("100", 18);
        const listTx = await state.contracts.marketplace.listItem(tokenId, price);
        await listTx.wait();

        addLog(`✅ NFT ID ${tokenId} listado por 100 MTK`, 'success');
      }

      addLog("🎉 Todos los NFTs no listados han sido listados.", 'success');
      loadUserNFTs(true);
      loadMarketplaceNFTs();
    } catch (error) {
      addLog(`❌ Error listando NFTs: ${error.message}`, 'error');
    }
  }, [state.contracts.myNFT, state.contracts.marketplace, state.currentAccount, addLog, loadUserNFTs, loadMarketplaceNFTs]);

  const disconnectWallet = useCallback(() => {
    setState({
      isConnected: false,
      currentAccount: null,
      mtkBalance: '0.00',
      provider: null,
      signer: null,
      contracts: {}
    });

    setUserNFTs([]);
    setMarketplaceNFTs([]);
    setLogs([]);
    loadingRef.current = false;
    addLog("🚪 Sesión cerrada. Se desconectó la wallet.", 'info');
  }, [addLog]);
  

  // Log del estado actual para debugging
  useEffect(() => {
    console.log("🔍 Estado actual del blockchain:", {
      isConnected: state.isConnected,
      currentAccount: state.currentAccount,
      userNFTsCount: userNFTs.length,
      hasProvider: !!state.provider,
      hasContracts: !!state.contracts.myNFT,
      isLoadingUser
    });
  }, [state.isConnected, state.currentAccount, userNFTs.length, state.provider, state.contracts.myNFT, isLoadingUser]);

  return {
    ...state,
    logs,
    userNFTs,
    marketplaceNFTs,
    isLoadingUser,
    isLoadingMarketplace,
    connectWallet,
    addHardhatNetwork,
    mintNFT,
    loadUserNFTs,
    loadMarketplaceNFTs,
    listNFT,
    cancelListing,
    buyNFT,
    listAllUserNFTs,
    disconnectWallet
  };
};