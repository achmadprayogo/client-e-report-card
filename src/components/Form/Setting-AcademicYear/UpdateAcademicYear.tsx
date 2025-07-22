import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Input from '../Input';
import { AlertConfig, AcademicYear } from '../../../../index';
import { initialAlert, initialAcademicYear } from '../../../../initialStates';
import { patchData, deleteData } from '../../../../fetcher';
import { AxiosResponse } from 'axios';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import PopUpContainer from '../../../components/PopUpContainer';
import ResetButton from '../../Button/ResetButton';
import DeleteButton from '../../Button/DeleteButton';
import ButtonSubmit from '../../Button/ButtonSubmit';

interface UpdateAcademicYear {
  selectedData: AcademicYear;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateAcademicYear({ selectedData, isOpen, setIsOpen }: UpdateAcademicYear) {
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [lastData, setLastData] = useState<AcademicYear>(initialAcademicYear);
  const [newData, setNewData] = useState<AcademicYear>(initialAcademicYear);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const rootElement = document.getElementById('root') as HTMLElement;

  useEffect(() => {
    setNewData(selectedData);
    setLastData(selectedData);
    if (isOpen) {
      rootElement.classList.add('blur-md');
    }
    return () => {
      rootElement.classList.remove('blur-md');
    };
  }, [isOpen]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(newData);
    setIsUpdate(isChanged);
  }, [lastData, newData]);

  const handleReset = () => {
    setNewData(lastData);
  };
  const handleDelete = async () => {
    const response = await deleteData('/api/admin/academicyear/delete?id=' + newData.id);
    console.log(response);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert('Tahun ajaran berhasil dihapus'));
        break;
      default:
        setAlert(
          Helper.errorAlert(
            `Gagal menghapus tahun ajaran [ ${
              (response as any)?.error?.message || 'Unknown error'
            } ]`,
          ),
        );
        break;
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await patchData('/api/admin/academicyear/update', newData);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert());
        break;
      default:
        setAlert(Helper.errorAlert());
        break;
    }
    let updatedData = (response as AxiosResponse).data.data;
    updatedData = Helper.formatAcademicYears(updatedData);
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

  return ReactDOM.createPortal(
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Update Tahun Ajaran">
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
          <p className="text-white mb-2 ">DATA TAHUN AJARAN</p>
          <Input
            key={1}
            label="Tahun Ajaran"
            labelWidth="250px"
            type="text"
            name="academic_year"
            value={newData.academic_year}
            onChange={handleChange}
            required
          />
          <Input
            key={2}
            label="Tanggal Awal"
            labelWidth="250px"
            type="date"
            name="start_date"
            value={newData.start_date}
            onChange={handleChange}
            required
          />
          <Input
            key={3}
            label="Tanggal Akhir"
            labelWidth="250px"
            type="date"
            name="end_date"
            value={newData.end_date}
            onChange={handleChange}
            required
          />
          <Input
            key={4}
            label="Kepala Madrasah"
            labelWidth="250px"
            type="text"
            name="head_master"
            value={newData.head_master}
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
    </PopUpContainer>,
    document.body,
  );
}

export default UpdateAcademicYear;
