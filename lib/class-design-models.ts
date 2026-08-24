export type ClassDesignMember = {
  name: string;
  purpose: string;
  access?: "Public API" | "Internal";
};

export type ClassDesignClass = {
  id: string;
  name: string;
  responsibility: string;
  requirement: string;
  state: ClassDesignMember[];
  behavior: ClassDesignMember[];
  invariant: string;
  collaborators: string;
  doesNotOwn: string;
  principle: string;
};

export type SupportingDesignType = {
  name: string;
  kind: "Record" | "Interface" | "Implementation" | "Helper";
  purpose: string;
  designNote: string;
};

export type ClassDesignTopic = {
  id: string;
  label: string;
  classes: ClassDesignClass[];
  supportingTypes: SupportingDesignType[];
};

export const ticTacToeClassDesign: ClassDesignTopic = {
  id: "tic-tac-toe",
  label: "Tic-Tac-Toe",
  classes: [
    {
      id: "game",
      name: "Game",
      responsibility: "Coordinates one match without duplicating Board's grid rules.",
      requirement: "Players alternate, moves stop after completion, the winner and status are readable, and reset starts a clean match.",
      state: [
        { name: "Board board", purpose: "Composes the grid owner used by this match." },
        { name: "Player playerX, playerO", purpose: "Keeps the two fixed participants." },
        { name: "Player currentPlayer", purpose: "Remembers whose move is allowed." },
        { name: "Player winner", purpose: "Records the winner when the match completes." },
        { name: "GameStatus status", purpose: "Rejects moves after a win or draw." },
      ],
      behavior: [
        { name: "makeMove(player, row, column)", purpose: "Validates match flow, delegates placement, and resolves the result.", access: "Public API" },
        { name: "reset()", purpose: "Clears Board and restores the initial turn and status.", access: "Public API" },
        { name: "getMark(...) and match reads", purpose: "Expose required state without returning mutable Board.", access: "Public API" },
        { name: "switchPlayer() / finishMatch()", purpose: "Update turn, winner, and status only after an accepted move.", access: "Internal" },
      ],
      invariant: "Only an in-progress match accepts a move, and rejected moves change no match state.",
      collaborators: "Two Player records and one Board.",
      doesNotOwn: "Cell storage, coordinate checks, placement, or winning-line calculations.",
      principle: "Single responsibility and composition keep match flow separate from grid rules.",
    },
    {
      id: "board",
      name: "Board",
      responsibility: "Owns the grid and every rule that can be answered from cells and coordinates.",
      requirement: "A move must be inside the fixed board and target an empty cell; rows, columns, and diagonals determine completion.",
      state: [
        { name: "Mark[][] cells", purpose: "Stores the protected three-by-three grid." },
      ],
      behavior: [
        { name: "place(row, column, mark)", purpose: "Checks coordinates and occupancy before storing a mark.", access: "Public API" },
        { name: "getMark(row, column)", purpose: "Reads one bounded position without exposing the array.", access: "Public API" },
        { name: "hasWinningLine(mark)", purpose: "Checks rows, columns, and diagonals.", access: "Public API" },
        { name: "isFull() / clear()", purpose: "Detects a full grid and restores every cell.", access: "Public API" },
        { name: "isInside(row, column)", purpose: "Keeps coordinate validation beside the grid size.", access: "Internal" },
      ],
      invariant: "Each cell contains at most one mark, and all grid mutation passes through Board.",
      collaborators: "Stores Mark values and reports grid facts to Game.",
      doesNotOwn: "Current player, winner, or overall match status.",
      principle: "Encapsulation prevents callers from bypassing placement rules.",
    },
  ],
  supportingTypes: [
    { name: "Player", kind: "Record", purpose: "Carries a validated name and fixed Mark.", designNote: "Its compact constructor rejects incomplete identity; generated accessors expose stable data with value equality." },
  ],
};

