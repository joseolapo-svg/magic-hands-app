// ─── Color tokens ───────────────────────────────────────────────────────────
export const C = {
  navy:     '#060e1e',
  navy800:  '#0c1a30',
  navy700:  '#112040',
  navy600:  '#172a52',
  gold:     '#C9A84C',
  goldL:    '#E2C47A',
  goldD:    '#9A7A32',
  blue:     '#1E6FD9',
  blueD:    '#1559B0',
  silver:   '#D8E2EE',
  silverD:  '#8899AA',
  white:    '#FFFFFF',
}

// ─── Commission per service ($) ──────────────────────────────────────────────
export const COMMISSION_BY_SERVICE: Record<string, number> = {
  // Magic Hands
  'Headlight Restoration': 65,
  'Bugs Off': 40,
  'Engine Cleaning': 98,
  'Rim Polish': 70,
  'Ozone Treatment': 90,
  'Shampoo': 60,
  'Pet Hair Removal': 55,
  'Magic Wash': 35,
  'Leather Conditioners': 80,
  'Mini Detailing': 110,
  'Steam Clean': 95,
  'Buffing': 130,
  'Full Detail': 135,
  'Hand Wax': 75,
  // Ceramic Pro
  'Paint Correction': 275,
  'Ceramic Coating': 320,
  'PPF Installation and Removal': 450,
  'Window Tint Installation and Removal': 180,
  'Leather Ceramic': 210,
  'Wheels Ceramic Coating': 160,
  // Yacht / Boat
  'Basic Exterior Detailing': 220,
  'Basic Exterior Detailing & Detailing of Hatches': 280,
  'Interior Detailing Only': 240,
  'Basic Exterior Detailing + Hatches + Cabin': 360,
  'Exterior Detailing + Hand Wax': 320,
  'Exterior Detailing + Hand Wax + Cabin Detailing': 420,
  'Deep Detailing': 480,
  'Buffing / Polish': 400,
}

// ─── Service catalogs by vehicle category ────────────────────────────────────
export const CAR_SERVICE_CATEGORIES: { label: string; services: string[] }[] = [
  {
    label: 'Magic Hands',
    services: [
      'Headlight Restoration', 'Bugs Off', 'Engine Cleaning', 'Rim Polish',
      'Ozone Treatment', 'Shampoo', 'Pet Hair Removal', 'Magic Wash',
      'Leather Conditioners', 'Mini Detailing', 'Steam Clean', 'Buffing',
      'Full Detail', 'Hand Wax',
    ],
  },
  {
    label: 'Ceramic Pro',
    services: [
      'Paint Correction', 'Ceramic Coating', 'PPF Installation and Removal',
      'Window Tint Installation and Removal', 'Leather Ceramic', 'Wheels Ceramic Coating',
    ],
  },
]

export const BOAT_SERVICE_CATEGORIES: { label: string; services: string[] }[] = [
  {
    label: 'Yacht / Boat Detailing',
    services: [
      'Basic Exterior Detailing',
      'Basic Exterior Detailing & Detailing of Hatches',
      'Interior Detailing Only',
      'Basic Exterior Detailing + Hatches + Cabin',
      'Exterior Detailing + Hand Wax',
      'Exterior Detailing + Hand Wax + Cabin Detailing',
      'Deep Detailing',
      'Buffing / Polish',
      'Ceramic Coating',
    ],
  },
]

// ─── Partner category labels ─────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<string, string> = {
  auto_workshop: 'Auto Workshop / Body Shop',
  marina: 'Marina / Boat Dealer',
  auto_parts: 'Auto Parts & Accessories',
  luxury_dealer: 'Luxury Vehicle Dealership',
  detailing_shop: 'Detailing Shop / Spa',
}

// ─── Vehicle reference data ──────────────────────────────────────────────────
export const CAR_MAKES: Record<string, string[]> = {
  'Acura': ['ILX', 'MDX', 'RDX', 'TLX', 'NSX'],
  'Aston Martin': ['DB11', 'DBS', 'DBX', 'Vantage', 'Valkyrie'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'RS6', 'RS7', 'R8', 'e-tron GT'],
  'Bentley': ['Bentayga', 'Continental GT', 'Flying Spur', 'Mulsanne'],
  'BMW': ['2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series', 'M2', 'M3', 'M4', 'M5', 'M8', 'X3', 'X5', 'X6', 'X7', 'i4', 'iX'],
  'Bugatti': ['Chiron', 'Veyron', 'Divo'],
  'Cadillac': ['CT4', 'CT5', 'Escalade', 'Lyriq'],
  'Chevrolet': ['Camaro', 'Corvette', 'Silverado', 'Suburban', 'Tahoe'],
  'Dodge': ['Challenger', 'Charger', 'Durango', 'Viper'],
  'Ferrari': ['296 GTB', '488', '812', 'F8', 'LaFerrari', 'Portofino', 'Roma', 'SF90'],
  'Ford': ['Bronco', 'F-150', 'GT', 'Mustang', 'Raptor'],
  'Genesis': ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Ridgeline'],
  'Jaguar': ['E-PACE', 'F-PACE', 'F-TYPE', 'I-PACE', 'XE', 'XF'],
  'Jeep': ['Gladiator', 'Grand Cherokee', 'Wrangler'],
  'Koenigsegg': ['Agera', 'Jesko', 'Regera'],
  'Lamborghini': ['Aventador', 'Huracán', 'Urus', 'Revuelto'],
  'Land Rover': ['Defender', 'Discovery', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar'],
  'Lexus': ['ES', 'GS', 'GX', 'IS', 'LC', 'LS', 'LX', 'RX', 'UX'],
  'Lincoln': ['Aviator', 'Continental', 'Corsair', 'Navigator'],
  'Maserati': ['GranTurismo', 'Ghibli', 'Levante', 'MC20', 'Quattroporte'],
  'McLaren': ['570S', '600LT', '720S', '750S', 'Artura', 'Senna', 'P1'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'G-Class', 'GLE', 'GLS', 'AMG GT', 'EQS', 'Maybach S-Class'],
  'Nissan': ['370Z', 'GT-R', 'Murano', 'Pathfinder', 'Titan'],
  'Pagani': ['Huayra', 'Zonda'],
  'Porsche': ['718', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  'Ram': ['1500', '2500', 'TRX'],
  'Rolls-Royce': ['Cullinan', 'Dawn', 'Ghost', 'Phantom', 'Spectre', 'Wraith'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
  'Toyota': ['4Runner', 'Camry', 'Corolla', 'Land Cruiser', 'Supra', 'Tundra'],
  'Volkswagen': ['Golf', 'GTI', 'Jetta', 'Passat', 'Tiguan'],
  'Volvo': ['S60', 'S90', 'V90', 'XC40', 'XC60', 'XC90'],
}

export const BOAT_TYPES = [
  'Small yachts (10–24 m)',
  'Large yachts (24–40 m)',
  'Superyachts (40–60 m)',
  'Megayachts (60 m+)',
]
