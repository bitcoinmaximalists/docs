import nextra from 'nextra'

// Enhanced localStorage polyfill for server-side rendering
if (typeof window === 'undefined') {
  // Polyfill for Node.js environment
  const localStoragePolyfill = {
    getItem: (key) => null,
    setItem: (key, value) => {},
    removeItem: (key) => {},
    clear: () => {},
    key: (index) => null,
    length: 0
  };

  // Apply to multiple global contexts
  if (typeof global !== 'undefined') {
    global.localStorage = localStoragePolyfill;
  }
  
  if (typeof globalThis !== 'undefined') {
    globalThis.localStorage = localStoragePolyfill;
  }
}

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  },
  contentDirBasePath: '/docs'
})

export default withNextra({
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Additional server-side polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        localStorage: false
      }
    }
    return config
  }
})
