export type EntityModelItem = {
  name: string;
  kind: "Class" | "Record" | "Interface";
  purpose: string;
};

export type EntitySupportingItem = {
  name: string;
  purpose: string;
};

export type EntityModel = {
  items: EntityModelItem[];
  enums: EntitySupportingItem[];
  fields: EntitySupportingItem[];
  infrastructure?: EntitySupportingItem[];
  omitted: string[];
  relationship: string;
  rationale: string;
};

export const ticTacToeEntityModel: EntityModel = {
  items: [
    { name: "Game", kind: "Class", purpose: "Coordinates turns, match status, winner, and reset." },
    { name: "Board", kind: "Class", purpose: "Owns cells, placement checks, and winning lines." },
    { name: "Player", kind: "Record", purpose: "Carries one player's validated name and fixed mark." },
  ],
  enums: [
    { name: "Mark", purpose: "Limits a cell to X, O, or empty." },
    { name: "GameStatus", purpose: "Names whether the match is active, won, or drawn." },
    { name: "MoveResult", purpose: "Explains why a move succeeded or was rejected." },
  ],
  fields: [
    { name: "cells", purpose: "Stores the current Mark grid inside Board." },
    { name: "row", purpose: "Identifies the selected horizontal position." },
    { name: "column", purpose: "Identifies the selected vertical position." },
  ],
  omitted: ["Cell class", "WinningRule"],
  relationship: "Game coordinates two Players and one Board; Board protects every rule that needs cell state.",
  rationale: "A cell is only a Mark stored by Board, while row and column are simple move inputs. Cell and WinningRule would add names without adding a new responsibility because the board and winning rule are fixed in this version.",
};

export const parkingLotEntityModel: EntityModel = {
  items: [
    { name: "Vehicle", kind: "Record", purpose: "Carries the plate and vehicle type together." },
    { name: "ParkingSpot", kind: "Class", purpose: "Owns compatibility, availability, occupation, and release." },
    { name: "ParkingFloor", kind: "Class", purpose: "Groups and locates spots on one numbered floor." },
    { name: "ParkingLot", kind: "Class", purpose: "Coordinates entry, tickets, indexes, and exit." },
    { name: "ParkingTicket", kind: "Record", purpose: "Records the accepted vehicle-to-spot assignment." },
    { name: "SpotAssignmentStrategy", kind: "Interface", purpose: "Keeps the candidate ranking policy replaceable." },
    { name: "SpotSelection", kind: "Record", purpose: "Returns the selected floor and spot together." },
    { name: "ParkingResult", kind: "Record", purpose: "Returns a named status and optional ticket." },
  ],
  enums: [
    { name: "VehicleType", purpose: "Names the supported vehicle categories." },
    { name: "SpotType", purpose: "Names spot sizes and their compatibility rules." },
    { name: "ParkingStatus", purpose: "Explains the result of an entry request." },
    { name: "ExitStatus", purpose: "Explains the result of an exit request." },
  ],
  fields: [
    { name: "plate", purpose: "Identifies a vehicle and prevents duplicate entry." },
    { name: "floorNumber", purpose: "Orders floors during nearest-spot selection." },
    { name: "spotId", purpose: "Identifies one spot within a floor." },
    { name: "ticketId", purpose: "Finds the accepted parking session during exit." },
  ],
  omitted: ["gate hardware", "payment", "address"],
  relationship: "ParkingLot coordinates floors, delegates ranking to SpotAssignmentStrategy, and lets each ParkingSpot own occupation.",
  rationale: "Plate and IDs remain simple values inside the objects that use them. Gate hardware, payment, and address add no rule to the confirmed entry-and-exit workflow, so separate classes would only enlarge the first model.",
};

