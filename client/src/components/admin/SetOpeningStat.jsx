import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleMatcheQuery,
  useUpdateOpeningStatMutation,
} from "../../features/matches/matchesApi";
import { useEffect, useState } from "react";

const SetOpeningStat = () => {
  const [strickBatsman, setStrickBatsman] = useState({
    name: "",
    battingStyle: "",
    bowlerStyle: "",
    _id: "",
  });
  const [nonStrickBatsman, setNonStrickBatsman] = useState({
    name: "",
    battingStyle: "",
    bowlerStyle: "",
    _id: "",
  });
  const [bowler, setBowler] = useState({
    name: "",
    battingStyle: "",
    bowlerStyle: "",
    _id: "",
  });
  const { matchId } = useParams();
  console.log(matchId);
  const navigate = useNavigate();
  const { isLoading, data, isError, error } = useGetSingleMatcheQuery(matchId);

  const [updateMatch, { isSuccess }] = useUpdateOpeningStatMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMatch({
      id: matchId,
      batsman1: strickBatsman,
      batsman2: nonStrickBatsman,
      bowler: bowler,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(`/match/update/score/${matchId}`);
    }
  }, [isSuccess, navigate, matchId]);

  //decide what to render
  let content = null;
  if (isLoading) {
    content = "Loading match information";
  }
  if (!isLoading && isError) {
    content = error;
  }
  if (!isLoading && !isError && data) {
    const tossWinnerTeam = data?.payload?.data?.teams?.find(
      (t) => t?.teamName === data?.payload?.data?.tossWinner
    );

    const tossLosserTeam = data?.payload?.data?.teams?.find(
      (t) => t?.teamName !== data?.payload?.data?.tossWinner
    );
    const battingTeam =
      data?.payload?.data?.electedTo === "batting"
        ? tossWinnerTeam
        : tossLosserTeam;

    const bowlingTeam =
      data?.payload?.data?.electedTo === "bowling"
        ? tossWinnerTeam
        : tossLosserTeam;
    // const battingTeam = currentBattingTeam(data?.payload);
    // const bowlingTeam = currentBowlingTeam(data?.payload);

    const test = battingTeam?.players?.filter(
      (p) => p?.name !== strickBatsman.name
    );

    content = (
      <div className="shadow-lg center p-4 px-8 flex-col rounded-md">
        <form onSubmit={handleSubmit} className="flex justify-start flex-col">
          <label htmlFor="strick-batsman">Strick Batsman:</label>
          <select
            required
            name="stick-batsman"
            id="strick-batsman"
            value={strickBatsman.name}
            className="border p-2 w-[160px] rounded-md appearance-none mb-3"
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedPlayer = battingTeam?.players?.find(
                (p) => p?.name === selectedId
              );
              setStrickBatsman({
                name: selectedPlayer.name,
                battingStyle: selectedPlayer.battingStyle,
                bowlingStyle: selectedPlayer.bowlingStyle,
                _id: selectedPlayer._id,
              });
            }}
            defaultValue=""
          >
            <option value="">Select a player</option>
            {battingTeam?.players?.map((p) => (
              <option key={p?._id} value={p?.name}>
                {p?.name}
              </option>
            ))}
          </select>

          <label htmlFor="non-strick-batsman">Non-Strick Batsman:</label>
          <select
            required
            name="non-strick-batsman"
            id="non-strick-batsman"
            className="border p-2 w-[160px] rounded-md appearance-none mb-3"
            value={nonStrickBatsman.name}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedPlayer = battingTeam?.players?.find(
                (p) => p?.name === selectedId
              );
              setNonStrickBatsman({
                name: selectedPlayer.name,
                battingStyle: selectedPlayer.battingStyle,
                bowlingStyle: selectedPlayer.bowlingStyle,
                _id: selectedPlayer._id,
              });
            }}
            defaultValue=""
          >
            <option value="">Select a player</option>
            {test?.map((p) => (
              <option key={p?._id} value={p?.name}>
                {p?.name}
              </option>
            ))}
          </select>

          <label htmlFor="non-strick-batsman">Opening Bowler:</label>
          <select
            required
            name="non-strick-batsman"
            id="non-strick-batsman"
            value={bowler.name}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedPlayer = bowlingTeam?.players?.find(
                (p) => p?.name === selectedId
              );
              setBowler({
                name: selectedPlayer.name,
                battingStyle: selectedPlayer.battingStyle,
                bowlingStyle: selectedPlayer.bowlingStyle,
                _id: selectedPlayer._id,
              });
            }}
            className="border p-2 w-[160px] rounded-md appearance-none mb-3"
            defaultValue=""
          >
            <option value="">Select a player</option>
            {bowlingTeam?.players?.map((p) => (
              <option key={p?._id} value={p?.name}>
                {p?.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-[#3B71CA] text-slate-300 p-1 rounded-md"
          >
            Next
          </button>
        </form>
      </div>
    );
  }

  return <div className="w-full center h-screen">{content}</div>;
};

export default SetOpeningStat;
