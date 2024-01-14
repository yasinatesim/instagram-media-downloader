export type CounterState = {
  count: number;
  decrement: () => void;
  increment: () => void;
};

export type ModalState = {
  type: string;
  props: any;
  openModal: Function;
  closeModal: Function;
};
