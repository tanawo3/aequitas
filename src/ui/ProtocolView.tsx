import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlockchainTx } from '../api/useBlockchainTx';
import { FileText, Gavel, RefreshCw, ArrowRight, Activity, Cpu, Database, Hexagon, Zap } from 'lucide-react';

export const ProtocolView: React.FC<{ blockchainTx: ReturnType<typeof useBlockchainTx> }> = ({ blockchainTx }) => {
  const [agreementId, setAgreementId] = useState('');
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [valueLocked, setValueLocked] = useState('');
  const [strictConditions, setStrictConditions] = useState('');
  
  const [viewMode, setViewMode] = useState<'register' | 'adjudicate'>('register');
  
  const [selectedAgreementId, setSelectedAgreementId] = useState('');
  const [payloadA, setPayloadA] = useState('');
  const [payloadB, setPayloadB] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementId || !partyA || !partyB || !valueLocked || !strictConditions) return;
    await blockchainTx.registerAgreement(agreementId, partyA, partyB, parseFloat(valueLocked), strictConditions);
    setAgreementId(''); setPartyA(''); setPartyB(''); setValueLocked(''); setStrictConditions('');
  };

  const handleAdjudicate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgreementId || !payloadA || !payloadB) return;
    await blockchainTx.adjudicate(selectedAgreementId, payloadA, payloadB);
    setPayloadA(''); setPayloadB(''); setSelectedAgreementId('');
  };

  return (
    <div className="w-full flex flex-col gap-6 font-mono text-sm">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 glass-panel rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[rgba(112,0,255,0.2)] border border-[#7000ff] flex items-center justify-center">
            <Gavel className="w-5 h-5 text-[#7000ff]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white font-display">Adjudication Engine</h2>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 p-1 bg-[rgba(0,0,0,0.5)] rounded-lg border border-[rgba(0,229,255,0.2)]">
          <button 
            onClick={() => setViewMode('register')}
            className={`px-6 py-2 rounded uppercase tracking-wider text-xs transition-all font-bold ${viewMode === 'register' ? 'bg-[rgba(0,229,255,0.2)] text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'text-zinc-500 hover:text-white'}`}
          >
            New Agreement
          </button>
          <button 
            onClick={() => setViewMode('adjudicate')}
            className={`px-6 py-2 rounded uppercase tracking-wider text-xs transition-all font-bold ${viewMode === 'adjudicate' ? 'bg-[rgba(112,0,255,0.2)] text-[#b026ff] shadow-[0_0_10px_rgba(112,0,255,0.3)]' : 'text-zinc-500 hover:text-white'}`}
          >
            Adjudicate
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 glass-panel rounded-xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(0,229,255,0.1)] rounded-bl-full blur-3xl pointer-events-none" />
          
          <h3 className="text-[#00e5ff] font-bold uppercase tracking-widest mb-6 border-b border-[rgba(0,229,255,0.2)] pb-3 flex items-center gap-2">
            <Hexagon className="w-4 h-4" />
            {viewMode === 'register' ? 'Register Construct' : 'Trigger Adjudication'}
          </h3>
          
          <AnimatePresence mode="wait">
            {viewMode === 'register' && (
              <motion.form 
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRegister} 
                className="space-y-5 relative z-10"
              >
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Identifier</label>
                  <input type="text" value={agreementId} onChange={e => setAgreementId(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(0,229,255,0.2)] rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all" placeholder="AGR-00X" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Party A</label>
                    <input type="text" value={partyA} onChange={e => setPartyA(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(0,229,255,0.2)] rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all" placeholder="Address/ID" required />
                  </div>
                  <div>
                    <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Party B</label>
                    <input type="text" value={partyB} onChange={e => setPartyB(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(0,229,255,0.2)] rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all" placeholder="Address/ID" required />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Value Locked</label>
                  <input type="number" value={valueLocked} onChange={e => setValueLocked(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(0,229,255,0.2)] rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all" placeholder="Amount" required />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Strict Conditions</label>
                  <textarea value={strictConditions} onChange={e => setStrictConditions(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(0,229,255,0.2)] rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all h-28 resize-none font-sans" placeholder="Execution logic criteria..." required />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-[rgba(0,229,255,0.1)] border border-[#00e5ff] text-[#00e5ff] font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-[#00e5ff] hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  Commit <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.form>
            )}

            {viewMode === 'adjudicate' && (
              <motion.form 
                key="adjudicate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleAdjudicate} 
                className="space-y-5 relative z-10"
              >
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Target Identifier</label>
                  <select value={selectedAgreementId} onChange={e => setSelectedAgreementId(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(112,0,255,0.4)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#b026ff] focus:shadow-[0_0_10px_rgba(112,0,255,0.3)] transition-all" required>
                    <option value="" className="bg-black">Select active agreement...</option>
                    {blockchainTx.agreements.filter(a => a.state === 'PENDING_RESOLUTION').map(a => (
                      <option key={a.agreement_id} value={a.agreement_id} className="bg-black">{a.agreement_id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Party A Payload</label>
                  <textarea value={payloadA} onChange={e => setPayloadA(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(112,0,255,0.4)] rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#b026ff] focus:shadow-[0_0_10px_rgba(112,0,255,0.3)] transition-all h-28 resize-none font-sans" placeholder="Data trace A..." required />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase text-[10px] tracking-widest mb-2 font-bold">Party B Payload</label>
                  <textarea value={payloadB} onChange={e => setPayloadB(e.target.value)} className="w-full bg-[rgba(0,0,0,0.6)] border border-[rgba(112,0,255,0.4)] rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#b026ff] focus:shadow-[0_0_10px_rgba(112,0,255,0.3)] transition-all h-28 resize-none font-sans" placeholder="Data trace B..." required />
                </div>
                <motion.button 
                  whileHover={!blockchainTx.isEvaluating ? { scale: 1.02 } : {}}
                  whileTap={!blockchainTx.isEvaluating ? { scale: 0.98 } : {}}
                  type="submit" 
                  disabled={blockchainTx.isEvaluating} 
                  className="w-full bg-[rgba(112,0,255,0.1)] border border-[#b026ff] text-[#b026ff] font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-[#b026ff] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {blockchainTx.isEvaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                  {blockchainTx.isEvaluating ? 'PROCESSING' : 'EXECUTE ADJUDICATION'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 glass-panel rounded-xl flex flex-col h-[650px] relative overflow-hidden"
        >
          <div className="flex justify-between items-center p-5 border-b border-[rgba(0,229,255,0.15)] bg-[rgba(0,0,0,0.2)]">
            <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2 font-display">
              <Database className="w-4 h-4 text-[#00e5ff]" />
              On-Chain Ledger
            </h3>
            <motion.button 
              whileHover={{ rotate: 180 }}
              onClick={blockchainTx.fetchAgreements} 
              disabled={blockchainTx.isFetching} 
              className="text-[#00e5ff] hover:text-white transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${blockchainTx.isFetching ? 'animate-spin text-[#ff0055]' : ''}`} />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {blockchainTx.agreements.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#00e5ff] uppercase tracking-widest opacity-50">
                <FileText className="w-12 h-12 mb-4" />
                <p>No active constructs found.</p>
              </div>
            ) : (
              <AnimatePresence>
                {blockchainTx.agreements.map((agr, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={agr.agreement_id} 
                    className="border border-[rgba(0,229,255,0.1)] p-6 rounded-xl bg-[rgba(0,0,0,0.4)] hover:border-[rgba(0,229,255,0.3)] transition-all shadow-lg relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[rgba(0,229,255,0.05)] to-transparent rounded-bl-full pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-5 border-b border-[rgba(255,255,255,0.05)] pb-4 relative z-10">
                      <div>
                        <h4 className="text-white font-black text-xl font-display tracking-wider glow-text">{agr.agreement_id}</h4>
                        <p className="text-zinc-400 text-[10px] mt-1 uppercase tracking-widest">Locked Value: <span className="text-[#00e5ff] font-bold">{agr.value_locked} GEN</span></p>
                      </div>
                      <div className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded border backdrop-blur-md
                        ${agr.state === 'PENDING_RESOLUTION' ? 'text-[#00e5ff] border-[#00e5ff] bg-[rgba(0,229,255,0.1)] shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 
                          agr.state === 'FINALIZED_PARTY_A_FAVOR' ? 'text-[#00ffaa] border-[#00ffaa] bg-[rgba(0,255,170,0.1)] shadow-[0_0_10px_rgba(0,255,170,0.2)]' : 
                          agr.state === 'FINALIZED_PARTY_B_FAVOR' ? 'text-[#b026ff] border-[#b026ff] bg-[rgba(176,38,255,0.1)] shadow-[0_0_10px_rgba(176,38,255,0.2)]' : 
                          'text-[#ff0055] border-[#ff0055] bg-[rgba(255,0,85,0.1)] shadow-[0_0_10px_rgba(255,0,85,0.2)]'}`}>
                        {agr.state.replace('FINALIZED_', '')}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-5 text-[10px] uppercase tracking-widest relative z-10">
                      <div className="bg-[rgba(0,0,0,0.3)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                        <span className="text-zinc-500 block mb-1">Party A</span>
                        <span className="text-white font-mono truncate block">{agr.party_a}</span>
                      </div>
                      <div className="bg-[rgba(0,0,0,0.3)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                        <span className="text-zinc-500 block mb-1">Party B</span>
                        <span className="text-white font-mono truncate block">{agr.party_b}</span>
                      </div>
                    </div>

                    <div className="mb-2 relative z-10">
                      <span className="text-[#00e5ff] text-[10px] uppercase tracking-widest block mb-2 font-bold">Strict Conditions</span>
                      <p className="text-zinc-300 text-xs border-l-2 border-[#00e5ff] pl-4 py-1 font-sans">{agr.strict_conditions}</p>
                    </div>

                    {agr.state !== 'PENDING_RESOLUTION' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.05)] relative z-10"
                      >
                        <span className="text-[#b026ff] text-[10px] uppercase tracking-widest block mb-2 flex items-center gap-2 font-bold">
                          <Zap className="w-3 h-3" /> Machine Rationale
                        </span>
                        <p className="text-zinc-300 text-xs leading-relaxed bg-[rgba(112,0,255,0.05)] p-4 rounded-lg border border-[rgba(112,0,255,0.2)] font-sans italic">
                          "{agr.adjudication_rationale}"
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
