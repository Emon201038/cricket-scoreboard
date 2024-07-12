import { useEffect, useState } from "react";
import { addSeparatorAfterSixLegalBalls } from "../utils/addSeparator";
import BallTimeline from "./BallTimeline";

const Select = ({ match, inningsId, selectedTeam, setSelectedTeam }) => {
  const [overs, setOvers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    const overs = async () => {
      setIsLoading(true);
      try {
        const buffer = await fetch(
          `http://localhost:3001/api/v1/overs/${inningsId}`
        );
        const res = await buffer.json();
        if (res.success) {
          setOvers(res.payload);
        } else {
          setError(res.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    overs();
    return () => {
      /* cleanup code */
    };
  }, [inningsId]);

  const tossWinnerTeam = match?.toss?.winner?._id;

  const battingTeam =
    match?.toss?.decision === "bat"
      ? match?.teams?.find((t) => t?.team?._id === tossWinnerTeam)
      : match?.teams?.find((t) => t?.team?._id !== tossWinnerTeam);

  const bowlingTeam =
    match?.toss?.decision === "bowl"
      ? match?.teams?.find((t) => t?.team?._id === tossWinnerTeam)
      : match?.teams?.find((t) => t?.team?._id !== tossWinnerTeam);

  return (
    <>
      <div className="w-[600px] timeLine p-3 pt-0 flex overflow-hidden">
        <BallTimeline timeline={overs} />
      </div>
      <div className="w-full p-3 flex justify-center items-center gap-2 overflow-x-auto">
        <div className="px-4 py-1 rounded-full bg-gray-600">Overview</div>
        <div className="px-4 py-1 rounded-full bg-gray-600 border-[1px] border-white">
          Scoreboard
        </div>
        <div className="px-4 py-1 rounded-full bg-gray-600">commentry</div>
        <div className="px-4 py-1 rounded-full bg-gray-600">Overview</div>
      </div>
      <div className="bg-[rgba(0,0,0,0.6)] w-full mb-2">
        <div className="flex justify-between px-8 ">
          <h1
            onClick={() => setSelectedTeam(battingTeam)}
            className={`px-16 cursor-pointer py-3 ${
              selectedTeam?._id === battingTeam?._id && "border-b"
            } uppercase`}
          >
            {battingTeam?.team?.name}
          </h1>
          <h1
            onClick={() => setSelectedTeam(bowlingTeam)}
            className={`px-16 cursor-pointer py-3 ${
              selectedTeam?._id === bowlingTeam?._id && "border-b"
            } uppercase`}
          >
            {bowlingTeam?.team?.name}
          </h1>
        </div>
      </div>
    </>
  );
};

export default Select;
