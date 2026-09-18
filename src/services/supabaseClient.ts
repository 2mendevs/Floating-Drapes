import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteConfig, CurtainItem, WallpaperItem, BookingSubmission, DEFAULT_SITE_CONFIG } from '../types';
import { BlindItem, EXTENDED_CURTAINS_DATA, EXTENDED_WALLPAPERS_DATA, EXTENDED_BLINDS_DATA } from '../data/productsData';

// Storage keys for custom Supabase credentials configured via Admin Panel
const STORAGE_URL_KEY = 'floatingdrapes_supabase_url';
const STORAGE_ANON_KEY = 'floatingdrapes_supabase_anon_key';

let activeSupabaseClient: SupabaseClient | null = null;
let currentConfiguredUrl = '';
let currentConfiguredKey = '';

/**
 * Retrieves the active Supabase URL and Key from environment variables or persistent admin storage
 */
export function getSupabaseCredentials(): { url: string; key: string; isFromEnv: boolean } {
  const envUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || '').trim();
  const envKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, isFromEnv: true };
  }

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '').trim();
  const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) || '' : '').trim();

  return {
    url: storedUrl,
    key: storedKey,
    isFromEnv: false
  };
}

/**
 * Checks if Supabase credentials are validly supplied
 */
export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

/**
 * Gets or dynamically creates the Supabase Client singleton
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (activeSupabaseClient && currentConfiguredUrl === url && currentConfiguredKey === key) {
    return activeSupabaseClient;
  }

  try {
    activeSupabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    currentConfiguredUrl = url;
    currentConfiguredKey = key;
    return activeSupabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Saves Supabase credentials into persistent storage and refreshes client
 */
export function saveSupabaseCredentials(url: string, key: string): boolean {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_URL_KEY, url.trim());
      localStorage.setItem(STORAGE_ANON_KEY, key.trim());
    }
    activeSupabaseClient = null; // Force recreate
    return true;
  } catch (e) {
    console.error('Failed to save Supabase credentials:', e);
    return false;
  }
}

/**
 * Removes custom stored Supabase credentials
 */
export function clearStoredSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
  }
  activeSupabaseClient = null;
}

/**
 * Tests connectivity and table accessibility in Supabase
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tablesFound?: string[];
  missingTables?: string[];
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase credentials are not configured. Please supply your Project URL and Anon API Key.'
    };
  }

  const expectedTables = ['site_config', 'curtains', 'wallpapers', 'blinds', 'bookings', 'inquiries'];
  const tablesFound: string[] = [];
  const missingTables: string[] = [];

  for (const table of expectedTables) {
    try {
      const { error } = await client.from(table).select('id').limit(1);
      if (error) {
        // Table likely doesn't exist or RLS issue
        missingTables.push(table);
      } else {
        tablesFound.push(table);
      }
    } catch {
      missingTables.push(table);
    }
  }

  if (tablesFound.length === expectedTables.length) {
    return {
      success: true,
      message: `Successfully connected to Supabase! All ${expectedTables.length} tables are online and synchronized.`,
      tablesFound,
      missingTables: []
    };
  } else if (tablesFound.length > 0) {
    return {
      success: true,
      message: `Connected to Supabase! (${tablesFound.length}/${expectedTables.length} tables verified). Use the SQL schema generator in the Admin Panel to create any missing tables.`,
      tablesFound,
      missingTables
    };
  } else {
    return {
      success: false,
      message: 'Connected to Supabase endpoint, but tables were not found. Please execute the provided SQL setup script in your Supabase SQL Editor.',
      tablesFound: [],
      missingTables: expectedTables
    };
  }
}

/**
 * Fetches all universal site data from Supabase
 */
