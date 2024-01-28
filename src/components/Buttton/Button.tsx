import React from 'react';

import cx from 'classnames';

import css from './Button.module.scss';

type Classnames = {
  container?: string;
};

type Props = {
  classnames?: Classnames;
  type?: 'button' | 'submit' | 'reset' | undefined;
  size?: 'medium' | 'large';
  shape?: 'circle';
  variant?: 'primary' | 'secondary';
  width?: number | string;
};

const Button: React.FC<Props & Omit<React.HTMLProps<HTMLButtonElement>, 'size'>> = ({
  children,
  classnames,
  size = 'medium',
  style,
  shape,
  variant = 'primary',
  type = 'button',
  width,
  ...props
}) => {
  const cn: Classnames = {
    container: cx(css.container, css[variant], css[size], shape && css[shape], classnames?.container),
  };

  return (
    <button
      className={cn.container}
      style={{
        width: width ?? '',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
