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
    <div
      className="fixed top-28 left-0 z-10 w-20 bg-[#343a40] border-x-0 border-e-2 border-s-2 border-b-2 bottom-0 hover:w-36 group transition-all duration-500 ease-in-out overflow-auto
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar]:h-2 
        [&::-webkit-scrollbar]:[z-index:1]
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-transparent
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
    "
    >
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
          endPoint={"/attendance"}
          icon={"checklist_rtl"}
          name={"Absensi"}
          isActive={activeItem === "attendance"}
        />
        <NavItem
          endPoint={"/notes"}
          icon={"edit_note"}
          name={"Catatan"}
          isActive={activeItem === "notes"}
        />
        <NavItem
          endPoint={"/rapor"}
          icon={"book"}
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
