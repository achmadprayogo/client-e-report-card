import { Option } from '../../../index';
function OptionsInput({ options }: { options?: Option[] }) {
  return (
    <>
      {options?.map((option, index) => (
        <option
          key={index + option.value}
          value={option.value}
          disabled={option.disabled}
          selected={option.selected}
          className="text-white bg-[#343a40]"
        >
          {option.label}
        </option>
      ))}
    </>
  );
}

export default OptionsInput;
