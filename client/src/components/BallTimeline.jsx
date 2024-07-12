import { useEffect, useRef } from "react";
import { getOrdinalSuffix } from "../utils/formatTime";

const BallTimeline = ({ timeline }) => {
  const timelineRef = useRef();

  const dynamicClass = (b) => {
    let className = "bg-slate-700";
    if (b?.runs === 6) {
      className = "bg-green-700 font-bold";
    }
    if (b?.runs === 4) {
      className = "bg-sky-500 font-bold";
    }
    if (b?.wicket) {
      className = "bg-red-500 font-semibold";
    }
    return className;
  };

  useEffect(() => {
    // Scroll to the end of the timeline when it updates
    timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
  }, [timeline]);

  return (
    <div
      ref={timelineRef}
      className="flex w-full overflow-x-auto scroll-smooth border-b-[1px] border-slate-700 pb-3 flex-nowrap whitespace-nowrap"
    >
      {timeline?.map((over, index) => (
        <div className="flex" key={over?._id}>
          {timeline?.length === index + 1 ? (
            <span className="ml-2">This over:</span>
          ) : timeline?.length - 1 === index + 1 ? (
            <span className="ml-2">Last over:</span>
          ) : (
            getOrdinalSuffix(index + 1)
          )}
          {over?.balls?.map((ball) => (
            <div
              className={`mx-2 p-2 size-6 rounded-full border border-slate-400 
                  ${dynamicClass(
                    ball
                  )} text-white center text-[11px] cursor-default`}
              key={ball?._id}
            >
              {/* {ball?.extras &&} */}
              {ball?.event}
            </div>
          ))}
          {timeline?.length > index + 1 && "|" + " "}
        </div>
      ))}
    </div>
  );
};

export default BallTimeline;
