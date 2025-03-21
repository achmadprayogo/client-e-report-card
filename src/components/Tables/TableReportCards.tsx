import ContentContainer from "../ContentContainer";
import ToolbarContainer from "../Toolbar/ToolbarContainer";
import ToolbarItem from "../Toolbar/ToolbarItem";
import Search from "../Toolbar/Search";
import TableContainer from "./TableContainer";
import TableHeader from "./TableHeader";
import TableData from "./TableData";
import TablePagination from "./TablePagination";
import { useEffect, useState } from "react";
import { getData } from "../../../fetcher";
import { useParams } from "react-router";
import { DataFetch, Options, StudentScore, Subject } from "../../../index";
import Helper from "../../../Helper";
import OptionsInput from "../Form/OptionsInput";
import { initialDataFetch } from "../../../initialStates";
import { useNavigate } from "react-router";

function TableTeacherNotes() {
  const handleSearch = (search: string) => {};
  const handleGradeClassChange = () => {};
  const handleClassNameChange = () => {};
  const handleQuarterChange = () => {};
  const handleClickInput = () => {};
  const handleDoubleClick = () => {};
  const handlePageNext = () => {};
  const handlePagePrev = () => {};

  return (
    <ContentContainer direction="column">
      <ToolbarContainer>
        <ToolbarItem icon="description">{`${20} Catatan`}</ToolbarItem>
        <Search onSearch={handleSearch} />
        <ToolbarItem icon="stacks">
          <div>
            <select
              onChange={handleGradeClassChange}
              name="grade_class_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <option value="">Semua</option>
            </select>
          </div>
        </ToolbarItem>
        <ToolbarItem icon="meeting_room">
          <div className="flex flex-row space-x-2">
            <p>Kelas :</p>
            <select
              onChange={handleClassNameChange}
              name="class_name_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <option value="">Semua</option>
            </select>
          </div>
        </ToolbarItem>
        <ToolbarItem icon="search_activity">
          <div className="flex flex-row space-x-2">
            <p>Cawu :</p>
            <select
              onChange={handleQuarterChange}
              name="class_name_id"
              className="text-white bg-transparent focus:outline-none"
            >
              <option value="">Semua</option>
            </select>
          </div>
        </ToolbarItem>
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40]">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader>Tahun Ajaran</TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader>Nama</TableHeader>
              <TableHeader>Tingkat</TableHeader>
              <TableHeader>Kelas</TableHeader>
              <TableHeader>Wali Kelas</TableHeader>
              <TableHeader>Cawu</TableHeader>
              <TableHeader>Files</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr
              key={1}
              id={1 + "#" + 1}
              className="hover:bg-gray-700"
              onDoubleClick={handleDoubleClick}
            >
              <TableData>{1}</TableData>
              <TableData>{"2024/2025"}</TableData>
              <TableData>{12345678}</TableData>
              <TableData>{"John Doe"}</TableData>
              <TableData>{"1 Wustho"}</TableData>
              <TableData>{"A"}</TableData>
              <TableData>{"Ust. John Doe"}</TableData>
              <TableData>{"1"}</TableData>
              <TableData wrapText={true}>
                <div className="flex flex-row space-x-2">
                  <button className="w-28 flex items-center justify-center px-2 rounded-lg bg-blue-700 text-base">
                    <span className="material-symbols-outlined me-1 text-base">
                      download_2
                    </span>{" "}
                    Identitas
                  </button>
                  <button className="w-28 flex items-center justify-center px-2 rounded-lg bg-green-700 text-base">
                    <span className="material-symbols-outlined me-1 text-base">
                      download_2
                    </span>{" "}
                    Rapor
                  </button>
                </div>
              </TableData>
            </tr>
          </tbody>
        </table>
      </TableContainer>
      <TablePagination
        currentPage={1}
        totalPages={2}
        onPageNext={handlePageNext}
        onPagePrev={handlePagePrev}
      />
    </ContentContainer>
  );
}

export default TableTeacherNotes;
