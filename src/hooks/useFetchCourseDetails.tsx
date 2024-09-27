import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const fetchCourse = async (courseid: number) => {
  const response = await ky
    .get(`api/local/news/get-course.php?courseid=${courseid}`)
    .json();
  return response;
};

const useFetchCourseDetails = (courseid: number) => {
  return useQuery({
    queryKey: ["course-details", courseid],
    queryFn: () => fetchCourse(courseid),
  });
};

export default useFetchCourseDetails;
