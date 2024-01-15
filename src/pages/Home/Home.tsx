'use client';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import {
  INSTAGRAM_POSTPAGE_REGEX,
  INSTAGRAM_REELSPAGE_REGEX,
  INSTAGRAM_USERNAME_REGEX_FOR_STORIES,
} from '@/constants/regexes';
import { INSTAGRAM_GRAPHQL_URL, INSTAGRAM_PROFILE_URL, INSTAGRAM_URL_PARAMS } from '@/constants/urls';

import { useCopyToClipboard } from '@/hooks';

import Card from '@/components/Card/Card';
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

    const url = event.target.value;

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

    if (parsedData?.data?.reels_media) {
      return (
        <>
          {parsedData?.data?.reels_media?.[0].items.map((item: any, key: string) => (
            <Card
              key={key}
              imageUrl={item?.display_url}
              hasVideo={item?.video_resources}
              videoUrl={item?.video_resources?.[0]?.src}
            />
          ))}
        </>
      );
    }

    if (parsedData?.items?.[0]?.carousel_media) {
      return (
        <>
          {parsedData.items?.[0].carousel_media.map((item: any, key: string) => (
            <Card
              key={key}
              imageUrl={item?.image_versions2.candidates[0]?.url}
              hasVideo={item?.video_versions}
              videoUrl={item?.video_versions[0]?.url}
            />
          ))}
        </>
      );
    } else {
      return (
        <Card
          imageUrl={parsedData?.items?.[0]?.image_versions2?.candidates?.[0]?.url}
          hasVideo={parsedData?.items?.[0]?.video_versions}
          videoUrl={parsedData?.items?.[0]?.video_versions?.[0].url}
        />
      );
    }
  }

  return (
    <div className={styles.container}>
      <Input placeholder="Enter URL" value={url} onChange={handleUrlChange} />

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
          <TextArea placeholder="Paste JSON Data" onChange={handleStoriesUrlChange} value={storiesUrl} />

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

      <TextArea placeholder="Paste JSON Data" onChange={handleJsonPaste} value={jsonInput} />
    </div>
  );
};

export default Home;
