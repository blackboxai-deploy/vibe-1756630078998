'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NoteInputProps {
  note: string;
  onNoteChange: (note: string) => void;
  className?: string;
}

const MAX_NOTE_LENGTH = 250;

export default function NoteInput({ note, onNoteChange, className = '' }: NoteInputProps) {
  const remainingChars = MAX_NOTE_LENGTH - note.length;
  const isNearLimit = remainingChars <= 20;
  const isAtLimit = remainingChars <= 0;

  return (
    <Card className={`p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-100 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="mood-note" className="text-lg font-medium text-gray-800">
            What's on your mind?
          </Label>
          <span 
            className={`text-sm font-medium transition-colors duration-200 ${
              isAtLimit 
                ? 'text-red-500' 
                : isNearLimit 
                ? 'text-amber-600' 
                : 'text-gray-500'
            }`}
          >
            {remainingChars} left
          </span>
        </div>
        
        <div className="relative">
          <Textarea
            id="mood-note"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Share your thoughts, what happened today, or how you're feeling... (optional)"
            className={`
              min-h-[100px] resize-none border-0 bg-white/80 backdrop-blur-sm 
              placeholder:text-gray-400 text-gray-700 rounded-xl
              focus:ring-2 focus:ring-green-300 focus:bg-white
              transition-all duration-200
              ${isAtLimit ? 'ring-2 ring-red-300' : ''}
            `}
            maxLength={MAX_NOTE_LENGTH}
          />
          
          {/* Subtle border gradient effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-200/20 to-blue-200/20 pointer-events-none -z-10" />
        </div>
        
        {note.trim() && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Note saved automatically</span>
          </div>
        )}
        
        {isNearLimit && !isAtLimit && (
          <p className="text-sm text-amber-600 flex items-center gap-2">
            <span>⚠️</span>
            <span>You're approaching the character limit</span>
          </p>
        )}
        
        {isAtLimit && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <span>🛑</span>
            <span>Character limit reached</span>
          </p>
        )}
      </div>
    </Card>
  );
}