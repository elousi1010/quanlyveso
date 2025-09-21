import { VALIDATION } from '@/constants';

/**
 * Validation rules and helpers
 */

export const validationRules = {
  required: (value: unknown): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string): boolean => {
    return VALIDATION.PHONE_REGEX.test(value);
  },

  password: (value: string): boolean => {
    return value.length >= VALIDATION.PASSWORD_MIN_LENGTH;
  },

  name: (value: string): boolean => {
    return (
      value.length >= VALIDATION.NAME_MIN_LENGTH &&
      value.length <= VALIDATION.NAME_MAX_LENGTH
    );
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  number: (value: string): boolean => {
    return !isNaN(Number(value)) && isFinite(Number(value));
  },

  positiveNumber: (value: string): boolean => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  },

  integer: (value: string): boolean => {
    return Number.isInteger(Number(value));
  },
};

export const validationMessages = {
  required: 'Trường này là bắt buộc',
  minLength: (min: number) => `Tối thiểu ${min} ký tự`,
  maxLength: (max: number) => `Tối đa ${max} ký tự`,
  email: 'Email không hợp lệ',
  phone: 'Số điện thoại không hợp lệ',
  password: `Mật khẩu phải có ít nhất ${VALIDATION.PASSWORD_MIN_LENGTH} ký tự`,
  name: `Tên phải có từ ${VALIDATION.NAME_MIN_LENGTH} đến ${VALIDATION.NAME_MAX_LENGTH} ký tự`,
  url: 'URL không hợp lệ',
  number: 'Phải là số hợp lệ',
  positiveNumber: 'Phải là số dương',
  integer: 'Phải là số nguyên',
};

/**
 * Validate a value against a rule
 */
export function validateValue(
  value: unknown,
  rule: keyof typeof validationRules,
  ...args: unknown[]
): { isValid: boolean; message: string } {
  const ruleFunction = validationRules[rule] as (...args: unknown[]) => boolean;
  const isValid = ruleFunction(value as string, ...args);
  const message = isValid ? '' : getValidationMessage(rule, ...args);
  
  return { isValid, message };
}

/**
 * Get validation message for a rule
 */
export function getValidationMessage(
  rule: keyof typeof validationMessages,
  ...args: unknown[]
): string {
  const message = validationMessages[rule];
  
  if (typeof message === 'function') {
    return (message as (...args: unknown[]) => string)(...args);
  }
  
  return message;
}

/**
 * Validate form data
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Partial<Record<keyof T, Array<{ rule: keyof typeof validationRules; args?: unknown[] }>>>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const [field, fieldRules] of Object.entries(rules)) {
    if (!fieldRules) continue;

    for (const { rule, args = [] } of fieldRules) {
      const { isValid: fieldIsValid, message } = validateValue(
        data[field as keyof T],
        rule,
        ...args
      );

      if (!fieldIsValid) {
        errors[field as keyof T] = message;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }

  return { isValid, errors };
}

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;]/g, '') // Remove semicolons
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validate file upload
 */
export function validateFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']
): { isValid: boolean; message: string } {
  if (file.size > maxSize) {
    return {
      isValid: false,
      message: `File quá lớn. Kích thước tối đa: ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true, message: '' };
}
