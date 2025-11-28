import React from 'react';
import DoctorSidebar from './doctorsidebar';
import { SidebarProvider, useSidebar } from './SidebarContext';

const DoctorLayoutContent = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <DoctorSidebar />
      <div 
        className={`flex-1 p-6 transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const DoctorLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <DoctorLayoutContent>
        {children}
      </DoctorLayoutContent>
    </SidebarProvider>
  );
};

export default DoctorLayout;


