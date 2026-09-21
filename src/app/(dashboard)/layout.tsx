import AuthGuard from '@/components/auth/auth-guard';
import React, { ReactNode } from 'react';

const DashboardLayout = ({children}: {children: ReactNode}) => {
    return (
        <AuthGuard>General Dashboard Layout:
         {children}
        </AuthGuard>
    );
};

export default DashboardLayout;