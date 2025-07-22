import Helper from '../../Helper';
import NavItem from './NavItem';
import { useEffect, useState } from 'react';

function PageNavbar() {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const path = window.location.pathname.split('/')[1];
  const [lastAcademicYearId, setLastAcademicYearId] = useState<string>('');

  useEffect(() => {
    setActiveItem(path);
  }, [path]);

  // If on the score page, set the last academic year
  useEffect(() => {
    async function getAcademicYearOptions() {
      const result = await Helper.getAcademicYearOptions();
      result.pop();
      result.reverse();
      setLastAcademicYearId(result[result.length - 2].value);
    }
    getAcademicYearOptions();
  }, []);

  return (
    <div
      className="fixed top-28 left-0 z-10 w-20 bg-[#303030] border-x-0 border-e-2 border-s-2 border-b-2 bottom-0 hover:w-[240px] group transition-all duration-500 ease-in-out overflow-y-auto overflow-x-hidden
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
      <ul className="flex flex-col p-2 h-full ">
        <NavItem
          endPoint={'/dashboard'}
          icon={'dashboard'}
          name={'Dashboard'}
          isActive={activeItem === 'dashboard'}
        />
        <NavItem
          endPoint={'/biodata'}
          icon={'person_book'}
          name={'Biodata Santri'}
          isActive={activeItem === 'biodata'}
        />
        <NavItem
          endPoint={'/classmember'}
          icon={'groups'}
          name={'Anggota Kelas'}
          isActive={activeItem === 'classmember'}
        />
        <NavItem
          endPoint={'/score/' + lastAcademicYearId}
          icon={'money'}
          name={'Nilai Ujian'}
          isActive={activeItem === 'score'}
        />
        <NavItem
          endPoint={'/attendance'}
          icon={'checklist_rtl'}
          name={'Absensi Santri'}
          isActive={activeItem === 'attendance'}
        />
        <NavItem
          endPoint={'/notes'}
          icon={'edit_note'}
          name={'Catatan Walikelas'}
          isActive={activeItem === 'notes'}
        />
        <NavItem
          endPoint={'/rapor'}
          icon={'book'}
          name={'Rapor Santri'}
          isActive={activeItem === 'rapor'}
        />
        <NavItem
          endPoint={'/moving-class'}
          icon={'stairs'}
          name={'Naik Kelas'}
          isActive={activeItem === 'moving-class'}
        />
        <NavItem
          endPoint={'/setting'}
          icon={'settings'}
          name={'Pengaturan'}
          isActive={activeItem === 'setting'}
        />
        <NavItem
          endPoint={'/logout'}
          icon={'logout'}
          name={'Logout'}
          isActive={activeItem === 'logout'}
        />
      </ul>
    </div>
  );
}

export default PageNavbar;
