import fs from 'fs'
import type {Metadata} from 'next'
import {Box, Heading, Icon, Text} from '@chakra-ui/react'
import {MessageSquareIcon} from 'lucide-react'
import {Meta, Result} from '@/type'
import {ClientContainer} from '@/components/ClientContainer'
import {Header} from '@/components/Header'

const file = fs.readFileSync(`../pipeline/outputs/${process.env.REPORT}/hierarchical_result.json`, 'utf8')
const resultSize = Buffer.byteLength(file, 'utf8')
const result: Result = JSON.parse(file)

let meta: Meta | null = null
const metaFilePath = `../pipeline/outputs/${process.env.REPORT}/metadata.json`
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
        <Box mx={'auto'} maxW={'750px'} mb={5}>
          <Heading textAlign={'center'} fontSize={'xl'} mb={5}>Report</Heading>
          <Heading as={'h2'} size={'4xl'} mb={5} className={'headingColor'}>{result.config.question}</Heading>
          <p>{result.overview}</p>
        </Box>
        <ClientContainer resultSize={resultSize} meta={meta}>
          {result.clusters.filter(c => c.level === 1).map(c => (
            <Box key={c.id} mx={'auto'} maxW={'750px'} my={12}>
              <Box mb={2}>
                <Heading fontSize={'2xl'} className={'headingColor'} mb={1}>{c.label}</Heading>
                <Text fontWeight={'bold'}><Icon mr={1}><MessageSquareIcon size={20} /></Icon>{c.value}コメント</Text>
              </Box>
              <Text>{c.takeaway}</Text>
            </Box>
          ))}
        </ClientContainer>
      </div>
      <footer>
        {meta && (<Text fontWeight={'bold'}>{meta.reporterName}</Text>)}
        <Text>デジタル民主主義2030 ブロードリスニング</Text>
      </footer>
    </>
  )
}
