export interface CurtainItem {
  id: string;
  name: string;
  description: string;
  image: string;
  priceClass: 'Premium' | 'Signature' | 'Reserve';
  materials: string[];
}

export interface WallpaperItem {
  id: string;
  name: string;
  description: string;
  image: string;
  style: 'Classic' | 'Botanical' | 'Textured' | 'Modern';
  materials: string[];
}

export interface SignatureCollection {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  overlayColor: string; // Tailwind tint/overlay class
  themeColor: string; // hex or text color
}

export interface PortfolioItem {
  id: string;
  category: 'Living Room' | 'Bedroom' | 'Dining Room' | 'Kids Room';
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  review: string;
  rating: number;
  image: string;
}

export interface BookingSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  projectType: string;
  budget?: string;
  location?: string;
  message?: string;
  timestamp: string;
}

// PREMIUM CURATED DATASETS
export const CURTAINS_DATA: CurtainItem[] = [
  {
    id: 'c1',
    name: 'Royal Velvet Pleats',
    description: 'Double-pleated French velvet drapes offering supreme sound isolation and an unparalleled heavy drape aesthetic.',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
    priceClass: 'Reserve',
    materials: ['Belgian Velvet', 'Thermal Sateen Lining', 'Gold Heavyweight Grommets']
  },
  {
    id: 'c2',
    name: 'Belgian Pure Linen',
    description: 'Subtly textured, organic linen that filters harsh light into a serene, ambient glow. Ideal for minimalist architecture.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    priceClass: 'Signature',
    materials: ['Flax Linen', 'Organic Cotton Mesh', 'Invisible Soft Sinker']
  },
  {
    id: 'c3',
    name: 'Embossed Silk Brocade',
    description: 'Intricately hand-woven metallic jacquard detailing that reflects ambient light, creating a shimmering architectural border.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    priceClass: 'Reserve',
    materials: ['Mulberry Silk', 'Metallic Thread', 'Blackout Satin Lining']
  },
  {
    id: 'c4',
    name: 'Whisper-Sheer Organza',
    description: 'Ethereal, flowing panels that dance with the slightest breeze. Perfect for layering beneath heavy velvet drapes.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    priceClass: 'Premium',
    materials: ['Italian Organza', 'Ethereal Matte Voile']
  }
];

export const WALLPAPERS_DATA: WallpaperItem[] = [
  {
    id: 'w1',
    name: 'Imperial Damascus Brocade',
    description: 'Embossed fabric wallpaper featuring classical Victorian patterns with a tactile matte finish and golden undertones.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    style: 'Classic',
    materials: ['Tactile Embossed Vinyl', 'Satin-Weft Yarn']
  },
  {
    id: 'w2',
    name: 'Art Deco Gilded Geometrics',
    description: 'Bold architectural linework screen-printed with genuine brass leaf pigments for a high-contrast reflective feature wall.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    style: 'Modern',
    materials: ['Foil Gilded Base', 'Velvet-Flocked Inlay']
  },
  {
    id: 'w3',
    name: 'Biophilic Forest Oasis',
    description: 'Hand-painted watercolour mural depicting a misty, emerald forest canopy. Evokes natural serenity in private study halls.',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
    style: 'Botanical',
    materials: ['Breathable Non-Woven Paper', 'Eco-Parchment Inks']
  },
  {
    id: 'w4',
    name: 'Monolithic Slate Texture',
    description: 'Tactile stone-replica wallcoverings that introduce raw brutalist textures with a surprisingly warm and cozy ambient touch.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    style: 'Textured',
    materials: ['Micro-Cement Powder Layer', 'Acoustic Backing']
  }
];

export const SIGNATURE_COLLECTIONS: SignatureCollection[] = [
  {
    id: 's1',
    name: 'Luxe Drapes',
    category: 'Curtains',
    description: 'Exquisite deep velvet and brocade curtains with luxurious deep burgundy tones, designed for grand reception halls.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
    overlayColor: 'from-amber-950/40 via-red-950/70 to-black/95',
    themeColor: '#7f1d1d'
  },
  {
    id: 's2',
    name: "Nature's Canvas",
    category: 'Wallpapers',
    description: 'Bespoke biophilic wallcoverings and natural fiber window drapes dressed in rich forest green and moss tones.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1db207faf?auto=format&fit=crop&w=1200&q=80',
    overlayColor: 'from-stone-900/40 via-emerald-950/70 to-black/95',
    themeColor: '#064e3b'
  },
  {
    id: 's3',
    name: 'Modern Muse',
    category: 'Styling',
    description: 'Flawless warm grey textures, micro-linens, and brushed metal rod arrays designed to suit contemporary penthouse villas.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    overlayColor: 'from-zinc-900/40 via-stone-900/70 to-black/95',
    themeColor: '#292524'
  },
  {
    id: 's4',
    name: 'Royal Texture',
    category: 'Wallpapers',
    description: 'Stately dark navy and embossed indigo fabric wall structures reminiscent of luxury coastal estates.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    overlayColor: 'from-slate-900/40 via-blue-950/70 to-black/95',
    themeColor: '#172554'
  },
  {
    id: 's5',
    name: 'Minimal Chic',
    category: 'Curtains',
    description: 'Whisper-quiet cream tones, organic flax linen, and custom warm brass rails to instill structural zen.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    overlayColor: 'from-amber-900/20 via-orange-950/50 to-black/95',
    themeColor: '#451a03'
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'p1',
    category: 'Living Room',
    title: 'Modern Living Room',
    description: 'Fitted with gold-leaf Art Deco Wallpaper paired with double-pleated Silk Sheers to control intense midday light.',
    beforeImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'p2',
    category: 'Bedroom',
    title: 'Elegant Bedroom',
    description: 'Replaced thin curtains with premium floor-to-ceiling Acoustic Velvet Blockouts and custom-textured linen wall finishes.',
    beforeImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'p3',
    category: 'Dining Room',
    title: 'Luxury Dining Room',
    description: 'Bespoke biophilic wall murals and warm, earthy sateen-lined linen drapes creating an intimate dining experience.',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1617806118233-18e1db207faf?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'p4',
    category: 'Kids Room',
    title: 'Kids Room Makeover',
    description: 'Installed fully fire-retardant organic sheer linens and customized dreamy constellation wallcoverings.',
    beforeImage: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't1',
    name: 'Alessandra Moretti',
    location: 'Beverly Hills Villa',
    role: 'Principal Architect',
    review: 'Floating Drapes transformed our estate project completely. The velvet selection has a weight and fluid grace that ordinary drapes simply cannot match. Velora is our primary recommendation.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't2',
    name: 'Julian Sterling',
    location: 'Tribeca Penthouse',
    role: 'Art Director',
    review: 'The interactive slider in their catalog made choice effortless. We selected the Art Deco gilded papers. The installation team was surgical—aligned the complex geometric pattern down to the millimeter.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't3',
    name: 'Victoria Vance',
    location: 'Bel Air Residence',
    role: 'Villa Owner',
    review: 'Unbelievable customer care. The whisper-sheer organzas give our oceanfront living room a dreamlike light. It feels less like buying curtains and more like commissioning custom works of fine art.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  }
];
