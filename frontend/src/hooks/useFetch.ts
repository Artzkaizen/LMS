import { CourseInfo } from "@/routes/__root";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

// const apiUrl = import.meta.env.VITE_BASE_URL;

export const fetch = async (courseId: string) => {
	const response = await ky
		.get(`${import.meta.env.VITE_BASE_URL}?${courseId}`)
		.json<CourseInfo[]>();

	return response;
};

const useFetch = (courseId: string) => {
	return useQuery({
		queryKey: ["fetch"],
		queryFn: () => fetch(courseId),
	});
};

export default useFetch;
