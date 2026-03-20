# Step 6: SEO and Optimization

One-Line Summary: Use AI to generate meta descriptions, page titles, alt text, and blog post ideas, then set up Google Analytics and optimize page speed.

Prerequisites: Completed Step 5 with your site built and all content in place

---

## Why SEO Matters for a Portfolio

SEO is not just for blogs and e-commerce stores. When someone Googles "freelance UX writer in Chicago" or "brand designer for startups," your portfolio should show up. Good SEO also makes your site more shareable — proper meta descriptions and titles create clean previews on LinkedIn, Twitter, and Slack.

## Step 6a: Generate Page Titles and Meta Descriptions

Every page needs a unique title tag and meta description. Use this prompt:

```
Write SEO-optimized page titles and meta descriptions for my portfolio
website.

My name: [your name]
What I do: [your positioning statement from Step 2]
My location (if relevant): [city/region or "remote"]

Write a title tag (under 60 characters) and meta description (under 155
characters) for each of these pages:

1. Homepage
2. About page
3. Projects/work page
4. Contact page

Guidelines:
- Include my name and primary skill in the homepage title
- Make descriptions compelling enough to click, not just descriptive
- Include location if I serve local clients
- Avoid keyword stuffing — write for humans first
```

**Example output:**

> **Homepage**
> Title: Jordan Lee | UX Writer for B2B SaaS
> Description: I help SaaS companies reduce support tickets with clearer in-app copy. See my work and results.
>
> **Projects page**
> Title: UX Writing Case Studies | Jordan Lee
> Description: Real projects, real results. See how clearer copy improved conversions, reduced support tickets, and simplified onboarding.

Add these in your site builder's SEO settings for each page.

## Step 6b: Write Alt Text for All Images

Alt text helps search engines understand your images and makes your site accessible to screen reader users. Generate alt text with AI:

```
Write alt text for the following images on my portfolio website.
Keep each under 125 characters. Be descriptive and specific, not generic.

1. My headshot photo — [describe what you're wearing, background, expression]
2. Project screenshot 1 — [describe what the screenshot shows]
3. Project screenshot 2 — [describe what it shows]
4. Hero section background — [describe the image]
[Add more as needed]

Bad example: "Image of a website"
Good example: "Dashboard showing onboarding flow with rewritten copy and progress indicators"
```

Go through every image on your site and add the alt text in your builder. Most builders have an "alt text" field when you click on an image.

## Step 6c: Generate Blog Post Ideas

A few blog posts dramatically boost your SEO by giving search engines more content to index. You do not need to write them all today — just plan them:

```
Suggest 5 blog post ideas for my portfolio website that would attract
my target audience through search.

My expertise: [what you do]
My audience: [who you serve]

For each post idea, provide:
1. A title optimized for search (include keywords people actually Google)
2. A one-line summary of what the post covers
3. The target keyword phrase
4. Estimated word count

Focus on practical, how-to content that demonstrates my expertise.
Avoid thought leadership fluff.
```

**Example output:**

> **Post 1:** "How to Write Onboarding Emails That Actually Get Opened"
> Summary: Step-by-step guide to writing SaaS onboarding email sequences.
> Target keyword: "onboarding email best practices"
> Word count: 1,200-1,500

Save this list. Even publishing one post per quarter helps your SEO significantly.

## Step 6d: Set Up Google Analytics

Track who visits your site and where they come from:

1. Go to analytics.google.com and sign in with your Google account
2. Click "Start measuring" and create a new property
3. Enter your website name and URL
4. Copy the Measurement ID (starts with "G-")
5. In your site builder, find the analytics or integrations section
6. Paste the Measurement ID

**On Framer:** Go to Site Settings > General > scroll to "Analytics" and paste the ID

**On Webflow:** Go to Project Settings > Integrations > Google Analytics

**On Carrd:** Go to Settings > Head/Body tags and add the Google Analytics script

After setup, give it 24-48 hours to start collecting data. Check back weekly to see which pages get the most traffic and where visitors come from.

## Step 6e: Optimize Page Speed

Slow sites lose visitors and rank lower in search results. Check your speed:

1. Go to pagespeed.web.dev
2. Enter your site URL
3. Run the test for both mobile and desktop
4. Aim for a score above 80 on both

**Common fixes if your score is low:**

| Issue | Fix |
|-------|-----|
| Large images | Compress with TinyPNG or convert to WebP format |
| Too many fonts | Limit to 2 font families, 2-3 weights each |
| Heavy animations | Remove or simplify — subtle is better |
| Unoptimized video | Use a thumbnail with a play button instead of autoplay |
| Third-party scripts | Remove any widgets or embeds you do not actually need |

## Step 6f: Submit Your Sitemap

Help search engines find your pages:

1. Most builders auto-generate a sitemap at yoursite.com/sitemap.xml
2. Go to search.google.com/search-console
3. Add your property (website)
4. Go to Sitemaps in the left menu
5. Submit your sitemap URL

This tells Google to crawl and index your pages. It typically takes a few days to a few weeks to start appearing in search results.

## SEO Checklist

Before moving on, confirm:

- [ ] Page titles and meta descriptions set for every page
- [ ] Alt text added to every image
- [ ] Blog post ideas saved for future content
- [ ] Google Analytics installed and tracking
- [ ] Page speed score above 80
- [ ] Sitemap submitted to Google Search Console

---

[Next: Step 7 - Launch and Maintain →](07-launch-and-maintain.md)
