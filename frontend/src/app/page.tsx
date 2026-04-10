"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, HomeIcon, Star, Phone, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const openModal = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentImageIdx(0);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedListing(null);
    document.body.style.overflow = "auto";
  };

  // Helper to extract available images
  const getListingImages = (listing: Listing): string[] => {
    const imgs = [];
    if (listing.image1) imgs.push(`http://localhost:8000${listing.image1}`);
    if (listing.image2) imgs.push(`http://localhost:8000${listing.image2}`);
    if (listing.image3) imgs.push(`http://localhost:8000${listing.image3}`);
    if (listing.image4) imgs.push(`http://localhost:8000${listing.image4}`);
    return imgs.length > 0 ? imgs : [];
  };

  const selectedImages = selectedListing ? getListingImages(selectedListing) : [];

  return (
    <div className="w-full flex-col flex gap-16 py-10 max-w-7xl">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-10 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-primary/30"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
          <span className="text-sm font-medium text-white/80">Premium Stays Await</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 mb-6"
        >
          <span className="block">Find Your Perfect</span>
          <span className="block text-primary drop-shadow-[0_0_30px_rgba(109,40,217,0.5)]">Temporary Home</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg text-muted mb-10"
        >
          Discover premium, comfortable, and fully-equipped PG accommodations and co-living spaces tailored for your lifestyle via FINDURPG.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="#listings" className="px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-all shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_40px_rgba(109,40,217,0.6)] flex items-center justify-center gap-2">
            Explore Places <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/signup" className="px-8 py-4 rounded-full glass hover:bg-white/5 text-white font-medium transition-all flex items-center justify-center gap-2 border border-white/10">
            List Your Property <HomeIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Recommended Listings */}
      <section id="listings" className="w-full px-4 relative z-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Accommodations</h2>
            <p className="text-muted">Handpicked and verified spaces for you</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel overflow-hidden rounded-3xl group hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div 
                  className="relative h-64 w-full bg-surface-hover overflow-hidden cursor-pointer"
                  onClick={() => openModal(listing)}
                >
                  {listing.image1 ? (
                    <img 
                      src={`http://localhost:8000${listing.image1}`} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                      <HomeIcon className="w-12 h-12 opacity-50" />
                      <span>No image available</span>
                    </div>
                  )}
                  {getListingImages(listing).length > 1 && (
                    <div className="absolute bottom-4 right-4 glass px-2 py-1 rounded bg-black/50 text-white text-xs font-bold shadow">
                      + {getListingImages(listing).length - 1} Photos
                    </div>
                  )}
                  <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium text-white">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    Premium
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors max-w-[100%] line-clamp-1">
                      {listing.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted text-sm mb-4">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <span className="truncate">{listing.location}</span>
                    <span className="mx-1">•</span>
                    <span className="truncate">{listing.distance_text}</span>
                  </div>
                  
                  <p className="text-sm text-muted/80 line-clamp-2 mb-6 flex-1">
                    {listing.description || "A very pleasant accommodation equipped with all necessary amenities."}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    <button 
                      onClick={() => openModal(listing)}
                      className="flex-1 py-3 rounded-xl bg-surface border border-border text-white font-medium group-hover:bg-primary group-hover:border-primary transition-all duration-300"
                    >
                      View Details
                    </button>
                    {listing.contact_number && (
                      <a 
                        href={`tel:${listing.contact_number}`}
                        className="py-3 px-4 rounded-xl bg-accent hover:bg-accent/90 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center shrink-0"
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
          <div className="glass-panel py-20 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
              <HomeIcon className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No listings available</h3>
            <p className="text-muted max-w-md">There are currently no approved properties available on FINDURPG. Check back soon!</p>
          </div>
        )}
      </section>

      {/* View Details Image Gallery Modal */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-3xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/10">
                <h3 className="text-xl font-bold text-white truncate pr-4">{selectedListing.title}</h3>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full bg-surface-hover text-muted hover:text-white transition bg-black/20"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row overflow-hidden h-full">
                {/* Image Gallery Side */}
                <div className="w-full md:w-[60%] lg:w-[65%] bg-black relative flex items-center justify-center min-h-[300px]">
                  {selectedImages.length > 0 ? (
                    <>
                      <img 
                        src={selectedImages[currentImageIdx]} 
                        alt={`${selectedListing.title} - Image ${currentImageIdx + 1}`}
                        className="w-full h-full object-contain"
                      />
                      
                      {selectedImages.length > 1 && (
                        <>
                          <button 
                            onClick={() => setCurrentImageIdx((prev) => prev === 0 ? selectedImages.length - 1 : prev - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-primary transition backdrop-blur-md"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={() => setCurrentImageIdx((prev) => prev === selectedImages.length - 1 ? 0 : prev + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-primary transition backdrop-blur-md"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>

                          <div className="absolute bottom-4 flex gap-2 w-full justify-center">
                            {selectedImages.map((_, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setCurrentImageIdx(idx)}
                                className={`h-2 rounded-full transition-all ${idx === currentImageIdx ? "w-8 bg-primary" : "w-2 bg-white/50"}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted">
                      <HomeIcon className="w-16 h-16 opacity-30 mb-4" />
                      <p>No images available for this property.</p>
                    </div>
                  )}
                </div>

                {/* Details Side */}
                <div className="w-full md:w-[40%] lg:w-[35%] p-6 overflow-y-auto bg-surface-hover/30">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Location</h4>
                    <div className="flex items-start gap-2 text-white/90">
                      <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedListing.location}</p>
                        <p className="text-sm text-muted">{selectedListing.distance_text}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">About this Property</h4>
                    <p className="text-white/80 whitespace-pre-line leading-relaxed">
                      {selectedListing.description || "No detailed description provided by the vendor."}
                    </p>
                  </div>

                  {selectedListing.contact_number && (
                    <div className="mt-auto pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Contact Vendor</h4>
                      <a 
                        href={`tel:${selectedListing.contact_number}`}
                        className="w-full py-4 rounded-xl bg-accent text-white font-bold tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                      >
                        <Phone className="w-6 h-6 fill-current" />
                        Call {selectedListing.contact_number}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
