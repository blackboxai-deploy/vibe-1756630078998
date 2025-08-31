export interface MoodEntry {
  date: string; // YYYY-MM-DD format
  mood: string; // emoji
  note: string;
  timestamp: number;
}

export interface MoodData {
  [date: string]: MoodEntry;
}

const STORAGE_KEY = 'mood-journal-data';

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get all mood entries from localStorage
 */
export const getAllMoodEntries = (): MoodData => {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading mood data:', error);
    return {};
  }
};

/**
 * Get mood entry for a specific date
 */
export const getMoodEntry = (date: string): MoodEntry | null => {
  const allEntries = getAllMoodEntries();
  return allEntries[date] || null;
};

/**
 * Get today's mood entry
 */
export const getTodayMoodEntry = (): MoodEntry | null => {
  return getMoodEntry(getTodayDate());
};

/**
 * Save or update a mood entry
 */
export const saveMoodEntry = (entry: Omit<MoodEntry, 'timestamp'>): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const allEntries = getAllMoodEntries();
    const newEntry: MoodEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    
    allEntries[entry.date] = newEntry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allEntries));
    return true;
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return false;
  }
};

/**
 * Delete a mood entry
 */
export const deleteMoodEntry = (date: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const allEntries = getAllMoodEntries();
    delete allEntries[date];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allEntries));
    return true;
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return false;
  }
};

/**
 * Get entries sorted by date (newest first)
 */
export const getSortedMoodEntries = (): MoodEntry[] => {
  const allEntries = getAllMoodEntries();
  return Object.values(allEntries).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

/**
 * Get entries for current month
 */
export const getCurrentMonthEntries = (): MoodEntry[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return getSortedMoodEntries().filter(entry => {
    const entryDate = new Date(entry.date + 'T00:00:00');
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  });
};

/**
 * Clear all mood data (for reset functionality)
 */
export const clearAllMoodData = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing mood data:', error);
    return false;
  }
};