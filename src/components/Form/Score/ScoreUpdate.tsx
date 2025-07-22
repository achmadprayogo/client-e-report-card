import Alert from '../../Alert/Alert';
import Input from '../Input';
import { useState, useEffect, ChangeEvent } from 'react';
import DeleteButton from '../../Button/DeleteButton';
import ResetButton from '../../Button/ResetButton';
import PopUpContainer from '../../PopUpContainer';
import { AlertConfig, Response, Score, StudentScore } from '../../../../index';
import { patchData } from '../../../../fetcher';
import Helper from '../../../../Helper';
import { initialStudentScore, initialScore, initialAlert } from '../../../../initialStates';

interface UpdatescoreProps {
  selectedData: StudentScore;
  isOpen: boolean;
  setIsOpen: () => void;
}

function ScoreUpdate({ selectedData, isOpen, setIsOpen }: UpdatescoreProps) {
  const [studentScores, setStudentScores] = useState<StudentScore>(initialStudentScore);
  const [newData, setNewData] = useState<StudentScore>(initialStudentScore);
  const [lastData, setLastData] = useState<StudentScore>(initialStudentScore);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);

  useEffect(() => {
    setStudentScores(selectedData);
    setNewData(selectedData);
    setLastData(selectedData);
  }, [selectedData]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastData) !== JSON.stringify(newData);
    setIsUpdate(isChanged);
  }, [newData, lastData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [id, subject] = name.split('|');
    const updatedScores: Score[] = newData.scores.map((score) => {
      if (score.id === id && score.subject === subject) {
        return { ...score, score: Number(value) };
      }
      return score;
    });
    setNewData({ ...newData, scores: updatedScores });
    setStudentScores({ ...studentScores, scores: updatedScores });
  };
  const handleReset = () => setNewData(lastData);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAlert(Helper.closeAlert());
    e.preventDefault();
    const response = await patchData('/api/admin/score/update', newData);
    // Check if response is an Axios response (has data property)
    if ('data' in response) {
      console.log(response.data);
      const result: StudentScore = Helper.formatScore(
        response.data.data,
        response.data.included,
      ) as StudentScore;

      setAlert(Helper.successAlert());
    } else {
      // Handle error cases based on status
      switch (response.status) {
        case 500:
          setAlert(Helper.errorAlert('Gagal mengupdate data'));
          break;
        default:
          setAlert(Helper.errorAlert());
          break;
      }
    }
  };
  const handleDelete = async () => {};
  const handleClose = () => {
    setIsOpen();
  };
  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  return (
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose} title="Update Nilai Ujian">
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
              value={studentScores.homeroom_teacher}
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
            {selectedData.scores.map((score, index) => (
              <Input
                key={index + 8}
                label={Helper.capitalizeWords(score.subject)}
                labelWidth="250px"
                type="number"
                name={score.id + '|' + score.subject}
                value={score.score}
                onChange={handleChange}
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
      <div className="absolute bottom-5 right-4 ">
        <DeleteButton onClick={handleDelete} />
      </div>
    </PopUpContainer>
  );
}

export default ScoreUpdate;
