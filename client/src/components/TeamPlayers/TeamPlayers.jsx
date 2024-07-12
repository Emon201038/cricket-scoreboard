/* eslint-disable react/no-unescaped-entities */
// TeamPlayers.js
import { useContext } from "react";
import { FormContext } from "../../context";
import { Select, SelectLabel, SelectOption } from "../Custom/Select";

const TeamPlayers = ({ formData, setFormData, team }) => {
  const { state } = useContext(FormContext);

  const handleInputChange = (team, index, field, value) => {
    const newData = [...team];
    newData[index] = { ...newData[index], [field]: value };
    return newData;
  };

  const handleInputChangeTeam = (index, field, value) => {
    setFormData((prevData) => handleInputChange(prevData, index, field, value));
  };

  return (
    <div>
      {[...Array(parseInt(state.step1.playersNumber))].map((_, index) => {
        return (
          <div key={index} className="py-4">
            <div className="pb-1">
              {team} team's Player {index + 1}:
            </div>
            <div
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
              data-v0-t="card"
            >
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      className="label"
                      htmlFor={`player-name-${team}-${index}`}
                    >
                      Player Name
                    </label>
                    <input
                      className="input"
                      id={`player-name-${team}-${index}`}
                      placeholder="Enter player name"
                      value={formData[index]?.name || ""}
                      onChange={(e) =>
                        handleInputChangeTeam(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 flex flex-col justify-between">
                    <label
                      className="label"
                      htmlFor={`batting-className-${team}-${index}`}
                    >
                      Batting style
                    </label>
                    <Select
                      value={formData[index]?.battingStyle || "Right Handed"}
                      onChange={(value) =>
                        handleInputChangeTeam(index, "battingStyle", value)
                      }
                    >
                      <SelectLabel>Select Batting Style</SelectLabel>
                      <SelectOption>Right Handed</SelectOption>
                      <SelectOption>Left Handed</SelectOption>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2 z-0 flex flex-col">
                  <label
                    className="label"
                    htmlFor={`bowling-className-${team}-${index}`}
                  >
                    Bowling style
                  </label>
                  <Select
                    value={formData[index]?.bowlingStyle || "Right Arm"}
                    onChange={(value) =>
                      handleInputChangeTeam(index, "bowlingStyle", value)
                    }
                  >
                    <SelectLabel>Select Bowlig Style</SelectLabel>
                    <SelectOption>Right Arm</SelectOption>
                    <SelectOption>Left Arm</SelectOption>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamPlayers;
