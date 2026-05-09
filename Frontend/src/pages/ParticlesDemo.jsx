import React from "react";
import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particles-typography";

export default function ParticlesDemo() {
  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h2 className="text-neutral-500 uppercase tracking-[0.2em] text-sm font-medium">
          Interactive Typography
        </h2>
        
        <div className="w-full h-[500px] border border-neutral-800 rounded-2xl bg-neutral-900/50 overflow-hidden relative group">
          <CursorDrivenParticleTypography
            text="DESIGN"
            fontSize={200}
            particleDensity={4}
            dispersionStrength={25}
            color="#ffffff"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to disperse particles
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
           <div className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/30 text-left">
              <h3 className="text-white font-semibold mb-2">Physics Driven</h3>
              <p className="text-neutral-400 text-sm">
                Each particle responds to mouse proximity with realistic repulsion and return physics.
              </p>
           </div>
           <div className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/30 text-left">
              <h3 className="text-white font-semibold mb-2">Canvas Optimized</h3>
              <p className="text-neutral-400 text-sm">
                High performance rendering using HTML5 Canvas with device pixel ratio awareness.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
