import { Option } from '../../index';
import Helper from '../../Helper';
import { useNavigate } from 'react-router';
import OptionsInput from './Form/OptionsInput';
import { useState } from 'react';

export default function AcademicYearLabel({ options }: { options: Option[] }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const pathNames = location.pathname.split('/');

  // If on the score page, select the last academic year and disable the option for first option
  if (location.pathname.includes('score')) {
    options = Helper.setIndexOptionSelected(options, 1, true);
    options = Helper.setIndexOptionDisabled(options, 0, true);
  }

  // const hiddenOnPages = ['8'];
  // const isHiddenOnPage = hiddenOnPages.some((path) => location.pathname.includes(path));
  // if (isHiddenOnPage) setIsVisible(false);

  const handleChange = (e: any) => {
    const link = `/${pathNames[1]}/${e.target.value}`;
    navigate(link);
  };

  if (!isVisible) return null;

  return (
    <div
      className={` flex-row items-center ms-auto me-4 text-white text-4xl space-x-1 ${
        isVisible ? 'flex' : 'hidden'
      }`}
    >
      <p className="text-white">Ta.</p>
      <select className="bg-transparent text-white p-2 focus:outline-none " onChange={handleChange}>
        <OptionsInput options={options} />
      </select>
    </div>
  );
}
