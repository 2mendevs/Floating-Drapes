import React, { useState, useEffect, useRef } from 'react';
import { 
  X, LogIn, LogOut, Lock, Mail, Heading, Palette, Type, 
  ShoppingBag, Trash2, Edit2, Plus, Save, Check, 
  Layers, FolderOpen, Eye, Inbox, FileText, Link, HelpCircle,
  Database, RefreshCw, Copy, CheckCheck, UploadCloud, DownloadCloud,
  AlertCircle, ShieldCheck, Wifi, WifiOff, Sparkles, ExternalLink,
  Star, MessageSquare, Upload, User, Image as ImageIcon, Search,
  Filter, CheckCircle2, ArrowUpRight, Camera
} from 'lucide-react';
import { CurtainItem, WallpaperItem, SiteConfig, BookingSubmission, Testimonial, UploadedImage, DEFAULT_SITE_CONFIG } from '../types';
import { BlindItem } from '../data/productsData';
import { motion, AnimatePresence } from 'motion/react';
import CustomerAvatar from './CustomerAvatar';
import { 
  getSupabaseCredentials,
  getSupabaseClient,
  saveSupabaseCredentials,
  clearStoredSupabaseCredentials,
  isSupabaseConfigured,
  testSupabaseConnection,
  fetchUniversalSiteData,
  syncSiteConfigToSupabase,
  upsertCurtainToSupabase,
  deleteCurtainFromSupabase,
  upsertWallpaperToSupabase,
  deleteWallpaperFromSupabase,
  upsertBlindToSupabase,
  deleteBlindFromSupabase,
  upsertFeedbackToSupabase,
  deleteFeedbackFromSupabase,
  deleteBookingFromSupabase,
  deleteInquiryFromSupabase,
  seedDefaultCatalogToSupabase,
  uploadImageToSupabase,
  fetchUploadedImagesFromSupabase,
  deleteUploadedImageFromSupabase,
  getStoredUploadedImages,
  SUPABASE_SQL_SCHEMA
} from '../services/supabaseClient';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  curtains: CurtainItem[];
  setCurtains: React.Dispatch<React.SetStateAction<CurtainItem[]>>;
  wallpapers: WallpaperItem[];
  setWallpapers: React.Dispatch<React.SetStateAction<WallpaperItem[]>>;
  blinds: BlindItem[];
  setBlinds: React.Dispatch<React.SetStateAction<BlindItem[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

export default function AdminPanel({
  isOpen,
  onClose,
  siteConfig,
  onUpdateConfig,
  curtains,
  setCurtains,
  wallpapers,
  setWallpapers,
  blinds,
  setBlinds,
  testimonials,
  setTestimonials
}: AdminPanelProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState<boolean>(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Inactivity auto-logout timer ref (15 minutes limit)
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active control panel tab
  const [activeTab, setActiveTab] = useState<'sections' | 'captions' | 'theme' | 'products' | 'media' | 'feedback' | 'inquiries' | 'database'>('sections');

  // Media Library & Image Uploading states
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'curtains' | 'wallpapers' | 'blinds' | 'hero' | 'gallery' | 'general'>('general');
  const [uploadTitle, setUploadTitle] = useState('');
  const [previewModalImage, setPreviewModalImage] = useState<UploadedImage | null>(null);
  const [isUploadingProductInline, setIsUploadingProductInline] = useState(false);

  // Captions form state
  const [captions, setCaptions] = useState<SiteConfig>({ ...siteConfig });

  // Product tab states
  const [selectedProductCategory, setSelectedProductCategory] = useState<'curtains' | 'wallpapers' | 'blinds'>('curtains');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // New product form states
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    description: '',
    image: '',
    priceClass: 'Premium', // curtains
    style: 'Classic', // wallpapers / blinds
    materials: ''
  });

  // Feedback Master Controller states
  const [editingFeedback, setEditingFeedback] = useState<Testimonial | null>(null);
  const [isAddingFeedback, setIsAddingFeedback] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState('');
  const [isUploadingFeedbackImage, setIsUploadingFeedbackImage] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<Testimonial>({
    id: '',
    name: '',
    location: '',
    role: '',
    review: '',
    rating: 5,
    image: ''
  });

  // Submitted private bookings state & contact inquiries state
  const [bookings, setBookings] = useState<BookingSubmission[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Supabase connection and configuration states
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isSupabaseFromEnv, setIsSupabaseFromEnv] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'disconnected' | 'testing' | 'unconfigured'>('unconfigured');
  const [supabaseStatusMessage, setSupabaseStatusMessage] = useState('');
  const [isSeedingDatabase, setIsSeedingDatabase] = useState(false);
  const [isPullingData, setIsPullingData] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Reset inactivity timer on user actions
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (isAuthenticated) {
      inactivityTimerRef.current = setTimeout(() => {
        handleLogout();
        alert('You have been logged out of the Admin Panel due to 15 minutes of inactivity.');
      }, INACTIVITY_TIMEOUT_MS);
    }
  };

  // Activity listeners for automatic logout
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => resetInactivityTimer();

    activityEvents.forEach((evt) => window.addEventListener(evt, handleActivity));
    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      activityEvents.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [isAuthenticated]);

  // Verify server session token or active Supabase session on mount/open
  useEffect(() => {
    const token = sessionStorage.getItem('fd_admin_token');
    
    // Check if Supabase client already has an active session
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          setIsAuthenticated(true);
          sessionStorage.setItem('fd_admin_user_email', data.session.user.email || '');
          setIsVerifyingSession(false);
          return;
        }
      }).catch((e) => console.warn('Supabase getSession error:', e));
    }

    if (!token) {
      setIsAuthenticated(false);
      setIsVerifyingSession(false);
      return;
    }

    if (token.startsWith('sb.')) {
      setIsAuthenticated(true);
      setIsVerifyingSession(false);
      return;
    }

    fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.valid) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('fd_admin_token');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsVerifyingSession(false);
      });
  }, [isOpen]);

  // Load Supabase credentials & initial data on mount/open
  useEffect(() => {
    setCaptions({
      ...DEFAULT_SITE_CONFIG,
      ...siteConfig,
      categoryShowcase: {
        curtains: {
          ...DEFAULT_SITE_CONFIG.categoryShowcase!.curtains,
          ...(siteConfig?.categoryShowcase?.curtains || {})
        },
        wallpapers: {
          ...DEFAULT_SITE_CONFIG.categoryShowcase!.wallpapers,
          ...(siteConfig?.categoryShowcase?.wallpapers || {})
        },
        blinds: {
          ...DEFAULT_SITE_CONFIG.categoryShowcase!.blinds,
          ...(siteConfig?.categoryShowcase?.blinds || {})
        }
      }
    });
    
    // Load stored credentials
    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url);
    setSupabaseKey(creds.key);
    setIsSupabaseFromEnv(creds.isFromEnv);

    if (creds.url && creds.key) {
      setSupabaseStatus('testing');
      testSupabaseConnection().then(res => {
        if (res.success) {
          setSupabaseStatus('connected');
          setSupabaseStatusMessage(res.message);
        } else {
          setSupabaseStatus('disconnected');
          setSupabaseStatusMessage(res.message);
        }
      });
    } else {
      setSupabaseStatus('unconfigured');
      setSupabaseStatusMessage('Supabase credentials have not been configured yet.');
    }

    // Load local storage bookings as fallback
    const storedBookings = localStorage.getItem('floatingdrapes_bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        console.error(e);
      }
    }

    // Load local storage contact inquiries as fallback
    const storedContacts = localStorage.getItem('floatingdrapes_contacts');
    if (storedContacts) {
      try {
        setInquiries(JSON.parse(storedContacts));
      } catch (e) {
        console.error(e);
      }
    }

    // Load uploaded media images from Supabase or local cache
    fetchUploadedImagesFromSupabase().then(images => {
      if (images) {
        setUploadedImages(images);
      }
    });

    // If Supabase is configured, fetch live records for inquiries
    if (isSupabaseConfigured()) {
      fetchUniversalSiteData().then(data => {
        if (data.bookings && data.bookings.length > 0) {
          setBookings(data.bookings);
        }
        if (data.inquiries && data.inquiries.length > 0) {
          setInquiries(data.inquiries);
        }
        if (data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      });
    }
  }, [siteConfig, isOpen]);

  // Database connection indicating light helper
  const renderIndicatorLight = (size: 'sm' | 'md' = 'sm') => {
    const isGreen = supabaseStatus === 'connected';
    const isYellow = supabaseStatus === 'testing';
    const dotSize = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5';
    const pingSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

    return (
      <div 
        className="relative inline-flex items-center justify-center cursor-default"
        title={isGreen ? 'Database: Connected (Green)' : isYellow ? 'Database: Trying to connect / checking (Yellow)' : 'Database: Disconnected (Red)'}
      >
        {isGreen && (
          <>
            <span className={`animate-ping absolute inline-flex ${pingSize} rounded-full bg-emerald-400 opacity-75`} />
            <span className={`relative inline-flex rounded-full ${dotSize} bg-emerald-500 shadow-[0_0_10px_#10b981]`} />
          </>
        )}
        {isYellow && (
          <>
            <span className={`animate-ping absolute inline-flex ${pingSize} rounded-full bg-amber-400 opacity-75`} />
            <span className={`relative inline-flex rounded-full ${dotSize} bg-amber-400 shadow-[0_0_10px_#f59e0b]`} />
          </>
        )}
        {!isGreen && !isYellow && (
          <span className={`relative inline-flex rounded-full ${dotSize} bg-rose-500 shadow-[0_0_8px_#f43f5e]`} />
        )}
      </div>
    );
  };

  // Handle Login via Supabase Auth or Backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingLogin(true);

    const cleanEmail = email.trim();

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          });

          if (!sbError && sbData?.user) {
            const timestamp = Date.now();
            sessionStorage.setItem('fd_admin_token', `sb.${timestamp}.${sbData.user.id}`);
            sessionStorage.setItem('fd_admin_user_email', sbData.user.email || cleanEmail);
            setIsAuthenticated(true);
            setAuthError('');
            setPassword('');
            setIsSubmittingLogin(false);
            resetInactivityTimer();
            return;
          }
        } catch (supabaseLoginErr: any) {
          console.warn('Supabase client login attempt:', supabaseLoginErr?.message);
        }
      }

      const creds = getSupabaseCredentials();
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: cleanEmail, 
          password,
          customSupabaseUrl: creds.url,
          customSupabaseKey: creds.key
        })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`API endpoint unavailable (Status: ${res.status}).`);
      }

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('fd_admin_token', data.token);
        if (data.user?.email) {
          sessionStorage.setItem('fd_admin_user_email', data.user.email);
        }
        setIsAuthenticated(true);
        setAuthError('');
        setPassword('');
        resetInactivityTimer();
      } else {
        setAuthError(data.error || 'Invalid credentials. User not found in Supabase Auth or server.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Sign out:', e);
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('fd_admin_token');
    sessionStorage.removeItem('fd_admin_user_email');
    localStorage.removeItem('floatingdrapes_admin_auth');
  };

  // Save Site Captions & sync to Supabase universally
  const handleSaveCaptions = async () => {
    onUpdateConfig(captions);
    localStorage.setItem('floatingdrapes_config', JSON.stringify(captions));

    if (isSupabaseConfigured()) {
      const success = await syncSiteConfigToSupabase(captions);
      if (success) {
        alert('Captions and site configuration saved universally to Supabase!');
      } else {
        alert('Saved locally. Note: Supabase database sync encountered an issue. Check connection settings in the Database tab.');
      }
    } else {
      alert('Captions saved locally! (Connect Supabase in the Database tab to sync universally).');
    }
  };

  // Save Theme & Fonts & sync to Supabase universally
  const handleSaveTheme = async (themePreset: 'sapphire' | 'amber' | 'emerald' | 'crimson' | 'obsidian', fontPreset: 'jakarta_playfair' | 'inter_cinzel' | 'outfit_bodoni') => {
    const updated = {
      ...captions,
      themePreset,
      fontPreset
    };
    setCaptions(updated);
    onUpdateConfig(updated);
    localStorage.setItem('floatingdrapes_config', JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      await syncSiteConfigToSupabase(updated);
    }
  };

  // Update Brand Logo Link & sync to Supabase universally
  const handleSaveLogo = async (logoUrl: string) => {
    const updated = {
      ...captions,
      brandLogoUrl: logoUrl
    };
    setCaptions(updated);
    onUpdateConfig(updated);
    localStorage.setItem('floatingdrapes_config', JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      await syncSiteConfigToSupabase(updated);
      alert('Brand logo link updated and synchronized universally in Supabase!');
    } else {
      alert('Brand logo link updated successfully!');
    }
  };

  // Save all Showcase & Page Sections universally
  const handleSaveShowcaseSections = async () => {
    onUpdateConfig(captions);
    localStorage.setItem('floatingdrapes_config', JSON.stringify(captions));

    if (isSupabaseConfigured()) {
      const success = await syncSiteConfigToSupabase(captions);
      if (success) {
        alert('All Homepage & Section changes saved and synced universally to Supabase!');
      } else {
        alert('Saved locally. Note: Supabase database sync encountered an issue. Check connection in the Database tab.');
      }
    } else {
      alert('Homepage & Section changes saved locally! (Connect Supabase to sync universally).');
    }
  };

  // Upload Homepage Hero Image
  const handleUploadHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImageToSupabase(file, {
        category: 'hero',
        title: 'Homepage Hero Luxury Living Room'
      });

      if (res.data?.file_url) {
        const newUrl = res.data.file_url;
        const updated: SiteConfig = {
          ...captions,
          heroImageUrl: newUrl
        };
        setCaptions(updated);
        onUpdateConfig(updated);
        localStorage.setItem('floatingdrapes_config', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await syncSiteConfigToSupabase(updated);
        }
        const fresh = await fetchUploadedImagesFromSupabase();
        setUploadedImages(fresh);
        alert('Homepage Hero photo uploaded and synced universally to Supabase!');
      }
    } catch (err: any) {
      alert('Error uploading hero image: ' + (err?.message || 'Upload failed'));
    }
  };

  // Upload Dedicated Showcase Thumbnail
  const handleUploadShowcaseThumbnail = async (
    category: 'curtains' | 'wallpapers' | 'blinds',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImageToSupabase(file, {
        category: category,
        title: `${category} showcase card thumbnail`
      });

      if (res.data?.file_url) {
        const newUrl = res.data.file_url;
        const baseShowcase = captions.categoryShowcase || DEFAULT_SITE_CONFIG.categoryShowcase!;
        const currentItem = baseShowcase[category] || DEFAULT_SITE_CONFIG.categoryShowcase![category];

        const updated: SiteConfig = {
          ...captions,
          categoryShowcase: {
            ...baseShowcase,
            [category]: {
              ...currentItem,
              thumbnail: newUrl
            }
          },
          categoryImages: {
            ...(captions.categoryImages || {}),
            [category]: newUrl
          }
        };

        setCaptions(updated);
        onUpdateConfig(updated);
        localStorage.setItem('floatingdrapes_config', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await syncSiteConfigToSupabase(updated);
        }
        const fresh = await fetchUploadedImagesFromSupabase();
        setUploadedImages(fresh);
        alert(`${category.toUpperCase()} dedicated thumbnail updated and synced universally to Supabase!`);
      }
    } catch (err: any) {
      alert('Error uploading thumbnail: ' + (err?.message || 'Upload failed'));
    }
  };

  // Upload Tailor-Made Customization Image
  const handleUploadCustomizationImage = async (
    type: 'curtains' | 'wallpaper',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImageToSupabase(file, {
        category: type === 'curtains' ? 'curtains' : 'wallpapers',
        title: `Tailor-Made Customization ${type}`
      });

      if (res.data?.file_url) {
        const newUrl = res.data.file_url;
        const updated: SiteConfig = {
          ...captions,
          [type === 'curtains' ? 'customizationCurtainsImage' : 'customizationWallpaperImage']: newUrl
        };

        setCaptions(updated);
        onUpdateConfig(updated);
        localStorage.setItem('floatingdrapes_config', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await syncSiteConfigToSupabase(updated);
        }
        const fresh = await fetchUploadedImagesFromSupabase();
        setUploadedImages(fresh);
        alert(`Tailor-Made ${type.toUpperCase()} customization image updated and synced universally to Supabase!`);
      }
    } catch (err: any) {
      alert('Error uploading customization photo: ' + (err?.message || 'Upload failed'));
    }
  };

  // Upload Why Choose Us Section Image
  const handleUploadWhyChooseUsImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImageToSupabase(file, {
        category: 'why_choose_us',
        title: 'Why Choose Us Luxury Drapes Feature'
      });

      if (res.data?.file_url) {
        const newUrl = res.data.file_url;
        const updated: SiteConfig = {
          ...captions,
          whyChooseUsImageUrl: newUrl
        };

        setCaptions(updated);
        onUpdateConfig(updated);
        localStorage.setItem('floatingdrapes_config', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await syncSiteConfigToSupabase(updated);
        }
        const fresh = await fetchUploadedImagesFromSupabase();
        setUploadedImages(fresh);
        alert('Why Choose Us showcase photo uploaded and synced universally to Supabase!');
      }
    } catch (err: any) {
      alert('Error uploading Why Choose Us photo: ' + (err?.message || 'Upload failed'));
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, category: 'curtains' | 'wallpapers' | 'blinds') => {
    if (!window.confirm('Are you absolutely sure you want to delete this product?')) return;

    if (category === 'curtains') {
      const updated = curtains.filter(p => p.id !== id);
      setCurtains(updated);
      localStorage.setItem('floatingdrapes_curtains', JSON.stringify(updated));
      if (isSupabaseConfigured()) {
        await deleteCurtainFromSupabase(id);
      }
    } else if (category === 'wallpapers') {
      const updated = wallpapers.filter(p => p.id !== id);
      setWallpapers(updated);
      localStorage.setItem('floatingdrapes_wallpapers', JSON.stringify(updated));
      if (isSupabaseConfigured()) {
        await deleteWallpaperFromSupabase(id);
      }
    } else {
      const updated = blinds.filter(p => p.id !== id);
      setBlinds(updated);
      localStorage.setItem('floatingdrapes_blinds', JSON.stringify(updated));
      if (isSupabaseConfigured()) {
        await deleteBlindFromSupabase(id);
      }
    }
  };

  // Save / Edit Product
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const materialsArray = productForm.materials
      ? productForm.materials.split(',').map(m => m.trim()).filter(m => m !== '')
      : [];

    if (isAddingProduct) {
      const newId = selectedProductCategory[0] + '-' + Date.now();
      const newProduct: any = {
        id: newId,
        name: productForm.name,
        description: productForm.description,
        image: productForm.image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
        materials: materialsArray
      };

      if (selectedProductCategory === 'curtains') {
        newProduct.priceClass = productForm.priceClass;
        const updated = [newProduct, ...curtains];
        setCurtains(updated);
        localStorage.setItem('floatingdrapes_curtains', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await upsertCurtainToSupabase(newProduct);
        }
      } else if (selectedProductCategory === 'wallpapers') {
        newProduct.style = productForm.style;
        const updated = [newProduct, ...wallpapers];
        setWallpapers(updated);
        localStorage.setItem('floatingdrapes_wallpapers', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await upsertWallpaperToSupabase(newProduct);
        }
      } else {
        newProduct.style = productForm.style;
        const updated = [newProduct, ...blinds];
        setBlinds(updated);
        localStorage.setItem('floatingdrapes_blinds', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await upsertBlindToSupabase(newProduct);
        }
      }

      alert('New product added to catalog and synchronized universally!');
    } else if (editingProduct) {
      let syncSuccess = false;
      if (selectedProductCategory === 'curtains') {
        const updatedItem: CurtainItem = {
          ...editingProduct,
          name: productForm.name,
          description: productForm.description,
          image: productForm.image,
          priceClass: productForm.priceClass as any,
          materials: materialsArray
        };
        const updated = curtains.map(p => p.id === editingProduct.id ? updatedItem : p);
        setCurtains(updated);
        localStorage.setItem('floatingdrapes_curtains', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          syncSuccess = await upsertCurtainToSupabase(updatedItem);
        }
      } else if (selectedProductCategory === 'wallpapers') {
        const updatedItem: WallpaperItem = {
          ...editingProduct,
          name: productForm.name,
          description: productForm.description,
          image: productForm.image,
          style: productForm.style as any,
          materials: materialsArray
        };
        const updated = wallpapers.map(p => p.id === editingProduct.id ? updatedItem : p);
        setWallpapers(updated);
        localStorage.setItem('floatingdrapes_wallpapers', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          syncSuccess = await upsertWallpaperToSupabase(updatedItem);
        }
      } else {
        const updatedItem: BlindItem = {
          ...editingProduct,
          name: productForm.name,
          description: productForm.description,
          image: productForm.image,
          style: productForm.style as any,
          materials: materialsArray
        };
        const updated = blinds.map(p => p.id === editingProduct.id ? updatedItem : p);
        setBlinds(updated);
        localStorage.setItem('floatingdrapes_blinds', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          syncSuccess = await upsertBlindToSupabase(updatedItem);
        }
      }

      if (isSupabaseConfigured()) {
        if (syncSuccess) {
          alert(`"${productForm.name}" updated directly in Supabase database! Live on all devices.`);
        } else {
          alert(`"${productForm.name}" saved!`);
        }
      } else {
        alert(`"${productForm.name}" saved locally.`);
      }
    }

    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const startEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setIsAddingProduct(false);
    setProductForm({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      image: prod.image,
      priceClass: prod.priceClass || 'Premium',
      style: prod.style || 'Classic',
      materials: prod.materials ? (Array.isArray(prod.materials) ? prod.materials.join(', ') : String(prod.materials)) : ''
    });
  };

  const startAddProduct = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductForm({
      id: '',
      name: '',
      description: '',
      image: '',
      priceClass: 'Premium',
      style: selectedProductCategory === 'wallpapers' ? 'Classic' : 'Roman',
      materials: ''
    });
  };

  // Feedback Master Controller Handlers
  const handleStartAddFeedback = () => {
    setEditingFeedback(null);
    setIsAddingFeedback(true);
    setFeedbackForm({
      id: `t_${Date.now()}`,
      name: '',
      location: 'Coimbatore',
      role: '',
      review: '',
      rating: 5,
      image: ''
    });
  };

  const handleStartEditFeedback = (item: Testimonial) => {
    setIsAddingFeedback(false);
    setEditingFeedback(item);
    setFeedbackForm({
      id: item.id,
      name: item.name,
      location: item.location || '',
      role: item.role || '',
      review: item.review,
      rating: item.rating || 5,
      image: item.image || ''
    });
  };

  // Dedicated upload image directly to Supabase for testimonials
  const handleFeedbackImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('Please select an image smaller than 20MB.');
      return;
    }

    setIsUploadingFeedbackImage(true);
    try {
      const res = await uploadImageToSupabase(file, {
        category: 'gallery',
        title: `Customer - ${feedbackForm.name || 'Client'}`
      });

      if (res.data?.file_url) {
        setFeedbackForm(prev => ({ ...prev, image: res.data!.file_url }));
        const fresh = await fetchUploadedImagesFromSupabase();
        setUploadedImages(fresh);
        alert('Testimonial photo uploaded directly to Supabase!');
      } else {
        alert(res.message || 'Upload finished.');
      }
    } catch (err: any) {
      alert('Error uploading photo to Supabase: ' + (err?.message || 'Failed'));
    } finally {
      setIsUploadingFeedbackImage(false);
    }
  };

  const handleRemoveFeedbackPhoto = () => {
    setFeedbackForm(prev => ({ ...prev, image: '' }));
  };

  // Save / Update Testimonial: syncs to Supabase database table 'testimonials'
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.name.trim() || !feedbackForm.review.trim()) {
      alert('Please fill in both the customer name and review text.');
      return;
    }

    const itemToSave: Testimonial = {
      id: feedbackForm.id || `t_${Date.now()}`,
      name: feedbackForm.name.trim(),
      location: feedbackForm.location?.trim() || 'Coimbatore',
      role: feedbackForm.role?.trim() || '',
      review: feedbackForm.review.trim(),
      rating: Number(feedbackForm.rating) || 5,
      image: feedbackForm.image?.trim() || ''
    };

    let updatedList: Testimonial[];
    if (isAddingFeedback) {
      updatedList = [itemToSave, ...testimonials];
    } else {
      updatedList = testimonials.map(t => t.id === itemToSave.id ? itemToSave : t);
    }

    setTestimonials(updatedList);
    localStorage.setItem('floatingdrapes_testimonials', JSON.stringify(updatedList));

    if (isSupabaseConfigured()) {
      await upsertFeedbackToSupabase(itemToSave);
    }

    setFeedbackSuccessMsg(isAddingFeedback ? 'New feedback added directly to Supabase!' : 'Feedback entry updated in Supabase!');
    setTimeout(() => setFeedbackSuccessMsg(''), 4000);

    setIsAddingFeedback(false);
    setEditingFeedback(null);
  };

  // Delete Testimonial from Supabase and local state
  const handleDeleteFeedback = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the feedback from "${name}" from Supabase?`)) return;

    const updatedList = testimonials.filter(t => t.id !== id);
    setTestimonials(updatedList);
    localStorage.setItem('floatingdrapes_testimonials', JSON.stringify(updatedList));

    if (isSupabaseConfigured()) {
      await deleteFeedbackFromSupabase(id);
    }

    if (editingFeedback?.id === id) {
      setEditingFeedback(null);
      setIsAddingFeedback(false);
    }
  };

  // Save Testimonial Section Headers (Subtitle & Title) to Supabase
  const handleSaveTestimonialSectionHeaders = async () => {
    onUpdateConfig(captions);
    localStorage.setItem('floatingdrapes_config', JSON.stringify(captions));

    if (isSupabaseConfigured()) {
      const ok = await syncSiteConfigToSupabase(captions);
      if (ok) {
        alert('Testimonials section headers saved and synced to Supabase database!');
      } else {
        alert('Saved locally. Check Database connection settings.');
      }
    } else {
      alert('Headers saved locally. Connect Supabase to sync to database.');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this consultation log?')) return;
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('floatingdrapes_bookings', JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      await deleteBookingFromSupabase(id);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact inquiry?')) return;
    const updated = inquiries.filter(i => i.id !== id);
    setInquiries(updated);
    localStorage.setItem('floatingdrapes_contacts', JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      await deleteInquiryFromSupabase(id);
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseKey) {
      alert('Please provide both your Supabase Project URL and Anon API Key.');
      return;
    }

    setSupabaseStatus('testing');
    saveSupabaseCredentials(supabaseUrl, supabaseKey);

    const testRes = await testSupabaseConnection();
    if (testRes.success) {
      setSupabaseStatus('connected');
      setSupabaseStatusMessage(testRes.message);
      alert('Supabase connected successfully! Realtime synchronization is active.');
      handlePullFromSupabase();
    } else {
      setSupabaseStatus('disconnected');
      setSupabaseStatusMessage(testRes.message);
      alert(testRes.message);
    }
  };

  const handleTestConnection = async () => {
    setSupabaseStatus('testing');
    const res = await testSupabaseConnection();
    if (res.success) {
      setSupabaseStatus('connected');
      setSupabaseStatusMessage(res.message);
      alert('Connection Verified! ' + res.message);
    } else {
      setSupabaseStatus('disconnected');
      setSupabaseStatusMessage(res.message);
      alert('Connection Failed: ' + res.message);
    }
  };

  const handleSeedSupabase = async () => {
    if (!isSupabaseConfigured()) {
      alert('Please connect your Supabase database first.');
      return;
    }

    if (!window.confirm('This will upload all 50+ rich curtain, wallpaper, and blinds products and site settings to your Supabase tables. Continue?')) {
      return;
    }

    setIsSeedingDatabase(true);
    try {
      const res = await seedDefaultCatalogToSupabase(siteConfig);
      alert(res.message);
    } finally {
      setIsSeedingDatabase(false);
    }
  };

  const handlePullFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      alert('Please connect your Supabase database first.');
      return;
    }

    setIsPullingData(true);
    try {
      const data = await fetchUniversalSiteData();
      let updatedCount = 0;

      if (data.siteConfig) {
        onUpdateConfig(data.siteConfig);
        setCaptions(data.siteConfig);
        localStorage.setItem('floatingdrapes_config', JSON.stringify(data.siteConfig));
        updatedCount++;
      }
      if (data.curtains && data.curtains.length > 0) {
        setCurtains(data.curtains);
        localStorage.setItem('floatingdrapes_curtains', JSON.stringify(data.curtains));
        updatedCount++;
      }
      if (data.wallpapers && data.wallpapers.length > 0) {
        setWallpapers(data.wallpapers);
        localStorage.setItem('floatingdrapes_wallpapers', JSON.stringify(data.wallpapers));
        updatedCount++;
      }
      if (data.blinds && data.blinds.length > 0) {
        setBlinds(data.blinds);
        localStorage.setItem('floatingdrapes_blinds', JSON.stringify(data.blinds));
        updatedCount++;
      }
      if (data.testimonials && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
        localStorage.setItem('floatingdrapes_testimonials', JSON.stringify(data.testimonials));
        updatedCount++;
      }
      if (data.bookings) {
        setBookings(data.bookings);
        localStorage.setItem('floatingdrapes_bookings', JSON.stringify(data.bookings));
      }
      if (data.inquiries) {
        setInquiries(data.inquiries);
        localStorage.setItem('floatingdrapes_contacts', JSON.stringify(data.inquiries));
      }

      alert(`Successfully refreshed universal state from Supabase! (${updatedCount} dataset collections synchronized).`);
    } catch (e: any) {
      alert(`Error pulling from Supabase: ${e?.message || 'Failed'}`);
    } finally {
      setIsPullingData(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  const handleLoadMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const images = await fetchUploadedImagesFromSupabase();
      setUploadedImages(images);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleExecuteUpload = async (fileToUpload?: File) => {
    const file = fileToUpload || selectedUploadFile;
    if (!file) {
      setUploadErrorMsg('Please select an image file to upload.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadErrorMsg('File size exceeds 25MB limit. Please choose a smaller image.');
      return;
    }

    setIsUploadingMedia(true);
    setUploadErrorMsg('');
    setUploadSuccessMsg('');

    try {
      const res = await uploadImageToSupabase(file, {
        category: uploadCategory,
        title: uploadTitle.trim() || undefined
      });

      if (res.success && res.data) {
        setUploadSuccessMsg(res.message);
        setSelectedUploadFile(null);
        setUploadTitle('');
        const freshList = await fetchUploadedImagesFromSupabase();
        setUploadedImages(freshList);
        setTimeout(() => setUploadSuccessMsg(''), 6000);
      } else {
        setUploadErrorMsg(res.error || 'Failed to upload image.');
      }
    } catch (err: any) {
      setUploadErrorMsg(err?.message || 'An error occurred during image upload.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (image: UploadedImage) => {
    if (!window.confirm(`Delete image "${image.title || image.filename}" from your Supabase database and storage?`)) return;

    const success = await deleteUploadedImageFromSupabase(image.id, image.storage_path);
    if (success) {
      setUploadedImages(prev => prev.filter(img => img.id !== image.id));
      if (previewModalImage?.id === image.id) {
        setPreviewModalImage(null);
      }
    } else {
      alert('Failed to delete image from Supabase.');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMediaId(id);
    setTimeout(() => setCopiedMediaId(null), 2500);
  };

  const handleApplyToProduct = (imageUrl: string, category: 'curtains' | 'wallpapers' | 'blinds') => {
    setSelectedProductCategory(category);
    setProductForm({
      id: `${category.charAt(0)}${Date.now()}`,
      name: `New ${category.slice(0, -1).charAt(0).toUpperCase() + category.slice(0, -1).slice(1)} Item`,
      description: '',
      image: imageUrl,
      priceClass: 'Premium',
      style: 'Classic',
      materials: ''
    });
    setIsAddingProduct(true);
    setActiveTab('products');
  };

  const handleProductInlineUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProductInline(true);
    try {
      const res = await uploadImageToSupabase(file, {
        category: selectedProductCategory,
        title: `${selectedProductCategory} item`
      });

      if (res.data?.file_url) {
        setProductForm(prev => ({ ...prev, image: res.data!.file_url }));
        const fresh = await fetchUploadedImagesFromSupabase();
        setUploadedImages(fresh);
      }
    } catch (err) {
      console.error('Inline upload error:', err);
      alert('Failed to upload image to Supabase.');
    } finally {
      setIsUploadingProductInline(false);
    }
  };

  const handleQuickUploadProductPhoto = async (
    item: any,
    category: 'curtains' | 'wallpapers' | 'blinds',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImageToSupabase(file, {
        category,
        title: item.name
      });

      if (res.data?.file_url) {
        const newUrl = res.data.file_url;
        const updatedItem = { ...item, image: newUrl };

        if (category === 'curtains') {
          const updated = curtains.map(p => p.id === item.id ? updatedItem : p);
          setCurtains(updated);
          localStorage.setItem('floatingdrapes_curtains', JSON.stringify(updated));
          if (isSupabaseConfigured()) {
            await upsertCurtainToSupabase(updatedItem);
          }
        } else if (category === 'wallpapers') {
          const updated = wallpapers.map(p => p.id === item.id ? updatedItem : p);
          setWallpapers(updated);
          localStorage.setItem('floatingdrapes_wallpapers', JSON.stringify(updated));
          if (isSupabaseConfigured()) {
            await upsertWallpaperToSupabase(updatedItem);
          }
        } else {
          const updated = blinds.map(p => p.id === item.id ? updatedItem : p);
          setBlinds(updated);
          localStorage.setItem('floatingdrapes_blinds', JSON.stringify(updated));
          if (isSupabaseConfigured()) {
            await upsertBlindToSupabase(updatedItem);
          }
        }

        const fresh = await fetchUploadedImagesFromSupabase();
        setUploadedImages(fresh);

        alert(`New photo uploaded and updated in Supabase database for "${item.name}"!`);
      }
    } catch (err) {
      console.error('Quick upload error:', err);
      alert('Failed to upload image to Supabase.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden text-white" id="admin-panel-overlay">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#00172e] border border-[#003866] shadow-[0_20px_60px_rgba(0,153,255,0.25)] flex flex-col rounded-2xl overflow-hidden" id="admin-panel-container">
        
        {/* TOP HEADER WITH LOGOUT BUTTON */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#003366] bg-[#001f3f]">
          <div className="flex items-center space-x-3">
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] text-[#0099ff] uppercase">FLOATING DRAPES SYSTEM ENGINE</span>
            
            <div 
              className="flex items-center justify-center p-1.5 bg-[#00172e] border border-[#003866] rounded-full shadow-inner"
              title={supabaseStatus === 'connected' ? 'Database: Connected (Green)' : supabaseStatus === 'testing' ? 'Database: Trying to connect (Yellow)' : 'Database: Disconnected (Red)'}
            >
              {renderIndicatorLight('sm')}
            </div>

            {isAuthenticated && (
              <span className="hidden sm:inline-block bg-[#0099ff]/15 text-[#0099ff] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-[#0099ff]/30 rounded">
                MASTER CONTROL
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md shadow-red-900/40 border border-red-500 transition-all cursor-pointer"
                title="End master session and lock Admin Panel"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>LOGOUT</span>
              </button>
            )}

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Exit System Panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-md mx-auto py-12">
            <div className="w-full bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-8 shadow-2xl text-[#002b49] relative">
              <div 
                className="absolute top-5 right-5 p-2 bg-white border border-[#c5def2] rounded-full shadow-sm flex items-center justify-center"
                title={supabaseStatus === 'connected' ? 'Database: Connected (Green)' : supabaseStatus === 'testing' ? 'Database: Trying to connect (Yellow)' : 'Database: Disconnected (Red)'}
              >
                {renderIndicatorLight('md')}
              </div>

              <div className="w-14 h-14 bg-[#e3f2fd] border border-[#90cdf4] rounded-full flex items-center justify-center text-[#0099ff] mx-auto mb-5 shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              
              <h2 className="font-serif text-2xl text-center font-bold text-[#002b49] mb-1.5">Enter Master Credentials</h2>
              <p className="font-sans text-xs text-[#335577] text-center mb-6 leading-relaxed">
                Floating Drapes control panel. Enter your admin user credentials to access the dashboard.
              </p>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#006699] uppercase mb-1.5">Admin Email ID</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#88a3bc]" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your admin user email"
                      className="w-full bg-white border border-[#c5def2] focus:border-[#0099ff] px-11 py-2.5 text-xs text-[#002b49] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#006699] uppercase mb-1.5">Authorization Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#88a3bc]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#c5def2] focus:border-[#0099ff] px-11 py-2.5 text-xs text-[#002b49] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="text-red-700 text-[11px] font-medium leading-relaxed bg-red-50 border border-red-200 p-3 rounded-lg">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full bg-[#0099ff] hover:bg-[#0088ee] text-white py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer rounded-lg shadow-md shadow-[#0099ff]/25"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>{isSubmittingLogin ? 'VERIFYING WITH DATABASE...' : 'AUTHORIZE AND SIGN IN'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED PANEL LAYOUT */
          <div className="flex-1 flex overflow-hidden">
            
            {/* SIDEBAR */}
            <div className="w-64 border-r border-[#003366] bg-[#00172e] flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="p-4 space-y-1.5">
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'sections' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Homepage & Sections</span>
                </button>
                <button
                  onClick={() => setActiveTab('captions')}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'captions' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <Heading className="h-4 w-4" />
                  <span>Captions & Text</span>
                </button>
                <button
                  onClick={() => setActiveTab('theme')}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'theme' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <Palette className="h-4 w-4" />
                  <span>Theme & Brand</span>
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'products' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Products Catalog</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('media');
                    handleLoadMedia();
                  }}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'media' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="flex-1">Media & Uploads</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#002b49] text-[#88ccff] border border-[#003866] font-mono font-bold">{uploadedImages.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'feedback' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="flex-1">Feedback Master</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#002b49] text-[#88ccff] border border-[#003866] font-mono font-bold">{testimonials.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'inquiries' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <Inbox className="h-4 w-4" />
                  <span>Inquiries ({bookings.length + inquiries.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase flex items-center space-x-3 transition-all cursor-pointer rounded-lg ${activeTab === 'database' ? 'bg-[#0099ff] text-white shadow-md shadow-[#0099ff]/30' : 'hover:bg-[#002b49] text-[#88ccff] hover:text-white'}`}
                >
                  <Database className="h-4 w-4" />
                  <span className="flex-1">Supabase Database</span>
                  {supabaseStatus === 'connected' && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
                </button>
              </div>

              {/* SIDEBAR LOGOUT FOOTER */}
              <div className="p-4 border-t border-[#003366] bg-[#001326] space-y-2">
                {sessionStorage.getItem('fd_admin_user_email') && (
                  <div className="px-3 py-2 bg-[#002244] border border-[#003866] text-[10px] text-[#88ccff] rounded-lg truncate">
                    <span className="block text-[8px] uppercase tracking-wider text-[#0099ff] font-bold">Logged In User</span>
                    <span className="truncate text-white font-medium">{sessionStorage.getItem('fd_admin_user_email')}</span>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg flex items-center justify-center space-x-2 shadow-md shadow-red-900/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>LOGOUT NOW</span>
                </button>
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#001428]">
              
              {/* TAB 0: HOMEPAGE & SECTIONS */}
              {activeTab === 'sections' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eaf7] pb-5 gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#002b49]">Homepage & Section Visuals</h3>
                      <p className="font-sans text-xs text-[#335577] mt-1">
                        Dedicated upload & string editor for Homepage Hero, the 3 Showcase Products ("Elegance In Every Detail"), and Tailor-Made Customization.
                      </p>
                    </div>
                    <button 
                      onClick={handleSaveShowcaseSections}
                      className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow-md shadow-[#0099ff]/25 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>SAVE & SYNC TO SUPABASE</span>
                    </button>
                  </div>

                  {/* 1. HOMEPAGE HERO IMAGE */}
                  <div className="bg-white border border-[#c5def2] rounded-xl p-6 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e2effa] pb-3 gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[12px] font-bold tracking-widest text-[#0099ff] uppercase">1. HOMEPAGE HERO IMAGE</span>
                          <span className="bg-sky-50 text-[#0077c2] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#b8dcfa]">Main Living Room Banner</span>
                        </div>
                        <p className="text-xs text-[#335577] mt-0.5">Upload a custom luxury room image to display on the top hero banner of the website.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-5">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#b8dcfa] bg-slate-100 shadow-md group">
                          <img 
                            src={captions.heroImageUrl || DEFAULT_SITE_CONFIG.heroImageUrl || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"} 
                            alt="Hero display preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="cursor-pointer bg-[#0099ff] hover:bg-[#0088ee] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center space-x-2 shadow-md shadow-[#0099ff]/25 transition-all">
                            <Camera className="h-4 w-4" />
                            <span>Upload Hero Photo</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleUploadHeroImage} 
                              className="hidden" 
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...captions, heroImageUrl: DEFAULT_SITE_CONFIG.heroImageUrl };
                              setCaptions(updated);
                              onUpdateConfig(updated);
                            }}
                            className="text-xs font-semibold text-[#006699] hover:text-[#002b49] px-3 py-2 rounded-lg border border-[#c5def2] hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Reset to Default Image
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">
                            Or Enter Direct Image URL
                          </label>
                          <input 
                            type="text"
                            value={captions.heroImageUrl || ''}
                            onChange={(e) => {
                              const updated = { ...captions, heroImageUrl: e.target.value };
                              setCaptions(updated);
                              onUpdateConfig(updated);
                            }}
                            placeholder="https://..."
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: CAPTIONS AND TEXT */}
              {activeTab === 'captions' && (
                <div className="space-y-6 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#d8eaf7] pb-5 gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#002b49]">Homepage Banners & Typography Binders</h3>
                      <p className="font-sans text-xs text-[#335577] mt-1">Adjust titles, body copy, about sections, and milestones. Changes sync universally to Supabase.</p>
                    </div>
                    <button 
                      onClick={handleSaveCaptions}
                      className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow-md shadow-[#0099ff]/25 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>SAVE ALL CAPTIONS</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 bg-white border border-[#c5def2] rounded-xl p-5 shadow-sm">
                      <h4 className="text-[11px] font-bold tracking-widest text-[#0099ff] uppercase border-b border-[#e2effa] pb-2 mb-3">Hero Section Banners</h4>
                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Top Accent Tagline</label>
                        <input
                          type="text"
                          value={captions.heroLabel}
                          onChange={(e) => setCaptions({ ...captions, heroLabel: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Headline Leading Text</label>
                          <input
                            type="text"
                            value={captions.heroHeadline1}
                            onChange={(e) => setCaptions({ ...captions, heroHeadline1: e.target.value })}
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Italic Word</label>
                          <input
                            type="text"
                            value={captions.heroHeadlineItalic}
                            onChange={(e) => setCaptions({ ...captions, heroHeadlineItalic: e.target.value })}
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Headline Ending Text</label>
                        <input
                          type="text"
                          value={captions.heroHeadline2}
                          onChange={(e) => setCaptions({ ...captions, heroHeadline2: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 bg-white border border-[#c5def2] rounded-xl p-5 shadow-sm">
                      <h4 className="text-[11px] font-bold tracking-widest text-[#0099ff] uppercase border-b border-[#e2effa] pb-2 mb-3">About Us Narrative</h4>
                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Top Eyebrow Title</label>
                        <input
                          type="text"
                          value={captions.aboutTitle}
                          onChange={(e) => setCaptions({ ...captions, aboutTitle: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Experience Years Label</label>
                        <input
                          type="text"
                          value={captions.aboutExperience}
                          onChange={(e) => setCaptions({ ...captions, aboutExperience: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Narrative Paragraph 1</label>
                        <textarea
                          rows={4}
                          value={captions.aboutText1}
                          onChange={(e) => setCaptions({ ...captions, aboutText1: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] resize-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: THEME & BRAND */}
              {activeTab === 'theme' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="border-b border-[#d8eaf7] pb-4">
                    <h3 className="font-serif text-2xl font-bold text-[#002b49]">Theme Styling & Typography Presets</h3>
                    <p className="font-sans text-xs text-[#335577] mt-1">Live swap styling sheets, paint palettes, typography couplings, and change your brand logo universally.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-5 shadow-sm">
                      <div className="flex items-center space-x-2 text-[#0099ff]">
                        <Palette className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Select Premium Color Preset</h4>
                      </div>

                      <div className="space-y-3">
                        {[
                          { id: 'sapphire', name: 'Royal Sapphire Blue', desc: 'Elite deep ocean navy backing paired with cyan highlights (Default)', primary: '#0099ff', bg: '#021e3b' },
                          { id: 'amber', name: 'Royal Amber Gold', desc: 'Warm stone grey backing paired with rich amber luster accents', primary: '#e5c158', bg: '#1c1917' },
                          { id: 'emerald', name: 'Classic Gold & Emerald', desc: 'Historical forest green backing with royal leaf gold touches', primary: '#d4af37', bg: '#064e3b' },
                          { id: 'crimson', name: 'Crimson Burgundy', desc: 'High-luxury deep wine red base matching classical opera drape textures', primary: '#cca43b', bg: '#450a0a' },
                          { id: 'obsidian', name: 'Modern Obsidian Dark', desc: 'Clean, futuristic dark backing with glowing amber control accents', primary: '#f59e0b', bg: '#121214' },
                        ].map((th) => (
                          <button
                            key={th.id}
                            onClick={() => handleSaveTheme(th.id as any, captions.fontPreset)}
                            className={`w-full p-4 border text-left flex items-center justify-between rounded-xl transition-all cursor-pointer ${captions.themePreset === th.id ? 'border-[#0099ff] bg-[#e3f2fd] shadow-sm' : 'border-[#d8eaf7] bg-[#f8fbfe] hover:border-[#0099ff]/50'}`}
                          >
                            <div className="space-y-1">
                              <span className="text-xs font-bold block text-[#002b49]">{th.name}</span>
                              <span className="text-[10px] text-[#335577] block leading-relaxed">{th.desc}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 ml-4">
                              <div className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: th.bg }} title="Background" />
                              <div className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: th.primary }} title="Accent" />
                              {captions.themePreset === th.id && (
                                <Check className="h-4 w-4 text-[#0099ff] ml-1" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center space-x-2 text-[#0099ff]">
                          <Link className="h-4 w-4" />
                          <h4 className="text-xs font-bold uppercase tracking-wider">Brand Logo Link Control</h4>
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={captions.brandLogoUrl}
                            onChange={(e) => setCaptions({ ...captions, brandLogoUrl: e.target.value })}
                            className="flex-1 bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff]"
                            placeholder="e.g. /logo.svg or external https://..."
                          />
                          <button
                            onClick={() => handleSaveLogo(captions.brandLogoUrl)}
                            className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-5 py-2 text-xs font-bold tracking-wider uppercase rounded-lg shadow-md shadow-[#0099ff]/25 transition-colors cursor-pointer"
                          >
                            UPDATE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCTS CATALOG */}
              {activeTab === 'products' && (
                <div className="space-y-6 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d8eaf7] pb-5">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#002b49]">Dynamic Products Catalog Master Control</h3>
                      <p className="font-sans text-xs text-[#335577] mt-1">Directly edit, delete, or append newly structured curtains, wallpapers, and blinds.</p>
                    </div>
                    <button
                      onClick={startAddProduct}
                      className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow-md shadow-[#0099ff]/25 transition-all flex items-center space-x-2 self-start cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>ADD NEW PRODUCT</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: MEDIA & UPLOADS */}
              {activeTab === 'media' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#d8eaf7] gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold flex items-center space-x-2.5 text-[#002b49]">
                        <ImageIcon className="h-6 w-6 text-[#0099ff]" />
                        <span>Supabase Media &amp; Image Upload Center</span>
                        <span className="text-xs px-2.5 py-0.5 bg-[#e3f2fd] text-[#0077c2] border border-[#90cdf4] font-sans font-bold rounded-md">
                          {uploadedImages.length} Files in Database
                        </span>
                      </h3>
                      <p className="font-sans text-xs text-[#335577] mt-1">
                        Upload photography directly into your Supabase account storage and database.
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={handleLoadMedia}
                        disabled={isLoadingMedia}
                        className="px-4 py-2 bg-white hover:bg-[#e3f2fd] text-[#006699] border border-[#c5def2] rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center space-x-2 cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isLoadingMedia ? 'animate-spin text-[#0099ff]' : ''}`} />
                        <span>Refresh Media</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: FEEDBACK & TESTIMONIALS MASTER CONTROLLER */}
              {activeTab === 'feedback' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  {/* HEADER BANNER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#d8eaf7] gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold flex items-center space-x-2 text-[#002b49]">
                        <span>Customer Feedback &amp; Testimonials Master Controller</span>
                        <span className="text-xs px-2.5 py-0.5 bg-[#e3f2fd] text-[#0077c2] border border-[#90cdf4] font-sans font-bold rounded-md">
                          {testimonials.length} Active Reviews
                        </span>
                      </h3>
                      <p className="font-sans text-xs text-[#335577] mt-1">
                        Edit, upload avatar photos, modify testimonials, and change the section headings. All changes save directly to your Supabase PostgreSQL database and Storage.
                      </p>
                    </div>

                    {!isAddingFeedback && !editingFeedback && (
                      <button
                        onClick={handleStartAddFeedback}
                        className="px-5 py-2.5 bg-[#0099ff] text-white hover:bg-[#0088ee] text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 shadow-md shadow-[#0099ff]/25 rounded-lg"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add New Testimonial</span>
                      </button>
                    )}
                  </div>

                  {/* SECTION HEADINGS EDIT BLOCK */}
                  <div className="bg-white border border-[#c5def2] rounded-xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-[#e2effa] pb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#006699]">
                          Storefront Testimonial Section Titles &amp; Labels
                        </h4>
                        <p className="text-[11px] text-[#335577] mt-0.5">
                          Change what appears in the header block above the testimonials on the main website.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveTestimonialSectionHeaders}
                        className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Section Headings</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">
                          Eyebrow Subtitle (Small blue banner)
                        </label>
                        <input
                          type="text"
                          value={captions.testimonialsSectionSubtitle || 'CLIENT FEEDBACK'}
                          onChange={(e) => setCaptions({ ...captions, testimonialsSectionSubtitle: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff]"
                          placeholder="CLIENT FEEDBACK"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">
                          Main Section Heading
                        </label>
                        <input
                          type="text"
                          value={captions.testimonialsSectionTitle || 'What Our Clients Say'}
                          onChange={(e) => setCaptions({ ...captions, testimonialsSectionTitle: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff]"
                          placeholder="What Our Clients Say"
                        />
                      </div>
                    </div>
                  </div>

                  {feedbackSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center space-x-2 shadow-sm">
                      <CheckCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{feedbackSuccessMsg}</span>
                    </div>
                  )}

                  {/* ADD / EDIT FEEDBACK FORM */}
                  {(isAddingFeedback || editingFeedback) && (
                    <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-6 shadow-md relative">
                      <div className="flex items-center justify-between border-b border-[#e2effa] pb-3">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#0099ff] text-white rounded-md">
                            {isAddingFeedback ? 'Create New' : 'Editing Entry'}
                          </span>
                          <h4 className="font-serif text-lg font-bold text-[#002b49]">
                            {isAddingFeedback ? 'Add Customer Testimonial' : `Edit Review from "${feedbackForm.name}"`}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingFeedback(false);
                            setEditingFeedback(null);
                          }}
                          className="p-1.5 text-slate-400 hover:text-[#002b49] rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">Customer Name *</label>
                            <input
                              type="text"
                              value={feedbackForm.name}
                              onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. Priya Sharma"
                              required
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">Location / City</label>
                            <input
                              type="text"
                              value={feedbackForm.location || ''}
                              onChange={(e) => setFeedbackForm(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="e.g. Race Course, Coimbatore"
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">Customer Role / Title</label>
                            <input
                              type="text"
                              value={feedbackForm.role || ''}
                              onChange={(e) => setFeedbackForm(prev => ({ ...prev, role: e.target.value }))}
                              placeholder="e.g. Villa Owner / Interior Designer"
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">
                            Star Rating: {feedbackForm.rating || 5} of 5 Stars
                          </label>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                                className="p-1 hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= (feedbackForm.rating || 5)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs text-[#335577] ml-2 font-mono">
                              ({feedbackForm.rating === 5 ? '5.0 - Exceptional Experience' : `${feedbackForm.rating}.0 Stars`})
                            </span>
                          </div>
                        </div>

                        {/* AVATAR UPLOAD AND CDN CONTROL */}
                        <div className="p-5 bg-[#f8fbfe] border border-[#c5def2] rounded-xl space-y-4">
                          <div className="flex items-center justify-between border-b border-[#e2effa] pb-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-[#0099ff]" />
                              <span className="text-xs font-bold tracking-wider uppercase text-[#002b49]">
                                Profile Photo Upload &amp; Cloud Storage Pipeline
                              </span>
                            </div>
                            <span className="text-[10px] text-[#006699] font-medium bg-[#e3f2fd] px-2 py-0.5 rounded-md">
                              Direct to Supabase Storage
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                            <div className="flex flex-col items-center justify-center p-4 bg-white border border-[#c5def2] rounded-xl shrink-0 min-w-[140px] shadow-sm">
                              <span className="text-[9px] uppercase tracking-widest text-[#006699] mb-2 font-bold">
                                Live Icon Preview
                              </span>
                              <CustomerAvatar
                                name={feedbackForm.name || 'Customer'}
                                image={feedbackForm.image}
                                size="xl"
                              />
                              <span className="text-[10px] text-[#002b49] font-bold mt-2 truncate max-w-[120px]">
                                {feedbackForm.name || 'Customer Name'}
                              </span>
                            </div>

                            <div className="flex-1 w-full space-y-3">
                              {feedbackForm.image ? (
                                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                                  <div className="flex items-center space-x-2 text-emerald-700 text-xs font-medium">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                                    <span>Custom Photo Active in Supabase</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleRemoveFeedbackPhoto}
                                    className="text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
                                  >
                                    Remove Photo (Use Letter Initial)
                                  </button>
                                </div>
                              ) : (
                                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg">
                                  <div className="flex items-center space-x-2 text-sky-800 text-xs font-medium">
                                    <Sparkles className="h-4 w-4 shrink-0 text-[#0099ff]" />
                                    <span>
                                      First-Letter Avatar Active: &quot;{(feedbackForm.name?.trim()?.charAt(0) || 'C').toUpperCase()}&quot;
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <label className="px-4 py-2 bg-[#0099ff] hover:bg-[#0088ee] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer transition-colors shrink-0 rounded-lg shadow-sm">
                                  <Upload className="h-3.5 w-3.5" />
                                  <span>{isUploadingFeedbackImage ? 'Uploading to Supabase...' : 'Upload Avatar to Supabase'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    disabled={isUploadingFeedbackImage}
                                    onChange={handleFeedbackImageFileUpload}
                                    className="hidden"
                                  />
                                </label>
                                <span className="text-[11px] text-[#335577] text-center sm:text-left font-medium">or CDN URL:</span>
                                <input
                                  type="text"
                                  value={feedbackForm.image || ''}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, image: e.target.value }))}
                                  placeholder="https://..."
                                  className="flex-1 bg-white border border-[#c5def2] focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">
                            Customer Review / Testimonial Text *
                          </label>
                          <textarea
                            rows={4}
                            value={feedbackForm.review}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, review: e.target.value }))}
                            placeholder="Type or paste the client's verified testimonial..."
                            required
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] p-3.5 text-xs text-[#002b49] outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors resize-y leading-relaxed"
                          />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e2effa]">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingFeedback(false);
                              setEditingFeedback(null);
                            }}
                            className="px-5 py-2.5 border border-[#c5def2] hover:bg-[#e3f2fd] text-[#002b49] text-xs font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#0099ff] text-white hover:bg-[#0088ee] text-xs font-bold tracking-wider uppercase flex items-center space-x-2 transition-all cursor-pointer font-sans shadow-md shadow-[#0099ff]/25 rounded-lg"
                          >
                            <Save className="h-4 w-4" />
                            <span>{isAddingFeedback ? 'Save & Push to Supabase' : 'Save Testimonial Changes'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* FEEDBACK TABLE */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="relative flex-1 max-w-md">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={feedbackSearch}
                          onChange={(e) => setFeedbackSearch(e.target.value)}
                          placeholder="Search feedback by customer name, location, or words..."
                          className="w-full bg-white border border-[#c5def2] focus:border-[#0099ff] pl-9 pr-4 py-2.5 text-xs text-[#002b49] outline-none rounded-lg shadow-sm focus:ring-1 focus:ring-[#0099ff] transition-colors"
                        />
                      </div>
                      <span className="text-xs text-[#335577] font-medium">
                        Showing {testimonials.filter(t => 
                          t.name.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
                          t.review.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
                          (t.location && t.location.toLowerCase().includes(feedbackSearch.toLowerCase()))
                        ).length} of {testimonials.length} reviews
                      </span>
                    </div>

                    <div className="border border-[#c5def2] overflow-x-auto bg-white rounded-xl shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#c5def2] bg-[#e3f2fd] text-[10px] font-bold tracking-wider uppercase text-[#006699]">
                            <th className="p-3.5">Customer &amp; Avatar</th>
                            <th className="p-3.5">Avatar Mode</th>
                            <th className="p-3.5">Rating</th>
                            <th className="p-3.5">Testimonial Content</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2effa]">
                          {testimonials
                            .filter(t => 
                              t.name.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
                              t.review.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
                              (t.location && t.location.toLowerCase().includes(feedbackSearch.toLowerCase()))
                            )
                            .map((item) => (
                              <tr key={item.id} className="hover:bg-[#f8fbfe] transition-colors">
                                <td className="p-3.5 whitespace-nowrap">
                                  <div className="flex items-center space-x-3">
                                    <CustomerAvatar name={item.name} image={item.image} size="md" />
                                    <div>
                                      <p className="font-bold text-[#002b49] text-xs">{item.name}</p>
                                      <p className="text-[11px] text-[#335577]">
                                        {[item.role, item.location].filter(Boolean).join(' • ') || 'Client'}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5 whitespace-nowrap">
                                  {item.image ? (
                                    <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                                      Custom Photo
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-[#e3f2fd] text-[#0077c2] border border-[#90cdf4] rounded">
                                      Initial: &quot;{item.name.trim().charAt(0).toUpperCase()}&quot;
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5 whitespace-nowrap">
                                  <div className="flex items-center space-x-1 text-amber-400">
                                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                                    ))}
                                    <span className="text-[11px] text-[#335577] ml-1 font-semibold">({item.rating || 5}.0)</span>
                                  </div>
                                </td>
                                <td className="p-3.5 max-w-xs text-[#335577] line-clamp-2 leading-relaxed">
                                  &quot;{item.review}&quot;
                                </td>
                                <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                                  <button
                                    onClick={() => handleStartEditFeedback(item)}
                                    className="p-1.5 hover:bg-[#e3f2fd] text-[#006699] hover:text-[#0099ff] rounded-lg transition-colors inline-block cursor-pointer"
                                    title="Edit Feedback & Profile Icon"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFeedback(item.id, item.name)}
                                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors inline-block cursor-pointer"
                                    title="Delete Feedback"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="border-b border-[#d8eaf7] pb-5">
                    <h3 className="font-serif text-2xl font-bold text-[#002b49]">Inbound Leads & Consultation Inquiries</h3>
                  </div>
                </div>
              )}

              {/* TAB 5: DATABASE */}
              {activeTab === 'database' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="border-b border-[#d8eaf7] pb-5">
                    <h3 className="font-serif text-2xl font-bold text-[#002b49]">Supabase Universal Database & Realtime Sync Engine</h3>
                  </div>
                  <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-6 shadow-sm">
                    <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-[#006699] font-bold uppercase mb-1 tracking-wider">
                            Supabase Project URL *
                          </label>
                          <input
                            type="text"
                            required
                            value={supabaseUrl}
                            onChange={(e) => setSupabaseUrl(e.target.value)}
                            placeholder="https://your-project-id.supabase.co"
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#006699] font-bold uppercase mb-1 tracking-wider">
                            Supabase Anon Public API Key *
                          </label>
                          <input
                            type="password"
                            required
                            value={supabaseKey}
                            onChange={(e) => setSupabaseKey(e.target.value)}
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow cursor-pointer"
                        >
                          SAVE &amp; ACTIVATE
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FULL SCREEN MEDIA LIGHTBOX */}
      <AnimatePresence>
        {previewModalImage && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setPreviewModalImage(null)}>
            <div 
              className="relative max-w-4xl w-full bg-[#00172e] border border-[#003866] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#003366] bg-[#001f3f]">
                <div className="flex items-center space-x-2 text-white">
                  <ImageIcon className="h-5 w-5 text-[#0099ff]" />
                  <span className="font-semibold text-sm truncate">{previewModalImage.title || previewModalImage.filename}</span>
                </div>
                <button 
                  onClick={() => setPreviewModalImage(null)}
                  className="p-1.5 hover:bg-[#002b49] text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center justify-center bg-black/40 max-h-[70vh] overflow-hidden">
                <img 
                  src={previewModalImage.file_url} 
                  alt={previewModalImage.title || previewModalImage.filename}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
