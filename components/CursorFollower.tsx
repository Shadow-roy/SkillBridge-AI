import React, { useEffect, useRef } from 'react';

const CursorFollower: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediate update for the center dot
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const animate = () => {
      // Smooth follow for the outer ring
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Only show on non-touch devices
  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999]">
      <div 
        ref={cursorRef}
        className="absolute top-0 left-0 w-8 h-8 border border-blue-500 rounded-full -mt-4 -ml-4 transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      />
      <div 
        ref={cursorDotRef}
        className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full -mt-1 -ml-1"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default CursorFollower;