# Module 7: Adding Resources (Read-Only Data Exposure)

[← Adding Database Tools](06-adding-database-tools.md) | [Next: Adding Prompts →](08-adding-prompts.md)

---

Resources are read-only data that MCP clients can access. Unlike tools (which are actions the AI *executes*), resources are data the AI can *reference*. Think of resources as GET endpoints -- they provide context without side effects.

## Resource 1: Category List

```typescript
// ------------------------------------------
// RESOURCE: inventory://categories
// ------------------------------------------
server.registerResource(
  'categories',
  'inventory://categories',
  {
    title: 'Product Categories',
    description: 'List of all product categories in the inventory system',
    mimeType: 'application/json',
  },
  async (uri) => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description')
      .order('name')

    if (error) {
      return { contents: [{ uri: uri.href, text: `Error: ${error.message}` }] }
    }

    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(data, null, 2),
      }],
    }
  }
)
```

## Resource 2: Inventory Statistics

```typescript
// ------------------------------------------
// RESOURCE: inventory://stats
// ------------------------------------------
server.registerResource(
  'inventory-stats',
  'inventory://stats',
  {
    title: 'Inventory Statistics',
    description: 'Overall inventory statistics: total products, stock levels, category breakdown, and value',
    mimeType: 'application/json',
  },
  async (uri) => {
    // Total products and stock
    const { data: products } = await supabase
      .from('products')
      .select('price, stock_quantity, is_active, category_id')

    if (!products) {
      return { contents: [{ uri: uri.href, text: '{"error": "Failed to fetch stats"}' }] }
    }

    const activeProducts = products.filter((p: any) => p.is_active)
    const totalValue = activeProducts.reduce(
      (sum: number, p: any) => sum + (p.price * p.stock_quantity), 0
    )
    const lowStock = activeProducts.filter((p: any) => p.stock_quantity < 50)
    const outOfStock = activeProducts.filter((p: any) => p.stock_quantity === 0)

    // Category breakdown
    const { data: categories } = await supabase
      .from('products_with_categories')
      .select('category')

    const categoryCount: Record<string, number> = {}
    categories?.forEach((p: any) => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })

    const stats = {
      total_products: products.length,
      active_products: activeProducts.length,
      total_inventory_value: `$${totalValue.toFixed(2)}`,
      low_stock_count: lowStock.length,
      out_of_stock_count: outOfStock.length,
      products_by_category: categoryCount,
      average_price: `$${(activeProducts.reduce((s: number, p: any) => s + Number(p.price), 0) / activeProducts.length).toFixed(2)}`,
    }

    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(stats, null, 2),
      }],
    }
  }
)
```

## Resource 3: Dynamic Product Details (Resource Templates)

Resource templates let you expose parameterized resources -- like `/products/:id` in a REST API.

```typescript
// ------------------------------------------
// RESOURCE TEMPLATE: inventory://product/{id}
// ------------------------------------------
import { ResourceTemplate } from 'npm:@modelcontextprotocol/sdk@1.25.3/server/mcp.js'

server.registerResource(
  'product-detail',
  new ResourceTemplate('inventory://product/{id}', {
    list: async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      return {
        resources: (data || []).map((p: any) => ({
          uri: `inventory://product/${p.id}`,
          name: p.name,
        })),
      }
    },
  }),
  {
    title: 'Product Details',
    description: 'Detailed information about a specific product including sales history',
    mimeType: 'application/json',
  },
  async (uri, { id }) => {
    const productId = Number(id)

    // Fetch product details
    const { data: product } = await supabase
      .from('products_with_categories')
      .select('*')
      .eq('id', productId)
      .single()

    if (!product) {
      return { contents: [{ uri: uri.href, text: `Product ${id} not found` }] }
    }

    // Fetch recent sales for this product
    const { data: sales } = await supabase
      .from('sales')
      .select('quantity, unit_price, total_revenue, sale_date')
      .eq('product_id', productId)
      .order('sale_date', { ascending: false })
      .limit(10)

    const detail = {
      ...product,
      recent_sales: sales || [],
      total_recent_revenue: (sales || []).reduce(
        (sum: number, s: any) => sum + Number(s.total_revenue), 0
      ),
    }

    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(detail, null, 2),
      }],
    }
  }
)
```

---

[Next: Module 8 - Adding Prompts (Reusable Templates) →](08-adding-prompts.md)
