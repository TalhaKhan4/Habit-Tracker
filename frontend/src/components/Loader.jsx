const Loader = ({
  width = "w-7",
  height = "h-7",
  border = "border-4",
  borderBgColor = "border-white",
}) => {
  return (
    <div
      className={`${width} ${height} ${border} ${borderBgColor} border-t-blue-500 rounded-full animate-spin mx-auto`}
    ></div>
  );
};

export default Loader;
