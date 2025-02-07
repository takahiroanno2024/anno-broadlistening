'use client'

import {Chart} from '@/components/Chart'
import {Analysis} from '@/components/Analysis'
import React, {PropsWithChildren, useEffect, useState} from 'react'
import {Skeleton} from '@/components/ui/skeleton'
import {About} from '@/components/About'
import {Cluster, Meta, Result} from '@/type'
import {LoadingBar} from '@/components/LoadingBar'
import {FilterSettingDialog} from '@/components/FilterSettingDialog'

type Props = {
  resultSize: number
  meta: Meta | null
}

// NOTE これはなにか？
// hierarchical_result.json はサイズの大きいJSONファイルである
// 全て事前レンダリングしてしまうと html ファイルが巨大になるので初期表示が重くなってしまう
// そのためJSONファイルはクライアント側で fetch して Chart と Analysis に渡している
// それ以外のコンポーネント群は事前レンダリングしたほうが高速なので親要素から受け取っている
// 最終的にページが完成する速度は大差ないが、先に出せるものを出すことで、体感として高速に感じるようにしている

export function ClientContainer({resultSize, meta, children}: PropsWithChildren<Props>) {
  const [loadedSize, setLoadedSize] = useState(0)
  const [result, setResult] = useState<Result>()
  const [filteredResult, setFilteredResult] = useState<Result>()
  const [openFilterSetting, setOpenFilterSetting] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [])

  function onChangeFilter() {

  }

  async function fetchReport() {
    const response = await fetch('./hierarchical_result.json')
    const reader = response.body?.getReader()
    let loaded = 0
    if (reader) {
      const chunks: Uint8Array[] = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        loaded += value.length
        setLoadedSize(loaded)
      }
      const concatenatedChunks = new Uint8Array(loaded)
      let position = 0
      for (const chunk of chunks) {
        concatenatedChunks.set(chunk, position)
        position += chunk.length
      }
      const result = new TextDecoder('utf-8').decode(concatenatedChunks)
      const r = JSON.parse(result)
      setResult(r)
      setFilteredResult(r)
    }
  }

  if (!result || !filteredResult) {
    return (
      <>
        <LoadingBar loaded={loadedSize} max={resultSize} />
        <Skeleton height="516px" mb={5} mx={'auto'} w={'100%'} maxW={'1200px'} />
        { children }
        <LoadingBar loaded={loadedSize} max={resultSize} />
      </>
    )
  }
  return (
    <>
      <FilterSettingDialog
        result={result}
        isOpen={openFilterSetting}
        onClose={() => {setOpenFilterSetting(false)}}
        onChangeFilter={() => {alert('hello')}}
      />
      <Chart
        result={filteredResult}
        onClickSettingAction={() => {setOpenFilterSetting(true)}}
      />
      { children }
      <Analysis result={result} />
      {result && meta && (<About meta={meta} />)}
    </>
  )
}

// function getFilteredClusters(clusters: Cluster[], level1Id: string, targetLevel: number): Cluster[] {
//   if (targetLevel === 1) {
//     return clusters.filter(cluster => cluster.level === 1)
//   }
//   let currentLevelClusters = clusters.filter(cluster => cluster.level === 1 && cluster.id === level1Id)
//   for (let level = 2; level <= targetLevel; level++) {
//     const parentIds = currentLevelClusters.map(cluster => cluster.id)
//     currentLevelClusters = clusters.filter(cluster => cluster.level === level && parentIds.includes(cluster.parent))
//   }
//   return currentLevelClusters
// }
