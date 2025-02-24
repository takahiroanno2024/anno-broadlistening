'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import {LoadingBar} from '@/components/LoadingBar'

export const ChartCore = dynamic(async () => {
  const Plotly = await import('plotly.js/lib/core')
  const Scatter = await import('plotly.js/lib/scatter')
  const Sunburst = await import('plotly.js/lib/sunburst')
  const Treemap = await import('plotly.js/lib/treemap')
  const createPlotlyComponent = (await import('react-plotly.js/factory')).default
  Plotly.register([Scatter, Sunburst, Treemap])
  return createPlotlyComponent(Plotly)
}, { ssr: false, loading: () => <LoadingBar loaded={100} max={100} isVisualizing /> })
