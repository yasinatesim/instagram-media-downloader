import React from 'react';

import IconImage from '@/assets/icons/icon-image.svg';
import IconVideo from '@/assets/icons/icon-video.svg';
import IconVideoPreview from '@/assets/icons/icon-video-preview.svg';

import styles from './Card.module.scss';

type Props = {
  imageUrl: string;
  hasVideo: boolean;
  videoUrl: string;
};

const Card: React.FC<Props> = ({ imageUrl, hasVideo, videoUrl }) => {
  return (
    <div className={styles.container}>
      <a href={imageUrl} target="_blank" className={styles.image}>
        <img crossOrigin="anonymous" width={300} src={imageUrl} alt={`Image ${imageUrl}`} />
        <div className={styles.icon}>
          {hasVideo ? <IconVideoPreview /> :<IconImage />}
        </div>
      </a>
      {hasVideo && (
        <a href={videoUrl} target="_blank" className={styles.video}>
          <video width={300} src={videoUrl} autoPlay muted />
          <div className={styles.icon}>
            <IconVideo />
          </div>
        </a>
      )}
    </div>
  );
};

export default Card;
