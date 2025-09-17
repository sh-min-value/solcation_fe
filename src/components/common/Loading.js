import React from 'react';

const Loading = ({
  size = 'medium', // 'small' | 'medium' | 'large'
  text = '로딩 중...',
  overlay = true, // true면 화면 전체 오버레이
  color = 'blue', // 'gray' | 'blue'
}) => {
  // 팔레트 정의
  const palette = {
    gray: {
      1: '#333333',
      2: '#707070',
      3: '#BDBDBD',
      4: '#D0D0D0',
      5: '#E1E1E1',
      6: '#F5F5F5',
    },
    blue: {
      third: '#120D6B',
    },
  };

  // 사이즈 프리셋
  const sizeClasses = {
    small: { spinner: 'w-6 h-6', text: 'text-sm' },
    medium: { spinner: 'w-8 h-8', text: 'text-base' },
    large: { spinner: 'w-12 h-12', text: 'text-lg' },
  };

  // 색상 테마
  const theme =
    color === 'gray'
      ? {
          border: palette.gray[1],
          textGradient: `linear-gradient(90deg, ${palette.gray[1]}, ${palette.gray[2]})`,
          barGradient: `linear-gradient(90deg, ${palette.gray[1]}, ${palette.gray[2]})`,
          halo: palette.gray[4],
        }
      : {
          border: palette.blue.third,
          textGradient: `linear-gradient(90deg, ${palette.blue.third}, ${palette.blue.third}CC)`,
          barGradient: `linear-gradient(90deg, ${palette.blue.third}, ${palette.blue.third}99)`,
          halo: '#F3F4F6',
        };

  const SpinnerLoader = () => (
    <div className="relative">
      <div
        className={`
          ${sizeClasses[size].spinner}
          rounded-full
          border-4
          border-t-transparent
          animate-spin
        `}
        style={{
          borderColor: theme.border,
          borderTopColor: 'transparent',
        }}
        aria-hidden
      />
    </div>
  );

  return (
    <div
      className={`
        ${overlay ? 'absolute inset-0 z-[1000]' : 'w-full h-full'}
        flex items-center justify-center bg-gray-2/20
      `}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* 스피너 */}
        <SpinnerLoader />

        {/* 로딩 텍스트 */}
        {text && (
          <div className="text-center">
            <p
              className={`font-medium ${sizeClasses[size].text} animate-pulse`}
              style={{
                backgroundImage: theme.textGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
