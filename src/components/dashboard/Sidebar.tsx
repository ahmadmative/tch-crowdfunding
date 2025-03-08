import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HomeIcon, SparklesIcon, SpeakerWaveIcon, CurrencyDollarIcon, UsersIcon, FolderIcon,
    CreditCardIcon, ChartPieIcon, BellIcon, CogIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/userContext';



interface MenuItem {
    name: string;
    icon: React.ElementType;
    path: string;
    subItems?: { name: string; path: string; }[];
}

const menuItems: MenuItem[] = [
    {
        name: 'Overview',
        icon: HomeIcon,
        path: '/user/dashboard',
    },
    {
        name: 'Campaigns',
        icon: SpeakerWaveIcon,
        path: '/user/dashboard/campaigns',
    },
    {
        name: 'Donations',
        icon: CurrencyDollarIcon,
        path: '/user/dashboard/donations',
    },
    {
        name: 'Profile',
        icon: UsersIcon,
        path: '/user/dashboard/profile',
    }
];

const Sidebar: React.FC = () => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const location = useLocation();
    const { logout } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const toggleExpand = (itemName: string) => {
        setExpandedItem(expandedItem === itemName ? null : itemName);
    };

    //   const isActive = (path: string) => {
    //     return location.pathname === path || location.pathname.startsWith(path + '/');
    //   };

    const isActive = (path: string) => {
        return location.pathname === path; // Strict match only
    };


    const handleLogout = () => {
        logout?.();
        navigate('/signin');
    };

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
            <div className="flex justify-center items-center p-4">
                <img src={"/logo.png"} alt="logo" className="w-30 h-10" />
            </div>

            <nav className="flex-1 flex flex-col items-center w-full overflow-y-auto">
                <ul className="py-4 w-full flex flex-col items-center">
                    {menuItems.map((item) => (
                        <li key={item.name} className="mb-1  w-full flex justify-center items-center">
                            <Link
                                to={item.path}
                                onClick={(e) => {
                                    // e.preventDefault();
                                    toggleExpand(item.name);
                                }}
                                className={`w-full px-6 py-4 flex items-center hover:bg-gray-800 transition-colors duration-200 ${isActive(item.path) ? 'bg-gray-800 border-l-4 border-l-4 border-[#BEE36E]' : ''
                                    }`}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                <span>{item.name}</span>
                            </Link>

                            {expandedItem === item.name && item.subItems && (
                                <ul className="bg-gray-800 py-2">
                                    {item.subItems.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link
                                                to={subItem.path}
                                                className={`block px-12 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${isActive(subItem.path) ? 'bg-gray-700 text-white' : ''
                                                    }`}
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 mr-3"></div>
                    <div>
                        {/* <p className="text-sm font-medium">Admin User</p> */}
                        {/* <p className="text-xs text-gray-400">admin@example.com</p> */}
                        <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-500">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 