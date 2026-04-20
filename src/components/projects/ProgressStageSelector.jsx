import { PROGRESS_STAGES } from "../../constants/statuses";
import { Select } from "../ui/Select";

export function ProgressStageSelector({ value, onChange, disabled = false, label = "Progress stage" }) {
  return (
    <Select label={label} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
      {PROGRESS_STAGES.map((stage) => (
        <option key={stage} value={stage}>
          {stage}
        </option>
      ))}
    </Select>
  );
}
