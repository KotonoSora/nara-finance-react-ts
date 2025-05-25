import { useCallback, useEffect, useState } from "react";

interface UseLoadingTransitionOptions {
  /**
   * Minimum duration the loading state should be shown for, in milliseconds
   */
  minDuration?: number;
  /**
   * Delay before showing the loading state, in milliseconds
   */
  loadingDelay?: number;
}

export function useLoadingTransition(
  options: UseLoadingTransitionOptions = {},
) {
  const { minDuration = 0, loadingDelay = 0 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<{ start?: number; timeoutId?: number }>(
    {},
  );

  const stopLoading = useCallback(() => {
    if (!timer.start) {
      setIsLoading(false);
      return;
    }

    const elapsed = Date.now() - timer.start;
    const remainingTime = Math.max(0, minDuration - elapsed);

    if (remainingTime === 0) {
      setIsLoading(false);
    } else {
      const timeoutId = window.setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
      setTimer((prev) => ({ ...prev, timeoutId }));
    }
  }, [minDuration, timer.start]);

  const startLoading = useCallback(() => {
    if (loadingDelay > 0) {
      const timeoutId = window.setTimeout(() => {
        setIsLoading(true);
        setTimer({ start: Date.now() });
      }, loadingDelay);
      setTimer({ timeoutId });
    } else {
      setIsLoading(true);
      setTimer({ start: Date.now() });
    }
  }, [loadingDelay]);

  useEffect(() => {
    return () => {
      if (timer.timeoutId) {
        clearTimeout(timer.timeoutId);
      }
    };
  }, [timer.timeoutId]);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
}
