import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import TitleInput from "../TitleInput";
import Input from "../Input";
import CloseButton from "../../Button/CloseButton";
import { AlertConfig, TeacherNote } from "../../../../index";
import { initialAlert, initialTeacherNote } from "../../../../initialStates";
import { patchData } from "../../../../fetcher";
import { AxiosResponse } from "axios";
import Alert from "../../Alert/Alert";
import Helper from "../../../../Helper";
import PopUpContainer from "../../../components/PopUpContainer";
import ResetButton from "../../Button/ResetButton";

interface UpdateTeacherNote {
  selectedNode: TeacherNote;
  isOpen: boolean;
  setIsOpen: () => void;
}

function UpdateTeacherNote({
  selectedNode,
  isOpen,
  setIsOpen,
}: UpdateTeacherNote) {
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [lastNote, setLastNote] = useState<TeacherNote>(initialTeacherNote);
  const [newNote, setNewNote] = useState<TeacherNote>(initialTeacherNote);
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);
  const [isPageRefresh, setIsPageRefresh] = useState<boolean>(false);
  const rootElement = document.getElementById("root") as HTMLElement;

  useEffect(() => {
    setNewNote(selectedNode);
    setLastNote(selectedNode);
    if (isOpen) {
      rootElement.classList.add("blur-md");
    }
    return () => {
      rootElement.classList.remove("blur-md");
    };
  }, [isOpen]);

  useEffect(() => {
    const isChanged = JSON.stringify(lastNote) !== JSON.stringify(newNote);
    setIsUpdate(isChanged);
  }, [lastNote, newNote]);

  const handleReset = () => {
    setNewNote(lastNote);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await patchData(
      "/api/admin/teacher-notes/update",
      newNote
    );
    switch (response.status) {
      case 200:
        setAlert(Helper.successAlert());
        setIsPageRefresh(true);
        break;
      default:
        setAlert(Helper.errorAlert());
        break;
    }
    const updatedNote = (response as AxiosResponse).data.data.notes;
    setNewNote({ ...newNote, note: updatedNote });
    setLastNote({ ...newNote, note: updatedNote });
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote({ ...newNote, note: e.target.value });
  };
  const handleClose = () => {
    setIsOpen();
  };
  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <PopUpContainer isOpen={isOpen} setIsOpen={handleClose}>
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
              value={newNote.nis}
              readOnly
            />
            <Input
              key={2}
              label="Nama Lengkap"
              labelWidth="250px"
              type="text"
              name="fullname"
              value={newNote.fullname}
              readOnly
            />
            <Input
              key={3}
              label="Tingkat"
              labelWidth="250px"
              type="text"
              name="grade_class"
              value={newNote.grade_class}
              readOnly
            />
            <Input
              key={4}
              label="Kelas"
              labelWidth="250px"
              type="text"
              name="class_name"
              value={newNote.class_name}
              readOnly
            />
            <Input
              key={5}
              label="Walikelas"
              labelWidth="250px"
              type="text"
              name="homeroom_teacher"
              value={newNote.homeroom_teacher}
              readOnly
            />
            <Input
              key={6}
              label="Tahun Ajaran"
              labelWidth="250px"
              type="text"
              name="academic-year"
              value={newNote.academic_year}
              readOnly
            />
            <Input
              key={7}
              label="Cawu"
              labelWidth="250px"
              type="text"
              name="quarter_academic_year"
              value={newNote.quarter_academic_year}
              readOnly
            />
          </div>
          <div className="w-1/2 p-4 space-y-1">
            <p className="text-white mb-2">CATATAN</p>
            <textarea
              name="note"
              onChange={handleChange}
              value={newNote.note}
              className="bg-transparent w-full h-[calc(100%-8px-24px)] resize-none bottom-0 border rounded-md font-mono text-lg text-white focus:outline-0 p-2"
            ></textarea>
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

export default UpdateTeacherNote;
