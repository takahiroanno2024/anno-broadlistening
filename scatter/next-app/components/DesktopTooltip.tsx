 // Start of Selection
import React from 'react';
import { Point, Dimensions } from '@/types';
import { Translator } from '@/hooks/useTranslatorAndReplacements';
import { ColorFunc } from '@/hooks/useClusterColor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';


type TooltipProps = {
  point: Point;
  dimensions: Dimensions;
  zoom: any;
  expanded: boolean;
  fullScreen: boolean;
  translator: Translator;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  colorFunc: ColorFunc;
  position: { x: number; y: number };
  onClose: () => void;
  enableFavorites: boolean;
};

function Tooltip(props: TooltipProps) {
  const {
    point,
    expanded,
    position,
    onClose,
    isFavorite,
    onToggleFavorite,
    colorFunc,
    translator,
    enableFavorites,
  } = props;

  const { t } = translator;

  const tooltipStyle: React.CSSProperties = expanded
  ? {
      // ツールチップが展開されている場合のスタイル
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '600px',
      zIndex: 1000,
    }
  : {
      // ホバリング時のツールチップスタイル
      position: 'absolute',
      left: position.x,
      top: position.y,
      transform: 'translate(10px, -10px)', // カーソルの近くに表示
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '10px',
      borderRadius: '4px',
      maxWidth: '300px',
      zIndex: 1000,
      pointerEvents: 'none', // ホバリング時はマウスイベントを無視
    };

  return (
    <>
      {(expanded) && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}
      <div style={tooltipStyle}>
        {expanded && (
          <button onClick={onClose} style={{ float: 'right' }}>
            {t('Close')}
          </button>
        )}
        {/* ツールチップの内容 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ color: colorFunc(point.cluster_id), margin: 0 }} className="text-base sm:text-base md:text-base font-bold">
            {/* ラベルを大きくする */}
            {translator.t(point.cluster)}
          </h3>
          {/* お気に入りボタン */}
          {enableFavorites && (
            <button
              onClick={() => onToggleFavorite()}
              className="text-amber-500 text-lg focus:outline-none ml-2"
              aria-label={
                isFavorite ? t('お気に入りから削除') : t('お気に入りに追加')
              }
              style={{ marginLeft: '8px' }}
            >
              <FontAwesomeIcon icon={isFavorite ? solidBookmark : regularBookmark} />
            </button>
          )}
        </div>
        <p className="text-sm sm:text-sm md:text-md mt-2">{point.argument}</p>
      </div>
    </>
  );
}

export default Tooltip;
