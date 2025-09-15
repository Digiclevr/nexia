import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Mic, MicOff, Activity, Zap, RotateCcw, Target, Settings } from 'lucide-react';

interface TouchBarControllerProps {
  isVoiceActive: boolean;
  onVoiceToggle: () => void;
  onViewChange: (view: 'voice' | 'dashboard' | 'settings') => void;
}

interface ProjectStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'inactive';
  endpoint?: string;
  lastCheck?: Date;
}

const TouchBarController: React.FC<TouchBarControllerProps> = ({
  isVoiceActive,
  onVoiceToggle,
  onViewChange
}) => {
  const [currentProject, setCurrentProject] = useState<string>('NEXIA');
  const [projectsStatus, setProjectsStatus] = useState<ProjectStatus[]>([
    { name: 'KREACH', status: 'healthy', endpoint: 'http://localhost:5003' },
    { name: 'OnlyOneAPI', status: 'healthy', endpoint: 'http://localhost:9090' },
    { name: 'NEXTGEN', status: 'warning', endpoint: 'http://localhost:7000' },
    { name: 'KVIBE', status: 'inactive', endpoint: 'http://localhost:5002' }
  ]);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Simulate Touch Bar interface with visual representation
  const TouchBarButton = ({ 
    icon: Icon, 
    label, 
    active = false, 
    status = 'normal',
    onClick, 
    disabled = false 
  }: {
    icon: any;
    label: string;
    active?: boolean;
    status?: 'normal' | 'success' | 'warning' | 'error';
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] h-[50px]
        ${active ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/70'}
        ${status === 'success' ? 'border-2 border-green-500/50' : ''}
        ${status === 'warning' ? 'border-2 border-yellow-500/50' : ''}
        ${status === 'error' ? 'border-2 border-red-500/50' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon className={`w-4 h-4 mb-1 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-slate-400'}`}>
        {label}
      </span>
      
      {/* Status indicator */}
      {status !== 'normal' && (
        <div className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full
          ${status === 'success' ? 'bg-green-500' : ''}
          ${status === 'warning' ? 'bg-yellow-500' : ''}
          ${status === 'error' ? 'bg-red-500 animate-pulse' : ''}
        `} />
      )}
    </button>
  );

  const ProjectSwitch = ({ project, isActive, onClick }: {
    project: ProjectStatus;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[55px] h-[45px]
        ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-700/30 text-slate-400 hover:bg-slate-600/50'}
      `}
    >
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1
        ${project.status === 'healthy' ? 'bg-green-500' : ''}
        ${project.status === 'warning' ? 'bg-yellow-500' : ''}
        ${project.status === 'error' ? 'bg-red-500' : ''}
        ${project.status === 'inactive' ? 'bg-slate-500' : ''}
      `}>
        {project.name[0]}
      </div>
      <span className="text-[9px]">{project.name.slice(0, 4)}</span>
    </button>
  );

  const handleProjectSwitch = (projectName: string) => {
    setCurrentProject(projectName);
    // Emit project change event for main app
    window.dispatchEvent(new CustomEvent('nexia-project-change', { 
      detail: { project: projectName } 
    }));
  };

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'sync':
          // Sync all services
          await invoke('query_onlyoneapi', { 
            endpoint: '/health', 
            data: '{}' 
          });
          break;
        case 'focus':
          setFocusMode(!focusMode);
          // Enable focus mode (hide distractions)
          window.dispatchEvent(new CustomEvent('nexia-focus-toggle', { 
            detail: { enabled: !focusMode } 
          }));
          break;
        case 'deploy':
          // Quick deploy current project
          window.dispatchEvent(new CustomEvent('nexia-quick-deploy', { 
            detail: { project: currentProject } 
          }));
          break;
      }
    } catch (error) {
      console.error('Quick action failed:', error);
    }
  };

  // Update project status periodically
  useEffect(() => {
    const checkProjectsHealth = async () => {
      const updatedStatus = await Promise.all(
        projectsStatus.map(async (project) => {
          try {
            if (project.endpoint) {
              // Simulate health check
              const isHealthy = Math.random() > 0.2; // 80% success rate
              return {
                ...project,
                status: isHealthy ? 'healthy' as const : 'warning' as const,
                lastCheck: new Date()
              };
            }
            return project;
          } catch {
            return { ...project, status: 'error' as const };
          }
        })
      );
      setProjectsStatus(updatedStatus);
    };

    const interval = setInterval(checkProjectsHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [projectsStatus]);

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 p-2">
      {/* Touch Bar Simulation */}
      <div className="flex items-center justify-center space-x-1 mb-2">
        <div className="text-xs text-slate-500 mr-2">Touch Bar:</div>
        <div className="flex items-center space-x-1 bg-black/50 rounded-lg p-1 backdrop-blur-sm">
          
          {/* Voice Control */}
          <TouchBarButton
            icon={isVoiceActive ? MicOff : Mic}
            label="VOICE"
            active={isVoiceActive}
            status={isVoiceActive ? 'success' : 'normal'}
            onClick={onVoiceToggle}
          />

          {/* Project Switcher */}
          {projectsStatus.map((project) => (
            <ProjectSwitch
              key={project.name}
              project={project}
              isActive={currentProject === project.name}
              onClick={() => handleProjectSwitch(project.name)}
            />
          ))}

          {/* Status Overview */}
          <TouchBarButton
            icon={Activity}
            label="STATUS"
            active={false}
            status="normal"
            onClick={() => onViewChange('dashboard')}
          />

          {/* Quick Actions */}
          <TouchBarButton
            icon={RotateCcw}
            label="SYNC"
            onClick={() => handleQuickAction('sync')}
          />

          <TouchBarButton
            icon={Target}
            label="FOCUS"
            active={focusMode}
            onClick={() => handleQuickAction('focus')}
          />

          <TouchBarButton
            icon={Zap}
            label="DEPLOY"
            onClick={() => handleQuickAction('deploy')}
          />

          <TouchBarButton
            icon={Settings}
            label="SETTINGS"
            onClick={() => onViewChange('settings')}
          />
        </div>
      </div>

      {/* Current Context Display */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-slate-300">
            📍 {currentProject}
          </span>
          <span className={`
            px-2 py-1 rounded-full text-[10px]
            ${focusMode ? 'bg-purple-600/20 text-purple-300' : 'bg-slate-600/20 text-slate-400'}
          `}>
            {focusMode ? '🎯 Focus Mode' : '🌊 Normal Mode'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {projectsStatus.map((project) => (
            <div key={project.name} className="flex items-center space-x-1">
              <div className={`
                w-2 h-2 rounded-full
                ${project.status === 'healthy' ? 'bg-green-400' : ''}
                ${project.status === 'warning' ? 'bg-yellow-400' : ''}
                ${project.status === 'error' ? 'bg-red-400 animate-pulse' : ''}
                ${project.status === 'inactive' ? 'bg-slate-500' : ''}
              `} />
              <span className="text-[10px]">{project.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Context Switch */}
      {currentProject !== 'NEXIA' && (
        <div className="mt-2 p-2 bg-slate-700/30 rounded-lg">
          <div className="text-xs text-slate-300 mb-1">
            🚀 Context: {currentProject}
          </div>
          <div className="flex space-x-2">
            {currentProject === 'KREACH' && (
              <>
                <button className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
                  Search Markets
                </button>
                <button className="text-xs bg-green-600/20 text-green-300 px-2 py-1 rounded">
                  Run Analysis
                </button>
              </>
            )}
            {currentProject === 'OnlyOneAPI' && (
              <>
                <button className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                  Test Endpoints
                </button>
                <button className="text-xs bg-orange-600/20 text-orange-300 px-2 py-1 rounded">
                  View Metrics
                </button>
              </>
            )}
            {currentProject === 'NEXTGEN' && (
              <>
                <button className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded">
                  Domain Status
                </button>
                <button className="text-xs bg-red-600/20 text-red-300 px-2 py-1 rounded">
                  Revenue Report
                </button>
              </>
            )}
            {currentProject === 'KVIBE' && (
              <>
                <button className="text-xs bg-pink-600/20 text-pink-300 px-2 py-1 rounded">
                  Campaign Stats
                </button>
                <button className="text-xs bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded">
                  Content Queue
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TouchBarController;