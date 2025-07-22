import { useNavigate } from "react-router";

function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="text-white absolute top-4 left-4 "
    >
      <span className="material-symbols-outlined">arrow_back</span>
    </button>
  );
}

export default BackButton;
