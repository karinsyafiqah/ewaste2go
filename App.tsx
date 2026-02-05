
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Truck, Award, Home, ShoppingBag, 
  Menu, X, Phone, Mail, Navigation, Search, 
  ChevronRight, ArrowRight, Settings, LogOut,
  Plus, Calendar, CheckCircle, Clock, Map as MapIcon,
  Recycle, Sun, Moon, Bell, Shield, Globe, Minimize2, RefreshCw, List, Camera,
  User, Star, Bookmark, Ticket, Info, Check, Copy, BookOpen,
  HelpCircle, Users, FileText, Trash2, MessageCircle,
  CreditCard, Wallet, Landmark, Upload, QrCode, ScanLine, ExternalLink,
  Locate, Minus, Edit2, AlertCircle
} from 'lucide-react';
import { 
  MOCK_ADS, MOCK_COLLECTION_POINTS, MOCK_PICKUPS, 
  MOCK_REWARDS, INITIAL_USER, GUIDE_DATA, TRANSLATIONS 
} from './constants';
import { 
  User as UserType, Pickup, CollectionPoint, 
  MarketplaceAd, Reward, SavedLocation, PaymentMethod 
} from './types';

// --- Utility Hooks ---
const useTranslation = (lang: string) => {
  return (key: string) => TRANSLATIONS[lang]?.[key] || key;
};

