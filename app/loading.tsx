import { Loader } from "lucide-react";

const Loading = async () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <Loader size={48} className="text-gray-500 animate-spin" />
    </div>
  );
};

export default Loading;
