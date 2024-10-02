import { convertVTTTimeToSeconds } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const fetchVTT = async (url: string) => {
  const response = await ky.get(url).text();
  return parseVTT(response);
};

const parseVTT = (vttData: any) => {
  const cues = [];
  const lines = vttData.split("\n");

  let startTime = "";
  let endTime = "";
  let text = "";

  lines.forEach((line: any) => {
    const timeMatch = line.match(
      /(\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}\.\d{3})/
    );
    if (timeMatch) {
      if (startTime && endTime && text) {
        cues.push({
          startTime: convertVTTTimeToSeconds(startTime),
          endTime: convertVTTTimeToSeconds(endTime),
          text,
        });
      }
      startTime = timeMatch[1];
      endTime = timeMatch[2];
      text = "";
    } else {
      // Append text to the current cue
      text += (text ? " " : "") + line.trim(); // Trim to remove excess whitespace
    }
  });

  // Push the last cue if it exists
  if (startTime && endTime && text) {
    cues.push({
      startTime: convertVTTTimeToSeconds(startTime),
      endTime: convertVTTTimeToSeconds(endTime),
      text,
    });
  }

  return cues;
};

const useFetchCues = (src: string, recordId: string) => {
  return useQuery({
    queryKey: ["cues", recordId],
    queryFn: () => fetchVTT(src),
  });
};

export default useFetchCues;
