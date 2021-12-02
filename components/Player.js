import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtoms";
import { useRecoilState } from "recoil";
import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const spoitfyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrenrtSong = () => {
    if (!songInfo) {
      spoitfyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing:", data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);

        spoitfyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spoitfyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spoitfyApi.pause();
        setIsPlaying(false);
      } else {
        spoitfyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spoitfyApi.getAccessToken() && !currentTrackId) {
      fetchCurrenrtSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spoitfyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spoitfyApi.setVolume(volume);
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px- md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* center */}
      <div className="flex justify-evenly items-center">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          // onClick={() => spoitfyApi.skipToPrevious()}}
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon
          // onClick={() => spoitfyApi.skipToNext()}
          className="button"
        />
        <ReplyIcon className="button" />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-14 md:w-28"
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
