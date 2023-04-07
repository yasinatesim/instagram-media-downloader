import React from "react";

function IconLoading() {
  return <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width="20px"
    height="26px"
    viewBox="0 0 24 30"
    xmlSpace="preserve"
  >
    <rect x={0} y={13} width={4} height={5} fill="#333">
      <animate
        attributeName="height"
        attributeType="XML"
        values="5;21;5"
        begin="0s"
        dur="0.6s"
        repeatCount="indefinite" />
      <animate
        attributeName="y"
        attributeType="XML"
        values="13; 5; 13"
        begin="0s"
        dur="0.6s"
        repeatCount="indefinite" />
    </rect>
    <rect x={10} y={13} width={4} height={5} fill="#333">
      <animate
        attributeName="height"
        attributeType="XML"
        values="5;21;5"
        begin="0.15s"
        dur="0.6s"
        repeatCount="indefinite" />
      <animate
        attributeName="y"
        attributeType="XML"
        values="13; 5; 13"
        begin="0.15s"
        dur="0.6s"
        repeatCount="indefinite" />
    </rect>
    <rect x={20} y={13} width={4} height={5} fill="#333">
      <animate
        attributeName="height"
        attributeType="XML"
        values="5;21;5"
        begin="0.3s"
        dur="0.6s"
        repeatCount="indefinite" />
      <animate
        attributeName="y"
        attributeType="XML"
        values="13; 5; 13"
        begin="0.3s"
        dur="0.6s"
        repeatCount="indefinite" />
    </rect>
  </svg>;
}

export default IconLoading;
