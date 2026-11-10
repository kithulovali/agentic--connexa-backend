import { useAuthStore } from '../store/useAuthStore';
import {
  UserLogin,
  UserRegister,
  UserOut,
  TokenOut,
  ProductOut,
  ProductCreate,
  ProductUpdate,
  OrderCreate,
  OrderOut,
  OrderStatusUpdate,
  PaymentCreate,
  PaymentOut,
  AgentRequest,
  AgentResponse,
  AIRecommendationQuery,
  AIRecommendationResponse,
  AISmartSearchResponse,
  MultiPlatformCampaign,
  FacebookPost,
  InstagramImagePost,
  TikTokVideoPost,
  WhatsAppMessage,
} from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://agentic-connexa-backend.onrender.com').replace(/\/+$/, '');
const API_PREFIX = '/api/v1';

export class ApiError extends Error {
  public status: number;
  public detail: any;

  constructor(status: number, message: string, detail?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${API_PREFIX}${endpoint}`;
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return null as unknown as T;
  }

  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data.detail)) {
        errorMessage = data.detail.map((err: any) => `${err.loc?.join('.') || 'error'}: ${err.msg}`).join(', ');
      } else if (data.detail) {
        errorMessage = String(data.detail);
      } else if (data.message) {
        errorMessage = String(data.message);
      }
    } else if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
    }
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

export const api = {
  // ==========================================
  // Health & Server Status
  // ==========================================
  async getHealth(): Promise<{ status: string }> {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  // ==========================================
  // Authentication
  // ==========================================
  async register(payload: UserRegister): Promise<UserOut> {
    return request<UserOut>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: UserLogin): Promise<TokenOut> {
    return request<TokenOut>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<UserOut> {
    return request<UserOut>('/auth/me');
  },

  // ==========================================
  // Users (Admin)
  // ==========================================
  async listUsers(offset = 0, limit = 50): Promise<UserOut[]> {
    return request<UserOut[]>(`/users?offset=${offset}&limit=${limit}`);
  },

  async getUser(publicId: string): Promise<UserOut> {
    return request<UserOut>(`/users/${publicId}`);
  },

  async updateUser(publicId: string, payload: { name?: string | null; contact?: string | null }): Promise<UserOut> {
    return request<UserOut>(`/users/${publicId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteUser(publicId: string): Promise<void> {
    return request<void>(`/users/${publicId}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // Products (Catalogue & Management)
  // ==========================================
  async listProducts(params?: {
    search?: string;
    min_price?: number | string;
    max_price?: number | string;
    status?: string;
    offset?: number;
    limit?: number;
  }): Promise<ProductOut[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.min_price !== undefined && params.min_price !== '') query.append('min_price', String(params.min_price));
    if (params?.max_price !== undefined && params.max_price !== '') query.append('max_price', String(params.max_price));
    if (params?.status) query.append('status', params.status);
    if (params?.offset !== undefined) query.append('offset', String(params.offset));
    if (params?.limit !== undefined) query.append('limit', String(params.limit));

    const qs = query.toString();
    return request<ProductOut[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  async getProduct(productId: number): Promise<ProductOut> {
    return request<ProductOut>(`/products/${productId}`);
  },

  async createProduct(payload: ProductCreate): Promise<ProductOut> {
    return request<ProductOut>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(productId: number, payload: ProductUpdate): Promise<ProductOut> {
    return request<ProductOut>(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteProduct(productId: number): Promise<void> {
    return request<void>(`/products/${productId}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // Orders
  // ==========================================
  async placeOrder(payload: OrderCreate): Promise<OrderOut> {
    return request<OrderOut>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listOrders(offset = 0, limit = 50): Promise<OrderOut[]> {
    return request<OrderOut[]>(`/orders?offset=${offset}&limit=${limit}`);
  },

  async getOrder(orderId: number): Promise<OrderOut> {
    return request<OrderOut>(`/orders/${orderId}`);
  },

  async cancelOrder(orderId: number): Promise<void> {
    return request<void>(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },

  async updateOrderStatus(orderId: number, status: string): Promise<OrderOut> {
    const payload: OrderStatusUpdate = { order_status: status };
    return request<OrderOut>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // Payments
  // ==========================================
  async processPayment(payload: PaymentCreate): Promise<PaymentOut> {
    return request<PaymentOut>('/payments/pay', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getPayment(paymentId: number): Promise<PaymentOut> {
    return request<PaymentOut>(`/payments/${paymentId}`);
  },

  async getPaymentByOrder(orderId: number): Promise<PaymentOut> {
    return request<PaymentOut>(`/payments/order/${orderId}`);
  },

  async listPayments(offset = 0, limit = 50): Promise<PaymentOut[]> {
    return request<PaymentOut[]>(`/payments?offset=${offset}&limit=${limit}`);
  },

  // ==========================================
  // Public AI Electronics Assistants
  // ==========================================
  async getAiRecommendations(payload: AIRecommendationQuery): Promise<AIRecommendationResponse> {
    return request<AIRecommendationResponse>('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async aiSmartSearch(q: string): Promise<AISmartSearchResponse> {
    return request<AISmartSearchResponse>(`/ai/smart-search?q=${encodeURIComponent(q)}`);
  },

  async askCustomerShoppingAssistant(question: string): Promise<AgentResponse> {
    const payload: AgentRequest = { question };
    return request<AgentResponse>('/ai/agents/customer-shopping-assistant', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async askProductDiscovery(question: string): Promise<AgentResponse> {
    const payload: AgentRequest = { question };
    return request<AgentResponse>('/ai/agents/product-discovery', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // Admin AI Enterprise Agents
  // ==========================================
  async getBusinessIntelligence(question: string): Promise<AgentResponse> {
    const payload: AgentRequest = { question };
    return request<AgentResponse>('/ai/agents/business-intelligence', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getGrowthOptimization(question: string): Promise<AgentResponse> {
    const payload: AgentRequest = { question };
    return request<AgentResponse>('/ai/agents/growth-optimization', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMarketingContent(question: string): Promise<AgentResponse> {
    const payload: AgentRequest = { question };
    return request<AgentResponse>('/ai/agents/marketing-content', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getImageStudioBrief(question: string): Promise<AgentResponse> {
    const payload: AgentRequest = { question };
    return request<AgentResponse>('/ai/agents/image-studio', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async renderImageStudio(question: string): Promise<{ image_base64?: string; [key: string]: any }> {
    const payload: AgentRequest = { question };
    return request<any>('/ai/agents/image-studio/render', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // Platform & Multichannel Integrations (Admin)
  // ==========================================
  async getPlatformStatus(): Promise<Record<string, any>> {
    return request<Record<string, any>>('/platforms/status');
  },

  async publishCampaign(payload: MultiPlatformCampaign): Promise<any> {
    return request<any>('/platforms/campaign/publish', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async publishFacebook(payload: FacebookPost): Promise<any> {
    return request<any>('/platforms/facebook/publish', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async publishInstagram(payload: InstagramImagePost): Promise<any> {
    return request<any>('/platforms/instagram/publish-image', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async publishTikTok(payload: TikTokVideoPost): Promise<any> {
    return request<any>('/platforms/tiktok/publish-video', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async sendWhatsAppMessage(payload: WhatsAppMessage): Promise<any> {
    return request<any>('/platforms/whatsapp/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getWhatsAppSummary(): Promise<any> {
    return request<any>('/platforms/whatsapp/conversations/summary');
  },
};

