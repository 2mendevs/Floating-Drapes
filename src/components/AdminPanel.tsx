import React, { useState, useEffect } from 'react';
import { 
  X, LogIn, Lock, Mail, Heading, Palette, Type, 
  ShoppingBag, Trash2, Edit2, Plus, Save, Check, 
  Layers, FolderOpen, Eye, Inbox, FileText, Link, HelpCircle,
  Database, RefreshCw, Copy, CheckCheck, UploadCloud, DownloadCloud,
  AlertCircle, ShieldCheck, Wifi, WifiOff, Sparkles, ExternalLink,
  Star, MessageSquare, Upload, User, Image as ImageIcon, Search
} from 'lucide-react';
import { CurtainItem, WallpaperItem, SiteConfig, BookingSubmission, Testimonial } from '../types';
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

  // Active control panel tab
  const [activeTab, setActiveTab] = useState<'captions' | 'theme' | 'products' | 'feedback' | 'inquiries' | 'database'>('captions');

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

    // If token is a Supabase session token
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
    setCaptions({ ...siteConfig });
    
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

    // If Supabase is configured, fetch live records for inquiries
    if (isSupabaseConfigured()) {
      fetchUniversalSiteData().then(data => {
        if (data.bookings && data.bookings.length > 0) {
          setBookings(data.bookings);
        }
        if (data.inquiries && data.inquiries.length > 0) {
          setInquiries(data.inquiries);
        }
      });
    }
  }, [siteConfig, isOpen]);

  // Handle Login via Supabase Auth or Backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingLogin(true);

    const cleanEmail = email.trim();

    try {
      // 1. Direct Supabase Auth Verification First (if client is active)
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          });

          if (!sbError && sbData?.user) {
            // Logged in successfully with Supabase user credentials
            const timestamp = Date.now();
            sessionStorage.setItem('fd_admin_token', `sb.${timestamp}.${sbData.user.id}`);
            sessionStorage.setItem('fd_admin_user_email', sbData.user.email || cleanEmail);
            setIsAuthenticated(true);
            setAuthError('');
            setPassword('');
            setIsSubmittingLogin(false);
            return;
          }
        } catch (supabaseLoginErr: any) {
          console.warn('Supabase client login attempt:', supabaseLoginErr?.message);
        }
      }

      // 2. Fallback to Server Login Endpoint (passes custom Supabase credentials if stored)
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

  // Delete Product from both local state and Supabase
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

  // Save / Edit Product & sync to Supabase
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

      alert('New product added and broadcasted to catalog!');
    } else if (editingProduct) {
      // Edit mode
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
          await upsertCurtainToSupabase(updatedItem);
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
          await upsertWallpaperToSupabase(updatedItem);
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
          await upsertBlindToSupabase(updatedItem);
        }
      }

      alert('Product modified and synchronized universally!');
    }

    // Reset Form
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  // Open Edit Product Pane
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

  // Open Add Product Pane
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

  const handleFeedbackImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Please select an image smaller than 2MB for faster loading.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFeedbackForm(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFeedbackPhoto = () => {
    setFeedbackForm(prev => ({ ...prev, image: '' }));
  };

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

    setFeedbackSuccessMsg(isAddingFeedback ? 'New feedback added successfully!' : 'Feedback entry updated successfully!');
    setTimeout(() => setFeedbackSuccessMsg(''), 4000);

    setIsAddingFeedback(false);
    setEditingFeedback(null);
  };

  const handleDeleteFeedback = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the feedback from "${name}"?`)) return;

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

  // Delete booking inquiry from local and Supabase
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this consultation log?')) return;
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('floatingdrapes_bookings', JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      await deleteBookingFromSupabase(id);
    }
  };

  // Delete contact inquiry from local and Supabase
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact inquiry?')) return;
    const updated = inquiries.filter(i => i.id !== id);
    setInquiries(updated);
    localStorage.setItem('floatingdrapes_contacts', JSON.stringify(updated));
    if (isSupabaseConfigured()) {
      await deleteInquiryFromSupabase(id);
    }
  };

  // Supabase: Save Credentials
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
      
      // Pull fresh data from Supabase
      handlePullFromSupabase();
    } else {
      setSupabaseStatus('disconnected');
      setSupabaseStatusMessage(testRes.message);
      alert(testRes.message);
    }
  };

  // Supabase: Test Connection manually
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

  // Supabase: One-Click Seed Catalog
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
      if (res.success) {
        alert(res.message);
      } else {
        alert(res.message);
      }
    } finally {
      setIsSeedingDatabase(false);
    }
  };

  // Supabase: Pull Universal Data
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

  // Copy SQL Schema
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden text-white" id="admin-panel-overlay">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#00172e] border border-[#003866] shadow-[0_20px_60px_rgba(0,153,255,0.25)] flex flex-col rounded-2xl overflow-hidden" id="admin-panel-container">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#003366] bg-[#001f3f]">
          <div className="flex items-center space-x-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#0099ff] animate-pulse" />
            <span className="font-sans text-[11px] font-bold tracking-[0.3em] text-[#0099ff] uppercase">FLOATING DRAPES SYSTEM ENGINE</span>
            
            {/* Supabase status badge */}
            {supabaseStatus === 'connected' ? (
              <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase flex items-center space-x-1.5 rounded">
                <Wifi className="h-3 w-3 text-emerald-400" />
                <span>SUPABASE REALTIME: ACTIVE</span>
              </span>
            ) : supabaseStatus === 'testing' ? (
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase flex items-center space-x-1.5 rounded">
                <RefreshCw className="h-3 w-3 animate-spin text-amber-400" />
                <span>CONNECTING SUPABASE...</span>
              </span>
            ) : (
              <span className="bg-[#002b49] text-[#88a3bc] border border-[#003866] px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase flex items-center space-x-1.5 rounded">
                <WifiOff className="h-3 w-3 text-[#88a3bc]" />
                <span>LOCAL BUFFER (OFFLINE)</span>
              </span>
            )}

            {isAuthenticated && (
              <span className="hidden sm:inline-block bg-[#0099ff]/15 text-[#0099ff] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-[#0099ff]/30 rounded">
                MASTER CONTROL
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Exit System Panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NOT AUTHENTICATED - SHOW LOGIN MODAL */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-md mx-auto py-12">
            <div className="w-full bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-8 shadow-2xl text-[#002b49]">
              <div className="w-14 h-14 bg-[#e3f2fd] border border-[#90cdf4] rounded-full flex items-center justify-center text-[#0099ff] mx-auto mb-5 shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              
              <h2 className="font-serif text-2xl text-center font-bold text-[#002b49] mb-1.5">Enter Master Credentials</h2>
              <p className="font-sans text-xs text-[#335577] text-center mb-6 leading-relaxed">
                Floating Drapes control panel. Enter your Supabase Admin user credentials (or server credentials) to access the dashboard.
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
                      placeholder="Enter your Supabase admin user email"
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
                  <span>{isSubmittingLogin ? 'VERIFYING WITH SUPABASE...' : 'AUTHORIZE AND SIGN IN'}</span>
                </button>
              </form>

              {/* SECURE BACKEND VERIFICATION NOTICE */}
              <div className="w-full mt-6 bg-[#e3f2fd]/60 border border-[#b8dcfa] p-3.5 rounded-lg text-[11px] leading-relaxed text-[#335577] text-center">
                <span className="font-bold text-[#0077c2] uppercase tracking-wider block mb-0.5">🛡️ Supabase Authentication Active</span>
                Sign in with your newly created Supabase user email and password.
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED PANEL LAYOUT */
          <div className="flex-1 flex overflow-hidden">
            
            {/* SIDE BAR BUTTONS */}
            <div className="w-64 border-r border-[#003366] bg-[#00172e] flex flex-col justify-between shrink-0">
              <div className="p-4 space-y-1.5">
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

              {/* LOGOUT */}
              <div className="p-4 border-t border-[#003366] bg-[#001326]">
                {sessionStorage.getItem('fd_admin_user_email') && (
                  <div className="mb-2.5 px-3 py-2 bg-[#002244] border border-[#003866] text-[10px] text-[#88ccff] rounded-lg truncate">
                    <span className="block text-[8px] uppercase tracking-wider text-[#0099ff] font-bold">Logged In User</span>
                    <span className="truncate text-white font-medium">{sessionStorage.getItem('fd_admin_user_email')}</span>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 text-red-300 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg"
                >
                  EXIT MASTER SESSION
                </button>
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#001428]">
              
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
                    {/* Hero labels */}
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Bold Subtitle Accent</label>
                          <input
                            type="text"
                            value={captions.heroSub1}
                            onChange={(e) => setCaptions({ ...captions, heroSub1: e.target.value })}
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Colored Subtitle</label>
                          <input
                            type="text"
                            value={captions.heroSub2}
                            onChange={(e) => setCaptions({ ...captions, heroSub2: e.target.value })}
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Main Hero Description</label>
                        <textarea
                          rows={3}
                          value={captions.heroDesc}
                          onChange={(e) => setCaptions({ ...captions, heroDesc: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] resize-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* About us settings */}
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

                      <div>
                        <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Narrative Paragraph 2</label>
                        <textarea
                          rows={4}
                          value={captions.aboutText2}
                          onChange={(e) => setCaptions({ ...captions, aboutText2: e.target.value })}
                          className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] resize-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: THEME & BRAND LOGO */}
              {activeTab === 'theme' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="border-b border-[#d8eaf7] pb-4">
                    <h3 className="font-serif text-2xl font-bold text-[#002b49]">Theme Styling & Typography Presets</h3>
                    <p className="font-sans text-xs text-[#335577] mt-1">Live swap styling sheets, paint palettes, typography couplings, and change your brand logo universally.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Theme selector */}
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

                    {/* Font & Brand logo customizer */}
                    <div className="space-y-6">
                      <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-5 shadow-sm">
                        <div className="flex items-center space-x-2 text-[#0099ff]">
                          <Type className="h-4 w-4" />
                          <h4 className="text-xs font-bold uppercase tracking-wider">Select Typographical Coupling</h4>
                        </div>

                        <div className="space-y-3">
                          {[
                            { id: 'jakarta_playfair', title: 'Plus Jakarta Sans & Playfair Display', desc: 'Sleek, fluid geometric body paired with grand classic headings (Default)' },
                            { id: 'inter_cinzel', title: 'Cinzel & Inter', desc: 'Imperial, Roman display typography paired with clean structural sans body' },
                            { id: 'outfit_bodoni', title: 'Outfit & Bodoni Moda', desc: 'Avant-garde editorial fashion pairing with warm italic curvatures' },
                          ].map((f) => (
                            <button
                              key={f.id}
                              onClick={() => handleSaveTheme(captions.themePreset, f.id as any)}
                              className={`w-full p-4 border text-left flex items-center justify-between rounded-xl transition-all cursor-pointer ${captions.fontPreset === f.id ? 'border-[#0099ff] bg-[#e3f2fd] shadow-sm' : 'border-[#d8eaf7] bg-[#f8fbfe] hover:border-[#0099ff]/50'}`}
                            >
                              <div className="space-y-1">
                                <span className="text-xs font-bold block text-[#002b49]">{f.title}</span>
                                <span className="text-[10px] text-[#335577] block leading-relaxed">{f.desc}</span>
                              </div>
                              {captions.fontPreset === f.id && (
                                <Check className="h-4 w-4 text-[#0099ff] ml-2" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Brand logo URL input */}
                      <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center space-x-2 text-[#0099ff]">
                          <Link className="h-4 w-4" />
                          <h4 className="text-xs font-bold uppercase tracking-wider">Brand Logo Link Control</h4>
                        </div>
                        <p className="font-sans text-[11px] text-[#335577] leading-relaxed">
                          Provide any relative path or online image link (Unsplash, Imgur, or direct CDN URL) to immediately replace the header and footer brand emblems.
                        </p>
                        
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
                      <p className="font-sans text-xs text-[#335577] mt-1">Directly edit, delete, or append newly structured curtains, wallpapers, and blinds. Automatically broadcasted to Supabase.</p>
                    </div>
                    <button
                      onClick={startAddProduct}
                      className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow-md shadow-[#0099ff]/25 transition-all flex items-center space-x-2 self-start cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>ADD NEW PRODUCT</span>
                    </button>
                  </div>

                  {/* CATEGORY SELECTOR */}
                  <div className="flex border border-[#c5def2] bg-white p-1 rounded-xl max-w-md shadow-sm">
                    {[
                      { id: 'curtains', label: 'Curtains Installation' },
                      { id: 'wallpapers', label: 'Wallpaper Coverings' },
                      { id: 'blinds', label: 'Bespoke Blinds' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedProductCategory(cat.id as any);
                          setIsAddingProduct(false);
                          setEditingProduct(null);
                        }}
                        className={`flex-1 py-2 text-center text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer ${selectedProductCategory === cat.id ? 'bg-[#0099ff] text-white shadow-sm' : 'text-[#006699] hover:bg-[#e3f2fd]'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* FORM TO ADD/EDIT PRODUCT */}
                  {(isAddingProduct || editingProduct) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-6 shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-[#e2effa] pb-3">
                        <span className="font-serif text-lg font-bold text-[#002b49]">
                          {isAddingProduct ? 'Append New Premium Product' : `Modifying: ${editingProduct.name}`}
                        </span>
                        <button 
                          onClick={() => {
                            setIsAddingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="text-[#335577] hover:text-[#002b49] text-xs uppercase font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Product Name *</label>
                            <input
                              type="text"
                              required
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                              placeholder="e.g. Royal Silk Drapery"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Image Link (Custom CDN or Unsplash URL) *</label>
                            <input
                              type="text"
                              required
                              value={productForm.image}
                              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                              placeholder="e.g. https://images.unsplash.com/photo-..."
                            />
                          </div>

                          {selectedProductCategory === 'curtains' ? (
                            <div>
                              <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Price Class Classification</label>
                              <select
                                value={productForm.priceClass}
                                onChange={(e) => setProductForm({ ...productForm, priceClass: e.target.value })}
                                className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                              >
                                <option value="Premium">Premium</option>
                                <option value="Signature">Signature</option>
                                <option value="Reserve">Reserve Luxury</option>
                              </select>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Design Style Type</label>
                              {selectedProductCategory === 'wallpapers' ? (
                                <select
                                  value={productForm.style}
                                  onChange={(e) => setProductForm({ ...productForm, style: e.target.value })}
                                  className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                                >
                                  <option value="Classic">Classic</option>
                                  <option value="Botanical">Botanical</option>
                                  <option value="Textured">Textured</option>
                                  <option value="Modern">Modern</option>
                                </select>
                              ) : (
                                <select
                                  value={productForm.style}
                                  onChange={(e) => setProductForm({ ...productForm, style: e.target.value })}
                                  className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                                >
                                  <option value="Roman">Roman Shade</option>
                                  <option value="Roller">Roller Shade</option>
                                  <option value="Venetian">Venetian blind</option>
                                  <option value="Motorized">Motorized blind</option>
                                  <option value="Zebra">Zebra blind</option>
                                </select>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Material Composition (Comma-separated)</label>
                            <input
                              type="text"
                              value={productForm.materials}
                              onChange={(e) => setProductForm({ ...productForm, materials: e.target.value })}
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                              placeholder="e.g. Pure Merino Wool, Thermal Sateen, Brass Rings"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-[#006699] font-bold uppercase tracking-wider mb-1">Product Narrative Description *</label>
                            <textarea
                              rows={4}
                              required
                              value={productForm.description}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] resize-none transition-colors"
                              placeholder="Type elegant marketing detail description..."
                            />
                          </div>

                          <div className="pt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingProduct(false);
                                setEditingProduct(null);
                              }}
                              className="border border-[#c5def2] hover:bg-[#e3f2fd] text-[#002b49] px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
                            >
                              CANCEL
                            </button>
                            <button
                              type="submit"
                              className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md shadow-[#0099ff]/25 transition-colors cursor-pointer"
                            >
                              {isAddingProduct ? 'CONFIRM ADDITION' : 'SAVE CHANGES'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* PRODUCTS TABLE */}
                  <div className="border border-[#c5def2] bg-white rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#c5def2] bg-[#e3f2fd] text-[10px] font-bold tracking-wider text-[#006699] uppercase">
                          <th className="p-4 w-16">Preview</th>
                          <th className="p-4 w-48">Product Detail</th>
                          <th className="p-4">Narrative Description</th>
                          <th className="p-4 w-32">Classification</th>
                          <th className="p-4 w-28 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2effa]">
                        {selectedProductCategory === 'curtains' && curtains.map((item) => (
                          <tr key={item.id} className="hover:bg-[#f8fbfe] transition-colors">
                            <td className="p-4">
                              <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-lg border border-[#c5def2]" />
                            </td>
                            <td className="p-4 font-semibold">
                              <span className="block text-[#002b49] text-xs font-bold">{item.name}</span>
                              <span className="block text-[10px] text-[#335577] mt-0.5 font-normal">ID: {item.id}</span>
                            </td>
                            <td className="p-4 text-[11px] text-[#335577] max-w-sm line-clamp-2">
                              {item.description}
                            </td>
                            <td className="p-4">
                              <span className="inline-block px-2 py-0.5 bg-[#e3f2fd] text-[#0077c2] border border-[#90cdf4] text-[9px] font-bold tracking-wider uppercase rounded-md">
                                {item.priceClass}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => startEditProduct(item)}
                                className="p-1.5 hover:bg-[#e3f2fd] text-[#006699] hover:text-[#0099ff] rounded-lg transition-colors inline-block cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(item.id, 'curtains')}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors inline-block cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {selectedProductCategory === 'wallpapers' && wallpapers.map((item) => (
                          <tr key={item.id} className="hover:bg-[#f8fbfe] transition-colors">
                            <td className="p-4">
                              <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-lg border border-[#c5def2]" />
                            </td>
                            <td className="p-4 font-semibold">
                              <span className="block text-[#002b49] text-xs font-bold">{item.name}</span>
                              <span className="block text-[10px] text-[#335577] mt-0.5 font-normal">ID: {item.id}</span>
                            </td>
                            <td className="p-4 text-[11px] text-[#335577] max-w-sm line-clamp-2">
                              {item.description}
                            </td>
                            <td className="p-4">
                              <span className="inline-block px-2 py-0.5 bg-[#e3f2fd] text-[#0077c2] border border-[#90cdf4] text-[9px] font-bold tracking-wider uppercase rounded-md">
                                {item.style}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => startEditProduct(item)}
                                className="p-1.5 hover:bg-[#e3f2fd] text-[#006699] hover:text-[#0099ff] rounded-lg transition-colors inline-block cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(item.id, 'wallpapers')}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors inline-block cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {selectedProductCategory === 'blinds' && blinds.map((item) => (
                          <tr key={item.id} className="hover:bg-[#f8fbfe] transition-colors">
                            <td className="p-4">
                              <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-lg border border-[#c5def2]" />
                            </td>
                            <td className="p-4 font-semibold">
                              <span className="block text-[#002b49] text-xs font-bold">{item.name}</span>
                              <span className="block text-[10px] text-[#335577] mt-0.5 font-normal">ID: {item.id}</span>
                            </td>
                            <td className="p-4 text-[11px] text-[#335577] max-w-sm line-clamp-2">
                              {item.description}
                            </td>
                            <td className="p-4">
                              <span className="inline-block px-2 py-0.5 bg-[#e3f2fd] text-[#0077c2] border border-[#90cdf4] text-[9px] font-bold tracking-wider uppercase rounded-md">
                                {item.style}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <button 
                                onClick={() => startEditProduct(item)}
                                className="p-1.5 hover:bg-[#e3f2fd] text-[#006699] hover:text-[#0099ff] rounded-lg transition-colors inline-block cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(item.id, 'blinds')}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors inline-block cursor-pointer"
                                title="Delete Product"
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
              )}

              {/* TAB: FEEDBACK & REVIEWS MASTER CONTROLLER */}
              {activeTab === 'feedback' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  {/* HEADER BANNER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#d8eaf7] gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold flex items-center space-x-2 text-[#002b49]">
                        <span>Customer Feedback Master Controller</span>
                        <span className="text-xs px-2.5 py-0.5 bg-[#e3f2fd] text-[#0077c2] border border-[#90cdf4] font-sans font-bold rounded-md">
                          {testimonials.length} Active Reviews
                        </span>
                      </h3>
                      <p className="font-sans text-xs text-[#335577] mt-1">
                        Manage customer reviews, 5-star ratings, and profile icons. If no profile photo is uploaded, an initial medallion with the customer's first letter will display automatically.
                      </p>
                    </div>

                    {!isAddingFeedback && !editingFeedback && (
                      <button
                        onClick={handleStartAddFeedback}
                        className="px-5 py-2.5 bg-[#0099ff] text-white hover:bg-[#0088ee] text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 shadow-md shadow-[#0099ff]/25 rounded-lg"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add New Feedback</span>
                      </button>
                    )}
                  </div>

                  {/* SUCCESS NOTIFICATION */}
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
                          title="Close form"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                        {/* ROW 1: NAME, LOCATION, ROLE */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">
                              Customer Name *
                            </label>
                            <input
                              type="text"
                              value={feedbackForm.name}
                              onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. Priya Sharma"
                              required
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] placeholder:text-slate-400 outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">
                              Location / City
                            </label>
                            <input
                              type="text"
                              value={feedbackForm.location || ''}
                              onChange={(e) => setFeedbackForm(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="e.g. Race Course, Coimbatore"
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] placeholder:text-slate-400 outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold tracking-wider uppercase text-[#006699] mb-1.5">
                              Customer Role / Title
                            </label>
                            <input
                              type="text"
                              value={feedbackForm.role || ''}
                              onChange={(e) => setFeedbackForm(prev => ({ ...prev, role: e.target.value }))}
                              placeholder="e.g. Villa Owner / Interior Designer"
                              className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] placeholder:text-slate-400 outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                            />
                          </div>
                        </div>

                        {/* ROW 2: STAR RATING */}
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
                                title={`${star} Stars`}
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

                        {/* ROW 3: PROFILE ICON & AVATAR MASTER CONTROLLER */}
                        <div className="p-5 bg-[#f8fbfe] border border-[#c5def2] rounded-xl space-y-4">
                          <div className="flex items-center justify-between border-b border-[#e2effa] pb-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-[#0099ff]" />
                              <span className="text-xs font-bold tracking-wider uppercase text-[#002b49]">
                                Profile Icon & Avatar Master Controller
                              </span>
                            </div>
                            <span className="text-[10px] text-[#006699] font-medium bg-[#e3f2fd] px-2 py-0.5 rounded-md">
                              Intelligent Avatar Fallback System
                            </span>
                          </div>

                          <p className="text-xs text-[#335577] leading-relaxed">
                            Upload a photograph for the client, or paste an image link. If no profile photo is uploaded, our system will automatically generate an elegant medallion displaying the <strong className="text-[#002b49]">first letter of the customer's name</strong> on the live storefront.
                          </p>

                          {/* LIVE PREVIEW AND CONTROLS */}
                          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                            {/* LIVE PREVIEW BADGE */}
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

                            {/* UPLOAD & CONTROLS */}
                            <div className="flex-1 w-full space-y-3">
                              {/* STATUS BADGE */}
                              {feedbackForm.image ? (
                                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                                  <div className="flex items-center space-x-2 text-emerald-700 text-xs font-medium">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                                    <span>Custom Profile Photo Active</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleRemoveFeedbackPhoto}
                                    className="text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
                                  >
                                    Remove Photo (Use First Letter)
                                  </button>
                                </div>
                              ) : (
                                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg">
                                  <div className="flex items-center space-x-2 text-sky-800 text-xs font-medium">
                                    <Sparkles className="h-4 w-4 shrink-0 text-[#0099ff]" />
                                    <span>
                                      First-Letter Avatar Active: &quot;
                                      {(feedbackForm.name?.trim()?.charAt(0) || 'C').toUpperCase()}
                                      &quot;
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#335577] mt-0.5">
                                    No photo uploaded. The storefront will display an initial medallion with letter &quot;{(feedbackForm.name?.trim()?.charAt(0) || 'C').toUpperCase()}&quot;.
                                  </p>
                                </div>
                              )}

                              {/* UPLOAD BUTTON + URL INPUT */}
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <label className="px-4 py-2 bg-[#e3f2fd] hover:bg-[#d0e8f9] text-[#006699] border border-[#90cdf4] text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer transition-colors shrink-0 rounded-lg">
                                  <Upload className="h-3.5 w-3.5 text-[#0099ff]" />
                                  <span>Upload Photo File</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFeedbackImageFileUpload}
                                    className="hidden"
                                  />
                                </label>
                                <span className="text-[11px] text-[#335577] text-center sm:text-left font-medium">or URL:</span>
                                <input
                                  type="text"
                                  value={feedbackForm.image || ''}
                                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, image: e.target.value }))}
                                  placeholder="Paste direct profile image URL (https://...)"
                                  className="flex-1 bg-white border border-[#c5def2] focus:border-[#0099ff] px-3.5 py-2 text-xs text-[#002b49] placeholder:text-slate-400 outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ROW 4: REVIEW TEXTAREA */}
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
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] p-3.5 text-xs text-[#002b49] placeholder:text-slate-400 outline-none rounded-lg focus:ring-1 focus:ring-[#0099ff] transition-colors resize-y leading-relaxed"
                          />
                        </div>

                        {/* FORM ACTION BUTTONS */}
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
                            <span>{isAddingFeedback ? 'Save & Publish Feedback' : 'Save Feedback Changes'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SEARCH AND FEEDBACK LIST */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="relative flex-1 max-w-md">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={feedbackSearch}
                          onChange={(e) => setFeedbackSearch(e.target.value)}
                          placeholder="Search feedback by customer name, location, or words..."
                          className="w-full bg-white border border-[#c5def2] focus:border-[#0099ff] pl-9 pr-4 py-2.5 text-xs text-[#002b49] placeholder:text-slate-400 outline-none rounded-lg shadow-sm focus:ring-1 focus:ring-[#0099ff] transition-colors"
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

                    {/* FEEDBACK TABLE */}
                    <div className="border border-[#c5def2] overflow-x-auto bg-white rounded-xl shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#c5def2] bg-[#e3f2fd] text-[10px] font-bold tracking-wider uppercase text-[#006699]">
                            <th className="p-3.5">Customer & Avatar</th>
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
                          {testimonials.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-[#335577] text-xs">
                                No customer testimonials added yet. Click &quot;Add New Feedback&quot; to create your first client review.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INQUIRIES & CONSULTATIONS */}
              {activeTab === 'inquiries' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="border-b border-[#d8eaf7] pb-5">
                    <h3 className="font-serif text-2xl font-bold text-[#002b49]">Inbound Leads & Consultation Inquiries</h3>
                    <p className="font-sans text-xs text-[#335577] mt-1">Review live inquiry submissions dispatched by clients requesting on-site consultations or custom quotes.</p>
                  </div>

                  {/* Section A: Consultation Bookings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#006699] flex items-center space-x-2">
                        <span>Consultation Bookings ({bookings.length})</span>
                      </h4>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="text-center py-12 bg-white border border-[#c5def2] rounded-xl space-y-2 shadow-sm">
                        <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
                        <p className="font-sans text-xs text-[#335577]">No consultation bookings registered yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            className="bg-white border border-[#c5def2] rounded-xl p-6 relative group transition-all hover:border-[#0099ff] shadow-sm"
                            id={`booking-card-${booking.id}`}
                          >
                            <button 
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                              title="Delete Log"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-1 space-y-1">
                                <span className="block text-[10px] font-bold tracking-widest text-[#006699] uppercase">CLIENT ACCOUNT</span>
                                <strong className="block text-[#002b49] font-serif text-base">{booking.name}</strong>
                                <span className="block text-xs text-[#335577]">{booking.phone}</span>
                                {booking.email && <span className="block text-xs text-[#0099ff] underline">{booking.email}</span>}
                              </div>
                              
                              <div className="md:col-span-1 space-y-1">
                                <span className="block text-[10px] font-bold tracking-widest text-[#006699] uppercase">CONSULT PARAMETERS</span>
                                <span className="block text-xs font-semibold text-[#002b49]">Project: {booking.projectType}</span>
                                <span className="block text-xs text-[#335577]">Budget: {booking.budget || 'Unspecified'}</span>
                                <span className="block text-xs text-[#335577]">Preferred: {booking.preferredDate || 'Flexible'}</span>
                              </div>

                              <div className="md:col-span-2 space-y-1">
                                <span className="block text-[10px] font-bold tracking-widest text-[#006699] uppercase">LOGGED TIMESTAMP</span>
                                <span className="block text-[11px] text-[#335577]">{new Date(booking.timestamp).toLocaleString()}</span>
                                {booking.message && (
                                  <p className="text-xs bg-[#f8fbfe] p-3.5 mt-2 border border-[#d2e5f5] text-[#335577] italic rounded-lg leading-relaxed">
                                    "{booking.message}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section B: Contact Messages */}
                  <div className="space-y-4 pt-5 border-t border-[#d8eaf7]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#006699] flex items-center space-x-2">
                        <span>General Contact Enquiries ({inquiries.length})</span>
                      </h4>
                    </div>

                    {inquiries.length === 0 ? (
                      <div className="text-center py-12 bg-white border border-[#c5def2] rounded-xl space-y-2 shadow-sm">
                        <Mail className="h-8 w-8 text-slate-400 mx-auto" />
                        <p className="font-sans text-xs text-[#335577]">No general contact form messages registered yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.map((inq) => (
                          <div 
                            key={inq.id} 
                            className="bg-white border border-[#c5def2] rounded-xl p-6 relative group transition-all hover:border-[#0099ff] shadow-sm"
                            id={`inquiry-card-${inq.id}`}
                          >
                            <button 
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                              title="Delete Log"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-1 space-y-1">
                                <span className="block text-[10px] font-bold tracking-widest text-[#006699] uppercase">INQUIRER</span>
                                <strong className="block text-[#002b49] font-serif text-base">{inq.name}</strong>
                                <span className="block text-xs text-[#335577]">{inq.phone}</span>
                                {inq.email && <span className="block text-xs text-[#0099ff] underline">{inq.email}</span>}
                              </div>
                              
                              <div className="md:col-span-1 space-y-1">
                                <span className="block text-[10px] font-bold tracking-widest text-[#006699] uppercase">CATEGORY & LOCATION</span>
                                <span className="block text-xs font-semibold text-[#002b49]">{inq.project_type || inq.projectType}</span>
                                <span className="block text-xs text-[#335577]">{inq.location || 'Location Not Specified'}</span>
                              </div>

                              <div className="md:col-span-2 space-y-1">
                                <span className="block text-[10px] font-bold tracking-widest text-[#006699] uppercase">MESSAGE & DATE</span>
                                <span className="block text-[11px] text-[#335577]">{new Date(inq.timestamp).toLocaleString()}</span>
                                {inq.message && (
                                  <p className="text-xs bg-[#f8fbfe] p-3.5 mt-2 border border-[#d2e5f5] text-[#335577] italic rounded-lg leading-relaxed">
                                    "{inq.message}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 5: UNIVERSAL SUPABASE DATABASE */}
              {activeTab === 'database' && (
                <div className="space-y-8 bg-[#F4F9FD] border border-[#d2e5f5] rounded-2xl p-6 sm:p-8 text-[#002b49] shadow-xl">
                  <div className="border-b border-[#d8eaf7] pb-5">
                    <h3 className="font-serif text-2xl font-bold text-[#002b49]">Supabase Universal Database & Realtime Sync Engine</h3>
                    <p className="font-sans text-xs text-[#335577] mt-1">
                      Connect your Supabase database project so that product edits, captions, themes, bookings, and inquiries persist centrally and update in real-time across all visitor devices.
                    </p>
                  </div>

                  {/* Status Card */}
                  <div className={`p-5 rounded-xl border ${supabaseStatus === 'connected' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : supabaseStatus === 'testing' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-[#c5def2] text-[#002b49]'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-3.5">
                        <div className={`p-2.5 rounded-full mt-0.5 ${supabaseStatus === 'connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-[#0099ff]'}`}>
                          <Database className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold uppercase tracking-wider">
                              {supabaseStatus === 'connected' ? 'Universal Database Connected' : supabaseStatus === 'testing' ? 'Verifying Supabase Connection...' : 'Supabase Not Connected'}
                            </h4>
                            {isSupabaseFromEnv && (
                              <span className="bg-[#e3f2fd] text-[#0077c2] text-[9px] px-2 py-0.5 font-bold uppercase border border-[#90cdf4] rounded">
                                Loaded from .env
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#335577] mt-1 leading-relaxed">
                            {supabaseStatusMessage || 'Enter your Supabase Project URL and Anon Key below to establish universal live database persistence.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        <button
                          onClick={handleTestConnection}
                          disabled={!supabaseUrl || !supabaseKey}
                          className="border border-[#c5def2] bg-white hover:bg-[#e3f2fd] text-[#002b49] disabled:opacity-40 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-[#0099ff]" />
                          <span>TEST STATUS</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Form */}
                  <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-6 shadow-sm">
                    <div className="flex items-center space-x-2 text-[#0099ff]">
                      <ShieldCheck className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#002b49]">Supabase Project API Credentials</h4>
                    </div>

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
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] transition-colors"
                          />
                          <span className="text-[10px] text-[#335577] mt-1 block">
                            Found in Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                          </span>
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
                            className="w-full bg-[#f8fbfe] border border-[#c5def2] focus:bg-white focus:border-[#0099ff] text-[#002b49] px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0099ff] font-mono transition-colors"
                          />
                          <span className="text-[10px] text-[#335577] mt-1 block">
                            Found in Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow-md shadow-[#0099ff]/25 transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>SAVE & ACTIVATE SUPABASE</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            clearStoredSupabaseCredentials();
                            setSupabaseUrl('');
                            setSupabaseKey('');
                            setSupabaseStatus('unconfigured');
                            setSupabaseStatusMessage('Credentials cleared.');
                            alert('Supabase credentials cleared.');
                          }}
                          className="border border-[#c5def2] hover:bg-red-50 hover:border-red-200 text-red-500 px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer"
                        >
                          DISCONNECT
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* One-Click Synchronization Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Push Catalog to Supabase */}
                    <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center space-x-2 text-[#0099ff]">
                        <UploadCloud className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#002b49]">Push & Seed Local Catalog to Supabase</h4>
                      </div>
                      <p className="text-xs text-[#335577] leading-relaxed">
                        Populate your Supabase tables with all 50+ rich curtain models, textured wallpaper collections, bespoke motorized blinds, and site configuration in 1 second.
                      </p>
                      <button
                        onClick={handleSeedSupabase}
                        disabled={!isSupabaseConfigured() || isSeedingDatabase}
                        className="bg-[#0099ff] hover:bg-[#0088ee] disabled:opacity-40 text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg shadow-md shadow-[#0099ff]/25 transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>{isSeedingDatabase ? 'SEEDING DATABASE...' : 'SEED COMPLETE CATALOG (50+ ITEMS)'}</span>
                      </button>
                    </div>

                    {/* Pull Universal Data from Supabase */}
                    <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center space-x-2 text-[#0099ff]">
                        <DownloadCloud className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#002b49]">Pull Live Universal State from Supabase</h4>
                      </div>
                      <p className="text-xs text-[#335577] leading-relaxed">
                        Fetch the latest universal catalog, site captions, active theme, and consultation bookings directly from Supabase to refresh your local browser cache.
                      </p>
                      <button
                        onClick={handlePullFromSupabase}
                        disabled={!isSupabaseConfigured() || isPullingData}
                        className="border border-[#c5def2] hover:bg-[#e3f2fd] disabled:opacity-40 text-[#002b49] px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 text-[#0099ff] ${isPullingData ? 'animate-spin' : ''}`} />
                        <span>{isPullingData ? 'PULLING FROM SUPABASE...' : 'REFRESH & SYNC FROM SUPABASE'}</span>
                      </button>
                    </div>
                  </div>

                  {/* SQL Schema Generator Card */}
                  <div className="bg-white border border-[#c5def2] rounded-xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#0099ff]">
                        <FileText className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#002b49]">Supabase SQL Table Schema & RLS Setup Script</h4>
                      </div>
                      <button
                        onClick={handleCopySql}
                        className="bg-[#0099ff] hover:bg-[#0088ee] text-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-md shadow-[#0099ff]/25 transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        {sqlCopied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{sqlCopied ? 'COPIED TO CLIPBOARD!' : 'COPY SQL SCRIPT'}</span>
                      </button>
                    </div>

                    <div className="text-xs text-[#335577] space-y-2">
                      <p>
                        <strong>How to run:</strong> Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-[#0099ff] underline inline-flex items-center space-x-1 font-semibold"><span>Supabase Dashboard</span> <ExternalLink className="h-3 w-3 inline" /></a> &gt; <strong>SQL Editor</strong> &gt; <strong>New query</strong> &gt; Paste this script &gt; Click <strong>Run</strong>.
                      </p>
                      <p className="text-[11px] text-[#335577]">
                        This script creates <code>site_config</code>, <code>curtains</code>, <code>wallpapers</code>, <code>blinds</code>, <code>bookings</code>, and <code>inquiries</code> tables with Row Level Security (RLS) and enables Realtime replication for instant universal updates.
                      </p>
                    </div>

                    <div className="relative">
                      <pre className="bg-[#001f35] border border-[#003960] p-4 text-[11px] font-mono text-sky-100 rounded-lg overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-sky-700">
                        {SUPABASE_SQL_SCHEMA}
                      </pre>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
