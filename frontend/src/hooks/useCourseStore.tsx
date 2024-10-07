import { CourseInfo } from "@/types/course";
import { create } from "zustand";

type CourseStore = {
	courses: CourseInfo[];
	isPending: boolean;
	isError: boolean;
	setIsError: (isPending: boolean) => void;
	setIsPending: (isPending: boolean) => void;
	setCourses: (courses: CourseInfo[]) => void;
};

const useCourseStore = create<CourseStore>()((set) => ({
	courses: [],
	isPending: false,
	isError: false,
	setIsError: (isPending) => set({ isPending }),
	setIsPending: (isPending) => set({ isPending }),
	setCourses: (courses) => set(() => ({ courses })),
}));

export default useCourseStore;
