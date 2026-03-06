# Module 13: Complete Source Code Reference

[← Security and Best Practices](12-security-and-best-practices.md) | [Back to Course Overview →](00-course-overview.md)

---

Below is the complete, final `index.ts` file with all tools, resources, and prompts assembled together. Copy this into `supabase/functions/mcp/index.ts`:

```typescript
// supabase/functions/mcp/index.ts
// ==========================================
// MCP Server for Product Inventory Management
// Supabase Edge Function
// ==========================================

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import {
  McpServer,
  ResourceTemplate,
} from 'npm:@modelcontextprotocol/sdk@1.25.3/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from 'npm:@modelcontextprotocol/sdk@1.25.3/server/webStandardStreamableHttp.js'
import { Hono } from 'npm:hono@^4.9.7'
import { z } from 'npm:zod@^4.1.13'
import { createClient } from 'npm:@supabase/supabase-js@2'

// ==========================================
// Supabase Client
// ==========================================
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// ==========================================
// MCP Server
// ==========================================
const server = new McpServer({
  name: 'inventory-mcp-server',
  version: '1.0.0',
})

// ==========================================
// TOOLS
// ==========================================

// --- search_products ---
server.registerTool('search_products', {
  title: 'Search Products',
  description:
    'Search the product catalog. You can filter by text query (searches name and description), ' +
    'category name, price range, and stock status. Returns matching products with their details. ' +
    'Use this tool when users ask about available products, want to find specific items, or ' +
    'need to check inventory levels.',
  inputSchema: {
    query: z.string().optional().describe('Text to search in product name and description'),
    category: z.string().optional().describe('Filter by category name (e.g., "Electronics", "Books")'),
    min_price: z.number().optional().describe('Minimum price filter'),
    max_price: z.number().optional().describe('Maximum price filter'),
    in_stock_only: z.boolean().optional().describe('If true, only return products with stock > 0'),
    limit: z.number().optional().describe('Maximum number of results to return (default: 20)'),
  },
}, async ({ query, category, min_price, max_price, in_stock_only, limit }) => {
  let dbQuery = supabase
    .from('products_with_categories')
    .select('*')

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }
  if (category) {
    dbQuery = dbQuery.ilike('category', category)
  }
  if (min_price !== undefined) {
    dbQuery = dbQuery.gte('price', min_price)
  }
  if (max_price !== undefined) {
    dbQuery = dbQuery.lte('price', max_price)
  }
  if (in_stock_only) {
    dbQuery = dbQuery.gt('stock_quantity', 0)
  }

  dbQuery = dbQuery.eq('is_active', true).order('name').limit(limit ?? 20)

  const { data, error } = await dbQuery

  if (error) {
    return {
      content: [{ type: 'text', text: `Error searching products: ${error.message}` }],
      isError: true,
    }
  }

  if (!data || data.length === 0) {
    return { content: [{ type: 'text', text: 'No products found matching your criteria.' }] }
  }

  const summary = `Found ${data.length} product(s):\n\n` +
    data.map((p: any) =>
      `- **${p.name}** (${p.sku})\n` +
      `  Category: ${p.category} | Price: $${p.price} | Stock: ${p.stock_quantity}\n` +
      `  ${p.description}`
    ).join('\n\n')

  return {
    content: [
      { type: 'text', text: summary },
      { type: 'text', text: '\n\nRaw data:\n' + JSON.stringify(data, null, 2) },
    ],
  }
})

// --- create_product ---
server.registerTool('create_product', {
  title: 'Create Product',
  description:
    'Add a new product to the inventory catalog. Requires name, price, category, and SKU. ' +
    'Use this when users want to add new items to the store.',
  inputSchema: {
    name: z.string().describe('Product name'),
    description: z.string().optional().describe('Product description'),
    price: z.number().positive().describe('Product price in dollars (e.g., 29.99)'),
    category: z.string().describe('Category name (must match an existing category)'),
    stock_quantity: z.number().int().nonnegative().describe('Initial stock quantity'),
    sku: z.string().describe('Unique SKU code (e.g., "ELEC-008")'),
  },
}, async ({ name, description, price, category, stock_quantity, sku }) => {
  const { data: cat, error: catError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', category)
    .single()

  if (catError || !cat) {
    const { data: allCats } = await supabase.from('categories').select('name')
    const available = allCats?.map((c: any) => c.name).join(', ') || 'none'
    return {
      content: [{
        type: 'text',
        text: `Category "${category}" not found. Available categories: ${available}`,
      }],
      isError: true,
    }
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price,
      category_id: cat.id,
      stock_quantity,
      sku,
    })
    .select()
    .single()

  if (error) {
    return {
      content: [{ type: 'text', text: `Error creating product: ${error.message}` }],
      isError: true,
    }
  }

  return {
    content: [{
      type: 'text',
      text: `Product created successfully!\n\n` +
        `- **${data.name}** (ID: ${data.id})\n` +
        `- SKU: ${data.sku}\n` +
        `- Price: $${data.price}\n` +
        `- Stock: ${data.stock_quantity}\n` +
        `- Category: ${category}`,
    }],
  }
})

// --- update_product ---
server.registerTool('update_product', {
  title: 'Update Product',
  description:
    'Update an existing product\'s details. You can update any combination of fields: ' +
    'name, description, price, stock quantity, or active status. ' +
    'Identify the product by its ID or SKU.',
  inputSchema: {
    id: z.number().optional().describe('Product ID (use either id or sku)'),
    sku: z.string().optional().describe('Product SKU (use either id or sku)'),
    name: z.string().optional().describe('New product name'),
    description: z.string().optional().describe('New product description'),
    price: z.number().positive().optional().describe('New price'),
    stock_quantity: z.number().int().nonnegative().optional().describe('New stock quantity'),
    is_active: z.boolean().optional().describe('Set to false to deactivate the product'),
  },
}, async ({ id, sku, name, description, price, stock_quantity, is_active }) => {
  if (!id && !sku) {
    return {
      content: [{ type: 'text', text: 'Please provide either a product ID or SKU.' }],
      isError: true,
    }
  }

  const updates: Record<string, any> = {}
  if (name !== undefined) updates.name = name
  if (description !== undefined) updates.description = description
  if (price !== undefined) updates.price = price
  if (stock_quantity !== undefined) updates.stock_quantity = stock_quantity
  if (is_active !== undefined) updates.is_active = is_active

  if (Object.keys(updates).length === 0) {
    return {
      content: [{ type: 'text', text: 'No fields to update. Provide at least one field to change.' }],
      isError: true,
    }
  }

  let query = supabase.from('products').update(updates)
  if (id) {
    query = query.eq('id', id)
  } else {
    query = query.eq('sku', sku!)
  }

  const { data, error } = await query.select().single()

  if (error) {
    return {
      content: [{ type: 'text', text: `Error updating product: ${error.message}` }],
      isError: true,
    }
  }

  return {
    content: [{
      type: 'text',
      text: `Product updated successfully!\n\n` +
        `- **${data.name}** (ID: ${data.id}, SKU: ${data.sku})\n` +
        `- Price: $${data.price}\n` +
        `- Stock: ${data.stock_quantity}\n` +
        `- Active: ${data.is_active}\n\n` +
        `Fields updated: ${Object.keys(updates).join(', ')}`,
    }],
  }
})

// --- delete_product ---
server.registerTool('delete_product', {
  title: 'Delete Product',
  description:
    'Permanently delete a product from the catalog. This also deletes all associated ' +
    'sales records. Use with caution. Consider deactivating instead via update_product.',
  annotations: {
    destructiveHint: true,
  },
  inputSchema: {
    id: z.number().optional().describe('Product ID'),
    sku: z.string().optional().describe('Product SKU'),
    confirm: z.boolean().describe('Must be true to confirm deletion'),
  },
}, async ({ id, sku, confirm }) => {
  if (!confirm) {
    return {
      content: [{
        type: 'text',
        text: 'Deletion not confirmed. Set confirm=true to proceed. ' +
          'Consider using update_product with is_active=false to deactivate instead.',
      }],
    }
  }

  if (!id && !sku) {
    return {
      content: [{ type: 'text', text: 'Please provide either a product ID or SKU.' }],
      isError: true,
    }
  }

  let fetchQuery = supabase.from('products').select('id, name, sku')
  if (id) {
    fetchQuery = fetchQuery.eq('id', id)
  } else {
    fetchQuery = fetchQuery.eq('sku', sku!)
  }
  const { data: product, error: fetchError } = await fetchQuery.single()

  if (fetchError || !product) {
    return {
      content: [{ type: 'text', text: 'Product not found.' }],
      isError: true,
    }
  }

  const { error } = await supabase.from('products').delete().eq('id', product.id)

  if (error) {
    return {
      content: [{ type: 'text', text: `Error deleting product: ${error.message}` }],
      isError: true,
    }
  }

  return {
    content: [{
      type: 'text',
      text: `Product deleted: **${product.name}** (ID: ${product.id}, SKU: ${product.sku}). ` +
        `All associated sales records have been removed.`,
    }],
  }
})

// --- get_sales_summary ---
server.registerTool('get_sales_summary', {
  title: 'Get Sales Summary',
  description:
    'Get a sales summary showing revenue, units sold, and order counts. ' +
    'Can be filtered by time period and category. ' +
    'Use this when users ask about sales performance, revenue, or top-selling products.',
  inputSchema: {
    days: z.number().int().positive().optional().describe('Number of past days to include (default: 30)'),
    category: z.string().optional().describe('Filter by category name'),
    order_by: z.enum(['revenue', 'units', 'orders']).optional().describe('Sort results by this metric (default: revenue)'),
    limit: z.number().int().optional().describe('Number of top products to return (default: 10)'),
  },
}, async ({ days, category, order_by, limit: resultLimit }) => {
  const periodDays = days ?? 30
  const sortBy = order_by ?? 'revenue'
  const maxResults = resultLimit ?? 10
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

  const { data: sales, error } = await supabase
    .from('sales')
    .select(`
      quantity,
      unit_price,
      total_revenue,
      sale_date,
      products!inner (
        id,
        name,
        sku,
        categories ( name )
      )
    `)
    .gte('sale_date', since)

  if (error) {
    return {
      content: [{ type: 'text', text: `Error fetching sales: ${error.message}` }],
      isError: true,
    }
  }

  if (!sales || sales.length === 0) {
    return { content: [{ type: 'text', text: `No sales found in the last ${periodDays} days.` }] }
  }

  const productSales = new Map<number, {
    name: string; sku: string; category: string
    totalRevenue: number; totalUnits: number; orderCount: number
  }>()

  for (const sale of sales) {
    const product = sale.products as any
    const catName = product.categories?.name || 'Uncategorized'
    if (category && catName.toLowerCase() !== category.toLowerCase()) continue

    const existing = productSales.get(product.id) || {
      name: product.name, sku: product.sku, category: catName,
      totalRevenue: 0, totalUnits: 0, orderCount: 0,
    }
    existing.totalRevenue += Number(sale.total_revenue)
    existing.totalUnits += sale.quantity
    existing.orderCount += 1
    productSales.set(product.id, existing)
  }

  const sorted = [...productSales.values()].sort((a, b) => {
    if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue
    if (sortBy === 'units') return b.totalUnits - a.totalUnits
    return b.orderCount - a.orderCount
  }).slice(0, maxResults)

  const totalRevenue = sorted.reduce((sum, p) => sum + p.totalRevenue, 0)
  const totalUnits = sorted.reduce((sum, p) => sum + p.totalUnits, 0)
  const totalOrders = sorted.reduce((sum, p) => sum + p.orderCount, 0)

  const summary = `Sales Summary (last ${periodDays} days)${category ? ` — ${category}` : ''}:\n\n` +
    `**Totals**: $${totalRevenue.toFixed(2)} revenue | ${totalUnits} units sold | ${totalOrders} orders\n\n` +
    `**Top Products by ${sortBy}:**\n\n` +
    sorted.map((p, i) =>
      `${i + 1}. **${p.name}** (${p.sku})\n` +
      `   Category: ${p.category} | Revenue: $${p.totalRevenue.toFixed(2)} | ` +
      `Units: ${p.totalUnits} | Orders: ${p.orderCount}`
    ).join('\n\n')

  return { content: [{ type: 'text', text: summary }] }
})

// ==========================================
// RESOURCES
// ==========================================

// --- inventory://categories ---
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

    return {
      contents: [{
        uri: uri.href,
        text: error ? `Error: ${error.message}` : JSON.stringify(data, null, 2),
      }],
    }
  }
)

// --- inventory://stats ---
server.registerResource(
  'inventory-stats',
  'inventory://stats',
  {
    title: 'Inventory Statistics',
    description: 'Overall inventory statistics: totals, stock levels, category breakdown, and value',
    mimeType: 'application/json',
  },
  async (uri) => {
    const { data: products } = await supabase
      .from('products')
      .select('price, stock_quantity, is_active, category_id')

    if (!products) {
      return { contents: [{ uri: uri.href, text: '{"error": "Failed to fetch stats"}' }] }
    }

    const active = products.filter((p: any) => p.is_active)
    const totalValue = active.reduce((sum: number, p: any) => sum + (p.price * p.stock_quantity), 0)

    const { data: categories } = await supabase.from('products_with_categories').select('category')
    const categoryCount: Record<string, number> = {}
    categories?.forEach((p: any) => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })

    const stats = {
      total_products: products.length,
      active_products: active.length,
      total_inventory_value: `$${totalValue.toFixed(2)}`,
      low_stock_count: active.filter((p: any) => p.stock_quantity < 50).length,
      out_of_stock_count: active.filter((p: any) => p.stock_quantity === 0).length,
      products_by_category: categoryCount,
      average_price: `$${(active.reduce((s: number, p: any) => s + Number(p.price), 0) / active.length).toFixed(2)}`,
    }

    return { contents: [{ uri: uri.href, text: JSON.stringify(stats, null, 2) }] }
  }
)

// --- inventory://product/{id} ---
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

    const { data: product } = await supabase
      .from('products_with_categories')
      .select('*')
      .eq('id', productId)
      .single()

    if (!product) {
      return { contents: [{ uri: uri.href, text: `Product ${id} not found` }] }
    }

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

    return { contents: [{ uri: uri.href, text: JSON.stringify(detail, null, 2) }] }
  }
)

// ==========================================
// PROMPTS
// ==========================================

// --- inventory-report ---
server.registerPrompt(
  'inventory-report',
  {
    title: 'Generate Inventory Report',
    description: 'Generate a comprehensive inventory report with stock levels and alerts',
    argsSchema: {
      focus_area: z.enum(['full', 'low-stock', 'category-breakdown', 'high-value'])
        .optional()
        .describe('What aspect of inventory to focus on (default: full)'),
    },
  },
  ({ focus_area }) => {
    const instructions: Record<string, string> = {
      full: `Generate a comprehensive inventory report. Use the search_products tool to get all products,
