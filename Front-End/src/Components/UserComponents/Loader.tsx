
const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 rounded-full border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
        <div className="absolute inset-0 w-8 h-8 m-auto bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
