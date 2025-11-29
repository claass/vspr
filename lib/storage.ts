/**
 * localStorage Schema & User Data Architecture for Vesper
 * Provides type-safe CRUD operations for user preferences, daily draws, and reading history
 */

// ============================================================================
// TypeScript Types
// ============================================================================

export type Theme = 'night' | 'dawn';

export interface UserPreferences {
  notificationTime: string; // HH:MM format
  notificationsEnabled: boolean;
  theme: Theme;
  sansSerifBody: boolean;
  reduceMotion: boolean;
}

export interface TarotCardData {
  id: string;
  name: string;
  upright: boolean;
  position?: string; // For multi-card spreads
}

export interface DailyDraw {
  lastDrawDate: string; // YYYY-MM-DD format
  card: TarotCardData;
  question?: string;
}

export interface Reading {
  id: string;
  timestamp: number;
  spreadType: string;
  cards: TarotCardData[];
  question?: string;
  aiInterpretation?: string;
  userNotes?: string;
  tags: string[];
  shared: boolean;
  shareLink?: string;
}

export interface AvailableTags {
  emotions: string[];
  lifeAreas: string[];
}

export interface VesperStorage {
  user_preferences: UserPreferences;
  daily_draw: DailyDraw | null;
  reading_history: Reading[];
  available_tags: AvailableTags;
  schemaVersion: number;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'vesper_data';
const CURRENT_SCHEMA_VERSION = 1;

const DEFAULT_PREFERENCES: UserPreferences = {
  notificationTime: '08:00',
  notificationsEnabled: true,
  theme: 'night',
  sansSerifBody: false,
  reduceMotion: false,
};

const DEFAULT_TAGS: AvailableTags = {
  emotions: ['anxious', 'hopeful', 'confused', 'excited', 'stuck'],
  lifeAreas: ['love', 'career', 'self', 'family', 'friendship', 'spirituality'],
};

const DEFAULT_STORAGE: VesperStorage = {
  user_preferences: DEFAULT_PREFERENCES,
  daily_draw: null,
  reading_history: [],
  available_tags: DEFAULT_TAGS,
  schemaVersion: CURRENT_SCHEMA_VERSION,
};

// ============================================================================
// Error Classes
// ============================================================================

export class StorageQuotaExceededError extends Error {
  constructor(message = 'localStorage quota exceeded') {
    super(message);
    this.name = 'StorageQuotaExceededError';
  }
}

export class StorageParseError extends Error {
  constructor(message = 'Failed to parse localStorage data') {
    super(message);
    this.name = 'StorageParseError';
  }
}

// ============================================================================
// Core Storage Functions
// ============================================================================

/**
 * Checks if localStorage is available in the current environment
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__vesper_storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves all data from localStorage
 */
function getData(): VesperStorage {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, using default data');
    return DEFAULT_STORAGE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STORAGE;
    }

    const data = JSON.parse(raw) as VesperStorage;

    // Handle schema migrations if needed
    if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      return migrateSchema(data);
    }

    return data;
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    throw new StorageParseError();
  }
}

/**
 * Saves data to localStorage with quota handling
 */
function setData(data: VesperStorage): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, data will not persist');
    return;
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageQuotaExceededError();
    }
    throw error;
  }
}

/**
 * Handles schema migrations for future versions
 */
function migrateSchema(oldData: VesperStorage): VesperStorage {
  // Currently only version 1 exists, but this function will handle future migrations
  const migrated = { ...oldData };

  if (oldData.schemaVersion < CURRENT_SCHEMA_VERSION) {
    // Future migrations will go here
    migrated.schemaVersion = CURRENT_SCHEMA_VERSION;
    setData(migrated);
  }

  return migrated;
}

// ============================================================================
// User Preferences Functions
// ============================================================================

/**
 * Gets a specific user preference
 */
export function getPreference<K extends keyof UserPreferences>(
  key: K
): UserPreferences[K] {
  const data = getData();
  return data.user_preferences[key];
}

/**
 * Gets all user preferences
 */
export function getAllPreferences(): UserPreferences {
  const data = getData();
  return data.user_preferences;
}

/**
 * Sets a specific user preference
 */
export function setPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  const data = getData();
  data.user_preferences[key] = value;
  setData(data);
}

/**
 * Sets multiple preferences at once
 */
export function setPreferences(preferences: Partial<UserPreferences>): void {
  const data = getData();
  data.user_preferences = { ...data.user_preferences, ...preferences };
  setData(data);
}

/**
 * Resets preferences to defaults
 */
export function resetPreferences(): void {
  const data = getData();
  data.user_preferences = DEFAULT_PREFERENCES;
  setData(data);
}

// ============================================================================
// Daily Draw Functions
// ============================================================================

/**
 * Gets the current daily draw
 */
export function getDailyDraw(): DailyDraw | null {
  const data = getData();
  return data.daily_draw;
}

/**
 * Updates the daily draw
 */
export function updateDailyDraw(draw: DailyDraw): void {
  const data = getData();
  data.daily_draw = draw;
  setData(data);
}