export const parkingLotClassDesign: ClassDesignTopic = {
  id: "parking-lot",
  label: "Parking Lot",
  classes: [
    {
      id: "parking-lot",
      name: "ParkingLot",
      responsibility: "Coordinates entry and exit while keeping ticket and vehicle indexes consistent.",
      requirement: "Park a vehicle once, return a ticket, exit by ticket ID, and leave accepted state unchanged after rejection.",
      state: [
        { name: "List<ParkingFloor> floors", purpose: "Provides the ordered floors available to selection." },
        { name: "SpotAssignmentStrategy strategy", purpose: "Delegates the replaceable ranking rule." },
        { name: "Map<String, ParkingTicket> activeTicketsById", purpose: "Finds the accepted session during exit." },
        { name: "Map<String, String> activeTicketIdByPlate", purpose: "Rejects duplicate vehicle entry." },
        { name: "int nextTicketNumber", purpose: "Allocates deterministic IDs only for accepted parking." },
      ],
      behavior: [
        { name: "park(vehicle)", purpose: "Checks duplication, selects and occupies a spot, then records the ticket.", access: "Public API" },
        { name: "leave(ticketId)", purpose: "Finds the recorded spot, releases it, and removes both indexes.", access: "Public API" },
        { name: "getFloors() / activeTicket(...) ", purpose: "Expose safe read-only views of current state.", access: "Public API" },
        { name: "createTicket(...) / updateIndexes(...) ", purpose: "Record success only after the chosen spot accepts occupation.", access: "Internal" },
      ],
      invariant: "Every active ticket, plate index, and occupied spot describe the same accepted parking session.",
      collaborators: "ParkingFloor, ParkingSpot, SpotAssignmentStrategy, and immutable ticket/result records.",
      doesNotOwn: "Spot compatibility rules or candidate ranking details.",
      principle: "Validation before mutation protects several related indexes as one workflow.",
    },
    {
      id: "parking-floor",
      name: "ParkingFloor",
      responsibility: "Groups the spots belonging to one numbered floor and provides floor-local lookup.",
      requirement: "Selection orders floors by number, and exit must find the recorded spot safely.",
      state: [
        { name: "int number", purpose: "Defines this floor's deterministic priority." },
        { name: "List<ParkingSpot> spots", purpose: "Keeps the floor's validated spot collection." },
      ],
      behavior: [
        { name: "getNumber() / getSpots()", purpose: "Expose the floor number and an unmodifiable spot view.", access: "Public API" },
        { name: "findSpot(spotId)", purpose: "Locates one recorded spot during exit.", access: "Public API" },
      ],
      invariant: "The floor number and spot membership do not change after construction.",
      collaborators: "Contains ParkingSpot objects and is read by the assignment Strategy and ParkingLot.",
      doesNotOwn: "Cross-floor comparison, ticket indexes, or vehicle-session workflow.",
      principle: "Composition groups related spots without moving their occupation state into the floor.",
    },
    {
      id: "parking-spot",
      name: "ParkingSpot",
      responsibility: "Protects compatibility, availability, occupation, and release for one spot.",
      requirement: "Only a compatible vehicle may occupy a free spot, and exit makes that spot reusable.",
      state: [
        { name: "String id", purpose: "Identifies the spot within its floor." },
        { name: "SpotType type", purpose: "Determines which vehicles fit." },
        { name: "Vehicle occupiedBy", purpose: "Stores the current occupant or null when free." },
      ],
      behavior: [
        { name: "canFit(vehicle)", purpose: "Answers compatibility from spot and vehicle types.", access: "Public API" },
        { name: "occupy(vehicle)", purpose: "Rejects incompatible or already occupied requests before mutation.", access: "Public API" },
        { name: "release()", purpose: "Clears the occupant and returns the released vehicle safely.", access: "Public API" },
        { name: "isAvailable() / getVehicle()", purpose: "Expose availability without exposing mutable ownership.", access: "Public API" },
      ],
      invariant: "A spot has at most one compatible occupant.",
      collaborators: "Vehicle and SpotType; ParkingLot invokes mutation after Strategy selection.",
      doesNotOwn: "Floor ordering, cross-floor selection, or ticket creation.",
      principle: "Encapsulation keeps occupation beside the state needed to validate it.",
    },
  ],
  supportingTypes: [
    { name: "Vehicle, SpotSelection, ParkingTicket, ParkingResult", kind: "Record", purpose: "Carry validated request, selection, receipt, and result data.", designNote: "They cross boundaries as stable values and never become a second route to mutate live parking state." },
    { name: "SpotAssignmentStrategy", kind: "Interface", purpose: "Defines read-only selection from floors and a Vehicle.", designNote: "It may return SpotSelection but cannot occupy a spot or issue a ticket." },
    { name: "NearestAvailableSpotStrategy", kind: "Implementation", purpose: "Filters compatible free spots and compares floor, fit, then spot ID.", designNote: "The implementation contains ranking behavior only; ParkingLot retains the accepted-state workflow." },
  ],
};

