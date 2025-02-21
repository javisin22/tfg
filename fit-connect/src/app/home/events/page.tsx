'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Calendar, MapPin, Users, CircleUserRound } from 'lucide-react';
import CreateEventPopup from '../../../components/CreateEventPopup';
import Loading from '../../../components/Loading';
import { useEvents } from '../../../contexts/EventsContext';
import toast from 'react-hot-toast';

export default function EventsScreen() {
  // const [events, setEvents] = useState([]);
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
        // Assume the endpoint returns { eventIds: string[] }
        setJoinedEventIds(data.eventIds || []);
      } catch (error) {
        console.error('Error fetching event memberships:', error);
      }
    }
    fetchUserMemberships();
  }, []);

  // const handleJoinEvent = async (eventId) => {
  //   try {
  //     const res = await fetch(`/api/events/join/${eventId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const data = await res.json();
  //     // 🎃 Change Alerts to Toasts in future (or better display)
  //     if (res.status === 200) {
  //       console.log('Joined event successfully:', data);
  //       alert('You have successfully joined the event.');
  //     } else if (res.status === 400 && data.error === 'Event is full') {
  //       alert('The event is full. You cannot join this event.');
  //     } else if (res.status === 409 && data.error === 'User is already a member of the event') {
  //       alert('You are already a member of this event.');
  //     } else {
  //       console.error('Error joining event:', data.error);
  //       alert('An error occurred while trying to join the event.');
  //     }
  //   } catch (error) {
  //     console.error('Error joining event:', error);
  //   }
  // };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            {event.media ? (
              <Image
                src={event.media}
                alt={event.name}
                width={300}
                height={200}
                className="w-full h-52 object-contain rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-52 flex flex-col items-center justify-center bg-gray-400 bg-opacity-50 rounded-lg mb-4">
                <ImageIcon size={48} className="text-black" />
                <span className="mt-2 text-black">No Image Available</span>
              </div>
            )}
            <h2 className="text-xl font-bold text-black mb-1">{event.name}</h2>
            <p className="text-gray-600 text-sm mb-1">
              <Calendar size={16} className="inline-block text-black mr-1" />
              {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <MapPin size={16} className="inline-block text-black mr-1" />
              {event.location}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              <Users size={16} className="inline-block text-black mr-1" />
              {event.maxParticipants ? `Max Participants: ${event.maxParticipants}` : 'No limit'}
            </p>
            <hr className="my-3 mx-2 border-gray-600" />
            <p className="text-gray-700 text-sm mb-3">{event.description}</p>
            <hr className="my-3 mx-2 border-gray-600" />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700 flex items-center">
                <CircleUserRound size={18} className="text-black mr-1" />
                Organized by: {event.users.username}
              </div>
              {joinedEventIds.includes(event.id) ? (
                <button
                  onClick={() => handleLeaveEvent(event.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-lg"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={() => handleJoinEvent(event.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-lg"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-blue-500 text-white shadow-lg"
          onClick={() => setIsCreatingEvent(true)}
        >
          <Plus size={24} className="inline-block" />
        </button>

        <CreateEventPopup
          isOpen={isCreatingEvent}
          onClose={() => setIsCreatingEvent(false)}
          onEventCreated={handleEventCreated}
        />
      </div>
    </div>
  );
}
