import React from "react";
import YoutubePlayer from "./YoutubePlayer";
import VimeoPlayer from "./VimeoPlayer";

import "./style.less";
import VkVideoPlayer from "./VkVideoPlayer";

const VideoPlayer = ({
  videoId,
  videoType,
}: {
  videoId: string;
  videoType: "YOUTUBE" | "VIMEO" | "VK" | string;
}): React.ReactElement => {
  switch (videoType) {
    case "YOUTUBE":
      return <YoutubePlayer videoId={videoId} />;
    case "VIMEO":
      return <VimeoPlayer videoId={videoId} />;
    case "VK":
      return <VkVideoPlayer videoId={videoId} />;
    default:
      return null;
  }
};

export default VideoPlayer;
