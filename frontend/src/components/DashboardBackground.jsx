import { useEffect, useRef } from 'react';

const waveConfig = [
  { left: '10%', top: '15%', width: '420px', height: '420px', opacity: 0.12, duration: 22 },
  { left: '75%', top: '5%', width: '300px', height: '300px', opacity: 0.08, duration: 24 },
  { left: '50%', top: '55%', width: '380px', height: '380px', opacity: 0.1, duration: 26 },
];

const DashboardBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handlePointerMove = (event) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
      node.style.setProperty('--cursor-x', `${x}px`);
      node.style.setProperty('--cursor-y', `${y}px`);
    };

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', () => {
      node.style.setProperty('--cursor-x', '0px');
      node.style.setProperty('--cursor-y', '0px');
    });

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="dashboard-bg" aria-hidden="true">
      <div className="dashboard-bg-grid" />
      <div className="dashboard-bg-aurora" />
      <div className="dashboard-bg-radial" />
      {waveConfig.map((wave, index) => (
        <div
          key={index}
          className="dashboard-bg-orb"
          style={{
            left: wave.left,
            top: wave.top,
            width: wave.width,
            height: wave.height,
            opacity: wave.opacity,
            animationDuration: `${wave.duration}s`,
          }}
        />
      ))}
      <div className="dashboard-bg-particles">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} className="dashboard-bg-particle" style={{ animationDelay: `${index * 0.45}s` }} />
        ))}
      </div>
    </div>
  );
};

export default DashboardBackground;
