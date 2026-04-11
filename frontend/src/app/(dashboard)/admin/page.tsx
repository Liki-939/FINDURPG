"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShieldAlert, CheckCircle2, Receipt, Image as ImageIcon, RotateCcw, Power, Clock, Calendar } from "lucide-react";
import api, { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import AdminSkeleton from "@/components/AdminSkeleton";

// Included payment_screenshot field
type Listing = {
  id: number;
  title: string;
  vendor: number; // ID
  image1?: string;
  payment_screenshot?: string;
  status: string;
  location: string;
  contact_number: string;
  is_active: boolean;
  duration_months: number;
  expiry_date?: string;
  approved_at?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modal State for viewing payment screenshot
  const [selectedPaymentScreenshot, setSelectedPaymentScreenshot] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setAuthLoaded(true);
    if (role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchListings = async () => {
      try {
        const res = await api.get("/api/listings/admin/all/");
        console.log("Admin listings fetched:", res.data);
        setPendingListings(res.data);
      } catch (err) {
        console.error("Failed to fetch listings in Admin Hub:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [router]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await api.post(`/api/listings/approve/${id}/`);
      refreshListings();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject and delete this listing?")) return;
    setActionLoading(id);
    try {
      await api.post(`/api/listings/reject/${id}/`);
      setPendingListings(pendingListings.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevert = async (id: number) => {
    setActionLoading(id);
    try {
      await api.post(`/api/listings/revert/${id}/`);
      refreshListings();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (id: number) => {
    setActionLoading(id);
    try {
      await api.post(`/api/listings/toggle-active/${id}/`);
      refreshListings();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const refreshListings = async () => {
    try {
      const res = await api.get("/api/listings/admin/all/");
      setPendingListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !authLoaded) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-16 pb-20 px-4">
        <div className="mb-14 h-32 w-1/2 bg-surface-hover/20 animate-pulse rounded-[2.5rem]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((n) => <AdminSkeleton key={n} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-16 pb-20 px-4">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter">Admin Hub</h1>
          </div>
          <p className="text-xl text-muted font-medium max-w-2xl">Review property listing requests and verify onboarding payment screenshots.</p>
        </div>
        <div className="flex gap-3">
           <div className="px-5 py-3 rounded-2xl bg-surface border border-border shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
              <span className="text-sm font-bold uppercase tracking-widest text-muted">{pendingListings.length} Requests</span>
           </div>
        </div>
      </div>

      {pendingListings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface border border-border/50 py-32 rounded-[4rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-black/[0.02] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent"></div>
          <div className="relative mb-10">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-accent/20 via-accent/5 to-primary/20 flex items-center justify-center blur-2xl absolute inset-0 animate-pulse"></div>
            <div className="w-24 h-24 rounded-[2rem] bg-surface-hover flex items-center justify-center border border-border relative shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-accent/40 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">System Secured</h3>
          <p className="text-muted text-xl font-medium max-w-sm leading-relaxed px-6">All property requests have been processed. You're completely up to date.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pendingListings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-surface border border-border overflow-hidden rounded-[2.5rem] flex flex-col hover:shadow-2xl transition-all group"
            >
              <div className="relative h-56 bg-surface-hover overflow-hidden">
                {listing.image1 ? (
                  <img src={`${API_URL}${listing.image1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Listing preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted gap-2">
                    <ImageIcon className="w-8 h-8 opacity-20" />
                  </div>
                )}
                <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
                  {!listing.is_active && (
                    <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      Disabled
                    </div>
                  )}
                  {listing.status === 'PENDING' && (
                    <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      Pending
                    </div>
                  )}
                  {listing.status === 'APPROVED' && listing.expiry_date && new Date(listing.expiry_date) < new Date() && (
                    <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      Expired
                    </div>
                  )}
                  {listing.status === 'APPROVED' && listing.is_active && (!listing.expiry_date || new Date(listing.expiry_date) >= new Date()) && (
                    <div className="bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      Live
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors">{listing.title}</h3>
                <p className="text-sm text-muted mb-8 truncate font-medium">{listing.location}</p>
                
                <div className="space-y-4 mb-10">
                   <div className="bg-surface-hover p-5 rounded-[1.5rem] border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm font-bold text-muted">
                          <Receipt className="w-5 h-5 text-primary" />
                          <span>Receipt</span>
                        </div>
                        {listing.payment_screenshot ? (
                          <button 
                            onClick={() => setSelectedPaymentScreenshot(`${API_URL}${listing.payment_screenshot}`)}
                            className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Missing</span>
                        )}
                      </div>

                      {listing.expiry_date && (
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex items-center gap-3 text-sm font-bold text-muted">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>Expiry</span>
                          </div>
                          <span className="text-sm font-black text-foreground">{new Date(listing.expiry_date).toLocaleDateString()}</span>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="mt-auto pt-2">
                  {listing.status === 'PENDING' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleReject(listing.id)}
                        disabled={actionLoading === listing.id}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all text-sm font-bold uppercase tracking-widest disabled:opacity-50"
                      >
                        {actionLoading === listing.id ? "..." : "Reject"}
                      </button>
                      <button 
                        onClick={() => handleApprove(listing.id)}
                        disabled={actionLoading === listing.id || !listing.payment_screenshot}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-white hover:bg-accent/90 transition-all text-sm font-bold uppercase tracking-widest shadow-lg shadow-accent/20 disabled:opacity-50"
                      >
                        {actionLoading === listing.id ? "..." : "Approve"}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleRevert(listing.id)}
                        disabled={actionLoading === listing.id}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-border text-foreground hover:bg-surface-hover transition-all text-sm font-bold uppercase tracking-widest disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" /> Revert
                      </button>
                      <button 
                        onClick={() => handleToggleActive(listing.id)}
                        disabled={actionLoading === listing.id}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl transition-all text-sm font-bold uppercase tracking-widest disabled:opacity-50 shadow-md ${
                          listing.is_active 
                            ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 shadow-red-500/5" 
                            : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 shadow-accent/5"
                        }`}
                      >
                        <Power className="w-4 h-4" /> {listing.is_active ? "Disable" : "Enable"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment Screenshot Modal */}
      <AnimatePresence>
        {selectedPaymentScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
            onClick={() => setSelectedPaymentScreenshot(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-[3rem] overflow-hidden max-w-2xl w-full flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center p-8 border-b border-border">
                <h3 className="text-xl font-black text-foreground flex items-center gap-3 tracking-tight">
                  <Receipt className="w-7 h-7 text-primary" /> Payment Receipt
                </h3>
                <button 
                  onClick={() => setSelectedPaymentScreenshot(null)}
                  className="p-3 rounded-2xl bg-surface-hover text-muted hover:text-foreground transition border border-border"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 flex items-center justify-center bg-background/50 min-h-[400px] max-h-[70vh]">
                <img 
                  src={selectedPaymentScreenshot} 
                  alt="Payment Screenshot" 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-lg border border-border"
                />
              </div>
              <div className="p-8 border-t border-border bg-surface text-center">
                <p className="text-sm font-bold text-muted uppercase tracking-[0.2em] mb-2 px-10">Verification Protocol</p>
                <p className="text-foreground/70 text-lg font-medium">Verify the UPI matches <strong className="text-primary">findurpgadmin@ybl</strong> before approval.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
