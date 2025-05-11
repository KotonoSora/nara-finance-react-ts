import { useEffect, useRef, useState } from "react";

type EasingFunction = (t: number) => number;

const easings = {
  linear: (t: number) => t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeOutCubic: (t: number) => 1 + --t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
};

interface UseCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  easing?: keyof typeof easings | EasingFunction;
  formatter?: (value: number) => string;
  autoStart?: boolean;
}

export default function useCounter({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  easing = "easeOutCubic",
  formatter = (value: number) => {
    const fixed = Number(value).toFixed(decimals);
    return new Intl.NumberFormat("vi-VN").format(Number(fixed));
  },
  autoStart = true,
}: UseCounterProps) {
  const [count, setCount] = useState(start);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const countRef = useRef(start);
  const [isInView, setIsInView] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const easingFn = typeof easing === "function" ? easing : easings[easing];

  useEffect(() => {
    elementRef.current = document.getElementById(
      "stats-section",
    ) as HTMLElement;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || !isPlaying) return;

    const startTime = performance.now();
    let timer: NodeJS.Timeout;

    if (delay > 0) {
      timer = setTimeout(() => {
        const animate = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const rawProgress = Math.min(elapsedTime / duration, 1);
          const progress = easingFn(rawProgress);

          const diff = end - start;
          const currentValue = start + diff * progress;
          const currentCount =
            decimals > 0
              ? Number(currentValue.toFixed(decimals))
              : Math.floor(currentValue);

          if (countRef.current !== currentCount) {
            countRef.current = currentCount;
            setCount(currentCount);
          }

          if (rawProgress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            setCount(end); // Ensure final value is exact
          }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const rawProgress = Math.min(elapsedTime / duration, 1);
        const progress = easingFn(rawProgress);

        const diff = end - start;
        const currentValue = start + diff * progress;
        const currentCount =
          decimals > 0
            ? Number(currentValue.toFixed(decimals))
            : Math.floor(currentValue);

        if (countRef.current !== currentCount) {
          countRef.current = currentCount;
          setCount(currentCount);
        }

        if (rawProgress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end); // Ensure final value is exact
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, start, duration, delay, isInView, isPlaying, decimals, easingFn]);

  const pause = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const resume = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const reset = () => {
    setCount(start);
    countRef.current = start;
    if (autoStart) {
      resume();
    } else {
      pause();
    }
  };

  return {
    value: `${prefix}${formatter(count)}${suffix}`,
    rawValue: count,
    progress: Math.min((count - start) / (end - start), 1),
    isFinished: count === end,
    isPlaying,
    controls: {
      pause,
      resume,
      reset,
    },
  };
}
