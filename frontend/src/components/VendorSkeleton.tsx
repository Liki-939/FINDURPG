"use client";

export default function VendorSkeleton() {
  return (
    <tr className="animate-pulse border-b border-border/50">
      <td className="px-10 py-8">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-surface-hover/50"></div>
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-surface-hover/50 rounded-lg"></div>
            <div className="h-4 w-32 bg-surface-hover/30 rounded-md"></div>
          </div>
        </div>
      </td>
      <td className="px-10 py-8">
        <div className="h-8 w-24 bg-surface-hover/30 rounded-xl"></div>
      </td>
      <td className="px-10 py-8">
        <div className="h-10 w-32 bg-surface-hover/20 rounded-xl"></div>
      </td>
      <td className="px-10 py-8 text-right">
        <div className="flex justify-end gap-3">
          <div className="h-12 w-12 bg-surface-hover/30 rounded-2xl"></div>
          <div className="h-12 w-12 bg-surface-hover/30 rounded-2xl"></div>
        </div>
      </td>
    </tr>
  );
}
