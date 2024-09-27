import { cn, formatTime } from "@/lib/utils";
import { type TVideoPlayer } from "@/components/video-player";
import { useEffect, useState } from "react";

const tabs = [
  { id: "transcript", label: "Transcript" },
  { id: "notes", label: "Notes" },
  { id: "downloads", label: "Downloads" },
  { id: "discuss", label: "Discuss" },
];

export interface Cue {
  startTime: number;
  endTime: number;
  text: string;
}

interface CourseTabsProps {
  cues: Cue[];
  isError: boolean;
  isPending: boolean;
  videoPlayer: TVideoPlayer | null;
  onTranscriptClick: (startTime: number) => void;
}

export default function CourseTabs({
  cues,
  isError,
  isPending,
  videoPlayer,
  onTranscriptClick,
}: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState("transcript");
  const [activeCueIndex, setActiveCueIndex] = useState(-1);

  const updateActiveCueIndex = () => {
    if (videoPlayer) {
      const current = videoPlayer.currentTime();
      const index = cues.findIndex(
        (cue) => current >= cue.startTime && current <= cue.endTime
      );
      setActiveCueIndex(index!);
    }
  };

  useEffect(() => {
    if (videoPlayer) {
      // Set the active cue on player readiness
      updateActiveCueIndex();
      // Listen for time updates
      videoPlayer.on("timeupdate", updateActiveCueIndex);
    }

    return () => {
      if (videoPlayer) {
        videoPlayer.off("timeupdate", updateActiveCueIndex); // Clean up the listener
      }
    };
  }, [videoPlayer, cues]);

  if (isError) return <div>Error Fetching transcript</div>;
  return (
    <div className="w-full mx-auto">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full py-4 px-1 text-center border-b-2 font-medium text-sm",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 transition-all duration-300 ease-in-out"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className=" w-full mt-4 p-4 h-[50vh] overflow-auto">
        {activeTab === "transcript" && (
          <div>
            <h2 className="text-lg font-semibold">Transcript</h2>
            <div className="space-y-4">
              {isPending ? (
                <div>Loading....</div>
              ) : (
                cues?.map((cue, index) => (
                  <div
                    key={index}
                    className={`flex cursor-pointer ${
                      activeCueIndex === index ? "bg-blue-100" : ""
                    }`} // Highlight active cue
                    onClick={() => onTranscriptClick(cue.startTime)}
                  >
                    <span className="w-12 flex-shrink-0 text-gray-500">
                      {formatTime(cue.startTime)}
                    </span>
                    <p className="flex-grow">{cue.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {activeTab === "notes" && (
          <div className=" w-[50vw] h-[20vh]">Notes content goes here</div>
        )}
        {activeTab === "downloads" && (
          <div className="w-[50vw] h-[20vh]"> Downloads content goes here</div>
        )}
        {activeTab === "discuss" && (
          <div className=" w-[50vw] h-[20vh]">Discuss content goes here</div>
        )}
      </div>
    </div>
  );
}
