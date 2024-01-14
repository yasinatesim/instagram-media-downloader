'use client';
import React, { useState } from 'react';

import useModalStore from '@/store/hooks/useModalStore';

import Button from '@/components/Button';
import Counter from '@/components/Counter';
import Dropdown from '@/components/Dropdown';
import { MODAL_AUTH } from '@/components/Modal/constants';

const Home = () => {
  const modalStore = useModalStore();

  const [openDropdown, setOpenDropdown] = useState(false);

  const handleOpenAuthModal = () => {
    modalStore.openModal(MODAL_AUTH);
  };

  return (
    <div>
      <Counter />

      <hr />

      <Button variant="primary" onClick={handleOpenAuthModal}>
        Open Modal
      </Button>

      <hr />

      <Dropdown open={openDropdown}>
        <Dropdown.Button onClick={() => setOpenDropdown(!openDropdown)}>Open Dropdown</Dropdown.Button>
        <Dropdown.Items>
          <Dropdown.Item>item 1</Dropdown.Item>
          <Dropdown.Item>item 2</Dropdown.Item>
          <Dropdown.Item>item 3</Dropdown.Item>
          <Dropdown.Item>item 4</Dropdown.Item>
        </Dropdown.Items>
      </Dropdown>
    </div>
  );
};

export default Home;
