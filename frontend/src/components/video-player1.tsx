import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export type TVideoPlayer = typeof videojs.players;

interface VideoPlayerProps {
	src: string;
	onReady: (player: TVideoPlayer) => void;
}

export const InitPlayer = ({
	options,
	onReady,
}: {
	options: typeof videojs.options;
	onReady: (player: TVideoPlayer) => void;
}) => {
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<TVideoPlayer | null>(null);

	useEffect(() => {
		if (!playerRef.current) {
			const videoElement = document.createElement("video-js");
			videoElement.classList.add("vjs-big-play-centered");
			videoRef.current?.appendChild(videoElement);

			const player = (playerRef.current = videojs(videoElement, options, () => {
				onReady(player);
			}));
		} else {
			const player = playerRef.current;
			// player.autoplay(options.autoplay);
			player.src(options.sources);
		}
		playerRef.current.fluid(true);
		playerRef.current.aspectRatio("4:3");
	}, [options]);

	useEffect(() => {
		const player = playerRef.current;
		return () => {
			if (player && !player.isDisposed()) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, []);

	return (
		<div
			// className="vjs-fluid"
			style={{ width: "1040px", height: "600px" }}
			ref={videoRef}
		/>
	);

	// Set fixed width and height
};

const VideoPlayer = ({ src, onReady }: VideoPlayerProps) => {
	const videoJsOptions = {
		// autoplay: true,
		controls: true,
		responsive: true,
		fluid: true,
		sources: [
			{
				src: src,
				type: "video/mp4",
			},
		],
	};

	return <InitPlayer options={videoJsOptions} onReady={onReady} />;
};

export default VideoPlayer;
