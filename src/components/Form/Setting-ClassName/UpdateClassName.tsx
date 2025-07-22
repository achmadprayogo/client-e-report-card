import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import ResetButton from '../../Button/ResetButton';
import DeleteButton from '../../Button/DeleteButton';
import ButtonSubmit from '../../Button/ButtonSubmit';
import { AlertConfig, ClassName } from '../../../../index';
import { patchData, deleteData } from '../../../../fetcher';
import PopUpContainer from '../../../components/PopUpContainer';
import { initialAlert, initialClassName } from '../../../../initialStates';

interface UpdateClassNameProps {
  selectedData: ClassName;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateClassName({ selectedData, isOpen, setIsOpen }: UpdateClassNameProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [lastData, setLastData] = useState<ClassName>(initialClassName);
  const [newData, setNewData] = useState<ClassName>(initialClassName);
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
    const response = await deleteData('/api/admin/class-name/delete?id=' + newData.id);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert('Data kelas berhasil dihapus'));
        break;
      default:
        setAlert(
          Helper.errorAlert(
            `Gagal menghapus data kelas [ ${
              (response as any)?.error?.message || 'Unknown error'
            } ]`,
          ),
        );
        break;
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await patchData('/api/admin/class-name/update', newData);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert('Data Tingkat berhasil diupdate'));
        break;
      default:
        setAlert(Helper.errorAlert('Gagal mengupdate data Tingkat'));
        break;
    }
    let updatedData = (response as AxiosResponse).data;
    updatedData = Helper.formatGradeClass(updatedData.data, updatedData.included);
    setNewData(updatedData[0]);
    setLastData(updatedData[0]);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    console.log('e.target.name', e.target.name);
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
        <div className="p-4 space-y-1">
          <p className="text-white mb-2 ">DATA KELAS</p>
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
            label="Tingkat"
            labelWidth="250px"
            type="text"
            name="grade_class"
            value={newData.grade_class}
            readOnly
          />
          <Input
            key={3}
            label="Kelas"
            labelWidth="250px"
            type="text"
            name="class_name"
            value={newData.class_name}
            onChange={handleChange}
            required
          />
          <Input
            key={4}
            label="Wali Kelas"
            labelWidth="250px"
            type="text"
            name="homeroom_teacher"
            value={newData.homeroom_teacher}
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

export default UpdateClassName;
