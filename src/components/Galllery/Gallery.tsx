import { useEffect, useState } from 'react';

import IconImage from '@/assets/icons/icon-image.svg';
import IconVideo from '@/assets/icons/icon-video.svg';
import IconVideoPreview from '@/assets/icons/icon-video-preview.svg';

import Card from '@/components/Card';
import ResultProcessor from '@/components/ResultProcessor';

import styles from './Gallery.module.scss';

type Props = {
  result: any;
  isAdditionalResult?: boolean;
  endCursor?: string;
  username?: string;
};

const AdditionalResults: React.FC<{ results: any[] }> = ({ results }) => {
  if (!results.length) return null;

  return (
    <div className={styles.additionalResults}>
      <h3>Additional Results</h3>
      {results.map((result, index) => {
        if (result?.data?.xdt_shortcode_media) {
          return (
            <div key={index} className={styles.additionalResult}>
              <Gallery result={{ items: [result.data.xdt_shortcode_media] }} isAdditionalResult={true} />
            </div>
          );
        }

        if (result?.data?.xdt_api__v1__feed__user_timeline_graphql_connection?.edges) {
          const edges = result.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges;
          const items = edges.map((edge: any) => edge.node);
          return (
            <div key={index} className={styles.additionalResult}>
              <Gallery result={{ items }} isAdditionalResult={true} />
            </div>
          );
        }

        return (
          <div key={index} className={styles.additionalResult}>
            <Gallery result={result} isAdditionalResult={true} />
          </div>
        );
      })}
    </div>
  );
};

const Gallery = ({ result, isAdditionalResult = false, endCursor, username }: Props) => {
  const [additionalResults, setAdditionalResults] = useState<any[]>([]);

  const handleJsonProcessed = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      setAdditionalResults((prev) => [...prev, parsedData]);
    } catch (e) {
      console.error('Failed to parse JSON', e);
    }
  };

  if (isAdditionalResult) {
    if (result?.data?.xdt_shortcode_media) {
      const wrappedResult = { items: [result.data.xdt_shortcode_media] };
      return renderGalleryContent(wrappedResult, true, undefined, undefined, endCursor);
    }

    if (result?.data?.xdt_api__v1__feed__user_timeline_graphql_connection?.edges) {
      const edges = result.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges;
      const items = edges.map((edge: any) => edge.node);
      return renderGalleryContent({ items }, true, undefined, undefined, endCursor);
    }

    return renderGalleryContent(result, true, undefined, undefined, endCursor);
  }

  return renderGalleryContent(result, false, handleJsonProcessed, additionalResults, endCursor, username);
};

