'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { getShopLocalV2 } from '@/services/public-shop-local-v2';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { GoogleMapComponent } from '@/components/Maps/GoogleMapComponent';
import { CommunityGallery } from '@/components/Gallery/CommunityGallery';
import { IMAGE_BASE_URL } from '@/services/config';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

const WP_UPLOADS_BASE = `${IMAGE_BASE_URL.replace(/\/$/, '')}/wp-content/uploads`;
// Real DMV Seasonal Events
const seasonalEvents = [
  {
    id: '1',
    title: 'Fairfax Fall Festival',
    date: '2024-10-14',
    time: 'All Day',
    location: 'Fairfax, Virginia',
    address: '3999 University Dr, Fairfax, VA 22030',
    type: 'seasonal',
    status: 'upcoming',
    description: 'Annual fall festival with local vendors and family activities',
    coordinates: { lat: 38.8462, lng: -77.3064 },
    season: 'October (Sat 10/14)',
    mapUrl: 'https://www.google.com/maps?q=Fairfax,Virginia&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/WmsevppVt97n9UiM6'
  },
  {
    id: '2',
    title: 'MONA Sip-N-Shop',
    date: '2024-11-16',
    time: 'Evening Event',
    location: 'Knights of Columbus, Maryland',
    address: 'Knights of Columbus Hall, Maryland',
    type: 'seasonal',
    status: 'upcoming',
    description: 'Exclusive shopping event with refreshments',
    coordinates: { lat: 38.9897, lng: -77.0261 },
    season: 'November (Thur 11/16)',
    mapUrl: 'https://www.google.com/maps?q=Knights+of+Columbus,Maryland&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/Viu8LBxqXtCbu6Qq6'
  },
  {
    id: '3',
    title: 'Falls Church Holiday Show',
    date: '2024-12-02',
    time: 'Weekend Event',
    location: 'Falls Church Community Center, Virginia',
    address: '3100 Clarendon Blvd S, Falls Church, VA 22042',
    type: 'seasonal',
    status: 'upcoming',
    description: 'Holiday shopping event with local artisans',
    coordinates: { lat: 38.8859, lng: -77.1716 },
    season: 'December (Sat-Sun 12/2-3)',
    mapUrl: 'https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/HgbQyHaantejcwaeA'
  }
];

// DMV Annual Events
const annualEvents = [
  {
    id: '4',
    title: 'City Of Falls Church Memorial Day Parade And Festival',
    date: '2024-05-29',
    time: 'All Day',
    location: 'Falls Church Community Center, Virginia',
    address: '3100 Clarendon Blvd S, Falls Church, VA 22042',
    type: 'annual',
    status: 'annual',
    description: 'Memorial Day celebration with parade and festival',
    coordinates: { lat: 38.8859, lng: -77.1716 },
    season: 'May (Mon 5/29)',
    mapUrl: 'https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/RFvwW4sbUd8WPVLn8'
  },
  {
    id: '5',
    title: 'Falls Church City Festival',
    date: '2024-09-23',
    time: 'All Day',
    location: 'Falls Church Community Center, Virginia',
    address: '3100 Clarendon Blvd S, Falls Church, VA 22042',
    type: 'annual',
    status: 'annual',
    description: 'Annual city festival with vendors and entertainment',
    coordinates: { lat: 38.8859, lng: -77.1716 },
    season: 'September (Sat 9/23)',
    mapUrl: 'https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/RFvwW4sbUd8WPVLn8'
  },
  {
    id: '6',
    title: 'Clarendon Day',
    date: '2024-09-30',
    time: 'All Day',
    location: 'Clarendon, Arlington, Virginia',
    address: '3100 Clarendon Blvd, Arlington, VA 22201',
    type: 'annual',
    status: 'annual',
    description: 'Community celebration in Clarendon',
    coordinates: { lat: 38.8859, lng: -77.0947 },
    season: 'September (Sat 9/30)',
    mapUrl: 'https://www.google.com/maps?q=Clarendon,Arlington,Virginia&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/i7ZSQXQGSZSkWFsV7'
  }
];

