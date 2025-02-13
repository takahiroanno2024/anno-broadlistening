'use client'

import {Result} from '@/type'
import {Box, Button, Heading, HStack, Icon, Separator, Text, VStack} from '@chakra-ui/react'
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle
} from '@/components/ui/timeline'
import {
  ChevronRightIcon,
  CircleArrowDownIcon,
  ClipboardCheckIcon,
  MessageCircleWarningIcon,
  MessagesSquareIcon,
} from 'lucide-react'
import {
  DrawerBackdrop, DrawerBody,
  DrawerContent, DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle
} from '@/components/ui/drawer'
import {useState} from 'react'
import {Tooltip} from '@/components/ui/tooltip'

type ReportProps = {
  result: Result
}

export function Analysis({result}: ReportProps) {

  const [selectedData, setSelectedData] = useState<{ title: string, body: string}|null>(null)

  return (
    <Box mx={'auto'} maxW={'750px'} mb={12} cursor={'default'}>
      <Separator mt={20} mb={12} />
      <Heading textAlign={'center'} fontSize={'xl'} mb={5}>Analysis</Heading>
      <HStack mb={5} justify={'center'}>
        <Tooltip content={'全てのコメントをAIで分析し、意見が含まれるコメントを抽出します。意見が含まれないコメントや、議題と関係のないコメントは除外されます。'} openDelay={0} closeDelay={0}>
          <VStack gap={0} w={'200px'}>
            <Icon mb={2}><MessageCircleWarningIcon size={'30px'} /></Icon>
            <Text className={'headingColor'}  fontSize={'3xl'} fontWeight={'bold'} lineHeight={1} mb={1}>{Object.keys(result.comments).length.toLocaleString()}</Text>
            <Text fontSize={'xs'}>意見が含まれるコメント数</Text>
          </VStack>
        </Tooltip>
        <ChevronRightIcon />
        <Tooltip content={'抽出したコメントをAIで分析し、様々な議論を抽出します。複数の意見が混ざったコメントなども適切に分離します。'} openDelay={0} closeDelay={0}>
          <VStack gap={0} w={'200px'}>
            <Icon mb={2}><MessagesSquareIcon size={'30px'} /></Icon>
            <Text className={'headingColor'}  fontSize={'3xl'} fontWeight={'bold'} lineHeight={1} mb={1}>{result.arguments.length.toLocaleString()}</Text>
            <Text fontSize={'xs'}>抽出した議論数</Text>
          </VStack>
        </Tooltip>
        <ChevronRightIcon />
        <Tooltip content={'抽出した議論をAIで分析し、近しい議論を一つのクラスターに分類します。クラスターごとの議論を要約し、大量の意見を見える化します。'} openDelay={0} closeDelay={0}>
          <VStack gap={0} w={'200px'}>
            <Icon mb={2}><ClipboardCheckIcon size={'30px'} /></Icon>
            <Text className={'headingColor'}  fontSize={'3xl'} fontWeight={'bold'} lineHeight={1} mb={1}>{result.clusters.length.toLocaleString()}</Text>
            <Text fontSize={'xs'}>集約したクラスター数</Text>
          </VStack>
        </Tooltip>
      </HStack>
      <Text mb={5}>{result.config.intro}</Text>
      <Box>
        <Heading fontSize={'md'} mb={5}>分析手順</Heading>
        <TimelineRoot size={'lg'}>
          {result.config.plan.map(p => (
            <TimelineItem key={p.step}>
              <TimelineConnector>
                <CircleArrowDownIcon />
              </TimelineConnector>
              {p.step === 'extraction' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>抽出 ({result.config.extraction.model})</TimelineTitle>
                  <TimelineDescription>
                    コメントデータから議論（意見）を抽出するステップです。<br />
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `抽出 - ${p.step}`,
                      body: result.config.extraction.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `抽出 - ${p.step}`,
                      body: result.config.extraction.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'embedding' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>埋め込み ({result.config.embedding.model})</TimelineTitle>
                  <TimelineDescription>
                    抽出された議論に対して埋め込み（ベクトル表現）を生成するステップです。<br/>
                    これにより、議論の内容を数値ベクトルとして表現します。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `埋め込み - ${p.step}`,
                      body: result.config.embedding.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_clustering' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>クラスタリング</TimelineTitle>
                  <TimelineDescription>
                    埋め込みベクトルの値に基づいて議論の階層クラスタリングを行うステップです。<br />
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `クラスタリング - ${p.step}`,
                      body: result.config.hierarchical_clustering.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_initial_labelling' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>初期ラベリング ({result.config.hierarchical_initial_labelling.model})</TimelineTitle>
                  <TimelineDescription>
                    クラスタリングの結果に対して、各クラスタに適切なタイトル・説明文を生成（ラベリング）するステップです。<br />
                    このステップでは、最も細かい粒度のクラスタ（最下層のクラスタ）に対して、各クラスタに属する議論に基づいてクラスタのタイトルと説明文を生成します。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `初期ラベリング - ${p.step}`,
                      body: result.config.hierarchical_initial_labelling.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `初期ラベリング - ${p.step}`,
                      body: result.config.hierarchical_initial_labelling.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_merge_labelling' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>統合ラベリング ({result.config.hierarchical_merge_labelling.model})</TimelineTitle>
                  <TimelineDescription>
                    階層的クラスタリングの結果に対して、クラスタをマージしながらタイトル・説明文を生成（ラベリング）するステップです。<br />
                    このステップでは、下層のクラスタのタイトル及び説明文と、議論に基づいて上層のクラスタのタイトル及び説明文を生成します。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `統合ラベリング - ${p.step}`,
                      body: result.config.hierarchical_merge_labelling.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `統合ラベリング - ${p.step}`,
                      body: result.config.hierarchical_merge_labelling.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_overview' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>要約 ({result.config.hierarchical_overview.model})</TimelineTitle>
                  <TimelineDescription>
                    クラスタの概要を作成するステップです。<br />
                    各クラスタのタイトル及び説明文をもとに、全体の概要をまとめます。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `要約 - ${p.step}`,
                      body: result.config.hierarchical_overview.source_code
                    })}>ソースコード</Button>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `要約 - ${p.step}`,
                      body: result.config.hierarchical_overview.prompt
                    })}>プロンプト</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_aggregation' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>出力</TimelineTitle>
                  <TimelineDescription>
                    最終的な結果を出力するステップです。<br />
                    議論および各分析結果を含むJSONファイルを出力します。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `出力 - ${p.step}`,
                      body: result.config.hierarchical_aggregation.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
              {p.step === 'hierarchical_visualization' && (
                <TimelineContent>
                  <TimelineTitle fontWeight={'bold'}>表示</TimelineTitle>
                  <TimelineDescription>
                    出力されたJSONファイルをグラフィカルに表示するステップです。<br />
                    クラスタの概要、議論の内容などを可視化します。あなたが見ているこの画面が出来上がります。
                  </TimelineDescription>
                  <HStack>
                    <Button variant={'outline'} size={'xs'} onClick={() => setSelectedData({
                      title: `表示 - ${p.step}`,
                      body: result.config.hierarchical_visualization.source_code
                    })}>ソースコード</Button>
                  </HStack>
                </TimelineContent>
              )}
            </TimelineItem>
          ))}
        </TimelineRoot>
      </Box>

      <DrawerRoot open={!!selectedData} size={'xl'} onOpenChange={() => setSelectedData(null)}>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedData?.title}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody fontSize={'xs'}>
            <Box
              p={5}
              borderRadius={5}
              bgColor={'#111'}
              color={'#fff'}
              whiteSpace={'pre-wrap'}
              className={'code'}
            >{selectedData?.body}</Box>
          </DrawerBody>
          <DrawerFooter>
            <Button w={'150px'} onClick={() => setSelectedData(null)}>閉じる</Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  )
}
