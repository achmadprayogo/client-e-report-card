import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import { postData } from '../../../../fetcher';
import ButtonSubmit from '../../Button/ButtonSubmit';
import PopUpContainer from '../../../components/PopUpContainer';
import { AlertConfig, Option, QuarterAcademicYear } from '../../../../index';
import { initialAlert, initialQuarterAcademicYear } from '../../../../initialStates';

interface InputQuarterAcademicYear {
  isOpen: boolean;
  setIsOpen: () => void;
}

function InputQuarterAcademicYear({ isOpen, setIsOpen }: InputQuarterAcademicYear) {
  const [formData, setFormData] = useState<QuarterAcademicYear>(initialQuarterAcademicYear);
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
    const response = await postData('/api/admin/quarter-academic-year/input', formData);
    console.log(response);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert());
        break;
      default:
        setAlert(Helper.errorAlert());
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
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Tambah Cawu">
      <Alert
        isShow={!alert.isShow}
        alertStatus={alert.alertStatus}
        message={alert.message}
        onClose={handleAlertClose}
      />
      <form onSubmit={handleSubmit} className="w-full h-full">
        <div className="p-4 space-y-1">
          <p className="text-white mb-2 italic">Masukkan data cawu!</p>
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
            label="Cawu"
            labelWidth="250px"
            type="number"
            name="quarter_academic_year"
            required
            onChange={handleChange}
          />
          <Input
            key={3}
            label="Tanggal Awal"
            labelWidth="250px"
            type="date"
            name="start_date"
            required
            onChange={handleChange}
          />
          <Input
            key={4}
            label="Tanggal Akhir"
            labelWidth="250px"
            type="date"
            name="end_date"
            required
            onChange={handleChange}
          />
          <Input
            key={5}
            label="KKM"
            labelWidth="250px"
            type="number"
            name="score_standart"
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

export default InputQuarterAcademicYear;
