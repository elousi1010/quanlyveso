/**
 * Utility functions specific to DailyVeso Business Logic
 */

// Cut-off time for returning tickets (3:30 PM local Vietnam time normally)
export const TICKET_RETURN_CUTOFF_HOUR = 15;
export const TICKET_RETURN_CUTOFF_MINUTE = 30;

/**
 * Checks if the current time is past the daily ticket return cutoff time (e.g. 15:30).
 * If past this time, agents cannot return unsold tickets.
 * @returns {boolean} true if ticket returning is currently locked
 */
export const isPastTicketReturnCutoff = (): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // If after 15:xx
    if (currentHour > TICKET_RETURN_CUTOFF_HOUR) {
        return true;
    }
    // If exactly 15:xx, check if >= 30
    if (currentHour === TICKET_RETURN_CUTOFF_HOUR && currentMinute >= TICKET_RETURN_CUTOFF_MINUTE) {
        return true;
    }
    return false;
};

/**
 * Determines the risk level label based on the partner's current debt and credit limit.
 * @param debt Current debt of the partner
 * @param creditLimit Maximum credit limit allowed
 * @returns Risk level category
 */
export const calculateRiskLevel = (
    debt: number,
    creditLimit?: number
): 'Normal' | 'Warning' | 'High Risk' | 'Blacklisted' => {
    // If no credit limit is set, assume normal unless otherwise flagged by backend
    if (!creditLimit || creditLimit <= 0) return 'Normal';

    const debtRatio = debt / creditLimit;

    if (debtRatio >= 1.0) return 'Blacklisted'; // Reached or exceeded the limit
    if (debtRatio >= 0.8) return 'High Risk';   // Used 80% or more
    if (debtRatio >= 0.5) return 'Warning';     // Used 50% or more

    return 'Normal';
};
