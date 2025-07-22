import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import ResetButton from '../../Button/ResetButton';
import DeleteButton from '../../Button/DeleteButton';
import ButtonSubmit from '../../Button/ButtonSubmit';
import { patchData, deleteData } from '../../../../fetcher';
import PopUpContainer from '../../../components/PopUpContainer';
import { AlertConfig, QuarterAcademicYear } from '../../../../index';
import { initialAlert, initialQuarterAcademicYear } from '../../../../initialStates';

interface UpdateQuarterAcademicYearProps {
  selectedData: QuarterAcademicYear;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateQuarterAcademicYear({
  selectedData,
  isOpen,
  setIsOpen,
}: UpdateQuarterAcademicYearProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [lastData, setLastData] = useState<QuarterAcademicYear>(initialQuarterAcademicYear);
  const [newData, setNewData] = useState<QuarterAcademicYear>(initialQuarterAcademicYear);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);

  useEffect(() => {
    setNewData(selectedData);
    setLastData(selectedData);
  }, [selectedData]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(newData);
    setIsUpdate(isChanged);
  }, [lastData, newData]);

  const handleReset = () => {
    setNewData(lastData);
  };
  const handleDelete = async () => {
    const response = await deleteData('/api/admin/quarter-academic-year/delete?id=' + newData.id);
    console.log(response);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert('Data Cawu berhasil dihapus'));
        break;
      default:
        setAlert(
          Helper.errorAlert(
            `Gagal menghapus data cawu [ ${(response as any)?.error?.message || 'Unknown error'} ]`,
          ),
        );
        break;
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newData);
    const response = await patchData('/api/admin/quarter-academic-year/update', newData);
    switch (response.status) {
      case 200:
        console.log(response.status);
        setAlert(Helper.successAlert());
        break;
      default:
        setAlert(Helper.errorAlert());
        break;
    }
    let updatedData = (response as AxiosResponse).data;
    updatedData = Helper.formatQuarterAcademicYear(updatedData.data, updatedData.included);
    setNewData(updatedData);
    setLastData(updatedData);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    setIsOpen();
  };
  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  if (!isOpen) return null;

  return (
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Update Cawu">
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
        <div className="p-4 space-y-1">
          <p className="text-white mb-2 ">DATA CAWU</p>
          <Input
            key={1}
            label="Tahun Ajaran"
            labelWidth="250px"
            type="text"
            name="academic_year"
            value={newData.academic_year}
            readOnly
          />
          <Input
            key={2}
            label="Cawu"
            labelWidth="250px"
            type="number"
            name="quarter_academic_year"
            value={newData.quarter_academic_year}
            onChange={handleChange}
            required
          />
          <Input
            key={3}
            label="Tanggal Awal"
            labelWidth="250px"
            type="date"
            name="start_date"
            value={newData.start_date}
            onChange={handleChange}
            required
          />
          <Input
            key={4}
            label="Tanggal Akhir"
            labelWidth="250px"
            type="date"
            name="end_date"
            value={newData.end_date}
            onChange={handleChange}
            required
          />
          <Input
            key={5}
            label="Nilai KKM"
            labelWidth="250px"
            type="number"
            name="score_standart"
            value={newData.score_standart}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-row justify-center items-center mt-4">
          <ButtonSubmit title="Update" disabled={!isUpdate} />
        </div>
      </form>
      <div className="absolute bottom-5 right-4 ">
        <DeleteButton onClick={handleDelete} />
      </div>
    </PopUpContainer>
  );
}

export default UpdateQuarterAcademicYear;
