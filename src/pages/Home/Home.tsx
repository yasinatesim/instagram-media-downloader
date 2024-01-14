'use client';
import { useState } from 'react';

import IconCopy from '@/assets/icons/icon-copy.svg';

import { getGeneratedUrlData } from '@/services/generate-url';

import styles from './Home.module.scss';

const Home: React.FC = () => {
  // const [url, setUrl] = useState('https://www.instagram.com/stories/deryaulugg/3279384278947054768/');
  const [url, setUrl] = useState('https://www.instagram.com/p/C1m0389NMlg/');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [processedData, setProcessedData] = useState<any>(null);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleGenerateUrl = async () => {
    const data: any = await getGeneratedUrlData(url);
    setGeneratedUrl(data.url);
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

  if (processedData) {
		const parsedData = JSON.parse(processedData);

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

					{parsedData.items[0].video_versions && <video autoPlay src={parsedData.items[0].video_versions[0].url}></video>}
        </>
      );
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