// DMV Weekly/Monthly Markets
const weeklyMonthlyMarkets = [
  {
    id: '7',
    title: 'EatLoco Farmers Market At MetPark',
    date: 'Every Saturday',
    time: '9:00 AM - 1:00 PM',
    location: 'Metropolitan Park, Maryland',
    address: 'Metropolitan Park, Maryland',
    type: 'weekly',
    status: 'active',
    description: 'Weekly farmers market with local vendors',
    coordinates: { lat: 38.9897, lng: -77.0261 },
    schedule: 'Saturdays @ EatLoco Farmers Market At MetPark (9am-1pm)',
    mapUrl: 'https://www.google.com/maps?q=Metropolitan+Park,Maryland&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/MLewnwQeL7PPP4yk6'
  },
  {
    id: '8',
    title: 'West End Farmers Market',
    date: 'Every Sunday',
    time: '8:30 AM - 1:00 PM',
    location: 'West End Village, Virginia',
    address: 'West End Farmers Market, Virginia',
    type: 'weekly',
    status: 'active',
    description: 'Sunday farmers market in West End',
    coordinates: { lat: 38.8904, lng: -77.0963 },
    schedule: 'Sundays @ West End Farmers Market (8:30am-1pm)',
    mapUrl: 'https://www.google.com/maps?q=West+End+Village,Virginia&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/RoErobep1eBPt549A'
  },
  {
    id: '9',
    title: 'Del Ray Artisans, Vintage & Flea Market',
    date: 'Second Saturday',
    time: '9:00 AM - 2:00 PM',
    location: 'Del Ray, Alexandria, Virginia',
    address: '1804 Mt Vernon Ave, Alexandria, VA 22301',
    type: 'monthly',
    status: 'active',
    description: 'Monthly artisan and vintage market',
    coordinates: { lat: 38.8048, lng: -77.0369 },
    schedule: '2nd Saturdays @ Del Ray Artisans, Vintage & Flea Market (9am-2pm)',
    mapUrl: 'https://www.google.com/maps?q=Del+Ray,Alexandria,Virginia&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/qmFX5jCRedeohE3T7'
  }
];

// Real DMV Stores
const dmvStores = [
  {
    id: '1',
    name: 'Food Star - Leesburg Pike',
    address: 'Leesburg Pike, Virginia',
    phone: 'Contact for hours',
    hours: 'Call for hours',
    type: 'grocery',
    coordinates: { lat: 38.8904, lng: -77.1963 },
    mapUrl: 'https://www.google.com/maps?q=Food+Star+Leesburg+Pike&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/NEy8tWKDqsVMNLQX7'
  },
  {
    id: '2',
    name: 'Weyone International',
    address: 'Virginia',
    phone: 'Contact for hours',
    hours: 'Call for hours',
    type: 'international',
    coordinates: { lat: 38.9059, lng: -77.0521 },
    mapUrl: 'https://www.google.com/maps?q=Weyone+International&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/HgA2eGasPoYByu4r8'
  },
  {
    id: '3',
    name: 'Rahama African Market',
    address: 'Virginia',
    phone: 'Contact for hours',
    hours: 'Call for hours',
    type: 'african_market',
    coordinates: { lat: 38.8704, lng: -77.0963 },
    mapUrl: 'https://www.google.com/maps?q=Rahama+African+Market&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/bo9dSkPzDfcN4CAk6'
  },
  {
    id: '4',
    name: 'African Grocery & Meat Market',
    address: 'Virginia',
    phone: 'Contact for hours',
    hours: 'Call for hours',
    type: 'african_market',
    coordinates: { lat: 38.8504, lng: -77.0863 },
    mapUrl: 'https://www.google.com/maps?q=African+Grocery+Meat+Market&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/kuGq7QFvp8GnHGndA'
  },
  {
    id: '5',
    name: 'Makola International Market',
    address: 'Virginia',
    phone: 'Contact for hours',
    hours: 'Call for hours',
    type: 'international',
    coordinates: { lat: 38.8404, lng: -77.0763 },
    mapUrl: 'https://www.google.com/maps?q=Makola+International+Market&output=embed',
    googleMapsLink: 'https://maps.app.goo.gl/KUW1Xr1PBusdcs4x7'
  }
];



