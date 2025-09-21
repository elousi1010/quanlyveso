import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationApi } from '../api';
import type { CreateStationDto, UpdateStationDto } from '../types';

export const useStationMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateStationDto) => stationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationDto }) =>
      stationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => stationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
