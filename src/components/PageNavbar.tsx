import Helper from "../../Helper";
import NavItem from "./NavItem";
import { useEffect, useState } from "react";

function PageNavbar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const path = window.location.pathname.split("/")[1];
  const [lastAcademicYearId, setLastAcademicYearId] = useState("");

  useEffect(() => {
    setActiveItem(path);
  }, [path]);

  // If on the score page, set the last academic year
  useEffect(() => {
    async function getAcademicYearOptions() {
      const result = await Helper.getAcademicYearOptions();
      setLastAcademicYearId(result[result.length - 1].value);
    }
    getAcademicYearOptions();
  }, []);

  return (
    <div className="fixed top-28 left-0 z-10 overflow-auto w-20 bg-[#343a40] border-x-0 border-e-2 border-s-2 border-b-2 bottom-0 hover:w-36 group transition-all duration-500 ease-in-out">
      <ul className="flex flex-col p-2 h-full">
        <NavItem
          endPoint={"/"}
          icon={"dashboard"}
          name={"Dashboard"}
          isActive={activeItem === "dashboard"}
        />
        <NavItem
          endPoint={"/biodata"}
          icon={"person_book"}
          name={"Biodata"}
          isActive={activeItem === "biodata"}
        />
        <NavItem
          endPoint={"/classmember"}
          icon={"groups"}
          name={"Kelas"}
          isActive={activeItem === "classmember"}
        />
        <NavItem
          endPoint={"/score/" + lastAcademicYearId}
          icon={"grade"}
          name={"Nilai"}
          isActive={activeItem === "score"}
        />
        <NavItem
          endPoint={"/rapor"}
          icon={"receipt_long"}
          name={"Rapor"}
          isActive={activeItem === "rapor"}
        />
        <NavItem
          endPoint={"/setting"}
          icon={"settings"}
          name={"Setting"}
          isActive={activeItem === "setting"}
        />
        <NavItem
          endPoint={"/logout"}
          icon={"logout"}
          name={"Logout"}
          isActive={activeItem === "logout"}
        />
      </ul>
    </div>
  );
}

export default PageNavbar;
