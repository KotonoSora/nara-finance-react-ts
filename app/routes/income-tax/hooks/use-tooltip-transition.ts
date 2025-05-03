import { useCallback, useState } from "react";

interface UseTooltipTransitionOptions {
  showDelay?: number;
  hideDelay?: number;
  loadDuration?: number;
}

export function useTooltipTransition(
  options: UseTooltipTransitionOptions = {},
) {
  const { showDelay = 200, hideDelay = 150, loadDuration = 100 } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timer, setTimer] = useState<number>();

  const clearTimer = () => {
    if (timer) {
      window.clearTimeout(timer);
    }
  };

  const show = useCallback(() => {
    clearTimer();
    const showTimer = window.setTimeout(() => {
      setIsVisible(true);
      const loadTimer = window.setTimeout(() => {
        setIsLoaded(true);
      }, loadDuration);
      setTimer(loadTimer);
    }, showDelay);
    setTimer(showTimer);
  }, [showDelay, loadDuration]);

  const hide = useCallback(() => {
    clearTimer();
    setIsLoaded(false);
    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
    setTimer(hideTimer);
  }, [hideDelay]);

  return {
    isVisible,
    isLoaded,
    show,
    hide,
  };
}