export const movieBookingEntityModel: EntityModel = {
  items: [
    { name: "Movie", kind: "Record", purpose: "Keeps a movie's stable ID and title." },
    { name: "Seat", kind: "Record", purpose: "Identifies one permanent physical seat." },
    { name: "Screen", kind: "Class", purpose: "Owns the permanent physical seat layout." },
    { name: "ShowSeat", kind: "Class", purpose: "Owns one seat's state for one screening." },
    { name: "Show", kind: "Class", purpose: "Protects group seat changes and the per-show lock." },
    { name: "SeatHold", kind: "Record", purpose: "Records an accepted temporary seat claim." },
    { name: "Booking", kind: "Record", purpose: "Records a completed confirmation." },
    { name: "BookingService", kind: "Class", purpose: "Coordinates lookup, IDs, holds, and bookings." },
    { name: "HoldResult", kind: "Record", purpose: "Returns a hold status and accepted hold." },
    { name: "ConfirmationResult", kind: "Record", purpose: "Returns a confirmation status and booking." },
  ],
  enums: [
    { name: "SeatState", purpose: "Limits a show seat to AVAILABLE, HELD, or BOOKED." },
    { name: "HoldStatus", purpose: "Explains the result of a hold request." },
    { name: "ConfirmationStatus", purpose: "Explains the result of confirming a hold." },
  ],
  fields: [
    { name: "userId", purpose: "Identifies who owns a temporary hold." },
    { name: "showId", purpose: "Finds the screening whose seats may change." },
    { name: "startTime", purpose: "Places a Show at a fixed screening time." },
    { name: "expiresAt", purpose: "Defines when a held seat becomes available again." },
  ],
  omitted: ["User class", "Payment", "Refund"],
  relationship: "Screen owns physical Seats; Show owns per-screening ShowSeats; BookingService records accepted holds and bookings.",
  rationale: "User identity and time boundaries are simple fields on the values that need them. Profiles, payment, and refunds do not participate in the confirmed hold-and-confirm workflow, so modeling them now would distract from seat ownership and concurrency.",
};

export const notificationEntityModel: EntityModel = {
  items: [
    { name: "NotificationRequest", kind: "Record", purpose: "Preserves the validated content accepted for delivery." },
    { name: "DeliveryJob", kind: "Class", purpose: "Owns one job's status, attempts, and latest failure." },
    { name: "NotificationSender", kind: "Interface", purpose: "Defines one replaceable channel delivery attempt." },
    { name: "EmailSender", kind: "Class", purpose: "Owns EMAIL provider-specific delivery behavior." },
    { name: "SmsSender", kind: "Class", purpose: "Owns SMS provider-specific delivery behavior." },
    { name: "PushSender", kind: "Class", purpose: "Owns PUSH provider-specific delivery behavior." },
    { name: "RetryPolicy", kind: "Record", purpose: "Names and validates the total-attempt boundary." },
    { name: "NotificationService", kind: "Class", purpose: "Coordinates submission, indexing, workers, and lifecycle." },
    { name: "SubmissionReceipt", kind: "Record", purpose: "Returns the accepted job ID immediately." },
    { name: "DeliverySnapshot", kind: "Record", purpose: "Exposes progress without leaking the mutable job." },
  ],
  enums: [
    { name: "NotificationChannel", purpose: "Limits delivery to EMAIL, SMS, or PUSH." },
    { name: "DeliveryStatus", purpose: "Names the lifecycle of one asynchronous job." },
  ],
  fields: [
    { name: "jobId", purpose: "Lets callers query one accepted delivery job." },
    { name: "recipientId", purpose: "Identifies the notification recipient." },
    { name: "destination", purpose: "Stores the email address, phone number, or device target." },
    { name: "subject", purpose: "Carries optional channel content." },
    { name: "body", purpose: "Carries the mandatory message content." },
    { name: "attempts", purpose: "Counts completed delivery attempts." },
    { name: "lastError", purpose: "Preserves the latest provider failure for status queries." },
  ],
  infrastructure: [
    { name: "ExecutorService", purpose: "Runs accepted delivery jobs on worker threads." },
    { name: "worker queue", purpose: "Holds in-memory tasks waiting for a worker." },
  ],
  omitted: ["recipient profile", "template", "preferences", "domain queue"],
  relationship: "NotificationService schedules one DeliveryJob and delegates each attempt to the registered NotificationSender.",
  rationale: "Recipient and message details remain fields in NotificationRequest, while the executor queue is infrastructure rather than a domain object. Profiles, templates, preferences, and a durable queue have no behavior in the local first version.",
};

