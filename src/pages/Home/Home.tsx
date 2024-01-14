'use client';
import { useState } from 'react';

import IconCopy from '@/assets/icons/icon-copy.svg';

import { getGeneratedUrlData } from '@/services/generate-url';

import styles from './Home.module.scss';

const Home: React.FC = () => {
  const [url, setUrl] = useState('https://www.instagram.com/stories/emreyucelen/3279503570960145858/');
  // const [url, setUrl] = useState('https://www.instagram.com/p/C1m0389NMlg/');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [generatedStoriesUrl, setGeneratedStoriesUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [processedData, setProcessedData] = useState<any>(null);

  const [storiesUrl, setStoriesUrl] = useState('');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

	const handleStoriesUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setStoriesUrl(event.target.value)

    const parsedValue = JSON.parse(event.target.value);

    const url = `https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables={"reel_ids":["${parsedValue.graphql.user.id}"],"tag_names":[],"location_ids":[],"highlight_reel_ids":[],"precomposed_overlay":false,"show_story_viewer_list":true,"story_viewer_fetch_count":50,"story_viewer_cursor":""}`;

    setGeneratedStoriesUrl(url);
  };

  const handleGenerateUrl = async () => {
    try {
      if (!url) {
        // Handle the case where URL is not provided
        console.error('Please provide a URL');
        return;
      }

      let finalUrl;

      if (url.includes('instagram')) {
        // Fetch post and reels
        if (url.includes('/p/') || url.includes('/reel/')) {
          finalUrl = `${url}?__a=1&__d=dis`;
        } else {
          // Fetch stories
          const usernameMatch = url.match(/instagram\.com\/stories\/([^/]+)\//);
          const username = usernameMatch && usernameMatch[1];

          finalUrl = `https://www.instagram.com/${username}?__a=1&__d=dis`;
        }

        // Use the final URL as needed
        console.log('Final URL:', finalUrl);

        // You can set the generated URL state here if needed
        setGeneratedUrl(finalUrl);
      } else {
        console.error('Invalid URL. Must be an Instagram URL.');
      }
    } catch (error) {
      console.error('An error occurred while processing the request:', error);
    }
  };

  const handleJsonPaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value);
    setProcessedData(event.target.value);
  };

  const handleCopyClick = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
    }
  };

  const handleCoyStoriesUrl = () => {
    if (generatedStoriesUrl) {
      navigator.clipboard.writeText(generatedStoriesUrl);
    }
  };

  if (processedData) {
    const parsedData = JSON.parse(processedData);


    // for stories
    if (parsedData.data.reels_media) {
      return (
        <>
        {parsedData.data.reels_media[0].items.map((item: any, key: string) => (
          <>
            <img
              crossOrigin="anonymous"
              key={`${item.display_url} ${key}`}
              width={300}
              src={item.display_url}
              alt={`Image ${key}`}
            />
            {item.video_resources && <video autoPlay src={item.video_resources[0].src}></video>}
          </>
        ))}
        </>
      )
    } else {

   // for post & reels
   if (parsedData.items[0].carousel_media) {
    return (
      <>
        {parsedData.items[0].carousel_media.map((item: any, key: string) => (
          <>
            <img
              crossOrigin="anonymous"
              key={`${item.image_versions2.candidates[0].url} ${key}`}
              width={300}
              src={item.image_versions2.candidates[0].url}
              alt={`Image ${key}`}
            />
            {item.video_versions && <video autoPlay src={item.video_versions[0].url}></video>}
          </>
        ))}
      </>
    );
  } else {
    return (
      <>
        <img
          crossOrigin="anonymous"
          key={`${parsedData.items[0].image_versions2.candidates[0].url}`}
          width={300}
          src={parsedData.items[0].image_versions2.candidates[0].url}
          alt={`Image`}
        />

        {parsedData.items[0].video_versions && (
          <video autoPlay src={parsedData.items[0].video_versions[0].url}></video>
        )}
      </>
    );
  }

    }
  }

  if (!processedData) {
    return (
      <div className={styles.container}>
        <div className={styles.generateInput}>
          <input type="text" placeholder="Enter URL" value={url} onChange={handleUrlChange} className={styles.input} />
          <button className={styles.button} onClick={handleGenerateUrl} disabled={!url}>
            Generate URL
          </button>
        </div>

        <div className={styles.copyInput}>
          <input type="text" placeholder="Generated URL" value={generatedUrl} className={styles.input} readOnly />
          <button className={styles.copyButton} onClick={handleCopyClick} disabled={!generatedUrl}>
            <IconCopy />
          </button>
        </div>

        {url.includes('stories') && (
          <>
            <div className={styles.storiesInput}>
              <textarea
                placeholder="Paste user JSON data"
                onChange={handleStoriesUrlChange}
                value={storiesUrl}
                className={styles.textarea}
              />
            </div>

            <div className={styles.copyInput}>
              <input
                type="text"
                placeholder="Generated URL"
                value={generatedStoriesUrl}
                className={styles.input}
                readOnly
              />
              <button className={styles.copyButton} onClick={handleCoyStoriesUrl} disabled={!generatedStoriesUrl}>
                <IconCopy />
              </button>
            </div>
          </>
        )}

        <div className={styles.description}>{/* Add description here */}</div>
        <textarea
          placeholder="Paste JSON data"
          onChange={handleJsonPaste}
          value={jsonInput}
          className={styles.textarea}
        />
      </div>
    );
  }
};

export default Home;
