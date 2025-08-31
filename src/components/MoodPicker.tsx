'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface MoodOption {
  emoji: string;
  label: string;
  value: string;
}

const moodOptions: MoodOption[] = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Content', value: 'content' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😢', label: 'Very Sad', value: 'very-sad' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
];

interface MoodPickerProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  className?: string;
}

export default function MoodPicker({ selectedMood, onMoodSelect, className = '' }: MoodPickerProps) {
  const selectedMoodData = moodOptions.find(option => option.emoji === selectedMood);

  return (
    <Card className={`p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100 ${className}`}>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">How are you feeling today?</h3>
          {selectedMoodData && (
            <p className="text-sm text-gray-600">You're feeling {selectedMoodData.label.toLowerCase()}</p>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => onMoodSelect(mood.emoji)}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl
                transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300
                min-h-[60px] sm:min-h-[70px]
                ${selectedMood === mood.emoji 
                  ? 'bg-white shadow-lg ring-2 ring-blue-300 scale-105' 
                  : 'bg-white/60 hover:bg-white hover:shadow-md'
                }
              `}
              aria-label={`Select ${mood.label} mood`}
              type="button"
            >
              <span className="text-2xl sm:text-3xl mb-1">{mood.emoji}</span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {mood.label}
              </span>
              
              {selectedMood === mood.emoji && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </button>
          ))}
        </div>
        
        {!selectedMood && (
          <p className="text-center text-sm text-gray-500 italic">
            Tap an emoji to select your mood
          </p>
        )}
      </div>
    </Card>
  );
}