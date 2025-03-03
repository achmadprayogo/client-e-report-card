import { Options } from "../../index";
import Helper from "../../Helper";
import { useNavigate } from "react-router";
import OptionsInput from "./Form/OptionsInput";

export default function AcademicYearLabel({ options }: { options: Options[] }) {
  const navigate = useNavigate();
  const visible: boolean = window.location.pathname.split("/").length <= 4;
  const pathNames: string[] = location.pathname.split("/");

  // If on the score page, select the last academic year and disable the option for all academic years
  if (pathNames[1] === "score") {
    options = Helper.setIndexOptionSelected(options, 1, true);
    options = Helper.setIndexOptionDisabled(options, 0, true);
  }

  const handleChange = (e: any) => {
    let link: string = location.pathname + "/" + e.target.value;

    if (pathNames.length === 3) {
      link = location.pathname.slice(0, -36) + e.target.value;
    }

    if (e.target.value === "") {
      link = location.pathname.slice(0, -37);
    }

    navigate(link);
  };

  return (
    <div
      className={`${
        visible ? "flex" : "hidden"
      } flex-row items-center ms-auto me-4 text-white text-4xl  space-x-1`}
    >
      <p className="text-white">Ta.</p>
      <select
        name=""
        id=""
        className="bg-transparent text-white p-2 focus:outline-none "
        onChange={handleChange}
      >
        <OptionsInput options={options} />
      </select>
    </div>
  );
}
