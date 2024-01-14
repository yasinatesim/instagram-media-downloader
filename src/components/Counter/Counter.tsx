'use client';
import React from 'react';

import useCounterStore from '@/store/hooks/useCounterStore';
import { CounterState } from '@/store/types';

import Button from '@/components/Button';

import css from './Counter.module.scss';

const Counter = () => {
  const counterStore = useCounterStore() as CounterState;

  return (
    <div className={css.counter}>
      <Button
        classnames={{
          container: css.button,
        }}
        variant="secondary"
        onClick={() => counterStore.decrement()}
        disabled={counterStore.count === 0}
      >
        Decrement
      </Button>
      <div className={css.value}>{counterStore.count}</div>
      <Button
        classnames={{
          container: css.button,
        }}
        variant="primary"
        onClick={() => counterStore.increment()}
      >
        Increment
      </Button>
    </div>
  );
};

export default Counter;
