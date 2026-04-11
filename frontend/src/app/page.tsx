"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, HomeIcon, Star, Phone, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import api, { API_URL } from "@/lib/api";
import ListingSkeleton from "@/components/ListingSkeleton";

type Listing = {
  id: number;
  title: string;
  location: string;
  distance_text: string;
  description: string;
  contact_number: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  status: string;
};

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/api/listings/all/");
        setListings(res.data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Small delay for smooth transition
      }
    };
    fetchListings();
  }, []);

  const openModal = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentImageIdx(0);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedListing(null);
    document.body.style.overflow = "auto";
  };

  const getListingImages = (listing: Listing): string[] => {
    const imgs = [];
    if (listing.image1) imgs.push(`${API_URL}${listing.image1}`);
    if (listing.image2) imgs.push(`${API_URL}${listing.image2}`);
    if (listing.image3) imgs.push(`${API_URL}${listing.image3}`);
    if (listing.image4) imgs.push(`${API_URL}${listing.image4}`);
    return imgs.length > 0 ? imgs : [];
  };

  const selectedImages = selectedListing ? getListingImages(selectedListing) : [];

  return (
    <div className="w-full flex-col flex gap-20 py-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-16 pb-12 px-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Premium Stays Await</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[1.1]"
        >
          Find Your Perfect <br/>
          <span className="text-primary dark:drop-shadow-[0_0_30px_rgba(109,40,217,0.3)]">Temporary Home</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl text-xl text-muted mb-12 leading-relaxed"
        >
          Discover curated, comfortable, and fully-equipped PG accommodations and co-living spaces tailored for your lifestyle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <Link href="#listings" className="px-10 py-5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-3 active:scale-95">
            Explore Places <ArrowRight className="w-6 h-6" />
          </Link>
          <Link href="/signup" className="px-10 py-5 rounded-2xl bg-surface border border-border text-foreground font-bold hover:bg-surface-hover transition-all flex items-center justify-center gap-3 shadow-md active:scale-95">
            List Your Property <HomeIcon className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section id="listings" className="w-full px-4 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-foreground mb-4">Featured Accommodations</h2>
            <div className="h-1.5 w-24 bg-primary rounded-full mb-4"></div>
            <p className="text-muted text-lg">Handpicked and verified spaces curated for your premium living experience.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="px-4 py-2 rounded-xl bg-surface-hover text-sm font-medium border border-border">Total: {listings.length}</div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => <ListingSkeleton key={n} />)}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-surface border border-border overflow-hidden rounded-[2.5rem] hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-primary/5 transition-all duration-500 flex flex-col border-opacity-50"
              >
                <div 
                  className="relative h-72 w-full bg-surface-hover overflow-hidden cursor-pointer"
                  onClick={() => openModal(listing)}
                >
                  {listing.image1 ? (
                    <img 
                      src={`${API_URL}${listing.image1}`} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-3 bg-surface-hover">
                      <HomeIcon className="w-16 h-16 opacity-20" />
                      <span className="text-sm font-medium">Image coming soon</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {getListingImages(listing).length > 1 && (
                    <div className="absolute bottom-5 right-5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10">
                      + {getListingImages(listing).length - 1} Photos
                    </div>
                  )}
                  
                  <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-primary/90 backdrop-blur-md flex items-center gap-1.5 text-xs font-bold text-black dark:text-white shadow-lg border border-white/20">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    PREMIUM
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1">
                    {listing.title}
                  </h3>
                  
                  <div className="flex items-center gap-2.5 text-muted text-sm mb-6 bg-surface-hover/50 p-2 rounded-xl border border-border/50">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <span className="truncate font-medium">{listing.location}</span>
                    <span className="text-border mx-0.5">|</span>
                    <span className="truncate">{listing.distance_text}</span>
                  </div>
                  
                  <p className="text-sm text-muted/90 line-clamp-2 mb-8 flex-1 leading-relaxed">
                    {listing.description || "Sophisticated co-living experience with carefully selected amenities and premium comfort."}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <button 
                      onClick={() => openModal(listing)}
                      className="flex-1 py-4 rounded-2xl bg-foreground text-background font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg active:scale-95"
                    >
                      View Details
                    </button>
                    {listing.contact_number && (
                      <a 
                        href={`tel:${listing.contact_number}`}
                        className="py-4 px-5 rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 transition-all flex items-center justify-center shrink-0 active:scale-90"
                        title={"Call " + listing.contact_number}
                      >
                        <Phone className="w-5 h-5 fill-current" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border/50 py-32 rounded-[4rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-black/[0.02] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent"></div>
            <div className="relative mb-10">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-primary/5 to-accent/20 flex items-center justify-center blur-2xl absolute inset-0 animate-pulse"></div>
              <div className="w-24 h-24 rounded-[2rem] bg-surface-hover flex items-center justify-center border border-border relative shadow-inner">
                <HomeIcon className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight">Prime Spaces Coming Soon</h3>
            <p className="text-muted max-w-sm text-xl font-medium leading-relaxed px-6">We're currently curating the next generation of premium living spaces for you.</p>
            <Link href="/signup" className="mt-10 px-8 py-4 rounded-2xl bg-surface border border-border text-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">Notify Me of New Stays</Link>
          </div>
        )}
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-[3rem] overflow-hidden w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl relative"
            >
              <div className="flex justify-between items-center p-8 border-b border-border">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-black text-foreground line-clamp-1">{selectedListing.title}</h3>
                  <div className="flex items-center gap-2 text-muted text-sm font-medium">
                    <MapPin className="w-4 h-4 text-accent" /> {selectedListing.location}
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-3 rounded-2xl bg-surface-hover text-muted hover:text-foreground hover:bg-surface border border-border transition-all shadow-sm active:scale-90"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row overflow-hidden h-full">
                {/* Gallery */}
                <div className="w-full md:w-[60%] bg-background/50 relative flex items-center justify-center min-h-[400px]">
                  {selectedImages.length > 0 ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={currentImageIdx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          src={selectedImages[currentImageIdx]} 
                          className="w-full h-full object-contain"
                          alt="Listing view"
                        />
                      </AnimatePresence>
                      
                      {selectedImages.length > 1 && (
                        <>
                          <button 
                            onClick={() => setCurrentImageIdx((prev) => prev === 0 ? selectedImages.length - 1 : prev - 1)}
                            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-surface/80 text-foreground hover:bg-primary hover:text-white transition shadow-xl border border-border/50 backdrop-blur-md"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={() => setCurrentImageIdx((prev) => prev === selectedImages.length - 1 ? 0 : prev + 1)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-surface/80 text-foreground hover:bg-primary hover:text-white transition shadow-xl border border-border/50 backdrop-blur-md"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>

                          <div className="absolute bottom-8 flex gap-3 w-full justify-center px-4">
                            {selectedImages.map((_, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setCurrentImageIdx(idx)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIdx ? "w-10 bg-primary shadow-[0_0_10px_rgba(109,40,217,0.5)]" : "w-3 bg-foreground/20"}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted">
                      <HomeIcon className="w-20 h-20 opacity-10 mb-6" />
                      <p className="font-medium">No professional photos available.</p>
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="w-full md:w-[40%] p-10 overflow-y-auto bg-surface flex flex-col border-l border-border">
                  <div className="space-y-10">
                    <section>
                      <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Highlights</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-hover p-4 rounded-2xl border border-border">
                          <p className="text-[10px] text-muted font-bold uppercase mb-1">Status</p>
                          <p className="font-bold text-foreground">Verified</p>
                        </div>
                        <div className="bg-surface-hover p-4 rounded-2xl border border-border">
                          <p className="text-[10px] text-muted font-bold uppercase mb-1">Type</p>
                          <p className="font-bold text-foreground">Premium PG</p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Description</h4>
                      <p className="text-foreground/80 whitespace-pre-line leading-loose text-lg font-medium">
                        {selectedListing.description || "A meticulously maintained premium structure designed to provide maximum comfort and a peaceful living environment."}
                      </p>
                    </section>

                    <section className="pt-6 mt-auto">
                      <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6">Inquiry</h4>
                      {selectedListing.contact_number && (
                        <a 
                          href={`tel:${selectedListing.contact_number}`}
                          className="w-full py-5 rounded-[1.5rem] bg-accent text-white font-black text-lg tracking-wide shadow-2xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 active:scale-95"
                        >
                          <Phone className="w-7 h-7 fill-current" />
                          Call Agent
                        </a>
                      )}
                      <p className="text-[10px] text-muted text-center mt-6 font-bold uppercase tracking-widest">Powered by FINDURPG Concierge</p>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
