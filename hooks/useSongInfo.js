import useSpotify from "./useSpotify";
import { currentTrackIdState } from "../atoms/songAtoms";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";

function useSongInfo() {
  const spotfyApi = useSpotify();
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) { 
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotfyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setSongInfo(trackInfo);
      } 
    };

    fetchSongInfo();
  }, [currentIdTrack, spotfyApi]);

  return songInfo;
}

export default useSongInfo;
