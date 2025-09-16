import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { INSTAGRAM_GRAPHQL_URL_FOR_USER_POSTS_WITH_AFTER } from '@/constants/urls';

import { useCopyToClipboard } from '@/hooks';

import Input from '@/components/Input';
import TextArea from '@/components/TextArea';

import styles from './ResultProcessor.module.scss';

type Props = {
  onJsonProcessed: (jsonData: string) => void;
  endCursor?: string;
  username?: string;
};

const ResultProcessor: React.FC<Props> = ({ onJsonProcessed, endCursor, username }) => {
  const { copyToClipboard } = useCopyToClipboard();
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    if (endCursor && username) {
      const url = INSTAGRAM_GRAPHQL_URL_FOR_USER_POSTS_WITH_AFTER.replace('<USERNAME>', username).replace(
        '<AFTER>',
        endCursor
      );
      setGeneratedUrl(url);
    }
  }, [endCursor, username]);

  const handleJsonPaste = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setJsonInput(value);

    try {
      JSON.parse(value);
      onJsonProcessed(value);
      setGeneratedUrl('');
      setJsonInput('');
      toast.success('JSON processed successfully!');
    } catch (e) {
      if (value.trim() !== '') {
        toast.error('Invalid JSON');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.description}>
        Copy the generated link and open it in a new tab. Then copy the JSON output from the tab
      </div>
      <Input
        placeholder="Generated URL"
        value={generatedUrl}
        onChange={(e) => setGeneratedUrl(e.target.value)}
        onCopy={() => copyToClipboard(generatedUrl)}
      />

      <div className={styles.description}>
        Paste the JSON data into the input below. You will then be redirected to result page 🎉
      </div>
      <TextArea placeholder="Paste JSON Data" onChange={handleJsonPaste} value={jsonInput} />
    </div>
  );
};

export default ResultProcessor;