export const meetingRoomEntityModel: EntityModel = {
  items: [
    { name: "TimeSlot", kind: "Record", purpose: "Validates boundaries and owns overlap reasoning." },
    { name: "MeetingRequest", kind: "Record", purpose: "Carries one organizer's scheduling intent." },
    { name: "Meeting", kind: "Record", purpose: "Records one accepted room reservation." },
    { name: "Room", kind: "Class", purpose: "Owns suitability and its ordered schedule." },
    { name: "RoomSelectionStrategy", kind: "Interface", purpose: "Keeps deterministic room choice replaceable." },
    { name: "MeetingScheduler", kind: "Class", purpose: "Coordinates selection, IDs, indexing, and cancellation." },
    { name: "ScheduleResult", kind: "Record", purpose: "Returns a named scheduling outcome." },
  ],
  enums: [
    { name: "Equipment", purpose: "Names the room capabilities a request may require." },
    { name: "ScheduleStatus", purpose: "Explains the result of scheduling a meeting." },
    { name: "CancellationStatus", purpose: "Explains the result of cancelling a meeting." },
  ],
  fields: [
    { name: "organizerId", purpose: "Identifies who may cancel an accepted meeting." },
    { name: "attendeeCount", purpose: "Defines the minimum room capacity required." },
    { name: "roomId", purpose: "Identifies the room assigned to a meeting." },
    { name: "meetingId", purpose: "Finds an accepted meeting for later operations." },
  ],
  infrastructure: [
    { name: "Room TreeMap schedule", purpose: "Keeps meetings ordered by start time for neighbour checks." },
  ],
  omitted: ["Calendar class", "Organizer class", "Attendee class"],
  relationship: "MeetingScheduler delegates selection to RoomSelectionStrategy while each Room protects its own ordered schedule.",
  rationale: "Organizer identity and attendee count are sufficient fields for the current rules, and Room already owns the only calendar needed. Separate Calendar, Organizer, or Attendee classes would have no independent behavior in this scope.",
};

export const rideSharingEntityModel: EntityModel = {
  items: [
    { name: "RoadGraph", kind: "Class", purpose: "Owns locations and directed adjacency lists." },
    { name: "Driver", kind: "Class", purpose: "Owns availability and current location." },
    { name: "Ride", kind: "Class", purpose: "Owns accepted routes and lifecycle." },
    { name: "RideService", kind: "Class", purpose: "Coordinates validation, matching, IDs, and state changes." },
    { name: "Location", kind: "Record", purpose: "Identifies one stable node in the road graph." },
    { name: "Road", kind: "Record", purpose: "Describes one directed road and its positive travel time." },
    { name: "Route", kind: "Record", purpose: "Carries an immutable path and its total travel time." },
    { name: "Rider", kind: "Record", purpose: "Carries stable rider identity." },
    { name: "RideRequest", kind: "Record", purpose: "Carries one rider's pickup and destination intent." },
    { name: "DriverMatch", kind: "Record", purpose: "Returns the chosen driver with the pickup route." },
    { name: "MatchResult", kind: "Record", purpose: "Returns a named request outcome and accepted ride." },
    { name: "RoutingStrategy", kind: "Interface", purpose: "Keeps path calculation replaceable." },
    { name: "DriverMatchingStrategy", kind: "Interface", purpose: "Keeps driver selection replaceable." },
  ],
  enums: [
    { name: "DriverStatus", purpose: "Names whether a driver can receive a ride." },
    { name: "RideStatus", purpose: "Names the lifecycle of an accepted ride." },
    { name: "MatchStatus", purpose: "Explains an accepted or rejected ride request." },
    { name: "RideActionStatus", purpose: "Explains the result of starting or completing a ride." },
  ],
  fields: [
    { name: "locationId", purpose: "Identifies a node in the road graph." },
    { name: "travelMinutes", purpose: "Stores the cost of a road or completed route." },
    { name: "pickup", purpose: "Identifies where the rider must be collected." },
    { name: "destination", purpose: "Identifies where the accepted ride must finish." },
    { name: "nextRideNumber", purpose: "Allocates deterministic IDs only to accepted rides." },
  ],
  omitted: ["Vehicle", "Payment", "GPS tracker", "Map display"],
  relationship: "Routing finds paths; matching compares drivers using those paths; RideService changes Driver and Ride only after both route decisions succeed.",
  rationale: "Graph IDs, travel minutes, and request endpoints stay inside their values rather than becoming new entities. Vehicle details, payment, live GPS, and map display do not affect the confirmed routing-and-dispatch rules.",
};

