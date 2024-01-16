import React, { useEffect, useState } from 'react';

import cx from 'classnames';

import IconImage from '@/assets/icons/icon-image.svg';
import IconVideo from '@/assets/icons/icon-video.svg';
import IconVideoPreview from '@/assets/icons/icon-video-preview.svg';

import styles from './Card.module.scss';

type Props = {
  index?: string;
  imageUrl: string;
  hasVideo: boolean;
  videoUrl: string;
};

const Card: React.FC<Props> = ({ index, imageUrl, hasVideo, videoUrl }) => {

  const [proxyImageUrl, setProxyImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProxyImage = async () => {
        // Proxy sunucu URL'i
        const proxyServerUrl = '/api/proxy-image?url=';

        // Resmin proxy üzerinden alınmış URL'i
        const response = await fetch(proxyServerUrl + encodeURIComponent(imageUrl));
        const data = await response.json();

        if (data.imageUrl) {
          setProxyImageUrl(data.imageUrl);
        }
    };

    fetchProxyImage();
  }, [imageUrl]);



  return (
    <div className={styles.container}>
      <div className={styles.index}>{index}.</div>
      <div className={styles.gallery}>
        {hasVideo && (
          <a href={videoUrl} target="_blank" className={styles.video}>
            <video width={300} src={videoUrl} autoPlay muted />
            <div className={styles.icon}>
              <IconVideo />
            </div>
          </a>
        )}

        <a
          href={imageUrl}
          target="_blank"
          className={cx(styles.image, {
            [styles.hasVideo]: hasVideo,
          })}
        >
          {/* <img crossOrigin="anonymous" width={300} src={imageUrl} alt={`Image ${imageUrl}`} /> */}

          {proxyImageUrl ? (
            <img width={300} src={proxyImageUrl} alt={`Image ${imageUrl}`} />
          ) : (
            <p>Loading...</p>
          )}

          <div className={styles.icon}>{hasVideo ? <IconVideoPreview /> : <IconImage />}</div>
        </a>
      </div>
    </div>
  );
};

export default Card;
