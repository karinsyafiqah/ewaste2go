export type PickupStatus = 'pending' | 'assigned' | 'in-transit' | 'completed' | 'cancelled';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SavedLocation {
  id: string;
  name: string; // e.g., "Home", "Office"
  address: string;
  coordinates: Coordinates;
}

export interface Pickup {
  id: string;
  date: string;
  time: string;
  items: string[];
  status: PickupStatus;
  driverName?: string;
  driverVehicle?: string;
  driverPhone?: string;
  trackingId?: string;
  currentLocation?: Coordinates;
  location: SavedLocation;
}

export interface CollectionPoint {
  id: string;
  name: string;
  type: 'government' | 'partner' | 'ngo';
  description?: string; // Added description field
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  acceptedItems: string[];
  isDBKK?: boolean;
  coordinates: Coordinates;
}

export interface MarketplaceAd {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  imageUrl: string;
  companyName: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  postedDate: string;
}

export interface Reward {
  id: string;
  name: string;
  category: 'Voucher' | 'Merchandise' | 'Cash' | 'Environmental';
  cost: number;
  imageUrl: string;
  stock: number;
}

export interface ClaimedReward {
  id: string;
  rewardId: string;
  name: string;
  imageUrl: string;
  date: string;
  code: string; // Redemption code
}

export interface UserStats {
  totalPickups: number;
  rewardPoints: number;
  itemsRecycled: number;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'ewallet';
  provider: string; // e.g., "Maybank", "Touch 'n Go"
  accountNumber: string;
  accountHolder: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stats: UserStats;
  savedLocations: SavedLocation[];
  claimedRewards: ClaimedReward[];
  paymentMethods: PaymentMethod[];
}