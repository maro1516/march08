
import { City, Stall } from './types';

export const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=2000",
    title: "Sahara Gold",
    subtitle: "Endless dunes and starlit nights"
  },
  {
    url: "https://images.unsplash.com/photo-1597212618440-806262de496b?auto=format&fit=crop&q=80&w=2000",
    title: "Marrakech Red",
    subtitle: "The heart of Moroccan culture"
  },
  {
    url: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=2000",
    title: "The Blue Pearl",
    subtitle: "Chefchaouen's tranquil azure streets"
  },
  {
    url: "https://images.unsplash.com/photo-1627931326466-24e03f0b2405?auto=format&fit=crop&q=80&w=2000",
    title: "Atlantic Breeze",
    subtitle: "Essaouira's historic coastal ramparts"
  }
];

export const POPULAR_CITIES: City[] = [
  {
    "id": "mar-01",
    "name": "Marrakech",
    "category": "Imperial City",
    "description": "The Red City, famous for its vibrant souks, palaces, and the lively Jemaa el-Fnaa square.",
    "image": "https://images.unsplash.com/photo-1597212618440-806262de496b?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 31.6295, "lng": -7.9811},
    "budget": "$$",
    "unesco": true,
    "tags": ["Culture", "Nightlife", "Shopping"],
    "highlights": ["Jemaa el-Fnaa", "Bahia Palace", "Majorelle Garden"],
    "climate": {
      "spring": {"high": 27, "low": 13, "rain_days": 8},
      "summer": {"high": 37, "low": 20, "rain_days": 1},
      "autumn": {"high": 28, "low": 15, "rain_days": 5},
      "winter": {"high": 19, "low": 7, "rain_days": 7}
    },
    "places": [
      {
        "id": "p-mar-01",
        "name": "La Mamounia Tea",
        "description": "Experience the legendary luxury of La Mamounia with a traditional afternoon tea.",
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
        "price": 45,
        "category": "Restaurant"
      },
      {
        "id": "p-mar-02",
        "name": "Hot Air Balloon Flight",
        "description": "Sunrise flight over the Marrakech palm groves and Atlas Mountains.",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
        "price": 220,
        "category": "Activity"
      }
    ]
  },
  {
    "id": "fes-02",
    "name": "Fès",
    "category": "Imperial City",
    "description": "The cultural capital, home to the world's oldest university and a labyrinthine medieval medina.",
    "image": "https://images.unsplash.com/photo-1549221193-4a6c8e963c0a?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 34.0181, "lng": -5.0078},
    "budget": "$",
    "unesco": true,
    "tags": ["History", "Artisans", "Architecture"],
    "highlights": ["Al Quaraouiyine", "Chouara Tannery", "Fes el-Bali"],
    "climate": {
      "spring": {"high": 24, "low": 11, "rain_days": 9},
      "summer": {"high": 35, "low": 18, "rain_days": 1},
      "autumn": {"high": 26, "low": 14, "rain_days": 6},
      "winter": {"high": 16, "low": 6, "rain_days": 10}
    },
    "places": [
      {
        "id": "p-fes-01",
        "name": "Medina Food Tour",
        "description": "A guided culinary journey through the hidden gems of Fes el-Bali.",
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
        "price": 65,
        "category": "Activity"
      }
    ]
  },
  {
    "id": "chf-03",
    "name": "Chefchaouen",
    "category": "Mountain Town",
    "description": "The Blue Pearl, nestled in the Rif Mountains, known for its stunning blue-washed buildings.",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 35.1713, "lng": -5.2699},
    "budget": "$",
    "unesco": false,
    "tags": ["Photography", "Hiking", "Relaxation"],
    "highlights": ["Blue Medina", "Ras El Maa Waterfall", "Rif Mountains"],
    "climate": {
      "spring": {"high": 22, "low": 10, "rain_days": 10},
      "summer": {"high": 30, "low": 18, "rain_days": 1},
      "autumn": {"high": 24, "low": 13, "rain_days": 7},
      "winter": {"high": 15, "low": 6, "rain_days": 12}
    },
    "places": [
      {
        "id": "p-chf-01",
        "name": "Rif Mountain Hike",
        "description": "A guided trek to the Spanish Mosque for the best sunset views of the blue city.",
        "image": "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=600",
        "price": 30,
        "category": "Activity"
      }
    ]
  },
  {
    "id": "mer-04",
    "name": "Merzouga",
    "category": "Desert",
    "description": "The gateway to the Erg Chebbi dunes, offering an authentic Sahara desert experience.",
    "image": "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 31.0992, "lng": -3.9986},
    "budget": "$$$",
    "unesco": false,
    "tags": ["Adventure", "Stargazing", "Camping"],
    "highlights": ["Erg Chebbi Dunes", "Camel Trekking", "Berber Camps"],
    "climate": {
      "spring": {"high": 29, "low": 14, "rain_days": 2},
      "summer": {"high": 42, "low": 24, "rain_days": 0},
      "autumn": {"high": 31, "low": 16, "rain_days": 2},
      "winter": {"high": 18, "low": 4, "rain_days": 3}
    },
    "places": [
      {
        "id": "p-mer-01",
        "name": "Luxury Desert Camp",
        "description": "An overnight stay in a high-end Berber tent with traditional dinner and music.",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
        "price": 150,
        "category": "Hotel"
      }
    ]
  },
  {
    "id": "ess-05",
    "name": "Essaouira",
    "category": "Coastal City",
    "description": "A breezy port city with historic ramparts, famous for its art, music, and fresh seafood.",
    "image": "https://images.unsplash.com/photo-1627931326466-24e03f0b2405?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 31.5085, "lng": -9.7595},
    "budget": "$$",
    "unesco": true,
    "tags": ["Surf", "Art", "Seafood"],
    "highlights": ["Skala de la Ville", "Essaouira Beach", "Medina Port"],
    "climate": {
      "spring": {"high": 20, "low": 14, "rain_days": 4},
      "summer": {"high": 24, "low": 18, "rain_days": 0},
      "autumn": {"high": 23, "low": 16, "rain_days": 3},
      "winter": {"high": 18, "low": 12, "rain_days": 7}
    },
    "places": [
      {
        "id": "p-ess-01",
        "name": "Heure Bleue Palais",
        "description": "A Relais & Châteaux property offering a blend of African, European, and Arabic styles.",
        "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
        "price": 280,
        "category": "Hotel"
      },
      {
        "id": "p-ess-02",
        "name": "Kite Surfing Lesson",
        "description": "Professional coaching for all levels on the windy shores of Essaouira bay.",
        "image": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600",
        "price": 55,
        "category": "Activity"
      },
      {
        "id": "p-ess-03",
        "name": "Gnaoua Festival Experience",
        "description": "VIP access to the world-renowned Gnaoua World Music Festival (Seasonal).",
        "image": "https://images.unsplash.com/photo-1514525253361-bee8718a747c?auto=format&fit=crop&q=80&w=600",
        "price": 120,
        "category": "Activity"
      }
    ]
  },
  {
    "id": "rab-06",
    "name": "Rabat",
    "category": "Imperial City",
    "description": "The capital city of Morocco, blending modern culture with historic landmarks like the Hassan Tower.",
    "image": "https://images.unsplash.com/photo-1559586653-909240b90334?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 34.0209, "lng": -6.8416},
    "budget": "$$",
    "unesco": true,
    "tags": ["Politics", "History", "Gardens"],
    "highlights": ["Hassan Tower", "Oudaya Kasbah", "Chellah"],
    "climate": {
      "spring": {"high": 21, "low": 12, "rain_days": 8},
      "summer": {"high": 27, "low": 18, "rain_days": 0},
      "autumn": {"high": 24, "low": 15, "rain_days": 6},
      "winter": {"high": 17, "low": 8, "rain_days": 10}
    },
    "places": [
      {
        "id": "p-rab-01",
        "name": "La Tour Hassan Palace",
        "description": "A historic luxury hotel reflecting the grandeur of Moroccan architecture.",
        "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600",
        "price": 240,
        "category": "Hotel"
      },
      {
        "id": "p-rab-02",
        "name": "Bouregreg Kayaking",
        "description": "Paddle along the Bouregreg river with views of the Oudaya Kasbah and Hassan Tower.",
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600",
        "price": 25,
        "category": "Activity"
      },
      {
        "id": "p-rab-03",
        "name": "Dinarjat Restaurant",
        "description": "Fine dining in a 17th-century mansion in the heart of the Rabat Medina.",
        "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
        "price": 60,
        "category": "Restaurant"
      }
    ]
  },
  {
    "id": "cas-07",
    "name": "Casablanca",
    "category": "Coastal City",
    "description": "The economic hub of Morocco, home to the magnificent Hassan II Mosque and modern architecture.",
    "image": "https://images.unsplash.com/photo-1559910369-3924e235c1cf?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 33.5731, "lng": -7.5898},
    "budget": "$$",
    "unesco": false,
    "tags": ["Business", "Architecture", "Shopping"],
    "highlights": ["Hassan II Mosque", "La Corniche", "Habous Quarter"],
    "climate": {
      "spring": {"high": 21, "low": 13, "rain_days": 7},
      "summer": {"high": 26, "low": 20, "rain_days": 0},
      "autumn": {"high": 24, "low": 17, "rain_days": 5},
      "winter": {"high": 18, "low": 9, "rain_days": 9}
    },
    "places": [
      {
        "id": "p-cas-01",
        "name": "Four Seasons Hotel",
        "description": "Modern luxury on the oceanfront, adjacent to the Anfa Place Shopping Center.",
        "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600",
        "price": 350,
        "category": "Hotel"
      },
      {
        "id": "p-cas-02",
        "name": "Hassan II Mosque Tour",
        "description": "Guided architectural tour of one of the largest and most beautiful mosques in the world.",
        "image": "https://images.unsplash.com/photo-1559910369-3924e235c1cf?auto=format&fit=crop&q=80&w=600",
        "price": 12,
        "category": "Activity"
      },
      {
        "id": "p-cas-03",
        "name": "Rick's Café",
        "description": "A recreation of the bar made famous by Humphrey Bogart in the movie 'Casablanca'.",
        "image": "https://images.unsplash.com/photo-1550966841-3ee7adac1ad0?auto=format&fit=crop&q=80&w=600",
        "price": 75,
        "category": "Restaurant"
      }
    ]
  },
  {
    "id": "tan-08",
    "name": "Tangier",
    "category": "Coastal City",
    "description": "The gateway to Africa, a historic port city with a rich literary and international heritage.",
    "image": "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 35.7595, "lng": -5.8340},
    "budget": "$$",
    "unesco": false,
    "tags": ["Literature", "Port", "International"],
    "highlights": ["Hercules Caves", "Cape Spartel", "Grand Socco"],
    "climate": {
      "spring": {"high": 20, "low": 12, "rain_days": 9},
      "summer": {"high": 28, "low": 19, "rain_days": 1},
      "autumn": {"high": 23, "low": 16, "rain_days": 7},
      "winter": {"high": 16, "low": 9, "rain_days": 11}
    },
    "places": [
      {
        "id": "p-tan-01",
        "name": "El Minzah Hotel",
        "description": "A legendary hotel that has hosted celebrities and royalty since 1930.",
        "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600",
        "price": 180,
        "category": "Hotel"
      },
      {
        "id": "p-tan-02",
        "name": "Hercules Caves Trip",
        "description": "Explore the mythical caves where Hercules is said to have rested.",
        "image": "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=600",
        "price": 15,
        "category": "Activity"
      },
      {
        "id": "p-tan-03",
        "name": "Le Salon Bleu",
        "description": "A charming rooftop cafe overlooking the Strait of Gibraltar.",
        "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
        "price": 25,
        "category": "Restaurant"
      }
    ]
  },
  {
    "id": "aga-09",
    "name": "Agadir",
    "category": "Coastal City",
    "description": "A modern resort city known for its wide sandy beaches and year-round sunshine.",
    "image": "https://images.unsplash.com/photo-1570533317800-478630325439?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 30.4278, "lng": -9.5981},
    "budget": "$$",
    "unesco": false,
    "tags": ["Resort", "Beach", "Sun"],
    "highlights": ["Agadir Beach", "Souk El Had", "Kasbah Ruins"],
    "climate": {
      "spring": {"high": 23, "low": 13, "rain_days": 3},
      "summer": {"high": 27, "low": 18, "rain_days": 0},
      "autumn": {"high": 26, "low": 16, "rain_days": 3},
      "winter": {"high": 20, "low": 8, "rain_days": 5}
    },
    "places": [
      {
        "id": "p-aga-01",
        "name": "Sofitel Thalassa Sea & Spa",
        "description": "A serene sanctuary dedicated to well-being and luxury on Agadir's golden sands.",
        "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600",
        "price": 260,
        "category": "Hotel"
      },
      {
        "id": "p-aga-02",
        "name": "Taghazout Surf Day",
        "description": "World-class surfing experience in the nearby village of Taghazout.",
        "image": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600",
        "price": 45,
        "category": "Activity"
      },
      {
        "id": "p-aga-03",
        "name": "Crocoparc Visit",
        "description": "Discover over 300 Nile crocodiles in a lush botanical garden.",
        "image": "https://images.unsplash.com/photo-1549240923-93a2e080e653?auto=format&fit=crop&q=80&w=600",
        "price": 10,
        "category": "Activity"
      }
    ]
  },
  {
    "id": "ouar-10",
    "name": "Ouarzazate",
    "category": "Desert",
    "description": "The 'Hollywood of Morocco', a desert city famous for its film studios and historic kasbahs.",
    "image": "https://images.unsplash.com/photo-1548625361-07973070669d?auto=format&fit=crop&q=80&w=800",
    "coordinates": {"lat": 30.9335, "lng": -6.9370},
    "budget": "$$",
    "unesco": false,
    "tags": ["Cinema", "History", "Oasis"],
    "highlights": ["Atlas Studios", "Taourirt Kasbah", "Cinema Museum"],
    "climate": {
      "spring": {"high": 28, "low": 12, "rain_days": 2},
      "summer": {"high": 38, "low": 22, "rain_days": 1},
      "autumn": {"high": 29, "low": 15, "rain_days": 2},
      "winter": {"high": 17, "low": 5, "rain_days": 3}
    },
    "places": [
      {
        "id": "p-ouar-01",
        "name": "Berbere Palace",
        "description": "A favorite among film stars, this hotel offers a majestic setting and top-tier service.",
        "image": "https://images.unsplash.com/photo-1541971875076-8f97a344446d?auto=format&fit=crop&q=80&w=600",
        "price": 190,
        "category": "Hotel"
      },
      {
        "id": "p-ouar-02",
        "name": "Ait Ben Haddou Tour",
        "description": "Visit the UNESCO-listed ksar that has served as a backdrop for numerous Hollywood epics.",
        "image": "https://images.unsplash.com/photo-1548625361-07973070669d?auto=format&fit=crop&q=80&w=600",
        "price": 40,
        "category": "Activity"
      },
      {
        "id": "p-ouar-03",
        "name": "Fint Oasis Excursion",
        "description": "A hidden paradise of palm trees and traditional life just outside the city.",
        "image": "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=600",
        "price": 35,
        "category": "Activity"
      }
    ]
  }
];

