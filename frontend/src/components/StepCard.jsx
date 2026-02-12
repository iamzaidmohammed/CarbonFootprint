const StepCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all text-center flex flex-col items-center">
    <div className="bg-eco-green/10 p-4 rounded-2xl mb-6">{icon}</div>
    <h3 className="text-xl text-gray-300 font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default StepCard;
