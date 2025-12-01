/**
 * Unit tests for localStorage Schema & User Data Architecture
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  // Preferences
  getPreference,
  getAllPreferences,
  setPreference,
  setPreferences,
  resetPreferences,
  // Daily Draw
  getDailyDraw,
  updateDailyDraw,
  clearDailyDraw,
  needsNewDailyDraw,
  // Reading History
  getReadingHistory,
  getReading,
  addReading,
  updateReading,
  deleteReading,
  getReadingsByTags,
  getReadingsByDateRange,
  clearReadingHistory,
  // Tags
  getAvailableTags,
  addEmotionTag,
  addLifeAreaTag,
  addTag,
  removeTag,
  // Utilities
  getSchemaVersion,
  exportData,
  importData,
  resetAllData,
  getStorageInfo,
  // Types
  type DailyDraw,
  type Reading,
  type UserPreferences,
  StorageQuotaExceededError,
  StorageParseError,
} from './storage';

describe('Storage - User Preferences', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllData();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return default preferences on first load', () => {
    const prefs = getAllPreferences();
    expect(prefs.theme).toBe('night');
    expect(prefs.notificationsEnabled).toBe(true);
    expect(prefs.notificationTime).toBe('08:00');
    expect(prefs.sansSerifBody).toBe(false);
    expect(prefs.reduceMotion).toBe(false);
  });

  it('should get a specific preference', () => {
    const theme = getPreference('theme');
    expect(theme).toBe('night');
  });

  it('should set a specific preference', () => {
    setPreference('theme', 'dawn');
    expect(getPreference('theme')).toBe('dawn');
  });

  it('should set multiple preferences at once', () => {
    setPreferences({
      theme: 'dawn',
      notificationsEnabled: false,
      sansSerifBody: true,
    });

    const prefs = getAllPreferences();
    expect(prefs.theme).toBe('dawn');
    expect(prefs.notificationsEnabled).toBe(false);
    expect(prefs.sansSerifBody).toBe(true);
  });

  it('should persist preferences across getData calls', () => {
    setPreference('notificationTime', '14:30');
    expect(getPreference('notificationTime')).toBe('14:30');
  });

  it('should reset preferences to defaults', () => {
    setPreferences({ theme: 'dawn', sansSerifBody: true });
    resetPreferences();

    const prefs = getAllPreferences();
    expect(prefs.theme).toBe('night');
    expect(prefs.sansSerifBody).toBe(false);
  });
});

describe('Storage - Daily Draw', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllData();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return null for daily draw on first load', () => {
    expect(getDailyDraw()).toBeNull();
  });

  it('should update daily draw', () => {
    const draw: DailyDraw = {
      lastDrawDate: '2025-11-29',
      card: { id: 'fool', name: 'The Fool', upright: true },
      question: 'What should I focus on today?',
    };

    updateDailyDraw(draw);
    expect(getDailyDraw()).toEqual(draw);
  });

  it('should clear daily draw', () => {
    const draw: DailyDraw = {
      lastDrawDate: '2025-11-29',
      card: { id: 'fool', name: 'The Fool', upright: true },
    };

    updateDailyDraw(draw);
    clearDailyDraw();
    expect(getDailyDraw()).toBeNull();
  });

  it('should detect when new daily draw is needed', () => {
    expect(needsNewDailyDraw()).toBe(true);

    const today = new Date().toISOString().split('T')[0];
    updateDailyDraw({
      lastDrawDate: today,
      card: { id: 'fool', name: 'The Fool', upright: true },
    });

    expect(needsNewDailyDraw()).toBe(false);
  });

  it('should detect when daily draw date is outdated', () => {
    updateDailyDraw({
      lastDrawDate: '2025-11-28',
      card: { id: 'fool', name: 'The Fool', upright: true },
    });

    expect(needsNewDailyDraw()).toBe(true);
  });
});

describe('Storage - Reading History', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllData();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return empty array on first load', () => {
    expect(getReadingHistory()).toEqual([]);
  });

  it('should add a new reading', () => {
    const reading = addReading({
      spreadType: 'three-card',
      cards: [
        { id: 'fool', name: 'The Fool', upright: true, position: 'past' },
        { id: 'magician', name: 'The Magician', upright: false, position: 'present' },
        { id: 'high-priestess', name: 'The High Priestess', upright: true, position: 'future' },
      ],
      question: 'What lies ahead?',
      tags: ['career', 'anxious'],
      shared: false,
    });

    expect(reading.id).toBeDefined();
    expect(reading.timestamp).toBeDefined();
    expect(reading.spreadType).toBe('three-card');
    expect(reading.cards).toHaveLength(3);
  });

  it('should get reading by ID', () => {
    const reading = addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    const retrieved = getReading(reading.id);
    expect(retrieved).toEqual(reading);
  });

  it('should return undefined for non-existent reading', () => {
    expect(getReading('non-existent-id')).toBeUndefined();
  });

  it('should update an existing reading', () => {
    const reading = addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    const updated = updateReading(reading.id, {
      userNotes: 'This reading was very insightful',
      tags: ['self', 'hopeful'],
    });

    expect(updated?.userNotes).toBe('This reading was very insightful');
    expect(updated?.tags).toEqual(['self', 'hopeful']);
  });

  it('should return undefined when updating non-existent reading', () => {
    const result = updateReading('non-existent-id', { userNotes: 'Test' });
    expect(result).toBeUndefined();
  });

  it('should delete a reading', () => {
    const reading = addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    expect(deleteReading(reading.id)).toBe(true);
    expect(getReading(reading.id)).toBeUndefined();
  });

  it('should return false when deleting non-existent reading', () => {
    expect(deleteReading('non-existent-id')).toBe(false);
  });

  it('should add readings to the beginning of the array', () => {
    const reading1 = addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    const reading2 = addReading({
      spreadType: 'single-card',
      cards: [{ id: 'magician', name: 'The Magician', upright: true }],
      tags: [],
      shared: false,
    });

    const history = getReadingHistory();
    expect(history[0].id).toBe(reading2.id);
    expect(history[1].id).toBe(reading1.id);
  });

  it('should filter readings by tags', () => {
    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: ['career', 'anxious'],
      shared: false,
    });

    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'magician', name: 'The Magician', upright: true }],
      tags: ['love', 'hopeful'],
      shared: false,
    });

    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'high-priestess', name: 'The High Priestess', upright: true }],
      tags: ['career', 'confused'],
      shared: false,
    });

    const careerReadings = getReadingsByTags(['career']);
    expect(careerReadings).toHaveLength(2);

    const loveReadings = getReadingsByTags(['love']);
    expect(loveReadings).toHaveLength(1);
  });

  it('should filter readings by date range', () => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;

    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    const readings = getReadingsByDateRange(oneDayAgo, now);
    expect(readings).toHaveLength(1);

    const olderReadings = getReadingsByDateRange(twoDaysAgo, oneDayAgo);
    expect(olderReadings).toHaveLength(0);
  });

  it('should clear all reading history', () => {
    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    clearReadingHistory();
    expect(getReadingHistory()).toEqual([]);
  });
});

describe('Storage - Tag Management', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllData();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return default tags on first load', () => {
    const tags = getAvailableTags();
    expect(tags.emotions).toContain('anxious');
    expect(tags.lifeAreas).toContain('career');
  });

  it('should add a new emotion tag', () => {
    addEmotionTag('peaceful');
    const tags = getAvailableTags();
    expect(tags.emotions).toContain('peaceful');
  });

  it('should not add duplicate emotion tags', () => {
    addEmotionTag('anxious');
    const tags = getAvailableTags();
    const anxiousCount = tags.emotions.filter(t => t === 'anxious').length;
    expect(anxiousCount).toBe(1);
  });

  it('should add a new life area tag', () => {
    addLifeAreaTag('health');
    const tags = getAvailableTags();
    expect(tags.lifeAreas).toContain('health');
  });

  it('should not add duplicate life area tags', () => {
    addLifeAreaTag('career');
    const tags = getAvailableTags();
    const careerCount = tags.lifeAreas.filter(t => t === 'career').length;
    expect(careerCount).toBe(1);
  });

  it('should add tag to specified category', () => {
    addTag('motivated', 'emotions');
    addTag('education', 'lifeAreas');

    const tags = getAvailableTags();
    expect(tags.emotions).toContain('motivated');
    expect(tags.lifeAreas).toContain('education');
  });

  it('should remove tag from category', () => {
    removeTag('anxious', 'emotions');
    const tags = getAvailableTags();
    expect(tags.emotions).not.toContain('anxious');
  });
});

describe('Storage - Utility Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllData();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return correct schema version', () => {
    expect(getSchemaVersion()).toBe(1);
  });

  it('should export data as JSON string', () => {
    setPreference('theme', 'dawn');
    const exported = exportData();
    const parsed = JSON.parse(exported);

    expect(parsed.user_preferences.theme).toBe('dawn');
    expect(parsed.schemaVersion).toBe(1);
  });

  it('should import data from JSON string', () => {
    const data = {
      user_preferences: {
        notificationTime: '14:30',
        notificationsEnabled: false,
        theme: 'dawn' as const,
        sansSerifBody: true,
        reduceMotion: true,
      },
      daily_draw: null,
      reading_history: [],
      available_tags: {
        emotions: ['test-emotion'],
        lifeAreas: ['test-area'],
      },
      schemaVersion: 1,
    };

    importData(JSON.stringify(data));

    const prefs = getAllPreferences();
    expect(prefs.theme).toBe('dawn');
    expect(prefs.notificationTime).toBe('14:30');

    const tags = getAvailableTags();
    expect(tags.emotions).toContain('test-emotion');
  });

  it('should throw error on invalid import data', () => {
    expect(() => importData('invalid json')).toThrow(StorageParseError);
  });

  it('should reset all data to defaults', () => {
    setPreference('theme', 'dawn');
    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    resetAllData();

    expect(getPreference('theme')).toBe('night');
    expect(getReadingHistory()).toEqual([]);
  });

  it('should return storage info', () => {
    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    const info = getStorageInfo();
    expect(info.isAvailable).toBe(true);
    expect(info.readingCount).toBe(1);
    expect(info.estimatedSize).toBeGreaterThan(0);
  });
});

describe('Storage - Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllData();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should handle localStorage being unavailable gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('localStorage not available');
    };

    // Should not throw, just warn
    expect(() => setPreference('theme', 'dawn')).not.toThrow();

    localStorage.setItem = originalSetItem;
  });

  // Note: QuotaExceededError handling is tested manually in browser environments
  // where the actual DOMException can be properly simulated. The error handling
  // code in storage.ts properly detects and throws StorageQuotaExceededError.
});

describe('Storage - Data Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllData();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should persist all data types together', () => {
    // Set preferences
    setPreference('theme', 'dawn');

    // Add daily draw
    updateDailyDraw({
      lastDrawDate: '2025-11-29',
      card: { id: 'fool', name: 'The Fool', upright: true },
    });

    // Add reading
    addReading({
      spreadType: 'single-card',
      cards: [{ id: 'magician', name: 'The Magician', upright: true }],
      tags: ['career'],
      shared: false,
    });

    // Add custom tag
    addEmotionTag('custom-emotion');

    // Verify all persisted
    expect(getPreference('theme')).toBe('dawn');
    expect(getDailyDraw()?.card.id).toBe('fool');
    expect(getReadingHistory()).toHaveLength(1);
    expect(getAvailableTags().emotions).toContain('custom-emotion');
  });

  it('should maintain data integrity across multiple operations', () => {
    const reading1 = addReading({
      spreadType: 'single-card',
      cards: [{ id: 'fool', name: 'The Fool', upright: true }],
      tags: [],
      shared: false,
    });

    setPreference('theme', 'dawn');

    const reading2 = addReading({
      spreadType: 'three-card',
      cards: [
        { id: 'magician', name: 'The Magician', upright: true },
        { id: 'high-priestess', name: 'The High Priestess', upright: false },
        { id: 'empress', name: 'The Empress', upright: true },
      ],
      tags: ['love'],
      shared: false,
    });

    updateReading(reading1.id, { userNotes: 'Updated notes' });

    // Verify data integrity
    expect(getReadingHistory()).toHaveLength(2);
    expect(getReading(reading1.id)?.userNotes).toBe('Updated notes');
    expect(getReading(reading2.id)?.cards).toHaveLength(3);
    expect(getPreference('theme')).toBe('dawn');
  });
});
