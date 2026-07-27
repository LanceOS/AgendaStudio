import React from 'react';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (val: string) => void;
  style?: React.CSSProperties;
}

export function RadioGroup({ label, name, options, value, onChange, style }: RadioGroupProps) {
  return (
    <fieldset
      style={{
        border: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        ...style,
      }}
    >
      <legend className="label" style={{ padding: 0, marginBottom: 'var(--space-1)', color: 'var(--color-text-primary)' }}>
        {label}
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {options.map((opt) => {
          const optId = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <input
                type="radio"
                id={optId}
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange?.(opt.value)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