export const movieBookingClassDesign: ClassDesignTopic = {
  id: "movie-ticket-booking",
  label: "Movie Ticket Booking",
  classes: [
    {
      id: "booking-service",
      name: "BookingService",
      responsibility: "Coordinates show lookup, IDs, accepted holds, and confirmed bookings.",
      requirement: "Callers hold a group, confirm by owner before expiry, query seat state, and receive named rejection results.",
      state: [
        { name: "Map<String, Show> showsById", purpose: "Finds the screening whose seats may change." },
        { name: "Map<String, SeatHold> holdsById", purpose: "Finds accepted holds during confirmation." },
        { name: "Map<String, Booking> bookingsById", purpose: "Keeps completed bookings available for safe reads." },
        { name: "Clock clock", purpose: "Makes expiry decisions deterministic and testable." },
        { name: "Duration holdDuration", purpose: "Defines the confirmed temporary ownership window." },
        { name: "AtomicInteger holdSequence, bookingSequence", purpose: "Allocates unique in-process IDs across concurrent calls." },
      ],
      behavior: [
        { name: "holdSeats(showId, userId, seatIds)", purpose: "Looks up the Show and records a hold only after atomic seat success.", access: "Public API" },
        { name: "confirmHold(holdId, userId)", purpose: "Delegates protected confirmation and records the accepted Booking.", access: "Public API" },
        { name: "seatStates(showId) / booking(id)", purpose: "Expose immutable snapshots and accepted results.", access: "Public API" },
        { name: "allocate IDs / update indexes", purpose: "Record success after Show completes the protected operation.", access: "Internal" },
      ],
      invariant: "Service indexes contain only holds and bookings accepted by the owning Show.",
      collaborators: "Show, SeatHold, Booking, Clock, and named result records.",
      doesNotOwn: "Individual seat transitions, group atomicity, or lock mechanics.",
      principle: "Single responsibility keeps lookup and indexing separate from protected seat state.",
    },
    {
      id: "show",
      name: "Show",
      responsibility: "Owns one screening's seat map, group operations, expiry cleanup, and lock.",
      requirement: "A group hold is all-or-nothing, expires predictably, and cannot race another request for the same screening.",
      state: [
        { name: "Movie movie", purpose: "Identifies what is being screened." },
        { name: "Screen screen", purpose: "Connects the screening to its physical layout." },
        { name: "Instant startTime", purpose: "Records the fixed screening time." },
        { name: "Map<String, ShowSeat> seatsById", purpose: "Owns per-screening seat state." },
        { name: "ReentrantLock lock", purpose: "Protects each multi-seat check-and-change operation." },
      ],
      behavior: [
        { name: "tryHold(...) ", purpose: "Locks, releases expiry, validates every requested seat, then changes all seats.", access: "Public API" },
        { name: "confirmHold(...) ", purpose: "Confirms only live seats owned by the expected hold and user.", access: "Public API" },
        { name: "seatStates(now)", purpose: "Returns an immutable snapshot after expiry cleanup.", access: "Public API" },
        { name: "releaseExpired(now)", purpose: "Returns expired HELD seats to AVAILABLE while the lock is held.", access: "Internal" },
      ],
      invariant: "Group changes are atomic and every ShowSeat transition occurs while this Show owns the critical section.",
      collaborators: "Screen, ShowSeat, SeatHold, and BookingService.",
      doesNotOwn: "Global hold indexes, booking IDs, payment, or cross-show coordination.",
      principle: "Thread safety protects the complete check-then-act unit, not isolated field access.",
    },
    {
      id: "show-seat",
      name: "ShowSeat",
      responsibility: "Owns one physical seat's mutable state for one screening.",
      requirement: "A seat moves from AVAILABLE to HELD to BOOKED, or returns to AVAILABLE after hold expiry.",
      state: [
        { name: "Seat seat", purpose: "Links this state to one physical seat." },
        { name: "SeatState state", purpose: "Stores AVAILABLE, HELD, or BOOKED." },
        { name: "String holdId, heldBy", purpose: "Records temporary ownership while HELD." },
        { name: "Instant expiresAt", purpose: "Defines when temporary ownership ends." },
      ],
      behavior: [
        { name: "placeHold(holdId, userId, expiresAt)", purpose: "Moves an available seat into temporary ownership.", access: "Internal" },
        { name: "confirmHold(holdId, userId)", purpose: "Moves the matching hold to BOOKED after Show checks expiry.", access: "Internal" },
        { name: "releaseIfExpired(now)", purpose: "Restores AVAILABLE and clears hold metadata.", access: "Internal" },
        { name: "state() / isAvailable() / isHeldBy(...) ", purpose: "Provide guarded transition facts to Show.", access: "Internal" },
      ],
      invariant: "State and hold metadata agree: only HELD seats carry an owner and expiry.",
      collaborators: "Show invokes transitions while holding the per-show lock.",
      doesNotOwn: "Group validation, lock acquisition, hold indexes, or booking creation.",
      principle: "Encapsulation turns raw enum changes into guarded state transitions.",
    },
    {
      id: "screen",
      name: "Screen",
      responsibility: "Owns the permanent physical seat layout reused by screenings.",
      requirement: "Physical seat identity and layout remain stable while availability differs for each Show.",
      state: [
        { name: "String id", purpose: "Identifies the physical auditorium." },
        { name: "Map<String, Seat> seatsById", purpose: "Stores the validated permanent layout with unique seat lookup." },
      ],
      behavior: [
        { name: "id() / seats()", purpose: "Expose identity and an immutable seat collection.", access: "Public API" },
        { name: "validate unique seat IDs", purpose: "Prevents an ambiguous physical layout during construction.", access: "Internal" },
      ],
      invariant: "Seat membership and IDs remain fixed and unique after construction.",
      collaborators: "Show creates one ShowSeat per physical Seat.",
      doesNotOwn: "Availability, holds, bookings, or screening time.",
      principle: "Separating stable layout from mutable show state avoids sharing availability across screenings.",
    },
  ],
  supportingTypes: [
    { name: "Movie, Seat, SeatHold, Booking", kind: "Record", purpose: "Carry stable catalog, layout, hold, and booking facts.", designNote: "Validated immutable data can cross thread and service boundaries without exposing mutable Show state." },
    { name: "HoldResult, ConfirmationResult", kind: "Record", purpose: "Return expected success or rejection as named data.", designNote: "Callers can branch on status without exceptions or partially constructed domain state." },
  ],
};

