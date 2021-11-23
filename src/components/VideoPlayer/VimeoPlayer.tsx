import React from "react";

const VimeoPlayer = ({ videoId }: { videoId: string }) => {
  return (
    <iframe
      src={`https://player.vimeo.com/video/${videoId}`}
      width="100%"
      height="100%"
      frameBorder="0"
      title=""
      allowFullScreen
      webkitallowfullscreen
      mozallowfullscreen
    ></iframe>
  );
};

export default VimeoPlayer;