and the inventory://stats resource for overall statistics. Include:
1. Executive summary (total products, total inventory value)
2. Category-by-category breakdown
3. Low stock alerts (items with stock < 50)
4. Price distribution analysis
5. Recommendations for restocking`,

      'low-stock': `Identify all products running low on stock.
Use search_products and focus on items with low stock quantities.
For each low-stock item, provide:
1. Product name, SKU, and current stock level
2. Recent sales velocity (use get_sales_summary)
3. Estimated days until stockout
4. Restocking urgency (critical / moderate / low)`,

      'category-breakdown': `Generate a detailed category-by-category inventory analysis.
Use the inventory://categories resource and search_products tool for each category.
For each category: product count, total value, average price, best/worst sellers.`,

      'high-value': `Analyze the highest-value items in inventory.
Use search_products for expensive items and get_sales_summary for performance.
For each: details, sales performance, revenue contribution, pricing recommendations.`,
    }

    return {
      messages: [{
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: instructions[focus_area || 'full'],
        },
      }],
    }
  }
)

// --- product-recommendation ---
server.registerPrompt(
  'product-recommendation',
  {
    title: 'Product Recommendations',
    description: 'Get AI-powered product recommendations based on sales data and inventory',
    argsSchema: {
      customer_interest: z.string().describe('What the customer is interested in'),
      budget: z.number().optional().describe('Maximum budget in dollars'),
    },
  },
  ({ customer_interest, budget }) => ({
    messages: [{
      role: 'user' as const,
      content: {
        type: 'text' as const,
        text: `A customer is interested in: "${customer_interest}".${budget ? ` Budget: $${budget}.` : ''}

