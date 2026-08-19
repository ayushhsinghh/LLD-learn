export type ClassDiagramDefinition = {
  id: string;
  label: string;
  image: string;
  alt: string;
  reading: string;
  principle: string;
  width?: number;
  height?: number;
};

export const ticTacToeClassDiagrams: ClassDiagramDefinition[] = [
  { id: "player", label: "Player", image: "/images/tic-tac-toe-player-class.png", alt: "Sketch UML diagram of the immutable Player class", reading: "Player keeps a name and one fixed Mark together as stable identity.", principle: "Immutability and cohesion prevent a participant's identity changing during a match." },
  { id: "board", label: "Board", image: "/images/tic-tac-toe-board-class.png", alt: "Sketch UML diagram of the Board class", reading: "Board owns the private grid and every rule that can be answered from cells and coordinates.", principle: "Encapsulation keeps callers from bypassing placement and winning-line validation." },
  { id: "game", label: "Game", image: "/images/tic-tac-toe-game-class.png", alt: "Sketch UML diagram of the Game class", reading: "Game composes one Board and two Players, then coordinates a move from validation to result.", principle: "Single responsibility and composition separate match flow from grid algorithms." },
];

export const parkingLotClassDiagrams: ClassDiagramDefinition[] = [
  { id: "values", label: "Values", image: "/images/parking-lot-values-class.png", alt: "Sketch UML of Parking Lot immutable values", reading: "Vehicle, ticket, selection, and result objects carry completed decisions without exposing mutable parking state.", principle: "Immutability makes accepted inputs and returned facts safe to share." },
  { id: "spot", label: "Spot", image: "/images/parking-lot-spot-class.png", alt: "Sketch UML of ParkingSpot", reading: "ParkingSpot combines its fixed type with the one occupant it validates, stores, and releases.", principle: "Encapsulation keeps compatibility and occupation beside the state they protect." },
  { id: "floor", label: "Floor", image: "/images/parking-lot-floor-class.png", alt: "Sketch UML of ParkingFloor", reading: "ParkingFloor groups spots under one floor number and offers safe lookup and availability reads.", principle: "Cohesion gives the floor a narrow grouping responsibility without global allocation policy." },
  { id: "strategy", label: "Strategy", image: "/images/parking-lot-strategy-class.png", alt: "Sketch UML of SpotAssignmentStrategy", reading: "The Strategy reads floors and returns a SpotSelection; it never occupies a spot or creates a ticket.", principle: "Open/closed design localizes a replaceable ordering rule." },
  { id: "system", label: "System", image: "/images/parking-lot-system-class.png", alt: "Sketch UML of ParkingLot and its collaborators", reading: "ParkingLot composes floors and Strategy while coordinating active tickets and accepted entry or exit.", principle: "Single responsibility separates workflow, selection, grouping, and occupation." },
];

export const movieBookingClassDiagrams: ClassDiagramDefinition[] = [
  { id: "values", label: "Values", image: "/images/movie-ticket-booking-values-class.png", alt: "Sketch UML of Movie Booking immutable values", reading: "Movie, Seat, holds, bookings, and result values preserve facts that should not change after creation.", principle: "Immutability keeps request intent and accepted receipts stable." },
  { id: "physical", label: "Layout", image: "/images/movie-ticket-booking-physical-class.png", alt: "Sketch UML of Screen and physical Seat", reading: "Screen owns the permanent seat layout; it does not store whether A7 is available for a particular show.", principle: "Single responsibility separates physical layout from per-screening availability." },
  { id: "show-seat", label: "ShowSeat", image: "/images/movie-ticket-booking-show-seat-class.png", alt: "Sketch UML of ShowSeat", reading: "ShowSeat owns one seat's AVAILABLE, HELD, and BOOKED transitions plus temporary ownership data.", principle: "Encapsulation prevents callers from setting seat state directly." },
  { id: "show", label: "Show", image: "/images/movie-ticket-booking-show-class.png", alt: "Sketch UML of Show", reading: "Show owns the per-screening seat map and protects group validation and mutation with one lock.", principle: "Thread safety makes the multi-seat invariant atomic inside one process." },
  { id: "service", label: "Service", image: "/images/movie-ticket-booking-service-class.png", alt: "Sketch UML of BookingService", reading: "BookingService finds Shows, creates IDs, stores accepted holds and bookings, and delegates protected seat work.", principle: "Composition and single responsibility keep lookup and indexing outside Show's lock-protected rules." },
];

