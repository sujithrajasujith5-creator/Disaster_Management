import { useEffect, useRef } from 'react';

const particleConfig = [
  { left: '10%', top: '90%', size: 6, duration: '18s', delay: '0s' },
  { left: '22%', top: '78%', size: 4, duration: '14s', delay: '1.5s' },
  { left: '40%', top: '92%', size: 5, duration: '20s', delay: '0.8s' },
  { left: '65%', top: '88%', size: 5, duration: '16s', delay: '1.2s' },
  { left: '80%', top: '96%', size: 3, duration: '12s', delay: '0.4s' },
  { left: '12%', top: '55%', size: 5, duration: '19s', delay: '2.2s' },
  { left: '33%', top: '65%', size: 4, duration: '15s', delay: '1.1s' },
  { left: '56%', top: '70%', size: 3, duration: '17s', delay: '0.2s' },
  { left: '72%', top: '62%', size: 6, duration: '22s', delay: '2.8s' },
  { left: '90%', top: '78%', size: 4, duration: '13s', delay: '1.9s' },
];

const blobConfig = [
  {
    style: {
      left: '5%',
      top: '12%',
      width: '280px',
      height: '280px',
      background: 'radial-gradient(circle, rgba(37,99,235,0.6), transparent 60%)',
      animationDuration: '22s',
      animationDelay: '0s',
    },
  },
  {
    style: {
      right: '5%',
      top: '18%',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(8,145,178,0.45), transparent 62%)',
      animationDuration: '18s',
      animationDelay: '2s',
    },
  },
  {
    style: {
      left: '20%',
      bottom: '5%',
      width: '220px',
      height: '220px',
      background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 65%)',
      animationDuration: '24s',
      animationDelay: '1s',
    },
  },
];

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handlePointerMove = (event) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 20;
      node.style.setProperty('--pointer-x', `${x}px`);
      node.style.setProperty('--pointer-y', `${y}px`);
    };

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerleave', () => {
      node.style.setProperty('--pointer-x', '0px');
      node.style.setProperty('--pointer-y', '0px');
    });

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="auth-bg" aria-hidden="true">
      <div className="auth-bg-gradient" />
      <div className="auth-bg-grid" />
      <div className="auth-bg-wave" />
      <div className="auth-bg-beam" />
      {blobConfig.map((blob, index) => (
        <div
          key={index}
          className="auth-bg-blob"
          style={blob.style}
        />
      ))}
      <div className="auth-bg-particles">
        {particleConfig.map((particle, index) => (
          <span
            key={index}
            className="auth-bg-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
