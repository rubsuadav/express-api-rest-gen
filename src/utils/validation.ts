export function validateProjectName(name: string): boolean | string {
  const validNamePattern = /^[a-z0-9_-]+$/i;

  if (!name || name.trim().length === 0) {
    return "Project name cannot be empty.";
  }

  if (name.length < 3 || name.length > 50) {
    return "Project name must be between 3 and 50 characters long.";
  }

  if (!validNamePattern.test(name)) {
    return "Invalid project name. Project names can only contain letters, numbers, hyphens (-), and underscores (_). No special characters like @, #, $, etc. are allowed.";
  }

  return true;
}
