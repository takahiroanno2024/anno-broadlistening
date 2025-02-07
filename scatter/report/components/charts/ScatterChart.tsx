import React from 'react'
import { ChartCore } from './ChartCore'
import {Argument, Cluster} from '@/type'

type Props = {
  clusterList: Cluster[]
  argumentList: Argument[]
  rootLevel: number
}

export function ScatterChart({clusterList, argumentList, rootLevel}: Props) {
  const targetClusters = clusterList.filter((cluster) => cluster.level === rootLevel + 1)
  const softColors = ['#8fbf6a', '#e89bbd', '#a3c4e5', '#f3d07a', '#5a9bb0']
  const clusterColorMap = targetClusters.reduce((acc, cluster, index) => {
    acc[cluster.id] = softColors[index % softColors.length]
    return acc
  }, {} as Record<string, string>)

  // クラスタごとのデータを構築
  const clusterData = targetClusters.map((cluster) => {
    const clusterArguments = argumentList.filter((arg) => arg.cluster_ids.includes(cluster.id))
    const xValues = clusterArguments.map((arg) => arg.x)
    const yValues = clusterArguments.map((arg) => arg.y)
    const texts = clusterArguments.map((arg) => `<b>${cluster.label}</b><br>${arg.argument}`)

    // クラスタ中心の座標を計算
    const centerX = xValues.reduce((sum, val) => sum + val, 0) / xValues.length
    const centerY = yValues.reduce((sum, val) => sum + val, 0) / yValues.length

    return {
      cluster,
      xValues,
      yValues,
      texts,
      centerX,
      centerY,
    }
  })

  return (
    <ChartCore
      data={clusterData.map((data) => ({
        x: data.xValues,
        y: data.yValues,
        mode: 'markers',
        marker: {
          size: 7,
          color: clusterColorMap[data.cluster.id],
        },
        type: 'scatter',
        text: data.texts,
        hoverinfo: 'text',
        hoverlabel: {
          align: 'left',
          bgcolor: 'white',
          bordercolor: clusterColorMap[data.cluster.id],
          font: {
            size: 12,
            color: '#333',
          },
        },
      }))}
      layout={{
        margin: { l: 0, r: 0, b: 0, t: 0 },
        xaxis: {
          zeroline: false,
          showticklabels: false
        },
        yaxis: {
          zeroline: false,
          showticklabels: false
        },
        hovermode: 'closest',
        annotations: clusterData.map((data) => ({
          x: data.centerX,
          y: data.centerY,
          text: data.cluster.label,
          showarrow: false,
          font: {
            color: clusterColorMap[data.cluster.id],
            size: 14,
            weight: 700,
          },
          bgcolor: 'white',
          opacity: 0.8,
        })),
        showlegend: false,
      }}
      useResizeHandler={true}
      style={{width: '100%', height: '100%'}}
      config={{
        responsive: true,
        displayModeBar: false,
      }}
    />
  )
}
