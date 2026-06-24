import React from 'react';

export interface ScrollspyProps {
  targets: string[];
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Scrollspy({ targets, children, style }: ScrollspyProps) {
  const [activeId, setActiveId] = React.useState('');

  React.useEffect(() => {
    const handleScroll = () => {
      let currentActive = '';
      for (const target of targets) {
        const el = document.getElementById(target);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            currentActive = target;
          }
        }
      }
      setActiveId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [targets]);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', ...style }}>
      <nav style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flexShrink: 0 }}>
        {targets.map((tgt) => (
          <a
            key={tgt}
            href={`#${tgt}`}
            className="clickable"
            style={{
              fontSize: 'var(--font-size-base)',
              textDecoration: 'none',
              color: activeId === tgt ? 'var(--color-primary)' : 'var(--color-text-disabled)',
              fontWeight: activeId === tgt ? 500 : 400,
            }}
          >
            {tgt}
          </a>
        ))}
      </nav>
      <div style={{ flexGrow: 1 }}>{children}</div>
    </div>
  );
}
