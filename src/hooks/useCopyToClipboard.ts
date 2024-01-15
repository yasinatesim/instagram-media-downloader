import { useState } from 'react';

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          setIsCopied(true);
        },
        (err) => {
          console.error('Error copying to clipboard:', err);
          setIsCopied(false);
        }
      );
    } else {
      // Fallback for browsers that do not support the Clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        setIsCopied(true);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        setIsCopied(false);
      }

      document.body.removeChild(textArea);
    }
  };

  return { isCopied, copyToClipboard };
};

export default useCopyToClipboard;