Search our catalog using search_products and check sales data using get_sales_summary.
Provide:
1. Top 3-5 product recommendations with reasoning
2. Total cost if they bought all recommended items
3. Complementary products they might also want
4. Note any items low in stock that might sell out soon`,
      },
    }],
  })
)

// ==========================================
// HTTP ROUTING
// ==========================================
const app = new Hono()

app.all('*', async (c) => {
  const transport = new WebStandardStreamableHTTPServerTransport()
  await server.connect(transport)
  return transport.handleRequest(c.req.raw)
})

Deno.serve(app.fetch)
```

---

## Quick Reference: File Checklist

After completing this course, your project should have these files:

```
mcp-inventory/
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   └── mcp/
│   │       └── index.ts                         # MCP server (complete code above)
│   ├── migrations/
│   │   └── <timestamp>_create_inventory_schema.sql  # Schema migration
│   └── seed.sql                                  # Dummy data
```

## Quick Reference: Commands

```bash
# Setup
supabase init                        # Initialize project
supabase functions new mcp           # Create edge function
supabase start                       # Start local stack

# Development
supabase db reset                    # Apply migrations + seed data
supabase functions serve --no-verify-jwt mcp  # Serve locally

# Testing
npx @modelcontextprotocol/inspector  # Interactive MCP debugger

# Deployment
supabase link --project-ref <ref>    # Link to cloud project
supabase db push                     # Push schema to production
supabase functions deploy --no-verify-jwt mcp  # Deploy function
```

---

## Further Reading

- [Supabase MCP Deployment Guide](https://supabase.com/docs/guides/getting-started/byo-mcp) -- Official Supabase docs for deploying MCP servers on Edge Functions
- [Building an MCP Server with mcp-lite](https://supabase.com/docs/guides/functions/examples/mcp-server-mcp-lite) -- Alternative lightweight approach using the mcp-lite library
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) -- The official SDK with full API documentation
- [MCP Specification](https://modelcontextprotocol.io/) -- The full Model Context Protocol specification
- [Supabase Edge Functions Quickstart](https://supabase.com/docs/guides/functions/quickstart) -- Getting started with Supabase Edge Functions
- [MCP Server Documentation (SDK)](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md) -- Detailed server building guide with all transport options

---

[Back to Course Overview →](00-course-overview.md)