export const notificationClassDesign: ClassDesignTopic = {
  id: "notification-system",
  label: "Notification System",
  classes: [
    {
      id: "notification-service",
      name: "NotificationService",
      responsibility: "Accepts jobs immediately, schedules workers, selects senders, and owns service lifecycle.",
      requirement: "Submission returns a job ID before delivery, jobs run in parallel, failures retry, status is queryable, and shutdown rejects new work.",
      state: [
        { name: "Map<NotificationChannel, NotificationSender> senders", purpose: "Selects channel behavior without service branches." },
        { name: "ConcurrentHashMap<String, DeliveryJob> jobs", purpose: "Publishes accepted jobs safely to querying callers." },
        { name: "ExecutorService executor", purpose: "Runs one worker task per accepted job." },
        { name: "RetryPolicy retryPolicy", purpose: "Defines the total-attempt boundary." },
        { name: "AtomicLong jobSequence", purpose: "Allocates unique IDs across concurrent submissions." },
        { name: "AtomicBoolean accepting", purpose: "Prevents submission after shutdown begins across concurrent callers." },
      ],
      behavior: [
        { name: "submit(request)", purpose: "Validates, indexes QUEUED state, submits work, and returns the receipt.", access: "Public API" },
        { name: "getStatus(jobId)", purpose: "Returns an immutable snapshot or an empty result.", access: "Public API" },
        { name: "close()", purpose: "Stops new submissions and starts graceful executor shutdown.", access: "Public API" },
        { name: "deliver(job)", purpose: "Runs attempts, delegates to the sender, and records terminal state.", access: "Internal" },
      ],
      invariant: "Every returned receipt names an indexed job, and closed services accept no new work.",
      collaborators: "DeliveryJob, NotificationSender registry, RetryPolicy, and ExecutorService.",
      doesNotOwn: "Provider-specific delivery code or mutable per-job transition details.",
      principle: "Dependency inversion and composition separate workflow from channel behavior and infrastructure.",
    },
    {
      id: "delivery-job",
      name: "DeliveryJob",
      responsibility: "Protects one asynchronous job's status, attempt count, and latest failure.",
      requirement: "Callers must see a consistent QUEUED, SENDING, SENT, or FAILED snapshot while a worker updates the job.",
      state: [
        { name: "String jobId", purpose: "Identifies the accepted job." },
        { name: "NotificationRequest request", purpose: "Keeps accepted delivery content immutable." },
        { name: "DeliveryStatus status", purpose: "Stores the current lifecycle state." },
        { name: "int attempts", purpose: "Counts completed delivery attempts." },
        { name: "String lastError", purpose: "Preserves the latest provider failure." },
      ],
      behavior: [
        { name: "startAttempt()", purpose: "Moves QUEUED or retrying work into SENDING.", access: "Internal" },
        { name: "recordAttemptFailure(message)", purpose: "Increments the completed attempt count and records the error.", access: "Internal" },
        { name: "markSent() / markFailed()", purpose: "Enter a terminal state that cannot be changed again.", access: "Internal" },
        { name: "snapshot()", purpose: "Returns consistent immutable status data to callers.", access: "Public API" },
      ],
      invariant: "Status, attempts, and error are observed together, and SENT or FAILED never transitions again.",
      collaborators: "One worker in NotificationService and immutable DeliverySnapshot values.",
      doesNotOwn: "Sender selection, retry policy, executor lifecycle, or provider delivery.",
      principle: "Synchronized transitions provide encapsulation and visibility for related mutable fields.",
    },
  ],
  supportingTypes: [
    { name: "NotificationRequest, SubmissionReceipt, DeliverySnapshot, RetryPolicy", kind: "Record", purpose: "Carry validated immutable request, receipt, snapshot, and attempt-policy data.", designNote: "Stable values can cross caller and worker threads without exposing mutable DeliveryJob state." },
    { name: "NotificationSender", kind: "Interface", purpose: "Defines channel() and one provider delivery attempt.", designNote: "The service registry depends on this contract and contains no EMAIL, SMS, or PUSH branches." },
    { name: "EmailSender, SmsSender, PushSender", kind: "Implementation", purpose: "Own provider-specific delivery for one channel each.", designNote: "They do not retry, index jobs, or change service lifecycle." },
    { name: "DeliveryException", kind: "Helper", purpose: "Represents an expected provider-attempt failure.", designNote: "The worker catches it and lets RetryPolicy decide whether another attempt is allowed." },
  ],
};