// Combined map locations for Google Maps component
const mapLocations = [
  // Seasonal Events
  ...seasonalEvents.map(event => ({
    id: event.id,
    name: event.title,
    address: event.address,
    coordinates: event.coordinates,
    type: 'seasonal_event' as const,
    status: 'upcoming' as const,
    description: event.description,
    nextEvent: `${event.season} - ${event.time}`
  })),
  // Annual Events
  ...annualEvents.map(event => ({
    id: event.id,
    name: event.title,
    address: event.address,
    coordinates: event.coordinates,
    type: 'annual_event' as const,
    status: 'annual' as const,
    description: event.description,
    nextEvent: `${event.season} - ${event.time}`
  })),
  // Weekly/Monthly Markets
  ...weeklyMonthlyMarkets.map(market => ({
    id: market.id,
    name: market.title,
    address: market.address,
    coordinates: market.coordinates,
    type: 'regular_market' as const,
    status: 'active' as const,
    description: market.description,
    schedule: market.schedule
  })),
  // DMV Stores
  ...dmvStores.map(store => ({
    id: store.id,
    name: store.name,
    address: store.address,
    coordinates: store.coordinates,
    type: 'dmv_store' as const,
    status: 'active' as const,
    phone: store.phone,
    hours: store.hours
  })),
  // Main PrintOscar Location
  {
    id: 'printoscar-main',
    name: 'PrintOscar Headquarters',
    address: '1234 Main St, Washington, DC 20001',
    coordinates: { lat: 38.9072, lng: -77.0369 },
    type: 'printoscar_location' as const,
    status: 'active' as const,
    phone: '(202) 555-OSCAR',
    hours: '9:00 AM - 6:00 PM',
    description: 'Main PrintOscar location and distribution center'
  }
];

// Real gallery images from PrintOscar community events and markets
const galleryImages = [
  {
    id: '1',
    src: 'http://localhost:5001/wp-content/uploads/2022/04/20210607_234134-scaled.jpg',
    alt: 'Evening Market Setup',
    title: 'Market Preparation',
    description: 'Getting ready for another amazing market day',
    location: 'Falls Church, VA',
    date: '2021-06-07',
    category: 'market' as const,
    likes: 28
  },
  {
    id: '2',
    src: `${WP_UPLOADS_BASE}/2022/01/20220112_071509v2-scaled-e1641992057434.jpg`,
    alt: 'Early Morning Market',
    title: 'Fresh Start',
    description: 'Early morning setup at the farmers market',
    location: 'Dupont Circle, DC',
    date: '2022-01-12',
    category: 'market' as const,
    likes: 35
  },
  {
    id: '3',
    src: `${WP_UPLOADS_BASE}/2022/01/20211107_103617-scaled.jpg`,
    alt: 'Community Engagement',
    title: 'Community Connection',
    description: 'Engaging with our wonderful customers',
    location: 'Eastern Market, DC',
    date: '2021-11-07',
    category: 'community' as const,
    likes: 42
  },
  {
    id: '4',
    src: `${WP_UPLOADS_BASE}/2021/10/20211006_233401-1-scaled.jpg`,
    alt: 'Evening Event',
    title: 'Evening Gathering',
    description: 'Special evening event with our community',
    location: 'Arlington, VA',
    date: '2021-10-06',
    category: 'event' as const,
    likes: 31
  },
  {
    id: '5',
    src: `${WP_UPLOADS_BASE}/2021/10/20210829_082915-scaled-e1634474913413.jpg`,
    alt: 'Morning Market Activity',
    title: 'Busy Market Day',
    description: 'Bustling morning at the farmers market',
    location: 'Bethesda, MD',
    date: '2021-08-29',
    category: 'market' as const,
    likes: 26
  },
  {
    id: '6',
    src: `${WP_UPLOADS_BASE}/2023/01/20220731_085533-scaled.jpg`,
    alt: 'Summer Market',
    title: 'Summer Vibes',
    description: 'Beautiful summer morning at the market',
    location: 'Reston, VA',
    date: '2022-07-31',
    category: 'market' as const,
    likes: 38
  },
  {
    id: '7',
    src: `${WP_UPLOADS_BASE}/2023/01/20220917_163031-scaled-e1674435690319.jpg`,
    alt: 'Afternoon Market',
    title: 'Afternoon Delight',
    description: 'Wonderful afternoon connecting with customers',
    location: 'Alexandria, VA',
    date: '2022-09-17',
    category: 'community' as const,
    likes: 33
  },
  {
    id: '8',
    src: `${WP_UPLOADS_BASE}/2023/01/20221029_102134-scaled.jpg`,
    alt: 'Fall Market',
    title: 'Autumn Market',
    description: 'Beautiful fall day at the farmers market',
    location: 'Silver Spring, MD',
    date: '2022-10-29',
    category: 'market' as const,
    likes: 29
  },
  {
    id: '9',
    src: `${WP_UPLOADS_BASE}/2021/10/20211009_083131-scaled-e1634473705340.jpg`,
    alt: 'Product Display',
    title: 'Product Showcase',
    description: 'Displaying our amazing organic products',
    location: 'Georgetown, DC',
    date: '2021-10-09',
    category: 'products' as const,
    likes: 24
  },
  {
    id: '10',
    src: `${WP_UPLOADS_BASE}/2021/10/20210905_080413-scaled-e1634474989650.jpg`,
    alt: 'Early Market Setup',
    title: 'Early Bird',
    description: 'Setting up bright and early for our customers',
    location: 'Fairfax, VA',
    date: '2021-09-05',
    category: 'market' as const,
    likes: 22
  },
  {
    id: '11',
    src: `${WP_UPLOADS_BASE}/2021/10/20211010_084739-scaled.jpg`,
    alt: 'Team at Work',
    title: 'Team Spirit',
    description: 'Our dedicated team working together',
    location: 'Falls Church, VA',
    date: '2021-10-10',
    category: 'team' as const,
    likes: 27
  },
  {
    id: '12',
    src: `${WP_UPLOADS_BASE}/2021/10/20210912_084929-scaled.jpg`,
    alt: 'Market Morning',
    title: 'Sunday Market',
    description: 'Perfect Sunday morning at the market',
    location: 'Takoma Park, MD',
    date: '2021-09-12',
    category: 'market' as const,
    likes: 30
  },
  {
    id: '13',
    src: `${WP_UPLOADS_BASE}/2021/01/IMG-20201114-WA0007.jpg`,
    alt: 'Community Event',
    title: 'Community Gathering',
    description: 'Special community event and celebration',
    location: 'Washington, DC',
    date: '2020-11-14',
    category: 'event' as const,
    likes: 45
  },
  {
    id: '14',
    src: `${WP_UPLOADS_BASE}/2021/01/20201205_085856-scaled.jpg`,
    alt: 'Winter Market',
    title: 'Winter Warmth',
    description: 'Bringing warmth to the winter market',
    location: 'Rockville, MD',
    date: '2020-12-05',
    category: 'market' as const,
    likes: 34
  }
];

