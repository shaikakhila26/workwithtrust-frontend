// src/components/Navbar.jsx
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
      <h1 className="text-xl font-bold text-emerald-600">WorkWithTrust</h1>
      <input
        type="text"
        placeholder="Search for gigs..."
        className="border rounded px-4 py-1 w-1/3 focus:outline-none focus:ring focus:ring-emerald-300"
      />
      <div className="flex items-center space-x-4">
        <span className="cursor-pointer">🔔</span>
        <span className="cursor-pointer">✉️</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </nav>
  );
};

export default Navbar;
