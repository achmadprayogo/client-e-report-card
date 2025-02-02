import ContentContainer from "../ContentContainer";
import ToolbarContainer from "../Toolbar/ToolbarContainer";
import ToolbarItem from "../Toolbar/ToolbarItem";
import Search from "../Toolbar/Search";
import TableContainer from "./TableContainer";
import TableHeader from "./TableHeader";
import TableData from "./TableData";
import TablePagination from "./TablePagination";
import { useEffect } from "react";
import { getData } from "../../../fetcher";

function TableScore() {
  useEffect(() => {
    async function getDataScores() {
      const URL = `/api/admin/score`;
      const response = await getData(URL);
      console.log(response);
    }
    getDataScores();
  }, []);

  const handleSearch = (search: string) => {
    console.log(search);
  };

  const handlePageNext = () => {};

  const handlePagePrev = () => {};
  return (
    <ContentContainer direction="column">
      <ToolbarContainer>
        <ToolbarItem icon="person">{`${100} Santri`}</ToolbarItem>
        <Search onSearch={handleSearch} />
        <ToolbarItem icon="stacks">Tingkat</ToolbarItem>
        <ToolbarItem icon="meeting_room">Kelas</ToolbarItem>
        <ToolbarItem icon="search_activity">Cawu</ToolbarItem>
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40]">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader>Nama</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Tingkat</TableHeader>
              <TableHeader>Kelas</TableHeader>
              <TableHeader>Wali Kelas</TableHeader>
              <TableHeader>Cawu</TableHeader>
              <TableHeader>KKM</TableHeader>
              <TableHeader>Nahwu</TableHeader>
              <TableHeader>Shorof</TableHeader>
              <TableHeader>Fiqih</TableHeader>
              <TableHeader>Akhlaq</TableHeader>
              <TableHeader>Tauhid</TableHeader>
              <TableHeader>Hadis</TableHeader>
              <TableHeader>Tafsir</TableHeader>
              <TableHeader>Total</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableData>1</TableData>
              <TableData>123456789</TableData>
              <TableData>Joko</TableData>
              <TableData>Aktif</TableData>
              <TableData>1 Wustho</TableData>
              <TableData>A</TableData>
              <TableData>Ust. Udin</TableData>
              <TableData>1</TableData>
              <TableData>60</TableData>
              <TableData>80</TableData>
              <TableData>80</TableData>
              <TableData>80</TableData>
              <TableData>80</TableData>
              <TableData>80</TableData>
              <TableData>80</TableData>
              <TableData>80</TableData>
              <TableData>280</TableData>
            </tr>
          </tbody>
        </table>
      </TableContainer>
      <TablePagination
        currentPage={1}
        totalPages={1}
        onPageNext={handlePageNext}
        onPagePrev={handlePagePrev}
      />
    </ContentContainer>
  );
}

export default TableScore;
