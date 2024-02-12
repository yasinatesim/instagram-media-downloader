'use client';
import { useEffect, useRef, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import toast from 'react-hot-toast';

import axios from 'axios';

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

import IconX from '@/assets/icons/icon-x.svg';

import fetchProxyImage from '@/services/fetch-proxy-image';

import Button from '@/components/Buttton/Button';
import Gallery from '@/components/Galllery/Gallery';
import HowToUse from '@/components/HowToUse';
import Input from '@/components/Input';
import Tab from '@/components/Tab';
import TextArea from '@/components/TextArea';

import styles from './Home.module.scss';

const Home: React.FC = () => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [url, setUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState<any>(null);

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [profilePicture, setProfilePicture] = useState<any>(null);
  const [processedData, setProcessedData] = useState<any>(null);

  // Profile Picture Tab
  const [username, setUsername] = useState('');
  const [prevUsername, setPrevUsername] = useState('');
  const [isLoadingForProfilePicture, setIsLoadingForProfilePicture] = useState(false);

  // For LocalStorage
  const [generatedUrls, setGeneratedUrls] = useState<any>([]);

  const handleSaveLocalStorage = ({ url, page, username }: { url: string; page: string; username: string }) => {
    const isUrlExists = generatedUrls.some((item: any) => item.url === url);

    if (!isUrlExists) {
      const updatedGeneratedUrls = [
        ...generatedUrls,
        {
          url,
          page,
          username,
        },
      ];
      setGeneratedUrls(updatedGeneratedUrls);
      localStorage.setItem('generatedUrls', JSON.stringify(updatedGeneratedUrls));
    }
  };

  const getInstagramUserId = async (username: string) => {
    if (!executeRecaptcha) {
      toast.error('Execute recaptcha not available yet');
      return;
    }

    try {
      const token = await executeRecaptcha();
      if (!token) {
        throw new Error('Unable to retrieve reCAPTCHA token.');
      }

      const response = await axios.post(
        '/api/get-user-id',
        { username, token },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
          },
          maxRedirects: 0,
        }
      );

      const data = response.data;

      return data.userId;
    } catch (error: any) {
      toast.error(`API error: ${error.response?.data.error.message ?? error.message}`);
    }
  };

  const handleGenerateUrl = async () => {
    setPrevUrl(url);

    if (!url) {
      toast.error('Please provide a URL');
      return;
    }

    const urlObj = new URL(url);

    if (urlObj.protocol) {
      urlObj.search = '';

      let finalUrl;

      if (url !== prevUrl) {
        if (url.includes('instagram')) {
          if (
            urlObj.href.includes(`${INSTAGRAM_POSTPAGE_REGEX}`) ||
            urlObj.href.includes(`${INSTAGRAM_REELSPAGE_REGEX}`)
          ) {
            finalUrl = `${urlObj.href}${INSTAGRAM_URL_PARAMS}`;
          } else if (INSTAGRAM_HIGHLIGHTSPAGE_REGEX.test(urlObj.href)) {
            const match = urlObj.href.match(INSTAGRAM_HIGHLIGHT_ID_REGEX);

            if (match && match[1]) {
              finalUrl = INSTAGRAM_GRAPHQL_URL_FOR_HIGHLIGHTS.replace('<HIGHLIGHT_ID>', match[1] as any);
            }
          } else if (INSTAGRAM_USERNAME_REGEX_FOR_STORIES.test(urlObj.href)) {
            const usernameMatch = urlObj.href.match(INSTAGRAM_USERNAME_REGEX_FOR_STORIES);
            const username: any = usernameMatch && usernameMatch[1];

            const userId = await getInstagramUserId(username);

            if (userId) {
              finalUrl = INSTAGRAM_GRAPHQL_URL_FOR_STORIES.replace('<USER_ID>', userId as any);
              handleSaveLocalStorage({ page: 'Stories', url: finalUrl, username });
            }
          } else {
            const usernameMatch = urlObj.href.match(INSTAGRAM_USERNAME_REGEX_FOR_PROFILE);
            const username: any = usernameMatch && usernameMatch[1];

            const userId = await getInstagramUserId(username);

            if (userId) {
              finalUrl = INSTAGRAM_GRAPHQL_URL_FOR_STORIES.replace('<USER_ID>', userId as any);
              handleSaveLocalStorage({ page: 'Profile', url: finalUrl, username });
            }
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
        toast.error('The URL cannot be the same as the previous one');
      }
    } else {
      toast.error('Invalid URL format');
    }
  };

  const handleJsonPaste = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJsonInput(event.target.value);
    setProcessedData(event.target.value);
  };

  const handleSubmitForProfilePicture = async () => {
    if (prevUsername !== username) {
      if (!executeRecaptcha) {
        toast.error('Execute recaptcha not available yet');
        return;
      }

      try {
        const token = await executeRecaptcha();
        if (!token) {
          throw new Error('Unable to retrieve reCAPTCHA token.');
        }

        setIsLoadingForProfilePicture(true);

        const response = await axios.post(
          '/api/get-profile-picture',
          { username, token },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json, text/plain, */*',
            },
            maxRedirects: 0,
          }
        );

        const data = response.data;

        const image = await fetchProxyImage(data.url);

        setPrevUsername(username);
        setProfilePicture({
          image,
          url: data.url,
        });
        setIsLoadingForProfilePicture(false);
      } catch (error: any) {
        toast.error(`API error: ${error.response?.data.error.message ?? error.message}`);
        setIsLoadingForProfilePicture(false);
      }
    } else {
      toast.error('The username cannot be the same as the previous one');
    }
  };

  const handleDeleteItem = (url: string) => {
    const updatedGeneratedUrls = generatedUrls.filter((item: any) => item.url !== url);
    setGeneratedUrls(updatedGeneratedUrls);
    localStorage.setItem('generatedUrls', JSON.stringify(updatedGeneratedUrls));
  };

  useEffect(() => {
    if (isCopied) {
      toast.success('Copied');
    }
  }, [isCopied]);

  useEffect(() => {
    const storedGeneratedUrls = localStorage.getItem('generatedUrls');
    if (storedGeneratedUrls) {
      setGeneratedUrls(JSON.parse(storedGeneratedUrls));
    }
  }, []);

  if (processedData) {
    const parsedData = JSON.parse(processedData);

    return <Gallery result={parsedData} />;
  }

  return (
    <div className="container">
      <h2>Instagram Media Downloader</h2>

      <Tab>
        <Tab.Content tab="Story, Highlights, Reels and Post">
          <div className={styles.description}>Please enter Instagram story or reels or post url</div>
          <Input
            placeholder="Enter URL"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            onBlur={handleGenerateUrl}
          />

          {generatedUrls && (
            <details className={styles.recentItemsContainer}>
              <summary className={styles.recentItemsSummary}>Recent Items</summary>
              {Array.from(new Set(generatedUrls.map((item: any) => item.page))).map((category, categoryIndex) => {
                const categoryItems = generatedUrls.filter((item: any) => item.page === category);

                return (
                  <div key={categoryIndex} className={styles.categoryContainer}>
                    <h3 className={styles.categoryTitle}>{category as string}</h3>
                    <div className={styles.localStorageItems}>
                      {categoryItems.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className={styles.itemContainer}>
                          <Button variant="primary" onClick={() => copyToClipboard(item.url)}>
                            {item.username}
                          </Button>
                          <div onClick={() => handleDeleteItem(item.url)}>
                            <IconX className={styles.deleteIcon} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </details>
          )}

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
        </Tab.Content>

        <Tab.Content tab="Profile Picture">
          <div className={styles.description}>Please enter Instagram username below input</div>

          <Input
            placeholder="Enter Instagram Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />

          <Button
            variant="secondary"
            disabled={!username || username === prevUsername || isLoadingForProfilePicture}
            onClick={handleSubmitForProfilePicture}
          >
            Submit
          </Button>

          <br />
          <br />

          {profilePicture && (
            <a href={profilePicture.url}>
              <img width={300} src={profilePicture.image} alt="" />
            </a>
          )}
        </Tab.Content>
      </Tab>
    </div>
  );
};

export default Home;
