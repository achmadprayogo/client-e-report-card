import ReactDOM from "react-dom";
import CloseButton from "./Button/CloseButton";
import TitleInput from "./Form/TitleInput";
import { useEffect } from "react";

interface PopUpContainer {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: () => void;
}

function PopUpContainer({ children, isOpen, setIsOpen }: PopUpContainer) {
  const rootElement = document.getElementById("root") as HTMLElement;
  useEffect(() => {
    if (isOpen) {
      rootElement.classList.add("blur-md");
    }
    return () => {
      rootElement.classList.remove("blur-md");
    };
  }, [isOpen]);
  const handleClose = () => setIsOpen();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-transparent z-30"></div>
      <div className="bg-[#454545] absolute pointer-events-auto inset-0 m-auto w-fit h-fit z-30 shadow-lg rounded-lg p-4 space-y-4">
        <div>
          <div className="absolute top-4 right-4">
            <CloseButton onClick={handleClose} />
          </div>
          <TitleInput>UPDATE CATATAN</TitleInput>
        </div>
        <hr className="w-full border-[#888888] " />
        {children}
      </div>
    </>,
    document.body
  );
}

export default PopUpContainer;