/**
 * Clears the daily draw
 */
export function clearDailyDraw(): void {
  const data = getData();
  data.daily_draw = null;
  setData(data);
}

/**
 * Checks if a new daily draw is needed (date has changed)
 */
export function needsNewDailyDraw(): boolean {
  const draw = getDailyDraw();
  if (!draw) return true;

  const today = new Date().toISOString().split('T')[0];
  return draw.lastDrawDate !== today;
}

// ============================================================================
// Reading History Functions
// ============================================================================

/**
 * Generates a unique ID for a reading
 */
function generateReadingId(): string {
  return `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets all reading history
 */
export function getReadingHistory(): Reading[] {
  const data = getData();
  return data.reading_history;
}

/**
 * Gets a specific reading by ID
 */
export function getReading(id: string): Reading | undefined {
  const data = getData();
  return data.reading_history.find(reading => reading.id === id);
}

/**
 * Adds a new reading to history
 */
export function addReading(
  reading: Omit<Reading, 'id' | 'timestamp'>
): Reading {
  const data = getData();

  const newReading: Reading = {
    ...reading,
    id: generateReadingId(),
    timestamp: Date.now(),
  };

  data.reading_history.unshift(newReading); // Add to beginning
  setData(data);

  return newReading;
}

/**
 * Updates an existing reading
 */
export function updateReading(
  id: string,
  updates: Partial<Omit<Reading, 'id' | 'timestamp'>>
): Reading | undefined {
  const data = getData();
  const index = data.reading_history.findIndex(r => r.id === id);

  if (index === -1) return undefined;

  data.reading_history[index] = {
    ...data.reading_history[index],
    ...updates,
  };

  setData(data);
  return data.reading_history[index];
}

/**
 * Deletes a reading by ID
 */
export function deleteReading(id: string): boolean {
  const data = getData();
  const initialLength = data.reading_history.length;
  data.reading_history = data.reading_history.filter(r => r.id !== id);

  if (data.reading_history.length < initialLength) {
    setData(data);
    return true;
  }

  return false;
}

/**
 * Gets readings filtered by tags
 */
export function getReadingsByTags(tags: string[]): Reading[] {
  const data = getData();
  return data.reading_history.filter(reading =>
    tags.some(tag => reading.tags.includes(tag))
  );
}

/**
 * Gets readings within a date range
 */
export function getReadingsByDateRange(
  startDate: number,
  endDate: number
): Reading[] {
  const data = getData();
  return data.reading_history.filter(
    reading => reading.timestamp >= startDate && reading.timestamp <= endDate
  );
}

/**
 * Clears all reading history
 */
export function clearReadingHistory(): void {
  const data = getData();
  data.reading_history = [];
  setData(data);
}

// ============================================================================
// Tag Management Functions
// ============================================================================

/**
 * Gets all available tags
 */
export function getAvailableTags(): AvailableTags {
  const data = getData();
  return data.available_tags;
}

/**
 * Adds a new emotion tag
 */
export function addEmotionTag(tag: string): void {
  const data = getData();
  if (!data.available_tags.emotions.includes(tag)) {
    data.available_tags.emotions.push(tag);
    setData(data);
  }
}

/**
 * Adds a new life area tag
 */
export function addLifeAreaTag(tag: string): void {
  const data = getData();
  if (!data.available_tags.lifeAreas.includes(tag)) {
    data.available_tags.lifeAreas.push(tag);
    setData(data);
  }
}

/**
 * Adds a custom tag to the appropriate category
 */
export function addTag(tag: string, category: 'emotions' | 'lifeAreas'): void {
  const data = getData();
  if (!data.available_tags[category].includes(tag)) {
    data.available_tags[category].push(tag);
    setData(data);
  }
}

/**
 * Removes a tag from a category
 */
export function removeTag(tag: string, category: 'emotions' | 'lifeAreas'): void {
  const data = getData();
  data.available_tags[category] = data.available_tags[category].filter(t => t !== tag);
  setData(data);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the current schema version
 */
export function getSchemaVersion(): number {
  const data = getData();
  return data.schemaVersion;
}

/**
 * Exports all data as JSON string (for backup)
 */
export function exportData(): string {
  const data = getData();
  return JSON.stringify(data, null, 2);
}

/**
 * Imports data from JSON string (for restore)
 */
export function importData(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString) as VesperStorage;
    setData(data);
  } catch (error) {
    throw new StorageParseError('Invalid import data format');
  }
}

/**
 * Resets all storage to defaults
 */
export function resetAllData(): void {
  setData(DEFAULT_STORAGE);
}

/**
 * Gets storage usage information (approximate)
 */
export function getStorageInfo(): {
  isAvailable: boolean;
  estimatedSize: number;
  readingCount: number;
} {
  const isAvailable = isLocalStorageAvailable();
  const data = getData();
  const estimatedSize = isAvailable
    ? new Blob([JSON.stringify(data)]).size
    : 0;

  return {
    isAvailable,
    estimatedSize,
    readingCount: data.reading_history.length,
  };
}
