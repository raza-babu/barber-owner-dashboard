const typeStyles = {
  BOOKING: {
    wrapper: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  QUEUE: {
    wrapper: "border-orange-200 bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
};

const TypeBadge = ({ type, onClick }) => {
  const style = typeStyles[type];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide ${style.wrapper} cursor-pointer`}
    >
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {type}
    </span>
  );
};

export default TypeBadge;
