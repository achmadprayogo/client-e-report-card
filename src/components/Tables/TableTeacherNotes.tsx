import ContentContainer from "../ContentContainer";
import ToolbarContainer from "../Toolbar/ToolbarContainer";
import ToolbarItem from "../Toolbar/ToolbarItem";
import Search from "../Toolbar/Search";
import TableContainer from "./TableContainer";
import TableHeader from "./TableHeader";
import TableData from "./TableData";
import TablePagination from "./TablePagination";
import React, { useEffect, useState } from "react";
import { getData } from "../../../fetcher";
import { useParams } from "react-router";
import { DataFetch, Options, TeacherNote } from "../../../index";
import Helper from "../../../Helper";
import OptionsInput from "../Form/OptionsInput";
import {
  initialDataFetch,
  initialOptions,
  initialTeacherNote,
} from "../../../initialStates";
import UpdateTeacherNote from "../Form/TeacherNote/UpdateTeacherNote";

function TableTeacherNotes() {
  const academicYearSelected = useParams().academic_year_id || "";
  const [response, setResponse] = useState<DataFetch>(initialDataFetch);
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [gradeClass, setGradeClass] = useState<string>("");
  const [quarter, setQuarter] = useState<string>("");
  const [gradeClassOptions, setGradeClassOptions] =
    useState<Options[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] =
    useState<Options[]>(initialOptions);
  const [quarterOptions, setQuarterOptions] =
    useState<Options[]>(initialOptions);
  const [className, setClassName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] =
    useState<TeacherNote>(initialTeacherNote);

  async function fetchTeacherNotes() {
    const pageQuery = `page[number]=${1}&page[size]=${20}`;
    const searchQuery = `search=${search}`;
    const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
    const classNameQuery = `filter[class_name_id]=${className}`;
    const gradeClassQuery = `filter[grade_class_id]=${gradeClass}`;
    const quarterQuery = `filter[quarter_academic_year_id]=${quarter}`;
    const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;
    const URL = `/api/admin/teacher-notes?${pageQuery}&${searchQuery}&${academicYearQuery}&${quarterQuery}&${classNameQuery}&${gradeClassQuery}&${sortQuery}`;
    const response = await getData(URL);

    setResponse(response);
    const formattedNotes = Helper.formatNotes(response.data, response.included);
    setNotes(formattedNotes);
  }
  useEffect(() => {
    fetchTeacherNotes();
  }, [
    search,
    academicYearSelected,
    gradeClass,
    className,
    quarter,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    async function fetchGradeOptions() {
      let result = await Helper.getGradeOptions(academicYearSelected);
      result = [...result, { label: "Semua", value: "" }];
      const options = Helper.setIndexOptionSelected(
        result,
        result.length - 1,
        true
      );
      setGradeClassOptions(options);
    }
    async function fetchQuarterOptions() {
      const result = await Helper.getQuarterOptions(academicYearSelected);
      const options = Helper.setIndexOptionSelected(
        result,
        result.length - 1,
        true
      );
      setQuarterOptions(options);
    }
    if (academicYearSelected !== "") {
      fetchGradeOptions();
      fetchQuarterOptions();
    }
  }, [academicYearSelected]);

  const handleSearch = (search: string) => {
    setSearch(search);
  };
  const handleGradeClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeClass(e.target.value);
    async function fetchOptions() {
      const result = await Helper.getClassNameOptions(e.target.value);
      const options = Helper.setIndexOptionSelected(
        result,
        result.length - 1,
        true
      );
      setClassNameOptions(options);
    }
    if (e.target.value !== "") {
      fetchOptions();
    }
  };
  const handleClassNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassName(e.target.value);
  };
  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuarter(e.target.value);
  };

  const handleDoubleClick = (note: TeacherNote) => {
    setSelectedNote(note);
    setIsOpenPopup(true);
  };
  const handlePageNext = async () => {
    const result = await getData(response.links.next);

    if (result) {
      setResponse(result);
      const data: TeacherNote[] = Helper.formatNotes(
        result.data,
        result.included
      ) as TeacherNote[];
      setNotes(data);
    }
  };
  const handlePagePrev = async () => {
    const result = await getData(response.links.prev);

    if (result) {
      setResponse(result);
      const data: TeacherNote[] = Helper.formatNotes(
        result.data,
        result.included
      ) as TeacherNote[];
      setNotes(data);
    }
  };
  const handleShort = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const target = e.target as HTMLTableCellElement;
    setSortBy(target.id);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  const handlePopupClose = () => {
    setIsOpenPopup(false);
    fetchTeacherNotes();
  };

  return (
    <ContentContainer direction="column">
      <UpdateTeacherNote
        isOpen={isOpenPopup}
        selectedNode={selectedNote}
        setIsOpen={handlePopupClose}
      />
      <ToolbarContainer>
        <ToolbarItem icon="description">{`${response.meta.page.total} Catatan`}</ToolbarItem>
        <Search onSearch={handleSearch} />
        {academicYearSelected && (
          <>
            <ToolbarItem icon="stacks">
              <div>
                <select
                  onChange={handleGradeClassChange}
                  name="grade_class_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={gradeClassOptions} />
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="meeting_room">
              <div className="flex flex-row space-x-2">
                <select
                  onChange={handleClassNameChange}
                  name="class_name_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={classNameOptions} />
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="search_activity">
              <div className="flex flex-row space-x-2">
                <select
                  onChange={handleQuarterChange}
                  name="class_name_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={quarterOptions} />
                </select>
              </div>
            </ToolbarItem>
          </>
        )}
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40] ">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader
                id="academic_year"
                filter={sortBy === "academic_year"}
                onClick={handleShort}
                order={sortOrder}
              >
                Tahun Ajaran
              </TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader
                id="fullname"
                filter={sortBy === "fullname"}
                onClick={handleShort}
                order={sortOrder}
              >
                Nama
              </TableHeader>
              <TableHeader
                id="grade_class"
                filter={sortBy === "grade_class"}
                onClick={handleShort}
                order={sortOrder}
              >
                Tingkat
              </TableHeader>
              <TableHeader
                id="class_name"
                filter={sortBy === "class_name"}
                onClick={handleShort}
                order={sortOrder}
              >
                Kelas
              </TableHeader>
              <TableHeader>Wali Kelas</TableHeader>
              <TableHeader
                id="quarter_academic_year"
                filter={sortBy === "quarter_academic_year"}
                onClick={handleShort}
                order={sortOrder}
              >
                Cawu
              </TableHeader>
              <TableHeader>Catatan</TableHeader>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr
                key={note.id}
                id={note.id}
                className="hover:bg-[#071f10]"
                onDoubleClick={() => handleDoubleClick(note)}
              >
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{note.academic_year}</TableData>
                <TableData>{note.nis}</TableData>
                <TableData>{note.fullname}</TableData>
                <TableData>{note.grade_class}</TableData>
                <TableData>{note.class_name}</TableData>
                <TableData>{"Ust. " + note.homeroom_teacher}</TableData>
                <TableData>{note.quarter_academic_year}</TableData>
                <TableData wrapText={true}>{note.note}</TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <TablePagination
        currentPage={response.meta.page.current_page}
        totalPages={response.meta.page.last_page}
        onPageNext={handlePageNext}
        onPagePrev={handlePagePrev}
      />
    </ContentContainer>
  );
}

export default TableTeacherNotes;
