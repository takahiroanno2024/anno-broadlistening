'use client'

import {Report} from '@/components/Report'
import {Analysis} from '@/components/Analysis'
import {useEffect, useState} from 'react'
import {Box, HStack, Progress} from '@chakra-ui/react'
import {Skeleton, SkeletonText} from '@/components/ui/skeleton'
import {About} from '@/components/About'
import {Meta} from '@/type'

type Props = {
  resultSize: number
  meta: Meta | null
}

export function ClientContainer({resultSize, meta}: Props) {
  const [result, setResult] = useState()
  const [loadedSize, setLoadedSize] = useState(0)

  useEffect(() => {
    fetchReport()
  }, [])

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
      setResult(JSON.parse(result))
    }
  }

  if (!result) {
    return (
      <Box mx={'auto'} maxW={'800px'} p={5}>
        <Progress.Root
          value={loadedSize}
          max={resultSize}
          colorPalette={'cyan'}
          size={'xl'}
          mb={10}
        >
          <HStack gap="5">
            <Progress.Track flex="1">
              <Progress.Range />
            </Progress.Track>
            <Progress.ValueText>{Math.floor(loadedSize / 1024).toLocaleString()} KB / {Math.floor(resultSize / 1024).toLocaleString()} KB</Progress.ValueText>
          </HStack>
        </Progress.Root>
        <Skeleton height="50px" mb={5} />
        <SkeletonText noOfLines={4} gap="4" />
        <Skeleton height="400px" mt={10} />
      </Box>
    )
  }
  return (
    <>
      <Report result={result} />
      <Analysis result={result} />
      {result && meta && (<About meta={meta} />)}
    </>
  )
}
