// ==========================================
// User & Authentication Types
// ==========================================

export interface UserOut {
  public_id: string; // UUID v4
  name: string;
  email: string;
  role: 'admin' | 'customer' | string;
  contact?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  name: string;
  email: string;
  contact?: string | null;
  password: string;
}

export interface UserUpdate {
  name?: string | null;
  contact?: string | null;
}

export interface TokenOut {
  access_token: string;
  token_type: string;
  user: UserOut;
}

// ==========================================
// Product & Inventory Types
// ==========================================

export interface ProductOut {
  id: number;
  name: string;
  price: string; // Python Decimal serialized as string (e.g. "299.99")
  description?: string | null;
  banner_image?: string | null;
  quantity: number;
  status: 'AVAILABLE' | 'EMPTY' | string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductCreate {
  name: string;
  price: number | string;
  description?: string | null;
  banner_image?: string | null;
  quantity?: number;
  status?: string;
}

export interface ProductUpdate {
  name?: string | null;
  price?: number | string | null;
  description?: string | null;
  banner_image?: string | null;
  quantity?: number | null;
  status?: string | null;
}

// ==========================================
// Order & Payment Types
// ==========================================

export interface OrderCreate {
  product_id: number;
  quantity?: number;
  address: string;
  contact: string;
  payment_method?: 'MOBILE MONEY' | 'BANK' | 'CRYPTO' | string | null;
}

export interface OrderOut {
  id: number;
  address: string;
  contacs: string; // Note API spelling: 'contacs'
  order_status: string; // e.g. "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
  payment_method: string;
  payment_status: 'PENDING' | 'PAID' | string;
  initial_price: string;
  total_price: string;
  quantity: number;
  ordered_at: string;
  user_id?: string | null;
  product_id: number;
  product?: ProductOut | null;
}

export interface OrderStatusUpdate {
  order_status: string;
}

export interface PaymentCreate {
  order_id: number;
  payment_method: 'MOBILE MONEY' | 'BANK' | 'CRYPTO' | string;
  amount: number | string;
}

export interface PaymentOut {
  id: number;
  order_id: number;
  payment_method: string;
  amount: string;
  paid_at: string;
}

// ==========================================
// AI Assistant & Agent Types
// ==========================================

export interface AgentRequest {
  question: string;
}

export interface AgentResponse {
  agent: string;
  answer: string;
  model: string;
  warning?: string | null;
  data_summary: Record<string, any>;
}

export interface AIRecommendationQuery {
  query: string;
  max_budget?: number | string | null;
  preferred_category?: string | null;
}

export interface AIRecommendationResponse {
  query: string;
  ai_advice: string;
  recommendations: ProductOut[];
}

export interface AISmartSearchResponse {
  query: string;
  total_matches: number;
  matches: ProductOut[];
}

// ==========================================
// Multichannel Platform Types
// ==========================================

export interface PlatformStatus {
  facebook?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
  whatsapp?: boolean;
  [key: string]: any;
}

export interface MultiPlatformCampaign {
  approved: boolean; // Must be true
  platforms: ('facebook' | 'instagram' | 'tiktok')[];
  caption: string;
  image_url?: string | null;
  video_url?: string | null;
  privacy_level?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY' | null;
}

export interface FacebookPost {
  approved: boolean;
  message: string;
}

export interface InstagramImagePost {
  approved: boolean;
  image_url: string;
  caption?: string;
}

export interface TikTokVideoPost {
  approved: boolean;
  video_url: string;
  caption?: string;
  privacy_level: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY';
}

export interface WhatsAppMessage {
  approved: boolean;
  to: string; // E.164 phone number
  message: string;
}

// ==========================================
// Frontend State Helper Types
// ==========================================

export interface CartItem {
  product: ProductOut;
  quantity: number;
}

