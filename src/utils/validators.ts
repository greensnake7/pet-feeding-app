// src/utils/validators.ts

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };
  
  /**
   * Validates a password based on common security requirements
   * @param password The password to validate
   * @returns An object containing validation result and error message
   */
export const validatePassword = (password: string): { 
    isValid: boolean;
    message?: string;
  } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }
  
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (!hasUpperCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }
  
    if (!hasLowerCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }
  
    if (!hasNumbers) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }
  
    if (!hasSpecialChar) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character'
      };
    }
  
    return { isValid: true };
  };
  
  /**
   * Validates a username
   * @param username The username to validate
   * @returns An object containing validation result and error message
   */
export const validateUsername = (username: string): {
    isValid: boolean;
    message?: string;
  } => {
    if (username.length < 3) {
      return {
        isValid: false,
        message: 'Username must be at least 3 characters long'
      };
    }
  
    if (username.length > 30) {
      return {
        isValid: false,
        message: 'Username cannot be longer than 30 characters'
      };
    }
  
    // Only allow letters, numbers, underscores, and hyphens
    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(username)) {
      return {
        isValid: false,
        message: 'Username can only contain letters, numbers, underscores, and hyphens'
      };
    }
  
    return { isValid: true };
  };
  
  /**
   * Validates a phone number
   * @param phone The phone number to validate
   * @returns boolean indicating if the phone number is valid
   */
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone.trim());
  };
  
  /**
   * Validates a date string
   * @param dateString The date string to validate
   * @returns boolean indicating if the date is valid
   */
export const validateDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };
  
  /**
   * Validates a time string in 24-hour format (HH:mm)
   * @param timeString The time string to validate
   * @returns boolean indicating if the time is valid
   */
  
export const validateTime = (timeString: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  };
  
  /**
   * Validates a URL
   * @param url The URL to validate
   * @returns boolean indicating if the URL is valid
   */
export const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  /**
   * Validates if a value is within a specified range
   * @param value The number to validate
   * @param min Minimum allowed value
   * @param max Maximum allowed value
   * @returns boolean indicating if the value is within range
   */
export const validateRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  };
  
  /**
   * Validates if a string matches the required length
   * @param str The string to validate
   * @param minLength Minimum required length
   * @param maxLength Maximum allowed length
   * @returns An object containing validation result and error message
   */
export const validateLength = (
    str: string,
    minLength: number,
    maxLength: number
  ): {
    isValid: boolean;
    message?: string;
  } => {
    if (str.length < minLength) {
      return {
        isValid: false,
        message: `Must be at least ${minLength} characters long`
      };
    }
  
    if (str.length > maxLength) {
      return {
        isValid: false,
        message: `Cannot be longer than ${maxLength} characters`
      };
    }
  
    return { isValid: true };
  };
  
  /**
   * Validates if a value is empty
   * @param value The value to check
   * @returns boolean indicating if the value is empty
   */
export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  };
  
  /**
   * Validates if all required fields are present in an object
   * @param obj The object to validate
   * @param requiredFields Array of required field names
   * @returns An object containing validation result and missing fields
   */
export const validateRequiredFields = (
    obj: Record<string, any>,
    requiredFields: string[]
  ): {
    isValid: boolean;
    missingFields: string[];
  } => {
    const missingFields = requiredFields.filter(field => isEmpty(obj[field]));
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };
  
  /**
   * Validates file size
   * @param fileSize Size of the file in bytes
   * @param maxSize Maximum allowed size in bytes
   * @returns boolean indicating if the file size is valid
   */
export const validateFileSize = (fileSize: number, maxSize: number): boolean => {
    return fileSize <= maxSize;
  };
  
  /**
   * Validates file type based on allowed extensions
   * @param fileName Name of the file
   * @param allowedExtensions Array of allowed file extensions
   * @returns boolean indicating if the file type is valid
   */
export const validateFileType = (
    fileName: string,
    allowedExtensions: string[]
  ): boolean => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return allowedExtensions.includes(extension);
  };