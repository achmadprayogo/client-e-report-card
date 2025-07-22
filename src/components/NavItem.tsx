interface NavItemProps {
  endPoint: string;
  icon: string;
  name: string;
  isActive: boolean;
}

function NavItem({ endPoint, icon, name, isActive }: NavItemProps) {
  const handleClick = () => {
    window.location.href = endPoint;
  };
  if (name === "Logout") {
    return (
      <li className="p-2 text-white mt-auto">
        <a
          onClick={handleClick}
          className={`flex flex-row justify-start items-center rounded-xl w-12 h-12 group-hover:w-full group-hover:justify-start transition-all duration-300 hover:cursor-pointer ${
            !isActive && "hover:bg-yellow-900"
          }`}
        >
          <div className="flex flex-row justify-center items-center w-12 h-12">
            <span className="material-symbols-outlined text-2xl hover:bg-gray-700">
              logout
            </span>
          </div>
          <span className="absolute left-12 text-base w-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:w-auto group-hover:ms-2 transition-all duration-300 delay-200">
            {name}
          </span>
        </a>
      </li>
    );
  }
  return (
    <li className={` text-white  px-2`}>
      <a
        onClick={handleClick}
        className={`flex flex-row justify-start items-center rounded-xl w-12 h-12  group-hover:w-full my-1 group-hover:justify-start transition-all duration-300 hover:cursor-pointer  ${
          isActive ? "bg-lime-600 " : "hover:bg-lime-900"
        }`}
      >
        <div className="flex flex-row justify-center items-center w-12 h-12">
          <span className={`material-symbols-outlined text-2xl  `}>{icon}</span>
        </div>
        <span className="absolute left-12 text-base text-nowrap w-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:w-auto group-hover:ms-4 transition-all duration-300 delay-200">
          {name}
        </span>
      </a>
    </li>
  );
}

export default NavItem;
