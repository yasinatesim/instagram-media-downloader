'use client';
import React from 'react';

import IconClose from '@/assets/icons/icon-close.svg';

import useModalStore from '@/store/hooks/useModalStore';
import { ModalState } from '@/store/types';

import modalTypes from './types';

import css from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
};

const Dialog: React.FC<ModalProps> = ({ children }) => {
  const modalStore = useModalStore() as ModalState;

  return (
    <div>
      <div className={css.modal} onClick={() => modalStore.closeModal()}>
        <div className={css.popup} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
};

function render(type: React.ReactNode) {
  switch (type) {
    default:
      // @ts-ignore
      return modalTypes[type] || null;
  }
}

const Container = () => {
  const modalStore = useModalStore() as ModalState;

  const Component = render(modalStore?.type);

  const handleClose = () => {
    modalStore.closeModal();
  };

  const closeButton = (
    <div onClick={handleClose} className={css.close}>
      <IconClose />
    </div>
  );

  if (!Component) {
    return null;
  }

  return (
    <Dialog {...modalStore.props}>
      <Component closeButton={closeButton} {...modalStore.props} />
    </Dialog>
  );
};

export default Container;
