import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { FormContext } from "../../context";
import "./step1.css";
import InputSelect2 from "../selectField/InputSelect2";
import InputSelect1 from "../selectField/InputSelect1";

const Step1 = () => {
  const { dispatch } = useContext(FormContext);
  const [formData, setFormData] = useState({
    hostTeam: "",
    visitorTeam: "",
    playersNumber: "",
    tossWinner: "",
    electedTo: "",
    overLimit: "",
    maxOverPerBowler: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.hostTeam) {
      toast.error("please enter host team name", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else if (!formData.visitorTeam) {
      toast.error("please enter visitor team name", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else if (!formData.tossWinner) {
      toast.error("please select a toss winner", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else if (!formData.electedTo) {
      toast.error("please select elected to", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else if (!formData.overLimit) {
      toast.error("please enter over Limit", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else if (!formData.maxOverPerBowler) {
      toast.error("please enter max over per bowler", {
        position: "bottom-right",
        hideProgressBar: true,
        pauseOnHover: false,
        autoClose: 2000,
      });
    } else {
      dispatch({
        type: "NEXT_STEP",
        payload: {
          step: 2,
        },
      });
      dispatch({
        type: "STEP_1",
        payload: {
          ...formData,
        },
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="text-white py-10 px-4 flex flex-col justify-center items-center gap-4"
    >
      <div>
        <div className="mb-4">
          <div>Match Details</div>
        </div>
        <div>
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
            data-v0-t="card"
          >
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label" htmlFor="host-team">
                    Host Team
                  </label>
                  <input
                    className="input"
                    id="host-team"
                    placeholder="Enter host team name"
                    value={formData.hostTeam}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hostTeam: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="label" htmlFor="visitor-team">
                    Visitor Team
                  </label>
                  <input
                    className="input"
                    id="visitor-team"
                    placeholder="Enter visitor team name"
                    value={formData.visitorTeam}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        visitorTeam: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputSelect1 formData={formData} setFormData={setFormData} />
                <InputSelect2 formData={formData} setFormData={setFormData} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="label" htmlFor="player-number">
                    Player Number
                  </label>
                  <input
                    type="number"
                    className="input outline-none rounded-md"
                    placeholder="Enter player number"
                    value={formData.playersNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        playersNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="label" htmlFor="over-limit">
                    Over Limit
                  </label>
                  <input
                    type="number"
                    className="input outline-none rounded-md"
                    id="over-limit"
                    placeholder="Enter over limit"
                    value={formData.overLimit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        overLimit: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="label" htmlFor="max-overs">
                  Max Overs per Bowler
                </label>
                <input
                  className="input outline-none rounded-md"
                  id="max-overs"
                  type="number"
                  placeholder="Enter max overs per bowler"
                  value={formData.maxOverPerBowler}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxOverPerBowler: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="btn">submit</button>
    </form>
  );
};

export default Step1;
