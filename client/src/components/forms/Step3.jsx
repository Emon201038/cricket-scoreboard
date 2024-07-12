import { useContext, useState } from "react";
import { FormContext } from "../../context";
import "./step1.css";
import { Select, SelectLabel, SelectOption } from "../Custom/Select";
import { toast } from "react-toastify";
import { useCreateMatchMutation } from "../../features/matches/matchesApi";

const Step3 = () => {
  const { state, dispatch } = useContext(FormContext);
  // eslint-disable-next-line no-unused-vars
  const [createMatch, { isSuccess }] = useCreateMatchMutation();
  const [striker, setStriker] = useState({
    name: "",
    battingStyle: "",
    bowlingStyle: "",
    id: null,
  });
  const [nonStriker, setNonStriker] = useState({
    name: "",
    battingStyle: "",
    bowlingStyle: "",
    id: null,
  });
  const [bowler, setBowler] = useState({
    name: "",
    battingStyle: "",
    bowlingStyle: "",
    id: null,
  });

  const tossWinnerTeam = state.step1.teams?.find(
    (team) => team.teamName === state.step1.tossWinner
  );
  const tossLosserTeam = state.step1.teams?.find(
    (team) => team.teamName !== state.step1.tossWinner
  );

  const battingTeam =
    state.step1.electedTo === "Batting" ? tossWinnerTeam : tossLosserTeam;
  const bowlingTeam =
    state.step1.electedTo !== "Batting" ? tossWinnerTeam : tossLosserTeam;

  const battingPlayers = battingTeam.players.map((player, index) => {
    return { ...player, id: index + 1 };
  });
  const bowlingPlayers = bowlingTeam.players.map((player, index) => {
    return { ...player, id: index + 1 };
  });

  const availableBowler = () => {
    if (bowler.id) {
      return bowlingPlayers.filter((b) => b.id !== bowler.id);
    } else {
      return bowlingPlayers;
    }
  };

  const availableBatsman = () => {
    if (striker.id && nonStriker.id) {
      return battingPlayers.filter(
        (player) => player.id !== striker.id && player.id !== nonStriker.id
      );
    } else if (striker.id) {
      return battingPlayers.filter((player) => player.id !== striker.id);
    } else if (nonStriker.id) {
      return battingPlayers.filter((player) => player.id !== nonStriker.id);
    } else {
      return battingPlayers;
    }
  };

  const handleStrikerChange = (value) => {
    const batsman = availableBatsman().find((b) => b.id === value);
    setStriker(batsman);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!striker.id) {
      toast.error("Please select Striker Batsman.", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
      return;
    }
    if (!nonStriker.id) {
      toast.error("Please select Non Striker Batsman.", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
      return;
    }
    if (!bowler.id) {
      toast.error("Please select Bowler.", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
      return;
    }
    dispatch({
      type: "STEP_3",
      payload: {
        striker,
        nonStriker,
        bowler,
      },
    });

    createMatch({
      initialData: state.step1,
      openers: {
        striker: striker,
        nonStriker: nonStriker,
        bowler: bowler,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center gap-5 text-white"
    >
      <div>
        <p className="py-3">Opening Batsman and Bowler:</p>
        <div>
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
            data-v0-t="card"
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col justify-between">
                  <label className="label" htmlFor="batsman-name">
                    Striker Batsman
                  </label>
                  <Select
                    value={striker.id}
                    onChange={(value) => {
                      handleStrikerChange(value);
                    }}
                  >
                    <SelectLabel>Enter Striker Batsman</SelectLabel>
                    {availableBatsman().map((batsman) => (
                      <SelectOption key={batsman.id} value={batsman.id}>
                        {batsman.name}
                      </SelectOption>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2 flex flex-col justify-between">
                  <label className="label" htmlFor="batsman-name">
                    Non-striker Batsman
                  </label>
                  <Select
                    value={nonStriker.name}
                    onChange={(id) =>
                      setNonStriker(availableBatsman().find((b) => b.id === id))
                    }
                  >
                    <SelectLabel>Enter Striker Batsman</SelectLabel>
                    {availableBatsman().map((player, index) => (
                      <SelectOption key={index} value={player.id}>
                        {player.name}
                      </SelectOption>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col justify-between">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="bowler-name"
                  >
                    Bowler
                  </label>
                  <Select
                    value={bowler.id}
                    onChange={(id) =>
                      setBowler(availableBowler().find((b) => b.id === id))
                    }
                  >
                    <SelectLabel>Enter Striker Batsman</SelectLabel>
                    {availableBowler().map((b) => (
                      <SelectOption key={b.id} value={b.id}>
                        {b.name}
                      </SelectOption>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
};

export default Step3;
