import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import Head from 'next/head';

import axios from 'axios';

import { IconLoading } from '@/assets/icons';

function Home() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    if (!executeRecaptcha || isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const token = await executeRecaptcha();
      if (!token) {
        throw new Error('Unable to retrieve reCAPTCHA token.');
      }

      if (value !== '') {
        const res = await axios.post(`/api`, {
          username: value,
          token,
        });
        const { url } = await res.data;
        window.location.href = url;

        setValue('');
      }
    } catch (error: any) {
      alert(`API error: ${error.response?.data?.message ?? error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <Head>
        <title>Instagram Profile Picture Full Resolution</title>
        <meta name="og:title" content="Instagram Profile Picture Full Resolution" />
      </Head>

      <div className="container">
        <div className="field">
          <input
            type="text"
            required
            autoComplete="off"
            id="text"
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            value={value}
          />
          <label htmlFor="text" title="Enter Instagram Username" data-title="Username" />
          <button
            type="button"
            className={`form-btn ${isLoading ? 'loading-start' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <span>Submit</span>
            <IconLoading />
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
