import { X, Calculator, Zap, Globe } from "lucide-react";

const MethodologyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-eco-dark border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calculator className="text-eco-accent" /> Calculation Methodology
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <section>
            <h3 className="text-eco-accent font-bold mb-2 flex items-center gap-2">
              <Zap size={18} /> The SWD v2.1 Model
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We calculate carbon footprint using the Sustainable Web Design
              (SWD) model. The energy consumption is estimated by multiplying
              the total data transferred (GB) by the energy intensity of the
              internet (0.81 kWh/GB).
            </p>
            <div className="mt-4 bg-white/5 p-4 rounded-xl font-mono text-xs text-center border border-white/5">
              Energy (kWh) = Data (GB) × 0.81
            </div>
          </section>

          <section>
            <h3 className="text-eco-accent font-bold mb-2 flex items-center gap-2">
              <Globe size={18} /> CO2e Conversion
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              To convert energy into carbon emissions, we apply a global average
              grid intensity coefficient of 442g per kWh.
            </p>
          </section>

          <section className="bg-eco-green/10 p-4 rounded-2xl border border-eco-green/20">
            <h3 className="text-white font-bold mb-1 italic text-sm">
              The "Green Hosting" Factor
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              If the website is hosted on a verified green server (checked via
              the GWF API), the energy portion attributed to data centers is
              reduced by 10% in the calculation.
            </p>
          </section>
        </div>

        <div className="p-6 bg-white/5 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            Academic Reference: Sustainable Web Design (2024)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MethodologyModal;