export async function fetchUniversalSiteData(): Promise<{
  siteConfig: SiteConfig | null;
  curtains: CurtainItem[] | null;
  wallpapers: WallpaperItem[] | null;
  blinds: BlindItem[] | null;
  bookings: BookingSubmission[] | null;
  inquiries: any[] | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      siteConfig: null,
      curtains: null,
      wallpapers: null,
      blinds: null,
      bookings: null,
      inquiries: null
    };
  }

  try {
    const [configRes, curtainsRes, wallpapersRes, blindsRes, bookingsRes, inquiriesRes] = await Promise.allSettled([
      client.from('site_config').select('config').eq('id', 'current_config').single(),
      client.from('curtains').select('*').order('created_at', { ascending: false }),
      client.from('wallpapers').select('*').order('created_at', { ascending: false }),
      client.from('blinds').select('*').order('created_at', { ascending: false }),
      client.from('bookings').select('*').order('timestamp', { ascending: false }),
      client.from('inquiries').select('*').order('timestamp', { ascending: false })
    ]);

    let siteConfig: SiteConfig | null = null;
    if (configRes.status === 'fulfilled' && configRes.value.data?.config) {
      siteConfig = configRes.value.data.config as SiteConfig;
    }

    let curtains: CurtainItem[] | null = null;
    if (curtainsRes.status === 'fulfilled' && curtainsRes.value.data && curtainsRes.value.data.length > 0) {
      curtains = curtainsRes.value.data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        priceClass: item.price_class || item.priceClass || 'Premium',
        materials: Array.isArray(item.materials) ? item.materials : (item.materials ? JSON.parse(item.materials) : [])
      }));
    }

    let wallpapers: WallpaperItem[] | null = null;
    if (wallpapersRes.status === 'fulfilled' && wallpapersRes.value.data && wallpapersRes.value.data.length > 0) {
      wallpapers = wallpapersRes.value.data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        style: item.style || 'Classic',
        materials: Array.isArray(item.materials) ? item.materials : (item.materials ? JSON.parse(item.materials) : [])
      }));
    }

    let blinds: BlindItem[] | null = null;
    if (blindsRes.status === 'fulfilled' && blindsRes.value.data && blindsRes.value.data.length > 0) {
      blinds = blindsRes.value.data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        style: item.style || 'Classic',
        materials: Array.isArray(item.materials) ? item.materials : (item.materials ? JSON.parse(item.materials) : [])
      }));
    }

    let bookings: BookingSubmission[] | null = null;
    if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data) {
      bookings = bookingsRes.value.data.map(item => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email || '',
        preferredDate: item.preferred_date || item.preferredDate || '',
        projectType: item.project_type || item.projectType || 'Curtains Installation',
        budget: item.budget || '',
        location: item.location || '',
        message: item.message || '',
        timestamp: item.timestamp || item.created_at || new Date().toISOString()
      }));
    }

    let inquiries: any[] | null = null;
    if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value.data) {
      inquiries = inquiriesRes.value.data;
    }

    return { siteConfig, curtains, wallpapers, blinds, bookings, inquiries };
  } catch (err) {
    console.error('Error fetching data from Supabase:', err);
    return {
      siteConfig: null,
      curtains: null,
      wallpapers: null,
      blinds: null,
      bookings: null,
      inquiries: null
    };
  }
}

/**
 * Universal Site Config Mutations
 */
export async function syncSiteConfigToSupabase(config: SiteConfig): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('site_config').upsert({
      id: 'current_config',
      config: config,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to sync site config to Supabase:', err);
    return false;
  }
}

/**
 * Universal Curtains Product Mutations
 */
export async function upsertCurtainToSupabase(item: CurtainItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('curtains').upsert({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      price_class: item.priceClass,
      materials: item.materials,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to upsert curtain in Supabase:', err);
    return false;
  }
}

export async function deleteCurtainFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('curtains').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete curtain from Supabase:', err);
    return false;
  }
}

/**
 * Universal Wallpapers Product Mutations
 */
export async function upsertWallpaperToSupabase(item: WallpaperItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('wallpapers').upsert({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      style: item.style,
      materials: item.materials,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to upsert wallpaper in Supabase:', err);
    return false;
  }
}

export async function deleteWallpaperFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('wallpapers').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete wallpaper from Supabase:', err);
    return false;
  }
}

/**
 * Universal Blinds Product Mutations
 */
export async function upsertBlindToSupabase(item: BlindItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('blinds').upsert({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      style: item.style,
      materials: item.materials,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to upsert blind in Supabase:', err);
    return false;
  }
}

export async function deleteBlindFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('blinds').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete blind from Supabase:', err);
    return false;
  }
}

/**
 * Universal Consultations & Bookings Mutations
 */
export async function insertBookingToSupabase(booking: BookingSubmission): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('bookings').insert({
      id: booking.id,
      name: booking.name,
      phone: booking.phone,
      email: booking.email || '',
      preferred_date: booking.preferredDate || '',
      project_type: booking.projectType,
      budget: booking.budget || '',
      location: booking.location || '',
      message: booking.message || '',
      timestamp: booking.timestamp || new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to insert booking into Supabase:', err);
    return false;
  }
}

export async function deleteBookingFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('bookings').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete booking from Supabase:', err);
    return false;
  }
}

/**
 * Universal Contact & Inquiries Mutations
 */
