import { useEffect, useState } from 'react';
import Input from '../Input';
import Helper from '../../../../Helper';
import ResetButton from '../../Button/ResetButton';
import ButtonSubmit from '../../Button/ButtonSubmit';
import { Response, ClassMemberSetting, Option } from '../../../../index';
import PopUpContainer from '../../../components/PopUpContainer';
import {
  initialClassMemberSetting,
  initialResponse,
  initialOptions,
} from '../../../../initialStates';
import { getData } from '../../../../fetcher';

interface UpdateMovingClassProps {
  selectedData: ClassMemberSetting;
  isOpen: boolean;
  setIsOpen: () => void;
  onSubmit: (data: ClassMemberSetting) => void;
}

function UpdateMovingClass({ selectedData, isOpen, setIsOpen, onSubmit }: UpdateMovingClassProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [lastData, setLastData] = useState<ClassMemberSetting>(initialClassMemberSetting);
  const [newData, setNewData] = useState<ClassMemberSetting>(initialClassMemberSetting);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>(initialOptions);
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] = useState<Option[]>(initialOptions);
  const [academicYearSelected, setAcademicYearSelected] = useState<string>('');
  const [gradeClassSelected, setGradeClassSelected] = useState<string>('');
  const [classNameSelected, setClassNameSelected] = useState<string>('');
  const [classNames, setClassNames] = useState<Response>(initialResponse);

  useEffect(() => {
    getAcademicYearOptions();
    setNewData(selectedData);
    setLastData(selectedData);
  }, [selectedData]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(newData);
    setIsUpdate(isChanged);
  }, [lastData, newData]);

  useEffect(() => {
    if (academicYearSelected) getGradeClassOptions();
  }, [academicYearSelected]);

  useEffect(() => {
    if (gradeClassSelected) getClassNameOptions();
    if (classNameSelected) fetchData();
  }, [gradeClassSelected]);

  const handleReset = () => {
    setNewData(lastData);
    setAcademicYearOptions(initialOptions);
    setAcademicYearOptions(academicYearOptions);
    setGradeClassOptions(initialOptions);
    setClassNameOptions(initialOptions);
    setAcademicYearSelected('');
    setGradeClassSelected('');
    setClassNameSelected('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(newData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNewData({
      ...newData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'next_academic_year') setAcademicYearSelected(e.target.value);
    if (e.target.name === 'next_grade_class') setGradeClassSelected(e.target.value);
    if (e.target.name === 'next_class_name_id') {
      setClassNameSelected(e.target.value);
      UpdateData(e.target.value);
    }
  };

  const handleClose = () => {
    setIsOpen();
    handleReset();
  };

  if (!isOpen) return null;

  return (
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Update Data Naik Kelas">
      <div className="absolute top-16 right-4 ">
        <ResetButton onClick={handleReset} />
      </div>
      <form onSubmit={handleSubmit} className="w-full h-full">
        <div className="p-4 space-y-1">
          <p className="text-white mb-2 ">KELAS LAMA</p>
          <Input
            key={1}
            label="NIS"
            labelWidth="250px"
            type="text"
            name="academic_year"
            value={newData.nis}
            readOnly
          />
          <Input
            key={2}
            label="Nama Lengkap"
            labelWidth="250px"
            type="text"
            name="academic_year"
            value={newData.fullname}
            readOnly
          />
          <Input
            key={3}
            label="Tahun Ajaran"
            labelWidth="250px"
            type="text"
            name="academic_year"
            value={newData.academic_year}
            readOnly
          />
          <Input
            key={4}
            label="Tingkat"
            labelWidth="250px"
            type="text"
            name="grade_class"
            value={newData.grade_class}
            readOnly
          />
          <Input
            key={5}
            label="Wali Kelas"
            labelWidth="250px"
            type="text"
            name="homeroom_teacher"
            value={newData.homeroom_teacher}
            readOnly
          />
        </div>
        <div className="px-4 space-y-1">
          <p className="text-white mb-2">KELAS BARU</p>
          <Input
            key={6}
            label="Tahun Ajaran"
            labelWidth="250px"
            type="select"
            name="next_academic_year"
            options={academicYearOptions}
            onChange={handleChange}
            required
          />
          <Input
            key={7}
            label="Tingkat"
            labelWidth="250px"
            type="select"
            name="next_grade_class"
            options={gradeClassOptions}
            onChange={handleChange}
            required
          />
          <Input
            key={8}
            label="Kelas"
            labelWidth="250px"
            type="select"
            name="next_class_name_id"
            options={classNameOptions}
            onChange={handleChange}
            required
          />
          <Input
            key={9}
            label="Wali Kelas"
            labelWidth="250px"
            type="text"
            name="next_homeroom_teacher"
            value={newData.next_homeroom_teacher}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="flex flex-row justify-center items-center mt-10">
          <ButtonSubmit title="Update" disabled={!isUpdate} />
        </div>
      </form>
    </PopUpContainer>
  );

  async function getAcademicYearOptions() {
    let result: Option[] = await Helper.getAcademicYearOptions();
    result.pop();
    setAcademicYearOptions(result);
  }

  async function getGradeClassOptions() {
    const result = await Helper.getGradeClassOptions(academicYearSelected);
    result.pop();
    setGradeClassOptions(result);
  }

  async function getClassNameOptions() {
    const result = await Helper.getClassNameOptions(gradeClassSelected);
    result.pop();
    setClassNameOptions(result);
  }

  async function fetchData() {
    const classNames = await getData('/api/admin/class-name/' + gradeClassSelected);
    setClassNames(classNames);
  }

  function UpdateData(classNameIdSelected: string) {
    const newClassName = classNames.data.find(
      (className) => className.id === classNameIdSelected,
    ) as { attributes: { class_name: string; homeroom_teacher: string }; id: string } | undefined;
    const newGradeClass = classNames.included.find(
      (item) =>
        item.id === (newClassName?.attributes as { grade_class_id?: string })?.grade_class_id,
    );
    const newAcademicYear = classNames.included.find(
      (item) =>
        item.id ===
        (newGradeClass?.relationships as { academic_year: { data: { id: string } } }).academic_year
          .data.id,
    ) as
      | { id: string; attributes: { academic_year: string; start_date: string; end_date: string } }
      | undefined;
    if (newClassName && newGradeClass && newAcademicYear) {
      setNewData({
        ...newData,
        next_academic_year_id: newAcademicYear.id,
        next_academic_year: newAcademicYear?.attributes?.academic_year,
        next_academic_year_status: Helper.getDateStatus(
          newAcademicYear.attributes.start_date,
          newAcademicYear.attributes.end_date,
        ),
        next_class_name: newClassName?.attributes.class_name,
        next_grade_class: (newGradeClass.attributes as { grade_class: string }).grade_class,
        next_class_name_id: newClassName.id,
        next_homeroom_teacher: newClassName.attributes.homeroom_teacher,
      });
    } else {
      throw new Error(
        `Data not found. class_name: ${!!newClassName} grade_class: ${!!newGradeClass} academic_year; ${!!newAcademicYear}`,
      );
    }
  }
}

export default UpdateMovingClass;
