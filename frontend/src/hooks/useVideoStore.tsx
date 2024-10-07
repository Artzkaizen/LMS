import { create } from "zustand";

interface VideoState {
	isPlaying: boolean;
	volume: number;
	currentTime: number;
	duration: number;
	isFullscreen: boolean;
	isPictureInPicture: boolean;
	playbackRate: number;
	setPlaying: (isPlaying: boolean) => void;
	setVolume: (volume: number) => void;
	setCurrentTime: (time: number) => void;
	setDuration: (duration: number) => void;
	setFullscreen: (isFullscreen: boolean) => void;
	setPictureInPicture: (isPictureInPicture: boolean) => void;
	setPlaybackRate: (rate: number) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
	isPlaying: false,
	volume: 1,
	currentTime: 0,
	duration: 0,
	isFullscreen: false,
	isPictureInPicture: false,
	playbackRate: 1,
	setPlaying: (isPlaying) => set({ isPlaying }),
	setVolume: (volume) => set({ volume }),
	setCurrentTime: (currentTime) => set({ currentTime }),
	setDuration: (duration) => set({ duration }),
	setFullscreen: (isFullscreen) => set({ isFullscreen }),
	setPictureInPicture: (isPictureInPicture) => set({ isPictureInPicture }),
	setPlaybackRate: (playbackRate) => set({ playbackRate }),
}));
