
export type Event = {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    timestamp: number;
    location: string;
    imageUrl: string;
    isImageWhite?: boolean;
  }

const events = [
    {
      "id": 1,
      "title": "Winter Wonderland: A Festive Celebration",
        "description": "Join us for a magical winter wonderland experience filled with holiday cheer, festive decorations, delicious food, and live entertainment.",
      "startDate": "2023-12-25",
      "endDate": "2023-12-28",
      "timestamp": 1640428800000,
      "location": "New York City",
      "imageUrl": "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      "id": 2,
      "title": "Tech Summit: Innovations Shaping the Future",
      "description": "Discover the latest technological advancements and network with industry leaders at this prestigious tech summit.",
      "startDate": "2024-01-15",
      "endDate": "2024-01-18",
      "timestamp": 1642243200000,
      "location": "Los Angeles",
      "imageUrl": "https://images.pexels.com/photos/919734/pexels-photo-919734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      "id": 3,
      "title": "Art Extravaganza: A Celebration of Creativity",
      "description": "Immerse yourself in a vibrant showcase of art from around the world, featuring diverse mediums and styles.",
      "startDate": "2024-02-01",
      "endDate": "2024-02-04",
      "timestamp": 1643678400000,
      "location": "Chicago",
      "imageUrl": "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "isImageWhite": true
    }
  ]

export default events;