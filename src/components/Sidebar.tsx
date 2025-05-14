import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, ChartBarIcon, UsersIcon, FolderIcon, 
  CreditCardIcon, ChartPieIcon, BellIcon, CogIcon,
  DocumentTextIcon, QuestionMarkCircleIcon, InformationCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/userContext';

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  subItems?: { name: string; path: string; icon?: React.ElementType }[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    path: '/dashboard'
  },
  {
    name: 'Users & Roles',
    icon: UsersIcon,
    path: '/users'
  },
  {
    name: 'Campaigns',
    icon: FolderIcon,
    path: '/campaigns'
  },
  {
    name: 'Donations',
    icon: CreditCardIcon,
    path: '/donations'
  },
  {
    name: 'Reports & Analytics',
    icon: ChartPieIcon,
    path: '/reports'
  },
  {
    name: 'Email Notifications',
    icon: BellIcon,
    path: '/notifications'
  },
  {
    name: 'Settings',
    icon: CogIcon,
    path: '/settings'
  },
  {
    name: 'Withdraw',
    icon: CurrencyDollarIcon,
    path: '/requests'
  },
  {
    name: 'Support',
    icon: DocumentTextIcon,
    path: '/Support'
  },
  {
    name: 'Blogs',
    icon: DocumentTextIcon,
    path: '/blogs'
  },
  {
    name: 'Help Guide',
    icon: DocumentTextIcon,
    path: '/guide',
  },
  {
    name: 'Core Content',
    icon: DocumentTextIcon,
    path: '#', 
    subItems: [
      { 
        name: 'FAQs Section', 
        path: '/content/faqs',
        icon: QuestionMarkCircleIcon 
      },
      { 
        name: 'About Section', 
        path: '/content/about',
        icon: InformationCircleIcon 
      },
      { 
        name: 'Choose Us Section', 
        path: '/content/choose-us',
        icon: CurrencyDollarIcon 
      },
      { 
        name: 'Features Section', 
        path: '/content/features',
        icon: HomeIcon 
      },
      { 
        name: 'Testimonials Section', 
        path: '/content/testimonial',
        icon: DocumentTextIcon 
      },
      {
        name: 'Fees & Payouts Section',
        path: '/content/payouts',
        icon: CurrencyDollarIcon
      },
      {
        name: 'Social Media Links',
        path: '/content/social',
        icon: DocumentTextIcon
      }
    ]
  }
];

const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout?.();
    navigate('/');
  };

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.subItems) {
      e.preventDefault();
      toggleExpand(item.name);
    }
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {menuItems.map((item) => (
            <li key={item.name} className="mb-1">
              <Link
                to={item.path}
                onClick={(e) => handleItemClick(item, e)}
                className={`w-full px-4 py-2 flex items-center hover:bg-gray-800 transition-colors duration-200 ${
                  isActive(item.path) ? 'bg-gray-800' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
                {/* {item.subItems && (
                  <span className="ml-auto transform transition-transform duration-200">
                    {expandedItems[item.name] ? '▼' : '▶'}
                  </span>
                )} */}
              </Link>
              
              {item.subItems && expandedItems[item.name] && (
                <ul className="bg-gray-800 py-2">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                          isActive(subItem.path) ? 'bg-gray-700 text-white' : ''
                        } flex items-center`}
                      >
                        {subItem.icon && <subItem.icon className="h-4 w-4 mr-3" />}
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
        <button 
          onClick={handleLogout} 
          className="text-sm font-medium text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;