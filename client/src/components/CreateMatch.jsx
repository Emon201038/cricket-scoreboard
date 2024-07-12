import { useEffect, useState } from "react";
import { useCreateMatchMutation } from "../features/matches/matchesApi";
import { useNavigate } from "react-router-dom";

const CreateMatch = () => {
  const [hostTeamName, setHostTeamName] = useState("");
  const [visitorTeamName, setVisitorTeamName] = useState("");
  const [tossWinner, setTossWinner] = useState("1");
  const [tossDecesion, setTossDecesion] = useState("bat");
  const [overs, setOvers] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setPlayerNumber(isNaN(value) ? "" : value);
  };
  const [createMatch, { isLoading, isError, error, isSuccess, data }] =
    useCreateMatchMutation();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    createMatch({
      team1: hostTeamName,
      team2: visitorTeamName,
      tossWinner,
      tossDecesion,
      overs: overs,
      playerNumber: playerNumber,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(
        `/match/update/players/${playerNumber}/${data?.payload?.match?._id}`
      );
    }
    return () => {
      /* cleanup code */
    };
  }, [navigate, playerNumber, isSuccess, data]);
  return (
    <div className="bg-gradient-to-b from-slate-800 to-indigo-950 w-screen text-white flex justify-center items-center overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-4 flex flex-col gap-3 lg:w-1/2 md:w-1/2 sm:w-[90%] max-sm:w-[95%] "
      >
        <h1>Teams:</h1>
        <div className="flex flex-col gap-4 w-full px-3  py-4 rounded-md bg-gray-700">
          <input
            required
            type="text"
            id="team1"
            placeholder="Host Team"
            className="text-white bg-gray-700 outline-none border-b px-2 py-1 w-full"
            value={hostTeamName}
            onChange={(e) => setHostTeamName(e.target.value)}
          />
          <input
            required
            type="text"
            id="team1"
            placeholder="Visitor team"
            className="text-white bg-gray-700 outline-none border-b px-2 py-1 w-full"
            value={visitorTeamName}
            onChange={(e) => setVisitorTeamName(e.target.value)}
          />
        </div>
        <h1>Toss won by:</h1>
        <div className="flex gap-4 bg-gray-700 py-4 px-3 rounded-md">
          <div className=" space-x-1">
            <input
              required
              type="radio"
              name="tossWinner"
              id="hostTeam"
              value={hostTeamName}
              checked={tossWinner === hostTeamName}
              onChange={(e) => setTossWinner(e.target.value)}
            />
            <label htmlFor="hostTeam">
              {hostTeamName !== "" ? hostTeamName : "Host Team"}
            </label>
          </div>
          <div className="space-x-1">
            <input
              required
              type="radio"
              name="tossWinner"
              id="visitorTeam"
              value={visitorTeamName}
              checked={tossWinner === visitorTeamName}
              onChange={(e) => setTossWinner(e.target.value)}
            />
            <label htmlFor="visitorTeam">
              {visitorTeamName ? visitorTeamName : "visitor Team"}
            </label>
          </div>
        </div>
        <h1>Opted to:</h1>
        <div className="flex gap-4 bg-gray-700 py-4 px-3 rounded-md">
          <div className=" space-x-1">
            <input
              required
              value="batting"
              type="radio"
              name="tossResult"
              id="bat"
              onChange={(e) => setTossDecesion(e.target.value)}
            />
            <label htmlFor="bat">Bat</label>
          </div>
          <div className="space-x-1">
            <input
              required
              type="radio"
              value="bowling"
              name="tossResult"
              id="bowl"
              onChange={(e) => setTossDecesion(e.target.value)}
            />
            <label htmlFor="bowl">Bowl</label>
          </div>
        </div>
        <h1>Overs:</h1>
        <div className="flex flex-col gap-4 w-full px-3  py-4 rounded-md bg-gray-700">
          <input
            required
            type="number"
            min={3}
            id="overs"
            placeholder="16"
            value={overs}
            onChange={(e) => setOvers(e.target.value)}
            className="text-white bg-gray-700 outline-none border-b  px-2 "
            style={{ appearance: "none", "--WebkitAppearance": "none" }}
          />
        </div>

        <h1>Players:</h1>
        <div className="flex flex-col gap-4 w-full px-3  py-4 rounded-md bg-gray-700">
          <input
            required
            type="number"
            min={3}
            max={11}
            id="players"
            value={playerNumber}
            onChange={handleInputChange}
            placeholder="11"
            className="text-white bg-gray-700 outline-none border-b px-2 "
          />
        </div>
        {isError && <div>{error}</div>}
        <button
          disabled={isLoading}
          type="submit"
          className="p-2 bg-green-600 rounded-sm disabled:bg-green-300"
        >
          Start match
        </button>
      </form>
    </div>
  );
};

export default CreateMatch;
