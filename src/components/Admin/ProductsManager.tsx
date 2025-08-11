// src/components/Admin/ProductsManager.tsx
import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { apiClient } from '../../lib/api';
import type { Product, Category, Subcategory, PaginatedResponse } from '../../../../shared/types/catalog';

export default component$(() => {
  // State
  const products = useStore<Product[]>([]);
  const categories = useStore<Category[]>([]);
  const subcategories = useStore<Subcategory[]>([]);
  
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  
  // Filters
  const filters = useStore({
    search: '',
    status: '',
    category: '',
    page: 1,
    limit: 10
  });
  
  const pagination = useStore({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Modal states
  const showCreateModal = useSignal(false);
  const showEditModal = useSignal(false);
  const selectedProduct = useStore<Partial<Product>>({});

  // Form state for creating/editing products
  const productForm = useStore({
    name: '',
    description: '',
    short_description: '',
    slug: '',
    category_id: '',
    subcategory_id: '',
    images: [] as string[],
    price: '',
    price_range: '',
    features: [] as string[],
    specifications: {} as Record<string, any>,
    referenti: '',
    badge: '' as '' | 'Bestseller' | 'New' | 'Featured',
    featured: false,
    status: 'active' as 'active' | 'draft' | 'archived'
  });

  // Load initial data
  useVisibleTask$(async () => {
    await Promise.all([
      loadProducts(),
      loadCategories()
    ]);
  });

  // API calls
  const loadProducts = $(async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.getAdminProducts({
        search: filters.search || undefined,
        status: filters.status || undefined,
        category: filters.category || undefined,
        page: filters.page,
        limit: filters.limit
      });

      if (response.success && response.data) {
        products.splice(0, products.length, ...response.data.data);
        pagination.page = response.data.pagination.page;
        pagination.limit = response.data.pagination.limit;
        pagination.total = response.data.pagination.total;
        pagination.pages = response.data.pagination.pages;
      } else {
        error.value = response.error || 'Errore nel caricamento prodotti';
      }
    } catch (err) {
      error.value = 'Errore di connessione';
      console.error('Load products error:', err);
    } finally {
      loading.value = false;
    }
  });

  const loadCategories = $(async () => {
    try {
      const response = await apiClient.getAdminCategories();
      if (response.success && response.data) {
        categories.splice(0, categories.length, ...response.data);
      }
    } catch (err) {
      console.error('Load categories error:', err);
    }
  });

  const loadSubcategories = $(async (categoryId: string) => {
    try {
      const response = await apiClient.getAdminSubcategories({ category: categoryId });
      if (response.success && response.data) {
        subcategories.splice(0, subcategories.length, ...response.data);
      }
    } catch (err) {
      console.error('Load subcategories error:', err);
    }
  });

  // Event handlers
  const handleSearch = $(async () => {
    filters.page = 1;
    await loadProducts();
  });

  const handleFilterChange = $(async () => {
    filters.page = 1;
    await loadProducts();
  });

  const handlePageChange = $(async (page: number) => {
    filters.page = page;
    await loadProducts();
  });

  const openCreateModal = $(() => {
    // Reset form
    Object.assign(productForm, {
      name: '',
      description: '',
      short_description: '',
      slug: '',
      category_id: '',
      subcategory_id: '',
      images: [],
      price: '',
      price_range: '',
      features: [],
      specifications: {},
      referenti: '',
      badge: '',
      featured: false,
      status: 'active'
    });
    showCreateModal.value = true;
  });

  const openEditModal = $(async (product: Product) => {
    // Load subcategories for the product's category
    if (product.category_id) {
      await loadSubcategories(product.category_id);
    }
    
    // Populate form with product data
    Object.assign(productForm, {
      name: product.name,
      description: product.description,
      short_description: product.short_description || '',
      slug: product.slug,
      category_id: product.category_id,
      subcategory_id: product.subcategory_id,
      images: product.images || [],
      price: product.price || '',
      price_range: product.price_range || '',
      features: product.features || [],
      specifications: product.specifications || {},
      referenti: product.referenti,
      badge: product.badge || '',
      featured: product.featured,
      status: product.status
    });
    
    selectedProduct.id = product.id;
    showEditModal.value = true;
  });

  const handleCategoryChange = $(async (categoryId: string) => {
    productForm.category_id = categoryId;
    productForm.subcategory_id = ''; // Reset subcategory
    if (categoryId) {
      await loadSubcategories(categoryId);
    } else {
      subcategories.splice(0, subcategories.length);
    }
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = $((name: string) => {
    productForm.name = name;
    const currentSlug = generateSlug(name);
    if (!productForm.slug || productForm.slug === generateSlug(productForm.name)) {
      productForm.slug = currentSlug;
    }
  });

  const addFeature = $(() => {
    productForm.features.push('');
  });

  const removeFeature = $((index: number) => {
    productForm.features.splice(index, 1);
  });

  const updateFeature = $((index: number, value: string) => {
    productForm.features[index] = value;
  });

  const saveProduct = $(async () => {
    loading.value = true;
    error.value = null;

    try {
      // Validation
      if (!productForm.name.trim()) {
        error.value = 'Nome prodotto richiesto';
        return;
      }
      if (!productForm.description.trim()) {
        error.value = 'Descrizione richiesta';
        return;
      }
      if (!productForm.category_id) {
        error.value = 'Categoria richiesta';
        return;
      }
      if (!productForm.subcategory_id) {
        error.value = 'Sottocategoria richiesta';
        return;
      }
      if (!productForm.referenti.trim()) {
        error.value = 'Referenti richiesti';
        return;
      }

      // Filter out empty features
      const filteredFeatures = productForm.features.filter(f => f.trim());

      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        short_description: productForm.short_description.trim() || undefined,
        slug: productForm.slug.trim(),
        category_id: productForm.category_id,
        subcategory_id: productForm.subcategory_id,
        images: productForm.images,
        price: productForm.price.trim() || undefined,
        price_range: productForm.price_range.trim() || undefined,
        features: filteredFeatures,
        specifications: productForm.specifications,
        referenti: productForm.referenti.trim(),
        badge: productForm.badge || undefined,
        featured: productForm.featured,
        status: productForm.status
      };

      let response;
      if (selectedProduct.id) {
        // Update existing product
        response = await apiClient.updateProduct(selectedProduct.id, productData);
      } else {
        // Create new product
        response = await apiClient.createProduct(productData);
      }

      if (response.success) {
        showCreateModal.value = false;
        showEditModal.value = false;
        await loadProducts();
      } else {
        error.value = response.error || 'Errore nel salvataggio';
      }
    } catch (err) {
      error.value = 'Errore di connessione';
      console.error('Save product error:', err);
    } finally {
      loading.value = false;
    }
  });

  const deleteProduct = $(async (productId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.deleteProduct(productId);
      if (response.success) {
        await loadProducts();
      } else {
        error.value = response.error || 'Errore nell\'eliminazione';
      }
    } catch (err) {
      error.value = 'Errore di connessione';
      console.error('Delete product error:', err);
    } finally {
      loading.value = false;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Bestseller': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-green-100 text-green-800';
      case 'Featured': return 'bg-purple-100 text-purple-800';
      default: return '';
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestione Prodotti</h1>
            <p class="mt-2 text-gray-600">
              Gestisci il catalogo prodotti del sito web
            </p>
          </div>
          <button
            onClick$={openCreateModal}
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            + Nuovo Prodotto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cerca prodotti
            </label>
            <input
              type="text"
              value={filters.search}
              onInput$={(e) => filters.search = (e.target as HTMLInputElement).value}
              onKeyPress$={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Nome, descrizione..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Stato
            </label>
            <select
              value={filters.status}
              onChange$={(e) => {
                filters.status = (e.target as HTMLSelectElement).value;
                handleFilterChange();
              }}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tutti gli stati</option>
              <option value="active">Attivo</option>
              <option value="draft">Bozza</option>
              <option value="archived">Archiviato</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={filters.category}
              onChange$={(e) => {
                filters.category = (e.target as HTMLSelectElement).value;
                handleFilterChange();
              }}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tutte le categorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <div class="flex items-end">
            <button
              onClick$={handleSearch}
              class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Cerca
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error.value && (
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error.value}
        </div>
      )}

      {/* Loading */}
      {loading.value && (
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Caricamento...</p>
        </div>
      )}

      {/* Products Table */}
      {!loading.value && (
        <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prodotto
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stato
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visualizzazioni
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-12 w-12">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              class="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span class="text-gray-400 text-xs">IMG</span>
                            </div>
                          )}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div class="text-sm text-gray-500">
                            {product.price || 'Prezzo non specificato'}
                          </div>
                          {product.badge && (
                            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(product.badge)}`}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{product.category_name}</div>
                      <div class="text-sm text-gray-500">{product.subcategory_name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status === 'active' ? 'Attivo' : 
                         product.status === 'draft' ? 'Bozza' : 'Archiviato'}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.views}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button
                          onClick$={() => openEditModal(product)}
                          class="text-blue-600 hover:text-blue-900"
                        >
                          Modifica
                        </button>
                        <button
                          onClick$={() => deleteProduct(product.id)}
                          class="text-red-600 hover:text-red-900"
                        >
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  onClick$={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page <= 1}
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Precedente
                </button>
                <button
                  onClick$={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page >= pagination.pages}
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Successivo
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando <span class="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> a{' '}
                    <span class="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> di{' '}
                    <span class="font-medium">{pagination.total}</span> risultati
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick$={() => handlePageChange(page)}
                        class={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal - will be created in next step */}
      {(showCreateModal.value || showEditModal.value) && (
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {showCreateModal.value ? 'Nuovo Prodotto' : 'Modifica Prodotto'}
              </h3>
              
              {/* Modal content will be added in next step */}
              <div class="text-center py-8 text-gray-500">
                Form prodotto - Implementazione nel prossimo step
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button
                  onClick$={() => {
                    showCreateModal.value = false;
                    showEditModal.value = false;
                  }}
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button
                  onClick$={saveProduct}
                  disabled={loading.value}
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading.value ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});