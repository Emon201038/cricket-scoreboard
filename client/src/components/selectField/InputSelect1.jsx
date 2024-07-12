/* eslint-disable react/prop-types */

import { Select, SelectLabel, SelectOption } from "../Custom/Select";

const InputSelect1 = ({ formData, setFormData }) => {
  return (
    <div className="space-y-2 flex flex-col">
      <label className="label">Toss Winner</label>
      <Select
        value={formData.tossWinner}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, tossWinner: value }))
        }
      >
        <SelectLabel>Select Toss Winner</SelectLabel>
        <SelectOption>{formData.hostTeam || "Host Team"}</SelectOption>
        <SelectOption>{formData.visitorTeam || "Visitor Team"}</SelectOption>
      </Select>
    </div>
  );
};

export default InputSelect1;
