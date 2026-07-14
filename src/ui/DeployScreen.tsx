import React from 'react';
import { Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeployScreen: React.FC<{ onDeploy: () => void; isDeploying: boolean; address: string }> = ({ onDeploy, isDeploying, address }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center justify-center p-10 glass-panel rounded-2xl text-center max-w-lg w-full relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.05)] to-transparent pointer-events-none" />
      
      <motion.div 
        animate={{ 
          boxShadow: ['0 0 10px rgba(0,229,255,0.3)', '0 0 30px rgba(0,229,255,0.6)', '0 0 10px rgba(0,229,255,0.3)'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-full bg-[rgba(0,229,255,0.1)] border border-[#00e5ff] flex items-center justify-center mb-6"
      >
        <Zap className="w-8 h-8 text-[#00e5ff]" />
      </motion.div>

      <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 font-display glow-text">Aequitas Protocol</h2>
      <p className="text-[#00e5ff] text-sm mb-10 uppercase tracking-widest leading-relaxed opacity-80 font-mono">
        Initialize Intelligent Adjudication Construct
      </p>
      
      <motion.button
        whileHover={(!isDeploying && address) ? { scale: 1.05, boxShadow: "0 0 20px rgba(0,229,255,0.5)" } : {}}
        whileTap={(!isDeploying && address) ? { scale: 0.95 } : {}}
        onClick={onDeploy}
        disabled={isDeploying || !address}
        className="w-full bg-[rgba(0,229,255,0.1)] border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 relative overflow-hidden"
      >
        {isDeploying && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,229,255,0.3)] to-transparent animate-[shimmer_1.5s_infinite]" />
        )}
        
        <span className="relative z-10 flex items-center gap-3">
          {isDeploying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              DEPLOYING CONSTRUCT...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              INITIALIZE PROTOCOL
            </>
          )}
        </span>
      </motion.button>
    </motion.div>
  );
};
