/* eslint-disable react/prop-types */

import { Select, SelectLabel, SelectOption } from "../Custom/Select";

const InputSelect2 = ({ formData, setFormData }) => {
  return (
    <div className="space-y-2 flex flex-col">
      <label className="label" htmlFor="tossWinner">
        Elected To
      </label>
      <Select
        value={formData.electedTo}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, electedTo: value }))
        }
      >
        <SelectLabel>Select Toss decision</SelectLabel>
        <SelectOption>Batting</SelectOption>
        <SelectOption>Bowling</SelectOption>
      </Select>
    </div>
  );
};

export default InputSelect2;
