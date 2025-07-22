import { useState, useEffect } from 'react';
import { AlertConfig, ClassNameOption, FormInputStudent, Option } from '../../../../index';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import { postData } from '../../../../fetcher';
import PopUpContainer from '../../PopUpContainer';
import ButtonSubmit from '../../Button/ButtonSubmit';
import {
  initialAlert,
  initialOptions,
  statusOptions,
  initialFormInputStudent,
  initialClassNameOptions,
} from '../../../../initialStates';

interface InputStudentProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

export default function InputStudent({ isOpen, setIsOpen }: InputStudentProps) {
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [homeroomTeacher, setHomeroomTeacher] = useState<string>('Belum ada data');
  const [formData, setFormData] = useState<FormInputStudent>(initialFormInputStudent);
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] = useState<ClassNameOption[]>(initialClassNameOptions); // prettier-ignore

  useEffect(() => {
    async function fetchAcademicYearOptions() {
      const result: Option[] = await Helper.getAcademicYearOptions();
      result.pop();
      setAcademicYearOptions(result);
    }

    fetchAcademicYearOptions();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    let result: any;

    switch (name) {
      case 'academic_year_id':
        result = await Helper.getGradeClassOptions(value);
        result.pop();
        setGradeClassOptions(result);
        break;
      case 'grade_id':
        result = await Helper.getClassNameOptions(value);
        result.pop();
        setClassNameOptions(result);
        break;
      case 'class_name_id':
        result = Helper.getHomeroomTeacher(classNameOptions, value);
        setHomeroomTeacher(result);
        break;
      default:
        break;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAlert(Helper.closeAlert());
    e.preventDefault();
    setIsLoading(true);

    const result = await postData('/api/admin/student/input', {
      ...formData,
      grade_id: undefined,
    });

    switch (result.status) {
      case 201:
        setAlert(Helper.successAlert());
        break;
      case 409:
        setAlert(Helper.confilctAlert());
        break;
      default:
        setAlert(Helper.errorAlert());
        break;
    }

    setIsLoading(false);
  };

  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  const handleClose = () => {
    setIsOpen();
  };

  return (
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Tambah Data Santri">
      <Alert
        isShow={!alert.isShow}
        alertStatus={alert.alertStatus}
        message={alert.message}
        onClose={handleAlertClose}
      />
      <form onSubmit={handleSubmit} className="w-full h-full">
        <div className="flex flex-row w-full">
          <div className="w-1/2 p-4 space-y-1">
            <p className="text-white mb-2 ">BIODATA</p>
            <Input
              label="Nomor Induk Santri"
              labelWidth="250px"
              type="number"
              name="nis"
              onChange={handleChange}
              required
            />
            <Input
              label="Nama Lengkap"
              required={true}
              labelWidth="250px"
              type="text"
              name="fullname"
              onChange={handleChange}
            />
            <Input
              label="Tempat Lahir"
              required={true}
              labelWidth="250px"
              type="text"
              name="city_of_birth"
              onChange={handleChange}
            />
            <Input
              label="Tanggal Lahir"
              required={true}
              labelWidth="250px"
              type="date"
              name="birthdate"
              onChange={handleChange}
            />
            <Input
              label="Nama Ayah"
              required={true}
              labelWidth="250px"
              type="text"
              name="father_name"
              onChange={handleChange}
            />
            <Input
              label="Nama Ibu"
              required={true}
              labelWidth="250px"
              type="text"
              name="mother_name"
              onChange={handleChange}
            />
            <Input
              label="Nama Wali"
              labelWidth="250px"
              type="text"
              name="guardian_name"
              onChange={handleChange}
            />
            <Input
              label="Alamat"
              required={true}
              labelWidth="250px"
              type="text"
              name="address"
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2 p-4 space-y-1">
            <p className="text-white mb-2">AKADEMIK</p>
            <Input
              label="Tahun Ajaran"
              required={true}
              labelWidth="250px"
              type="select"
              name="academic_year_id"
              options={academicYearOptions}
              onChange={handleChange}
            />
            <Input
              label="Status"
              required={true}
              labelWidth="250px"
              type="select"
              options={statusOptions}
              name="status"
              onChange={handleChange}
            />
            <Input
              label="Tingkat"
              labelWidth="250px"
              type="select"
              name="grade_id"
              options={gradeClassOptions}
              onChange={handleChange}
            />
            <Input
              label="Kelas"
              required={true}
              labelWidth="250px"
              type="select"
              name="class_name_id"
              options={classNameOptions}
              onChange={handleChange}
            />
            <Input
              label="Walikelas"
              labelWidth="250px"
              type="text"
              name="homeroom_teacher"
              value={homeroomTeacher}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-row justify-center mt-4">
          <ButtonSubmit title="submit" disabled={false} isLoading={isloading} />
        </div>
      </form>
    </PopUpContainer>
  );
}
