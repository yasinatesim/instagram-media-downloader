import React, { useEffect, useState } from 'react';

import cx from 'classnames';

import IconImage from '@/assets/icons/icon-image.svg';
import IconVideo from '@/assets/icons/icon-video.svg';
import IconVideoPreview from '@/assets/icons/icon-video-preview.svg';

import fetchProxyImage from '@/services/fetch-proxy-image';

import styles from './Card.module.scss';

type Props = {
  index?: string | number;
  imageUrl: string;
  hasVideo: boolean;
  videoUrl: string;
};

const Card: React.FC<Props> = ({ index, imageUrl, hasVideo, videoUrl }) => {
  const [proxyImageUrl, setProxyImageUrl] = useState<string | null>(null);

  const handleFetchProxyImage = async () => {
    const data = await fetchProxyImage(imageUrl);
    setProxyImageUrl(data);
  };

  useEffect(() => {
    handleFetchProxyImage();
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
          {proxyImageUrl ? (
            <>
              <img width={300} src={proxyImageUrl} alt={`Image ${imageUrl}`} />
              <div className={styles.icon}>{hasVideo ? <IconVideoPreview /> : <IconImage />}</div>
            </>
          ) : (
            <span className={styles.loader} />
          )}
        </a>
      </div>
    </div>
  );
};

export default Card;
