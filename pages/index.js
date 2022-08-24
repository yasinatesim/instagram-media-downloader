import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

function Home() {
  const [value, setValue] = useState('');
  const [formSubmit, setFormSubmit] = useState(false);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    if (value !== '') {
      setFormSubmit(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/${value}`);
      const { url } = await res.json();
      window.location.href = url;

      setFormSubmit(false);
      setValue('');
    }
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      <Helmet
        title="Instagram Profile Picture Full Resolution"
        meta={[{ property: 'og:title', content: 'Instagram Profile Picture Full Resolution' }]}
      />

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
              style={{
                enableBackground: 'new 0 0 50 50',
              }}
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
