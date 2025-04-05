
/**
 * Utility functions for patient record management
 */

// Validate mobile number format (10 digits)
export const isValidMobile = (mobile: string): boolean => {
  return /^\d{10}$/.test(mobile);
};

// Format currency values
export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

// Calculate total price
export const calculateTotal = (framePrice: string | number, glassPrice: string | number): number => {
  const frame = typeof framePrice === 'string' ? parseFloat(framePrice) || 0 : framePrice;
  const glass = typeof glassPrice === 'string' ? parseFloat(glassPrice) || 0 : glassPrice;
  return frame + glass;
};

// Generate a simple patient ID
export const generatePatientId = (): string => {
  return `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

// Sort patients by date (newest first)
export const sortPatientsByDate = (patients: any[]): any[] => {
  return [...patients].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
