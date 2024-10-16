import RoughSvg from '@ossinsight-lite/roughness/components/RoughSvg';
import RoughBox from '@ossinsight-lite/ui/components/roughness/shape/box';
import clsx from 'clsx';
import { Suspense } from 'react';
import colors from 'tailwindcss/colors';
import { Alert } from '../../../components/alert';
import ChartTypeToggle from '../../../components/visualize/ChartTypeToggle';
import { VisualizeType } from '../../../components/visualize/common';
import Visualize from '../../../components/visualize/Visualize';
import SlidersIcon from '../../../icons/twbs/sliders.svg';

export interface ResultDisplayProps {
  editing?: boolean;
  result?: any;
  running?: boolean;
  error?: unknown;
  configuring?: boolean;
  visualize?: VisualizeType;
  onVisualizeTypeChange?: (type: VisualizeType['type']) => void;
  onClickVisualizeOptions?: () => void;
  portal?: HTMLDivElement | null;
}

export default function ResultDisplay ({ editing = false, configuring, portal, visualize, onVisualizeTypeChange, onClickVisualizeOptions, result, running, error }: ResultDisplayProps) {
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Alert title="Failed to execute SQL">
          {error}
        </Alert>
      </div>
    );
  }
  return (
    <div className={'w-full h-full flex flex-col gap-2 p-4'}>
      {editing && (
        <div className="flex gap-2 p-1">
          <ChartTypeToggle value={visualize.type} onChange={onVisualizeTypeChange} />
          {!configuring && <button
            className={clsx('relative text-gray-700 text-sm p-2 ml-auto')}
            disabled={running}
            onClick={onClickVisualizeOptions}
          >
            <span className="inline-flex items-center gap-1 relative z-10 px-2">
              Config
              <RoughSvg>
                <SlidersIcon width={14} height={14} />
              </RoughSvg>
            </span>

            <RoughBox color={colors.gray['400']} />
          </button>}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Suspense fallback="Loading...">
          <Visualize {...visualize} result={result} running={running} />
        </Suspense>
      </div>
    </div>
  );
}
