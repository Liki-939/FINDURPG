"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  TextSelect, 
  Phone, 
  Compass, 
  Loader2, 
  QrCode, 
  Receipt, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Info
} from "lucide-react";
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

  const [duration, setDuration] = useState(1);
  const pricing: Record<number, number> = { 1: 500, 3: 1350, 6: 2400, 12: 4200 };
  const totalAmount = pricing[duration] || duration * 500;

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
      data.append("duration_months", duration.toString());
      data.append("total_amount", totalAmount.toString());

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
    <div className="w-full max-w-5xl mx-auto pt-16 pb-24 px-4">
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
        >
          Property Onboarding
        </motion.div>
        <h1 className="text-5xl font-black text-foreground mb-6 tracking-tighter">List Your Property</h1>
        <p className="text-xl text-muted font-medium mb-2 leading-relaxed">Join our ecosystem of premium PG accommodations.</p>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 p-6 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center gap-3 shadow-sm"
        >
          <Info className="w-5 h-5 shrink-0" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Section 1: Property Description */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm">1</div>
             <h2 className="text-2xl font-black text-foreground tracking-tight">Property Identity</h2>
          </div>

          <div className="bg-surface border border-border p-8 sm:p-10 rounded-[2.5rem] space-y-8 shadow-sm">
            <div className="grid grid-cols-1 gap-8">
              <div className="group">
                <label className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-4 group-focus-within:text-primary transition-colors">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Skyline Residency Premium PG"
                  className="w-full p-5 bg-surface-hover/50 border border-border rounded-2xl text-foreground font-medium focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted/40 text-lg"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-4 group-focus-within:text-primary transition-colors">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us about the amenities, atmosphere, and neighborhood..."
                  className="w-full p-5 bg-surface-hover/50 border border-border rounded-2xl text-foreground font-medium focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted/40 min-h-[160px] text-lg leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm">2</div>
               <h2 className="text-2xl font-black text-foreground tracking-tight">Location Hub</h2>
            </div>
            
            <div className="bg-surface border border-border p-8 rounded-[2.5rem] space-y-8 shadow-sm">
              <div className="group">
                <label className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-4">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-5 w-5 h-5 text-accent" />
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Area, City, Pincode"
                    className="w-full pl-12 pr-5 py-5 bg-surface-hover/50 border border-border rounded-2xl text-foreground font-medium focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-4">
                  Accessibility <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Compass className="absolute left-4 top-5 w-5 h-5 text-primary" />
                  <input 
                    type="text" 
                    required
                    value={formData.distance_text}
                    onChange={(e) => setFormData({...formData, distance_text: e.target.value})}
                    placeholder="300m from Indiranagar Metro"
                    className="w-full pl-12 pr-5 py-5 bg-surface-hover/50 border border-border rounded-2xl text-foreground font-medium focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm">3</div>
               <h2 className="text-2xl font-black text-foreground tracking-tight">Contact</h2>
            </div>
            
            <div className="bg-surface border border-border p-8 rounded-[2.5rem] space-y-8 shadow-sm">
              <div className="group">
                <label className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-4">
                  Official Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-5 w-5 h-5 text-primary" />
                  <input 
                    type="text" 
                    required
                    value={formData.contact_number}
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    placeholder="+91 00000 00000"
                    className="w-full pl-12 pr-5 py-5 bg-surface-hover/50 border border-border rounded-2xl text-foreground font-medium focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <p className="text-xs text-muted font-medium bg-surface-hover/50 p-4 rounded-xl border border-border/50">
                This number will be displayed publicly on the listing for potential tenants to call you directly.
              </p>
            </div>
          </section>
        </div>

        {/* Section 4: Imagery */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm">4</div>
               <h2 className="text-2xl font-black text-foreground tracking-tight">Visual Media</h2>
            </div>
            <span className="text-xs font-black text-muted bg-surface border border-border px-3 py-1.5 rounded-xl uppercase tracking-widest">At least 1 required</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FileDropzone label="Core Image" required file={image1} setFile={setImage1} id="img1" />
            <FileDropzone label="Living Area" file={image2} setFile={setImage2} id="img2" />
            <FileDropzone label="Bathroom" file={image3} setFile={setImage3} id="img3" />
            <FileDropzone label="Common Area" file={image4} setFile={setImage4} id="img4" />
          </div>
        </section>

        {/* Section 5: Subscription */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm">5</div>
             <h2 className="text-2xl font-black text-foreground tracking-tight">Listing Plan</h2>
          </div>

          <div className="bg-surface border border-border p-8 sm:p-12 rounded-[3rem] shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuration(m)}
                  className={`relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${
                    duration === m 
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" 
                      : "border-border bg-surface-hover/20 hover:border-muted hover:bg-surface-hover/40"
                  }`}
                >
                  {duration === m && (
                    <motion.div layoutId="plan-check" className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg border-4 border-surface">
                      <CheckCircle2 size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-foreground group-hover:scale-110 transition-transform">{m}</span>
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{m === 1 ? 'Month' : 'Months'}</span>
                  </div>
                  <div className="w-full h-px bg-border/50 my-2" />
                  <div className="text-xl font-black text-primary">₹{pricing[m]}</div>
                </button>
              ))}
            </div>

            <div className="mt-12 p-8 rounded-[2rem] bg-foreground text-background flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-50">Grand Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">₹{totalAmount}</span>
                  <span className="text-sm font-bold opacity-60">incl. verification</span>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end gap-2">
                <div className="px-4 py-2 rounded-xl bg-background/10 border border-background/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Priority Check
                </div>
                <p className="text-sm font-bold opacity-70">Duration: {duration} {duration === 1 ? 'Month' : 'Months'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Payment */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black border border-accent/20 shadow-sm">6</div>
             <h2 className="text-2xl font-black text-foreground tracking-tight text-accent">Payment Verification</h2>
          </div>

          <div className="bg-surface border-2 border-accent/30 p-8 sm:p-12 rounded-[3.5rem] shadow-xl shadow-accent/5 overflow-hidden relative">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">Step Final</div>
                <h3 className="text-3xl font-black text-foreground tracking-tight leading-none">Activate Your Listing</h3>
                <p className="text-lg text-muted font-medium leading-relaxed">
                  Pay the subscription fee via UPI and upload the transaction receipt. Our team will verify and activate your listing within 4 hours.
                </p>
                
                <div className="bg-surface-hover/80 border border-border p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-accent/20 flex items-center justify-center text-accent">
                      <QrCode size={32} />
                   </div>
                   <div className="text-center sm:text-left">
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Official Payment ID</p>
                      <p className="text-2xl font-black text-foreground select-all group">findurpgadmin@ybl</p>
                   </div>
                </div>
              </div>

              <div className="w-full lg:w-[400px]">
                <label className="group relative flex flex-col items-center justify-center gap-4 p-8 border-4 border-dashed border-accent/30 bg-accent/5 rounded-[3rem] cursor-pointer hover:bg-accent/10 transition-all hover:border-accent shadow-sm active:scale-95">
                  <div className="w-20 h-20 rounded-[2rem] bg-accent text-white flex items-center justify-center shadow-2xl shadow-accent/30 group-hover:rotate-12 transition-transform">
                    <Receipt size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-foreground uppercase tracking-tight">Upload Receipt</p>
                    <p className="text-xs text-muted font-bold mt-1">{paymentScreenshot ? paymentScreenshot.name : "JPEG, PNG, MAX 5MB"}</p>
                  </div>
                  <input 
                    type="file" 
                    required
                    accept="image/*" 
                    onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                    className="hidden" 
                  />
                  {paymentScreenshot && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 size={24} strokeWidth={3} />
                    </motion.div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full py-6 group bg-primary text-white text-xl font-black rounded-[2.5rem] hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 tracking-tighter"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              Submit for Verification <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

function FileDropzone({ label, required = false, file, setFile, id }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label htmlFor={id} className={`relative flex flex-col items-center justify-center gap-3 h-40 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all hover:bg-surface-hover/50 ${file ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${file ? 'bg-primary text-white shadow-lg' : 'bg-surface-hover text-muted'}`}>
          <ImageIcon size={20} />
        </div>
        <p className="text-[10px] font-black uppercase text-muted tracking-widest">{file ? "Change" : "Select"}</p>
        <input 
          id={id}
          type="file" 
          required={required}
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
          className="hidden" 
        />
        {file && (
          <div className="absolute inset-0 p-3 pointer-events-none opacity-40">
             <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-xl" />
          </div>
        )}
      </label>
    </div>
  );
}