export const meetingRoomClassDesign: ClassDesignTopic = {
  id: "meeting-room-scheduler",
  label: "Meeting Room Scheduler",
  classes: [
    {
      id: "meeting-scheduler",
      name: "MeetingScheduler",
      responsibility: "Coordinates deterministic room selection, accepted meetings, IDs, and cancellation.",
      requirement: "Schedule the smallest qualified room, cancel only for the owner, and leave accepted state unchanged after rejection.",
      state: [
        { name: "List<Room> rooms", purpose: "Provides the immutable selection candidates." },
        { name: "Map<String, Room> roomsById", purpose: "Finds the assigned room during cancellation and reads." },
        { name: "Map<String, Meeting> meetingsById", purpose: "Finds accepted meetings by ID." },
        { name: "RoomSelectionStrategy strategy", purpose: "Delegates replaceable qualification and comparison." },
        { name: "int nextMeetingNumber", purpose: "Allocates IDs only after a room can be reserved." },
      ],
      behavior: [
        { name: "schedule(request)", purpose: "Selects a Room, constructs a Meeting, reserves it, then indexes success.", access: "Public API" },
        { name: "cancel(meetingId, organizerId)", purpose: "Checks existence and ownership before removing from Room and index.", access: "Public API" },
        { name: "meetingsForRoom(roomId)", purpose: "Returns a safe ordered meeting view.", access: "Public API" },
        { name: "validate model / advance ID", purpose: "Keep duplicate rooms and rejected ID consumption out of accepted state.", access: "Internal" },
      ],
      invariant: "The meeting index and each Room schedule contain the same accepted reservations.",
      collaborators: "Room, RoomSelectionStrategy, MeetingRequest, Meeting, and ScheduleResult.",
      doesNotOwn: "Interval overlap, room suitability, or direct TreeMap mutation.",
      principle: "Validation before mutation keeps IDs, indexes, and room schedules consistent.",
    },
    {
      id: "room",
      name: "Room",
      responsibility: "Protects suitability and a non-overlapping ordered schedule for one room.",
      requirement: "A room must satisfy capacity and equipment, accept touching meetings, and reject overlapping reservations.",
      state: [
        { name: "String id, name", purpose: "Identify the room in results and deterministic ties." },
        { name: "int capacity", purpose: "Reject requests with too many attendees." },
        { name: "Set<Equipment> equipment", purpose: "Checks every requested capability." },
        { name: "TreeMap<LocalDateTime, Meeting> schedule", purpose: "Keeps meetings ordered for neighbour lookup." },
      ],
      behavior: [
        { name: "canHost(request)", purpose: "Combines capacity, equipment, and availability checks.", access: "Public API" },
        { name: "isAvailable(slot)", purpose: "Checks only floorEntry and ceilingEntry for overlap.", access: "Public API" },
        { name: "reserve(meeting)", purpose: "Revalidates before inserting an accepted Meeting.", access: "Public API" },
        { name: "remove(meeting)", purpose: "Removes the exact accepted reservation from its start-time entry.", access: "Public API" },
        { name: "meetings()", purpose: "Returns an immutable ordered snapshot.", access: "Public API" },
      ],
      invariant: "Every stored meeting fits the room and no two stored TimeSlots overlap.",
      collaborators: "MeetingRequest, Meeting, TimeSlot, and RoomSelectionStrategy.",
      doesNotOwn: "Cross-room selection, meeting IDs, or cancellation ownership.",
      principle: "Encapsulation protects the TreeMap invariant and prevents mutable schedule escape.",
    },
  ],
  supportingTypes: [
    { name: "TimeSlot, MeetingRequest, Meeting, ScheduleResult", kind: "Record", purpose: "Carry validated interval, intent, accepted reservation, and outcome data.", designNote: "TimeSlot owns half-open overlap reasoning while the other records remain stable boundary values." },
    { name: "RoomSelectionStrategy", kind: "Interface", purpose: "Defines how qualified rooms are compared.", designNote: "It reads Rooms and returns a choice; it cannot reserve or mutate a schedule." },
    { name: "SmallestSuitableRoomStrategy", kind: "Implementation", purpose: "Filters suitability and chooses capacity then room ID.", designNote: "The comparator makes equal candidates deterministic without moving workflow into the Strategy." },
  ],
};

