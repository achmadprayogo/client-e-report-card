import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Input from "../Input";
import { AlertConfig, AcademicYear } from "../../../../index";
import { initialAlert, initialAcademicYear } from "../../../../initialStates";
import { postData } from "../../../../fetcher";
import { AxiosResponse } from "axios";
import Alert from "../../Alert/Alert";
import Helper from "../../../../Helper";
import PopUpContainer from "../../../components/PopUpContainer";
import ButtonSubmit from "../../Button/ButtonSubmit";

interface InputAcademicYear {
  isOpen: boolean;
  setIsOpen: () => void;
}

function InputAcademicYear({ isOpen, setIsOpen }: InputAcademicYear) {
  const [formData, setFormData] = useState<AcademicYear>(initialAcademicYear);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const rootElement = document.getElementById("root") as HTMLElement;

  useEffect(() => {
    if (isOpen) {
      rootElement.classList.add("blur-md");
    }
    return () => {
      rootElement.classList.remove("blur-md");
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await postData("/api/admin/academicyear/input", formData);
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
    setFormData(updatedData);
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
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

  return ReactDOM.createPortal(
    <PopUpContainer
      isOpen={isOpen}
      setIsOpen={handleClose}
      title="Tambah Tahun Ajaran"
    >
      <Alert
        isShow={!alert.isShow}
        alertStatus={alert.alertStatus}
        message={alert.message}
        onClose={handleAlertClose}
      />
      <form onSubmit={handleSubmit} className="w-full h-full">
        <div className="p-4 space-y-1">
          <p className="text-white mb-2 italic">Masukkan data tahun ajaran!</p>
          <Input
            key={1}
            label="Tahun Ajaran"
            labelWidth="250px"
            type="text"
            name="academic_year"
            required
            onChange={handleChange}
          />
          <Input
            key={2}
            label="Tanggal Awal"
            labelWidth="250px"
            type="date"
            name="start_date"
            required
            onChange={handleChange}
          />
          <Input
            key={3}
            label="Tanggal Akhir"
            labelWidth="250px"
            type="date"
            name="end_date"
            required
            onChange={handleChange}
          />
          <Input
            key={4}
            label="Kepala Madrasah"
            labelWidth="250px"
            type="text"
            name="head_master"
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row justify-center mt-4">
          <ButtonSubmit title="submit" disabled={false} />
        </div>
      </form>
    </PopUpContainer>,
    document.body
  );
}

export default InputAcademicYear;
