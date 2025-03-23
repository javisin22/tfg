'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Calendar, MapPin, Users, CircleUserRound } from 'lucide-react';
import CreateEventPopup from '../../../components/CreateEventPopup';
import Loading from '../../../components/Loading';
import { useEvents } from '../../../contexts/EventsContext';
import toast from 'react-hot-toast';

export default function EventsScreen() {
  const { events, setEvents, handleEventCreated } = useEvents();
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events/info');
        const { events } = await res.json();
        console.log(events);
        setEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, [setEvents]);

  // Fetch the IDs of events the current user is already a member of
  useEffect(() => {
    async function fetchUserMemberships() {
      try {
        const res = await fetch('/api/events/membership');
        const data = await res.json();
        setJoinedEventIds(data.eventIds || []);
      } catch (error) {
        console.error('Error fetching event memberships:', error);
      }
    }
    fetchUserMemberships();
  }, []);

  const handleJoinEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/join/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success('Te has unido al evento exitosamente.');
        setJoinedEventIds((prev) => [...prev, eventId]);
      } else if (res.status === 400 && data.error === 'Event is full') {
        toast.error('El evento está lleno. No puedes unirte.');
      } else if (res.status === 409 && data.error === 'User is already a member of the event') {
        toast.error('Ya eres miembro de este evento.');
      } else {
        console.error('Error joining event:', data.error);
        toast.error('Ocurrió un error al unirte al evento.');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Ocurrió un error al unirte al evento.');
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/leave/${eventId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Has salido del evento.');
        setJoinedEventIds((prev) => prev.filter((id) => id !== eventId));
      } else {
        console.error('Error leaving event:', data.error);
        toast.error('Ocurrió un error al salir del evento.');
      }
    } catch (error) {
      console.error('Error leaving event:', error);
      toast.error('Ocurrió un error al salir del evento.');
    }
  };

  if (events.length === 0) {
    return <Loading />;
  }

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 md:p-6 overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md p-3 sm:p-4 transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {event.media ? (
              <Image
                src={event.media}
                alt={event.name}
                width={300}
                height={200}
                className="w-full h-32 sm:h-40 md:h-52 object-cover rounded-lg mb-2 sm:mb-4"
              />
            ) : (
              <div className="w-full h-32 sm:h-40 md:h-52 flex flex-col items-center justify-center bg-gray-400 bg-opacity-50 rounded-lg mb-2 sm:mb-4">
                <ImageIcon size={24} className="sm:hidden text-black" />
                <ImageIcon size={36} className="hidden sm:inline md:hidden text-black" />
                <ImageIcon size={48} className="hidden md:inline text-black" />
                <span className="mt-1 sm:mt-2 text-black text-xs sm:text-sm">No Image Available</span>
              </div>
            )}
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1">{event.name}</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-1">
              <Calendar size={14} className="inline-block text-black mr-1" />
              {new Date(event.date).toLocaleDateString()}{' '}
              {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm mb-1">
              <MapPin size={14} className="inline-block text-black mr-1" />
              {event.location}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm mb-1">
              <Users size={14} className="inline-block text-black mr-1" />
              {event.maxParticipants ? `Max Participants: ${event.maxParticipants}` : 'No limit'}
            </p>
            <hr className="my-2 sm:my-3 mx-1 sm:mx-2 border-gray-600" />
            <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-3">{event.description}</p>
            <hr className="my-2 sm:my-3 mx-1 sm:mx-2 border-gray-600" />
            <div className="flex justify-between items-center">
              <div className="text-xs sm:text-sm text-gray-700 flex items-center">
                <CircleUserRound size={14} className="text-black mr-1" />
                <span className="truncate max-w-[120px] sm:max-w-none">Organized by: {event.users.username}</span>
              </div>
              {joinedEventIds.includes(event.id) ? (
                <button
                  onClick={() => handleLeaveEvent(event.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-md"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={() => handleJoinEvent(event.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-md"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white shadow-lg flex items-center justify-center"
        onClick={() => setIsCreatingEvent(true)}
      >
        <Plus size={18} className="sm:hidden" />
        <Plus size={24} className="hidden sm:inline" />
      </button>

      <CreateEventPopup isOpen={isCreatingEvent} onClose={() => setIsCreatingEvent(false)} onEventCreated={handleEventCreated} />
    </div>
  );
}
