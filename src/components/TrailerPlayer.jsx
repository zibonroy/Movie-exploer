import { useEffect, useId, useRef, useState } from "react";
import {
  ExternalLink,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  Volume2,
  VolumeX,
} from "lucide-react";

let youtubeApiPromise = null;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve) => {
    const finish = () => resolve();

    if (window.YT?.Player) {
      finish();
      return;
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      finish();
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }

    const poll = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(poll);
        finish();
      }
    }, 100);
  });

  return youtubeApiPromise;
}

export default function TrailerPlayer({ videoId, title, watchUrl }) {
  const playerMountId = useId().replace(/:/g, "");
  const shellRef = useRef(null);
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeApi().then(() => {
      if (cancelled) {
        return;
      }

      playerRef.current = new window.YT.Player(playerMountId, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          controls: 0,
          fs: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            if (cancelled) {
              return;
            }

            event.target.setVolume(100);
            event.target.unMute();
            event.target.playVideo();
            setReady(true);
            setPlaying(true);
            setMuted(false);
            setVolume(100);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId, playerMountId]);

  function withPlayer(action) {
    const player = playerRef.current;
    if (!ready || !player?.getPlayerState) {
      return;
    }
    action(player);
  }

  function togglePlay() {
    withPlayer((player) => {
      const state = player.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });
  }

  function applyVolume(nextVolume) {
    const clamped = Math.min(100, Math.max(0, nextVolume));
    setVolume(clamped);
    withPlayer((player) => {
      player.unMute();
      player.setVolume(clamped);
      setMuted(clamped === 0);
    });
  }

  function toggleMute() {
    withPlayer((player) => {
      if (player.isMuted() || volume === 0) {
        const restore = volume === 0 ? 50 : volume;
        player.unMute();
        player.setVolume(restore);
        setVolume(restore);
        setMuted(false);
      } else {
        player.mute();
        setMuted(true);
      }
    });
  }

  function stepVolume(delta) {
    applyVolume(volume + delta);
  }

  function enterFullscreen() {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    if (shell.requestFullscreen) {
      shell.requestFullscreen();
    } else if (shell.webkitRequestFullscreen) {
      shell.webkitRequestFullscreen();
    }
  }

  const controlsDisabled = !ready;

  return (
    <div className="overflow-hidden rounded-xl bg-black">
      <div
        ref={shellRef}
        className="relative w-full bg-black pb-[56.25%]"
      >
        <div
          id={playerMountId}
          className="absolute inset-0 h-full w-full"
          title={title}
        />
      </div>

      <div className="space-y-3 border-t border-white/10 bg-gray-900 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={togglePlay}
            disabled={controlsDisabled}
            aria-label={playing ? "Pause trailer" : "Play trailer"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition enabled:active:scale-95 enabled:hover:bg-white/20 disabled:opacity-40"
          >
            {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            disabled={controlsDisabled}
            aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition enabled:active:scale-95 enabled:hover:bg-white/20 disabled:opacity-40"
          >
            {muted || volume === 0 ? (
              <VolumeX size={20} />
            ) : (
              <Volume2 size={20} />
            )}
          </button>

          <button
            type="button"
            onClick={() => stepVolume(-10)}
            disabled={controlsDisabled}
            aria-label="Decrease volume"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition enabled:active:scale-95 enabled:hover:bg-white/20 disabled:opacity-40"
          >
            <Minus size={20} />
          </button>

          <button
            type="button"
            onClick={() => stepVolume(10)}
            disabled={controlsDisabled}
            aria-label="Increase volume"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition enabled:active:scale-95 enabled:hover:bg-white/20 disabled:opacity-40"
          >
            <Plus size={20} />
          </button>

          <div className="flex min-w-0 flex-1 basis-full items-center gap-3 sm:basis-auto">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={muted ? 0 : volume}
              disabled={controlsDisabled}
              onChange={(e) => applyVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-2 min-w-0 flex-1 cursor-pointer accent-red-500 disabled:opacity-40"
            />
            <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-300">
              {muted ? 0 : volume}%
            </span>
          </div>

          <button
            type="button"
            onClick={enterFullscreen}
            disabled={controlsDisabled}
            aria-label="Fullscreen"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition enabled:active:scale-95 enabled:hover:bg-white/20 disabled:opacity-40 sm:ml-auto"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition active:bg-white/10 sm:hidden"
        >
          <ExternalLink size={16} />
          Open in YouTube
        </a>
      </div>
    </div>
  );
}
