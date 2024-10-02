// CourseComponent.js

import CourseTabs, { Cue } from "@/components/course-tabs";
import VideoPlayer, { type TVideoPlayer } from "@/components/video-player";
import useFetchCourseDetails from "@/hooks/useFetchCourseDetails";
import useFetchCues from "@/hooks/useFetchCues";
import { fetchVTT } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  console.log(videoPlayer);

  return (
    <>
      <VideoPlayer
        src="https://vroom.b-trend.media/presentation/0f4b940570be40500a8292009543612cbddd1220-1712208348558/video/webcams.mp4"
        onReady={handlePlayerReady}
      />
      <CourseTabs
        cues={cues.data || []}
        isError={cues.isError}
        isPending={cues.isPending}
        videoPlayer={videoPlayer}
        onTranscriptClick={handleTranscriptClick}
      />
    </>
  );
}
