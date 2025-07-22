import { useEffect, useState } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import { postData } from '../../../../fetcher';
import ButtonSubmit from '../../Button/ButtonSubmit';
import PopUpContainer from '../../../components/PopUpContainer';
import { AlertConfig, GradeClass, Option } from '../../../../index';
import { initialAlert, initialGradeClass } from '../../../../initialStates';

interface InputGradeClassProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

function InputGradeClass({ isOpen, setIsOpen }: InputGradeClassProps) {
  const [formData, setFormData] = useState<GradeClass>(initialGradeClass);
  const [academicYearOptions, setAcademicYearOptions] = useState<Option[]>([]);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);

  useEffect(() => {
    async function fetchData() {
      const result: Option[] = await Helper.getAcademicYearOptions();
      setAcademicYearOptions(result);
    }
    fetchData();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await postData('/api/admin/grade-class/input', formData);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert('Data Tingkat berhasil ditambahkan'));
        break;
      default:
        setAlert(Helper.errorAlert('Gagal menambahkan data tingkat'));
        break;
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
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
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Tambah Tingkat">
      <Alert
        isShow={!alert.isShow}
        alertStatus={alert.alertStatus}
        message={alert.message}
        onClose={handleAlertClose}
      />
      <form onSubmit={handleSubmit} className="w-full h-full">
        <div className="p-4 space-y-1">
          <p className="text-white mb-2 italic">Masukkan data tingkat!</p>
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
            key={2}
            label="Tingkat"
            labelWidth="250px"
            type="text"
            name="grade_class"
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

export default InputGradeClass;
