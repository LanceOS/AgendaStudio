import React from 'react';

export interface StepperProps {
  steps: string[];
  activeStep: number;
  style?: React.CSSProperties;
}

export function Stepper({ steps, activeStep, style }: StepperProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', ...style }}>
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: idx < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div
                style={{
                  width: 'var(--space-6)',
                  height: 'var(--space-6)',
                  borderRadius: '50%',
                  backgroundColor: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-border-default)',
                  color: isCompleted || isActive ? 'var(--color-text-on-accent)' : 'var(--color-text-disabled)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 500,
                }}
              >
                {idx + 1}
              </div>
              <span
                style={{
                  fontSize: 'var(--font-size-base)',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  height: '2px',
                  backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-border-default)',
                  flexGrow: 1,
                  margin: '0 12px',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
