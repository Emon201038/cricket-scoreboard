/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import SvgIcon from "../selectField/SvgIcon";
import { FormContext } from "../../context";

const HostTeamPlayers = ({ handleInputChange }) => {
  const { state, dispatch } = useContext(FormContext);

  const initializeFormData = () => {
    const defaultFormData = [];
    for (let i = 0; i < Number(state.step1.playersNumber); i++) {
      defaultFormData.push({
        name: "",
        battingStyle: "right-handed",
        bowlingStyle: "right-handed",
      });
    }
    return defaultFormData;
  };
  const [battingModalOpen, setBattingModalOpen] = useState(false);
  const [bowlingModalOpen, setBowlingModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [team1FormData, setTeam1FormData] = useState(initializeFormData());

  const handleInputChange1 = (index, field, value) => {
    setTeam1FormData((prevData) =>
      handleInputChange(prevData, index, field, value)
    );
    dispatch({
      type: "UPDATE_NAME",
      payload: {
        team: "hostTeam",
        playerIndex: index,
        playerDetails: { name: value },
      },
    });
  };

  console.log(state);
  return (
    <div>
      {[...Array(parseInt(state.step1.playersNumber))].map((_, index) => (
        <div key={index} className="py-4">
          <div className="pb-1">
            {state.step1.hostTeam} team's Player {index + 1}:
          </div>
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
            data-v0-t="card"
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label" htmlFor="player-name">
                    Player Name
                  </label>
                  <input
                    className="input"
                    id="player-name"
                    placeholder="Enter player name"
                    value={team1FormData[index]?.name || ""}
                    onChange={(e) =>
                      handleInputChange1(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="label" htmlFor="batting-className">
                    Batting style
                  </label>
                  <div
                    className="selectBtn relative"
                    onClick={() => {
                      setBattingModalOpen(!battingModalOpen);
                      setSelectedId(state.step1.hostTeamName + index);
                    }}
                  >
                    <span className="pointer-events:none">
                      {state.step2.players.hostTeam[index]?.battingStyle ||
                        "select"}
                    </span>
                    <SvgIcon
                      dynamicClass={`h-4 w-4 opacity-50 ${
                        battingModalOpen &&
                        selectedId === state.step1.hostTeamName + index &&
                        "rotate-180"
                      }`}
                    />
                    <ul
                      className={`absolute top-11 w-full left-0 z-10 bg-white rounded-sm  ${
                        battingModalOpen &&
                        selectedId === state.step1.hostTeamName + index
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <li
                        className="p-2 text-sm rounded-sm hover:bg-sky-600 text-opacity-100 hover:text-white "
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "UPDATE_NAME",
                            payload: {
                              team: "hostTeam",
                              playerIndex: index,
                              playerDetails: {
                                battingStyle: "right-handed",
                              },
                            },
                          });
                          setBowlingModalOpen(!battingModalOpen);
                        }}
                      >
                        Right Handed
                      </li>
                      <li
                        className="p-2 text-sm opacity-100 hover:bg-sky-600 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "UPDATE_NAME",
                            payload: {
                              team: "hostTeam",
                              playerIndex: index,
                              playerDetails: {
                                battingStyle: "left-handed",
                              },
                            },
                          });
                          setBowlingModalOpen(!battingModalOpen);
                        }}
                      >
                        Left Handed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="label" htmlFor="bowling-className">
                  Bowling style
                </label>
                <div
                  className="selectBtn relative"
                  onClick={() => {
                    setBowlingModalOpen(!bowlingModalOpen);
                    setSelectedId(state.step1.hostTeamName + index);
                  }}
                  id="bowling-className"
                >
                  <span className="pointer-events:none">
                    {state.step2.players.hostTeam[index]?.bowlingStyle ||
                      "select"}
                  </span>
                  <SvgIcon
                    dynamicClass={`h-4 w-4 opacity-50 ${
                      bowlingModalOpen &&
                      selectedId === state.step1.hostTeamName + index &&
                      "rotate-180"
                    }`}
                  />
                  <ul
                    className={`absolute top-11 w-full left-0 bg-white rounded-sm  ${
                      bowlingModalOpen &&
                      selectedId === state.step1.hostTeamName + index
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    <li
                      className="p-2 text-sm rounded-sm hover:bg-sky-600 text-opacity-100 hover:text-white "
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({
                          type: "UPDATE_NAME",
                          payload: {
                            team: "hostTeam",
                            playerIndex: index,
                            playerDetails: {
                              bowlingStyle: "right-handed",
                            },
                          },
                        });
                        setBowlingModalOpen(!bowlingModalOpen);
                      }}
                    >
                      Right Handed
                    </li>
                    <li
                      className="p-2 text-sm opacity-100 hover:bg-sky-600 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({
                          type: "UPDATE_NAME",
                          payload: {
                            team: "hostTeam",
                            playerIndex: index,
                            playerDetails: {
                              bowlingStyle: "left-handed",
                            },
                          },
                        });
                        setBowlingModalOpen(!bowlingModalOpen);
                      }}
                    >
                      Left Handed
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HostTeamPlayers;
