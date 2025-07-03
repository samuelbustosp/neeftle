import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  ChevronDown,
  ChevronUp,
  Search,
  Pause,
  Play,
  X,
  Minimize2
} from 'lucide-react';

const LogDisplay = ({ logs = [] }) => {
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const demoLogs = [
    { type: 'success', message: 'Transaction confirmed', hash: '0x1a2b...' },
    { type: 'info', message: 'Connecting to network...' },
    { type: 'warning', message: 'High gas fee: 0.05 ETH' },
    { type: 'error', message: 'Connection timeout' },
    { type: 'tx', message: 'NFT minted', hash: '0x5e6f...' },
    { type: 'info', message: 'Wallet connected' }
  ];

  const displayLogs = logs.length > 0 ? logs : demoLogs;

  useEffect(() => {
    if (!isPaused) {
      let filtered = displayLogs;
      
      if (selectedFilter !== 'all') {
        filtered = filtered.filter(log => log.type === selectedFilter);
      }
      
      if (searchTerm) {
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredLogs(filtered);
    }
  }, [displayLogs, selectedFilter, searchTerm, isPaused]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
      case 'tx':
        return <CheckCircle className="w-2.5 h-2.5 text-green-400" />;
      case 'error':
        return <XCircle className="w-2.5 h-2.5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-2.5 h-2.5 text-yellow-400" />;
      case 'info':
        return <Info className="w-2.5 h-2.5 text-blue-400" />;
      default:
        return <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusCounts = () => ({
    all: displayLogs.length,
    success: displayLogs.filter(log => log.type === 'success' || log.type === 'tx').length,
    error: displayLogs.filter(log => log.type === 'error').length,
    warning: displayLogs.filter(log => log.type === 'warning').length,
    info: displayLogs.filter(log => log.type === 'info').length
  });

  const statusCounts = getStatusCounts();

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg text-white hover:scale-110 transition-transform z-50"
      >
        <Terminal className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)] z-50">
      <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl text-white text-xs">
        {/* Header ultra compacto */}
        <div className="flex items-center justify-between p-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded flex items-center justify-center">
              <Terminal className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="font-medium text-xs">Logs</span>
            
            {/* Mini indicators */}
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-green-400 rounded-full"></span>
              <span className="text-green-400">{statusCounts.success}</span>
              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
              <span className="text-red-400">{statusCounts.error}</span>
              <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
              <span className="text-yellow-400">{statusCounts.warning}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-1 rounded transition-colors ${
                isPaused ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}
            >
              {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 bg-white/10 hover:bg-red-500/20 rounded transition-colors text-gray-400 hover:text-red-400"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Contenido expandible */}
        {isExpanded && (
          <>
            {/* Filtros compactos */}
            <div className="flex items-center justify-between p-2 bg-black/20 border-b border-white/10">
              <div className="flex space-x-1">
                {[
                  { key: 'all', label: 'All', count: statusCounts.all },
                  { key: 'success', label: 'OK', count: statusCounts.success },
                  { key: 'error', label: 'Err', count: statusCounts.error },
                  { key: 'warning', label: 'War', count: statusCounts.warning }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedFilter === key 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {label} {count}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-20 bg-white/5 border border-white/10 rounded pl-6 pr-2 py-1 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:w-32 transition-all"
                />
              </div>
            </div>

            {/* Logs ultra compactos */}
            <div className="p-2">
              <div className="bg-black/40 rounded p-2 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-3 text-gray-400">
                    <Terminal className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Sin logs</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredLogs.slice(0, 20).map((log, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getLogIcon(log.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-xs">{log.message}</div>
                          {log.hash && (
                            <div className="text-xs text-gray-500 font-mono truncate">
                              {log.hash}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-xs text-gray-500">
                          {new Date().toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ))}
                    
                    {filteredLogs.length > 20 && (
                      <div className="text-center text-xs text-gray-400 py-1">
                        +{filteredLogs.length - 20} más
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
      `}</style>
    </div>
  );
};

export default LogDisplay;