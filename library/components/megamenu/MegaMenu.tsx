import React from 'react';
import { ClickAwayListener } from '../../utilities';
import { Link } from '../link';

export interface MegaMenuColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface MegaMenuProps {
  trigger: React.ReactNode;
  columns: MegaMenuColumn[];
}

export function MegaMenu({ trigger, columns }: MegaMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className="lib-relative">
        <div onClick={() => setIsOpen(!isOpen)} className="clickable" style={{ display: 'inline-block' }}>
          {trigger}
        </div>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-5)',
              display: 'flex',
              gap: 'var(--space-6)',
              marginTop: 'var(--space-2)',
              minWidth: '460px',
            }}
          >
            {columns.map((col, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: '120px' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-disabled)' }}>
                  {col.title}
                </div>
                {col.links.map((link, lIdx) => (
                  <Link key={lIdx} href={link.href} style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}
