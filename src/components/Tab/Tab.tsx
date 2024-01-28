// Tab.tsx
import React, { ReactNode, useState } from 'react';

import cx from 'classnames';

import Button from '@/components/Buttton';

import styles from './Tab.module.scss';

interface TabProps {
  children: ReactNode;
}

interface ContentProps {
  tab: ReactNode | string;
  children: ReactNode;
}

const Tab: React.FC<TabProps> & { Content: React.FC<ContentProps> } = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(1);

  const contents = React.Children.toArray(children).filter((c: any) => c.type === Tab.Content);

  const activeContent = contents[activeIndex];

  return (
    <>
      <div className={styles.buttons}>
        {contents.map((content, key) => (
          <div key={key}>
            <Button
              onClick={() => setActiveIndex(key)}
              classnames={{
                container: cx({
                  [styles.active]: activeIndex === key,
                }),
              }}
            >
              {/* @ts-ignore */}
              {content.props.tab}
            </Button>
          </div>
        ))}
      </div>

      {activeContent}
    </>
  );
};

const Content: React.FC<ContentProps> = ({ children }) => {
  return <div className={styles.tabs}>{children}</div>;
};

Tab.Content = Content;

export default Tab;
