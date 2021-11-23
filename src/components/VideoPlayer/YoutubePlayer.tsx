import React from "react";

const YoutubePlayer = ({ videoId }: { videoId: string }) => {
  return (
    <iframe
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"
      allow="accelerometer; 
    autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default YoutubePlayer;
