import React from 'react';

import Button from '@/components/Button/Button';

import css from './Auth.module.scss';

type Props = {
  closeButton: React.ReactNode;
};

const Auth: React.FC<Props> = ({ closeButton }) => {
  return (
    <div className={css.container}>
      {closeButton}

      <div className={css.title}>Giriş Yap</div>

      <p className={css.description}>Devam edebilmek için lütfen giriş yapın</p>

      <Button width="100%">Giriş Yap</Button>
    </div>
  );
};

export default Auth;
