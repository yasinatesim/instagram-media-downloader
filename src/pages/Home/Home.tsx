'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
  INSTAGRAM_HIGHLIGHT_ID_REGEX,
  INSTAGRAM_HIGHLIGHTSPAGE_REGEX,
  INSTAGRAM_POSTPAGE_REGEX,
  INSTAGRAM_REELSPAGE_REGEX,
  INSTAGRAM_USERNAME_REGEX_FOR_PROFILE,
  INSTAGRAM_USERNAME_REGEX_FOR_STORIES,
} from '@/constants/regexes';
import {
  INSTAGRAM_GRAPHQL_URL_FOR_HIGHLIGHTS,
  INSTAGRAM_GRAPHQL_URL_FOR_STORIES,
  INSTAGRAM_URL_PARAMS,
} from '@/constants/urls';

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
  const [jsonInput, setJsonInput] = useState('');
  const [processedData, setProcessedData] = useState<any>(null);

  const getInstagramUserId = async (username: string) => {
    try {
      const response = await fetch(`/api/get-user-info?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      return data.userId;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGenerateUrl = async () => {
    if (!url) {
      toast.error('Please provide a URL');
      return;
    }

    try {
      const urlObj = new URL(url);

      if (urlObj.protocol) {
        urlObj.search = '';

        let finalUrl;

        if (url.includes('instagram')) {
          if (url.includes(`${INSTAGRAM_POSTPAGE_REGEX}`) || url.includes(`${INSTAGRAM_REELSPAGE_REGEX}`)) {
            finalUrl = `${url}${INSTAGRAM_URL_PARAMS}`;
          } else if (INSTAGRAM_HIGHLIGHTSPAGE_REGEX.test(url)) {
            const match = url.match(INSTAGRAM_HIGHLIGHT_ID_REGEX);

            if (match && match[1]) {
              finalUrl = INSTAGRAM_GRAPHQL_URL_FOR_HIGHLIGHTS.replace('<HIGHLIGHT_ID>', match[1] as any);
            }
          } else if (INSTAGRAM_USERNAME_REGEX_FOR_STORIES.test(url)) {
            const usernameMatch = url.match(INSTAGRAM_USERNAME_REGEX_FOR_STORIES);
            const username: any = usernameMatch && usernameMatch[1];

            const userId = await getInstagramUserId(username);

            finalUrl = INSTAGRAM_GRAPHQL_URL_FOR_STORIES.replace('<USER_ID>', userId as any);
          } else {
            const usernameMatch = url.match(INSTAGRAM_USERNAME_REGEX_FOR_PROFILE);
            const username: any = usernameMatch && usernameMatch[1];

            const userId = await getInstagramUserId(username);

            finalUrl = INSTAGRAM_GRAPHQL_URL_FOR_STORIES.replace('<USER_ID>', userId as any);
          }
          if (finalUrl) {
            setGeneratedUrl(finalUrl);
          } else {
            toast.error('Failed to generate URL. Please check the input and try again.');
          }
        } else {
          toast.error('Invalid URL. Must be an Instagram URL.');
        }
      } else {
        toast.error('Invalid URL format');
      }
    } catch (error) {
      toast.error('Invalid URL format');
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
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        onBlur={handleGenerateUrl}
      />

      <div className={styles.description}>
        Copy the generated link and open it in a new tab. Then copy the JSON output from the tab
      </div>
      <Input
        placeholder="Generated URL"
        value={generatedUrl}
        disabled={!generatedUrl}
        readOnly
        onCopy={() => {
          copyToClipboard(generatedUrl);
        }}
      />

      <div className={styles.description}>
        Paste the JSON data into the input below. You will then be redirected to result page 🎉
      </div>
      <TextArea placeholder="Paste JSON Data" onChange={handleJsonPaste} value={jsonInput} />

      <HowToUse />
    </div>
  );
};

export default Home;
