import React, { useState, useEffect, useRef } from 'react';
import { SiteConfig, CurtainItem, WallpaperItem, BookingSubmission, UploadedImage, Testimonial } from '../types';
import { BlindItem } from '../data/productsData';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testSupabaseConnection,
  seedDefaultCatalogToSupabase,
  uploadImageToSupabase,
  fetchUniversalSiteData,
  upsertCurtainToSupabase,
  deleteCurtainFromSupabase,
  upsertWallpaperToSupabase,
  deleteWallpaperFromSupabase,
  upsertBlindToSupabase,
  deleteBlindFromSupabase,
  syncSiteConfigToSupabase,
  deleteBookingFromSupabase,
  deleteInquiryFromSupabase,
  upsertFeedbackToSupabase,
  deleteFeedbackFromSupabase,
  deleteUploadedImageFromSupabase,
  SUPABASE_SQL_SCHEMA
} from '../services/supabaseClient';
import {
  X,
  Lock,
  LogOut,
  Database,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Layers,
  Settings,
  Image as ImageIcon,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
  curtains: CurtainItem[];
  wallpapers: WallpaperItem[];
  blinds: BlindItem[];
  onRefreshData?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  siteConfig,
  onUpdateConfig,
  curtains,
  wallpapers,
  blinds,
  onRefreshData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'database' | 'media' | 'content' | 'bookings'>('database');

  // Supabase Connection States
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseKey, setSupabaseKey] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    tablesFound?: string[];
    missingTables?: string[];
  }>({ tested: false, success: false, message: '' });
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Media upload state
  const [uploadCategory, setUploadCategory] = useState<'hero' | 'curtains' | 'wallpapers' | 'blinds' | 'why_choose_us' | 'customization' | 'general'>('general');
  const [uploadTitle, setUploadTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [mediaList, setMediaList] = useState<UploadedImage[]>([]);

  // ----------------------------------------------------
  // AUTO-LOGOUT ON INACTIVITY (15 MINUTES)
  // ----------------------------------------------------
  const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('floatingdrapes_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
    setAuthError('');
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (isAuthenticated) {
      inactivityTimerRef.current = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_LIMIT_MS);
    }
  };

  useEffect(() => {
    const isSavedAuth = localStorage.getItem('floatingdrapes_admin_auth') === 'true';
    if (isSavedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetInactivityTimer();

    activityEvents.forEach((evt) => window.addEventListener(evt, handleActivity));
    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      activityEvents.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setSupabaseUrl(creds.url);
      setSupabaseKey(creds.key);
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    try {
      const data = await fetchUniversalSiteData();
      if (data.uploadedImages) {
        setMediaList(data.uploadedImages);
      }
    } catch (e) {
      console.warn('Could not fetch media:', e);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('floatingdrapes_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid administrator password');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus({ tested: false, success: false, message: '' });
    try {
      const res = await testSupabaseConnection();
      setConnectionStatus({
        tested: true,
        success: res.success,
        message: res.message,
        tablesFound: res.tablesFound,
        missingTables: res.missingTables
      });
    } catch (err: any) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: err?.message || 'Failed to connect to Supabase.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveCredentials = () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      alert('Please provide both Project URL and Anon API Key');
      return;
    }
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    alert('Credentials saved! Testing connection now...');
    handleTestConnection();
  };

  const handleSeedDatabase = async () => {
    if (!confirm('This will seed the default catalogs, configuration, and sample testimonials into your Supabase database. Continue?')) {
      return;
    }
    setIsSeeding(true);
    setSeedMessage('');
    try {
      const res = await seedDefaultCatalogToSupabase(siteConfig);
      setSeedMessage(res.message);
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setSeedMessage('Error seeding database: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('');
    try {
      const res = await uploadImageToSupabase(file, {
        category: uploadCategory,
        title: uploadTitle || file.name
      });
      setUploadMessage(res.message);
      if (res.success && res.data) {
        setMediaList((prev) => [res.data!, ...prev]);
        setUploadTitle('');
        if (onRefreshData) onRefreshData();
      }
    } catch (err: any) {
      setUploadMessage('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (item: UploadedImage) => {
    if (!confirm(`Delete image "${item.title || item.filename}"?`)) return;
    await deleteUploadedImageFromSupabase(item.id, item.storage_path);
    setMediaList((prev) => prev.filter((m) => m.id !== item.id));
    if (onRefreshData) onRefreshData();
  };

  const copySqlSchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold tracking-wide">Floating Drapes Admin</h2>
              <p className="text-xs text-stone-400">Database synchronization & site asset control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* LOGOUT BUTTON */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900 border border-red-700/60 rounded-lg transition-colors cursor-pointer"
                title="Log out of Admin Panel"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 border border-amber-200">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-1">Administrator Access Required</h3>
            <p className="text-sm text-stone-500 mb-6 max-w-sm">
              Please enter your administrative password to access Supabase configurations and site assets.
            </p>

            <form onSubmit={handleLoginSubmit} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
              {authError && <p className="text-xs text-red-500 font-medium">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition shadow"
              >
                Unlock Admin Controls
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2 pt-2">
              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition border-t border-x ${
                  activeTab === 'database'
                    ? 'bg-white border-stone-200 text-stone-900 border-b-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Supabase Sync</span>
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition border-t border-x ${
                  activeTab === 'media'
                    ? 'bg-white border-stone-200 text-stone-900 border-b-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Media & Uploads</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {activeTab === 'database' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-stone-800 flex items-center gap-2">
                        <span>Connection Status</span>
                        {isSupabaseConfigured() ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Configured
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Pending Credentials
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1">
                        Connect your live Supabase database to synchronize bookings, images, and collections across all visitors.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                      </button>
                    </div>
                  </div>

                  {connectionStatus.tested && (
                    <div
                      className={`p-4 rounded-xl border text-sm ${
                        connectionStatus.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <p className="font-medium">{connectionStatus.message}</p>
                      {connectionStatus.missingTables && connectionStatus.missingTables.length > 0 && (
                        <p className="text-xs mt-1">
                          Missing tables: {connectionStatus.missingTables.join(', ')}. Please run the SQL schema below in your Supabase SQL Editor.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Supabase Keys Input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://xyzcompany.supabase.co"
                        className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Supabase Anon API Key
                      </label>
                      <input
                        type="password"
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleSaveCredentials}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition"
                    >
                      Save Credentials
                    </button>
                  </div>

                  {/* Seeding Section */}
                  <div className="p-4 rounded-xl border border-stone-200 bg-amber-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-stone-800">Seed Default Catalog Data</h5>
                        <p className="text-xs text-stone-600">
                          Uploads initial curtains, wallpapers, blinds, and site configuration directly to your Supabase tables.
                        </p>
                      </div>
                      <button
                        onClick={handleSeedDatabase}
                        disabled={isSeeding}
                        className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition disabled:opacity-50"
                      >
                        {isSeeding ? 'Seeding...' : 'One-Click Seed Catalog'}
                      </button>
                    </div>
                    {seedMessage && <p className="text-xs font-medium text-stone-700 mt-2">{seedMessage}</p>}
                  </div>

                  {/* SQL Schema Copy */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700 uppercase">Database SQL Setup Script</span>
                      <button
                        onClick={copySqlSchema}
                        className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedSchema ? 'Copied!' : 'Copy SQL Schema'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-stone-900 text-stone-200 text-xs rounded-xl overflow-x-auto max-h-40 font-mono">
                      {SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Upload Form */}
                  <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-4">
                    <h4 className="font-bold text-stone-800 text-sm">Upload New Asset to Supabase</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Target Section</label>
                        <select
                          value={uploadCategory}
                          onChange={(e: any) => setUploadCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
                        >
                          <option value="hero">Hero Showcase</option>
                          <option value="curtains">Curtains Collection</option>
                          <option value="wallpapers">Wallpapers Collection</option>
                          <option value="blinds">Blinds Collection</option>
                          <option value="why_choose_us">Why Choose Us</option>
                          <option value="customization">Customization Section</option>
                          <option value="general">General Media Library</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Asset Title / Name</label>
                        <input
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="e.g. Royal Silk Curtain"
                          className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition">
                        <Upload className="w-4 h-4" />
                        <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      {uploadMessage && <span className="text-xs text-stone-600">{uploadMessage}</span>}
                    </div>
                  </div>

                  {/* Media Gallery Grid */}
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm mb-3">
                      Uploaded Assets ({mediaList.length})
                    </h4>
                    {mediaList.length === 0 ? (
                      <p className="text-xs text-stone-500 italic">No media uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaList.map((item) => (
                          <div
                            key={item.id}
                            className="group relative border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col"
                          >
                            <div className="aspect-video bg-stone-100 overflow-hidden relative">
                              <img
                                src={item.file_url || item.base64_data}
                                alt={item.title || item.filename}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <button
                                onClick={() => handleDeleteMedia(item)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow"
                                title="Delete Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="p-2 text-[11px] bg-white">
                              <p className="font-bold text-stone-800 truncate">{item.title || item.filename}</p>
                              <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
