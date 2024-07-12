import { useGetAllMatchesQuery } from "../features/matches/matchesApi";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { useEffect } from "react";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/6VsQiXrIGyA
 */
const Matches = () => {
  const { isLoading, data, isError, error } = useGetAllMatchesQuery() || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) {
      // connectSocket();
    }
    return () => {
      /* cleanup code */
    };
  }, []);

  //decide what to render
  let matches = null;
  if (isLoading) {
    matches = <div>Matches is loading...</div>;
  }
  if (!isLoading && isError) {
    matches = <div>{error}</div>;
  }
  if (!isLoading && !isError && data?.payload?.length === 0) {
    matches = <div>No matches found</div>;
  }
  if (!isLoading && !isError && data?.payload?.length > 0) {
    matches = (
      <>
        {data?.payload?.map((m) => {
          const tossWinnerTeam = m?.toss?.winner?._id;

          const battingTeam =
            m?.toss?.decision === "bat"
              ? m?.teams?.find((t) => t?.team?._id === tossWinnerTeam)
              : m?.teams?.find((t) => t?.team?._id !== tossWinnerTeam);

          const bowlingTeam =
            m?.toss?.decision === "bowl"
              ? m?.teams?.find((t) => t?.team?._id === tossWinnerTeam)
              : m?.teams?.find((t) => t?.team?._id !== tossWinnerTeam);

          return (
            <div
              key={m?._id}
              className="bg-[rgb(51,51,51)] p-3 rounded hover:bg-[rgba(51,51,50,0.5)]"
              onClick={() => navigate(`match/${m?._id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">
                  {m?.maxOver} over&apos;s frielndly match
                </span>
                <span className="text-sm">
                  {m?.Innings?.length > 0
                    ? m?.Innings?.length === 1
                      ? "1st innings"
                      : "2nd innings"
                    : "start soon"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <FlagIcon className="h-4 w-4 text-[#00af9c]" />
                <span className="ml-2">{battingTeam?.team?.name}</span>
                <div className="ml-auto flex gap-4">
                  <div>
                    {m?.Innings?.length > 0 && m?.Innings[0]?.runs + "/"}
                    {m?.Innings?.length > 0 && m?.Innings[0]?.wickets} {"  "}
                  </div>
                  <div>
                    {m?.Innings?.length > 0 &&
                      Math.floor(m?.Innings[0]?.balls / 6) +
                        "." +
                        (m?.Innings[0]?.balls % 6)}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <FlagIcon className="h-4 w-4 text-[#ffed00]" />
                <span className="ml-2">{bowlingTeam?.team?.name}</span>
                <span className="ml-auto"></span>
              </div>
              <div className="mt-2 text-sm">
                <span>
                  {m?.status === "live" ? (
                    <span className="bg-red-600 px-2 font-semibold">Live</span>
                  ) : (
                    m?.status
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </>
    );
  }
  return (
    <div className="bg-[#2a2a2a] h-screen overflow-auto p-4 text-white flex flex-col gap-4 ">
      <div className="flex w-full px-2">
        <h1 className="flex w-[90%] justify-center font-serif font-semibold">
          Custom Cricket scoreboard
        </h1>
        <div className="w-[15%] text-sm text-right whitespace-nowrap ">
          <button
            onClick={() => navigate("/create")}
            className="bg-green-700 px-1 rounded-sm"
          >
            add a match
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">{matches}</div>
    </div>
  );
};

function FlagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

export default Matches;
