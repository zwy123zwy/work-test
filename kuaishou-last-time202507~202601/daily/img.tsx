// 使用 React 封装一个组件，传入一个 img 的 src，该组件会在图片加载失败时进行重试加载 2 次

import React, { useState, useCallback } from 'react';

const MAX_RETRIES = 2;

interface RetryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export function RetryImage({ src, alt = '', fallback = null, ...rest }: RetryImageProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount((c) => c + 1);
    } else {
      setFailed(true);
    }
  }, [retryCount]);

  const handleLoad = useCallback(() => {
    setFailed(false);
  }, []);

  if (failed) {
    return <>{fallback}</>;
  }

  const srcWithRetry = retryCount > 0
    ? `${src}${src.includes('?') ? '&' : '?'}retry=${retryCount}`
    : src;

  return (
    <img
      {...rest}
      src={srcWithRetry}
      alt={alt}
      key={retryCount}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
