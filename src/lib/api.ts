// src/lib/api.ts
/**
 * 🚀 COMPLETE API CLIENT per High Vision Frontend
 * Gestisce tutte le comunicazioni con il backend Bun + Hono
 */

// ===== IMPORTS =====
import type {
  ApiResponse,
  Category,
  Subcategory,
  Product,
  ContactFormData,
  Contact,
  User,
  AuthResponse,
  PaginatedResponse
} from '../../../shared/types/catalog';

  
  // ===== API CLIENT CLASS =====
  
  class ApiClient {
    private baseUrl: string;
    private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
    constructor() {
      // Use proxy in development, environment variable in production
      this.baseUrl = import.meta.env.PUBLIC_API_URL || '/api';
    // console.debug('🔗 API Client initialized:', this.baseUrl);
    }
  
    private async request<T>(
      endpoint: string, 
      options: RequestInit = {},
      useCache = false
    ): Promise<ApiResponse<T>> {
      try {
        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = `${options.method || 'GET'}_${url}`;
        
        // Check cache for GET requests
        if (useCache && (options.method === undefined || options.method === 'GET')) {
          const cached = this.requestCache.get(cacheKey);
          if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      // console.debug(`💾 Cache hit: ${url}`);
            return { success: true, data: cached.data };
          }
        }
        
    // console.debug(`📡 API Request: ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include',
          ...options,
        });
  
        const data = await response.json() as any;
  
        if (!response.ok) {
          console.error(`❌ API Error (${response.status}):`, data);
          return {
            success: false,
            error: data.error || `HTTP ${response.status}: ${response.statusText}`,
          };
        }
  
      // console.debug(`✅ API Success:`, data);
        
        const result = {
          success: true,
          data: data.data || data,
          message: data.message,
        };
  
        // Cache successful GET requests
        if (useCache && (options.method === undefined || options.method === 'GET')) {
          this.requestCache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now()
          });
        }
  
        return result;
      } catch (error) {
        console.error('🚨 Network Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Errore di rete sconosciuto',
        };
      }
    }
  
    clearCache(pattern?: string): void {
      if (pattern) {
        Array.from(this.requestCache.keys())
          .filter(key => key.includes(pattern))
          .forEach(key => this.requestCache.delete(key));
      } else {
        this.requestCache.clear();
      }
    }
  
    // ===== AUTHENTICATION METHODS =====
  
    async login(email: string, password: string, remember = false): Promise<ApiResponse<AuthResponse>> {
      const result = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, remember }),
      });
      
      if (result.success) {
        this.clearCache();
      }
      
      return result;
    }
  
    async register(email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> {
      return this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
    }
  
    async logout(): Promise<ApiResponse<{ message: string }>> {
      const result = await this.request<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
      
      if (result.success) {
        this.clearCache();
      }
      
      return result;
    }
  
    async getProfile(): Promise<ApiResponse<{ user: User }>> {
      return this.request<{ user: User }>('/auth/me');
    }
  
    // ===== PUBLIC CATALOG METHODS =====
  
    async getCategories(): Promise<ApiResponse<Category[]>> {
      return this.request<Category[]>('/catalog/categories', {}, true);
    }
  
    async getSubcategories(categoryId: string): Promise<ApiResponse<Subcategory[]>> {
      return this.request<Subcategory[]>(`/catalog/categories/${categoryId}/subcategories`, {}, true);
    }
  
    async getProducts(subcategoryId: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Product>>> {
      return this.request<PaginatedResponse<Product>>(`/catalog/subcategories/${subcategoryId}/products?page=${page}&limit=${limit}`, {}, true);
    }
  
    async searchProducts(query: string, categoryId?: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Product>>> {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (categoryId) {
        params.append('category', categoryId);
      }
      
      return this.request<PaginatedResponse<Product>>(`/catalog/search?${params.toString()}`);
    }
  
    async getFeaturedProducts(limit = 8): Promise<ApiResponse<Product[]>> {
      return this.request<Product[]>(`/catalog/featured?limit=${limit}`, {}, true);
    }
  
    // ===== PUBLIC CONTACT METHODS =====
  
    async submitContact(contactData: ContactFormData): Promise<ApiResponse<{ contact_id: string; message: string }>> {
      return this.request('/contacts/submit', {
        method: 'POST',
        body: JSON.stringify(contactData),
      });
    }
  
    // ===== ADMIN PRODUCTS MANAGEMENT =====
  
    async getAdminProducts(filters?: {
      status?: string;
      category?: string;
      search?: string;
      page?: number;
      limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<Product>>> {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const queryString = params.toString();
      return this.request<PaginatedResponse<Product>>(`/admin/products-manager${queryString ? `?${queryString}` : ''}`);
    }
  

  
    // ===== ADMIN CATEGORIES MANAGEMENT =====
  
    async getAdminCategories(): Promise<ApiResponse<Category[]>> {
      return this.request<Category[]>('/admin/categories');
    }
  
    async createCategory(categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'product_count'>): Promise<ApiResponse<Category>> {
      const result = await this.request<Category>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      
      if (result.success) {
        this.clearCache('catalog');
        this.clearCache('admin');
      }
      
      return result;
    }
  
    async deleteCategory(categoryId: string): Promise<ApiResponse<{ message: string }>> {
      const result = await this.request<{ message: string }>(`/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (result.success) {
        this.clearCache('catalog');
        this.clearCache('admin');
      }
      
      return result;
    }
  
    // ===== ADMIN SUBCATEGORIES MANAGEMENT =====
  
    async getAdminSubcategories(filters?: { category?: string }): Promise<ApiResponse<Subcategory[]>> {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      
      const queryString = params.toString();
      return this.request<Subcategory[]>(`/admin/subcategories${queryString ? `?${queryString}` : ''}`);
    }
  
    async createSubcategory(subcategoryData: Omit<Subcategory, 'id' | 'created_at' | 'updated_at' | 'category_name' | 'product_count'>): Promise<ApiResponse<Subcategory>> {
      const result = await this.request<Subcategory>('/admin/subcategories', {
        method: 'POST',
        body: JSON.stringify(subcategoryData),
      });
      
      if (result.success) {
        this.clearCache('catalog');
        this.clearCache('admin');
      }
      
      return result;
    }
  
    async deleteSubcategory(subcategoryId: string): Promise<ApiResponse<{ message: string }>> {
      const result = await this.request<{ message: string }>(`/admin/subcategories/${subcategoryId}`, {
        method: 'DELETE',
      });
      
      if (result.success) {
        this.clearCache('catalog');
        this.clearCache('admin');
      }
      
      return result;
    }
  
    // ===== PRODUCT CRUD =====
  
    async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
      const result = await this.request<Product>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (result.success) {
        this.clearCache('admin');
        this.clearCache('catalog');
      }
      
      return result;
    }
  
    async getProduct(productId: string): Promise<ApiResponse<Product>> {
      return this.request<Product>(`/admin/products/${productId}`);
    }
  
    async updateProduct(productId: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
      const result = await this.request<Product>(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (result.success) {
        this.clearCache('admin');
        this.clearCache('catalog');
      }
      
      return result;
    }
  
    async deleteProduct(productId: string): Promise<ApiResponse<{ message: string }>> {
      const result = await this.request<{ message: string }>(`/admin/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (result.success) {
        this.clearCache('admin');
        this.clearCache('catalog');
      }
      
      return result;
    }

    // ===== DASHBOARD STATS =====
  
    async getDashboardStats(): Promise<ApiResponse<{
      total_products: number;
      active_products: number;
      total_categories: number;
      total_subcategories: number;
    }>> {
      return this.request('/admin/dashboard/stats');
    }
  
    // ===== UTILITY METHODS =====
  
    async testConnection(): Promise<boolean> {
      try {
        const response = await fetch(`${this.baseUrl.replace('/api', '')}/health`);
        return response.ok;
      } catch {
        return false;
      }
    }
  
    getCacheStats(): { size: number; keys: string[] } {
      return {
        size: this.requestCache.size,
        keys: Array.from(this.requestCache.keys())
      };
    }
  }
  
  // ===== SINGLETON INSTANCE =====
  export const apiClient = new ApiClient();
  
  // ===== EXPORT TYPES =====
  export type {
    ApiResponse,
    Category,
    Subcategory, 
    Product,
    ContactFormData,
    Contact,
    User,
    AuthResponse,
    PaginatedResponse
  };
  
  // ===== DEFAULT EXPORT =====
  export default apiClient;