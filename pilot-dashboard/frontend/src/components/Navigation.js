import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleManagement = () => {
    setIsManagementOpen(!isManagementOpen);
  };

  return (
    <nav className="navigation">
      <Link to="/" className="logo">
        NEXTSTEP
      </Link>
      <ul className="nav-menu">
        <li>
          <Link to="/nextstep" className={isActive('/nextstep')}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/onlyoneapi" className={isActive('/onlyoneapi')}>
            OnlyOneAPI
          </Link>
        </li>
        <li>
          <Link to="/kvibe-dashboard" className={isActive('/kvibe-dashboard')}>
            Kvibe Dashboard
          </Link>
        </li>
        <li>
          <Link to="/onlyoneapi360" className={isActive('/onlyoneapi360')}>
            ONLYONEAPI360
          </Link>
        </li>
        <li>
          <Link to="/battle-room" className={isActive('/battle-room')}>
            Battle Room
          </Link>
        </li>
        <li>
          <Link to="/roadmap" className={isActive('/roadmap')}>
            Roadmap
          </Link>
        </li>
        <li>
          <Link to="/mindset" className={isActive('/mindset')}>
            Mindset
          </Link>
        </li>
        <li>
          <Link to="/metrics" className={isActive('/metrics')}>
            Metrics
          </Link>
        </li>
        <li>
          <Link to="/media-timing" className={isActive('/media-timing')}>
            📊 Media Timing
          </Link>
        </li>
        <li className="dropdown">
          <button 
            className={`dropdown-toggle ${
              ['/agents', '/bots-coordination', '/validation', '/api-config', '/system', '/help'].some(path => 
                location.pathname === path
              ) ? 'active' : ''
            }`}
            onClick={toggleManagement}
          >
            Management
            <span className={`arrow ${isManagementOpen ? 'open' : ''}`}>▼</span>
          </button>
          {isManagementOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/agents" className={isActive('/agents')} onClick={() => setIsManagementOpen(false)}>
                  Bot Control
                </Link>
              </li>
              <li>
                <Link to="/bots-coordination" className={isActive('/bots-coordination')} onClick={() => setIsManagementOpen(false)}>
                  Squad Coordination
                </Link>
              </li>
              <li>
                <Link to="/validation" className={isActive('/validation')} onClick={() => setIsManagementOpen(false)}>
                  Quality Gate
                </Link>
              </li>
              <li>
                <Link to="/api-config" className={isActive('/api-config')} onClick={() => setIsManagementOpen(false)}>
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/system" className={isActive('/system')} onClick={() => setIsManagementOpen(false)}>
                  Tech Monitor
                </Link>
              </li>
              <li>
                <Link to="/help" className={isActive('/help')} onClick={() => setIsManagementOpen(false)}>
                  Command Center
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;