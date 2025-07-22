import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import ResetButton from '../../Button/ResetButton';
import DeleteButton from '../../Button/DeleteButton';
import ButtonSubmit from '../../Button/ButtonSubmit';
import { AlertConfig, SubjectDetail } from '../../../../index';
import { patchData, deleteData } from '../../../../fetcher';
import PopUpContainer from '../../../components/PopUpContainer';
import { initialAlert, initialSubjectDetail } from '../../../../initialStates';

interface UpdateSubjectProps {
  selectedData: SubjectDetail;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateSubject({ selectedData, isOpen, setIsOpen }: UpdateSubjectProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [newData, setNewData] = useState<SubjectDetail>(initialSubjectDetail);
  const [lastData, setLastData] = useState<SubjectDetail>(initialSubjectDetail);

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
    const response = await deleteData('/api/admin/subject/delete?id=' + newData.id);
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

    const response = await patchData('/api/admin/subject/update', newData);
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert('Data mata pelajaran berhasil diupdate'));
        break;
      default:
        setAlert(Helper.errorAlert('Gagal mengupdate data mata pelajaran'));
        break;
    }

    let updatedData = (response as AxiosResponse).data;
    updatedData = Helper.formatSubjects(updatedData.data, updatedData.included);
    setNewData(updatedData[0]);
    setLastData(updatedData[0]);
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
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Update Data Mata Pelajaran">
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
          <p className="text-white mb-2 ">DATA MATA PELAJARAN</p>
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
            label="Mata Pelajaran"
            labelWidth="250px"
            type="text"
            name="subject_name"
            value={newData.subject_name}
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

export default UpdateSubject;
