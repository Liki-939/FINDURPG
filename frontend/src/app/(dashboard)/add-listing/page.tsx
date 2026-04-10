"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, TextSelect, Phone, Compass, Loader2, QrCode, Receipt, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";

export default function AddListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    distance_text: "",
    description: "",
    contact_number: "",
  });

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);
  const [image4, setImage4] = useState<File | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!paymentScreenshot) {
      setError("Payment verification screenshot is strictly required.");
      setLoading(false);
      return;
    }
    if (!image1) {
      setError("Cover image is strictly required.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image1) data.append("image1", image1);
      if (image2) data.append("image2", image2);
      if (image3) data.append("image3", image3);
      if (image4) data.append("image4", image4);
      data.append("payment_screenshot", paymentScreenshot);

      await api.post("/api/listings/create/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      router.push("/vendor");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to create listing.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 pb-20 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create New Listing</h1>
        <p className="text-muted">Fill out the required details below to submit your property for admin approval.</p>
      </div>
      
      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Basic Info Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] space-y-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <TextSelect className="w-5 h-5 text-primary" /> Basic Information
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1.5">
                Property Title <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Luxury PG in Whitefield"
                className="w-full p-4 bg-surface border border-border rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1.5">
                Property Description <span className="text-red-400">*</span>
              </label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the amenities, rules, and unique features..."
                className="w-full p-4 bg-surface border border-border rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted/50 min-h-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Location & Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] space-y-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <MapPin className="w-5 h-5 text-primary" /> Location Hub
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1.5">
                  Full Address <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. 123 Indiranagar, Bangalore"
                  className="w-full p-4 bg-surface border border-border rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1.5">
                  Distance Context <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Compass className="h-4 w-4 text-muted" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={formData.distance_text}
                    onChange={(e) => setFormData({...formData, distance_text: e.target.value})}
                    placeholder="e.g. 2km from Manyata Tech Park"
                    className="w-full pl-11 pr-4 py-4 bg-surface border border-border rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] space-y-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Phone className="w-5 h-5 text-primary" /> Contact Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.contact_number}
                  onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                  placeholder="+91 9876543210"
                  className="w-full p-4 bg-surface border border-border rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Images Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] space-y-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-4">
            <Camera className="w-5 h-5 text-primary" /> Property Images
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Cover Image <span className="text-red-400">*</span>
              </label>
              <div className="relative border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-4 hover:bg-primary/10 transition-colors">
                <input type="file" required accept="image/*" onChange={(e) => setImage1(e.target.files?.[0] || null)} className="w-full text-xs text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover" />
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-muted mb-2">Image 2 (Optional)</label>
              <div className="relative border-2 border-dashed border-border bg-surface rounded-xl p-4 hover:border-muted transition-colors">
                <input type="file" accept="image/*" onChange={(e) => setImage2(e.target.files?.[0] || null)} className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-surface-hover file:text-white cursor-pointer" />
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-muted mb-2">Image 3 (Optional)</label>
              <div className="relative border-2 border-dashed border-border bg-surface rounded-xl p-4 hover:border-muted transition-colors">
                <input type="file" accept="image/*" onChange={(e) => setImage3(e.target.files?.[0] || null)} className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-surface-hover file:text-white cursor-pointer" />
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-muted mb-2">Image 4 (Optional)</label>
              <div className="relative border-2 border-dashed border-border bg-surface rounded-xl p-4 hover:border-muted transition-colors">
                <input type="file" accept="image/*" onChange={(e) => setImage4(e.target.files?.[0] || null)} className="w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-surface-hover file:text-white cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border-t-4 border-t-accent shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <QrCode className="w-6 h-6 text-accent" /> Platform Fee Verification
              </h2>
              <p className="text-muted text-sm leading-relaxed max-w-xl">
                To complete your listing submission, please pay the platform onboarding fee directly to the specified UPI ID and attach your receipt.
              </p>
              <div className="bg-surface border border-border p-4 rounded-xl inline-block mt-2">
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Official UPI ID</p>
                <p className="font-mono text-xl text-white font-bold tracking-tight">findurpgadmin@ybl</p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Payment Screenshot <span className="text-red-400">*</span>
              </label>
              <label className="flex items-center gap-4 w-full p-6 border-2 border-dashed border-accent/40 bg-accent/5 rounded-2xl cursor-pointer hover:bg-accent/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Upload Receipt Image</p>
                  <p className="text-xs text-muted mt-1">{paymentScreenshot ? paymentScreenshot.name : "JPEG, PNG accepted"}</p>
                </div>
                <input 
                  type="file" 
                  required
                  accept="image/*" 
                  onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] transition-all flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Listing for Admin Approval"}
        </button>
      </form>
    </div>
  );
}
