import { AlertConfig, Student } from '../../../../index';
import { useState, useEffect } from 'react';
import Input from '../Input';
import Alert from '../../Alert/Alert';
import Helper from '../../../../Helper';
import PopUpContainer from '../../PopUpContainer';
import ResetButton from '../../Button/ResetButton';
import ButtonSubmit from '../../Button/ButtonSubmit';
import DeleteButton from '../../Button/DeleteButton';
import { deleteData, patchData } from '../../../../fetcher';
import { initialAlert, initialStudent } from '../../../../initialStates';

interface UpdateStudentProps {
  selectedData: Student;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateStudent({ selectedData, isOpen, setIsOpen }: UpdateStudentProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [newData, setNewData] = useState<Student>(initialStudent);
  const [lastData, setLastData] = useState<Student>(initialStudent);

  useEffect(() => {
    setNewData(selectedData);
    setLastData(selectedData);
  }, [selectedData]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(newData);
    setIsUpdate(isChanged);
  }, [newData, lastData]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAlert(Helper.closeAlert());
    e.preventDefault();
    setIsLoading(true);

    const { age, student_status, ...data } = newData;
    data.birthdate = Helper.indonesianDateToISO(data.birthdate);
    let result = await patchData('/api/admin/student/update', data);

    switch (result.status) {
      case 200:
        setAlert(Helper.successAlert('Berhasil mengupdate data santri'));
        setLastData(newData);
        break;
      case 409:
        setAlert(Helper.confilctAlert('NIS sudah terdaftar'));
        break;
      default:
        setAlert(Helper.errorAlert('Gagal mengupdate data santri'));
        break;
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    setAlert(Helper.closeAlert());
    setIsLoading(true);

    const result = await deleteData('/api/admin/student/delete?id=' + newData.id);
    switch (result.status) {
      case 200:
        setAlert(Helper.successAlert('Berhasil menghapus data santri'));
        break;
      default:
        setAlert(Helper.errorAlert('Gagal menghapus data santri'));
        break;
    }

    setIsLoading(false);
  };

  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  const handleReset = () => {
    setNewData(lastData);
  };

  const handleClose = () => {
    setIsOpen();
  };

  return (
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Update Data Santri">
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
          <div className="w-full p-4 space-y-1">
            <p className="text-white mb-2 ">BIODATA</p>
            <Input
              label="Nomor Induk Santri"
              required={true}
              labelWidth="250px"
              type="number"
              name="nis"
              value={newData.nis}
              onChange={handleChange}
            />
            <Input
              label="Nama Lengkap"
              required={true}
              labelWidth="250px"
              type="text"
              name="fullname"
              value={newData.fullname}
              onChange={handleChange}
            />
            <Input
              label="Tempat Lahir"
              required={true}
              labelWidth="250px"
              type="text"
              name="city_of_birth"
              value={newData.city_of_birth}
              onChange={handleChange}
            />
            <Input
              label="Tanggal Lahir"
              required={true}
              labelWidth="250px"
              type="date"
              name="birthdate"
              value={Helper.indonesianDateToISO(newData.birthdate)}
              onChange={handleChange}
            />
            <Input
              label="Nama Ayah"
              required={true}
              labelWidth="250px"
              type="text"
              name="father_name"
              value={newData.father_name}
              onChange={handleChange}
            />
            <Input
              label="Nama Ibu"
              required={true}
              labelWidth="250px"
              type="text"
              name="mother_name"
              value={newData.mother_name}
              onChange={handleChange}
            />
            <Input
              label="Nama Wali"
              labelWidth="250px"
              type="text"
              name="guardian_name"
              value={newData.guardian_name}
              onChange={handleChange}
            />
            <Input
              label="Alamat"
              required={true}
              labelWidth="250px"
              type="text"
              name="address"
              value={newData.address}
              onChange={handleChange}
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

export default UpdateStudent;
