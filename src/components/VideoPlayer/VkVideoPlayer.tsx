import React from "react";

const VkVideoPlayer = ({ videoId }: { videoId: string }) => {
  const videoIdParts = videoId.split("_");
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://vk.com/video_ext.php?oid=${videoIdParts[0]}&id=${videoIdParts[1]}&hash=86eb43d5a8fecc67`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default VkVideoPlayer;
