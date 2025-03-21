import ContentContainer from "../../ContentContainer";
import BackButton from "../BackButton";
import TitleInput from "../TitleInput";
import Alert from "../../Alert/Alert";
import Input from "../Input";
import Loading from "../../Loading/Loading";
import ErrorServer from "../../ErrorServer/ErrorServer";
import NotFoundError from "../../NotFoundError/NotFoundError";
import { useState, useEffect } from "react";
import { AlertConfig, Score, StudentScore } from "../../../../index";
import { getData, patchData } from "../../../../fetcher";
import Helper from "../../../../Helper";
import {
  initialStudentScore,
  initialScore,
  initialAlert,
} from "../../../../initialStates";

function ScoreUpdate() {
  const query: string = window.location.search.split("?")[1];
  const classMemberId: string = query.split("&")[0].split("=")[1];
  const quarterAcademicYearId: string = query.split("&")[1].split("=")[1];
  const [studentScores, setStudentScores] = useState<StudentScore>(initialStudentScore); // prettier-ignore
  const [formData, setFormData] = useState<Score[]>([initialScore]);
  const [lastData, setLastData] = useState<Score[]>([initialScore]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [statusResponse, setStatusResponse] = useState<number>(200);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);

  useEffect(() => {
    async function getScore() {
      setLoading(true);
      const URL = `/api/admin/classmember-scores/${classMemberId}/${quarterAcademicYearId}`;
      const response = await getData(URL);
      console.log(response);
      setStatusResponse(response.status);
      setLoading(false);
      const result: StudentScore = Helper.formatScore(
        response.data,
        response.included
      ) as StudentScore;

      setStudentScores(result);
      setLastData(result.scores);
      setFormData(result.scores);
    }
    getScore();
  }, []);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(formData);
    setIsUpdate(isChanged);
  }, [formData, lastData]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newData = {
      id: e.target.name.split("|")[0],
      subject: e.target.name.split("|")[1],
      score: parseInt(e.target.value),
    };

    const newFormData: Score[] = formData.map((score) => {
      if (score.id === newData.id) {
        return newData;
      }
      return score;
    });

    setFormData(newFormData);
  };
  const handleReset = () => setFormData(lastData);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAlert(Helper.closeAlert());
    e.preventDefault();
    const response = await patchData("/api/admin/score/update", formData);
    setStatusResponse(response.status);
    // Check if response is an Axios response (has data property)
    if ("data" in response) {
      console.log(response.data);
      const result: StudentScore = Helper.formatScore(
        response.data.data,
        response.data.included
      ) as StudentScore;

      setAlert(Helper.successAlert());
      setLastData(result.scores);
      setFormData(result.scores);
    } else {
      // Handle error cases based on status
      switch (response.status) {
        case 500:
          setStatusResponse(500);
          break;
        default:
          setAlert(Helper.errorAlert());
          break;
      }
    }
  };
  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  if (loading) {
    return <Loading />;
  }

  if (statusResponse === 500) {
    return <ErrorServer />;
  }

  if (statusResponse >= 400 && statusResponse < 500) {
    return <NotFoundError data={"Nilai Ujian"} />;
  }

  return (
    <ContentContainer>
      <div className="relative flex flex-col space-y-4 w-full p-4">
        <div>
          <BackButton />
          <TitleInput>UPDATE NILAI UJIAN</TitleInput>
          <Alert
            isShow={!alert.isShow}
            alertStatus={alert.alertStatus}
            message={alert.message}
            onClose={handleAlertClose}
          />
          <div className="text-white underline absolute top-4 right-4 flex flex-row space-x-4">
            <button onClick={handleReset}>reset</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full h-full">
          <div className="flex flex-row w-full">
            <div className="w-1/2 p-4 space-y-1">
              <p className="text-white mb-2 ">DATA SANTRI</p>
              <Input
                label="Nomor Induk Santri"
                labelWidth="250px"
                type="number"
                name="nis"
                value={studentScores.nis}
                readOnly
              />
              <Input
                key={2}
                label="Nama Lengkap"
                labelWidth="250px"
                type="text"
                name="fullname"
                value={studentScores.fullname}
                readOnly
              />
              <Input
                key={3}
                label="Tingkat"
                labelWidth="250px"
                type="text"
                name="city_of_birth"
                value={studentScores.grade_class}
                readOnly
              />
              <Input
                key={4}
                label="Kelas"
                labelWidth="250px"
                type="text"
                name="birthdate"
                value={studentScores.class_name}
                readOnly
              />
              <Input
                key={5}
                label="Walikelas"
                labelWidth="250px"
                type="text"
                name="father_name"
                value={"Ust. " + studentScores.homeroom_teacher}
                readOnly
              />
              <Input
                key={6}
                label="Tahun Ajaran"
                labelWidth="250px"
                type="text"
                name="mother_name"
                value={studentScores.academic_year}
                readOnly
              />
              <Input
                key={7}
                label="Cawu"
                labelWidth="250px"
                type="text"
                name="guardian_name"
                value={studentScores.quarter_academic_year}
                readOnly
              />
              <Input
                key={8}
                label="Nilai KKM"
                required={true}
                labelWidth="250px"
                type="text"
                name="address"
                value="60"
                readOnly
              />
            </div>
            <div className="w-1/2 p-4 space-y-1">
              <p className="text-white mb-2">NILAI UJIAN</p>
              {formData.map((score, index) => (
                <Input
                  key={index}
                  label={Helper.capitalizeWords(score.subject)}
                  labelWidth="250px"
                  type="number"
                  name={score.id + "|" + score.subject}
                  value={score.score}
                  onChange={handleChange}
                  readOnly={false}
                />
              ))}
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

export default ScoreUpdate;
