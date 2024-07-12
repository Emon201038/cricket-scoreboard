// Dropdown.js
import { useContext, useState } from "react";
import SvgIcon from "../selectField/SvgIcon";
import { FormContext } from "../../context";

const Dropdown = ({ dropDownProps }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { state, dispatch } = useContext(FormContext);

  const { options, onSelect, isOpen, setIsOpen, teamName, index, type } =
    dropDownProps || {};

  const handleClick = (option) => {
    onSelect(option.value);
    dispatch({
      type: "UPDATE_NAME",
      payload: {
        team: teamName.key,
        playerIndex: index,
        playerDetails: {
          [type]: option.value,
        },
      },
    });
  };

  return (
    <div
      className="selectBtn relative"
      onClick={() => {
        console.log(teamName.name + index);

        setIsOpen(!isOpen);
        setSelectedOption(teamName.name + index);
      }}
    >
      <span className="pointer-events:none">
        {state.step2.players?.[teamName.key][index]?.[type] || "select"}
      </span>
      <SvgIcon dynamicClass={`h-4 w-4 opacity-50 ${isOpen && "rotate-180"}`} />
      <ul
        className={`absolute top-11 w-full left-0 z-10 bg-white rounded-sm ${
          isOpen && selectedOption === teamName.name + index
            ? "block"
            : "hidden"
        }`}
      >
        {options.map((option) => (
          <li
            key={option.value}
            className="p-2 text-sm rounded-sm hover:bg-sky-600 text-opacity-100 hover:text-white"
            onClick={() => handleClick(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
