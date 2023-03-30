import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import Head from 'next/head';

import axios from 'axios';

function Home() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [value, setValue] = useState('');
  const [formSubmit, setFormSubmit] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    if (!executeRecaptcha) {
      return;
    }

    try {
      const token = await executeRecaptcha();
      if (!token) {
        return;
      }

      if (value !== '') {
        setFormSubmit(true);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api`, {
          username: value,
          token,
        });
        const { url } = await res.data;
        window.location.href = url;

        setFormSubmit(false);
        setValue('');
      }
    } catch (error: any) {
      alert(`API error: ${error.response?.data?.message ?? error.message}`);
      setFormSubmit(false);
      setValue('');
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
            disabled={formSubmit}
            value={value}
          />
          <label htmlFor="text" title="Enter Instagram Username" data-title="Username" />
          <button
            type="button"
            className={`form-btn ${formSubmit ? 'loading-start' : ''}`}
            onClick={handleSubmit}
            disabled={formSubmit}
          >
            <span>Submit</span>
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="20px"
              height="26px"
              viewBox="0 0 24 30"
              xmlSpace="preserve"
            >
              <rect x={0} y={13} width={4} height={5} fill="#333">
                <animate
                  attributeName="height"
                  attributeType="XML"
                  values="5;21;5"
                  begin="0s"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  attributeType="XML"
                  values="13; 5; 13"
                  begin="0s"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x={10} y={13} width={4} height={5} fill="#333">
                <animate
                  attributeName="height"
                  attributeType="XML"
                  values="5;21;5"
                  begin="0.15s"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  attributeType="XML"
                  values="13; 5; 13"
                  begin="0.15s"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x={20} y={13} width={4} height={5} fill="#333">
                <animate
                  attributeName="height"
                  attributeType="XML"
                  values="5;21;5"
                  begin="0.3s"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  attributeType="XML"
                  values="13; 5; 13"
                  begin="0.3s"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </rect>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
