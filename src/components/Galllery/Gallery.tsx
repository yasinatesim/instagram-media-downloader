import React from 'react';

import IconImage from '@/assets/icons/icon-image.svg';
import IconVideo from '@/assets/icons/icon-video.svg';
import IconVideoPreview from '@/assets/icons/icon-video-preview.svg';

import Card from '@/components/Card';

import styles from './Gallery.module.scss';

type Props = {
  result: any;
};

const Gallery = ({ result }: Props) => {
  if (result?.data?.reels_media) {
    return (
      <div className="container">
        <Gallery.Description />
        {result?.data?.reels_media?.[0].items.map((item: any, key: string) => (
          <Card
            key={key}
            index={key + 1}
            imageUrl={item?.display_url}
            hasVideo={item?.video_resources}
            videoUrl={item?.video_resources?.[0]?.src}
          />
        ))}
      </div>
    );
  }

  // Instagram GraphQL Post (xdt_shortcode_media) and Sidecar (multi-image/video) support
  if (result?.items?.[0]?.__typename === 'XDTGraphImage' || result?.items?.[0]?.__typename === 'XDTGraphVideo') {
    const post = result.items[0];
    const imageUrl = post.display_url || post.thumbnail_src;
    const hasVideo = !!post.video_url;
    const videoUrl = post.video_url || '';
    return (
      <div className="container">
        <Gallery.Description />
        <Card imageUrl={imageUrl} hasVideo={hasVideo} videoUrl={videoUrl} />
      </div>
    );
  }

  if (result?.items?.[0]?.__typename === 'XDTGraphSidecar' && result?.items?.[0]?.edge_sidecar_to_children?.edges) {
    const edges = result.items[0].edge_sidecar_to_children.edges;
    return (
      <div className="container">
        <Gallery.Description />
        {edges.map((edge: any, key: number) => {
          const node = edge.node;
          const imageUrl = node.display_url || node.thumbnail_src;
          const hasVideo = !!node.video_url;
          const videoUrl = node.video_url || '';
          return <Card key={key} index={key + 1} imageUrl={imageUrl} hasVideo={hasVideo} videoUrl={videoUrl} />;
        })}
      </div>
    );
  }

  if (result?.items?.[0]?.__typename === 'XDTMediaDict' || result?.items?.[0]?.media_type) {
    return (
      <div className="container">
        <Gallery.Description />
        {result.items.map((item: any, key: number) => {
          // Carousel post ise
          if (item.media_type === 8 && item.carousel_media) {
            return item.carousel_media.map((carouselItem: any, ckey: number) => (
              <Card
                key={`${key}-${ckey}`}
                index={ckey + 1}
                imageUrl={carouselItem?.image_versions2?.candidates?.[0]?.url}
                hasVideo={carouselItem?.video_versions}
                videoUrl={carouselItem?.video_versions?.[0]?.url}
              />
            ));
          }

          if (item.media_type === 2 && item.video_versions) {
            return (
              <Card
                key={key}
                index={key + 1}
                imageUrl={item?.image_versions2?.candidates?.[0]?.url}
                hasVideo={item?.video_versions}
                videoUrl={item?.video_versions?.[0]?.url}
              />
            );
          }

          return (
            <Card
              key={key}
              index={key + 1}
              imageUrl={item?.image_versions2?.candidates?.[0]?.url}
              hasVideo={false}
              videoUrl={''}
            />
          );
        })}
      </div>
    );
  }

  if (result?.items?.[0]?.carousel_media) {
    return (
      <div className="container">
        <Gallery.Description />
        {result.items?.[0].carousel_media.map((item: any, key: string) => (
          <Card
            key={key}
            index={key + 1}
            imageUrl={item?.image_versions2.candidates[0]?.url}
            hasVideo={item?.video_versions}
            videoUrl={item?.video_versions?.[0]?.url}
          />
        ))}
      </div>
    );
  } else {
    return (
      <div className="container">
        <Gallery.Description />
        <Card
          imageUrl={result?.items?.[0]?.image_versions2?.candidates?.[0]?.url}
          hasVideo={result?.items?.[0]?.video_versions}
          videoUrl={result?.items?.[0]?.video_versions?.[0].url}
        />
      </div>
    );
  }
};

const Description: React.FC = () => {
  return (
    <div>
      <div className={styles.description}>
        *
        <div className={styles.icon}>
          <IconImage />
        </div>
        <div>
          for post and story <strong>image</strong>
        </div>
      </div>
      <div className={styles.description}>
        *
        <div className={styles.icon}>
          <IconVideoPreview />
        </div>
        <div>
          for post video <strong>capture</strong> image or reels <strong>capture</strong> image
        </div>
      </div>
      <div className={styles.description}>
        *
        <div className={styles.icon}>
          <IconVideo />
        </div>
        <div>
          for post, story and reels <strong>video</strong>
        </div>
      </div>

      <p>Click on the image or video and the highest resolution version opens in a new tab</p>
      <p>
        <strong>Note</strong>: All videos are muted
      </p>

      <h2>Result</h2>
    </div>
  );
};

Gallery.Description = Description;

export default Gallery;
