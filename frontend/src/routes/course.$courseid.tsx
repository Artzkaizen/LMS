// CourseComponent.js

import CourseTabs from "@/components/course-tabs";
import VideoPlayer, { type TVideoPlayer } from "@/components/video-player1";
import Video from "@/components/video-player";
import useFetchCues from "@/hooks/useFetchCues";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/course/$courseid")({
	component: () => <CourseComponent />,
});

function CourseComponent() {
	const { courseid } = Route.useParams();
	// const { data, error, isPending } = useFetchCourseDetails(parseInt(courseid));
	const cues = useFetchCues("/video.vtt", courseid);
	const [videoPlayer, setVideoPlayer] = useState<TVideoPlayer | null>(null);

	const handlePlayerReady = (player: TVideoPlayer) => {
		setVideoPlayer(player);
	};

	const handleTranscriptClick = (startTime: number) => {
		if (videoPlayer) {
			videoPlayer.currentTime(startTime);
			videoPlayer.play();
		}
	};

	return (
		<section className="w-full h-full">
			<div>
				{/* <VideoPlayer
					src="https://vroom.b-trend.media/presentation/0f4b940570be40500a8292009543612cbddd1220-1712208348558/video/webcams.mp4"
					onReady={handlePlayerReady}
				/> */}
				{/* <Video
					className="w"
					src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
				></Video> */}
				<Video src="https://vroom.b-trend.media/presentation/0f4b940570be40500a8292009543612cbddd1220-1712208348558/video/webcams.mp4" />
			</div>
			<CourseTabs
				courseid={courseid.split("-")[0]}
				cues={cues.data || []}
				isError={cues.isError}
				isPending={cues.isPending}
				onTranscriptClick={handleTranscriptClick}
			/>
		</section>
	);
}