const openInGoogleMaps = (lat: number, lng: number, query?: string) => {
  const q = query ? encodeURIComponent(query) : `${lat},${lng}`;
  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
};

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon, disabled = false, size = 'md' }: any) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base"
  };
  
  const baseStyle = `flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size as keyof typeof sizeStyles]}`;
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30",
    secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
    outline: "border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
    dangerOutline: "border border-red-200 text-red-600 hover:bg-red-50",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }: any) => (
  <div onClick={onClick} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue', className='' }: any) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${colors[color as keyof typeof colors]} ${className}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children, fullScreen = false }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`bg-white dark:bg-gray-800 w-full ${fullScreen ? 'h-[90vh]' : 'max-h-[90vh]'} max-w-md rounded-2xl p-6 shadow-2xl relative overflow-y-auto flex flex-col`}>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Realistic Map Component ---
const TrackingMap = ({ pickup, interactive = false, onLocationSelect, className = 'h-72' }: { pickup?: Pickup, interactive?: boolean, onLocationSelect?: (coords: any, address: string) => void, className?: string }) => {
  const [progress, setProgress] = useState(30);
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 });
  const [currentCoords, setCurrentCoords] = useState({ lat: 5.975, lng: 116.09 }); // Default KK
  
  // Real OSM Tile for Kota Kinabalu area (Fallback)
  const mapTileUrl = "https://a.tile.openstreetmap.org/13/6737/3965.png"; 
  
  useEffect(() => {
    if (pickup?.status === 'in-transit') {
      const interval = setInterval(() => {
        setProgress(p => (p >= 90 ? 30 : p + 5));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [pickup?.status]);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!interactive || !onLocationSelect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPos({ x, y });
    
    // Mock lat/lng and address based on click
    const lat = 5.9 + (y/1000); 
    const lng = 116.0 + (x/1000);
    setCurrentCoords({ lat, lng });

    const mockAddresses = [
      "Jalan Tun Fuad Stephens, 88400 Kota Kinabalu",
      "Lorong 5, Taman Kingfisher, 88450 KK",
      "Block B, Lintas Square, 88300 Kota Kinabalu",
      "Jalan Coastal, Sembulan, 88100 Kota Kinabalu"
    ];
    const randomAddr = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
    onLocationSelect({ lat, lng }, randomAddr);
  };

  return (
    <div className={`relative w-full bg-[#AAD3DF] rounded-2xl overflow-hidden shadow-inner group ${interactive ? 'cursor-crosshair' : ''} ${className}`} onClick={handleMapClick}>
      
      {/* Real Map Tiles Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-90"
        style={{ 
            backgroundImage: `url(${mapTileUrl})`,
            filter: 'saturate(0.8) contrast(1.1)' 
        }}
      ></div>
      
      {/* --- Google Maps Style Controls & Badges --- */}

      {/* Top Left: GPS Active Badge */}
      <div className="absolute top-4 left-4 z-20">
         <div className="bg-green-100 border border-green-200 text-green-700 px-3 py-1.5 rounded-full shadow-md flex items-center space-x-2 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wide">GPS Active</span>
         </div>
      </div>

      {/* Top Right: Open in Google Maps */}
      <div className="absolute top-4 right-4 z-20">
         <button 
            onClick={(e) => {
               e.stopPropagation();
               openInGoogleMaps(currentCoords.lat, currentCoords.lng);
            }}
            className="bg-white/90 backdrop-blur text-xs font-bold text-gray-700 px-3 py-2 rounded-lg shadow-md border border-gray-200 flex items-center hover:bg-gray-50 active:scale-95 transition-all"
         >
            <ExternalLink className="w-3 h-3 mr-1.5" /> Open in Google Maps
         </button>
      </div>

      {/* Bottom Right: Map Controls (Zoom & Recenter) */}
      <div className="absolute bottom-6 right-4 flex flex-col gap-3 z-20">
         <div className="bg-white text-gray-600 rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200 divide-y divide-gray-200">
            <button className="p-3 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center">
               <Plus className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center">
               <Minus className="w-5 h-5" />
            </button>
         </div>
         <button 
            onClick={(e) => { e.stopPropagation(); alert("Centering on your location..."); }}
            className="bg-white p-3 text-blue-600 rounded-full shadow-lg border border-gray-200 hover:bg-blue-50 active:bg-blue-100 flex items-center justify-center"
         >
            <Locate className="w-6 h-6" />
         </button>
      </div>

      {/* --- Interactive Elements --- */}

      {/* Center: Selected Location Pin (Customer) */}
      {interactive && (
        <div className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 z-30 pointer-events-none" style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}>
            <MapPin className="w-12 h-12 text-red-600 drop-shadow-2xl filter" fill="currentColor" />
            <div className="w-3 h-1.5 bg-black/40 rounded-full blur-[2px] absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}

      {/* Driver/User Current Location (Blue Dot) */}
      <div className="absolute top-[60%] left-[40%] z-20 pointer-events-none">
          <div className="relative">
            <div className="w-5 h-5 bg-[#4285F4] rounded-full border-[3px] border-white shadow-lg z-20 relative"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#4285F4]/20 rounded-full animate-ping"></div>
            {/* Field of View Cone */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-t from-[#4285F4]/20 to-transparent rounded-full transform -rotate-45"
                style={{ clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)' }}
            ></div>
          </div>
      </div>

      {/* Driver Tracking Mode (View Mode) */}
      {!interactive && pickup && (
        <>
           {/* Route Line Mock */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))' }}>
            <path d="M 10 50 Q 35 50 35 40 T 90 50" stroke="#4285F4" strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
          
          <div className="absolute left-8 top-1/2 -translate-y-1/2 transform z-20">
             <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
             </div>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 transform z-20">
             <div className="w-8 h-8 bg-primary-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
             </div>
          </div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 transform transition-all duration-1000 ease-linear z-30"
            style={{ left: `${progress}%`, top: `${50 - Math.sin((progress-10)/80 * Math.PI) * 40}%` }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-primary-600 z-10 relative">
                 <Truck className="w-6 h-6 text-primary-600" />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold shadow whitespace-nowrap">
                 {pickup.driverName?.split(' ')[0]}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Google Logo Mock */}
      <div className="absolute bottom-1 left-2 opacity-70 text-xs font-bold text-gray-600 pointer-events-none select-none drop-shadow-sm font-sans">
         <span className="text-blue-500">G</span>
         <span className="text-red-500">o</span>
         <span className="text-yellow-500">o</span>
         <span className="text-blue-500">g</span>
         <span className="text-green-500">l</span>
         <span className="text-red-500">e</span>
      </div>
    </div>
  );
};

const CollectionMap = ({ points }: { points: CollectionPoint[] | any[] }) => {
  // Use a real Google Maps Embed Iframe for the static/view-only maps
  const lat = points[0]?.coordinates?.lat || 5.9785;
  const lng = points[0]?.coordinates?.lng || 116.0735;
  
  return (
    <div className="relative h-[60vh] w-full bg-[#E5E7EB] dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner group">
      <iframe 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        scrolling="no" 
        marginHeight={0} 
        marginWidth={0} 
        src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`}
        className="absolute inset-0 w-full h-full opacity-90 grayscale-[0.1] contrast-[1.1]"
        style={{ pointerEvents: 'none' }} // Disable interaction to keep it as a 'preview' unless we want it fully interactive
      ></iframe>
      
      {/* Overlay to allow clicking through to real Google Maps */}
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
        target="_blank" 
        rel="noreferrer"
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors group"
      >
         <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" /> Open in Google Maps
         </div>
      </a>
      
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-xs z-20 pointer-events-none">
        <div className="flex items-center"><div className="w-3 h-3 bg-red-600 rounded-full mr-2" /> Selected Location</div>
      </div>
    </div>
  );
};

// --- Views ---

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Welcome to e-waste2go", desc: "The easiest way to recycle electronics in Sabah.", img: "https://www.genevaenvironmentnetwork.org/wp-content/uploads/2020/09/ewaste-aspect-ratio-2000-1200-1024x614.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", icon: Recycle },
    { title: "Schedule Pickups", desc: "We come to you. Real-time GPS tracking for every pickup.", img: "https://images.unsplash.com/photo-1615914143778-1a1a6e50c5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", icon: Truck },
    { title: "Trade & Earn", desc: "Sell valuable parts to partners or earn points for recycling.", img: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", icon: Award },
    { title: "Sustainable Sabah", desc: "Join us and DBKK in making our state greener.", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", icon: Globe }
  ];

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      <div className="flex-1 relative">
        <img src={steps[step].img} alt="Onboarding" className="w-full h-[60vh] object-cover rounded-b-[3rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-[3rem] flex flex-col justify-end p-8 pb-16">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-600/50">
            {React.createElement(steps[step].icon, { className: "w-8 h-8 text-white" })}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{steps[step].title}</h1>
          <p className="text-gray-200 text-lg leading-relaxed">{steps[step].desc}</p>
        </div>
      </div>
      <div className="p-8 pb-12 bg-white dark:bg-gray-900 flex flex-col items-center">
        <div className="flex space-x-2 mb-8">
          {steps.map((_, i) => (<div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />))}
        </div>
        <Button className="w-full shadow-xl" onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete()}>
          {step === steps.length - 1 ? "Get Started" : "Next"} <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const Auth = ({ onLogin, t }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl mx-auto flex items-center justify-center mb-4">
            <Recycle className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{isLogin ? t('welcomeBack') : t('createAccount')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">e-waste2go</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          {!isLogin && (
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <input type="text" placeholder="Full Name" className="w-full bg-transparent outline-none text-gray-900" required />
             </div>
          )}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <input type="email" placeholder="Email" className="w-full bg-transparent outline-none text-gray-900" required />
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <input type="password" placeholder="Password" className="w-full bg-transparent outline-none text-gray-900" required />
          </div>
          <Button className="w-full mt-6 shadow-xl" variant="primary">{isLogin ? t('signIn') : t('signUp')}</Button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary-600 font-bold hover:underline">
            {isLogin ? t('signUp') : t('signIn')}
          </button>
        </p>
      </div>
    </div>
  );
};

const TrackingView = ({ pickup, onBack }: any) => {
  if (!pickup) return null;
  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col">
       {/* Full screen map wrapper */}
       <div className="flex-1 relative">
          <TrackingMap pickup={pickup} className="h-full rounded-none border-0" />
          
          {/* Back Button Overlay */}
          <button 
            onClick={onBack} 
            className="absolute top-6 left-6 z-10 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
       </div>

       {/* Driver Sheet */}
       <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 z-10 relative -mt-6">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-start mb-6">
             <div>
                <h2 className="text-xl font-bold dark:text-white mb-1">Arriving in 15 mins</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Driver is on the way</p>
             </div>
             <Badge color="green" className="px-3 py-1">On Time</Badge>
          </div>

          <div className="flex items-center gap-4 mb-8">
             <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600">
                <User className="w-7 h-7 text-gray-400" />
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-lg dark:text-white">{pickup.driverName || 'Driver Assigned'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{pickup.driverVehicle || 'Truck'}</p>
                <div className="flex items-center mt-1">
                   <Star className="w-3 h-3 text-yellow-400 fill-current" />
                   <span className="text-xs font-bold ml-1 dark:text-gray-300">4.9</span>
                </div>
             </div>
             <div className="flex gap-2">
                <button onClick={() => window.location.href = `tel:${pickup.driverPhone}`} className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
                   <Phone className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors">
                   <MessageCircle className="w-5 h-5" />
                </button>
             </div>
          </div>
          
          {/* Tracking Steps */}
          <div className="space-y-6 relative pl-2">
             <div className="absolute top-2 left-[19px] bottom-10 w-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
             
             <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-green-500 flex items-center justify-center shrink-0 shadow-sm z-10">
                     <Truck className="w-5 h-5 text-green-600" />
                 </div>
                 <div className="pt-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Current Status</p>
                    <p className="font-bold text-gray-900 dark:text-white">Driver In Transit</p>
                    <p className="text-xs text-gray-500">Jalan Tun Fuad Stephens</p>
                 </div>
             </div>

             <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0 z-10">
                     <MapPin className="w-5 h-5 text-gray-400" />
                 </div>
                 <div className="pt-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Destination</p>
                    <p className="font-bold text-gray-900 dark:text-white">{pickup.location.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{pickup.location.address}</p>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const HomeView = ({ user, activePickup, pickups, onSchedule, onNavigate, t, onViewPickup, onTrack }: any) => {
  const [showActiveDetails, setShowActiveDetails] = useState(false);
  
  const quickActions = [
    { icon: Calendar, label: t('schedulePickup'), color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300', nav: 'schedule' },
    { icon: MapPin, label: t('collectionPoints'), color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300', nav: 'points' },
    { icon: ShoppingBag, label: t('sellEwaste'), color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300', nav: 'market' },
    { icon: BookOpen, label: t('guide'), color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300', nav: 'guide' },
  ];

  const handleActionClick = (nav: string) => {
    if (nav === 'schedule') {
      onSchedule();
    } else {
      onNavigate(nav);
    }
  };

  return (
    <div className="space-y-6 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Custom Header */}
      <div className="bg-primary-600 p-6 pt-8 pb-8 rounded-b-[2rem] shadow-lg -mx-4 -mt-4 mb-2">
        <h1 className="text-3xl font-bold text-white mb-1">e-waste2go</h1>
        <p className="text-primary-100 font-medium opacity-90">Your Points: <span className="font-bold text-white">{user.stats.rewardPoints}</span></p>
      </div>

      <div className="px-2">
        {/* Quick Actions Grid */}
        <h3 className="font-bold text-lg mb-3 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, idx) => (
            <button 
              key={idx} 
              onClick={() => handleActionClick(action.nav)}
              className={`flex flex-col items-center justify-center py-8 px-4 rounded-3xl ${action.color} transition-transform active:scale-95`}
            >
              <action.icon className="w-8 h-8 mb-3" />
              <span className="font-bold text-sm text-center">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Pickups Section */}
        <h3 className="font-bold text-lg mb-3 dark:text-white">{t('recentPickups')}</h3>
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 min-h-[200px] flex flex-col justify-center">
          {pickups.length === 0 ? (
            <div className="text-center text-gray-400">
               <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
               <p className="font-medium text-gray-500 dark:text-gray-400">No pickups yet</p>
               <p className="text-xs mt-1">Schedule your first pickup to get started</p>
            </div>
          ) : (
             <div className="space-y-4">
               {activePickup && (
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800 mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge color="green">Active</Badge>
                      <span className="text-xs font-mono text-primary-700 dark:text-primary-300">{activePickup.trackingId}</span>
                    </div>
                    <div className="flex items-center text-primary-800 dark:text-primary-200">
                       <Truck className="w-5 h-5 mr-3" />
                       <div className="flex-1">
                          <p className="font-bold text-sm">Driver En Route</p>
                          <p className="text-xs opacity-80">Arriving in ~15 mins</p>
                       </div>
                       <Button variant="primary" className="!py-1.5 !px-3 text-xs h-8" onClick={() => onTrack(activePickup)}>Track</Button>
                    </div>
                  </div>
               )}
               {pickups.filter((p: any) => p.status !== 'in-transit').slice(0, 3).map((pickup: any) => (
                <div key={pickup.id} onClick={() => onViewPickup(pickup)} className="flex items-center py-2 border-b last:border-0 border-gray-100 dark:border-gray-700 cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                   </div>
                   <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{pickup.items[0]} {pickup.items.length > 1 && `+${pickup.items.length - 1}`}</p>
                      <p className="text-xs text-gray-400">{pickup.date}</p>
                   </div>
                   <Badge color="gray">{pickup.status}</Badge>
                </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CollectionPointsView = ({ t }: any) => {
  const [search, setSearch] = useState('');
  
  const governmentPoints = MOCK_COLLECTION_POINTS.filter(cp => cp.type === 'government');
  const partnerPoints = MOCK_COLLECTION_POINTS.filter(cp => cp.type !== 'government');
  
  const filterPoints = (points: CollectionPoint[]) => points.filter(cp => 
    cp.name.toLowerCase().includes(search.toLowerCase()) || 
    cp.acceptedItems.join('').toLowerCase().includes(search.toLowerCase())
  );

  const filteredGov = filterPoints(governmentPoints);
  const filteredPartners = filterPoints(partnerPoints);

  return (
    <div className="space-y-6 pb-20 pt-6 px-2">
      <div className="px-2">
        <h1 className="text-3xl font-bold dark:text-white mb-6">{t('collectionPoints')}</h1>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search collection points..." 
            className="w-full bg-white text-gray-900 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Government Section */}
        {filteredGov.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Government Collection Center</h3>
            {filteredGov.map(point => (
              <div key={point.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative border-l-4 border-l-primary-600 p-5">
                <div className="flex items-start mb-4">
                  <div className="mr-3 mt-1">
                     <div className="w-8 h-8 flex items-center justify-center">
                        <MapIcon className="w-6 h-6 text-primary-600" />
                     </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight dark:text-white mb-2">{point.name}</h3>
                    {point.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{point.description}</p>}
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{point.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                        <span>{point.operatingHours}</span>
                      </div>
                      <div className="flex items-start">
                        <ShoppingBag className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{point.acceptedItems.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-2">
                  <button onClick={() => window.open(`tel:${point.phone}`)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors">
                     <Phone className="w-4 h-4 mr-2" /> {t('call')}
                  </button>
                  <button onClick={() => window.open(`mailto:${point.email}`)} className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-colors">
                     <Mail className="w-4 h-4 mr-2" /> {t('email')}
                  </button>
                  <button onClick={() => openInGoogleMaps(point.coordinates.lat, point.coordinates.lng)} className="w-12 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg flex items-center justify-center transition-colors">
                     <Navigation className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partners Section */}
        {filteredPartners.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4 dark:text-white">Partner IT Companies ({filteredPartners.length})</h3>
            <div className="space-y-4">
              {filteredPartners.map(point => (
                <div key={point.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{point.name}</h3>
                      <Badge color="green" className="ml-2">PARTNER</Badge>
                   </div>
                   {point.description && <p className="text-sm text-gray-500 mb-4">{point.description}</p>}
                   
                   <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{point.address}</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{point.operatingHours}</span>
                      </div>
                      <div className="flex items-start">
                        <ShoppingBag className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{point.acceptedItems.join(', ')}</span>
                      </div>
                   </div>

                   <div className="flex space-x-3">
                      <button onClick={() => window.open(`tel:${point.phone}`)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center transition-colors">
                        <Phone className="w-4 h-4 mr-2" /> {t('call')}
                      </button>
                      <button onClick={() => openInGoogleMaps(point.coordinates.lat, point.coordinates.lng)} className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center transition-colors">
                        <Navigation className="w-4 h-4 mr-2" /> {t('directions')}
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MarketplaceView = ({ t }: any) => {
  const [isSelling, setIsSelling] = useState(false);
  const [listingImage, setListingImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setListingImage(imageUrl);
    }
  };
  
  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold dark:text-white">{t('market')}</h1>
         <Button variant="primary" size="md" onClick={() => setIsSelling(true)}>
           <Plus className="w-4 h-4 mr-1" /> Sell Item
         </Button>
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl flex items-start space-x-3">
        <ShoppingBag className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-primary-800 dark:text-primary-300">{t('sellEwaste')}</h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">Companies are looking for parts! Contact them directly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ADS.map(ad => (
          <Card key={ad.id} className="p-0 overflow-hidden flex flex-col h-full">
            <div className="relative h-40">
              <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="text-white font-bold text-lg block">{ad.priceRange}</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex-1">
                <Badge color="blue" className="mb-2">{ad.companyName}</Badge>
                <h3 className="font-bold text-lg leading-tight mb-2 dark:text-white">{ad.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{ad.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Contact Info</p>
                <div className="flex space-x-2">
                  <Button variant="secondary" className="flex-1 h-10" icon={Phone} onClick={() => window.open(`tel:${ad.contact.phone}`)}>{t('call')}</Button>
                  <Button variant="secondary" className="flex-1 h-10" icon={Mail} onClick={() => window.open(`mailto:${ad.contact.email}`)}>{t('email')}</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isSelling} onClose={() => { setIsSelling(false); setListingImage(null); }} title="Sell Your Item">
         <form onSubmit={(e) => { e.preventDefault(); setIsSelling(false); setListingImage(null); alert("Item listed successfully!"); }}>
           <div className="space-y-4">
             
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Item Photo</label>
               {listingImage ? (
                 <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                   <img src={listingImage} alt="Item preview" className="w-full h-full object-cover" />
                   <button 
                     type="button"
                     onClick={() => setListingImage(null)}
                     className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               ) : (
                 <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-primary-500 transition-all bg-white group">
                   <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:bg-primary-50 transition-colors">
                     <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
                   </div>
                   <span className="text-sm font-medium text-gray-500 group-hover:text-primary-600">Tap to upload photo</span>
                   <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                 </label>
               )}
             </div>

             <div><label className="text-xs font-bold text-gray-500 uppercase">Item Name</label><input className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" required /></div>
             <div><label className="text-xs font-bold text-gray-500 uppercase">Description</label><textarea className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" rows={3} required /></div>
             <div><label className="text-xs font-bold text-gray-500 uppercase">Price (RM)</label><input type="number" className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" required /></div>
             <Button className="w-full mt-4">Post Advertisement</Button>
           </div>
         </form>
      </Modal>
    </div>
  );
};

const RewardsView = ({ user, onRedeem, onCashOut, t }: any) => {
  const [isCashOutOpen, setIsCashOutOpen] = useState(false);
  const [cashOutPoints, setCashOutPoints] = useState(100);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [showMyQR, setShowMyQR] = useState(false);

  const cashValue = (cashOutPoints / 10).toFixed(2); // 100 points = RM 10.00 rate

  // Mock Rewards History combining cash-ins and pickups for demo
  const historyData = [
     ...user.claimedRewards,
     { id: 'h1', name: 'Cash In (Pickup #TRK-8821)', date: '2025-02-20', amount: '+ RM 5.00', type: 'credit', status: 'Success' },
     { id: 'h2', name: 'Cash In (Pickup #TRK-1002)', date: '2025-01-15', amount: '+ RM 3.50', type: 'credit', status: 'Success' },
     { id: 'h3', name: 'Cash Out to TNG', date: '2025-01-20', amount: '- RM 10.00', type: 'debit', status: 'Completed' }
  ];

  const handleCashOutSubmit = () => {
    if (cashOutPoints > user.stats.rewardPoints) return;
    if (!selectedPayment && user.paymentMethods.length > 0) {
      alert(t('selectPaymentMethod'));
      return;
    }
    onCashOut(cashOutPoints);
    setIsCashOutOpen(false);
  };

  const handleScanQR = () => {
    setIsScanning(true);
    // Simulate scan success
    setTimeout(() => {
        setIsScanning(false);
        alert("QR Code Scanned Successfully! Reward claimed.");
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="font-medium text-yellow-50 mb-1">{t('availablePoints')}</p>
            <h1 className="text-4xl font-bold mb-4">{user.stats.rewardPoints}</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsCashOutOpen(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {t('cashOut')}
              </button>
              <button 
                onClick={() => setShowMyQR(true)}
                className="bg-white text-orange-600 hover:bg-gray-100 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm"
              >
                <QrCode className="w-4 h-4 mr-2" />
                My QR
              </button>
            </div>
          </div>
          <div 
             className="p-2 bg-white/20 rounded-lg backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors"
             onClick={handleScanQR}
          >
             <ScanLine className="w-8 h-8 text-white" />
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Transaction History - Default View */}
      <div>
        <h3 className="font-bold text-lg mb-4 dark:text-white">Transaction History</h3>
        <div className="space-y-3">
          {historyData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
               <Ticket className="w-12 h-12 mx-auto mb-2 opacity-20" />
               <p>No rewards history.</p>
            </div>
          ) : (
            historyData.map((item: any) => (
              <Card key={item.id} className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${item.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   {item.type === 'credit' ? <ArrowRight className="w-5 h-5 -rotate-45" /> : <ArrowRight className="w-5 h-5 rotate-45" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold dark:text-white text-sm line-clamp-1">{item.name}</h3>
                    <span className={`text-sm font-bold whitespace-nowrap ${item.type === 'credit' ? 'text-green-600' : 'text-gray-900 dark:text-gray-100'}`}>
                        {item.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                     <p className="text-xs text-gray-500">{item.date}</p>
                     <Badge color={item.status === 'Success' || item.status === 'Completed' ? 'green' : 'gray'}>{item.status || 'Completed'}</Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Cash Out Modal */}
      <Modal isOpen={isCashOutOpen} onClose={() => setIsCashOutOpen(false)} title={t('cashOut')}>
         <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center border border-green-100 dark:border-green-800">
               <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold mb-1">{t('conversionRate')}</p>
               <p className="text-3xl font-bold text-green-700 dark:text-green-300">RM {cashValue}</p>
            </div>

            <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t('amountToWithdraw')}</label>
               <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="100" 
                    max={user.stats.rewardPoints} 
                    step="100"
                    value={cashOutPoints}
                    onChange={(e) => setCashOutPoints(parseInt(e.target.value))}
                    className="flex-1 accent-primary-600"
                  />
                  <span className="font-mono font-bold w-16 text-right dark:text-white">{cashOutPoints} pts</span>
               </div>
               {user.stats.rewardPoints < 100 && <p className="text-xs text-red-500 mt-1">{t('insufficientPoints')}</p>}
            </div>

            <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t('selectPaymentMethod')}</label>
               {user.paymentMethods.length === 0 ? (
                 <div className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-2">
                   {t('noPaymentMethods')} <br/>
                   <span className="text-xs">Go to Profile to add a payment method.</span>
                 </div>
               ) : (
                 <div className="space-y-2">
                   {user.paymentMethods.map((pm: PaymentMethod) => (
                     <div 
                       key={pm.id} 
                       onClick={() => setSelectedPayment(pm.id)}
                       className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${selectedPayment === pm.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                     >
                       <div className="flex items-center space-x-3">
                          {pm.type === 'bank' ? <Landmark className="w-5 h-5 text-blue-600" /> : <Wallet className="w-5 h-5 text-orange-600" />}
                          <div>
                             <p className="text-sm font-bold dark:text-white">{pm.provider}</p>
                             <p className="text-xs text-gray-500">{pm.accountNumber}</p>
                          </div>
                       </div>
                       {selectedPayment === pm.id && <CheckCircle className="w-5 h-5 text-primary-600" />}
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <Button 
               className="w-full mt-2" 
               disabled={cashOutPoints > user.stats.rewardPoints || (user.paymentMethods.length > 0 && !selectedPayment)}
               onClick={handleCashOutSubmit}
            >
               Confirm Cash Out
            </Button>
         </div>
      </Modal>

      {/* Scan Mode Overlay */}
      {isScanning && (
         <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden mb-8 border border-gray-700">
               <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/50 text-sm animate-pulse">Initializing Camera...</p>
               </div>
               <div className="absolute inset-0 border-2 border-primary-500/50">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary-500"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary-500"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary-500"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary-500"></div>
               </div>
               <div className="absolute inset-0 bg-primary-500/10 animate-pulse"></div>
            </div>
            <p className="text-white font-medium mb-8">Align QR code within the frame</p>
            <button 
              onClick={() => setIsScanning(false)}
              className="bg-white/20 text-white px-8 py-3 rounded-full font-bold backdrop-blur-md border border-white/30"
            >
              Cancel
            </button>
         </div>
      )}

      {/* My QR Modal */}
      <Modal isOpen={showMyQR} onClose={() => setShowMyQR(false)} title="My QR Code">
         <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6">
               <QrCode className="w-48 h-48 text-gray-900" />
            </div>
            <p className="font-bold text-lg dark:text-white">{user.name}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{user.id.toUpperCase()}</p>
            <p className="text-xs text-center text-gray-400 max-w-[200px]">Show this code to partners to verify your identity or collect points.</p>
         </div>
      </Modal>
    </div>
  );
};

const GuideView = ({ t }: any) => {
  const icons: any = { Minimize2, RefreshCw, Recycle };
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-teal-600 text-white p-6 rounded-3xl mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('guide')}</h1>
        <p className="opacity-90">Learn how to manage electronic waste sustainably.</p>
      </div>
      <div className="space-y-6">
        {GUIDE_DATA.map((item, idx) => {
          const Icon = icons[item.icon];
          return (
            <div key={idx} className="flex gap-4 items-start">
              <div className={`p-4 rounded-2xl flex-shrink-0 ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProfileView = ({ user, onLogout, settings, onUpdateSetting, t, pickups, onUpdateUser }: any) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email, phone: user.phone || '' });
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationDetails, setNewLocationDetails] = useState<any>({ name: '', address: '', coordinates: null });

  // Payment Method Form State
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ type: 'ewallet' as 'bank'|'ewallet', provider: '', accountNumber: '', accountHolder: '' });

  // Partnership Form State
  const [partnerForm, setPartnerForm] = useState({ company: '', name: '', email: '', phone: '', message: '' });
  const [isPartnerSuccess, setIsPartnerSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Helper to close modal
  const closeModal = () => {
     setActiveModal(null);
     setIsAddingLocation(false);
     setIsAddingPayment(false);
     setIsPartnerSuccess(false);
     setNewLocationDetails({ name: '', address: '', coordinates: null });
     setPaymentForm({ type: 'ewallet', provider: '', accountNumber: '', accountHolder: '' });
  };

  // Save Profile Handler
  const handleSaveProfile = () => {
    onUpdateUser({ 
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone
    });
    closeModal();
  };

  // Save New Location Handler
  const handleSaveLocation = () => {
    if (!newLocationDetails.coordinates || !newLocationDetails.address) return;
    
    const newLoc: SavedLocation = {
      id: `loc_${Date.now()}`,
      name: newLocationDetails.name || 'New Location',
      address: newLocationDetails.address,
      coordinates: newLocationDetails.coordinates
    };
    
    onUpdateUser({ savedLocations: [...user.savedLocations, newLoc] });
    setIsAddingLocation(false);
    setNewLocationDetails({ name: '', address: '', coordinates: null });
  };

  // Save Payment Method Handler
  const handleSavePaymentMethod = () => {
    if (!paymentForm.provider || !paymentForm.accountNumber || !paymentForm.accountHolder) return;
    const newPM: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: paymentForm.type,
      provider: paymentForm.provider,
      accountNumber: paymentForm.accountNumber,
      accountHolder: paymentForm.accountHolder
    };
    onUpdateUser({ paymentMethods: [...user.paymentMethods, newPM] });
    setIsAddingPayment(false);
    setPaymentForm({ type: 'ewallet', provider: '', accountNumber: '', accountHolder: '' });
  };

  // Submit Partnership Handler
  const handleSubmitPartnership = () => {
    if (!partnerForm.company || !partnerForm.name || !partnerForm.email || !partnerForm.phone) {
      alert("Please fill in all required fields.");
      return;
    }
    // Instead of alerting and closing, show success state
    setIsPartnerSuccess(true);
    setPartnerForm({ company: '', name: '', email: '', phone: '', message: '' });
  };

  const menuItems = [
    { 
      icon: User, 
      label: t('editProfile'), 
      action: () => { 
        setEditForm({ name: user.name, email: user.email, phone: user.phone || '' }); 
        setActiveModal('editProfile'); 
      } 
    },
    { 
      icon: MapPin, 
      label: t('savedLocations'), 
      action: () => setActiveModal('savedLocations') 
    },
    {
      icon: CreditCard,
      label: t('paymentMethods'),
      action: () => setActiveModal('paymentMethods')
    },
    { 
      icon: Settings, 
      label: t('appSettings'), 
      action: () => setActiveModal('settings') 
    },
    { 
      icon: Clock, 
      label: t('pickupHistory'), 
      action: () => setActiveModal('history') 
    },
    { 
      icon: Users, 
      label: t('partnershipProgram'), 
      action: () => setActiveModal('partnership') 
    },
    { 
      icon: HelpCircle, 
      label: t('helpSupport'), 
      action: () => setActiveModal('support') 
    },
  ];

  // Prepare saved locations to display as pins in CollectionMap
  const savedLocationPoints = user.savedLocations.map((loc: SavedLocation) => ({
    id: loc.id,
    name: loc.name,
    coordinates: loc.coordinates,
    type: 'partner', // Reusing partner type for styling
    address: loc.address,
    isDBKK: false
  }));

  return (
    <div className="space-y-6 pb-20 pt-6 px-4">
      <h1 className="text-3xl font-bold dark:text-white mb-4">{t('profile')}</h1>
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm text-center mb-6">
         <div className="w-24 h-24 bg-primary-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
           <User className="w-10 h-10 text-white" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
         <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
         {user.phone && <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{user.phone}</p>}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
         <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-3xl flex flex-col justify-between h-32">
            <Truck className="w-8 h-8 text-green-600 mb-2" />
            <div>
               <p className="text-3xl font-bold text-gray-900 dark:text-white">{user.stats.totalPickups}</p>
               <p className="text-xs font-bold text-gray-500 uppercase mt-1">{t('totalPickups')}</p>
            </div>
         </div>
         <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-3xl flex flex-col justify-between h-32">
            <Award className="w-8 h-8 text-yellow-600 mb-2" />
            <div>
               <p className="text-3xl font-bold text-gray-900 dark:text-white">{user.stats.rewardPoints}</p>
               <p className="text-xs font-bold text-gray-500 uppercase mt-1">{t('rewardPoints')}</p>
            </div>
         </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl mb-8 flex flex-col justify-center items-start h-32 relative overflow-hidden">
         <Recycle className="w-12 h-12 text-blue-500 absolute top-4 right-4 opacity-20" />
         <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{user.stats.itemsRecycled}</p>
         <p className="text-sm font-bold text-gray-500 uppercase">{t('itemsRecycled')}</p>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item: any, i) => (
          <div 
            key={i} 
            onClick={item.action}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.99] transition-transform shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <item.icon className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={1.5} />
              <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
        
        <div 
          onClick={onLogout}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.99] transition-transform shadow-sm mt-6 text-red-500"
        >
          <div className="flex items-center space-x-4">
             <LogOut className="w-6 h-6" strokeWidth={1.5} />
             <span className="font-bold text-sm">{t('signOut')}</span>
          </div>
        </div>
      </div>

      {/* -- Modals -- */}

      {/* Edit Profile Modal */}
      <Modal isOpen={activeModal === 'editProfile'} onClose={closeModal} title={t('editProfile')}>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">{t('name')}</label><input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">{t('email')}</label><input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">{t('phone')}</label><input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <Button className="w-full mt-4" onClick={handleSaveProfile}>{t('saveChanges')}</Button>
        </div>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal isOpen={activeModal === 'paymentMethods'} onClose={closeModal} title={t('paymentMethods')}>
        {isAddingPayment ? (
          <div className="space-y-4">
             <h4 className="text-sm font-bold dark:text-white mb-2">{t('addPaymentMethod')}</h4>
             
             {/* Type Selector */}
             <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
               <button 
                 onClick={() => setPaymentForm({...paymentForm, type: 'ewallet'})}
                 className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${paymentForm.type === 'ewallet' ? 'bg-white dark:bg-gray-600 shadow text-primary-600' : 'text-gray-500'}`}
               >
                 {t('ewallet')}
               </button>
               <button 
                 onClick={() => setPaymentForm({...paymentForm, type: 'bank'})}
                 className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${paymentForm.type === 'bank' ? 'bg-white dark:bg-gray-600 shadow text-primary-600' : 'text-gray-500'}`}
               >
                 {t('bankTransfer')}
               </button>
             </div>

             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{paymentForm.type === 'bank' ? t('bankName') : t('ewalletProvider')}</label>
               <input value={paymentForm.provider} onChange={e => setPaymentForm({...paymentForm, provider: e.target.value})} placeholder={paymentForm.type === 'bank' ? "e.g. Maybank, CIMB" : "e.g. TNG eWallet, GrabPay"} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" />
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{t('accountNumber')}</label>
               <input value={paymentForm.accountNumber} onChange={e => setPaymentForm({...paymentForm, accountNumber: e.target.value})} placeholder="Account No. / Phone No." className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" />
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">{t('accountHolder')}</label>
               <input value={paymentForm.accountHolder} onChange={e => setPaymentForm({...paymentForm, accountHolder: e.target.value})} placeholder="Full Name" className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" />
             </div>
             <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => setIsAddingPayment(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSavePaymentMethod} className="flex-1">{t('saveMethod')}</Button>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            {user.paymentMethods.length === 0 ? (
               <p className="text-center text-gray-500 py-4">{t('noPaymentMethods')}</p>
            ) : (
               user.paymentMethods.map((pm: PaymentMethod) => (
                 <div key={pm.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                       {pm.type === 'bank' ? <Landmark className="w-8 h-8 text-blue-600" /> : <Wallet className="w-8 h-8 text-orange-600" />}
                       <div>
                          <p className="font-bold text-sm dark:text-white">{pm.provider}</p>
                          <p className="text-xs text-gray-500">{pm.accountNumber}</p>
                          <p className="text-[10px] text-gray-400 uppercase">{pm.accountHolder}</p>
                       </div>
                    </div>
                    <button 
                       onClick={() => onUpdateUser({ paymentMethods: user.paymentMethods.filter((p: PaymentMethod) => p.id !== pm.id) })}
                       className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                       <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               ))
            )}
            <Button className="w-full py-3" onClick={() => setIsAddingPayment(true)}>{t('addPaymentMethod')}</Button>
          </div>
        )}
      </Modal>

      {/* Saved Locations Modal */}
      <Modal isOpen={activeModal === 'savedLocations'} onClose={closeModal} title={t('savedLocations')}>
        {isAddingLocation ? (
          <div className="space-y-4">
             <div className="text-sm text-gray-500 mb-2">Tap on map to pin new location.</div>
             <TrackingMap 
                interactive 
                onLocationSelect={(coords: any, address: string) => setNewLocationDetails({...newLocationDetails, coordinates: coords, address: address })} 
             />
             {newLocationDetails.coordinates && (
               <>
                 <div><label className="text-xs font-bold text-gray-500 uppercase">Location Name</label><input value={newLocationDetails.name} onChange={e => setNewLocationDetails({...newLocationDetails, name: e.target.value})} placeholder="e.g. Grandma's House" className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" /></div>
                 <div><label className="text-xs font-bold text-gray-500 uppercase">Address</label><input value={newLocationDetails.address} onChange={e => setNewLocationDetails({...newLocationDetails, address: e.target.value})} placeholder="Full Address" className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" /></div>
               </>
             )}
             <div className="flex gap-2 pt-2">
                <Button variant="secondary" onClick={() => setIsAddingLocation(false)} className="flex-1">Back</Button>
                <Button onClick={handleSaveLocation} disabled={!newLocationDetails.coordinates} className="flex-1">Save</Button>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Map Placeholder showing Saved Locations */}
            <div className="h-48 rounded-2xl overflow-hidden relative">
               <CollectionMap points={savedLocationPoints} />
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 dark:text-white">{t('myLocations')}</h3>
              <div className="space-y-3">
                {user.savedLocations.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No saved locations yet.</p>
                ) : (
                  user.savedLocations.map((loc: SavedLocation) => (
                    <div 
                      key={loc.id} 
                      onClick={() => openInGoogleMaps(loc.coordinates.lat, loc.coordinates.lng)}
                      className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.99] transition-transform group"
                    >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                              <p className="font-bold text-sm dark:text-white flex items-center">{loc.name} <ExternalLink className="w-3 h-3 ml-1 text-gray-400 group-hover:text-blue-500 transition-colors" /></p>
                              <p className="text-xs text-gray-500 max-w-[200px] leading-tight mt-0.5">{loc.address}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onUpdateUser({ savedLocations: user.savedLocations.filter((l: SavedLocation) => l.id !== loc.id) }); }}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Button className="w-full py-4 rounded-xl text-sm font-bold shadow-green-500/20" onClick={() => setIsAddingLocation(true)}>{t('addNewLocation')}</Button>
          </div>
        )}
      </Modal>

      {/* Restored Settings Modal */}
      <Modal isOpen={activeModal === 'settings'} onClose={closeModal} title={t('appSettings')}>
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                 <span className="font-medium dark:text-white">{t('darkMode')}</span>
              </div>
              <div 
                onClick={() => onUpdateSetting('darkMode', !settings.darkMode)}
                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${settings.darkMode ? 'bg-primary-500' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${settings.darkMode ? 'left-7' : 'left-1'}`}></div>
              </div>
           </div>
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                 <span className="font-medium dark:text-white">{t('notifications')}</span>
              </div>
              <div 
                onClick={() => onUpdateSetting('notifications', !settings.notifications)}
                className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${settings.notifications ? 'bg-primary-500' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${settings.notifications ? 'left-7' : 'left-1'}`}></div>
              </div>
           </div>
           <div>
              <div className="flex items-center space-x-3 mb-3">
                 <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                 <span className="font-medium dark:text-white">{t('language')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <button 
                   onClick={() => onUpdateSetting('lang', 'en')} 
                   className={`py-2 rounded-lg text-sm font-medium border ${settings.lang === 'en' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 dark:border-gray-600 dark:text-white'}`}
                 >English</button>
                 <button 
                   onClick={() => onUpdateSetting('lang', 'ms')} 
                   className={`py-2 rounded-lg text-sm font-medium border ${settings.lang === 'ms' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 dark:border-gray-600 dark:text-white'}`}
                 >Melayu</button>
              </div>
           </div>
           <div className="pt-4 border-t dark:border-gray-700 space-y-3">
              <button onClick={() => setActiveModal('privacy')} className="w-full flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                 <span>{t('privacy')}</span> <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </Modal>

      {/* Restored Pickup History Modal */}
      <Modal isOpen={activeModal === 'history'} onClose={closeModal} title={t('pickupHistory')}>
        <div className="space-y-3">
          {pickups.length === 0 ? (
             <p className="text-center text-gray-500 py-6">No pickup history found.</p>
          ) : (
             pickups.map((p: Pickup) => (
                <Card key={p.id} className="flex justify-between items-center">
                   <div>
                      <p className="font-bold text-sm dark:text-white">{p.items.join(', ')}</p>
                      <p className="text-xs text-gray-500">{p.date} • {p.time}</p>
                   </div>
                   <Badge color={p.status === 'completed' ? 'gray' : 'green'}>{p.status}</Badge>
                </Card>
             ))
          )}
        </div>
      </Modal>

      {/* Restored Partnership Modal */}
      <Modal isOpen={activeModal === 'partnership'} onClose={closeModal} title={t('partnershipProgram')}>
         {isPartnerSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 animate-fade-in">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
               </div>
               <h2 className="text-2xl font-bold dark:text-white mb-2">Application Submitted!</h2>
               <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-sm">
                  Thank you for your interest in partnering with e-waste2go. <br/><br/>
                  Our team has received your details and will review your application. You can expect to hear from our partnership department within <strong>3-5 business days</strong> via email.
               </p>
               <Button onClick={closeModal} className="w-full">Done</Button>
            </div>
         ) : (
            <div className="space-y-8">
               <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/30">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                     <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t('partnerHeroTitle')}</h2>
                  <p className="text-primary-100 text-sm leading-relaxed">{t('partnerHeroDesc')}</p>
               </div>
               <div>
                  <h3 className="font-bold text-lg mb-4 dark:text-white">{t('applyPartnership')}</h3>
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">{t('companyName')} *</label>
                        <input value={partnerForm.company} onChange={(e) => setPartnerForm({...partnerForm, company: e.target.value})} placeholder="Your company name" className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none shadow-sm" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">{t('contactPerson')} *</label>
                        <input value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} placeholder="Full name" className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none shadow-sm" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">{t('email')} *</label>
                        <input value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} placeholder="company@example.com" className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none shadow-sm" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">{t('phone')} *</label>
                        <input value={partnerForm.phone} onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})} placeholder="+60 XX-XXX-XXXX" className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none shadow-sm" />
                     </div>
                     <Button onClick={handleSubmitPartnership} className="w-full mt-2">{t('submitApplication')}</Button>
                  </div>
               </div>
            </div>
         )}
      </Modal>

      {/* Restored Support Modal */}
      <Modal isOpen={activeModal === 'support'} onClose={closeModal} title={t('helpCenter')}>
         <div className="space-y-6">
            <div>
               <h3 className="font-bold text-lg mb-4 dark:text-white">{t('contactUs')}</h3>
               <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex items-center justify-between border border-green-100 dark:border-green-800" onClick={() => window.open('tel:+6088232311')}>
                     <div className="flex items-center space-x-4">
                        <Phone className="w-6 h-6 text-green-600" />
                        <div><p className="font-bold text-sm dark:text-white">{t('callUs')}</p><p className="text-xs text-gray-500">+60 88-232311</p></div>
                     </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center justify-between border border-blue-100 dark:border-blue-800" onClick={() => window.open('mailto:support@ewaste2go.my')}>
                     <div className="flex items-center space-x-4">
                        <Mail className="w-6 h-6 text-blue-600" />
                        <div><p className="font-bold text-sm dark:text-white">{t('emailSupport')}</p><p className="text-xs text-gray-500">support@e-waste2go.my</p></div>
                     </div>
                  </div>
               </div>
            </div>
            <div>
               <h3 className="font-bold text-lg mb-4 dark:text-white">{t('faq')}</h3>
               <div className="space-y-3">
                  {[
                     {q: "How do I schedule a pickup?", a: "Navigate to the Home tab and tap the large '+' button or the 'Schedule Pickup' quick action. Fill in your item details, select a date and time, and pin your location on the map."},
                     {q: "What items can I recycle?", a: "We accept a wide range of household electronics including laptops, smartphones, tablets, washing machines, refrigerators, and televisions. For industrial e-waste, please check our Partner section."},
                     {q: "How do points work?", a: "You earn Reward Points for every successful pickup. Generally, 1kg of e-waste earns you 10 points. These points can be converted to cash or redeemed for vouchers in the Rewards tab."}
                  ].map((item, i) => (
                     <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div 
                           className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                           onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        >
                           <p className="font-bold text-sm dark:text-white">{item.q}</p>
                           <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedFaq === i ? 'rotate-90' : ''}`} />
                        </div>
                        {expandedFaq === i && (
                           <div className="px-4 pb-4 pt-0">
                              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-3 animate-fade-in">
                                 {item.a}
                              </p>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </Modal>
      
      {/* Privacy Policy Mock */}
      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal('settings')} title={t('privacy')}>
         <div className="prose dark:prose-invert text-sm p-2"><p>We value your privacy. Your data is used only for e-waste collection.</p></div>
      </Modal>

    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<UserType>(INITIAL_USER);
  const [view, setView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [pickups, setPickups] = useState<Pickup[]>(MOCK_PICKUPS);
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTrackingPickup, setActiveTrackingPickup] = useState<Pickup | null>(null);

  // New State for Location Editing & Driver Arrival
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [locationForm, setLocationForm] = useState({ name: '', address: '', coordinates: { lat: 5.975, lng: 116.09 } });
  const [driverArrived, setDriverArrived] = useState(false);

  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({ 
    items: '', 
    date: '', 
    time: '', 
    address: '', 
    coordinates: null 
  });
  
  const [settings, setSettings] = useState({ notifications: true, locationTracking: true, lang: 'en', darkMode: false });

  const t = useTranslation(settings.lang);
  const activePickup = pickups.find(p => p.status === 'in-transit' || p.status === 'assigned');

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => { setIsAuthenticated(false); setView('home'); };
  
  const handleScheduleSubmit = () => {
    if (!scheduleForm.items || !scheduleForm.date || !scheduleForm.time || !scheduleForm.address) {
       alert("Please fill in all fields and pin a location.");
       return;
    }

    const newPickup: Pickup = {
       id: `pk_${Date.now()}`,
       date: scheduleForm.date,
       time: scheduleForm.time,
       items: scheduleForm.items.split(',').map(s => s.trim()),
       status: 'assigned',
       location: { 
         id: `loc_temp_${Date.now()}`, 
         name: 'Pinned Location', 
         address: scheduleForm.address, 
         coordinates: scheduleForm.coordinates || { lat: 5.98, lng: 116.09 } 
       }
    };
    setPickups([newPickup, ...pickups]);
    alert("Pickup Scheduled! Driver assigned.");
    setScheduleForm({ items: '', date: '', time: '', address: '', coordinates: null }); // Reset
    setView('home');
  };

  const handleTrack = (pickup: Pickup) => {
    setActiveTrackingPickup(pickup);
    setView('tracking');
  };

  const handleUpdateUser = (updates: Partial<UserType>) => {
    setUser({ ...user, ...updates });
  };
  
  const handleCashOut = (points: number) => {
    setUser({ ...user, stats: { ...user.stats, rewardPoints: user.stats.rewardPoints - points }});
    alert(`Cashed out RM ${(points/10).toFixed(2)}`);
  };

  const handleRedeemReward = (reward: Reward) => {
    if (user.stats.rewardPoints >= reward.cost) {
      const newClaim: any = {
        id: `cl_${Date.now()}`,
        rewardId: reward.id,
        name: reward.name,
        imageUrl: reward.imageUrl,
        date: new Date().toLocaleDateString(),
        code: `RW-${Math.floor(Math.random() * 10000)}`
      };
      setUser({ 
        ...user, 
        stats: { ...user.stats, rewardPoints: user.stats.rewardPoints - reward.cost },
        claimedRewards: [newClaim, ...user.claimedRewards]
      });
      alert(`Redeemed ${reward.name}!`);
    }
  };

  // Location Modal Handlers
  const openAddLocation = () => {
    setEditingLocationId(null);
    setLocationForm({ name: '', address: '', coordinates: { lat: 5.975, lng: 116.09 } });
    setIsLocationModalOpen(true);
  };

  const openEditLocation = (loc: SavedLocation) => {
    setEditingLocationId(loc.id);
    setLocationForm({ name: loc.name, address: loc.address, coordinates: loc.coordinates });
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = () => {
    if (!locationForm.name || !locationForm.address) {
        alert("Please enter a name and address.");
        return;
    }
    
    let newLocations = [...user.savedLocations];
    if (editingLocationId) {
      // Edit
      newLocations = newLocations.map(l => l.id === editingLocationId ? { ...l, ...locationForm, id: editingLocationId } : l);
    } else {
      // Add
      newLocations.push({ ...locationForm, id: `loc_${Date.now()}` });
    }
    
    handleUpdateUser({ savedLocations: newLocations });
    setIsLocationModalOpen(false);
  };

  const handleDeleteLocation = (id: string) => {
     if(confirm("Delete this location?")) {
        handleUpdateUser({ savedLocations: user.savedLocations.filter((l: SavedLocation) => l.id !== id) });
     }
  };

  useEffect(() => {
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [settings.darkMode]);

  if (!hasOnboarded) return <Onboarding onComplete={() => setHasOnboarded(true)} />;
  if (!isAuthenticated) return <Auth onLogin={handleLogin} t={t} />;

  if (view === 'tracking') {
     return <TrackingView pickup={activeTrackingPickup} onBack={() => setView('home')} />;
  }

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setView(id)} 
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
    >
      <Icon className={`w-6 h-6 ${view === id ? 'fill-current' : ''}`} strokeWidth={view === id ? 2 : 1.5} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative overflow-hidden shadow-2xl ${settings.darkMode ? 'dark' : ''}`}>
      <div className="h-full overflow-y-auto scrollbar-hide">
        {view === 'home' && (
          <HomeView 
            user={user} 
            activePickup={activePickup} 
            pickups={pickups} 
            onSchedule={() => setView('schedule')}
            onNavigate={setView}
            t={t}
            onViewPickup={(p: any) => alert(`Viewing pickup: ${p.id}`)}
            onTrack={handleTrack}
          />
        )}
        
        {view === 'points' && <CollectionPointsView t={t} />}
        
        {view === 'market' && <MarketplaceView t={t} />}
        
        {view === 'rewards' && <RewardsView user={user} onRedeem={handleRedeemReward} onCashOut={handleCashOut} t={t} />}
        
        {view === 'profile' && (
           <ProfileView 
             user={user} 
             onLogout={handleLogout} 
             settings={settings}
             onUpdateSetting={(k: string, v: any) => setSettings({...settings, [k]: v})}
             t={t}
             pickups={pickups}
             onUpdateUser={handleUpdateUser}
           />
        )}

        {view === 'guide' && <GuideView t={t} />}

        {view === 'schedule' && (
           <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-20">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/50 to-transparent">
                  <div className="flex items-center text-white">
                      <button onClick={() => setView('home')} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors mr-3">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <h1 className="text-xl font-bold shadow-sm">Schedule Pickup</h1>
                  </div>
              </div>
              
              {/* Map Section */}
              <div className="w-full h-[45vh] relative z-10">
                  <TrackingMap 
                       interactive 
                       onLocationSelect={(coords: any, addr: string) => setScheduleForm({...scheduleForm, coordinates: coords, address: addr})} 
                       className="h-full rounded-b-3xl shadow-lg border-b-4 border-white dark:border-gray-800"
                  />
                  <div className="absolute bottom-[-15px] left-0 right-0 flex justify-center z-20">
                     <div className="bg-white/90 backdrop-blur text-[10px] font-medium text-gray-500 px-3 py-1 rounded-full shadow border border-gray-200">
                        Navigation will open in Google Maps for real-time directions
                     </div>
                  </div>
              </div>
              
              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 z-20 relative bg-gray-50 dark:bg-gray-900">
                  
                  {/* My Locations Selection */}
                  <div className="mb-8">
                      <div className="flex justify-between items-center mb-4 px-1">
                          <h3 className="font-bold text-lg dark:text-white">My Locations</h3>
                      </div>
                      
                      <div className="space-y-4">
                          {user.savedLocations.map((loc: SavedLocation) => (
                              <div 
                                key={loc.id}
                                className={`bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all ${scheduleForm.address === loc.address ? 'ring-2 ring-primary-500' : ''}`}
                                onClick={() => setScheduleForm({...scheduleForm, address: loc.address, coordinates: loc.coordinates})}
                              >
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center">
                                          <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg mr-3">
                                              <Home className="w-5 h-5 text-primary-600" />
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-gray-900 dark:text-white">{loc.name}</h4>
                                              <p className="text-xs text-gray-500 font-mono mt-0.5">Lat: {loc.coordinates.lat.toFixed(4)} | Lng: {loc.coordinates.lng.toFixed(4)}</p>
                                          </div>
                                      </div>
                                      {scheduleForm.address === loc.address && <CheckCircle className="w-5 h-5 text-primary-600" />}
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 pl-1">{loc.address}</p>
                                  
                                  <div className="flex gap-2">
                                      <Button 
                                        size="sm" variant="outline" 
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            openInGoogleMaps(loc.coordinates.lat, loc.coordinates.lng);
                                        }}
                                      >
                                          <ExternalLink className="w-3 h-3 mr-1" /> Open Maps
                                      </Button>
                                      <Button 
                                        size="sm" variant="outline" 
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            openEditLocation(loc);
                                        }}
                                      >
                                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                                      </Button>
                                      <Button 
                                        size="sm" variant="dangerOutline" 
                                        onClick={(e: any) => { 
                                            e.stopPropagation(); 
                                            handleDeleteLocation(loc.id);
                                        }}
                                      >
                                          <Trash2 className="w-3 h-3" />
                                      </Button>
                                  </div>
                              </div>
                          ))}
                          
                          <button 
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-transform flex items-center justify-center uppercase tracking-wide text-sm"
                            onClick={openAddLocation}
                          >
                             <Plus className="w-5 h-5 mr-2" /> Add New Location
                          </button>
                      </div>
                  </div>

                  {/* Driver Pickup Interaction (Simulation) */}
                  <div className="mb-24 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className={`rounded-2xl p-5 border shadow-sm transition-colors duration-500 ${driverArrived ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                          <div className="flex justify-between items-start mb-4">
                              <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                                  <Truck className={`w-5 h-5 mr-2 ${driverArrived ? 'text-green-600' : 'text-blue-500'}`} />
                                  {driverArrived ? 'Driver Has Arrived' : 'Driver Pickup Interaction'}
                              </h4>
                              {driverArrived && <Badge color="green">Confirmed</Badge>}
                          </div>
                          
                          {driverArrived ? (
                              <div className="text-center py-2 animate-fade-in">
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <CheckCircle className="w-6 h-6 text-green-600" />
                                  </div>
                                  <p className="text-green-700 font-bold text-sm">You are at the pickup point!</p>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="mt-3 w-full border-green-200 text-green-700 hover:bg-green-100"
                                    onClick={() => setDriverArrived(false)}
                                  >
                                      Reset Simulation
                                  </Button>
                              </div>
                          ) : (
                              <>
                                  <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-500/30" 
                                    onClick={() => setDriverArrived(true)}
                                  >
                                      Arrived at Pickup Point
                                  </Button>
                                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Arrival is confirmed when GPS distance is within 50 meters
                                  </p>
                              </>
                          )}
                      </div>
                  </div>

              </div>
           </div>
        )}
      </div>

      {/* Location Editor Modal */}
      <Modal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} title={editingLocationId ? "Edit Location" : "Add New Location"}>
         <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start">
               <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
               <p className="text-xs text-blue-700 dark:text-blue-300">Tap on the map to pinpoint the exact location, then fill in the details below.</p>
            </div>
            
            {/* Interactive Map Picker inside Modal */}
            <div className="h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
               <TrackingMap 
                  interactive 
                  onLocationSelect={(coords: any, address: string) => setLocationForm(prev => ({ ...prev, coordinates: coords, address: address }))} 
                  className="h-full rounded-none"
               />
               <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-[10px] px-2 py-1 rounded shadow pointer-events-none">
                  Lat: {locationForm.coordinates?.lat.toFixed(4)}, Lng: {locationForm.coordinates?.lng.toFixed(4)}
               </div>
            </div>

            <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location Name</label>
               <input 
                 value={locationForm.name} 
                 onChange={e => setLocationForm({...locationForm, name: e.target.value})} 
                 placeholder="e.g. Home, Office, Warehouse" 
                 className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500" 
               />
            </div>
            <div>
               <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Address</label>
               <textarea 
                 value={locationForm.address} 
                 onChange={e => setLocationForm({...locationForm, address: e.target.value})} 
                 placeholder="Full street address..." 
                 className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]" 
               />
            </div>
            
            <div className="flex gap-2 pt-2">
               <Button variant="secondary" onClick={() => setIsLocationModalOpen(false)} className="flex-1">Cancel</Button>
               <Button onClick={handleSaveLocation} className="flex-1">Save Location</Button>
            </div>
         </div>
      </Modal>

      {view !== 'schedule' && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 h-20 px-2 pb-4 pt-2 z-40 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
           <NavItem id="home" icon={Home} label={t('home')} />
           <NavItem id="points" icon={MapIcon} label={t('points')} />
           <div className="relative -top-6">
             <button 
               onClick={() => setView('schedule')}
               className="w-14 h-14 bg-primary-600 rounded-full shadow-lg shadow-primary-500/40 flex items-center justify-center text-white transform transition-transform active:scale-90 hover:scale-105"
             >
               <Plus className="w-8 h-8" />
             </button>
           </div>
           <NavItem id="rewards" icon={Award} label={t('rewards')} />
           <NavItem id="profile" icon={User} label={t('profile')} />
        </div>
      )}
    </div>
  );
};

export default App;
