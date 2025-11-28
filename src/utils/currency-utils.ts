export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}