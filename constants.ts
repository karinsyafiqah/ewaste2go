import { CollectionPoint, MarketplaceAd, Pickup, Reward, User } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Wong',
  email: 'alex.wong@example.com',
  phone: '+60 12-345 6789',
  stats: {
    totalPickups: 12,
    rewardPoints: 350,
    itemsRecycled: 45
  },
  savedLocations: [
    {
      id: 'loc1',
      name: 'Home',
      address: 'Lot 123, Taman Kingfisher, 88450 Kota Kinabalu',
      coordinates: { lat: 5.98, lng: 116.09 }
    },
    {
      id: 'loc2',
      name: 'Office',
      address: 'Level 5, Suria Sabah, 88000 Kota Kinabalu',
      coordinates: { lat: 5.99, lng: 116.07 }
    }
  ],
  claimedRewards: [],
  paymentMethods: [
    {
      id: 'pm1',
      type: 'ewallet',
      provider: "Touch 'n Go eWallet",
      accountNumber: "+60 12-345 6789",
      accountHolder: "Alex Wong"
    }
  ]
};

// Updated with accurate locations based on request
export const MOCK_COLLECTION_POINTS: CollectionPoint[] = [
  {
    id: 'cp1',
    name: 'Dewan Bandaraya Kota Kinabalu (DBKK)',
    type: 'government',
    description: 'Official city council collection center for household e-waste.',
    address: 'No. 1, Jalan Bandaran, 88675 Kota Kinabalu, Sabah',
    phone: '+60 88-521 800',
    email: 'aduan@dbkk.sabah.gov.my',
    operatingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    acceptedItems: ['All E-Waste', 'Large Appliances'],
    isDBKK: true,
    coordinates: { lat: 5.978519, lng: 116.073479 } // Accurate DBKK Coordinates
  },
  {
    id: 'cp2',
    name: 'Legenda Bumimas Sdn Bhd',
    type: 'partner',
    description: 'Licensed scheduled waste transporter and contractor specialized in industrial waste management.',
    address: 'Lot 5, Jalan 3 KKIP Selatan, Kota Kinabalu Industrial Park, 88460 KK',
    phone: '+60 88-498 111',
    email: 'info@legendabumimas.com',
    operatingHours: 'Mon-Sat: 8:00 AM - 5:00 PM',
    acceptedItems: ['Industrial E-waste', 'Heavy Machinery Parts', 'Batteries'],
    coordinates: { lat: 6.0821, lng: 116.1345 } // KKIP Area
  },
  {
    id: 'cp3',
    name: 'NCT Forwarding & Shipping Sdn Bhd',
    type: 'partner',
    description: 'Logistics partner specializing in secure e-waste transportation and shipping services.',
    address: 'Wisma NCT, Jalan Lintas, Kolombong, 88450 Kota Kinabalu',
    phone: '+60 88-383 999',
    email: 'ops@nctshipping.com',
    operatingHours: 'Mon-Fri: 8:30 AM - 5:30 PM',
    acceptedItems: ['Bulk Electronics', 'Servers', 'Logistics Equipment'],
    coordinates: { lat: 5.9715, lng: 116.1172 } // Kolombong Area
  },
  {
    id: 'cp4',
    name: 'Redsoft Solution Sdn Bhd',
    type: 'partner',
    description: 'IT solutions provider offering buy-back and recycling for used computer hardware.',
    address: 'Lot 12, 1st Floor, Block B, Lintas Square, 88300 Kota Kinabalu',
    phone: '+60 88-262 777',
    email: 'support@redsoft.com.my',
    operatingHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    acceptedItems: ['Laptops', 'Desktops', 'Monitors', 'Peripherals'],
    coordinates: { lat: 5.9523, lng: 116.0918 } // Lintas Area
  },
  {
    id: 'cp5',
    name: 'Kualiti Alam Sdn Bhd',
    type: 'partner',
    description: 'Comprehensive hazardous waste management and recycling services for scheduled waste.',
    address: 'Branch Office, Alamesra Plaza Utama, 88400 Kota Kinabalu',
    phone: '+60 88-448 888',
    email: 'sabah@kualitialam.com',
    operatingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    acceptedItems: ['Toxic E-waste', 'Industrial Batteries', 'Fluorescent Lamps'],
    coordinates: { lat: 6.0345, lng: 116.1389 } // Alamesra Area
  },
  {
    id: 'cp6',
    name: 'E Concern (Borneo) Sdn Bhd',
    type: 'partner',
    description: 'Dedicated e-waste recycling facility focusing on environmental sustainability and recovery.',
    address: 'Lot 8, Lok Kawi Industrial Estate, 88200 Putatan',
    phone: '+60 88-765 432',
    email: 'enquiry@econcern.com.my',
    operatingHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    acceptedItems: ['Household Electronics', 'PCBs', 'Consumer Appliances'],
    coordinates: { lat: 5.8812, lng: 116.0543 } // Lok Kawi Area
  }
];

