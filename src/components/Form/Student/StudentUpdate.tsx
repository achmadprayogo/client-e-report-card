import { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import Input from "../Input";
import Loading from "../../Loading/Loading";
import ErrorServer from "../../ErrorServer/ErrorServer";
import NotFoundError from "../../NotFoundError/NotFoundError";
import Alert from "../../Alert/Alert";
import { initialAlert, initialFormUpdateStudent } from "../../../../initialStates"; // prettier-ignore
import { patchData } from "../../../../fetcher";
import Helper from "../../../../Helper";
import TitleInput from "../TitleInput";
import BackButton from "../BackButton";
import ContentContainer from "../../ContentContainer";
import { AlertConfig, Student } from "../../../../index";
import { useNavigate } from "react-router";

export default function StudentInput() {
  const [formData, setFormData] = useState<Student>(initialFormUpdateStudent);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusResponse, setStatusResponse] = useState<number>(0);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [lastData, setLastData] = useState<Student>(initialFormUpdateStudent);
  const studentId: string = window.location.search.split("=")[1];
  const navigate = useNavigate();

  function formatResult(result: Student) {
    return {
      ...result,
      age: undefined,
      academic_year: undefined,
      grade_id: undefined,
      status: undefined,
    };
  }

  useEffect(() => {
    async function getStudentData() {
      setLoading(true);

      const result = await Helper.getStudentData(studentId);

      setStatusResponse(result.status);
      setLoading(false);

      setFormData(formatResult(result));
      setLastData(formatResult(result));
    }
    getStudentData();
  }, [studentId]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(formData);
    setIsUpdate(isChanged);
  }, [formData, lastData]);

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAlert(Helper.closeAlert());
    e.preventDefault();

    const result = await patchData("/api/admin/students/update", formData);

    switch (result.status) {
      case 200:
        const newData = Helper.formatStudentData((result as AxiosResponse).data.data); // prettier-ignore

        setAlert(Helper.successAlert());
        setLastData(formatResult(newData));
        setFormData(formatResult(newData));
        break;
      case 409:
        setAlert(Helper.confilctAlert());
        break;
      case 500:
        setStatusResponse(500);
        break;
      default:
        setAlert(Helper.errorAlert());
        break;
    }
  };

  const handleDelete = async () => {
    navigate("/biodata/delete?id=" + studentId);
  };

  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  const handleReset = () => {
    setFormData(lastData);
  };

  if (loading) {
    return <Loading />;
  }

  if (statusResponse === 500) {
    return <ErrorServer />;
  }

  if (statusResponse <= 400 && statusResponse < 500) {
    return <NotFoundError data={"Santri"} />;
  }

  return (
    <ContentContainer>
      <div className="relative flex flex-col space-y-4 w-full p-4">
        <div>
          <BackButton />
          <TitleInput>UPDATE DATA SANTRI</TitleInput>
          <Alert
            isShow={!alert.isShow}
            alertStatus={alert.alertStatus}
            message={alert.message}
            onClose={handleAlertClose}
          />
          <div className="text-white underline absolute top-4 right-4 flex flex-row space-x-4">
            <button onClick={handleReset}>reset</button>
            <button onClick={handleDelete} className="text-red-500">
              delete
            </button>
          </div>
        </div>

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
                value={formData.nis}
                onChange={handleChange}
              />
              <Input
                label="Nama Lengkap"
                required={true}
                labelWidth="250px"
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
              <Input
                label="Tempat Lahir"
                required={true}
                labelWidth="250px"
                type="text"
                name="city_of_birth"
                value={formData.city_of_birth}
                onChange={handleChange}
              />
              <Input
                label="Tanggal Lahir"
                required={true}
                labelWidth="250px"
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
              />
              <Input
                label="Nama Ayah"
                required={true}
                labelWidth="250px"
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
              />
              <Input
                label="Nama Ibu"
                required={true}
                labelWidth="250px"
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
              />
              <Input
                label="Nama Wali"
                labelWidth="250px"
                type="text"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleChange}
              />
              <Input
                label="Alamat"
                required={true}
                labelWidth="250px"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-row justify-center mt-4">
            <button
              type="submit"
              disabled={!isUpdate}
              className={`${
                isUpdate ? "bg-yellow-500" : "bg-slate-500"
              } w-1/2 text-white px-4 py-2 rounded-md font-semibold`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </ContentContainer>
  );
}
