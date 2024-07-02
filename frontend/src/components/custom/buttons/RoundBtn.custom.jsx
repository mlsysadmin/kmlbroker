import { Button } from "antd";
import React from "react";

const RoundBtn = ({ label, style, className, type, beforeIcon, afterIcon }) => {
  return (
    <Button
      type={type}
      shape="round"
      className={className}
      style={style}
    >
      {beforeIcon}
      {label}
      {afterIcon}
    </Button>
  );
};

export default RoundBtn;
