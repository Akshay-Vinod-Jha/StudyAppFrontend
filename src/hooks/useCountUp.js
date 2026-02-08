import { useEffect, useState } from "react";

const easeOutQuad = (t) => t * (2 - t);

export const useCountUp = (
  end,
  duration = 2000,
  start = 0,
  shouldStart = true,
) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!shouldStart) {
      setCount(start);
      return;
    }

    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeOutQuad(progress);

      const currentCount = start + (end - start) * easedProgress;
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, shouldStart]);

  return count;
};
