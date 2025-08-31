// Utility function to extract name from email
export function extractNameFromEmail(email: string): string {
  if (!email) return "User";
  
  // Remove domain and file extension
  const localPart = email.split('@')[0];
  
  // Replace common separators with spaces
  const nameWithSpaces = localPart
    .replace(/[._-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Handle camelCase
    .replace(/\d+/g, '') // Remove numbers
    .trim();
  
  // Capitalize each word
  const capitalized = nameWithSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  return capitalized || "User";
}

// Generate initials from name or email
export function getInitials(name: string, email?: string): string {
  if (name && name !== "User") {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  if (email) {
    const extractedName = extractNameFromEmail(email);
    return extractedName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  return "U";
}
