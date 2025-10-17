import React, { useRef } from 'react';

import styles from './TextArea.module.scss';

type Props = {
  placeholder: string;
  value: string;
  onChange?: (event: React.ChangeEvent<any>) => void;
  onFileUpload?: (content: string) => void;
};

const Textarea: React.FC<Props> = ({ placeholder, value, onChange, onFileUpload, ...props }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (onFileUpload) {
        onFileUpload(content);
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <textarea className={styles.textarea} placeholder={placeholder} onChange={onChange} value={value} {...props} />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
      <button
        type="button"
        onClick={triggerFileInput}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '16px',
        }}
      >
        Upload JSON File
      </button>
    </div>
  );
};

export default Textarea;
