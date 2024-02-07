export function validatePath(inputString: string): boolean {
    // Define the regular expression pattern for a valid path
    const pattern: RegExp = /^\/.*$/;
  
    // Use test() method to check if the input string matches the pattern
    return pattern.test(inputString);
  }
  