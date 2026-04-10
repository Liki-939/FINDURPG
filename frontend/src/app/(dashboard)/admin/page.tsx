"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShieldAlert, CheckCircle2, Receipt, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

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
};

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modal State for viewing payment screenshot
  const [selectedPaymentScreenshot, setSelectedPaymentScreenshot] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      router.push("/");
      return;
    }

    const fetchPending = async () => {
      try {
        const res = await api.get("/api/listings/pending/");
        setPendingListings(res.data);
      } catch (err) {
        console.error("Failed to fetch pending listings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [router]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await api.post(`/api/listings/approve/${id}/`);
      setPendingListings(pendingListings.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full py-20">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pt-10 pb-20 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">Admin Hub</h1>
        </div>
        <p className="text-muted">Review property listing requests and verify onboarding payment screenshots.</p>
      </div>

      {pendingListings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel py-16 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-accent mb-4 opacity-80" />
          <h2 className="text-xl font-medium text-white mb-2">All Caught Up</h2>
          <p className="text-muted">There are no pending listings requiring approval right now.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingListings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="glass-panel overflow-hidden rounded-2xl flex flex-col"
            >
              <div className="relative h-48 bg-surface-hover">
                {listing.image1 ? (
                  <img src={`http://localhost:8000${listing.image1}`} className="w-full h-full object-cover" alt="Listing preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted gap-2">
                    <ImageIcon className="w-6 h-6 opacity-50" /> No Image
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  Reviewing
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1 truncate">{listing.title}</h3>
                <p className="text-sm text-muted mb-3 truncate">{listing.location}</p>
                
                <div className="bg-surface border border-white/5 p-3 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Receipt className="w-4 h-4 text-accent" />
                      <span className="text-white/80">Platform Fee</span>
                    </div>
                    {listing.payment_screenshot ? (
                      <button 
                        onClick={() => setSelectedPaymentScreenshot(`http://localhost:8000${listing.payment_screenshot}`)}
                        className="text-xs font-medium bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg transition-colors border border-primary/20"
                      >
                        View Receipt
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">Missing</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleReject(listing.id)}
                    disabled={actionLoading === listing.id}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === listing.id ? "Wait..." : <><X className="w-4 h-4" /> Reject</>}
                  </button>
                  <button 
                    onClick={() => handleApprove(listing.id)}
                    disabled={actionLoading === listing.id || !listing.payment_screenshot}
                    title={!listing.payment_screenshot ? "Payment screenshot missing" : ""}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent/90 text-white hover:bg-accent transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    {actionLoading === listing.id ? "Wait..." : <><Check className="w-4 h-4" /> Approve</>}
                  </button>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPaymentScreenshot(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-2xl overflow-hidden max-w-xl w-full flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-surface-hover">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-accent" /> Payment Verification
                </h3>
                <button 
                  onClick={() => setSelectedPaymentScreenshot(null)}
                  className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-center bg-black/50 min-h-[300px] max-h-[70vh]">
                <img 
                  src={selectedPaymentScreenshot} 
                  alt="Payment Screenshot" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
              <div className="p-4 border-t border-white/10 bg-surface text-center">
                <p className="text-sm text-muted">Verify the UPI ID matches <strong className="text-white">findurpgadmin@ybl</strong> before approving.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
