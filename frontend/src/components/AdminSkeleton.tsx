"use client";

import { motion } from "framer-motion";

export default function AdminSkeleton() {
  return (
    <div className="bg-surface border border-border overflow-hidden rounded-[2.5rem] flex flex-col h-[500px] animate-pulse">
      <div className="h-56 bg-surface-hover/50 relative"></div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="h-8 w-1/2 bg-surface-hover/50 rounded-xl mb-2"></div>
        <div className="h-4 w-1/3 bg-surface-hover/30 rounded-lg mb-8"></div>
        
        <div className="bg-surface-hover/20 p-5 rounded-[1.5rem] border border-border/50 space-y-4 mb-10">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-surface-hover/50 rounded"></div>
            <div className="h-4 w-12 bg-surface-hover/50 rounded"></div>
          </div>
        </div>
        
        <div className="mt-auto grid grid-cols-2 gap-4">
          <div className="h-14 bg-surface-hover/30 rounded-2xl"></div>
          <div className="h-14 bg-accent/10 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
