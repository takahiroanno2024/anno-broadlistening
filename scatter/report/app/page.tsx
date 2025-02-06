import fs from 'fs'
import type {Metadata} from 'next'
import {Meta, Result} from '@/type'
import {ClientContainer} from '@/components/ClientContainer'
import {Header} from '@/components/Header'
import {Overview} from '@/components/Overview'
import {Footer} from '@/components/Footer'
import {ClusterOverview} from '@/components/ClusterOverview'

const file = fs.readFileSync('./public/hierarchical_result.json', 'utf8')
const resultSize = Buffer.byteLength(file, 'utf8')
const result: Result = JSON.parse(file)

let meta: Meta | null = null
const metaFilePath = './public/metadata.json'
if (fs.existsSync(metaFilePath)) {
  const metaFile = fs.readFileSync(metaFilePath, 'utf8')
  meta = JSON.parse(metaFile)
}

export const metadata: Metadata = {
  title: `${result.config.question} - ${meta?.reporterName} デジタル民主主義2030 ブロードリスニング`,
  description: `${result.overview}`,
  icons: {
    icon: '/icon.png',
  },
}

export default function Page() {
  return (
    <>
      <div className={'container'}>
        <Header meta={meta} />
        <Overview result={result} />
        <ClientContainer resultSize={resultSize} meta={meta}>
          {result.clusters.filter(c => c.level === 1).map(c => (
            <ClusterOverview key={c.id} cluster={c} />
          ))}
        </ClientContainer>
      </div>
      <Footer meta={meta} />
    </>
  )
}
