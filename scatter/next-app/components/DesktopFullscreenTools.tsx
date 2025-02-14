import {
  AtSignIcon,
  BookMarkedIcon,
  ChartPieIcon,
  Minimize2Icon,
  ScanSearchIcon,
  SlidersHorizontalIcon,
  TagIcon
} from 'lucide-react'
import React from 'react'
import { Translator } from '@/hooks/useTranslatorAndReplacements'

type Props = {
  canFilter: boolean // !!propertyMap
  zoomReset: boolean | (() => void)
  translator: Translator
  exitFullScreen: () => void // back
  showSettings: boolean
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
  showLabels: boolean
  setShowLabels: React.Dispatch<React.SetStateAction<boolean>>
  showTitle: boolean
  setShowTitle: React.Dispatch<React.SetStateAction<boolean>>
  showRatio: boolean
  setShowRatio: React.Dispatch<React.SetStateAction<boolean>>
  showFavorites: boolean
  setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>
}

export function DesktopFullscreenTools(props: Props) {
  const { t } = props.translator
  return (
    <div className="absolute top-0 w-full p-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
      <div className={'flex justify-between items-center'}>
        <div className={'flex'}>
          {props.canFilter && (
            <button className="w-[80px] m-1 flex flex-col items-center" onClick={() => props.setShowSettings(x => !x)}>
              <SlidersHorizontalIcon className={props.showSettings ? 'text-blue-500' : 'text-gray-500'} />
              <p className={'text-xs text-gray-700'}>{t('toolsFilterSettings')}</p>
            </button>
          )}
          <button className="w-[80px] m-1 flex flex-col items-center" onClick={() => props.setShowLabels(x => !x)}>
            <TagIcon className={props.showLabels ? 'text-blue-500' : 'text-gray-500'} />
            <p className={'text-xs text-gray-700'}>{t('toolsDisplayLabels')}</p>
          </button>
          <button className="w-[80px] m-1 flex flex-col items-center" onClick={() => props.setShowTitle(x => !x)}>
            <AtSignIcon className={props.showTitle ? 'text-blue-500' : 'text-gray-500'} />
            <p className={'text-xs text-gray-700'}>{t('toolsDisplayTitle')}</p>
          </button>
          <button className="w-[80px] m-1 flex flex-col items-center" onClick={() => props.setShowRatio(x => !x)}>
            <ChartPieIcon className={props.showRatio ? 'text-blue-500' : 'text-gray-500'} />
            <p className={'text-xs text-gray-700'}>{t('toolsDisplayPercentage')}</p>
          </button>
          <button className="w-[80px] m-1 flex flex-col items-center"
            onClick={() => typeof props.zoomReset === 'function' && props.zoomReset()}>
            <ScanSearchIcon className={props.zoomReset ? 'text-blue-500' : 'text-gray-500'} />
            <p className={'text-xs text-gray-700'}>{t('toolsResetPosition')}</p>
          </button>
        </div>
        <div className={'flex justify-between items-center'}>
          <button className="w-[80px] m-1 flex flex-col items-center" onClick={() => props.setShowFavorites(x => !x)}>
            <BookMarkedIcon className={'text-gray-700'} />
            <p className={'text-xs text-gray-700'}>{t('toolsDisplayFavorites')}</p>
          </button>
          <button className="w-[80px] m-1 flex flex-col items-center" onClick={props.exitFullScreen}>
            <Minimize2Icon className={'text-gray-700'} />
            <p className={'text-xs text-gray-700'}>{t('toolsExitFullScreen')}</p>
          </button>
        </div>
      </div>
    </div>
  )
}
