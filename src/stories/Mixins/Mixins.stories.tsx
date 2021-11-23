import React, { useCallback, useState } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { Mixins } from "./CONSTANTS";

export default {
  title: "Global/Mixins",
} as Meta;

import "./Mixins.less";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useCopyToClipboard = (text: string) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(text)
      .then(() => setIsCopied(true))
      .then(() => sleep(1500))
      .then(() => setIsCopied(false))
      .then(() => false)
      .catch((err) => console.error(err));
  }, [text]);

  return { copyToClipboard, isCopied };
};

type MixinProps = {
  mixin: string;
};

const Mixin: React.FC<MixinProps> = ({ mixin }) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard(mixin);

  return (
    <div className="mixins-container__mixin">
      <p className={mixin.slice(1)}>{mixin}</p>
      <button type="button" onClick={copyToClipboard}>
        {isCopied ? "Copied!" : "Copy to clipboard"}
      </button>
    </div>
  );
};

export const All: Story = () => (
  <div className="mixins-container">
    {Mixins.map((mixin) => (
      <Mixin key={mixin} mixin={mixin} />
    ))}
  </div>
);
