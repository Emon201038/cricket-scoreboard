import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatTime";
import Bowler from "./head/Bowler";
const Head = ({ match, innings }) => {
  const [batsman, setBatsman] = useState([]);

  useEffect(() => {
    const fetchNotOutBatsman = async () => {
      try {
        const buffer = await fetch(
          `http://localhost:3001/api/v1/batsman/not_out/${
            innings?.length > 0 && innings?.length === 1
              ? innings[0]?._id
              : innings[1]?._id
          }`
        );
        const res = await buffer.json();
        if (res.success) {
          setBatsman(res.payload);
        } else {
          // console.log(res.message);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    fetchNotOutBatsman();
    return () => {
      /* cleanup code */
    };
  }, [innings]);

  const tossWinnerTeam = match?.toss?.winner?._id;

  const battingTeam =
    match?.toss?.decision === "bat"
      ? match?.teams?.find((t) => t?.team?._id === tossWinnerTeam)
      : match?.teams?.find((t) => t?.team?._id !== tossWinnerTeam);

  const bowlingTeam =
    match?.toss?.decision === "bowl"
      ? match?.teams?.find((t) => t?.team?._id === tossWinnerTeam)
      : match?.teams?.find((t) => t?.team?._id !== tossWinnerTeam);
  const crr = (
    match?.data?.score[0]?.firstInnings?.totals?.R /
    (Math.floor(match?.data?.score[0]?.firstInnings?.totals?.B / 6) +
      (match?.data?.score[0]?.firstInnings?.totals?.B % 6) / 6)
  ).toFixed(2);

  return (
    <div className="w-full p-3">
      <h3>{formatDate(match?.createdAt)}</h3>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full p-3 flex justify-between">
          <div className="flex gap-12">
            <div>
              <div className="size-9 bg-white rounded-md"></div>
              <div className="uppercase">
                {battingTeam?.team?.name?.substring(0, 3)}
              </div>
            </div>
            <div>
              <div className="">
                {innings?.length > 0
                  ? innings[0]?.runs + "/" + innings[0]?.wickets
                  : "toss"}
              </div>
              <div>
                {innings?.length > 0 &&
                  Math.floor(innings[0]?.balls / 6) +
                    "." +
                    (innings[0]?.balls % 6)}
              </div>
            </div>
          </div>
          <div className="flex gap-12 flex-row-reverse">
            <div>
              <div className="size-9 bg-white rounded-md"></div>
              <div className="uppercase">
                {bowlingTeam?.team?.name?.substring(0, 3)}
              </div>
            </div>
            {innings?.length === 2 ? (
              <div>
                <div className="">{innings[1]?.runs}</div>
                <div>
                  {innings[1]?.overs.length + "." + (innings[1]?.balls % 6)}
                </div>
              </div>
            ) : (
              <div>yet to bat</div>
            )}
          </div>
        </div>
        <div className="pb-4">
          {match?.toss?.winner?.name} choose {match?.toss?.decision} • CRR:{" "}
          {crr > 0 ? crr : 0}
        </div>
        <hr className="w-full h-0 border-b-[1px] border-slate-800 opacity-50" />
        {match?.status === "live" ? (
          <div className="w-full flex justify-between border-b-[1px] border-slate-700 p-3">
            <div>
              <h3>
                {battingTeam?.team?.name}{" "}
                {innings?.length > 0 && innings?.length === 1
                  ? "batting"
                  : "bowling"}{" "}
              </h3>
              {batsman?.map((p) => (
                <p key={p?._id} className="text-[12px]">
                  {p?.player?.name}:{" "}
                  <span>
                    {p?.runs}
                    {p?.isStriker && <sup>*</sup>} ({p?.ballsFaced})
                  </span>
                </p>
              ))}
            </div>
            <div>
              <h3>
                {bowlingTeam?.team?.name}{" "}
                {innings?.length > 0 && innings?.length === 2
                  ? "batting"
                  : "bowling"}{" "}
              </h3>
              <Bowler
                matchId={match?._id}
                inningsId={
                  innings?.length > 0 && innings?.length === 1
                    ? innings[0]?._id
                    : innings[1]?._id
                }
              />
            </div>
          </div>
        ) : (
          <h3>{match?.result}</h3>
        )}
      </div>
    </div>
  );
};

export default Head;