export const notificationClassDiagrams: ClassDiagramDefinition[] = [
  { id: "values", label: "Values", image: "/images/notification-system-values-class.png", alt: "Sketch UML of notification immutable values", reading: "Requests, receipts, snapshots, and retry limits cross boundaries as stable values.", principle: "Immutability prevents queued content from changing.", width: 1693, height: 929 },
  { id: "job", label: "Job", image: "/images/notification-system-job-class.png", alt: "Sketch UML of DeliveryJob", reading: "DeliveryJob keeps one job's mutable status behind synchronized methods.", principle: "Encapsulation and thread safety protect legal transitions.", width: 1693, height: 929 },
  { id: "senders", label: "Senders", image: "/images/notification-system-senders-class.png", alt: "Sketch UML of NotificationSender implementations", reading: "Each sender implements the same small channel contract.", principle: "Dependency inversion lets the service depend on an interface.", width: 1693, height: 929 },
  { id: "service", label: "Service", image: "/images/notification-system-service-class.png", alt: "Sketch UML of NotificationService", reading: "The service composes jobs, policy, senders, and executor to coordinate delivery.", principle: "Single responsibility keeps provider code outside the workflow.", width: 1693, height: 929 },
  { id: "whole", label: "Whole flow", image: "/images/notification-system-blueprint.png", alt: "Sketch UML of the complete notification system", reading: "The caller receives an ID while a worker updates a private job in the background.", principle: "Composition creates replaceable boundaries without inheritance.", width: 1693, height: 929 },
];

export const meetingRoomClassDiagrams: ClassDiagramDefinition[] = [
  { id: "values", label: "Values", image: "/images/meeting-room-scheduler-values-class.png", alt: "Sketch UML of immutable meeting values", reading: "TimeSlot, request, meeting, and result objects preserve requested and accepted facts.", principle: "Immutability prevents accepted reservations changing later." },
  { id: "room", label: "Room", image: "/images/meeting-room-scheduler-room-class.png", alt: "Sketch UML of Room", reading: "Room owns fixed properties and one ordered, non-overlapping TreeMap schedule.", principle: "Encapsulation protects the schedule invariant." },
  { id: "strategy", label: "Strategy", image: "/images/meeting-room-scheduler-strategy-class.png", alt: "Sketch UML of RoomSelectionStrategy", reading: "Strategy filters qualified rooms and chooses by capacity, then room ID.", principle: "Open/closed design localizes a replaceable selection policy." },
  { id: "scheduler", label: "Scheduler", image: "/images/meeting-room-scheduler-service-class.png", alt: "Sketch UML of MeetingScheduler", reading: "MeetingScheduler composes rooms and Strategy, then owns accepted IDs, lookup, and cancellation workflow.", principle: "Single responsibility separates coordination from interval rules." },
  { id: "all", label: "Relationships", image: "/images/meeting-room-scheduler-blueprint.png", alt: "Sketch UML of the complete Meeting Room Scheduler", reading: "The full model uses composition and keeps each rule beside its information owner.", principle: "Composition avoids an incorrect inheritance hierarchy." },
];

export const rideSharingClassDiagrams: ClassDiagramDefinition[] = [
  { id: "graph", label: "Graph", image: "/images/ride-sharing-graph-class.png", alt: "Sketch UML of Location, Road, Route, and RoadGraph", reading: "Immutable graph values feed RoadGraph adjacency lists.", principle: "Encapsulation keeps map structure read-only to algorithms." },
  { id: "people", label: "People", image: "/images/ride-sharing-people-class.png", alt: "Sketch UML of Rider, Driver, and RideRequest", reading: "Rider and request are immutable; Driver alone owns availability and location.", principle: "Immutability protects intent while cohesion keeps driver state together." },
  { id: "routing", label: "Routing", image: "/images/ride-sharing-routing-class.png", alt: "Sketch UML of Route and RoutingStrategy", reading: "RoutingStrategy turns two graph locations into an optional Route.", principle: "Dependency inversion keeps Dijkstra replaceable." },
  { id: "matching", label: "Ride", image: "/images/ride-sharing-ride-class.png", alt: "Sketch UML of Ride and DriverMatchingStrategy", reading: "Matching returns a Driver and pickup Route; Ride guards accepted lifecycle facts.", principle: "Algorithmic separation keeps selection out of Ride." },
  { id: "service", label: "Service", image: "/images/ride-sharing-service-class.png", alt: "Sketch UML of RideService and all collaborators", reading: "RideService composes graph, strategies, people, and accepted rides.", principle: "Single responsibility makes the service coordinate without traversing roads." },
];
