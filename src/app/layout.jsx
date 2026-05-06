/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './docs.css'
import MaintenanceOverlay from '../components/maintenance-overlay'

export const metadata = {
  metadataBase: new URL('https://docs.welshstreet.com/'),
  title: {
    template: '%s | Welsh Street Docs',
    default: 'Welsh Street Documentation'
  },
  description: 'Complete documentation for Welsh Street and the Meme Rewards Protocol - a Bitcoin-anchored DeFi system on Stacks.',
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
        url: '/credit.png',
        width: 420,
        height: 420,
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
    images: ['/credit.png'],
  },
}

// Toggle this to enable/disable maintenance mode
const MAINTENANCE_MODE = false

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <div>
          <b>Welsh</b>{' '}
          <span style={{ opacity: '60%' }}>Street</span>
        </div>
      }
      logoLink="https://docs.welshstreet.com/"  // Custom logo link
      // chatLink="https://discord.gg/zWzvtVrPeJ"
      chatLink={false} 
      projectLink={false}  // Hide project link
    />
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className="dark">
      <Head faviconGlyph="✦" />
      <body suppressHydrationWarning={true}>
        {MAINTENANCE_MODE && <MaintenanceOverlay />}
        <Layout
          // banner={
          //   <Banner storageKey="genesisEventBanner" className="banner-outer">
          //     <div className="banner-inner">
          //       <a href="https://events.welshtest.net/genesis" target="_blank" rel="noopener">
          //         🔥 Genesis is Live - Contribute to the LGE Now 🔥
          //       </a>
          //     </div>
          //   </Banner>
          // }
          banner={null}
          copyPageButton={true}
          docsRepositoryBase="https://github.com/welshstreet/docs/tree/main"
          editLink="View on GitHub"
          feedback={{ content:"Contribute" }}
          footer={<Footer className="custom-footer">
              <a href="https://x.com/enjoywithouthey" target="_blank" rel="noopener" className="footer-link">Made with 🧡 by @enjoywithouthey</a>
            </Footer>}
          navbar={navbar}
          pageMap={pageMap}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          darkMode={false}
          nextThemes={{
            defaultTheme: 'dark',
            forcedTheme: 'dark',
            storageKey: 'theme'
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
