import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Checkbox({ label, error, className = '', style, ...props }: CheckboxProps) {
  const checkboxId = React.useId();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', ...style }}>
      <label
        htmlFor={checkboxId}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <input
          type="checkbox"
          id={checkboxId}
          className={className}
          style={{
            cursor: 'pointer',
            accentColor: 'var(--color-primary)',
            width: '15px',
            height: '15px',
          }}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <span className="lib-field-error-msg">{error}</span>}
    </div>
  );
}