const renderGalleryContent = (
  result: any,
  isAdditionalResult: boolean,
  handleJsonProcessed?: (jsonData: string) => void,
  additionalResults?: any[],
  endCursor?: string,
  username?: string
) => {
  if (result?.data?.reels_media) {
    return (
      <div className="container">
        {!isAdditionalResult && <Gallery.Description />}
        {result?.data?.reels_media?.[0].items.map((item: any, key: string) => (
          <Card
            key={isAdditionalResult ? `additional-${key}` : key}
            index={key + 1}
            imageUrl={item?.display_url}
            hasVideo={item?.video_resources}
            videoUrl={item?.video_resources?.[0]?.src}
          />
        ))}
        {!isAdditionalResult && additionalResults && <AdditionalResults results={additionalResults} />}
        {!isAdditionalResult && handleJsonProcessed && (
          <ResultProcessor onJsonProcessed={handleJsonProcessed} endCursor={endCursor} username={username} />
        )}
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
        {!isAdditionalResult && <Gallery.Description />}
        <Card imageUrl={imageUrl} hasVideo={hasVideo} videoUrl={videoUrl} />
        {!isAdditionalResult && additionalResults && <AdditionalResults results={additionalResults} />}
        {!isAdditionalResult && handleJsonProcessed && (
          <ResultProcessor onJsonProcessed={handleJsonProcessed} endCursor={endCursor} username={username} />
        )}
      </div>
    );
  }

  if (result?.items?.[0]?.__typename === 'XDTGraphSidecar' && result?.items?.[0]?.edge_sidecar_to_children?.edges) {
    const edges = result.items[0].edge_sidecar_to_children.edges;
    return (
      <div className="container">
        {!isAdditionalResult && <Gallery.Description />}
        {edges.map((edge: any, key: number) => {
          const node = edge.node;
          const imageUrl = node.display_url || node.thumbnail_src;
          const hasVideo = !!node.video_url;
          const videoUrl = node.video_url || '';
          return (
            <Card
              key={isAdditionalResult ? `additional-${key}` : key}
              index={key + 1}
              imageUrl={imageUrl}
              hasVideo={hasVideo}
              videoUrl={videoUrl}
            />
          );
        })}
        {!isAdditionalResult && additionalResults && <AdditionalResults results={additionalResults} />}
        {!isAdditionalResult && handleJsonProcessed && (
          <ResultProcessor onJsonProcessed={handleJsonProcessed} endCursor={endCursor} username={username} />
        )}
      </div>
    );
  }

  if (result?.items?.[0]?.__typename === 'XDTMediaDict' || result?.items?.[0]?.media_type) {
    return (
      <div className="container">
        {!isAdditionalResult && <Gallery.Description />}
        {result.items.map((item: any, key: number) => {
          // Carousel post ise
          if (item.media_type === 8 && item.carousel_media) {
            return item.carousel_media.map((carouselItem: any, ckey: number) => (
              <Card
                key={isAdditionalResult ? `additional-${key}-${ckey}` : `${key}-${ckey}`}
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
                key={isAdditionalResult ? `additional-${key}` : key}
                index={key + 1}
                imageUrl={item?.image_versions2?.candidates?.[0]?.url}
                hasVideo={item?.video_versions}
                videoUrl={item?.video_versions?.[0]?.url}
              />
            );
          }

          return (
            <Card
              key={isAdditionalResult ? `additional-${key}` : key}
              index={key + 1}
              imageUrl={item?.image_versions2?.candidates?.[0]?.url}
              hasVideo={false}
              videoUrl={''}
            />
          );
        })}
        {!isAdditionalResult && additionalResults && <AdditionalResults results={additionalResults} />}
        {!isAdditionalResult && handleJsonProcessed && (
          <ResultProcessor onJsonProcessed={handleJsonProcessed} endCursor={endCursor} username={username} />
        )}
      </div>
    );
  }

  if (result?.items?.[0]?.carousel_media) {
    return (
      <div className="container">
        {!isAdditionalResult && <Gallery.Description />}
        {result.items?.[0].carousel_media.map((item: any, key: string) => (
          <Card
            key={isAdditionalResult ? `additional-${key}` : key}
            index={key + 1}
            imageUrl={item?.image_versions2.candidates[0]?.url}
            hasVideo={item?.video_versions}
            videoUrl={item?.video_versions?.[0]?.url}
          />
        ))}
        {!isAdditionalResult && additionalResults && <AdditionalResults results={additionalResults} />}
        {!isAdditionalResult && handleJsonProcessed && (
          <ResultProcessor onJsonProcessed={handleJsonProcessed} endCursor={endCursor} username={username} />
        )}
      </div>
    );
  } else {
    return (
      <div className="container">
        {!isAdditionalResult && <Gallery.Description />}
        <Card
          imageUrl={result?.items?.[0]?.image_versions2?.candidates?.[0]?.url}
          hasVideo={result?.items?.[0]?.video_versions}
          videoUrl={result?.items?.[0]?.video_versions?.[0]?.url}
        />
        {!isAdditionalResult && additionalResults && <AdditionalResults results={additionalResults} />}
        {!isAdditionalResult && handleJsonProcessed && (
          <ResultProcessor onJsonProcessed={handleJsonProcessed} endCursor={endCursor} username={username} />
        )}
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
