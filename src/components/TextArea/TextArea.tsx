import React from 'react';

import styles from './TextArea.module.scss';

type Props = {
  placeholder: string;
  value: string;
  onChange?: (event: React.ChangeEvent<any>) => void;
};

const Textarea: React.FC<Props> = ({ placeholder, value, onChange, ...props }) => {
  return (
    <textarea className={styles.textarea} placeholder="Paste JSON data" onChange={onChange} value={value} {...props} />
  );
};

export default Textarea;
