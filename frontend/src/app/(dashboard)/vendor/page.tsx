"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Plus, Eye, Clock, AlertCircle, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type Listing = {
  id: number;
  title: string;
  status: string;
  image1?: string;
  created_at: string;
};

export default function VendorDashboard() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "VENDOR") {
      router.push("/");
      return;
    }

    const fetchMyListings = async () => {
      try {
        const res = await api.get("/api/listings/mine/");
        setListings(res.data);
      } catch (err) {
        console.error("Failed to fetch my listings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await api.delete(`/api/listings/${id}/`);
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Failed to delete listing.");
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">My Properties</h1>
          </div>
          <p className="text-muted">Manage your listings and track their approval status.</p>
        </div>
        <Link 
          href="/add-listing"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </Link>
      </div>

      {listings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel py-16 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-20 h-20 rounded-full bg-surface mb-6 flex items-center justify-center">
            <HomeIcon className="w-10 h-10 text-muted" />
          </div>
          <h2 className="text-xl font-medium text-white mb-2">No Properties Listed</h2>
          <p className="text-muted mb-6">You haven't added any accommodations yet.</p>
          <Link href="/add-listing" className="text-primary hover:text-primary-hover font-medium underline flex items-center gap-1">
            Create your first listing <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="bg-surface/50 border border-border rounded-2xl overflow-hidden glass-panel">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-surface/80 border-b border-white/5 uppercase text-xs font-semibold text-muted tracking-wider">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {listings.map((listing, i) => (
                  <motion.tr 
                    key={listing.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-surface flex-shrink-0 overflow-hidden">
                          {listing.image1 ? (
                            <img src={listing.image1.startsWith('http') ? listing.image1 : `http://localhost:8000${listing.image1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-surface-hover text-muted text-xs">No img</div>
                          )}
                        </div>
                        <span className="font-medium text-white truncate max-w-[200px]">{listing.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {listing.status === "APPROVED" ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                          <Check className="w-3 h-3" /> Approved
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium">
                          <Clock className="w-3 h-3" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(listing.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button className="p-2 text-muted hover:text-white bg-surface hover:bg-surface-hover rounded-lg transition-colors inline-flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(listing.id)} className="p-2 text-muted hover:text-red-400 bg-surface hover:bg-red-500/10 rounded-lg transition-colors inline-flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Temporary inline HomeIcon to fix import missing issue if it comes up (usually I'd import it, but mapping here helps)
function HomeIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function ArrowRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}