export const rideSharingClassDesign: ClassDesignTopic = {
  id: "ride-sharing",
  label: "Ride Sharing",
  classes: [
    {
      id: "ride-service",
      name: "RideService",
      responsibility: "Coordinates validation, routing, matching, IDs, and accepted lifecycle actions.",
      requirement: "A request succeeds only when the trip and pickup routes exist and an available driver can be assigned.",
      state: [
        { name: "RoadGraph graph", purpose: "Provides the road model to both algorithms." },
        { name: "Map<String, Rider> ridersById", purpose: "Validates registered rider identity." },
        { name: "List<Driver> drivers", purpose: "Provides the matching candidates." },
        { name: "Map<String, Ride> ridesById", purpose: "Finds accepted rides for lifecycle actions." },
        { name: "RoutingStrategy routing", purpose: "Calculates one route without embedding Dijkstra in the service." },
        { name: "DriverMatchingStrategy matching", purpose: "Chooses a reachable available driver." },
        { name: "int nextRideNumber", purpose: "Allocates IDs only for accepted matches." },
      ],
      behavior: [
        { name: "requestRide(request)", purpose: "Proves the trip, finds a driver, then assigns and records the Ride.", access: "Public API" },
        { name: "startRide(rideId)", purpose: "Delegates the guarded MATCHED to IN_PROGRESS transition.", access: "Public API" },
        { name: "completeRide(rideId)", purpose: "Completes the Ride and releases the Driver at the destination.", access: "Public API" },
        { name: "ride(id) / drivers()", purpose: "Expose safe current-state reads.", access: "Public API" },
      ],
      invariant: "Driver and Ride mutate only after trip routing and pickup matching both succeed.",
      collaborators: "RoadGraph, both Strategy interfaces, Rider, Driver, Ride, and result records.",
      doesNotOwn: "Graph traversal, pickup comparison details, or direct lifecycle field changes.",
      principle: "Dependency inversion separates orchestration from algorithms that may vary.",
    },
    {
      id: "road-graph",
      name: "RoadGraph",
      responsibility: "Owns validated locations and directed outgoing-road adjacency.",
      requirement: "Routes follow known directed roads with positive travel-time weights.",
      state: [
        { name: "Map<String, Location> locations", purpose: "Validates route endpoints and edge targets." },
        { name: "Map<String, List<Road>> outgoing", purpose: "Stores each node's directed adjacency list." },
      ],
      behavior: [
        { name: "addLocation(location)", purpose: "Registers a unique graph node.", access: "Public API" },
        { name: "addDirectedRoad(...) / addTwoWayRoad(...) ", purpose: "Validate endpoints and add positive directed edges.", access: "Public API" },
        { name: "containsLocation(id)", purpose: "Answers endpoint validation without exposing maps.", access: "Public API" },
        { name: "roadsFrom(locationId)", purpose: "Returns an immutable adjacency view to RoutingStrategy.", access: "Public API" },
      ],
      invariant: "Every road has known endpoints and a positive weight; mutable adjacency collections never escape.",
      collaborators: "Location and Road records; RoutingStrategy reads the graph.",
      doesNotOwn: "Shortest-path traversal, driver eligibility, matching, or ride state.",
      principle: "Single responsibility keeps graph storage separate from graph algorithms.",
    },
    {
      id: "driver",
      name: "Driver",
      responsibility: "Protects one driver's current location and assignment availability.",
      requirement: "Only AVAILABLE drivers may be matched, and completion moves the driver to the ride destination.",
      state: [
        { name: "String id, name", purpose: "Provide stable driver identity and deterministic tie-breaking." },
        { name: "String currentLocationId", purpose: "Supplies the pickup-route starting node." },
        { name: "DriverStatus status", purpose: "Prevents a busy driver from receiving another Ride." },
      ],
      behavior: [
        { name: "assign()", purpose: "Moves an AVAILABLE driver to BUSY.", access: "Internal" },
        { name: "completeAt(destinationId)", purpose: "Updates location and restores AVAILABLE after completion.", access: "Internal" },
        { name: "id() / currentLocationId() / status()", purpose: "Expose matching facts without public setters.", access: "Public API" },
      ],
      invariant: "A driver is assigned only while AVAILABLE and becomes available only after valid completion.",
      collaborators: "DriverMatchingStrategy reads it; RideService coordinates its guarded mutations with Ride.",
      doesNotOwn: "Route calculation, driver comparison, ride IDs, or Ride lifecycle.",
      principle: "Encapsulation prevents callers from directly claiming or relocating a driver.",
    },
    {
      id: "ride",
      name: "Ride",
      responsibility: "Owns the accepted routes and guarded MATCHED, IN_PROGRESS, and COMPLETED lifecycle.",
      requirement: "An accepted match may start once, complete only after starting, and never leave a terminal state.",
      state: [
        { name: "String id", purpose: "Identifies the accepted ride." },
        { name: "Rider rider", purpose: "Records who requested the ride." },
        { name: "Driver driver", purpose: "Records the assigned driver." },
        { name: "Route pickupRoute, tripRoute", purpose: "Preserves both accepted route decisions." },
        { name: "RideStatus status", purpose: "Stores the guarded lifecycle state." },
      ],
      behavior: [
        { name: "start()", purpose: "Allows only MATCHED to become IN_PROGRESS.", access: "Internal" },
        { name: "complete()", purpose: "Allows only IN_PROGRESS to become COMPLETED.", access: "Internal" },
        { name: "identity, route, and status reads", purpose: "Expose accepted facts without setters.", access: "Public API" },
      ],
      invariant: "Lifecycle transitions occur in order and accepted route facts never change.",
      collaborators: "Rider, Driver, Route, and RideService.",
      doesNotOwn: "Driver search, Dijkstra, assignment coordination, or payment.",
      principle: "Guarded enum transitions provide a small cohesive lifecycle without State classes.",
    },
  ],
  supportingTypes: [
    { name: "Location, Road, Route, Rider, RideRequest, DriverMatch, MatchResult", kind: "Record", purpose: "Carry stable graph, request, route, match, and outcome data.", designNote: "Immutable values prevent accepted endpoints and paths from changing underneath matching or Ride." },
    { name: "RoutingStrategy", kind: "Interface", purpose: "Defines optional route(graph, start, target) behavior.", designNote: "Dijkstra is one implementation; RoadGraph remains the data owner." },
    { name: "DijkstraRoutingStrategy", kind: "Implementation", purpose: "Calculates the cheapest positive-weight route with a priority queue.", designNote: "It reads graph adjacency and returns Route without modifying graph or driver state." },
    { name: "DriverMatchingStrategy", kind: "Interface", purpose: "Defines comparison of reachable available drivers.", designNote: "It reuses RoutingStrategy for pickup routes and cannot assign the winning Driver." },
    { name: "NearestDriverMatchingStrategy", kind: "Implementation", purpose: "Filters BUSY or unreachable drivers and compares pickup minutes then ID.", designNote: "RideService performs mutation only after this implementation returns DriverMatch." },
  ],
};

