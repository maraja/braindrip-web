# Module 8: Adding Prompts (Reusable Templates)

[← Adding Resources](07-adding-resources.md) | [Next: Local Development and Testing →](09-local-development-and-testing.md)

---

Prompts are pre-written templates that help users interact with your MCP server consistently. They appear in MCP clients as selectable actions (e.g., in Claude Desktop's "/" menu).

## Prompt 1: Inventory Report

```typescript
// ------------------------------------------
// PROMPT: inventory-report
// ------------------------------------------
server.registerPrompt(
  'inventory-report',
  {
    title: 'Generate Inventory Report',
    description: 'Generate a comprehensive inventory report with stock levels, ' +
      'low-stock alerts, and category breakdown',
    argsSchema: {
      focus_area: z.enum(['full', 'low-stock', 'category-breakdown', 'high-value'])
        .optional()
        .describe('What aspect of inventory to focus on (default: full)'),
    },
  },
  ({ focus_area }) => {
    const area = focus_area || 'full'
    let instructions = ''

    switch (area) {
      case 'full':
        instructions = `Please generate a comprehensive inventory report. Use the search_products tool to get all products,
and the inventory://stats resource for overall statistics. Include:
1. Executive summary (total products, total inventory value)
2. Category-by-category breakdown
3. Low stock alerts (items with stock < 50)
4. Price distribution analysis
5. Recommendations for restocking`
        break
      case 'low-stock':
        instructions = `Please identify all products that are running low on stock.
Use the search_products tool and focus on items with low stock quantities.
For each low-stock item, provide:
1. Product name, SKU, and current stock level
2. Recent sales velocity (use get_sales_summary)
3. Estimated days until stockout
4. Restocking urgency (critical / moderate / low)
5. Recommended restock quantity`
        break
      case 'category-breakdown':
        instructions = `Please generate a detailed category-by-category inventory analysis.
Use the inventory://categories resource and search_products tool for each category.
For each category, provide:
1. Number of products
2. Total inventory value
3. Average price point
4. Best and worst sellers
5. Stock health assessment`
        break
      case 'high-value':
        instructions = `Please analyze the highest-value items in our inventory.
Use search_products to find the most expensive items, and get_sales_summary for their performance.
For each high-value item:
1. Product details and current stock
2. Sales performance and revenue contribution
3. Stock-to-sales ratio
4. Pricing recommendations`
        break
    }

    return {
      messages: [{
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: instructions,
        },
      }],
    }
  }
)
```

## Prompt 2: Product Recommendations

```typescript
// ------------------------------------------
// PROMPT: product-recommendation
// ------------------------------------------
server.registerPrompt(
  'product-recommendation',
  {
    title: 'Product Recommendations',
    description: 'Get AI-powered product recommendations based on sales data and inventory',
    argsSchema: {
      customer_interest: z.string().describe('What the customer is interested in (e.g., "home office setup", "fitness gear")'),
      budget: z.number().optional().describe('Maximum budget in dollars'),
    },
  },
  ({ customer_interest, budget }) => {
    const budgetNote = budget ? ` The customer's budget is $${budget}.` : ''

    return {
      messages: [{
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `A customer is interested in: "${customer_interest}".${budgetNote}

Please search our product catalog using the search_products tool to find relevant items.
Also check our sales data using get_sales_summary to identify popular items in relevant categories.

Provide:
1. Top 3-5 product recommendations with reasoning
2. Total cost if they bought all recommended items
3. Any complementary products they might also want
4. Note any items that are low in stock and might sell out soon`,
        },
      }],
    }
  }
)
```

---

[Next: Module 9 - Local Development and Testing →](09-local-development-and-testing.md)
