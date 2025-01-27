import { useEffect, useRef } from 'react';

const useAutoScroll = (scrollSpeed = 1) => {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let animationFrameId;
    let scrollPosition = 0;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollPosition += scrollSpeed;
      
      // Reset position when we reach the end
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start scrolling
    animationFrameId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [scrollSpeed]);

  return scrollRef;
};

export default useAutoScroll; 