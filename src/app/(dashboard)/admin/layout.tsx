import RoleGuard from '@/components/auth/role-guard';
import React, { ReactNode } from 'react';

const layout = ({children}: {children: ReactNode}) => {
    return (
        <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>Admin Dashboard Layout
            {children}
        </RoleGuard>
    );
};

export default layout;