export const MOCK_ADS: MarketplaceAd[] = [
  {
    id: 'ad1',
    title: 'Searching for Old Motherboards',
    description: 'We are looking for bulk defective motherboards for metal extraction. High payout for bulk quantities.',
    priceRange: 'RM 15 - RM 45 per kg',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    companyName: 'Legenda Bumimas',
    contact: {
      phone: '+60 88-498 111',
      email: 'buying@legendabumimas.com',
      address: 'Lot 5, KKIP Selatan'
    },
    postedDate: '2025-01-15'
  },
  {
    id: 'ad2',
    title: 'Buying Broken LCD/LED Monitors',
    description: 'We purchase cracked or non-functional monitors for parts harvesting.',
    priceRange: 'RM 10 - RM 30 per unit',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    companyName: 'Redsoft Solution',
    contact: {
      phone: '+60 88-262 777',
      email: 'parts@redsoft.com.my',
      address: 'Lintas Square'
    },
    postedDate: '2025-02-01'
  },
  {
    id: 'ad3',
    title: 'Copper Cable Scrap Needed',
    description: 'Clean or insulated copper wire wanted. Competitive market rates.',
    priceRange: 'Market Rate (Daily Update)',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    companyName: 'E Concern (Borneo)',
    contact: {
      phone: '+60 88-765 432',
      email: 'scrap@econcern.com.my',
      address: 'Lok Kawi Industrial Estate'
    },
    postedDate: '2025-02-10'
  },
  {
    id: 'ad4',
    title: 'Vintage Computer Parts',
    description: 'Collectors looking for vintage CPUs (486, Pentium) and mechanical keyboards.',
    priceRange: 'RM 50 - RM 500 depending on rarity',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    companyName: 'Redsoft Solution',
    contact: {
      phone: '+60 88-262 777',
      email: 'retro@redsoft.com.my',
      address: 'Lintas Square, KK'
    },
    postedDate: '2025-02-12'
  }
];

export const MOCK_REWARDS: Reward[] = [
  { id: 'r1', name: 'RM 10 Grocery Voucher', category: 'Voucher', cost: 100, stock: 50, imageUrl: 'https://picsum.photos/200/200?random=5' },
  { id: 'r2', name: 'Bamboo Cutlery Set', category: 'Merchandise', cost: 150, stock: 25, imageUrl: 'https://picsum.photos/200/200?random=6' },
  { id: 'r3', name: 'RM 20 E-Wallet Reload', category: 'Cash', cost: 200, stock: 100, imageUrl: 'https://picsum.photos/200/200?random=7' },
  { id: 'r4', name: 'Plant a Tree in Sabah', category: 'Environmental', cost: 50, stock: 999, imageUrl: 'https://picsum.photos/200/200?random=8' },
  { id: 'r5', name: 'Recycled Tote Bag', category: 'Merchandise', cost: 80, stock: 40, imageUrl: 'https://picsum.photos/200/200?random=9' },
  { id: 'r6', name: 'Eco-Friendly Notebook', category: 'Merchandise', cost: 60, stock: 60, imageUrl: 'https://picsum.photos/200/200?random=10' },
];

export const MOCK_PICKUPS: Pickup[] = [
  {
    id: 'pk_active_123',
    date: '2025-02-20',
    time: '14:30',
    items: ['Washing Machine', 'Old Laptop'],
    status: 'in-transit',
    driverName: 'Mohd Rizal',
    driverVehicle: 'Toyota Hilux (SAB 1234 A)',
    trackingId: 'TRK-8821',
    currentLocation: { lat: 5.975, lng: 116.09 },
    location: {
      id: 'loc1',
      name: 'Home',
      address: 'Lot 123, Taman Kingfisher',
      coordinates: { lat: 5.98, lng: 116.09 }
    }
  },
  {
    id: 'pk_past_1',
    date: '2025-01-15',
    time: '10:00',
    items: ['CRT Monitor', 'Keyboard'],
    status: 'completed',
    driverName: 'James Tan',
    location: {
      id: 'loc1',
      name: 'Home',
      address: 'Lot 123, Taman Kingfisher',
      coordinates: { lat: 5.98, lng: 116.09 }
    }
  },
  {
    id: 'pk_past_2',
    date: '2024-12-20',
    time: '09:15',
    items: ['Microwave'],
    status: 'completed',
    driverName: 'James Tan',
    location: {
      id: 'loc2',
      name: 'Office',
      address: 'Level 5, Suria Sabah',
      coordinates: { lat: 5.99, lng: 116.07 }
    }
  }
];

