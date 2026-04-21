import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Globe, ArrowRight, Database } from "lucide-react";

const History = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/history");
        setAudits(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-eco-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-eco-accent"></div>
      </div>
    );

  return (
    <div className="bg-eco-dark min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Audit History</h1>
            <p className="text-gray-400">
              Comparing the carbon impact of previously scanned websites.
            </p>
          </div>
          <Link
            to="/"
            className="text-eco-accent border border-eco-accent/30 px-6 py-2 rounded-xl hover:bg-eco-accent/10 transition-all"
          >
            New Audit
          </Link>
        </div>

        {audits.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Database className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">
              No audits found in the database yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {audits.map((audit) => (
              <Link
                key={audit._id}
                to={`/results/${audit._id}`}
                className="group flex flex-col md:flex-row items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-eco-accent/40 transition-all"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  {/* Grade Badge */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black
                    ${audit.emissions.grade === "A" ? "bg-eco-green/20 text-eco-accent" : "bg-yellow-500/10 text-yellow-500"}`}
                  >
                    {audit.emissions.grade}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold group-hover:text-eco-accent transition-colors">
                      {new URL(audit.url).hostname}
                    </h3>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />{" "}
                        {new Date(audit.timestamp).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe size={14} /> {audit.hosting.provider}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10 mt-4 md:mt-0 w-full md:w-auto justify-between">
                  <div className="text-right">
                    <p className="text-xs uppercase text-gray-500 tracking-widest mb-1">
                      CO2 Emissions
                    </p>
                    <p className="text-xl font-mono font-bold text-eco-accent">
                      {audit.emissions.co2Grams.toFixed(3)}g
                    </p>
                  </div>
                  <ArrowRight className="text-gray-600 group-hover:translate-x-2 group-hover:text-white transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
