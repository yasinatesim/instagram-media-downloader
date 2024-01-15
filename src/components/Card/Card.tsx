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


  const [base64Image, setBase64Image] = useState(null);

  // Resmi base64'e çevirme fonksiyonu
  const urlToBase64 = async (url: string) => {
    try {
      // Resmi fetch ile al
      const response = await fetch(url);

      // Response'un içeriğini blob olarak al
      const blob = await response.blob();

      // Blob'u base64'e çevir
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('An error occurred while converting image to base64:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Base64'e çevrilen resmi al
    urlToBase64(imageUrl)
      .then((base64Image) => {
        setBase64Image(base64Image as any);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
          <img crossOrigin="anonymous" width={300} src={base64Image} alt={`Image ${imageUrl}`} />
          <div className={styles.icon}>{hasVideo ? <IconVideoPreview /> : <IconImage />}</div>
        </a>
      </div>
    </div>
  );
};

export default Card;
