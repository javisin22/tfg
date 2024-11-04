import React, { createContext, useContext, useState } from 'react';

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const handleEventSelected = (selectedEvent) => {
    setEvents((prevEvents) => {
      const filteredEvents = prevEvents.filter((event) => event.id !== selectedEvent.id);
      console.log('New events:', [selectedEvent, ...filteredEvents]);
      return [selectedEvent, ...filteredEvents];
    });
  };

  const handleEventCreated = (event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  return (
    <EventsContext.Provider value={{ events, setEvents, handleEventSelected, handleEventCreated }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
