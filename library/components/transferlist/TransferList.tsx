import React from 'react';
import styles from './TransferList.module.css';

export interface TransferListProps {
  leftItems: string[];
  rightItems: string[];
  onChange: (left: string[], right: string[]) => void;
  label?: string;
}

export function TransferList({ leftItems, rightItems, onChange, label }: TransferListProps) {
  const [selectedLeft, setSelectedLeft] = React.useState<Record<string, boolean>>({});
  const [selectedRight, setSelectedRight] = React.useState<Record<string, boolean>>({});

  const transferToRight = () => {
    const toMove = leftItems.filter((item) => selectedLeft[item]);
    const nextLeft = leftItems.filter((item) => !selectedLeft[item]);
    onChange(nextLeft, [...rightItems, ...toMove]);
    setSelectedLeft({});
  };

  const transferToLeft = () => {
    const toMove = rightItems.filter((item) => selectedRight[item]);
    const nextRight = rightItems.filter((item) => !selectedRight[item]);
    onChange([...leftItems, ...toMove], nextRight);
    setSelectedRight({});
  };

  return (
    <div className={styles.container}>
      {label && <div className="label">{label}</div>}
      <div className={styles.listsContainer}>
        <div className={styles.list}>
          {leftItems.map((item) => (
            <label
              key={item}
              className={styles.itemLabel}
            >
              <input
                type="checkbox"
                checked={!!selectedLeft[item]}
                onChange={(e) => setSelectedLeft({ ...selectedLeft, [item]: e.target.checked })}
              />
              {item}
            </label>
          ))}
        </div>

        <div className={styles.controlsContainer}>
          <button type="button" onClick={transferToRight} className={`btn btn-sm clickable ${styles.controlButton}`}>
            &gt;
          </button>
          <button type="button" onClick={transferToLeft} className={`btn btn-sm clickable ${styles.controlButton}`}>
            &lt;
          </button>
        </div>

        <div className={styles.list}>
          {rightItems.map((item) => (
            <label
              key={item}
              className={styles.itemLabel}
            >
              <input
                type="checkbox"
                checked={!!selectedRight[item]}
                onChange={(e) => setSelectedRight({ ...selectedRight, [item]: e.target.checked })}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
