import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scraperApi } from '../api/scraperApi';

export * from './useTickets';

export const useTriggerScrape = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: scraperApi.triggerScrape,
        onSuccess: () => {
            // Refresh dữ liệu sau khi scrape thành công
            queryClient.invalidateQueries({ queryKey: ['lottery-results'] });
        },
    });
};
