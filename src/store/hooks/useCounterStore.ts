import { create } from 'zustand';

import { CounterState } from '../types';

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  decrement: () => set((state) => ({ count: state.count - 1 })),
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

export default useCounterStore;
