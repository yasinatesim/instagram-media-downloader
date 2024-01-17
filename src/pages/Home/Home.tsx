'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
  INSTAGRAM_POSTPAGE_REGEX,
  INSTAGRAM_REELSPAGE_REGEX,
  INSTAGRAM_USERNAME_REGEX_FOR_STORIES,
} from '@/constants/regexes';
import { INSTAGRAM_GRAPHQL_URL, INSTAGRAM_PROFILE_URL, INSTAGRAM_URL_PARAMS } from '@/constants/urls';

import { useCopyToClipboard } from '@/hooks';

import Gallery from '@/components/Galllery/Gallery';
import HowToUse from '@/components/HowToUse';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';

import styles from './Home.module.scss';

const Home: React.FC = () => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const [url, setUrl] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [generatedStoriesUrl, setGeneratedStoriesUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [storiesUrl, setStoriesUrl] = useState('');

  const [processedData, setProcessedData] = useState<any>(null);

  const handleStoriesUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoriesUrl(event.target.value);

    const parsedValue = JSON.parse(event.target.value);
    const url = INSTAGRAM_GRAPHQL_URL.replace('<USER_ID>', parsedValue.graphql.user.id);
    setGeneratedStoriesUrl(url);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);

    const inputValue = event.target.value;
    const urlObj = new URL(inputValue);
    urlObj.search = '';

    const url = urlObj.toString();

    if (!url) {
      toast.error('Please provide a URL');
      return;
    }

    let finalUrl;

    if (url.includes('instagram')) {
      if (url.includes(`${INSTAGRAM_POSTPAGE_REGEX}`) || url.includes(`${INSTAGRAM_REELSPAGE_REGEX}`)) {
        finalUrl = `${url}${INSTAGRAM_URL_PARAMS}`;
      } else {
        const usernameMatch = url.match(INSTAGRAM_USERNAME_REGEX_FOR_STORIES);
        const username: any = usernameMatch && usernameMatch[1];

        finalUrl = INSTAGRAM_PROFILE_URL.replace('<USER_NAME>', username);
      }

      setGeneratedUrl(finalUrl);
    } else {
      toast.error('Invalid URL. Must be an Instagram URL.');
    }
  };

  const handleJsonPaste = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJsonInput(event.target.value);
    setProcessedData(event.target.value);
  };

  useEffect(() => {
    if (isCopied) {
      toast.success('Copied');
    }
  }, [isCopied]);

  if (processedData) {
    const parsedData = JSON.parse(processedData);

    return <Gallery result={parsedData} />;
  }

  return (
    <div className="container">
      <h2>Instagram Media Downloader</h2>
      <div className={styles.description}>Please enter Instagram story or reels or post url</div>
      <Input placeholder="Enter URL" value={url} onChange={handleUrlChange} />

      <div className={styles.description}>
        Copy the generated link and open it in a new tab. Then copy the JSON output from the tab
      </div>
      <Input
        placeholder="Generated URL"
        value={generatedUrl}
        readOnly
        onCopy={() => {
          copyToClipboard(generatedUrl);
        }}
      />

      {url.includes('stories') && (
        <>
          <div className={styles.description}>Paste JSON data in the below input</div>
          <TextArea placeholder="Paste JSON Data" onChange={handleStoriesUrlChange} value={storiesUrl} />

          <div className={styles.description}>
            Copy the generated link and open it in a new tab. Then copy the JSON output from the tab
          </div>
          <Input
            placeholder="Generated URL"
            value={generatedStoriesUrl}
            readOnly
            onCopy={() => {
              copyToClipboard(generatedStoriesUrl);
            }}
          />
        </>
      )}

      <div className={styles.description}>
        Paste the JSON data into the input below. You will then be redirected to result page 🎉
      </div>
      <TextArea placeholder="Paste JSON Data" onChange={handleJsonPaste} value={jsonInput} />

      <HowToUse />
    </div>
  );
};

export default Home;
