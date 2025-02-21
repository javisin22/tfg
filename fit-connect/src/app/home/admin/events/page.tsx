'use client';

import { useState, useEffect } from 'react';
import { Search, Check, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { Event } from '../../../../types';

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events whenever searchTerm changes
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchEvents();
    } else {
      setEvents([]); // Clear the list if search is empty
    }
  }, [searchTerm]);

  async function fetchEvents() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search/events?term=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setEvents(data.results || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Toggle selection of an event
  const toggleEventSelection = (ev: Event) => {
    setSelectedEvents((prevSelected) =>
      prevSelected.some((e) => e.id === ev.id) ? prevSelected.filter((e) => e.id !== ev.id) : [...prevSelected, ev]
    );
  };

  const removeSelectedEvent = (ev: Event) => {
    setSelectedEvents((prevSelected) => prevSelected.filter((e) => e.id !== ev.id));
  };

  // Delete selected events
  async function deleteSelectedEvents() {
    if (selectedEvents.length === 0) return;
    const eventIds = selectedEvents.map((ev) => ev.id);

    try {
      const res = await fetch('/api/admin/events/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error deleting events: ${errorData.error || 'Unknown error'}`);
        return;
      }

      // Remove the deleted events from the list
      setEvents((prev) => prev.filter((ev) => !eventIds.includes(ev.id)));
      setSelectedEvents([]);
    } catch (error) {
      console.error('Error deleting events:', error);
    }
  }

  return (
    <div className="p-4 text-white h-[calc(100vh-120px)] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      {/* Search Bar */}
      <div className="relative mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded text-black"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-black" />
      </div>

      {isLoading && <p className="text-gray-300">Loading events...</p>}
      {!isLoading && events.length === 0 && <p className="text-gray-300">No events found.</p>}

      {/* Events List */}
      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded bg-white text-black mb-4">
        {events.map((ev) => {
          const isSelected = selectedEvents.some((e) => e.id === ev.id);
          return (
            <div
              key={ev.id}
              className="flex gap-4 p-4 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => toggleEventSelection(ev)}
            >
              {/* Media Preview */}
              <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0">
                {ev.media ? (
                  <Image
                    src={ev.media}
                    alt={`Event media for ${ev.name}`}
                    fill // fill the parent container
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="h-20 w-20 text-gray-300" />
                )}
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="font-semibold text-black">{ev.name}</div>
                <div className="text-sm text-gray-500">{ev.description?.slice(0, 70) || 'No description'}...</div>
                {ev.date && (
                  <div className="text-xs text-gray-600">
                    Date: {new Date(ev.date).toLocaleDateString()} {new Date(ev.date).toLocaleTimeString()}
                  </div>
                )}
                {ev.location && <div className="text-xs text-gray-600">Location: {ev.location}</div>}
              </div>

              {/* Selection Check Icon */}
              {isSelected && (
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Events */}
      {selectedEvents.length > 0 && (
        <div className="mb-4 bg-white p-4 rounded text-black">
          <h3 className="text-lg font-semibold mb-2">Selected Events</h3>
          <div className="flex flex-wrap gap-2">
            {selectedEvents.map((ev) => (
              <div key={ev.id} className="flex items-center p-2 bg-gray-200 rounded-full">
                <span className="truncate max-w-[200px] mr-1">{ev.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedEvent(ev);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Button */}
      <div className="flex justify-start">
        <button
          onClick={deleteSelectedEvents}
          disabled={selectedEvents.length === 0}
          className={`px-4 py-2 rounded ${
            selectedEvents.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          Delete Selected Events
        </button>
      </div>
    </div>
  );
}
