# Setting Up Twitter Cards for Nextra Docs

Twitter cards are meta tags that control how your links appear when shared on Twitter/X and other social platforms. This guide shows how to configure them for your Nextra documentation site.

## Overview

You'll configure Twitter cards using Next.js metadata API in two locations:
1. **Root Layout** ([src/app/layout.jsx](src/app/layout.jsx)) - Global defaults
2. **Dynamic Routes** ([src/app/docs/[[...mdxPath]]/page.jsx](src/app/docs/[[...mdxPath]]/page.jsx)) - Page-specific metadata

## Step 1: Create Twitter Card Image

**Location:** `public/twitter-card.png` (or `.jpg`)

**Requirements:**
- Recommended size: 1200x630 pixels (2:1 ratio)
- Format: PNG or JPG
- Maximum file size: 5MB
- Card type: `summary_large_image`

**To-Do:**
- [ ] Create or design a Twitter card image
- [ ] Save to `public/twitter-card.png`
- [ ] Verify image displays correctly

## Step 2: Update Root Layout Metadata

**File:** [src/app/layout.jsx](src/app/layout.jsx)

Update the `metadata` export to include Twitter and OpenGraph configuration:

```javascript
export const metadata = {
  metadataBase: new URL('https://docs.welshstreet.com/'),
  title: {
    template: '%s | Welsh Street Docs',
    default: 'Welsh Street Documentation'
  },
  description: 'Complete documentation for the Welsh Street protocol - a Bitcoin-anchored DeFi system on Stacks.',
  applicationName: 'Welsh Street',
  
  // OpenGraph (Facebook, LinkedIn, Discord)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.welshstreet.com/',
    siteName: 'Welsh Street Documentation',
    title: 'Welsh Street Documentation',
    description: 'Complete documentation for the Welsh Street protocol - a Bitcoin-anchored DeFi system on Stacks.',
    images: [
      {
        url: '/twitter-card.png',
        width: 1200,
        height: 630,
        alt: 'Welsh Street Documentation',
      }
    ],
  },
  
  // Twitter/X Cards
  twitter: {
    card: 'summary_large_image',
    site: '@welshstreet',
    creator: '@welshstreet',
    title: 'Welsh Street Documentation',
    description: 'Complete documentation for the Welsh Street protocol - a Bitcoin-anchored DeFi system on Stacks.',
    images: ['/twitter-card.png'],
  },
}
```

**To-Do:**
- [ ] Update metadata export in layout.jsx
- [ ] Verify metadataBase URL is correct
- [ ] Customize title and description
- [ ] Update Twitter handle

## Step 3: Add Dynamic Metadata for Individual Pages

**File:** [src/app/docs/[[...mdxPath]]/page.jsx](src/app/docs/[[...mdxPath]]/page.jsx)

Add a `generateMetadata` function to customize metadata per page:

```javascript
import { importPage } from 'nextra/pages'

export async function generateMetadata(props) {
  const { mdxPath } = await props.params
  const { metadata } = await importPage(mdxPath)
  
  const title = metadata.title || 'Welsh Street Documentation'
  const description = metadata.description || 'Complete documentation for the Welsh Street protocol'
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: ['/twitter-card.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-card.png'],
    },
  }
}
```

**To-Do:**
- [ ] Add generateMetadata function
- [ ] Test with different pages
- [ ] Verify frontmatter metadata is used

## Step 4: Add Frontmatter to MDX Pages (Optional)

**File:** Any `.mdx` file (e.g., [src/content/introduction.mdx](src/content/introduction.mdx))

Add custom title/description via frontmatter:

```mdx
---
title: "Introduction to Welsh Street"
description: "Learn about the Welsh Street protocol and its Bitcoin-anchored architecture"
---

# Introduction

Your content here...
```

**To-Do:**
- [ ] Add frontmatter to key pages
- [ ] Verify custom metadata displays correctly

## Step 5: Test and Validate

### Testing Locally

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **View page source:**
   - Open `http://localhost:3000`
   - Right-click → "View Page Source"
   - Search for `<meta property="og:` and `<meta name="twitter:`

3. **Expected tags:**
   ```html
   <meta property="og:title" content="Welsh Street Documentation" />
   <meta property="og:description" content="Complete documentation..." />
   <meta property="og:image" content="https://docs.welshstreet.com/twitter-card.png" />
   <meta property="og:type" content="website" />
   
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:site" content="@welshstreet" />
   <meta name="twitter:title" content="Welsh Street Documentation" />
   <meta name="twitter:description" content="Complete documentation..." />
   <meta name="twitter:image" content="https://docs.welshstreet.com/twitter-card.png" />
   ```

### Testing in Production

**Twitter Card Validator:**
- URL: https://cards-dev.twitter.com/validator
- Enter your production URL
- Click "Preview card"
- Verify image and text display correctly

**Facebook Debugger:**
- URL: https://developers.facebook.com/tools/debug/
- Test OpenGraph tags
- Clear cache if needed

**LinkedIn Post Inspector:**
- URL: https://www.linkedin.com/post-inspector/
- Validate LinkedIn shares

**To-Do:**
- [ ] Deploy to production
- [ ] Test with Twitter Card Validator
- [ ] Test with Facebook Debugger
- [ ] Share link on Twitter/X to verify

## Step 6: Create Page-Specific Images (Advanced)

For unique images per page, you can:

1. **Static images per section:**
   ```javascript
   // In generateMetadata
   const imageMap = {
     'introduction': '/images/og-introduction.png',
     'tokenomics': '/images/og-tokenomics.png',
     // ...
   }
   const ogImage = imageMap[mdxPath[0]] || '/twitter-card.png'
   ```

2. **Dynamic OG image generation:**
   - Use [@vercel/og](https://vercel.com/docs/functions/og-image-generation)
   - Create route at `app/api/og/route.jsx`
   - Generate images on-the-fly

**To-Do (Optional):**
- [ ] Create section-specific images
- [ ] Implement dynamic OG image generation

## Checklist Summary

- [ ] Create Twitter card image (1200x630, saved to `public/`)
- [ ] Update root layout metadata with Twitter/OG config
- [ ] Add generateMetadata to dynamic route
- [ ] Add frontmatter to key MDX pages
- [ ] Test locally (view source)
- [ ] Deploy to production
- [ ] Validate with Twitter Card Validator
- [ ] Share test link on social media

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Twitter Card Documentation](https://developer.x.com/en/docs/twitter-for-websites/cards/overview/markup)
- [OpenGraph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Nextra Head Component](https://nextra.site/docs/built-ins/head)

## Common Issues

**Image not showing:**
- Verify image path is correct
- Check image size (max 5MB)
- Ensure metadataBase is set correctly
- Clear Twitter cache using validator

**Wrong metadata:**
- Check page frontmatter
- Verify generateMetadata implementation
- Inspect HTML source for meta tags
- Clear social platform cache

**Cache issues:**
- Use validators to force refresh
- Twitter caches for ~7 days
- Add `?v=1` parameter to URL for testing