export const GUIDE_DATA = [
  {
    title: 'Reduce',
    desc: 'Minimize e-waste by maintaining your devices, buying only what you need, and choosing durable products.',
    icon: 'Minimize2',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Reuse',
    desc: 'Extend the life of electronics. Repair broken devices, donate working items to charity, or sell them in our marketplace.',
    icon: 'RefreshCw',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Recycle',
    desc: 'The last resort. Send broken, unrepairable electronics to certified recyclers (like us!) to recover valuable materials.',
    icon: 'Recycle',
    color: 'bg-orange-100 text-orange-600'
  }
];

export const TRANSLATIONS: any = {
  en: {
    home: "Home",
    points: "Points",
    market: "Market",
    rewards: "Rewards",
    profile: "Profile",
    schedulePickup: "Schedule Pickup",
    collectionPoints: "Collection Points",
    sellEwaste: "Sell E-Waste",
    guide: "3R Guide",
    hi: "Hi",
    readyToRecycle: "Ready to recycle today?",
    recentPickups: "Recent Pickups",
    call: "Call",
    email: "Email",
    directions: "Directions",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    notifications: "Notifications",
    darkMode: "Dark Mode",
    language: "Language",
    privacy: "Privacy & Security",
    appSettings: "App Settings",
    signOut: "Sign Out",
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    signIn: "Sign In",
    signUp: "Sign Up",
    myRewards: "My Rewards",
    catalog: "Catalog",
    availablePoints: "Available Points",
    redeem: "Redeem",
    needPoints: "Need Points",
    useNow: "Use Now",
    claimedOn: "Claimed on",
    myLocations: "My Locations",
    addNewLocation: "Add New Location",
    loadingMap: "Loading map...",
    savedLocations: "Saved Locations",
    pickupHistory: "Pickup History",
    partnershipProgram: "Partnership Program",
    helpSupport: "Help & Support",
    partnerHeroTitle: "Partner with ewaste2go",
    partnerHeroDesc: "Join Sabah's leading e-waste management network. Connect with users, boost your sustainability impact, and grow your business.",
    partnershipBenefits: "Partnership Benefits",
    visibility: "Visibility",
    visibilityDesc: "Featured listing in our Collection Points directory",
    marketingSupport: "Marketing Support",
    marketingDesc: "Co-branded promotional materials and social media exposure",
    userBaseAccess: "User Base Access",
    userBaseDesc: "Connect with eco-conscious users in Sabah",
    dataInsights: "Data Insights",
    dataDesc: "Monthly reports on e-waste collection volumes",
    applyPartnership: "Apply for Partnership",
    companyName: "Company Name",
    contactPerson: "Contact Person",
    message: "Message",
    tellUsInterest: "Tell us about your interest...",
    submitApplication: "Submit Application",
    questions: "Questions?",
    helpCenter: "Help Center",
    contactUs: "Contact Us",
    callUs: "Call Us",
    emailSupport: "Email Support",
    whatsapp: "WhatsApp",
    faq: "Frequently Asked Questions",
    supportHours: "Support Hours",
    totalPickups: "Total Pickups",
    itemsRecycled: "Items Recycled",
    rewardPoints: "Reward Points",
    name: "Name",
    phone: "Phone Number",
    cashOut: "Cash Out",
    paymentMethods: "Payment Methods",
    convertPoints: "Convert Points to Cash",
    amountToWithdraw: "Points to Convert",
    selectPaymentMethod: "Select Payment Method",
    conversionRate: "Rate: 100 Points = RM 10.00",
    insufficientPoints: "Insufficient Points",
    withdrawSuccess: "Cash Out Successful!",
    addPaymentMethod: "Add Payment Method",
    provider: "Provider (Bank/E-Wallet)",
    accountNumber: "Account Number",
    accountHolder: "Account Holder Name",
    saveMethod: "Save Payment Method",
    cashReceived: "Cash Received",
    noPaymentMethods: "No payment methods added.",
    bankTransfer: "Bank Transfer",
    ewallet: "E-Wallet",
    bankName: "Bank Name",
    ewalletProvider: "E-Wallet Provider"
  },
  ms: {
    home: "Utama",
    points: "Lokasi",
    market: "Pasaran",
    rewards: "Ganjaran",
    profile: "Profil",
    schedulePickup: "Jadualkan Pengambilan",
    collectionPoints: "Pusat Pengumpulan",
    sellEwaste: "Jual E-Sisa",
    guide: "Panduan 3R",
    hi: "Hai",
    readyToRecycle: "Sedia untuk kitar semula?",
    recentPickups: "Pengambilan Terkini",
    call: "Telefon",
    email: "E-mel",
    directions: "Arah",
    editProfile: "Edit Profil",
    saveChanges: "Simpan Perubahan",
    notifications: "Notifikasi",
    darkMode: "Mod Gelap",
    language: "Bahasa",
    privacy: "Privasi & Keselamatan",
    appSettings: "Tetapan Aplikasi",
    signOut: "Log Keluar",
    welcomeBack: "Selamat Kembali",
    createAccount: "Cipta Akaun",
    signIn: "Log Masuk",
    signUp: "Daftar",
    myRewards: "Ganjaran Saya",
    catalog: "Katalog",
    availablePoints: "Mata Terkumpul",
    redeem: "Tebus",
    needPoints: "Mata Tak Cukup",
    useNow: "Guna",
    claimedOn: "Ditebus pada",
    myLocations: "Lokasi Saya",
    addNewLocation: "Tambah Lokasi Baru",
    loadingMap: "Memuatkan peta...",
    savedLocations: "Lokasi Disimpan",
    pickupHistory: "Sejarah Pengambilan",
    partnershipProgram: "Program Rakan Kongsi",
    helpSupport: "Bantuan & Sokongan",
    partnerHeroTitle: "Rakan Kongsi ewaste2go",
    partnerHeroDesc: "Sertai rangkaian pengurusan e-sisa terkemuka Sabah. Berhubung dengan pengguna, tingkatkan impak kelestarian, dan kembangkan perniagaan anda.",
    partnershipBenefits: "Faedah Rakan Kongsi",
    visibility: "Keterlihatan",
    visibilityDesc: "Penyenaraian utama dalam direktori Pusat Pengumpulan kami",
    marketingSupport: "Sokongan Pemasaran",
    marketingDesc: "Bahan promosi bersama dan pendedahan media sosial",
    userBaseAccess: "Akses Pangkalan Pengguna",
    userBaseDesc: "Berhubung dengan pengguna yang peka alam sekitar di Sabah",
    dataInsights: "Wawasan Data",
    dataDesc: "Laporan bulanan mengenai jumlah pengumpulan e-sisa",
    applyPartnership: "Mohon Rakan Kongsi",
    companyName: "Nama Syarikat",
    contactPerson: "Orang Untuk Dihubungi",
    message: "Mesej",
    tellUsInterest: "Beritahu kami tentang minat anda...",
    submitApplication: "Hantar Permohonan",
    questions: "Soalan?",
    helpCenter: "Pusat Bantuan",
    contactUs: "Hubungi Kami",
    callUs: "Hubungi Kami",
    emailSupport: "Sokongan E-mel",
    whatsapp: "WhatsApp",
    faq: "Soalan Lazim",
    supportHours: "Waktu Operasi Sokongan",
    totalPickups: "Jumlah Pengambilan",
    itemsRecycled: "Barang Dikitar Semula",
    rewardPoints: "Mata Ganjaran",
    name: "Nama",
    phone: "Nombor Telefon",
    cashOut: "Tunai Keluar",
    paymentMethods: "Kaedah Pembayaran",
    convertPoints: "Tukar Mata ke Tunai",
    amountToWithdraw: "Mata untuk Ditukar",
    selectPaymentMethod: "Pilih Kaedah Pembayaran",
    conversionRate: "Kadar: 100 Mata = RM 10.00",
    insufficientPoints: "Mata Tidak Mencukupi",
    withdrawSuccess: "Pengeluaran Berjaya!",
    addPaymentMethod: "Tambah Kaedah Pembayaran",
    provider: "Penyedia (Bank/E-Dompet)",
    accountNumber: "Nombor Akaun",
    accountHolder: "Nama Pemegang Akaun",
    saveMethod: "Simpan Kaedah",
    cashReceived: "Tunai Diterima",
    noPaymentMethods: "Tiada kaedah pembayaran.",
    bankTransfer: "Pindahan Bank",
    ewallet: "E-Dompet",
    bankName: "Nama Bank",
    ewalletProvider: "Penyedia E-Dompet"
  }
};