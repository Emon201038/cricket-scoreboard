import { useReducer } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formReducer, { formInitialState } from "../../reducers/formReducer";
import { FormContext } from "../../context";
import Stepper from "../Stepper";

function MatchCreate() {
  const [state, dispatch] = useReducer(formReducer, formInitialState);
  return (
    <FormContext.Provider value={{ state, dispatch }}>
      <div className="bg-gray-900 h-screen flex flex-col items-center justify-center overflow-auto">
        <Stepper />
        <ToastContainer limit={5} />
      </div>
    </FormContext.Provider>
  );
}

export default MatchCreate;
