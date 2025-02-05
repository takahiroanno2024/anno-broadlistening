import fs from 'fs'
import type {Metadata} from 'next'
import {Heading, HStack, Image, Text} from '@chakra-ui/react'
import {XIcon} from 'lucide-react'
import {BroadlisteningGuide} from '@/components/BroadlisteningGuide'
import {Meta} from '@/type'
import {ClientContainer} from '@/components/ClientContainer'

const file = fs.readFileSync(`../pipeline/outputs/${process.env.REPORT}/hierarchical_result.json`, 'utf8')
const resultSize = Buffer.byteLength(file, 'utf8')
const result = JSON.parse(file)

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
        <HStack justify="space-between" mb={8}>
          <HStack>
            {meta && (
              <>
                <Image
                  src={'/reporter.png'}
                  mx={'auto'}
                  objectFit={'cover'}
                  maxH={{base: '40px', md: '50px'}}
                  maxW={{base: '120px', md: '200px'}}
                  alt={meta.reporterName}
                />
                <XIcon color={'gray'}/>
              </>
            )}
            <Heading
              as={'h1'}
              size={{base: 'sm', md: 'lg'}}
              fontWeight={'bold'}
              className={'gradientColor'}
              lineHeight={'1.4'}
            >デジタル民主主義2030<br/>ブロードリスニング</Heading>
          </HStack>
          <BroadlisteningGuide/>
        </HStack>
        <ClientContainer resultSize={resultSize} meta={meta} />
      </div>
      <footer>
        {meta && (<Text fontWeight={'bold'}>{meta.reporterName}</Text>)}
        <Text>デジタル民主主義2030 ブロードリスニング</Text>
      </footer>
    </>
  )
}
