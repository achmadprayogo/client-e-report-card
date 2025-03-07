import ContentContainer from "../../ContentContainer";
import BackButton from "../BackButton";
import TitleInput from "../TitleInput";
import Alert from "../../Alert/Alert";
import Input from "../Input";
import {
  AlertConfig,
  ClassMember,
  Options,
  StudentStatus,
} from "../../../../index";
import { useEffect, useState } from "react";
import Helper from "../../../../Helper";
import {
  initialOptions,
  statusOptions,
  initialClassMember,
  initialAlert,
} from "../../../../initialStates";
import NotFoundError from "../../NotFoundError/NotFoundError";
import Loading from "../../Loading/Loading";
import ErrorServer from "../../ErrorServer/ErrorServer";
import { patchData } from "../../../../fetcher";
import { useNavigate } from "react-router";

function ClassMemberUpdate() {
  const classMemberId: string = window.location.search.split("=")[1];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [formData, setFormData] = useState<ClassMember>(initialClassMember);
  const [lastData, setLastData] = useState<ClassMember>(initialClassMember);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [statusResponse, setStatusResponse] = useState<number>(0);
  const [gradeClassOptions, setGradeClassOptions] =
    useState<Options[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] =
    useState<Options[]>(initialOptions);
  const [studentStatusOptions, setStudentStatusOptions] =
    useState<Options[]>(initialOptions);
  const [homeroomTeacher, setHomeroomTeacher] =
    useState<string>("Belum Ada Data");
  const navigate = useNavigate();

  useEffect(() => {
    async function getClassMemberData() {
      const result = await Helper.getClassMemberData(classMemberId);
      console.log(result);

      setStatusResponse(result.status);

      setFormData(result);
      setLastData(result);

      getGradeClassOptions(result.academic_year_id, result.grade_class_id);
      getClassNameOptions(result.grade_class_id, result.class_name_id);
      getStudentStatusOptions(result.student_status);
      setHomeroomTeacher("Ust. " + result.homeroom_teacher);
    }

    setIsLoading(true);
    getClassMemberData();
    setIsLoading(false);

    async function getGradeClassOptions(
      academicYearIdSelected: string,
      gradeClassIdSelected: string
    ) {
      const result: Options[] = await Helper.getGradeOptions(
        academicYearIdSelected
      );
      const options: Options[] = result.map((result) => {
        result.selected = false;

        if (result.value === gradeClassIdSelected) {
          result.selected = true;
        }

        return result;
      });

      setGradeClassOptions(options);
    }

    async function getClassNameOptions(
      gradeClassIdSelected: string,
      classNameIdSelected: string
    ) {
      const result: Options[] = await Helper.getClassNameOptions(
        gradeClassIdSelected
      );
      const options: Options[] = result.map((result) => {
        result.selected = false;

        if (result.value === classNameIdSelected) {
          result.selected = true;
        }

        return result;
      });
      setClassNameOptions(options);
    }

    function getStudentStatusOptions(studentStatusSelected: StudentStatus) {
      const options: Options[] = statusOptions.map((option) => {
        option.selected = false;

        if (option.value === studentStatusSelected) {
          option.selected = true;
        }

        return option;
      });
      setStudentStatusOptions(options);
    }
  }, [classMemberId]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(formData);
    setIsUpdate(isChanged);
  }, [formData, lastData]);

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    let result: any;

    switch (name) {
      case "grade_class_id":
        result = await Helper.getClassNameOptions(value);
        setClassNameOptions(result);
        setFormData((prevData) => ({
          ...prevData,
          class_name_id: "",
        }));

        setHomeroomTeacher("Belum Ada Data");
        break;

      case "class_name_id":
        result = await Helper.getHomeroomTeacher(value);
        setHomeroomTeacher(result);
        break;

      default:
        break;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setAlert(Helper.closeAlert());
    e.preventDefault();

    if (isUpdate) {
      const result = await patchData("/api/admin/classmember/update", formData);
      if (result.status === 200) {
        setLastData(formData);
        setAlert(Helper.successAlert());
      }
    }
  };

  const handleDelete = async () => {
    setAlert(Helper.closeAlert());
    navigate(`/classmember/delete?id=${classMemberId}`);
  };

  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  if (statusResponse === 404) {
    return <NotFoundError data={classMemberId} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (statusResponse === 500) {
    return <ErrorServer />;
  }

  return (
    <ContentContainer>
      <div className="relative flex flex-col space-y-4 w-full p-4">
        <div>
          <BackButton />
          <TitleInput>UPDATE DATA KELAS</TitleInput>
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
            <div className="w-1/2 p-4 space-y-1">
              <p className="text-white mb-2 ">BIODATA</p>
              <Input
                label="Nomor Induk Santri"
                required={true}
                labelWidth="250px"
                type="number"
                name="nis"
                value={formData.nis}
                readOnly
              />
              <Input
                label="Nama Lengkap"
                required={true}
                labelWidth="250px"
                type="text"
                name="fullname"
                value={formData.fullname}
                readOnly
              />
              <Input
                label="Tempat Lahir"
                required={true}
                labelWidth="250px"
                type="text"
                name="city_of_birth"
                value={formData.city_of_birth}
                readOnly
              />
              <Input
                label="Tanggal Lahir"
                required={true}
                labelWidth="250px"
                type="date"
                name="birthdate"
                value={formData.birthdate}
                readOnly
              />
              <Input
                label="Nama Ayah"
                required={true}
                labelWidth="250px"
                type="text"
                name="father_name"
                value={formData.father_name}
                readOnly
              />
              <Input
                label="Nama Ibu"
                required={true}
                labelWidth="250px"
                type="text"
                name="mother_name"
                value={formData.mother_name}
                readOnly
              />
              <Input
                label="Nama Wali"
                labelWidth="250px"
                type="text"
                name="guardian_name"
                value={formData.guardian_name}
                readOnly
              />
              <Input
                label="Alamat"
                required={true}
                labelWidth="250px"
                type="text"
                name="address"
                value={formData.address}
                readOnly
              />
            </div>
            <div className="w-1/2 p-4 space-y-1">
              <p className="text-white mb-2">AKADEMIK</p>
              <Input
                label="Tahun Ajaran"
                required={true}
                labelWidth="250px"
                type="text"
                name="academic_year_id"
                value={formData.academic_year}
                readOnly
              />
              <Input
                label="Status"
                required={true}
                labelWidth="250px"
                type="select"
                options={studentStatusOptions}
                name="student_status"
                onChange={handleChange}
              />
              <Input
                label="Tingkat"
                labelWidth="250px"
                type="select"
                name="grade_class_id"
                options={gradeClassOptions}
                onChange={handleChange}
              />
              <Input
                label="Kelas"
                required={true}
                labelWidth="250px"
                type="select"
                name="class_name_id"
                options={classNameOptions}
                onChange={handleChange}
              />
              <Input
                label="Walikelas"
                labelWidth="250px"
                type="text"
                name="homeroom_teacher"
                value={homeroomTeacher}
                readOnly
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
      </div>
    </ContentContainer>
  );
}

export default ClassMemberUpdate;
