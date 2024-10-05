'use client';

export default function EventsScreen() {

    const events = [
        {
            id: 1,
            title: 'Yoga Session',
            date: 'Tomorrow',
            time: '8:00 AM',
            location: 'Central Park',
            description: 'Join us for a relaxing yoga session in Central Park tomorrow morning.',
            image: '/placeholder.svg?height=200&width=400',
        },
        {
            id: 2,
            title: '5K Run',
            date: 'Saturday',
            time: '7:00 AM',
            location: 'Brooklyn Bridge',
            description: 'Get your running shoes ready for a 5K run across the Brooklyn Bridge this weekend.',
            image: '/placeholder.svg?height=200&width=400',
        },
        {
            id: 3,
            title: 'Cycling Club',
            date: 'Sunday',
            time: '9:00 AM',
            location: 'Hudson River Park',
            description: 'Join our cycling club for a scenic ride along the Hudson River Park this Sunday.',
            image: '/placeholder.svg?height=200&width=400',
        },
        {
            id: 4,
            title: 'Hiking Trip',
            date: 'Next Week',
            time: '10:00 AM',
            location: 'Bear Mountain',
            description: 'Embark on an adventurous hiking trip to Bear Mountain next week. Don\'t forget to pack your hiking gear!',
            image: '/placeholder.svg?height=200&width=400',
        },
    ]

    // Grid of events listed in container with image, title, date, time, location, and description
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {events.map((event) => (
                <div key={event.id} className="border rounded-lg shadow-lg p-6">
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h2 className="text-xl font-bold text-primary">{event.title}</h2>
                    <p className="text-gray-400">
                        {event.date} at {event.time} - {event.location}
                    </p>
                    <p className="mt-2">{event.description}</p>
                </div>
            ))}
        </div>
    );
}
