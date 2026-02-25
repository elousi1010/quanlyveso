import React from 'react';
import { useHasPermission } from '../../hooks/useHasPermission';

interface WithPermissionProps {
    permission: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const WithPermission: React.FC<WithPermissionProps> = ({
    permission,
    children,
    fallback = null,
}) => {
    const { hasPermission, hasAnyPermission } = useHasPermission();

    const isAllowed = Array.isArray(permission)
        ? hasAnyPermission(permission)
        : hasPermission(permission);

    if (!isAllowed) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default WithPermission;
