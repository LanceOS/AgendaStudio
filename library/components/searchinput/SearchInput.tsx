import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../utilities';
import { TextInput, type TextInputProps } from '../textinput';
import styles from './SearchInput.module.css';

export interface SearchInputProps extends TextInputProps { }

export function SearchInput({ className = '', ...props }: SearchInputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Search size={15} />
      </div>
      <TextInput
        type="search"
        className={cn(styles.input, className)}
        {...props}
      />
    </div>
  );
}
