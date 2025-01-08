import { XIcon } from 'lucide-react'
import React from 'react'
import { PaletteType } from '@/hooks/useColorPalettes'
import { Translator } from '@/hooks/useTranslatorAndReplacements'
import { Argument, PropertyMap } from '@/types'

type Props = {
  translator: Translator
  onClose: () => void
  highlightText: string
  setHighlightText: React.Dispatch<React.SetStateAction<string>>
  propertyMap: PropertyMap
  propertyFilter: { [key: string]: string }
  setPropertyFilter: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  dataHasVotes: boolean
  minVotes: number
  setMinVotes: React.Dispatch<React.SetStateAction<number>>
  minConsensus: number
  setMinConsensus: React.Dispatch<React.SetStateAction<number>>
  voteFilter: {
    total: number
    filtered: number
    filter: (arg: Argument) => boolean
  }
  paletteType: PaletteType
  setPaletteType: (type: PaletteType) => void
}

export function DesktopFullscreenFilter(props: Props) {
  const { t } = props.translator
  return (
    <div
      className="absolute top-0 left-0 w-[400px] p-4 bg-gray-100 overflow-y-auto z-10 h-full shadow-md"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 h-[32px]">
        <h2 className="text-md font-bold">
          {t('toolsFilterSettings')}
        </h2>
        <button onClick={props.onClose}>
          <XIcon />
        </button>
      </div>
      {/* Search */}
      <input
        type="text"
        placeholder={t('検索')}
        value={props.highlightText}
        onChange={(e) => props.setHighlightText(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <dl className={'mb-2'}>
        {Object.entries(props.propertyMap).map(([propKey, propValues]) => {
          const uniqueValues = Array.from(new Set(Object.values(propValues)))
          uniqueValues.sort() // ABC順にソート
          return (
            <div key={propKey}>
              <dt>{propKey}</dt>
              <dd>
                <select
                  value={props.propertyFilter[propKey] ?? ''}
                  onChange={(e) => {
                    // propKeyごとの選択値を状態管理する必要あり
                    props.setPropertyFilter((prev) => ({
                      ...prev,
                      [propKey]: e.target.value,
                    }))
                  }}
                  className="border p-1 rounded w-full"
                >
                  <option value="">{t('(すべて)')}</option>
                  {uniqueValues.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
          )
        })}
      </dl>

      カラーパレット
      <select
        className="w-[120px] m-1 px-2 py-1 rounded-lg bg-white text-gray-700 text-sm border border-gray-300 hover:border-gray-400"
        value={props.paletteType}
        onChange={(e) => props.setPaletteType(e.target.value as PaletteType)}
      >
        <option value="default">デフォルト</option>
        <option value="colorUniversal">カラーユニバーサル</option>
        <option value="proto">第一色覚</option>
        <option value="deutero">第二色覚</option>
        <option value="trito">第三色覚</option>
      </select>


      {/* Votes */}
      {props.dataHasVotes && (
        <div>
          <div className="flex justify-between">
            <button className="inline-block text-left">
              {t('Votes')} {'>'}{' '}
              <span className="inline-block w-10">{props.minVotes}</span>
            </button>
            <input
              className="inline-block w-[200px] mr-2"
              id="min-votes-slider"
              type="range"
              min="0"
              max="50"
              value={props.minVotes}
              onInput={(e) => {
                props.setMinVotes(
                  parseInt(
                    (e.target as HTMLInputElement).value
                  )
                )
              }}
            />
          </div>
          <div className="flex justify-between">
            <button className="inline-block text-left">
              {t('Consensus')} {'>'}{' '}
              <span className="inline-block w-10">{props.minConsensus}%</span>
            </button>
            <input
              className="inline-block w-[200px] mr-2"
              id="min-consensus-slider"
              type="range"
              min="50"
              max="100"
              value={props.minConsensus}
              onInput={(e) => {
                props.setMinConsensus(
                  parseInt(
                    (e.target as HTMLInputElement).value
                  )
                )
              }}
            />
          </div>
          <div className="text-sm opacity-70">
            {t('Showing')} {props.voteFilter.filtered}/
            {props.voteFilter.total} {t('arguments')}
          </div>
        </div>
      )}

    </div>
  )
}
