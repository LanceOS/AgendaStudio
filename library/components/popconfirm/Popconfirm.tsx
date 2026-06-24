import React from 'react';
import { X, AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Portal } from '../../utilities';
import { FocusTrap } from '../../utilities';
import { ClickAwayListener } from '../../utilities';

export interface PopconfirmProps {
  title: string;
  onConfirm: () => void;
  children: React.ReactElement;
  style?: React.CSSProperties;
}

export function Popconfirm({ title, onConfirm, children, style }: PopconfirmProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {React.cloneElement(children as React.ReactElement<any>, {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            setIsOpen(!isOpen);
            (children.props as any).onClick?.(e);
          },
        })}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              padding: '10px 12px',
              zIndex: 1000,
              minWidth: '160px',
              marginBottom: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              ...style,
            }}
          >
            <div style={{ fontSize: 'var(--space-3)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{title}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-sm clickable"
                style={{ padding: '2px 6px', minHeight: 'auto', fontSize: 'var(--font-size-xs)' }}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
                className="btn btn-sm btn-primary clickable"
                style={{ padding: '2px 6px', minHeight: 'auto', fontSize: 'var(--font-size-xs)' }}
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}
