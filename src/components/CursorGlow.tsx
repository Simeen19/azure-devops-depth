import { useEffect, useRef, useState } from 'react';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CursorGlow() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const animRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const isTouch = e.type === 'touchmove' || e.type === 'touchstart';
      const point = isTouch
        ? (e as TouchEvent).touches[0]
        : (e as MouseEvent);
      if (!point) return;
      posRef.current.x = point.clientX;
      posRef.current.y = point.clientY;
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchstart', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseout', onLeave);

    let tx = -100;
    let ty = -100;

    const tick = () => {
      const { x, y } = posRef.current;
      tx = lerp(tx, x, 0.18);
      ty = lerp(ty, y, 0.18);
      if (elRef.current) {
        elRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
        elRef.current.style.opacity = visible ? '1' : '0';
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchstart', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [visible]);

  return (
    <div
      ref={elRef}
      aria-hidden
      className="pointer-events-none fixed z-40 w-24 h-24 rounded-full blur-3xl bg-gradient-to-tr from-azure/60 via-blue-500/40 to-transparent opacity-0 transition-opacity duration-300"
      style={{ left: 0, top: 0 }}
    />
  );
}
