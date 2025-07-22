import { Routes, Route, Outlet } from 'react-router';
import PageNavbar from './PageNavbar';
import PageScore from './Pages/PageScore';
import PageBiodata from './Pages/PageBiodata';
import ScoreInput from './Form/Score/ScoreInput';
import PageClassMember from './Pages/PageClassMember';
import PageReportCards from './Pages/PageReportCards';
import PageTeacherNotes from './Pages/PageTeacherNotes';
import PageSettingSubject from './Pages/PageSettingSubject';
import PageSettingMovingClass from './Pages/PageMovingClass';
import PageSettingClassName from './Pages/PageSettingClassName';
import PageStudentAttendance from './Pages/PageStudentAttendance';
import PageSettingGradeClass from './Pages/PageSettingGradeClass';
import ClassMemberDelete from './Form/ClassMember/ClassMemberDelete';
import PageSettingAcademicYear from './Pages/PageSettingAcademicYear';
import PageSettingQuarterAcademicYear from './Pages/PageSettingQuarterAcademicYear';

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
        <Route index element={<PageBiodata />} />
        <Route path=":academic_year_id" element={<PageBiodata />} />
      </Route>
      <Route path="classmember" element={<PageLayout />}>
        <Route index element={<PageClassMember />} />
        <Route path=":academic_year_id" element={<PageClassMember />} />
        <Route path="delete" element={<ClassMemberDelete />} />
      </Route>
      <Route path="score" element={<PageLayout />}>
        <Route index element={<PageScore />} />
        <Route path=":academic_year_id" element={<PageScore />} />
        <Route path="input" element={<ScoreInput />} />
      </Route>
      <Route path="attendance" element={<PageLayout />}>
        <Route index element={<PageStudentAttendance />} />
        <Route path=":academic_year_id" element={<PageStudentAttendance />} />
      </Route>
      <Route path="notes" element={<PageLayout />}>
        <Route index element={<PageTeacherNotes />} />
        <Route path=":academic_year_id" element={<PageTeacherNotes />} />
      </Route>
      <Route path="rapor" element={<PageLayout />}>
        <Route index element={<PageReportCards />} />
        <Route path=":academic_year_id" element={<PageReportCards />} />
      </Route>
      <Route path="setting" element={<PageLayout />}>
        <Route index element={<PageSettingAcademicYear />} />
        <Route path="subject" element={<PageSettingSubject />} />
        <Route path="class-name" element={<PageSettingClassName />} />
        <Route path="grade-class" element={<PageSettingGradeClass />} />
        <Route path="academic-year" element={<PageSettingAcademicYear />} />
        <Route path="quarter-academic-year" element={<PageSettingQuarterAcademicYear />} />
      </Route>
      <Route path="moving-class" element={<PageLayout />}>
        <Route index element={<PageSettingMovingClass />} />
      </Route>
      <Route path="logout" element={<PageLayout />}></Route>
    </Routes>
  );
}

export default Page;
