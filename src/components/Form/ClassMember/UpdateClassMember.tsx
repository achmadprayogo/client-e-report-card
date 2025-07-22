import { useEffect, useState } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import { patchData } from '../../../../fetcher';
import PopUpContainer from '../../PopUpContainer';
import ResetButton from '../../Button/ResetButton';
import ButtonSubmit from '../../Button/ButtonSubmit';
import DeleteButton from '../../Button/DeleteButton';
import {
  AlertConfig,
  ClassMember,
  ClassNameOption,
  Option,
  StudentStatus,
} from '../../../../index';
import {
  initialOptions,
  statusOptions,
  initialClassMember,
  initialAlert,
  initialClassNameOptions,
} from '../../../../initialStates';

interface UpdateClassMemberProps {
  selectedData: ClassMember;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateClassMember({ selectedData, isOpen, setIsOpen }: UpdateClassMemberProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [formData, setFormData] = useState<ClassMember>(initialClassMember);
  const [lastData, setLastData] = useState<ClassMember>(initialClassMember);
  const [homeroomTeacher, setHomeroomTeacher] = useState<string>('Belum Ada Data');
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [studentStatusOptions, setStudentStatusOptions] = useState<Option[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] = useState<ClassNameOption[]>(initialClassNameOptions); // prettier-ignore

  async function setOptions(data: ClassMember) {
    const gradeOptions: Option[] = await Helper.getGradeClassOptions(data.academic_year_id);
    setGradeClassOptions(gradeOptions);

    const classOptions: ClassNameOption[] = await Helper.getClassNameOptions(data.grade_class_id);
    setClassNameOptions(classOptions);

    setStudentStatusOptions(statusOptions);
    setHomeroomTeacher(data.homeroom_teacher);
  }

  useEffect(() => {
    setFormData(selectedData);
    setLastData(selectedData);
    setOptions(selectedData);
  }, [selectedData]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(formData);
    setIsUpdate(isChanged);
  }, [formData, lastData]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'grade_class_id') {
      const options = await Helper.getClassNameOptions(value);
      setClassNameOptions(options);

      resetClassNameSelected();
    }

    if (name === 'class_name_id') {
      const teacher = Helper.getHomeroomTeacher(classNameOptions, value);
      setHomeroomTeacher(teacher);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    function resetClassNameSelected() {
      setFormData((prevData) => ({
        ...prevData,
        class_name_id: '',
      }));
      setHomeroomTeacher('Belum Ada Data');
    }
  };

  const handleReset = async () => {
    await setOptions(lastData);
    setFormData(lastData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setAlert(Helper.closeAlert());
    e.preventDefault();
    setIsLoading(true);

    if (isUpdate) {
      const result = await patchData('/api/admin/class-member/update', formData);
      if (result.status === 200) {
        setLastData(formData);
        setAlert(Helper.successAlert());
      } else {
        setAlert(Helper.errorAlert('Gagal mengupdate data santri'));
      }
    } else {
      setAlert(Helper.errorAlert('Tidak ada perubahan data'));
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    setAlert(Helper.closeAlert());
  };

  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  const handleClose = () => {
    setIsOpen();
  };

  return (
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Update Data Kelas">
      <div className="absolute top-16 right-4 ">
        <ResetButton onClick={handleReset} />
      </div>
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
              required={true}
              labelWidth="250px"
              type="number"
              name="nis"
              value={formData.nis}
              readOnly
            />
            <Input
              label="Nama Lengkap"
              required={true}
              labelWidth="250px"
              type="text"
              name="fullname"
              value={formData.fullname}
              readOnly
            />
            <Input
              label="Tempat Lahir"
              required={true}
              labelWidth="250px"
              type="text"
              name="city_of_birth"
              value={formData.city_of_birth}
              readOnly
            />
            <Input
              label="Tanggal Lahir"
              required={true}
              labelWidth="250px"
              type="date"
              name="birthdate"
              value={formData.birthdate}
              readOnly
            />
            <Input
              label="Nama Ayah"
              required={true}
              labelWidth="250px"
              type="text"
              name="father_name"
              value={formData.father_name}
              readOnly
            />
            <Input
              label="Nama Ibu"
              required={true}
              labelWidth="250px"
              type="text"
              name="mother_name"
              value={formData.mother_name}
              readOnly
            />
            <Input
              label="Nama Wali"
              labelWidth="250px"
              type="text"
              name="guardian_name"
              value={formData.guardian_name}
              readOnly
            />
            <Input
              label="Alamat"
              required={true}
              labelWidth="250px"
              type="text"
              name="address"
              value={formData.address}
              readOnly
            />
          </div>
          <div className="w-1/2 p-4 space-y-1">
            <p className="text-white mb-2">AKADEMIK</p>
            <Input
              label="Tahun Ajaran"
              labelWidth="250px"
              type="text"
              name="academic_year_id"
              value={formData.academic_year}
              readOnly
            />
            <Input
              label="Status"
              required={true}
              labelWidth="250px"
              type="select"
              options={studentStatusOptions}
              value={formData.student_status as StudentStatus}
              name="student_status"
              onChange={handleChange}
            />
            <Input
              label="Tingkat"
              labelWidth="250px"
              type="select"
              name="grade_class_id"
              options={gradeClassOptions}
              value={formData.grade_class_id}
              onChange={handleChange}
            />
            <Input
              label="Kelas"
              required={true}
              labelWidth="250px"
              type="select"
              name="class_name_id"
              options={classNameOptions}
              value={formData.class_name_id}
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
        <div className="flex flex-row justify-center items-center mt-4">
          <ButtonSubmit title="Update" disabled={!isUpdate} isLoading={isLoading} />
        </div>
      </form>
      <div className="absolute bottom-5 right-4 ">
        <DeleteButton onClick={handleDelete} />
      </div>
    </PopUpContainer>
  );
}

export default UpdateClassMember;
