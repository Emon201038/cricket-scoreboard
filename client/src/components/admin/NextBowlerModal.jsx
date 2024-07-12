import { useEffect, useState } from "react";
import {
  useUpdateCurrentBowlerMutation,
  useUpdateNextBatsmanMutation,
} from "../../features/matches/matchesApi";
import {
  currentBattingTeam,
  currentBowlingTeam,
} from "../../utils/batsmanData";
import { useParams } from "react-router-dom";

const NextBowlerModal = ({ match, openModal, setOpenModal }) => {
  const [nextPlayer, setNextPlayer] = useState({
    name: "",
    battingStyle: "",
    bowlingStyle: "",
    id: "",
  });

  const { id } = useParams();

  const [
    updateCurrentBowler,
    { isSuccess: updateBowlerSuccess, isLoading: updateNextBowlerLoading },
  ] = useUpdateCurrentBowlerMutation();

  const [
    updateNextBatsman,
    { isSuccess: updateBatsmanSuccess, isLoading: updateBatsmanIsLoading },
  ] = useUpdateNextBatsmanMutation();

  useEffect(() => {
    if (updateBowlerSuccess) {
      setOpenModal((prev) => ({ ...prev, type: "", status: false }));
    }
    if (updateBatsmanSuccess) {
      setOpenModal((prev) => ({ ...prev, type: "", status: false }));
    }
    return () => {
      /* cleanup code */
    };
  }, [setOpenModal, updateBowlerSuccess, updateBatsmanSuccess]);

  const battingTeam = currentBattingTeam(match?.payload?.data);
  const bowlingTeam = currentBowlingTeam(match?.payload?.data);

  const currentInnings =
    match?.payload?.data?.currentInnings === 1
      ? "firstInnings"
      : "secondInnings";

  const battingPlayers = match?.payload?.data?.score[0]?.[
    currentInnings
  ]?.batting?.map((b) => b?.batsman?.name);

  const availableNextBatsman = battingTeam?.players?.filter(
    (p) => !battingPlayers?.includes(p?.name)
  );
  console.log(availableNextBatsman);
  const availableNextBowler = bowlingTeam?.players?.filter(
    (p) =>
      p?._id !==
      match?.payload?.data?.score[0]?.firstInnings?.currentBowler?.bowler?.id
  );

  const handleNextBowler = (e) => {
    e.preventDefault();
    updateCurrentBowler({ id: id, nextBowler: { ...nextPlayer } });
  };

  const handleNextBatsman = (e) => {
    e.preventDefault();
    console.log(nextPlayer);
    updateNextBatsman({
      id: id,
      nextBatsman: { ...nextPlayer },
    });
  };

  return (
    <div className="w-full h-screen inset-x-0 fixed top-0 left-0 z-0 flex justify-center items-center container">
      <form
        onSubmit={
          openModal.type === "bowler" ? handleNextBowler : handleNextBatsman
        }
        className="w-2/5 h-1/4 min-h-[120px] shadow-lg shadow-inherit bg-white flex flex-col justify-center items-center rounded-md"
      >
        <label htmlFor="nextBowler" className="text-gray-500">
          Please select next {openModal.type}:{" "}
        </label>
        <select
          required
          name="nextBowler"
          id="nextBowler"
          value={nextPlayer.name}
          className="border p-1 w-[160px] rounded-md appearance-none mb-3 text-black"
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedPlayer =
              openModal.type === "bowler"
                ? bowlingTeam?.players?.find((p) => p?.name === selectedId)
                : availableNextBatsman?.find((b) => b.name === selectedId);
            setNextPlayer({ ...selectedPlayer, id: selectedPlayer._id });
          }}
          defaultValue=""
        >
          <option value="">Select a player</option>
          {openModal.type === "bowler"
            ? availableNextBowler?.map((p) => {
                return (
                  <option key={p?._id} value={p?.name}>
                    {p?.name}
                  </option>
                );
              })
            : availableNextBatsman.map((b) => (
                <option key={b?._id} value={b?.name}>
                  {b?.name}
                </option>
              ))}
        </select>
        <button
          disabled={
            openModal.type === "bowler"
              ? updateNextBowlerLoading
              : updateBatsmanIsLoading
          }
          type="submit"
          className="bg-blue-600 px-2 py-1 rounded-md"
        >
          select
        </button>
      </form>
    </div>
  );
};

export default NextBowlerModal;
