import { CourseInfo } from "@/types/course";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const fetch = async (courseId: string) => {
	const response = await ky
		.get(`${import.meta.env.VITE_BASE_URL}/course/${courseId}`)
		.json<CourseInfo[]>();

	return response;
};

const useFetch = (courseId: string) => {
	return useQuery({
		queryKey: ["course", courseId],
		queryFn: () => fetch(courseId),
	});
};

export default useFetch;
