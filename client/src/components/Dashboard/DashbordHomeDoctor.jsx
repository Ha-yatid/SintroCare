import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaBell, FaCalendar, FaFileAlt, FaHome, FaSignOutAlt, FaPills, FaCog, FaUser } from 'react-icons/fa';

const DashbordHomeDoctor= () => {
  const userDoctor = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    localStorage.removeItem("role"); 

    sessionStorage.clear(); 
    console.log('testing logout ')

    // Rediriger vers la page de connexion
    navigate("/");
  };

  const menuItems = [
    { icon: FaHome, label: "Home", path: "/doctor-dashboard/homeDoctor" , active : true},
    { icon: FaFileAlt, label: "Analyses", path: "/doctor-dashboard/analyseDoctor"},
    { icon: FaUser, label: "Profile", path: "/doctor-dashboard/profile" },
    { icon: FaPills, label: "Medications", path: "/doctor-dashboard/medicationsDoctor" },
    { icon: FaUser, label: "ListPatient", path: "/doctor-dashboard/listPatient" },
    { icon: FaCalendar, label: "Appointments", path: "/doctor-dashboard/appointments" },
    { icon: FaCog, label: "Settings", path: "/doctor-dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu latéral */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Doctor Dashboard</h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-gray-700 ${
                  isActive ? "bg-gray-200 font-bold" : "hover:bg-gray-200"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome, {userDoctor?.userData?.FullName || "Patient"}
          </h1>
          <div className="flex items-center">
            <button className="p-2 text-gray-500 hover:text-gray-700 mr-2">
                <FaBell className="h-5 w-5" />
            </button>
            <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700">
                <FaSignOutAlt className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page spécifique */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashbordHomeDoctor;