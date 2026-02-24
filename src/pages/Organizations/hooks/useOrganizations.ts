import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../api/organizationApi';
import type { OrganizationSearchParams } from '../types';

export const organizationKeys = {
    all: ['organizations'] as const,
    lists: () => [...organizationKeys.all, 'list'] as const,
    list: (params: OrganizationSearchParams) => [...organizationKeys.lists(), params] as const,
    details: () => [...organizationKeys.all, 'detail'] as const,
    detail: (id: string) => [...organizationKeys.details(), id] as const,
};

export const useOrganizations = (params: OrganizationSearchParams = {}) => {
    return useQuery({
        queryKey: organizationKeys.list(params),
        queryFn: () => organizationApi.getAll(params),
        placeholderData: (previousData) => previousData, // keep previous data while fetching new data
    });
};

export const useOrganization = (id: string) => {
    return useQuery({
        queryKey: organizationKeys.detail(id),
        queryFn: () => organizationApi.getById(id),
        enabled: !!id,
    });
};
