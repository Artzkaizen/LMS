import CourseTabs from "@/components/course-tabs";
import Video from "@/components/video-player";
import useCourseStore from "@/hooks/useCourseStore";
import useFetchCues from "@/hooks/useFetchCues";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/course/$courseid")({
	component: () => <CourseComponent />,
});

function CourseComponent() {
	const { courseid } = Route.useParams();
	// const { data, error, isPending } = useFetchCourseDetails(parseInt(courseid));
	const { courses } = useCourseStore();
	const cues = useFetchCues("/video.vtt", courseid);

	const course = courses.find(
		(course) => course.record_id === courseid.split("-")[0]
	);

	console.log(course?.recording_id);

	return (
		<section className="w-full h-full">
			{course?.recording_id && (
				<Video
					src={`https://vroom.b-trend.media/presentation/${course.recording_id}/video/webcams.webm`}
				/>
			)}
			<CourseTabs
				course={course}
				cues={cues.data || []}
				isError={cues.isError}
				isPending={cues.isPending}
			/>
		</section>
	);
}
