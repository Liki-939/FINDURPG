"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Plus, Eye, Clock, AlertCircle, Check, Trash2, MapPin, Calendar, Smartphone } from "lucide-react";
import Link from "next/link";
import api, { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

type Listing = {
  id: number;
  title: string;
  status: string;
  location: string;
  image1?: string;
  created_at: string;
  expiry_date?: string;
  is_active: boolean;
  duration_months?: number;
};

const VendorSkeleton = () => (
  <tr className="border-b border-border/50">
    <td className="px-10 py-8">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-2xl bg-surface-hover animate-pulse"></div>
        <div className="flex flex-col gap-2">
          <div className="h-5 w-48 bg-surface-hover animate-pulse rounded-md"></div>
          <div className="h-3 w-32 bg-surface-hover animate-pulse rounded-md"></div>
        </div>
      </div>
    </td>
    <td className="px-10 py-8"><div className="h-8 w-24 bg-surface-hover animate-pulse rounded-xl"></div></td>
    <td className="px-10 py-8"><div className="h-8 w-32 bg-surface-hover animate-pulse rounded-xl"></div></td>
    <td className="px-10 py-8"><div className="h-12 w-24 bg-surface-hover animate-pulse rounded-2xl ml-auto"></div></td>
  </tr>
);

export default function VendorDashboard() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setAuthLoaded(true);
    if (role !== "VENDOR") {
      router.push("/");
      return;
    }

    const fetchListings = async () => {
      try {
        const res = await api.get("/api/listings/mine/");
        setListings(res.data);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchListings();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await api.delete(`/api/listings/${id}/`);
      setListings(listings.filter(l => l.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading || !authLoaded) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-16 pb-20 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="h-32 w-1/2 bg-surface-hover/20 animate-pulse rounded-[2.5rem]"></div>
          <div className="h-14 w-48 bg-surface-hover/20 animate-pulse rounded-2xl"></div>
        </div>
        <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden">
          <table className="w-full">
            <tbody>
              {[1, 2, 3, 4].map((n) => <VendorSkeleton key={n} />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-16 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-sm shadow-primary/5">
              <LayoutDashboard size={32} />
            </div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter">Vendor Hub</h1>
          </div>
          <p className="text-xl text-muted font-medium max-w-2xl leading-relaxed">Manage your properties, track subscriptions, and monitor approvals in real-time.</p>
        </div>
        <Link 
          href="/add-listing" 
          className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Create New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-border/50 py-32 rounded-[4rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-black/[0.02] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent"></div>
          <div className="relative mb-10">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-primary/5 to-accent/20 flex items-center justify-center blur-2xl absolute inset-0 animate-pulse"></div>
            <div className="w-24 h-24 rounded-[2rem] bg-surface-hover flex items-center justify-center border border-border relative shadow-inner">
              <Plus className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" strokeWidth={3} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">Expand Your Portfolio</h3>
          <p className="text-muted text-xl font-medium max-w-sm leading-relaxed px-6">You haven't listed any properties yet. Start your journey with FINDURPG today.</p>
          <Link href="/add-listing" className="mt-10 px-8 py-4 rounded-2xl bg-surface border border-border text-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">Create First Listing</Link>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-hover/30 border-b border-border">
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted">Property / Details</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted">Verification</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted">Subscription Status</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.25em] text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {listings.map((listing, i) => (
                  <motion.tr 
                    key={listing.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-surface-hover/20 transition-colors group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-surface-hover flex-shrink-0 overflow-hidden border border-border shadow-sm group-hover:shadow-md transition-shadow">
                          {listing.image1 ? (
                            <img 
                              src={listing.image1.startsWith('http') ? listing.image1 : `${API_URL}${listing.image1}`} 
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-surface-hover/50 text-muted/30 font-black text-[10px] tracking-tighter">NO IMAGE</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <p className="font-black text-xl text-foreground group-hover:text-primary transition-colors leading-tight">{listing.title}</p>
                          <div className="flex items-center gap-2 text-muted font-bold text-xs">
                            <MapPin size={14} className="text-accent" />
                            <span className="truncate max-w-[240px]">{listing.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-3">
                        {listing.status === 'PENDING' ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 w-fit">
                            <Clock size={12} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Awaiting Admin</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 text-accent border border-accent/20 w-fit">
                            <Check size={12} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Verified Live</span>
                          </div>
                        )}
                        
                        {!listing.is_active && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 w-fit">
                            <AlertCircle size={12} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Disabled</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <Smartphone size={16} className="text-primary" />
                          <p className="text-sm font-black text-foreground">{listing.duration_months || 1} Month Plan</p>
                        </div>
                        {listing.expiry_date ? (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider pl-7">
                            <Calendar size={12} />
                            <span className={new Date(listing.expiry_date) < new Date() ? 'text-red-500' : ''}>
                              Exp: {new Date(listing.expiry_date).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted font-bold italic pl-7 opacity-50">Activation Pending</p>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/listing/${listing.id}`} 
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-hover border border-border text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm active:scale-90"
                          title="View on Site"
                        >
                          <Eye size={20} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(listing.id)}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-hover border border-border text-muted hover:text-red-500 hover:border-red-500/50 transition-all shadow-sm active:scale-90"
                          title="Delete Listing"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
