import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Input from "../Input";
import ContentContainer from "../../ContentContainer";
import Alert from "../../Alert/Alert";
import { initialAlert, initialClassMember } from "../../../../initialStates";
import { AlertConfig } from "../../../../index";
import { ClassMember } from "../../../../index";
import Helper from "../../../../Helper";
import { deleteData } from "../../../../fetcher";
import ErrorServer from "../../ErrorServer/ErrorServer";
import NotFoundError from "../../NotFoundError/NotFoundError";
import Loading from "../../Loading/Loading";

function ClassMemberDelete() {
  const classMemberId: string = window.location.search.split("=")[1];
  const [dataClassMember, setDataClassMember] = useState<ClassMember>(initialClassMember); // prettier-ignore
  const [statusResponse, setStatusResponse] = useState<number>(0);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getDataClassMember() {
      setIsLoading(true);
      const result = await Helper.getClassMemberData(classMemberId);
      console.log(result);
      setStatusResponse(result.status);

      setDataClassMember(result);
      setIsLoading(false);
    }

    getDataClassMember();
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(Helper.closeAlert());

    const result = await deleteData(`/api/admin/classmember/delete?id=${classMemberId}`); // prettier-ignore
    setStatusResponse(result.status);

    switch (result.status) {
      case 200:
        setAlert(Helper.successAlert());
        setTimeout(() => {
          navigate(-2);
        }, 3500);
        break;
      case 404:
        setAlert(Helper.notFoundAlert());
        break;
      default:
        setAlert(Helper.errorAlert());
        break;
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, isShow: false });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (statusResponse === 404) {
    return <NotFoundError data={classMemberId} />;
  }

  if (statusResponse === 500) {
    return <ErrorServer />;
  }

  return (
    <ContentContainer>
      <div className="relative flex flex-col space-y-4 w-full p-4">
        <div>
          <button
            onClick={handleCancel}
            className="text-white absolute top-4 left-4"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h3 className="text-2xl font-bold mb- text-white text-center">
            HAPUS DATA KELAS
          </h3>
          <Alert
            isShow={!alert.isShow}
            alertStatus={alert.alertStatus}
            message={alert.message}
            onClose={handleAlertClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="w-full h-full">
          <div className="flex flex-row w-full">
            <div className="w-1/2 p-4 space-y-1">
              <p className="text-white mb-2 ">BIODATA</p>
              <Input
                label="Nomor Induk Santri"
                required={true}
                labelWidth="250px"
                type="number"
                name="nis"
                value={dataClassMember?.nis}
                readOnly={true}
              />
              <Input
                label="Nama Lengkap"
                required={true}
                labelWidth="250px"
                type="text"
                name="fullname"
                value={dataClassMember?.fullname}
                readOnly={true}
              />
              <p className="text-white mb-2">AKADEMIK</p>
              <Input
                label="Tahun Ajaran"
                required={true}
                labelWidth="250px"
                type="text"
                name="academic_year"
                value={dataClassMember?.academic_year}
                readOnly={true}
              />
              <Input
                label="Status"
                labelWidth="250px"
                type="text"
                name="student_status"
                value={dataClassMember?.student_status}
                readOnly={true}
              />
              <Input
                label="Tingkat"
                required={true}
                labelWidth="250px"
                type="text"
                name="grade_class"
                value={dataClassMember?.grade_class}
                readOnly={true}
              />
              <Input
                label="Kelas"
                required={true}
                labelWidth="250px"
                type="text"
                name="class_name"
                value={dataClassMember?.class_name}
                readOnly={true}
              />
              <Input
                label="Wali Kelas"
                required={true}
                labelWidth="250px"
                type="text"
                name="homeroom_teacher"
                value={"Ust. " + dataClassMember?.homeroom_teacher}
                readOnly={true}
              />
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center w-1/2 text-yellow-500">
              <span className="material-symbols-outlined text-7xl">
                warning
              </span>
              <h3 className="text-4xl">Peringatan</h3>
              <i className="text-center text-white p-4">
                Menghapus data anggota kelas, juga akan menghapus data nilai,
                kelas, dan status. Pertimbangkan sekali lagi sebelum
                melanjutkan. Data yang telah dihapus tidak dapat dikembalikan.
              </i>
            </div>
          </div>
          <div className="flex flex-row justify-center mt-4 space-x-60">
            <button
              type="submit"
              className={`bg-rose-600 w-1/3 text-white px-4 py-2 rounded-md font-semibold`}
            >
              Tetap Hapus
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`bg-lime-600 w-1/3 text-white px-4 py-2 rounded-md font-semibold`}
            >
              Batalkan
            </button>
          </div>
        </form>
      </div>
    </ContentContainer>
  );
}

export default ClassMemberDelete;
