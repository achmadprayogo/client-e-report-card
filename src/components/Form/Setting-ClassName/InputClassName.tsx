import { useEffect, useState } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import { postData } from '../../../../fetcher';
import ButtonSubmit from '../../Button/ButtonSubmit';
import PopUpContainer from '../../../components/PopUpContainer';
import { AlertConfig, ClassName, Option } from '../../../../index';
import { initialAlert, initialClassName, initialOptions } from '../../../../initialStates';

interface InputClassNameProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

function InputClassName({ isOpen, setIsOpen }: InputClassNameProps) {
  const [formData, setFormData] = useState<ClassName>(initialClassName);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>(initialOptions);
  const [academicYearSelected, setAcademicYearSelected] = useState<string>('');
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);

  useEffect(() => {
    async function fetchAcademicYearOptions() {
      const result: Option[] = await Helper.getAcademicYearOptions();
      setAcademicYearOptions(result);
    }
    fetchAcademicYearOptions();
  }, [isOpen]);

  useEffect(() => {
    async function fetchGradeClassOptions() {
      let result = await Helper.getGradeClassOptions(academicYearSelected);

      setGradeClassOptions(result);
    }
    fetchGradeClassOptions();
  }, [academicYearSelected]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await postData('/api/admin/class-name/input', formData);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert('Data kelas berhasil ditambahkan'));
        break;
      default:
        setAlert(Helper.errorAlert('Gagal menambahkan data kelas'));
        break;
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (e.target.name === 'academic_year_id') {
      setAcademicYearSelected(e.target.value);
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    setIsOpen();
  };
  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  if (!isOpen) return null;

  return (
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Tambah Kelas">
      <Alert
        isShow={!alert.isShow}
        alertStatus={alert.alertStatus}
        message={alert.message}
        onClose={handleAlertClose}
      />
      <form onSubmit={handleSubmit} className="w-full h-full">
        <div className="p-4 space-y-1">
          <p className="text-white mb-2 italic">Masukkan data kelas!</p>
          <Input
            label="Tahun Ajaran"
            labelWidth="250px"
            type="select"
            name="academic_year_id"
            options={academicYearOptions}
            onChange={handleChange}
            required
          />
          <Input
            key={2}
            label="Tingkat"
            labelWidth="250px"
            type="select"
            name="grade_class_id"
            options={gradeClassOptions}
            onChange={handleChange}
            required
          />
          <Input
            key={3}
            label="Kelas"
            labelWidth="250px"
            type="text"
            name="class_name"
            placeholder="masukkan nama kelas"
            required
            onChange={handleChange}
          />
          <Input
            key={4}
            label="Wali Kelas"
            labelWidth="250px"
            type="text"
            name="homeroom_teacher"
            placeholder="masukkan nama wali kelas"
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row justify-center mt-4">
          <ButtonSubmit title="submit" disabled={false} />
        </div>
      </form>
    </PopUpContainer>
  );
}

export default InputClassName;
