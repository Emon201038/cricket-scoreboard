/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import "./step1.css";
import { FormContext } from "../../context";
import TeamPlayers from "../TeamPlayers/TeamPlayers";
import { toast } from "react-toastify";
const Step2 = () => {
  const { state, dispatch } = useContext(FormContext);
  const initializeFormData = () => {
    const defaultFormData = [];
    for (let i = 0; i < Number(state.step1.playersNumber); i++) {
      defaultFormData.push({
        name: "",
        battingStyle: "Right Handed",
        bowlingStyle: "Right Arm",
      });
    }
    return defaultFormData;
  };
  const [hostTeamFormData, setHostTeamFormData] = useState(
    initializeFormData()
  );
  const [visitorTeamFormData, setVisitorTeamFormData] = useState(
    initializeFormData()
  );

  const validateFormData = () => {
    let isValid = true;

    for (let i = 0; i < hostTeamFormData.length; i++) {
      const player = hostTeamFormData[i];
      if (!player.name.trim()) {
        toast.error(
          `Please enter ${state.step1.hostTeam} player ${i + 1} name `,
          {
            position: "bottom-right",
            hideProgressBar: true,
            pauseOnHover: false,
            autoClose: 2000,
          }
        );
        isValid = false;
        break; // End the loop and return if condition is met
      }
    }

    // Validation logic for visitorTeamFormData
    if (isValid) {
      for (let i = 0; i < visitorTeamFormData.length; i++) {
        const player = visitorTeamFormData[i];
        if (!player.name.trim()) {
          toast.error(
            `Please enter ${state.step1.visitorTeam} player ${i + 1} name `,
            {
              position: "bottom-right",
              hideProgressBar: true,
              pauseOnHover: false,
              autoClose: 2000,
            }
          );
          isValid = false;
          break; // End the loop and return if condition is met
        }
        // Additional validation logic for other fields if needed
      }
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData()) {
      dispatch({
        type: "NEXT_STEP",
        payload: {
          step: 3,
        },
      });
      dispatch({
        type: "STEP_2",
        payload: {
          host: hostTeamFormData,
          visitor: visitorTeamFormData,
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-white max-h-[500px] overflow-y-auto flex flex-col  items-center  gap-5"
    >
      <div>
        <div className="mt-2">
          <h1 className=" font-semibold pl-4">Player Details</h1>
        </div>
        <div className="flex gap-4 px-4">
          <TeamPlayers
            formData={hostTeamFormData}
            setFormData={setHostTeamFormData}
            team={state.step1.hostTeam}
          />
          <TeamPlayers
            formData={visitorTeamFormData}
            setFormData={setVisitorTeamFormData}
            team={state.step1.visitorTeam}
          />
        </div>
      </div>
      <button type="submit" className="btn">
        Next
      </button>
    </form>
  );
};

export default Step2;