export const STALLS: Stall[] = [
  {
    id: '1',
    name: 'Atlas Ceramics',
    owner: 'Hassan Belkhayat',
    description: 'Hand-painted Zellige and traditional pottery from the Safi region.',
    image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    products: [
      { id: 'p1', name: 'Zellige Plate', price: 45, category: 'Pottery', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400' },
      { id: 'p2', name: 'Tajine Pot', price: 60, category: 'Cookware', image: 'https://images.unsplash.com/photo-1589113331629-fd690858e390?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: '2',
    name: 'Berber Weavers',
    owner: 'Fatima Zohra',
    description: 'Authentic Beni Ourain rugs and hand-woven textiles using natural dyes.',
    image: 'https://images.unsplash.com/photo-1611082216254-41126ca108f9?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    products: [
      { id: 'p3', name: 'Beni Ourain Rug', price: 450, category: 'Home', image: 'https://images.unsplash.com/photo-1576016773942-3344d959bc91?auto=format&fit=crop&q=80&w=400' },
      { id: 'p4', name: 'Silk Cushion', price: 35, category: 'Decor', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=400' }
    ]
  }
];

export const CATEGORIES = [
  { name: 'Adventure', icon: '🏔️' },
  { name: 'Culture', icon: '🕌' },
  { name: 'Food', icon: '🥘' },
  { name: 'Relaxation', icon: '🌊' },
  { name: 'Photography', icon: '📸' }
];

export const ANALYTICS_DATA = [
  { name: 'Jan', revenue: 4000, bookings: 240 },
  { name: 'Feb', revenue: 3000, bookings: 198 },
  { name: 'Mar', revenue: 2000, bookings: 980 },
  { name: 'Apr', revenue: 2780, bookings: 390 },
  { name: 'May', revenue: 1890, bookings: 480 },
  { name: 'Jun', revenue: 2390, bookings: 380 },
];
