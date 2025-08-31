'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodEntry, formatDateForDisplay } from '@/lib/moodStorage';

interface ListViewProps {
  entries: MoodEntry[];
  className?: string;
}

export default function ListView({ entries, className = '' }: ListViewProps) {
  const today = new Date().toISOString().split('T')[0];

  if (entries.length === 0) {
    return (
      <Card className={`p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-gray-100 ${className}`}>
        <div className="space-y-3">
          <div className="text-4xl">📝</div>
          <h3 className="text-lg font-medium text-gray-700">No mood entries yet</h3>
          <p className="text-gray-500">Start by logging your mood for today!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Your Mood History</h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {entries.map((entry) => {
            const isToday = entry.date === today;
            const isRecent = (Date.now() - entry.timestamp) < 24 * 60 * 60 * 1000; // Last 24 hours

            return (
              <div
                key={entry.date}
                className={`
                  p-4 rounded-xl border transition-all duration-200 hover:shadow-md
                  ${isToday 
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200 ring-1 ring-purple-200' 
                    : 'bg-white/80 border-purple-100 hover:bg-white'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Mood Emoji */}
                  <div className="flex-shrink-0">
                    <div className={`
                      text-3xl p-2 rounded-full
                      ${isToday ? 'bg-white/60' : 'bg-purple-50'}
                    `}>
                      {entry.mood}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">
                        {formatDateForDisplay(entry.date)}
                      </h4>
                      {isToday && (
                        <Badge className="bg-purple-500 hover:bg-purple-600 text-xs">
                          Today
                        </Badge>
                      )}
                      {isRecent && !isToday && (
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                          Recent
                        </Badge>
                      )}
                    </div>

                    {entry.note && (
                      <p className="text-gray-700 text-sm leading-relaxed break-words">
                        {entry.note}
                      </p>
                    )}

                    {!entry.note && (
                      <p className="text-gray-400 text-sm italic">
                        No note for this day
                      </p>
                    )}

                    <div className="mt-2 text-xs text-gray-500">
                      Logged {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="pt-4 border-t border-purple-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold text-purple-600">
                {entries.length}
              </div>
              <div className="text-xs text-gray-600">Total Entries</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-purple-600">
                {Math.ceil(entries.length / 7)}
              </div>
              <div className="text-xs text-gray-600">Weeks Tracked</div>
            </div>
            <div className="space-y-1 sm:block hidden">
              <div className="text-lg font-semibold text-purple-600">
                {entries.filter(e => e.note.trim()).length}
              </div>
              <div className="text-xs text-gray-600">With Notes</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}