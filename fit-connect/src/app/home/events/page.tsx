'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Calendar, MapPin, Users, CircleUserRound } from 'lucide-react';
import CreateEventPopup from '../../../components/CreateEventPopup';
import Loading from '../../../components/Loading';
import { useEvents } from '../../../contexts/EventsContext';

export default function EventsScreen() {
  // const [events, setEvents] = useState([]);
  const { events, setEvents, handleEventCreated } = useEvents();
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

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

  const handleJoinEvent = async (eventId) => {
    try {
      const res = await fetch(`/api/events/join/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // 🎃 Change Alerts to Toasts in future (or better display)
      if (res.status === 200) {
        console.log('Joined event successfully:', data);
        alert('You have successfully joined the event.');
      } else if (res.status === 400 && data.error === 'Event is full') {
        alert('The event is full. You cannot join this event.');
      } else if (res.status === 409 && data.error === 'User is already a member of the event') {
        alert('You are already a member of this event.');
      } else {
        console.error('Error joining event:', data.error);
        alert('An error occurred while trying to join the event.');
      }
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  if (events.length === 0) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {events.map((event) => (
        <div key={event.id} className="border rounded-lg shadow-lg p-4">
          {event.media ? (
            <Image
              src={event.media}
              alt={event.name}
              width={300}
              height={200}
              className="w-full h-52 object-contain rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-52 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-lg mb-4">
              <ImageIcon size={48} className="text-white" />
              <span className="ml-2 text-white">No Image Available</span>
            </div>
          )}
          <h2 className="text-xl font-bold text-primary">{event.name}</h2>
          <p className="text-gray-400">
            <Calendar size={16} className="inline-block text-white" /> {event.date}
          </p>
          <p className="text-gray-400">
            <MapPin size={16} className="inline-block text-white" /> {event.location}
          </p>
          <p className="text-gray-400">
            <Users size={16} className="inline-block text-white" />{' '}
            {event.maxParticipants ? `Max Participants: ${event.maxParticipants}` : 'No limit'}
          </p>
          <hr className="my-4 mx-2 border-gray-200" />
          <p className="mt-2">{event.description}</p>
          <hr className="my-4 mx-2 border-gray-200" />
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CircleUserRound size={18} className="text-primary mr-2" />
              Organized by: {event.users.username}
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4" onClick={() => handleJoinEvent(event.id)}>
              Join
            </button>
          </div>{' '}
        </div>
      ))}

      <button
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-blue-500 text-white shadow-lg"
        onClick={() => setIsCreatingEvent(true)}
      >
        <Plus size={24} className="inline-block" />
      </button>

      <CreateEventPopup isOpen={isCreatingEvent} onClose={() => setIsCreatingEvent(false)} onEventCreated={handleEventCreated} />
    </div>
  );
}
