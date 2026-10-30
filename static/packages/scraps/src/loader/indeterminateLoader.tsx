import {useRef, useState} from 'react';
import {useResizeObserver} from '@react-aria/utils';
import {css, keyframes, styled} from '@yak/react';

interface IndeterminateLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'vibrant' | 'monochrome';
}

const SQUIGGLE_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='1 0 16 8'%3E%3Cpath stroke='%23fff' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M17 6c-4 0-4-4-8-4S5 6 1 6'/%3E%3C/svg%3E\")";

const indeterminateSlow = keyframes`
  0% { left: -35%; right: 100%; }
  60% { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
`;

const indeterminateFast = keyframes`
  0% { left: -200%; right: 100%; }
  60% { left: 107%; right: -8%; }
  100% { left: 107%; right: -8%; }
`;

// Lerp animation timing based on track width.
// Small (~128px): 2.0s duration, 1.0s delay
// Large (~400px+): 3.2s duration, 1.6s delay
const WIDTH = {MIN: 128, MAX: 400};
const DURATION = {MIN: 2, MAX: 2.8};
const DELAY = {MIN: 0.8, MAX: 1.2};

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * Math.min(1, Math.max(0, t));
}

function useAnimationTiming() {
  const ref = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(DURATION.MAX);
  const [delay, setDelay] = useState(DELAY.MAX);

  useResizeObserver({
    ref,
    onResize() {
      const w = ref.current?.offsetWidth ?? WIDTH.MAX;
      const t = (w - WIDTH.MIN) / (WIDTH.MAX - WIDTH.MIN);
      setDuration(lerp(DURATION.MIN, DURATION.MAX, t));
      setDelay(lerp(DELAY.MIN, DELAY.MAX, t));
    },
  });

  return {ref, duration, delay};
}

export function IndeterminateLoader({
  variant = 'vibrant',
  ...props
}: IndeterminateLoaderProps) {
  const {ref, duration, delay} = useAnimationTiming();

  return (
    <Track
      ref={ref}
      role="progressbar"
      aria-label="Loading"
      $variant={variant}
      {...props}
    >
      <ColorMask>
        <Bar $variant={variant} $speed="slow" $duration={`${duration}s`} $delay="0s" />
        <Bar
          $variant={variant}
          $speed="fast"
          $duration={`${duration}s`}
          $delay={`${delay}s`}
        />
      </ColorMask>
    </Track>
  );
}

type Variant = IndeterminateLoaderProps['variant'];

const Track = styled.div<{$variant: Variant}>`
  position: relative;
  overflow: hidden;
  width: 100%;
  width: calc(round(down, 100% - 16px, 8px) + 16px);
  height: 8px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    mask-image: ${SQUIGGLE_TILE};
    mask-repeat: repeat-x;
    mask-size: 16px 8px;
    -webkit-mask-image: ${SQUIGGLE_TILE};
    -webkit-mask-repeat: repeat-x;
    -webkit-mask-size: 16px 8px;
  }

  ${({$variant}) =>
    $variant === 'monochrome'
      ? css`
          &::before {
            background: currentColor;
            opacity: 0.2;
          }
        `
      : css`
          &::before {
            background: var(--tokens-border-secondary);
          }
        `}
`;

const ColorMask = styled.span`
  position: absolute;
  inset: 0;
  mask-image: ${SQUIGGLE_TILE};
  mask-repeat: repeat-x;
  mask-size: 16px 8px;
  -webkit-mask-image: ${SQUIGGLE_TILE};
  -webkit-mask-repeat: repeat-x;
  -webkit-mask-size: 16px 8px;
`;

const Bar = styled.span<{
  $delay: string;
  $duration: string;
  $speed: 'slow' | 'fast';
  $variant: Variant;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  animation-duration: ${({$duration}) => $duration};
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: ${({$delay}) => $delay};
  animation-iteration-count: infinite;
  animation-fill-mode: backwards;

  ${({$speed}) =>
    $speed === 'slow'
      ? css`
          animation-name: ${indeterminateSlow};
        `
      : css`
          animation-name: ${indeterminateFast};
        `}

  ${({$variant}) =>
    $variant === 'monochrome'
      ? css`
          background: currentColor;
        `
      : css`
          background: var(--tokens-border-accent-vibrant);
        `}
`;
