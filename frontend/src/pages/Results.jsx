import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Leaf, AlertTriangle, ArrowLeft, Globe } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/history`);
        // For now, we fetch from history and find the ID.
        // In a real app, you'd have a specific GET /api/audit/:id route.
        const audit = response.data.find((a) => a._id === id);
        setData(audit);
      } catch (err) {
        console.error("Error fetching results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading)
    return <div className="text-center pt-20">Loading Report...</div>;
  if (!data) return <div className="text-center pt-20">Report not found.</div>;

  // Chart Data Preparation
  const chartData = {
    labels: ["Images", "Scripts", "CSS", "Other"],
    datasets: [
      {
        data: [
          data.dataTransfer.images,
          data.dataTransfer.scripts,
          data.dataTransfer.css,
          data.dataTransfer.other,
        ],
        backgroundColor: ["#2e7d32", "#81c784", "#a5d6a7", "#1b5e20"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-eco-dark min-h-screen p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="flex items-center text-eco-accent mb-8 hover:underline"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Search
        </Link>

        {/* Main Header Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-300 font-bold mb-2">
              {new URL(data.url).hostname}
            </h1>
            <p className="text-gray-400">
              Scan completed on {new Date(data.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div
            className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-4xl font-black 
            ${data.emissions.grade === "A" ? "border-eco-green text-eco-green" : "border-yellow-500 text-yellow-500"}`}
          >
            {data.emissions.grade}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Data Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl text-gray-300 font-bold mb-6">
                Resource Breakdown
              </h3>
              <div className="h-64 flex justify-center">
                <Pie
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl text-gray-300 font-bold mb-6">
                Priority Recommendations
              </h3>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-white/5 rounded-2xl border-l-4 border-eco-accent"
                  >
                    <AlertTriangle className="w-5 h-5 text-eco-accent mr-4 mt-1" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-eco-accent">
                        {rec.priority} Priority
                      </span>
                      <p className="font-bold text-white">{rec.message}</p>
                      <p className="text-gray-400 text-sm">{rec.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hosting & Stats */}
          <div className="space-y-8">
            <div className="bg-eco-green/10 border border-eco-green/20 rounded-3xl p-8 text-center">
              <Globe className="w-12 h-12 text-eco-accent mx-auto mb-4" />
              <h3 className="text-xl text-gray-300 font-bold mb-2">
                Hosting Status
              </h3>
              <p
                className={`text-2xl font-black mb-2 ${data.hosting.isGreen ? "text-eco-accent" : "text-red-400"}`}
              >
                {data.hosting.isGreen ? "GREEN" : "NON-GREEN"}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Provider: {data.hosting.provider}
              </p>
              <p className="text-xs italic text-gray-500 leading-relaxed bg-black/20 p-3 rounded-lg">
                {data.hosting.note}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-gray-400 text-sm mb-1 uppercase tracking-widest">
                Est. Emissions
              </h3>
              <p className="text-4xl text-gray-200 font-bold">
                {data.emissions.co2Grams.toFixed(3)}g
              </p>
              <p className="text-xs text-gray-500 mt-2">per page view (CO2e)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
