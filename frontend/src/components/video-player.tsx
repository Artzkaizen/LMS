import { useRef, useEffect, useState } from "react";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	Minimize,
	PictureInPicture,
} from "lucide-react";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "./ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useVideoStore } from "@/hooks/useVideoStore";
import { cn } from "@/lib/utils";

export default function VideoPlayer({ src }: { src: string }) {
	const player = useVideoStore();

	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<HTMLDivElement>(null);
	const [showControls, setShowControls] = useState(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const updateTime = () => player.setCurrentTime(video.currentTime);
		const updateDuration = () => player.setDuration(video.duration);

		video.addEventListener("timeupdate", updateTime);
		video.addEventListener("loadedmetadata", updateDuration);
		video.addEventListener("enterpictureinpicture", () =>
			player.setPictureInPicture(true)
		);
		video.addEventListener("leavepictureinpicture", () =>
			player.setPictureInPicture(false)
		);

		return () => {
			video.removeEventListener("timeupdate", updateTime);
			video.removeEventListener("loadedmetadata", updateDuration);
			video.removeEventListener("enterpictureinpicture", () =>
				player.setPictureInPicture(true)
			);
			video.removeEventListener("leavepictureinpicture", () =>
				player.setPictureInPicture(false)
			);
		};
	}, [player.setCurrentTime, player.setDuration, player.setPictureInPicture]);

	useEffect(() => {
		const resetTimeout = () => {
			// Clear existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Show the button on interaction
			setShowControls(true);

			// Hide the button after 3 seconds of no interaction
			timeoutRef.current = setTimeout(() => {
				setShowControls(false);
			}, 1000);
		};

		// Add mousemove and play event listeners
		const player = playerRef.current;
		if (player) {
			player.addEventListener("mousemove", resetTimeout);
			player.addEventListener("play", resetTimeout);
		}

		// Clean up event listeners and timeout
		return () => {
			if (player) {
				player.removeEventListener("mousemove", resetTimeout);
				player.removeEventListener("play", resetTimeout);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	// Toggle play and pause
	const togglePlay = () => {
		if (videoRef.current) {
			if (player.isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			player.setPlaying(!player.isPlaying);
		}
	};

	// Handle volume change
	const handleVolumeChange = (newVolume: number[]) => {
		const volumeValue = newVolume[0];
		player.setVolume(volumeValue);
		if (videoRef.current) {
			videoRef.current.volume = volumeValue;
		}
	};

	// Handle seek in video
	const handleSeek = (newTime: number[]) => {
		const seekTime = newTime[0];
		player.setCurrentTime(seekTime);
		if (videoRef.current) {
			videoRef.current.currentTime = seekTime;
		}
	};

	// Toggle fullscreen
	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			playerRef.current?.requestFullscreen();
			player.setFullscreen(true);
		} else {
			document.exitFullscreen();
			player.setFullscreen(false);
		}
	};

	const handlePlaybackRateChange = (rate: string) => {
		const newRate = parseFloat(rate);
		player.setPlaybackRate(newRate);
		if (videoRef.current) {
			videoRef.current.playbackRate = newRate;
		}
	};

	// Toggle Picture-in-Picture mode
	const togglePictureInPicture = async () => {
		if (!document.pictureInPictureElement) {
			try {
				if (videoRef.current) {
					await videoRef.current.requestPictureInPicture();
				}
			} catch (error) {
				console.error("Picture-in-Picture failed:", error);
			}
		} else {
			await document.exitPictureInPicture();
		}
	};

	// Format time for display (hours:minutes:seconds)
	const formatTime = (time: number) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = Math.floor(time % 60);

		return hours > 0
			? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
			: `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	return (
		<div
			ref={playerRef}
			className={`relative max-w-7xl mx-auto bg-gray-900 rounded-lg overflow-hidden ${
				player.isFullscreen
					? "fixed inset-0 z-50 max-w-none mx-0 rounded-none"
					: ""
			}`}
		>
			<div className="relative w-full h-0 pb-[56.25%]">
				<video
					ref={videoRef}
					onClick={togglePlay}
					className="absolute top-0 left-0 w-full h-full object-contain cursor-pointer"
					src={src}
				/>
				<div
					className={cn(
						`absolute bottom-0 left-0 right-0 bg-gradient-to-t bg-secondary/10 from-black/50 to-transparent p-2
					 	transition-transform duration-500 ease-in-out
						${showControls ? "translate-y-0" : "translate-y-20"}`
					)}
				>
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							size="icon"
							onClick={togglePlay}
							className="text-white"
						>
							{player.isPlaying ? (
								<Pause className="h-6 w-6" />
							) : (
								<Play className="h-6 w-6" />
							)}
						</Button>

						<div className="flex w-4/5 mx-auto gap-2">
							<span className="text-white text-sm font-medium">
								{formatTime(player.currentTime)}
							</span>
							<Slider
								value={[player.currentTime]}
								max={player.duration}
								step={1}
								onValueChange={handleSeek}
								className="flex-grow"
							/>
							<span className="text-white font-medium text-sm">
								{formatTime(player.duration)}
							</span>
						</div>

						<div className="flex items-center space-x-2 ml-auto">
							<div className="relative group/volume">
								<Button
									variant="ghost"
									size="icon"
									onClick={() =>
										handleVolumeChange([player.volume === 0 ? 1 : 0])
									}
									className="text-white"
								>
									{player.volume === 0 ? (
										<VolumeX className="h-6 w-6" />
									) : (
										<Volume2 className="h-6 w-6" />
									)}
								</Button>
								<div className="absolute hidden group-hover/volume:flex group-focus-within/volume:flex flex-col bg-white items-center left-1/2 -translate-x-1/2 h-24 -top-28 p-2 rounded-md transition-all duration-300 ease-in-out group/slider group/slider group-hover/volume:delay-[0ms] group-focus-within/volume:delay-[0ms] delay-100">
									<Slider
										value={[player.volume]}
										max={1}
										step={0.1}
										onValueChange={handleVolumeChange}
										orientation="vertical"
										className="h-full group-hover/slider:cursor-pointer"
									/>
								</div>
							</div>

							<Select
								onValueChange={handlePlaybackRateChange}
								value={player.playbackRate.toString()}
							>
								<SelectTrigger className="w-fit text-white">
									<SelectValue placeholder="Speed" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0.5">0.5x</SelectItem>
									<SelectItem value="1">1x</SelectItem>
									<SelectItem value="1.5">1.5x</SelectItem>
									<SelectItem value="2">2x</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="ghost"
								size="icon"
								onClick={togglePictureInPicture}
								className="text-white"
							>
								<PictureInPicture className="h-6 w-6" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleFullscreen}
								className="text-white"
							>
								{player.isFullscreen ? (
									<Minimize className="h-6 w-6" />
								) : (
									<Maximize className="h-6 w-6" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
