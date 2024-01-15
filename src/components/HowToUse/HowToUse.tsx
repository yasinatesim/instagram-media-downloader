import React from 'react';

import howToUseImage1 from '@/assets/images/how-to-use-1.jpg';
import howToUseImage2 from '@/assets/images/how-to-use-2.jpg';
import howToUseImage3 from '@/assets/images/how-to-use-3.jpg';
import howToUseImage4 from '@/assets/images/how-to-use-4.jpg';

import styles from "./HowToUse.module.scss"

type Props = {};

const HowToUse = (props: Props) => {
  return (
    <div className={styles.container}>
      <h3>How To Use</h3>
      <ol>
        <li>
          <p>Copy Instagram url</p>
          <img src={howToUseImage1.src} alt="" />
        </li>
        <li>
          <p>Paste your url first input in page</p>
          <img src={howToUseImage2.src} alt="" />
        </li>
        <li>
          <p>Select and copy all JSON code in the tab</p>
          <img src={howToUseImage3.src} alt="" />
        </li>
        <li>
          <p>Paste the code in the input. You will then be redirected to result page</p>
          <img src={howToUseImage4.src} alt="" />
        </li>
      </ol>
    </div>
  );
};

export default HowToUse;
