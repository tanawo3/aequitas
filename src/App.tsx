import React, { useEffect, useState } from 'react';
import { Scale, Wallet, Info, CheckCircle2, XCircle, Loader2, ArrowUpRight, Hexagon, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlockchainTx } from './api/useBlockchainTx';
import { DeployScreen } from './ui/DeployScreen';
import { ProtocolView } from './ui/ProtocolView';
import { GenLayerNetwork } from './config/chain';

export default function App() {
  const blockchainTx = useBlockchainTx();
  const {
    address,
    isConnected,
    connect,
    disconnect,
    contractAddress,
    setContractAddress,
    deployContract,
    isDeploying,
    network,
    setNetwork,
    networkName,
    recentTransactions,
    error,
    setError
  } = blockchainTx;

  const [showConfigGuide, setShowConfigGuide] = useState(false);

  useEffect(() => {
    if (contractAddress && contractAddress !== "") {
      blockchainTx.fetchAgreements();
    }
  }, [contractAddress, blockchainTx.fetchAgreements]);

  const handleNetworkChange = (newNetwork: GenLayerNetwork) => {
    setNetwork(newNetwork);
  };

  const getExplorerUrl = (txHash: string) => {
    if (network === 'bradbury') {
      return `https://explorer-bradbury.genlayer.com/transactions/${txHash}`;
    } else if (network === 'studionet') {
      return `https://explorer-studio.genlayer.com/tx/${txHash}`;
    }
    return `http://localhost:4000/transactions/${txHash}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 overflow-x-hidden selection:bg-[#00e5ff] selection:text-black">
      <div className="max-w-7xl w-full mx-auto flex flex-col flex-1 relative z-10">
        
        {/* Top Navigation */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-between items-center glass-panel p-4 rounded-xl mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-lg bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.3)] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              <Hexagon className="w-7 h-7 text-[#00e5ff]" strokeWidth={1.5} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black tracking-widest text-white uppercase font-display glow-text">
                Aequitas
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00e5ff] font-semibold opacity-80">
                Decentralized Adjudication
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 items-center">
            {contractAddress && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-[#00e5ff] uppercase tracking-widest opacity-70">Active Protocol</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-white glow-text">
                    {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                  </span>
                  <button
                    onClick={() => {
                      setContractAddress("");
                      setError(null);
                    }}
                    className="text-[10px] text-[#ff0055] hover:text-white hover:underline transition-colors"
                    title="Reset contract address to deploy a new one"
                  >
                    [RESET]
                  </button>
                </div>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isConnected ? disconnect : connect}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border uppercase tracking-widest transition-all text-xs font-bold ${
                isConnected 
                  ? "bg-[rgba(255,0,85,0.1)] border-[#ff0055] text-[#ff0055] hover:bg-[#ff0055] hover:text-white shadow-[0_0_10px_rgba(255,0,85,0.3)]" 
                  : "bg-[rgba(0,229,255,0.1)] border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black shadow-[0_0_10px_rgba(0,229,255,0.3)]"
              }`}
              title={isConnected ? "Disconnect Wallet" : "Connect Wallet"}
            >
              <Wallet className="w-4 h-4" />
              {isConnected ? (
                <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
              ) : (
                "CONNECT"
              )}
            </motion.button>
            {isConnected && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isDeploying}
                onClick={async () => {
                  localStorage.removeItem('deployed_contract_address');
                  setContractAddress('');
                  await deployContract();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[rgba(0,229,255,0.4)] bg-[rgba(0,229,255,0.1)] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                title="Deploy Contract"
              >
                {isDeploying ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> DEPLOYING...</>
                ) : (
                  <><ArrowUpRight className="w-4 h-4" /> DEPLOY CONTRACT</>
                )}
              </motion.button>
            )}
          </div>
        </motion.header>

        {/* Protocol Control Center */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel p-5 rounded-xl mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#00e5ff] uppercase tracking-widest font-bold opacity-70">Network Uplink</span>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_8px_#00e5ff]"></div>
                  <span className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                    GENLAYER STUDIO NETWORK
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowConfigGuide(!showConfigGuide)}
                className="text-xs text-[#00e5ff] hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors py-2 px-4 rounded-lg bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] hover:border-[#00e5ff]"
              >
                <Info className="w-4 h-4" />
                {showConfigGuide ? "HIDE UPLINK SETUP" : "UPLINK SETUP"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showConfigGuide && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-5 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(0,229,255,0.2)] text-xs space-y-4 text-zinc-300">
                  <h4 className="font-bold text-[#00e5ff] text-sm flex items-center gap-2 uppercase tracking-widest">
                    <AlertTriangle className="w-4 h-4" />
                    Network Configuration Protocol
                  </h4>
                  <p className="opacity-80">
                    To interact with the adjudication engine via Web3 Wallet, align your network parameters:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[rgba(0,0,0,0.5)] p-4 rounded-lg border border-[rgba(0,229,255,0.1)]">
                      <div className="text-white font-bold mb-3 uppercase tracking-widest border-b border-[rgba(0,229,255,0.2)] pb-2">Genlayer Studio Network</div>
                      <div className="space-y-2 opacity-80 font-mono">
                        <div><span className="text-[#00e5ff]">Name:</span> Genlayer Studio Network</div>
                        <div><span className="text-[#00e5ff]">RPC:</span> https://studio.genlayer.com/api</div>
                        <div><span className="text-[#00e5ff]">Chain ID:</span> 61999</div>
                        <div><span className="text-[#00e5ff]">Symbol:</span> GEN</div>
                      </div>
                    </div>
                    <div className="bg-[rgba(0,0,0,0.5)] p-4 rounded-lg border border-[rgba(0,229,255,0.1)]">
                      <div className="text-white font-bold mb-3 uppercase tracking-widest border-b border-[rgba(0,229,255,0.2)] pb-2">Testnet Fuel</div>
                      <p className="opacity-80 mb-4">Acquire testnet GEN tokens to authorize operations:</p>
                      <a 
                        href="https://faucet.genlayer.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#00e5ff] text-black px-4 py-2 rounded uppercase tracking-widest font-bold hover:bg-white transition-colors shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                      >
                        ACCESS FAUCET <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 relative">
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-4 rounded-xl bg-[rgba(255,0,85,0.1)] border border-[#ff0055] text-[#ff0055] text-sm flex flex-col gap-3 shadow-[0_0_15px_rgba(255,0,85,0.2)]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-[#ff0055] flex items-center justify-center font-bold text-xs shrink-0 text-black">!</div>
                  <div className="flex-1">
                    <div className="font-bold mb-1 uppercase tracking-widest text-white">System Error</div>
                    <div className="opacity-90 font-mono">{error}</div>
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="text-[#ff0055] hover:text-white shrink-0"
                  >
                    [CLOSE]
                  </button>
                </div>
                {(error.toLowerCase().includes("not found") || error.toLowerCase().includes("no contract") || error.toLowerCase().includes("0x395b")) && (
                  <div className="pl-9 flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        setContractAddress("");
                        setError(null);
                      }}
                      className="px-4 py-2 bg-[rgba(255,0,85,0.2)] hover:bg-[#ff0055] hover:text-black rounded text-white text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Reset Protocol
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!contractAddress || contractAddress === "" ? (
              <motion.div 
                key="deploy"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <DeployScreen 
                  onDeploy={deployContract} 
                  isDeploying={isDeploying} 
                  address={address} 
                />
                {!isConnected && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 p-4 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[rgba(0,229,255,0.2)] text-center max-w-md backdrop-blur-md"
                  >
                    <p className="text-xs text-[#00e5ff] uppercase tracking-widest opacity-80">
                      Establish secure uplink to <span className="text-white font-bold">{networkName}</span> before deployment.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="protocol"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <ProtocolView 
                  blockchainTx={blockchainTx}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {recentTransactions.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 glass-panel p-6 rounded-xl"
            >
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse"></span>
                Transaction Ledger
              </h3>
              <div className="space-y-4">
                <AnimatePresence>
                  {recentTransactions.map((tx) => (
                    <motion.div 
                      key={tx.hash}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-[rgba(0,229,255,0.15)] hover:border-[rgba(0,229,255,0.4)] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        {tx.status === 'pending' && <Loader2 className="w-5 h-5 text-[#00e5ff] animate-spin" />}
                        {tx.status === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00ffaa] drop-shadow-[0_0_5px_#00ffaa]" />}
                        {tx.status === 'failed' && <XCircle className="w-5 h-5 text-[#ff0055] drop-shadow-[0_0_5px_#ff0055]" />}
                        
                        <div>
                          <span className="text-white font-bold uppercase tracking-widest">{tx.type}</span>
                          {tx.agreement_id && (
                            <span className="ml-2 text-[#00e5ff] opacity-80 font-mono">[{tx.agreement_id}]</span>
                          )}
                          <div className="text-zinc-500 text-[10px] mt-1 font-mono">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <span className="text-zinc-500 font-mono text-xs group-hover:text-[#00e5ff] transition-colors">
                          {tx.hash.slice(0, 14)}...{tx.hash.slice(-10)}
                        </span>
                        
                        <a 
                          href={getExplorerUrl(tx.hash)}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#00e5ff] bg-[rgba(0,229,255,0.1)] hover:bg-[#00e5ff] hover:text-black px-3 py-1.5 rounded transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                        >
                          TRACE <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
}
