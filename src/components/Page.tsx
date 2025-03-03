import PageNavbar from "./PageNavbar";
import TabelBiodata from "./Tables/TabelBiodata";
import TableClassMember from "./Tables/TableClassMember";
import TabelSettings from "./Tables/TabelSettings";
import StudentInput from "./Form/Student/StudentInput";
import StudentUpdate from "./Form/Student/StudentUpdate";
import StudentDelete from "./Form/Student/StudentDelete";
import { Routes, Route, Outlet } from "react-router";
import ClassMemberUpdate from "./Form/ClassMember/ClassMemberUpdate";
import ClassMemberDelete from "./Form/ClassMember/ClassMemberDelete";
import TableScore from "./Tables/TableScore";
import ScoreInput from "./Form/Score/ScoreInput";
import ScoreUpdate from "./Form/Score/ScoreUpdate";

function PageLayout() {
  return (
    <div className="w-full flex flex-row overflow-x-hidden relative h-[calc(100vh-7rem)]">
      <PageNavbar />
      <div className="w-full border-b-2 border-e-2 ms-20">
        <Outlet />
      </div>
    </div>
  );
}

function Page() {
  return (
    <Routes>
      <Route path="" element={<PageLayout />}></Route>
      <Route path="dashboard" element={<PageLayout />}></Route>
      <Route path="biodata" element={<PageLayout />}>
        <Route index element={<TabelBiodata />} />
        <Route path=":academic_year_id" element={<TabelBiodata />} />
        <Route path="input" element={<StudentInput />} />
        <Route path="update" element={<StudentUpdate />} />
        <Route path="delete" element={<StudentDelete />} />
      </Route>
      <Route path="classmember" element={<PageLayout />}>
        <Route index element={<TableClassMember />} />
        <Route path=":academic_year_id" element={<TableClassMember />} />
        <Route path="update" element={<ClassMemberUpdate />} />
        <Route path="delete" element={<ClassMemberDelete />} />
      </Route>
      <Route path="score" element={<PageLayout />}>
        <Route index element={<TableScore />} />
        <Route path=":academic_year_id" element={<TableScore />} />
        <Route path="input" element={<ScoreInput />} />
        <Route path="update" element={<ScoreUpdate />} />
      </Route>
      <Route path="rapor" element={<PageLayout />}></Route>
      <Route path="setting" element={<PageLayout />}>
        <Route index element={<TabelSettings />} />
      </Route>
      <Route path="logout" element={<PageLayout />}></Route>
    </Routes>
  );
}

export default Page;