export async function insertInquiryToSupabase(inquiry: {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  message: string;
  timestamp: string;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('inquiries').insert({
      id: inquiry.id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      project_type: inquiry.projectType,
      location: inquiry.location,
      message: inquiry.message,
      timestamp: inquiry.timestamp
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to insert inquiry into Supabase:', err);
    return false;
  }
}

export async function deleteInquiryFromSupabase(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('inquiries').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete inquiry from Supabase:', err);
    return false;
  }
}

/**
 * One-Click Seed Catalog: Uploads current comprehensive catalog into Supabase
 */
export async function seedDefaultCatalogToSupabase(customConfig?: SiteConfig): Promise<{
  success: boolean;
  message: string;
  counts: { curtains: number; wallpapers: number; blinds: number };
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase client is not initialized. Please connect your credentials first.',
      counts: { curtains: 0, wallpapers: 0, blinds: 0 }
    };
  }

  try {
    // 1. Seed Site Config
    await client.from('site_config').upsert({
      id: 'current_config',
      config: customConfig || DEFAULT_SITE_CONFIG,
      updated_at: new Date().toISOString()
    });

    // 2. Seed Curtains
    const curtainsPayload = EXTENDED_CURTAINS_DATA.map((c, i) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      image: c.image,
      price_class: c.priceClass,
      materials: c.materials,
      created_at: new Date(Date.now() - i * 1000).toISOString()
    }));
    await client.from('curtains').upsert(curtainsPayload);

    // 3. Seed Wallpapers
    const wallpapersPayload = EXTENDED_WALLPAPERS_DATA.map((w, i) => ({
      id: w.id,
      name: w.name,
      description: w.description,
      image: w.image,
      style: w.style,
      materials: w.materials,
      created_at: new Date(Date.now() - i * 1000).toISOString()
    }));
    await client.from('wallpapers').upsert(wallpapersPayload);

    // 4. Seed Blinds
    const blindsPayload = EXTENDED_BLINDS_DATA.map((b, i) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      image: b.image,
      style: b.style,
      materials: b.materials,
      created_at: new Date(Date.now() - i * 1000).toISOString()
    }));
    await client.from('blinds').upsert(blindsPayload);

    return {
      success: true,
      message: `Universal seed completed! Seeded ${curtainsPayload.length} curtains, ${wallpapersPayload.length} wallpapers, and ${blindsPayload.length} blinds to Supabase.`,
      counts: {
        curtains: curtainsPayload.length,
        wallpapers: wallpapersPayload.length,
        blinds: blindsPayload.length
      }
    };
  } catch (err: any) {
    console.error('Failed to seed Supabase database:', err);
    return {
      success: false,
      message: `Seeding error: ${err?.message || 'Database transaction rejected. Ensure tables exist in Supabase.'}`,
      counts: { curtains: 0, wallpapers: 0, blinds: 0 }
    };
  }
}

/**
 * Universal Realtime Subscription Listener
 * Connects to Supabase Realtime WebSocket and notifies app whenever any record in any table is inserted/updated/deleted!
 */
export function subscribeToUniversalChanges(onUpdate: (table: string, payload: any) => void) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('universal-site-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_config' },
        payload => onUpdate('site_config', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'curtains' },
        payload => onUpdate('curtains', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wallpapers' },
        payload => onUpdate('wallpapers', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blinds' },
        payload => onUpdate('blinds', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        payload => onUpdate('bookings', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        payload => onUpdate('inquiries', payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('⚡ Universal Supabase Realtime synchronization active.');
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.error('Error setting up Supabase Realtime listener:', err);
    return null;
  }
}

/**
 * Ready-to-use PostgreSQL SQL Schema for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- ========================================================================
-- FLOATING DRAPES UNIVERSAL SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ========================================================================

-- 1. Site Configuration Table (Universal Theme, Hero, Fonts, Contact Info)
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Curtains Product Table
CREATE TABLE IF NOT EXISTS public.curtains (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  price_class TEXT DEFAULT 'Premium',
  materials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Wallpapers Product Table
CREATE TABLE IF NOT EXISTS public.wallpapers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  style TEXT DEFAULT 'Classic',
  materials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Blinds Product Table
CREATE TABLE IF NOT EXISTS public.blinds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  style TEXT DEFAULT 'Classic',
  materials JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bookings / Consultations Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  preferred_date TEXT,
  project_type TEXT NOT NULL,
  budget TEXT,
  location TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. General Inquiries & Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project_type TEXT,
  location TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ========================================================================

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curtains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blinds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public reads and full access for universal operation
DO $$ 
BEGIN
  -- site_config policies
  DROP POLICY IF EXISTS "Public Read site_config" ON public.site_config;
  CREATE POLICY "Public Read site_config" ON public.site_config FOR ALL USING (true) WITH CHECK (true);

  -- curtains policies
  DROP POLICY IF EXISTS "Public All curtains" ON public.curtains;
  CREATE POLICY "Public All curtains" ON public.curtains FOR ALL USING (true) WITH CHECK (true);

  -- wallpapers policies
  DROP POLICY IF EXISTS "Public All wallpapers" ON public.wallpapers;
  CREATE POLICY "Public All wallpapers" ON public.wallpapers FOR ALL USING (true) WITH CHECK (true);

  -- blinds policies
  DROP POLICY IF EXISTS "Public All blinds" ON public.blinds;
  CREATE POLICY "Public All blinds" ON public.blinds FOR ALL USING (true) WITH CHECK (true);

  -- bookings policies
  DROP POLICY IF EXISTS "Public All bookings" ON public.bookings;
  CREATE POLICY "Public All bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

  -- inquiries policies
  DROP POLICY IF EXISTS "Public All inquiries" ON public.inquiries;
  CREATE POLICY "Public All inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Enable Realtime replication for instant universal sync
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_config;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.curtains;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.wallpapers;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.blinds;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
`;
