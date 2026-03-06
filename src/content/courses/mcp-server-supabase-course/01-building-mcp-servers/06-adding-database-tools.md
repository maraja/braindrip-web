# Module 6: Adding Database Tools (CRUD Operations)

[← Building Your First MCP Server](05-building-your-first-mcp-server.md) | [Next: Adding Resources →](07-adding-resources.md)

---

Tools are the most powerful MCP primitive -- they let the AI agent **take actions**. Each tool has a name, a description (which the AI reads to decide when to use it), an input schema (validated with Zod), and a handler function.

## Tool 1: Search Products

Add this after the "Register Tools" comment in `index.ts`:

```typescript
// ------------------------------------------
// TOOL: search_products
// ------------------------------------------
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

  // Apply filters
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

  dbQuery = dbQuery.eq('is_active', true)
  dbQuery = dbQuery.order('name')
  dbQuery = dbQuery.limit(limit ?? 20)

  const { data, error } = await dbQuery

  if (error) {
    return {
      content: [{ type: 'text', text: `Error searching products: ${error.message}` }],
      isError: true,
    }
  }

  if (!data || data.length === 0) {
    return {
      content: [{ type: 'text', text: 'No products found matching your criteria.' }],
    }
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
```

**Key design decisions:**
- The `description` is written for the AI agent -- it explains *when* to use the tool
- All filters are optional, so the tool works for broad searches ("show me all products") and narrow ones ("electronics under $50")
- We return both a formatted summary (for readability) and raw JSON (for precision)
- We use the `products_with_categories` view so category names are included

## Tool 2: Create Product

```typescript
// ------------------------------------------
// TOOL: create_product
// ------------------------------------------
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
  // Look up the category ID
  const { data: cat, error: catError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', category)
    .single()

  if (catError || !cat) {
    // Fetch available categories to help the user
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
```

## Tool 3: Update Product

```typescript
// ------------------------------------------
// TOOL: update_product
// ------------------------------------------
server.registerTool('update_product', {
  title: 'Update Product',
  description:
    'Update an existing product\'s details. You can update any combination of fields: ' +
    'name, description, price, stock quantity, or active status. ' +
    'Identify the product by its ID or SKU. Use this when users want to change product ' +
    'information, adjust prices, update stock levels, or deactivate products.',
  inputSchema: {
    id: z.number().optional().describe('Product ID (use either id or sku to identify the product)'),
    sku: z.string().optional().describe('Product SKU (use either id or sku to identify the product)'),
    name: z.string().optional().describe('New product name'),
    description: z.string().optional().describe('New product description'),
    price: z.number().positive().optional().describe('New price'),
    stock_quantity: z.number().int().nonnegative().optional().describe('New stock quantity'),
    is_active: z.boolean().optional().describe('Set to false to deactivate the product'),
  },
}, async ({ id, sku, name, description, price, stock_quantity, is_active }) => {
  if (!id && !sku) {
    return {
      content: [{ type: 'text', text: 'Please provide either a product ID or SKU to identify which product to update.' }],
      isError: true,
    }
  }

  // Build the update object with only provided fields
  const updates: Record<string, any> = {}
  if (name !== undefined) updates.name = name
  if (description !== undefined) updates.description = description
  if (price !== undefined) updates.price = price
  if (stock_quantity !== undefined) updates.stock_quantity = stock_quantity
  if (is_active !== undefined) updates.is_active = is_active

  if (Object.keys(updates).length === 0) {
    return {
      content: [{ type: 'text', text: 'No fields to update. Please provide at least one field to change.' }],
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
```

## Tool 4: Delete Product

```typescript
// ------------------------------------------
// TOOL: delete_product
// ------------------------------------------
server.registerTool('delete_product', {
  title: 'Delete Product',
  description:
    'Permanently delete a product from the catalog. This also deletes all associated ' +
    'sales records. Use with caution. Consider using update_product to deactivate instead. ' +
    'Identify the product by its ID or SKU.',
  annotations: {
    destructiveHint: true,
  },
  inputSchema: {
    id: z.number().optional().describe('Product ID'),
    sku: z.string().optional().describe('Product SKU'),
    confirm: z.boolean().describe('Must be set to true to confirm deletion'),
  },
}, async ({ id, sku, confirm }) => {
  if (!confirm) {
    return {
      content: [{
        type: 'text',
        text: 'Deletion not confirmed. Set confirm=true to proceed. ' +
          'Note: this permanently deletes the product and all its sales history. ' +
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

  // First, fetch the product to confirm what we are deleting
  let fetchQuery = supabase.from('products').select('id, name, sku')
  if (id) {
    fetchQuery = fetchQuery.eq('id', id)
  } else {
    fetchQuery = fetchQuery.eq('sku', sku!)
  }
  const { data: product, error: fetchError } = await fetchQuery.single()

  if (fetchError || !product) {
    return {
      content: [{ type: 'text', text: `Product not found.` }],
      isError: true,
    }
  }

  // Delete the product (cascades to sales)
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
        `All associated sales records have also been removed.`,
    }],
  }
})
```

## Tool 5: Sales Summary

```typescript
// ------------------------------------------
// TOOL: get_sales_summary
// ------------------------------------------
server.registerTool('get_sales_summary', {
  title: 'Get Sales Summary',
  description:
    'Get a sales summary showing revenue, units sold, and order counts. ' +
    'Can be filtered by time period and optionally by category. ' +
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

  // Query sales with product and category info
  let query = supabase
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

  const { data: sales, error } = await query

  if (error) {
    return {
      content: [{ type: 'text', text: `Error fetching sales: ${error.message}` }],
      isError: true,
    }
  }

  if (!sales || sales.length === 0) {
    return {
      content: [{ type: 'text', text: `No sales found in the last ${periodDays} days.` }],
    }
  }

  // Aggregate by product
  const productSales = new Map<number, {
    name: string
    sku: string
    category: string
    totalRevenue: number
    totalUnits: number
    orderCount: number
  }>()

  for (const sale of sales) {
    const product = sale.products as any
    const productId = product.id
    const catName = product.categories?.name || 'Uncategorized'

    if (category && catName.toLowerCase() !== category.toLowerCase()) continue

    const existing = productSales.get(productId) || {
      name: product.name,
      sku: product.sku,
      category: catName,
      totalRevenue: 0,
      totalUnits: 0,
      orderCount: 0,
    }

    existing.totalRevenue += Number(sale.total_revenue)
    existing.totalUnits += sale.quantity
    existing.orderCount += 1
    productSales.set(productId, existing)
  }

  // Sort and limit
  const sorted = [...productSales.values()].sort((a, b) => {
    if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue
    if (sortBy === 'units') return b.totalUnits - a.totalUnits
    return b.orderCount - a.orderCount
  }).slice(0, maxResults)

  // Calculate totals
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

  return {
    content: [{ type: 'text', text: summary }],
  }
})
```

---

[Next: Module 7 - Adding Resources (Read-Only Data Exposure) →](07-adding-resources.md)
