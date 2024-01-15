import React from 'react';

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
          <img crossOrigin="anonymous" decoding="auto" sizes='300px' style={{objectFit: 'cover'}} width={300} src={imageUrl} alt={`Image ${imageUrl}`} />
          <div className={styles.icon}>{hasVideo ? <IconVideoPreview /> : <IconImage />}</div>
        </a>
      </div>
    </div>
  );
};

export default Card;