export default function ShopLocalPage() {
  const [currentSeasonalSlide, setCurrentSeasonalSlide] = useState(0);
  const [currentAnnualSlide, setCurrentAnnualSlide] = useState(0);
  const [currentMarketSlide, setCurrentMarketSlide] = useState(0);
  const [eventFilter, setEventFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Combine all events and stores for filtering
  const allEvents = [...seasonalEvents, ...annualEvents, ...weeklyMonthlyMarkets, ...dmvStores];

  const filteredEvents = allEvents.filter(event => {
    const matchesFilter = eventFilter === 'all' || event.type === eventFilter;
    const eventTitle = (event as any).title || (event as any).name || '';
    const eventLocation = (event as any).location || event.address || '';
    const matchesSearch = eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eventLocation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const nextSeasonalSlide = () => {
    setCurrentSeasonalSlide((prev) => (prev + 1) % seasonalEvents.length);
  };

  const prevSeasonalSlide = () => {
    setCurrentSeasonalSlide((prev) => (prev - 1 + seasonalEvents.length) % seasonalEvents.length);
  };

  const nextAnnualSlide = () => {
    setCurrentAnnualSlide((prev) => (prev + 1) % annualEvents.length);
  };

  const prevAnnualSlide = () => {
    setCurrentAnnualSlide((prev) => (prev - 1 + annualEvents.length) % annualEvents.length);
  };

  const nextMarketSlide = () => {
    setCurrentMarketSlide((prev) => (prev + 1) % weeklyMonthlyMarkets.length);
  };

  const prevMarketSlide = () => {
    setCurrentMarketSlide((prev) => (prev - 1 + weeklyMonthlyMarkets.length) % weeklyMonthlyMarkets.length);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'weekly':
        return 'bg-green-100 text-green-800';
      case 'monthly':
        return 'bg-blue-100 text-blue-800';
      case 'annual':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getShopLocalV2();
        if (data?.settings) {
          const seasonal = Array.isArray(data.seasonal) ? data.seasonal : [];
          const annual = Array.isArray(data.annual) ? data.annual : [];
          const weekly = Array.isArray(data.weekly) ? data.weekly : [];
          const stores = Array.isArray(data.stores) ? data.stores : [];
          const gallery = Array.isArray(data.gallery) ? data.gallery : [];

          seasonalEvents.splice(0, seasonalEvents.length, ...seasonal.map((e: any, i: number) => ({ id: `s${e.id || i}`, title: e.Title || e.title, date: e.Season || e.schedule || '', time: e.Time || e.time || '', location: '', address: e.Address || e.address || '', type: 'seasonal', status: 'upcoming', description: '', coordinates: { lat: 38.9072, lng: -77.0369 }, season: e.Schedule || e.schedule || '', mapUrl: e.MapEmbedUrl || e.mapEmbedUrl || '', googleMapsLink: e.GoogleMapsLink || e.googleMapsLink || '' })));
          annualEvents.splice(0, annualEvents.length, ...annual.map((e: any, i: number) => ({ id: `a${e.id || i}`, title: e.Title || e.title, date: '', time: e.Time || e.time || '', location: '', address: e.Address || e.address || '', type: 'annual', status: 'annual', description: '', coordinates: { lat: 38.9072, lng: -77.0369 }, season: e.Schedule || e.schedule || '', mapUrl: e.MapEmbedUrl || e.mapEmbedUrl || '', googleMapsLink: e.GoogleMapsLink || e.googleMapsLink || '' })));
          weeklyMonthlyMarkets.splice(0, weeklyMonthlyMarkets.length, ...weekly.map((e: any, i: number) => ({ id: `w${e.id || i}`, title: e.Title || e.title, date: '', time: e.Time || e.time || '', location: '', address: e.Address || e.address || '', type: e.Type || e.type || 'weekly', status: 'active', description: '', coordinates: { lat: 38.9072, lng: -77.0369 }, schedule: e.Schedule || e.schedule || '', mapUrl: e.MapEmbedUrl || e.mapEmbedUrl || '', googleMapsLink: e.GoogleMapsLink || e.googleMapsLink || '' })));
          dmvStores.splice(0, dmvStores.length, ...stores.map((e: any, i: number) => ({ id: `st${e.id || i}`, name: e.Title || e.title, address: e.Address || e.address || '', phone: 'Contact for hours', hours: 'Call for hours', type: 'store', coordinates: { lat: 38.9072, lng: -77.0369 }, mapUrl: e.MapEmbedUrl || e.mapEmbedUrl || '', googleMapsLink: e.GoogleMapsLink || e.googleMapsLink || '' })));
          if (gallery.length > 0) {
            galleryImages.splice(0, galleryImages.length, ...gallery.map((m: any, i: number) => ({ id: `${m.Id || i}`, src: m.ImageUrl || m.imageUrl, alt: m.Caption || m.caption || '', title: '', description: '', location: '', date: '', category: (m.Category || m.category || 'market') as const, likes: 0 })));
          }
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Shop Local
                <span className="block text-2xl md:text-3xl font-normal text-orange-100">DMV Area</span>
              </h1>
              <p className="text-xl text-orange-100 mb-6 max-w-2xl">
                Find us in Fairfax, Falls Church, Arlington, and Alexandria Virginia markets and events on the weekends!
              </p>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-orange-200" />
                <span className="text-orange-100">Washington DC • Maryland • Virginia</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search events or locations..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button
                  onClick={() => setEventFilter('all')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    eventFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setEventFilter('seasonal')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    eventFilter === 'seasonal' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Seasonal
                </button>
                <button
                  onClick={() => setEventFilter('weekly')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    eventFilter === 'weekly' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Weekly Markets
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us Nearby</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our locations, upcoming events, and partner stores across the DMV area.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg h-[600px]">
              <GoogleMapComponent locations={mapLocations} />
            </div>
          </div>
        </section>

        {/* Seasonal Events Slider */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Seasonal Events</h2>
              <div className="flex gap-2">
                <button onClick={prevSeasonalSlide} className="p-2 rounded-full bg-white shadow hover:bg-gray-50">
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <button onClick={nextSeasonalSlide} className="p-2 rounded-full bg-white shadow hover:bg-gray-50">
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map((offset) => {
                const index = (currentSeasonalSlide + offset) % seasonalEvents.length;
                const event = seasonalEvents[index];
                return (
                  <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          Upcoming
                        </span>
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {event.season}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                      <a 
                        href={event.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 block w-full text-center py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Weekly Markets Grid */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Weekly Markets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {weeklyMonthlyMarkets.map((market) => (
                <div key={market.id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{market.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(market.type)}`}>
                        {market.type === 'weekly' ? 'Weekly' : 'Monthly'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{market.schedule}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{market.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Gallery */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Gallery</h2>
              <p className="text-lg text-gray-600">Moments from our local events and markets</p>
            </div>
            <CommunityGallery images={galleryImages} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Want us at your local event?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              We love connecting with our community! Contact us to discuss having PrintOscar at your next festival or market.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-orange-600 bg-white hover:bg-orange-50 md:text-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
