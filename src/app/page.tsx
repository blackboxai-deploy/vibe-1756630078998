'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MoodPicker from '@/components/MoodPicker';
import NoteInput from '@/components/NoteInput';
import MoodHistory from '@/components/MoodHistory';
import { 
  MoodEntry, 
  getTodayDate, 
  getTodayMoodEntry, 
  saveMoodEntry, 
  getSortedMoodEntries 
} from '@/lib/moodStorage';

export default function MoodJournalApp() {
  // State management
  const [todayMood, setTodayMood] = React.useState('');
  const [todayNote, setTodayNote] = React.useState('');
  const [allEntries, setAllEntries] = React.useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Load data on component mount
  React.useEffect(() => {
    const loadData = () => {
      try {
        // Load today's entry
        const todayEntry = getTodayMoodEntry();
        if (todayEntry) {
          setTodayMood(todayEntry.mood);
          setTodayNote(todayEntry.note);
        }

        // Load all entries
        const entries = getSortedMoodEntries();
        setAllEntries(entries);
      } catch (error) {
        console.error('Error loading mood data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save effect
  React.useEffect(() => {
    if (isLoading) return;

    const saveEntry = async () => {
      if (todayMood) {
        const success = saveMoodEntry({
          date: getTodayDate(),
          mood: todayMood,
          note: todayNote,
        });

        if (success) {
          // Reload all entries to reflect the change
          const updatedEntries = getSortedMoodEntries();
          setAllEntries(updatedEntries);
          setHasUnsavedChanges(false);
        }
      }
    };

    const debounceTimeout = setTimeout(saveEntry, 500);
    return () => clearTimeout(debounceTimeout);
  }, [todayMood, todayNote, isLoading]);

  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setTodayMood(mood);
    setHasUnsavedChanges(true);
  };

  // Handle note change
  const handleNoteChange = (note: string) => {
    setTodayNote(note);
    setHasUnsavedChanges(true);
  };

  // Clear today's entry
  const handleClearToday = () => {
    setTodayMood('');
    setTodayNote('');
    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl animate-pulse">🌈</div>
              <h2 className="text-xl font-semibold text-gray-700">Loading your mood journal...</h2>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
              <span className="text-4xl sm:text-5xl mr-3">🌈</span>
              Mood Journal
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Track your daily emotions and thoughts
            </p>
            <div className="text-sm text-gray-500 font-medium">
              {todayFormatted}
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Today's Entry Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Today's Entry</h2>
              {(todayMood || todayNote) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearToday}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear Today
                </Button>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <MoodPicker
                selectedMood={todayMood}
                onMoodSelect={handleMoodSelect}
              />
              <NoteInput
                note={todayNote}
                onNoteChange={handleNoteChange}
              />
            </div>

            {/* Save status indicator */}
            <div className="mt-4 flex items-center justify-center">
              {hasUnsavedChanges ? (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <span>Saving changes...</span>
                </div>
              ) : (todayMood || todayNote) ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Entry saved automatically</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  <span>Select a mood to get started</span>
                </div>
              )}
            </div>
          </section>

          {/* History Section */}
          <section>
            <MoodHistory entries={allEntries} />
          </section>

          {/* Footer */}
          <footer className="text-center py-6">
            <Card className="p-4 bg-white/60 border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">💡 Tip:</span> Regular mood tracking can help you identify patterns and improve your emotional wellbeing.
              </p>
            </Card>
          </footer>
        </div>
      </div>
    </div>
  );
}