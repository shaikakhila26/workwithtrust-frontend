// src/components/StatCard.jsx
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center flex-1">
      <div className="text-2xl mb-2">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <p className="text-xl font-bold text-emerald-600">{value}</p>
    </div>
  );
};

export default StatCard;
