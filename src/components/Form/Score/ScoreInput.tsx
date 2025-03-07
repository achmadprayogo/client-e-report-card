import ContentContainer from "../../ContentContainer";
import BackButton from "../BackButton";
import TitleInput from "../TitleInput";
import Alert from "../../Alert/Alert";
import ToolbarContainer from "../../Toolbar/ToolbarContainer";
import ToolbarItem from "../../Toolbar/ToolbarItem";

import OptionsInput from "../OptionsInput";
import Input from "../Input";
import Loading from "../../Loading/Loading";
import ErrorServer from "../../ErrorServer/ErrorServer";
import NotFoundError from "../../NotFoundError/NotFoundError";
import { useState, useEffect } from "react";
import {
  AlertConfig,
  AlertStatus,
  Score,
  StudentScore,
} from "../../../../index";
import { getData, patchData } from "../../../../fetcher";
import Helper from "../../../../Helper";
import {
  initialStudentScore,
  initialScore,
  initialAlert,
} from "../../../../initialStates";

function ScoreInput() {
  const [alert, setAlert] = useState<AlertConfig>(initialAlert);

  const handleAlertClose = () => {
    setAlert(Helper.closeAlert());
  };
  const handleReset = () => {};
  const handleSubmit = () => {};
  return (
    <ContentContainer>
      <div className="relative flex flex-col space-y-4 w-full p-4">
        <div className=" flex flex-row">
          <BackButton />
          <div className="flex flex-row items-center justify-center flex-auto">
            <TitleInput>INPUT NILAI UJIAN</TitleInput>
          </div>
          <Alert
            isShow={!alert.isShow}
            alertStatus={alert.alertStatus}
            message={alert.message}
            onClose={handleAlertClose}
          />
          <div className="flex flex-row space-x-4  ms-auto">
            <ToolbarItem icon="stacks">
              <div>
                <select
                  onChange={(e) => {}}
                  name="grade_class_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <option value="all">tingkat</option>
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="stacks">
              <div>
                <select
                  onChange={(e) => {}}
                  name="grade_class_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <option value="all">kelas</option>
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="person">Ust. Joko</ToolbarItem>
            <ToolbarItem icon="stacks">
              <div>
                <select
                  onChange={(e) => {}}
                  name="grade_class_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <option value="all">cawu</option>
                </select>
              </div>
            </ToolbarItem>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
}

export default ScoreInput;
