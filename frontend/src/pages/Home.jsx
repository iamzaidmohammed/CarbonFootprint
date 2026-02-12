import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Leaf, ShieldCheck, Zap } from "lucide-react";
import StepCard from "../components/StepCard";
import LoadingScreen from "../components/LoadingScreen";
import axios from "axios";

const Home = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      // We call our Node.js backend
      const response = await axios.post("http://localhost:5000/api/audit", {
        url,
      });
      // Redirect to the results page with the ID from MongoDB
      navigate(`/results/${response.data._id}`);
    } catch (error) {
      console.error("Audit failed:", error);
      alert("Something went wrong. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-eco-dark min-h-screen font-sans">
      {loading && <LoadingScreen url={url} />}
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
        <div className="bg-eco-green/20 text-eco-accent px-4 py-1 rounded-full text-sm mb-6 border border-eco-green/30">
          Sustainable Web Development
        </div>
        <h1 className="text-5xl md:text-6xl text-gray-400 font-bold mb-6 max-w-4xl">
          Measure your website's{" "}
          <span className="text-eco-accent">carbon footprint</span>
        </h1>
        <p className="text-gray-400 mb-10 max-w-2xl text-lg">
          Understand your digital environmental impact and get actionable tips
          to make your website faster and greener.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-2xl group"
        >
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full bg-white/5 border text-gray-400 border-white/10 rounded-2xl py-5 px-6 pl-14 focus:outline-none focus:border-eco-accent/50 transition-all text-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-eco-accent transition-colors" />
          <button
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-eco-green hover:bg-eco-green/80 text-white px-8 py-3 rounded-xl transition-colors font-semibold cursor-pointer"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </section>

      {/* "How it Works" Section */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl text-gray-300 font-bold text-center mb-16">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepCard
            icon={<Search className="w-8 h-8 text-eco-accent" />}
            title="Enter URL"
            desc="Paste your website link and our engine will perform a live scan of all assets."
          />
          <StepCard
            icon={<Zap className="w-8 h-8 text-eco-accent" />}
            title="Calculate Impact"
            desc="We use the SWD model to calculate energy usage based on page weight and server location."
          />
          <StepCard
            icon={<Leaf className="w-8 h-8 text-eco-accent" />}
            title="Get Insights"
            desc="Receive a full report with an eco-grade and prioritized steps to reduce CO2."
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
