import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationApi } from '../api/organizationApi';
import { organizationKeys } from './useOrganizations';
import type { CreateOrganizationDto, UpdateMyOrganizationDto } from '../types';

export const useCreateOrganization = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOrganizationDto) => organizationApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
        },
    });
};

export const useUpdateOrganization = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMyOrganizationDto }) =>
            organizationApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: organizationKeys.detail(variables.id) });
        },
    });
};