export const elevatorClassDesign: ClassDesignTopic = {
  id: "elevator",
  label: "Elevator",
  classes: [
    {
      id: "elevator-controller",
      name: "ElevatorController",
      responsibility: "Coordinates hall calls and advances the fleet without calculating a car's movement itself.",
      requirement: "A passenger can request a car, a replaceable rule selects one elevator, and the system advances predictably.",
      state: [
        { name: "int minFloor, maxFloor", purpose: "Validates every hall call and destination." },
        { name: "List<Elevator> elevators", purpose: "Stores the fleet compared for hall calls." },
        { name: "DispatchStrategy dispatchStrategy", purpose: "Delegates the replaceable car-selection rule." },
      ],
      behavior: [
        { name: "requestElevator(floor, direction)", purpose: "Creates a hall Request, selects a car, and adds the stop.", access: "Public API" },
        { name: "selectDestination(elevatorId, floor)", purpose: "Adds a validated inside-car destination to one known Elevator.", access: "Public API" },
        { name: "tick()", purpose: "Asks every Elevator to advance one deterministic step.", access: "Public API" },
        { name: "getElevators()", purpose: "Exposes an unmodifiable fleet view for display and tests.", access: "Public API" },
        { name: "findElevator(...) / isValidFloor(...) ", purpose: "Keep lookup and building-bound checks inside the controller.", access: "Internal" },
      ],
      invariant: "Every accepted hall call is assigned through the configured Strategy to a known Elevator.",
      collaborators: "Elevator, Request, and DispatchStrategy.",
      doesNotOwn: "A car's current floor, direction, stop ordering, or movement rules.",
      principle: "Strategy and composition separate fleet coordination from car movement and selection policy.",
    },
    {
      id: "elevator",
      name: "Elevator",
      responsibility: "Protects one car's position, direction, and pending stops.",
      requirement: "A car accepts pickup and destination requests, moves one floor per tick, stops, reverses, or becomes idle.",
      state: [
        { name: "int id", purpose: "Identifies the car during selection and display." },
        { name: "int minFloor, maxFloor", purpose: "Keep movement and requests within building bounds." },
        { name: "int currentFloor", purpose: "Stores the car's current building position." },
        { name: "Direction direction", purpose: "Stores UP, DOWN, or IDLE movement state." },
        { name: "Set<Request> requests", purpose: "Keeps validated pending stops without duplicates." },
      ],
      behavior: [
        { name: "addRequest(request)", purpose: "Adds a validated hall or car stop.", access: "Public API" },
        { name: "tick()", purpose: "Stops, moves, reverses, or becomes idle from current requests.", access: "Public API" },
        { name: "getCurrentFloor() / getDirection() / getRequests()", purpose: "Expose selection facts and immutable pending work.", access: "Public API" },
        { name: "serveCurrentFloor() / hasRequestAhead(...) / directionToNearestRequest()", purpose: "Keep movement decisions beside position and pending stops.", access: "Internal" },
      ],
      invariant: "The car stays within building bounds and its direction agrees with the next pending movement.",
      collaborators: "Request and Direction; ElevatorController issues commands and reads selection facts.",
      doesNotOwn: "Fleet comparison or assignment of hall calls to another car.",
      principle: "Encapsulation keeps movement rules beside the state they inspect and change.",
    },
  ],
  supportingTypes: [
    { name: "Request", kind: "Record", purpose: "Carries a validated floor and request type.", designNote: "Generated equality lets the pending set remove duplicate requests naturally." },
    { name: "DispatchStrategy", kind: "Interface", purpose: "Defines selection from the fleet for one hall call.", designNote: "The controller depends on the contract while Elevator remains unchanged when dispatch policy varies." },
    { name: "DirectionAwareDispatchStrategy", kind: "Implementation", purpose: "Prefers nearby cars already moving toward the caller.", designNote: "It only selects; it does not mutate a car or store fleet state." },
  ],
};

