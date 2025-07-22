import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Input from "../Input";
import { AlertConfig, AttendanceData } from "../../../../index";
import { initialAlert, initialAttendanceData } from "../../../../initialStates";
import { patchData } from "../../../../fetcher";
import { AxiosResponse } from "axios";
import Alert from "../../Alert/Alert";
import Helper from "../../../../Helper";
import PopUpContainer from "../../../components/PopUpContainer";
import ResetButton from "../../Button/ResetButton";

interface UpdateStudentAttendance {
  selectedData: AttendanceData;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateStudentAttendance({
  selectedData,
  isOpen,
  setIsOpen,
}: UpdateStudentAttendance) {
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [lastData, setLastData] = useState<AttendanceData>(
    initialAttendanceData
  );
  const [newData, setNewData] = useState<AttendanceData>(initialAttendanceData);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const rootElement = document.getElementById("root") as HTMLElement;

  useEffect(() => {
    setNewData(selectedData);
    setLastData(selectedData);
    if (isOpen) {
      rootElement.classList.add("blur-md");
    }
    return () => {
      rootElement.classList.remove("blur-md");
    };
  }, [isOpen]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(newData);
    setIsUpdate(isChanged);
  }, [lastData, newData]);

  const handleReset = () => {
    setNewData(lastData);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await patchData(
      "/api/admin/student-attendance/update",
      newData
    );
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert());
        break;
      default:
        setAlert(Helper.errorAlert());
        break;
    }
    let updatedData = (response as AxiosResponse).data.data;
    updatedData = {
      ...newData,
      total_sicks: updatedData.total_sick,
      total_permissions: updatedData.total_permission,
      total_absences: updatedData.total_absence,
    };
    setNewData(updatedData);
    setLastData(updatedData);
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNewData({ ...newData, [e.target.name]: parseInt(e.target.value) });
  };
  const handleClose = () => {
    setIsOpen();
  };
  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <PopUpContainer
      isOpen={isOpen}
      setIsOpen={handleClose}
      title="Update Absensi"
    >
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
            <p className="text-white mb-2 ">DATA SANTRI</p>
            <Input
              label="NIS"
              labelWidth="250px"
              type="number"
              name="nis"
              value={newData.nis}
              readOnly
            />
            <Input
              key={2}
              label="Nama Lengkap"
              labelWidth="250px"
              type="text"
              name="fullname"
              value={newData.fullname}
              readOnly
            />
            <Input
              key={3}
              label="Tingkat"
              labelWidth="250px"
              type="text"
              name="grade_class"
              value={newData.grade_class}
              readOnly
            />
            <Input
              key={4}
              label="Kelas"
              labelWidth="250px"
              type="text"
              name="class_name"
              value={newData.class_name}
              readOnly
            />
            <Input
              key={5}
              label="Walikelas"
              labelWidth="250px"
              type="text"
              name="homeroom_teacher"
              value={newData.homeroom_teacher}
              readOnly
            />
            <Input
              key={6}
              label="Tahun Ajaran"
              labelWidth="250px"
              type="text"
              name="academic-year"
              value={newData.academic_year}
              readOnly
            />
            <Input
              key={7}
              label="Cawu"
              labelWidth="250px"
              type="text"
              name="quarter_academic_year"
              value={newData.quarter_academic_year}
              readOnly
            />
          </div>
          <div className="w-1/2 p-4 space-y-1">
            <p className="text-white mb-2">ABSENSI</p>
            <Input
              key={8}
              label="Sakit"
              labelWidth="250px"
              type="number"
              name="total_sicks"
              value={newData.total_sicks}
              onChange={handleChange}
            />
            <Input
              key={9}
              label="Izin"
              labelWidth="250px"
              type="number"
              name="total_permissions"
              value={newData.total_permissions}
              onChange={handleChange}
            />
            <Input
              key={10}
              label="Tanpa Alasan"
              labelWidth="250px"
              type="number"
              name="total_absences"
              value={newData.total_absences}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-row justify-center mt-4">
          <button
            type="submit"
            disabled={!isUpdate}
            className={`${
              isUpdate ? `bg-green-700 hover:bg-green-600` : `bg-slate-500`
            } w-1/2 text-white px-4 py-2 rounded-md `}
          >
            Update
          </button>
        </div>
      </form>
    </PopUpContainer>,
    document.body
  );
}

export default UpdateStudentAttendance;
