'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { MoodEntry } from '@/lib/moodStorage';
import CalendarView from './CalendarView';
import ListView from './ListView';

interface MoodHistoryProps {
  entries: MoodEntry[];
  className?: string;
}

export default function MoodHistory({ entries, className = '' }: MoodHistoryProps) {
  const [activeView, setActiveView] = React.useState<'calendar' | 'list'>('list');

  return (
    <div className={className}>
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'calendar' | 'list')}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Mood History</h2>
          <TabsList className="bg-white/60 border border-gray-200">
            <TabsTrigger 
              value="list"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              <span className="mr-2">📋</span>
              List
            </TabsTrigger>
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800"
            >
              <span className="mr-2">📅</span>
              Calendar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-0">
          <ListView entries={entries} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <CalendarView entries={entries} />
        </TabsContent>
      </Tabs>

      {/* Summary stats when there are entries */}
      {entries.length > 0 && (
        <Card className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-medium text-gray-800">Quick Stats</h3>
                <p className="text-sm text-gray-600">
                  You've been tracking your mood for{' '}
                  <span className="font-semibold text-indigo-600">
                    {Math.max(1, Math.ceil(entries.length / 7))} week{Math.ceil(entries.length / 7) !== 1 ? 's' : ''}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-indigo-600">{entries.length}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">
                Total Entries
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}