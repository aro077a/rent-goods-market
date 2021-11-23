import { CSSProperties } from "react";

export const getBackgroundImageStyle = (url: string): CSSProperties | undefined =>
  url ? { backgroundImage: `url(${url})` } : undefined;
