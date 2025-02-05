import type { NextConfig } from 'next'
import fs from 'fs'
import path from 'path'

const report = process.env.REPORT
if (!report) {
  console.log('\n┌──────────────────────────────────────────┐')
  console.log('│                                          │')
  console.log('│        [ Broadlistening Report ]         │')
  console.log('│                                          │')
  console.log('│   ERROR: Please set process.env.REPORT   │')
  console.log('│     (`REPORT=example npm run build`)     │')
  console.log('│                                          │')
  console.log('└──────────────────────────────────────────┘\n')
  throw new Error('REPORT environment variable is not defined.')
}

let nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  images: {
    unoptimized: true
  },
  env: { REPORT: report },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const filesToCopy = ['hierarchical_result.json', 'metadata.json', 'reporter.png']
      filesToCopy.forEach(file => {
        const sourcePath = path.resolve(`../pipeline/outputs/${process.env.REPORT}/${file}`)
        const destinationPath = path.resolve(`./public/${file}`)
        if (fs.existsSync(sourcePath)) {
          console.log(` ✓ Copied ${file}`)
          fs.copyFileSync(sourcePath, destinationPath)
        }
      })
    }
    return config
  }
}

if (process.env.NODE_ENV === 'production') {
  nextConfig = {
    ...nextConfig,
    output: 'export',
    distDir: `../pipeline/outputs/${report}/report`,
    assetPrefix: './',
  }
}

export default nextConfig
