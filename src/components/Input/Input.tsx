import React from 'react';

import IconCopy from '@/assets/icons/icon-copy.svg';

import styles from './Input.module.scss';

type Props = {
  placeholder: string;
  value: string;
  readOnly?: boolean;
  disabled?: boolean;
  onCopy?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<Props> = ({ placeholder, value, onChange, onCopy, disabled, ...props }) => {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        disabled={disabled}
        {...props}
      />
      {onCopy && (
        <button className={styles.copyButton} onClick={onCopy} disabled={!value}>
          <IconCopy />
        </button>
      )}
    </div>
  );
};

export default Input;