export const splitwiseClassDesign: ClassDesignTopic = {
  id: "splitwise",
  label: "Splitwise",
  classes: [
    {
      id: "expense-service",
      name: "ExpenseService",
      responsibility: "Coordinates user validation, split calculation, accepted expense history, balances, and settlement.",
      requirement: "Record valid expenses without partial state, return balances and simplification, and settle no more than is owed.",
      state: [
        { name: "Map<String, User> usersById", purpose: "Rejects unknown payers and participants." },
        { name: "Map<SplitType, SplitStrategy> strategies", purpose: "Selects the confirmed split algorithm." },
        { name: "BalanceSheet balanceSheet", purpose: "Delegates every live debt mutation to its owner." },
        { name: "DebtSimplifier simplifier", purpose: "Calculates a read-only alternative payment view." },
        { name: "List<Expense> expenses", purpose: "Stores accepted expense history." },
        { name: "int nextExpenseNumber", purpose: "Allocates IDs only after complete split validation." },
      ],
      behavior: [
        { name: "recordExpense(...) ", purpose: "Validates users and shares completely before creating history or debt.", access: "Public API" },
        { name: "balances() / simplifiedDebts()", purpose: "Returns current and simplified read-only debt views.", access: "Public API" },
        { name: "settle(...) ", purpose: "Delegates a guarded payment to BalanceSheet.", access: "Public API" },
        { name: "select strategy / allocate ID", purpose: "Performs internal workflow only after expected failures are resolved.", access: "Internal" },
      ],
      invariant: "Expense history, accepted IDs, and pairwise balances change together only after full validation.",
      collaborators: "SplitStrategy, BalanceSheet, DebtSimplifier, User, Expense, and result enums.",
      doesNotOwn: "Split arithmetic, signed debt netting, or simplification calculations.",
      principle: "Orchestration stays thin by delegating each financial rule to its information owner.",
    },
    {
      id: "balance-sheet",
      name: "BalanceSheet",
      responsibility: "Owns current pairwise debt, opposite-direction netting, and settlement limits.",
      requirement: "Opposite debts cancel into one direction, zero balances disappear, and settlement cannot exceed the current debt.",
      state: [
        { name: "Map<PairKey, Long> signedByPair", purpose: "Stores one signed cent value for each sorted user pair." },
      ],
      behavior: [
        { name: "addDebt(debtor, creditor, amount)", purpose: "Converts a share into a signed pair delta and nets it.", access: "Internal" },
        { name: "settle(debtor, creditor, amount)", purpose: "Rejects unknown or excessive payments before reducing debt.", access: "Public API" },
        { name: "balances()", purpose: "Converts signed storage into readable directed Debt records.", access: "Public API" },
        { name: "addDebt(...) signed merge", purpose: "Removes zero pairs and preserves one direction per pair inside the accepted mutation.", access: "Internal" },
      ],
      invariant: "Each unordered user pair has at most one non-zero directed debt represented in whole cents.",
      collaborators: "ExpenseService writes accepted shares; DebtSimplifier reads immutable Debt records.",
      doesNotOwn: "User validation, split calculation, expense history, or simplified-route mutation.",
      principle: "Encapsulation and exact integer money protect the ledger's financial invariant.",
    },
  ],
  supportingTypes: [
    { name: "Money, User, Expense, Debt", kind: "Record", purpose: "Carry exact cents, identity, accepted history, and readable balances.", designNote: "Value equality and immutable components make financial calculations and tests deterministic." },
    { name: "SplitStrategy", kind: "Interface", purpose: "Defines complete share calculation for one SplitType.", designNote: "It returns a validated share map and cannot mutate BalanceSheet or history." },
    { name: "EqualSplitStrategy, ExactSplitStrategy, PercentageSplitStrategy", kind: "Implementation", purpose: "Own the three current share algorithms and their input rules.", designNote: "ExpenseService selects them from an EnumMap without branching through each formula." },
    { name: "DebtSimplifier", kind: "Helper", purpose: "Reads current Debt values and suggests a smaller payment route.", designNote: "It never writes the simplified result back because simplification preserves net position, not original history." },
  ],
};
