import { useNavigate } from 'react-router';
import { Option } from '../../index';
import OptionsInput from './Form/OptionsInput';

function SettingOptions({ selectedOption }: { selectedOption: string }) {
  const navigate = useNavigate();

  let pageSettingOptions: Option[] = [
    { label: 'Pengaturan Tahun Ajaran', value: 'academic-year' },
    { label: 'Pengaturan Cawu', value: 'quarter-academic-year' },
    { label: 'Pengaturan Tingkat', value: 'grade-class' },
    { label: 'Pengaturan Kelas', value: 'class-name' },
    { label: 'Pengaturan Mata Pelajaran', value: 'subject' },
    { label: 'Pengaturan Naik Kelas', value: 'moving-class' },
    { label: 'Pengaturan Pengguna', value: 'users' },
  ];

  pageSettingOptions = pageSettingOptions.map((option) => {
    if (option.value === selectedOption) {
      option.selected = true;
    }
    return option;
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/setting/${e.target.value}`);
  };

  return (
    <div className="flex flex-row items-center text-white text-xl font-bold bg-[#40534C] px-4 py-2 rounded-md">
      <span className="material-symbols-outlined text-xl me-2">settings</span>
      <select
        onChange={handleChange}
        name="settings"
        className="text-white bg-transparent focus:outline-none"
      >
        <OptionsInput options={pageSettingOptions} />
      </select>
    </div>
  );
}

export default SettingOptions;
