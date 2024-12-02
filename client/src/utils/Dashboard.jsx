/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile'); // redirection vers le profil
    };

    const handleNotificationsClick = () => {
        navigate('/notifications'); // redirection vers les notifications
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="menu-icon">☰ Menu</div>
                <div className="icons">
                    <span onClick={handleNotificationsClick} className="icon notification-icon">🔔</span>
                    <span onClick={handleProfileClick} className="icon profile-icon">👤</span>
                </div>
            </header>
            <nav className="dashboard-menu">
                <ul>
                    <li>Home</li>
                    <li>My Account</li>
                    <li>Settings</li>
                    <li>Logout</li>
                </ul>
            </nav>
            <main>
                <h1>Welcome to your Dashboard</h1>
                {/* Ajoutez ici le contenu principal de la page */}
            </main>
        </div>
    );
};

export default Dashboard;
