import React, { useEffect, useRef, useState } from "react";
import "../forms/step1.css";
const Select = ({ value, onChange, children, width, height }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option, value) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(value || option);
  };

  const selectRef = useRef(null);

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={selectRef}
      className="relative  inline-block text-left"
      style={{ width: width, height: height }}
    >
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectLabel") {
          return React.cloneElement(child, {
            toggleDropdown,
            selectedOption,
            isOpen,
          });
        }
      })}

      {isOpen && (
        <div className="absolute mt-1 z-10 w-full rounded-md bg-white shadow-lg">
          {React.Children.map(children, (child) => {
            if (child.type.displayName === "SelectOption") {
              return React.cloneElement(child, { handleOptionClick });
            }
          })}
        </div>
      )}
    </div>
  );
};

const SelectLabel = ({ toggleDropdown, selectedOption, isOpen, children }) => {
  return (
    <button
      type="button"
      className="inline-flex justify-between w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:bg-gray-200 active:text-gray-800"
      onClick={toggleDropdown}
      aria-haspopup="listbox"
      aria-expanded="true"
    >
      <span className={`font-lg truncate ${!selectedOption && "opacity-40"}`}>
        {selectedOption || children}
      </span>
      <svg
        className={`-mr-1 ml-2 h-5 w-5 flex justify-center items-center opacity-40 ${
          isOpen && "rotate-180"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 12l-6-6 1.5-1.5L10 9l4.5-4.5L16 6l-6 6z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};
SelectLabel.displayName = "SelectLabel";

const SelectOption = ({ handleOptionClick, children, value }) => {
  return (
    <div
      onClick={() => handleOptionClick(children, value)}
      className="text-gray-900 z-50 cursor-pointer select-none relative p-1"
    >
      <div className="flex  justify-center items-center p-2 rounded-md hover:bg-blue-500 hover:text-white">
        <span className="font-normal block truncate">{children}</span>
      </div>
    </div>
  );
};
SelectOption.displayName = "SelectOption";

export { Select, SelectLabel, SelectOption };
