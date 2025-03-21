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
          className={`h-12 flex flex-row justify-center items-center rounded-xl p-2 my-1 group-hover:justify-start transition-all duration-300 ${
            !isActive && "hover:bg-yellow-900"
          }`}
        >
          <span className="material-symbols-outlined text-2xl hover:bg-gray-700">
            logout
          </span>
          <span className="text-base w-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:w-auto group-hover:ms-2 transition-all duration-300 delay-200">
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
        className={`flex flex-row justify-center ${
          isActive && "bg-lime-700 "
        } items-center rounded-xl p-2 my-1 group-hover:justify-start transition-all duration-300 ${
          !isActive && "hover:bg-lime-950"
        } `}
      >
        <span className="material-symbols-outlined text-2xl hover:text-lime-600">
          {icon}
        </span>
        <span className="text-base text-nowrap w-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:w-auto group-hover:ms-4 transition-all duration-300 delay-200">
          {name}
        </span>
      </a>
    </li>
  );
}

export default NavItem;
