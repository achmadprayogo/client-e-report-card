import { StudentStatus } from '../../../index';

interface StudentStatusBadgeProps {
  className?: string;
  text: StudentStatus | undefined;
}

function StudentStatusBadge({ className, text }: StudentStatusBadgeProps) {
  const statusFormat = {
    active: {
      id: 'active',
      name: 'Aktif',
      baground: 'bg-green-800',
      icon: 'check_circle',
    },
    dropout: {
      id: 'dropout',
      name: 'Boyong',
      baground: 'bg-red-800',
      icon: 'do_not_disturb_on',
    },
    graduate: {
      id: 'graduate',
      name: 'Lulus',
      baground: 'bg-blue-800',
      icon: 'school',
    },
    invalid: {
      id: 'invalid',
      name: 'Invalid Status',
      baground: 'bg-yellow-800',
      icon: 'warning',
    },
  };

  const status = statusFormat[text as keyof typeof statusFormat] || statusFormat.invalid;

  return (
    <div
      className={`flex flex-row items-center justify-center h-7 w-fit py-3 px-4 rounded-xl ${className} ${status.baground}`}
    >
      <span className={`material-symbols-outlined me-2  `}>{status.icon}</span>
      <p>{status.name}</p>
    </div>
  );
}

export default StudentStatusBadge;
