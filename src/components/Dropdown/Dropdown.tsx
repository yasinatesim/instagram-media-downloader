import React, { ReactNode } from 'react';

type DropdownProps = {
  children: ReactNode;
  open: boolean;
};

type ItemsProps = {
  children: ReactNode;
};

type ItemProps = {
  children: ReactNode;
};

const Dropdown: React.FC<DropdownProps> & {
  Button: React.FC<any>;
  Items: React.FC<ItemsProps>;
  Item: React.FC<ItemProps>;
} = ({ children, open, ...props }) => {
  const button = React.Children.toArray(children).find(
    (c) => React.isValidElement(c) && (c as any).type === Dropdown.Button
  );
  const items = React.Children.toArray(children).find(
    (c) => React.isValidElement(c) && (c as any).type === Dropdown.Items
  );

  return (
    <div {...props}>
      {button}
      {open && items}
    </div>
  );
};

const Button: React.FC<any> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const Items: React.FC<ItemsProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const Item: React.FC<ItemProps> = ({ children, ...props }) => {
  return <p {...props}>{children}</p>;
};

Dropdown.Button = Button;
Dropdown.Items = Items;
Dropdown.Item = Item;

export default Dropdown;
