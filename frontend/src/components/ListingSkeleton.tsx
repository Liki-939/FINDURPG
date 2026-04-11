"use client";

import { motion } from "framer-motion";

export default function ListingSkeleton() {
  return (
    <div className="bg-surface border border-border overflow-hidden rounded-[2.5rem] flex flex-col h-[600px] animate-pulse">
      {/* Image Area Skeleton */}
      <div className="relative h-72 w-full bg-surface-hover/50"></div>
      
      {/* Content Area Skeleton */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Title */}
        <div className="h-8 w-3/4 bg-surface-hover/50 rounded-xl mb-3"></div>
        
        {/* Location Pill */}
        <div className="h-10 w-full bg-surface-hover/30 rounded-xl mb-6"></div>
        
        {/* Description */}
        <div className="space-y-2 mb-8 flex-1">
          <div className="h-4 w-full bg-surface-hover/20 rounded-lg"></div>
          <div className="h-4 w-5/6 bg-surface-hover/20 rounded-lg"></div>
        </div>
        
        {/* Footer Buttons */}
        <div className="flex items-center gap-4 mt-auto">
          <div className="flex-1 h-14 bg-foreground/10 rounded-2xl"></div>
          <div className="h-14 w-14 bg-accent/20 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
