interface BadgeProps {
  className: string;
  text: string;
}
function Badge({ className, text }: BadgeProps) {
  return (
    <div
      className={`flex flex-row items-center justify-center h-7 w-fit py-2 px-4 rounded-xl font-bold ${className}`}
    >
      <p>{text}</p>
    </div>
  );
}

export default Badge;
