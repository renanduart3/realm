import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell,
    Sun,
    Moon,
    User,
    LogOut,
    CreditCard,
    Settings as SettingsIcon,
    ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../assets/img/logo.png';

export default function Navbar() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
            <div className="h-full px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="h-10 w-auto object-contain"
                        />
                        <span className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:inline">
                            {/* Nome da organização aqui se necessário */}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notificações */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                        Notificações
                                    </h3>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Nenhuma notificação no momento
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Toggle Tema */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>

                    {/* Menu Usuário */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user?.username}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate('/profile');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Perfil
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate('/subscription');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <CreditCard size={16} />
                                        Subscription
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate('/settings');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                    >
                                        <SettingsIcon className="w-4 h-4 mr-2" />
                                        Configurações
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 