export const elevatorEntityModel: EntityModel = {
  items: [
    { name: "Elevator", kind: "Class", purpose: "Owns one car's movement state and pending requests." },
    { name: "ElevatorController", kind: "Class", purpose: "Coordinates hall calls and the fleet." },
    { name: "Request", kind: "Record", purpose: "Keeps a floor request and its validated type together." },
    { name: "DispatchStrategy", kind: "Interface", purpose: "Keeps the fleet-selection rule replaceable." },
  ],
  enums: [
    { name: "Direction", purpose: "Names whether a car moves UP, DOWN, or is IDLE." },
    { name: "RequestType", purpose: "Distinguishes hall pickups from inside destinations." },
  ],
  fields: [
    { name: "floorNumber", purpose: "Identifies a requested or current building level." },
  ],
  omitted: ["Door"],
  relationship: "ElevatorController compares the fleet and assigns requests; each Elevator protects its own movement state and pending stops.",
  rationale: "A floor is only a number inside a request or elevator state. Door mechanics have no confirmed action, sensor, or timing rule, so a Door class would not help this first movement model.",
};

export const splitwiseEntityModel: EntityModel = {
  items: [
    { name: "ExpenseService", kind: "Class", purpose: "Coordinates validation, split calculation, accepted history, balances, and settlement." },
    { name: "BalanceSheet", kind: "Class", purpose: "Owns current pairwise debt and netting." },
    { name: "DebtSimplifier", kind: "Class", purpose: "Calculates simplified payment suggestions." },
    { name: "Money", kind: "Record", purpose: "Keeps whole cents and validation together." },
    { name: "User", kind: "Record", purpose: "Provides stable participant identity." },
    { name: "Expense", kind: "Record", purpose: "Records one accepted bill and final shares." },
    { name: "Debt", kind: "Record", purpose: "Exposes one directed balance safely." },
    { name: "SplitStrategy", kind: "Interface", purpose: "Keeps split calculations replaceable." },
  ],
  enums: [
    { name: "SplitType", purpose: "Names equal, exact, and percentage calculations." },
    { name: "ExpenseStatus", purpose: "Explains an accepted or rejected expense." },
    { name: "SettlementStatus", purpose: "Explains the result of recording a payment." },
  ],
  fields: [
    { name: "userId", purpose: "Identifies payers, participants, debtors, and creditors." },
    { name: "description", purpose: "Explains what an expense was for." },
    { name: "cents", purpose: "Stores money without floating-point rounding." },
    { name: "percentage", purpose: "Carries one participant's percentage share." },
    { name: "expenseId", purpose: "Identifies one accepted expense in history." },
  ],
  omitted: ["Group", "Receipt"],
  relationship: "The service records an Expense, SplitStrategy calculates shares, BalanceSheet owns current debt, and DebtSimplifier produces a read-only alternative view.",
  rationale: "IDs, descriptions, cents, and percentages stay inside the values that use them. One fixed group needs no Group lifecycle, and receipt upload is outside scope, so neither concept earns a class yet.",
};
