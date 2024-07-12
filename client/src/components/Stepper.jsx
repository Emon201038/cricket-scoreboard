import { useContext } from "react";
// import { toast } from "react-toastify";
import "./stepper.css";
import Step1 from "./forms/Step1";
import Step2 from "./forms/Step2";
import Step3 from "./forms/Step3";
import { FormContext } from "../context";
const Stepper = () => {
  const steps = ["Initial Data", "Players Details", "Openers"];

  const { state } = useContext(FormContext);

  const stepComponent = () => {
    switch (state.stepper.currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;

      default:
        "step is required";
    }
  };

  return (
    <>
      <div className="flex w-full justify-center items-center">
        <div className="flex fixed top-0 left-0 w-full z-10 bg-gray-600 justify-center overflow-auto">
          <div className="flex w-auto pt-2 justify-between overflow-auto">
            {steps?.map((step, index) => (
              <div
                key={index}
                className={`step-item ${
                  state.stepper.currentStep === index + 1 && "active"
                } ${
                  (index + 1 < state.stepper.currentStep ||
                    state.stepper.complete) &&
                  "complete"
                }`}
              >
                <div className={`step`}>
                  {state.stepper.currentStep > index + 1 ||
                  state.stepper.complete ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      id="check"
                    >
                      <path fill="none" d="M0 0h24v24H0V0z"></path>
                      <path
                        stroke="rgb(255,255,255)"
                        fill="rgb(255,255,255)"
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                      ></path>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <p className="text-gray-500">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {stepComponent()}
    </>
  );
};

export default Stepper;
