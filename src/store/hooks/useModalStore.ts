import { create } from 'zustand';

import { ModalState } from '../types';

const useModalStore = create<ModalState>((set) => ({
  type: 'MODAL_NONE',
  props: {},
  closeModal: () => set({ type: 'MODAL_NONE', props: {} }),
  openModal: (type: string, props: any) => set({ type, props }),
}));

export default useModalStore;
