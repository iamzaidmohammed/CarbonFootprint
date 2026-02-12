import { Leaf } from "lucide-react";

const LoadingScreen = ({ url }) => {
  return (
    <div className="fixed inset-0 bg-eco-dark/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Animated outer ring */}
        <div className="w-24 h-24 border-4 border-eco-green/20 border-t-eco-accent rounded-full animate-spin"></div>
        {/* Pulsing leaf icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="w-10 h-10 text-eco-accent animate-pulse" />
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-white">Analyzing Site...</h2>
      <p className="mt-2 text-gray-400 text-center max-w-xs">
        Connecting to <span className="text-eco-accent">{url}</span> to
        calculate its environmental impact.
      </p>

      <div className="mt-10 flex gap-2">
        <div className="w-2 h-2 bg-eco-green rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-eco-green rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-eco-green rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
