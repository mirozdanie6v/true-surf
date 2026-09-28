# TRUE SURF — Production Phase 1

Status: completed production audit and target workflow definition.
Branch basis: Mini App commit `bb184ab90b840fcc507be6ea1a18d6ee483330b8`.

## 1. Current demo boundary

The current Mini App is visually and functionally useful as a prototype, but it is not yet a production system.

Confirmed demo-only behavior:
- customer lead is stored in browser `localStorage`;
- admin statuses are stored in browser `localStorage`;
- ride occupancy such as 3/4, 2/4 and 4/4 is hard-coded;
- demo leads are hard-coded;
- lesson/package/rental catalogue is hard-coded;
- recommendations are calculated only in the client;
- rider cabinet is reconstructed from local browser state;
- admin has no authentication or role protection;
- there is no shared server database;
- there is no real booking lifecycle;
- there is no real ride lifecycle;
- there is no persistent customer/lesson history;
- there is no production notification workflow.

The current UI should be treated as the product prototype, not as the data source.

## 2. Product surfaces to keep

Keep the existing product split:
1. Landing — public acquisition and explanation.
2. Mini App — client interaction and repeat use.
3. Admin — school operations.
4. Backend/API — source of truth for all operational data.

The production conversion starts with Mini App + backend. Landing is rebuilt after the operational core is stable.

## 3. Client flow — production target

### New customer
1. User opens Mini App.
2. User identity is resolved from Telegram when available, with a web fallback.
3. User can:
   - choose a lesson/package/rental directly;
   - run Surf Check;
   - choose or request a ride;
   - continue an existing booking.
4. Surf Check stores a structured surf profile.
5. User chooses service, preferred date and transfer option.
6. A real booking request is created in the backend.
7. User immediately sees booking status in Rider Cabinet.
8. School receives a new operational item in Admin.
9. Admin confirms or adjusts:
   - service;
   - date/time;
   - ride;
   - instructor;
   - pickup;
   - price/payment state.
10. User receives confirmation/update.
11. After lesson completion, the record becomes part of the rider history.
12. App proposes the next relevant step: next lesson, package, rental or another ride.

### Returning customer
1. User opens Mini App.
2. Rider Cabinet loads real profile and history.
3. User sees:
   - current booking;
   - upcoming ride;
   - lesson/package balance;
   - surf level/profile;
   - previous sessions;
   - next recommended action.
4. Repeat booking reuses profile/contact data.

## 4. School/admin flow — production target

### New request
1. Booking enters Admin as `new`.
2. Admin reviews customer, Surf Check, service, date and ride need.
3. Admin changes booking status through a controlled workflow.
4. Assignment can include ride and instructor.
5. Changes are persisted centrally and reflected in Rider Cabinet.

### Booking status model
Initial production status set:
- `new`
- `needs_confirmation`
- `confirmed`
- `scheduled`
- `completed`
- `cancelled`
- `no_show`

Do not use free-text status values.

### Ride flow
Ride is a separate entity, not text inside a booking note.

Ride states:
- `open`
- `full`
- `confirmed`
- `departed`
- `completed`
- `cancelled`

A ride contains:
- date;
- departure window;
- pickup zone/point;
- capacity;
- booked seats;
- linked bookings/customers;
- operational notes.

Occupancy is calculated from real linked bookings.

## 5. Production data model

Minimum entities:

### User
- id
- telegram_user_id
- name
- username
- phone
- preferred_messenger
- preferred_language
- created_at
- updated_at

### SurfProfile
- user_id
- experience
- swimming_confidence
- fitness
- health_notes_or_flags
- height_cm
- weight_kg
- preferred_pace
- instructor_notes
- current_level
- updated_at

### Service
- id
- type: lesson | package | rental | promo
- title
- description
- price
- currency
- active
- capacity/rules where relevant

### Booking
- id
- user_id
- service_id
- status
- people_count
- requested_date
- scheduled_at
- ride_id
- instructor_id
- pickup_option
- customer_note
- admin_note
- price_snapshot
- payment_status
- created_at
- updated_at

### Ride
- id
- date
- departure_window
- pickup_zone
- pickup_point
- capacity
- status
- notes

### RideSeat / BookingRide relation
- ride_id
- booking_id
- seats

### Instructor
- id
- name
- active
- languages
- notes

### LessonSession
- id
- booking_id
- instructor_id
- scheduled_at
- completed_at
- result_notes
- next_step

### PackageBalance
- id
- user_id
- service_id
- total_sessions
- used_sessions
- valid_until

### Notification
- id
- user_id
- booking_id
- channel
- event
- status
- sent_at

## 6. API boundary

Minimum production API:

### Public/client
- `GET /api/me`
- `GET /api/services`
- `GET /api/rides`
- `POST /api/surf-profile`
- `POST /api/bookings`
- `GET /api/bookings/mine`
- `GET /api/rider`

### Admin
- `GET /api/admin/bookings`
- `PATCH /api/admin/bookings/:id`
- `POST /api/admin/rides`
- `PATCH /api/admin/rides/:id`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id`

Admin endpoints must be protected by authentication/role checks.

## 7. Keep / rework / remove

### Keep
- overall mobile visual direction;
- Home;
- Surf Check;
- Transfer/Ride concept;
- Price/service catalogue concept;
- Request screen;
- Rider Cabinet concept;
- Admin concept;
- safety/manual-confirmation logic;
- Telegram WebApp integration;
- analytics tracker.

### Rework to production
- all hard-coded ride cards -> server data;
- all hard-coded prices/services -> server catalogue;
- Surf Check result -> persisted surf profile;
- request form -> real booking create;
- Rider Cabinet -> server-backed user state;
- Admin -> protected server-backed operations;
- recommendations -> rules based on persisted profile and real service catalogue;
- all statuses -> controlled enums/workflow;
- Telegram identity -> validated server-side.

### Remove
- `demoLeads`;
- demo-only status controls;
- `trueSurfLeadDraftV6`;
- `trueSurfLeadDraftV13`;
- `trueSurfAdminStatuses`;
- fake occupancy values;
- user-facing wording that says demo/prototype where it appears in Mini App.

## 8. Recommended backend direction

For the first production release:
- keep Next.js/TypeScript frontend;
- keep Cloudflare deployment;
- use a shared persistent SQL database;
- make the backend the single source of truth;
- separate client and admin authorization;
- preserve the current Mini App UI while replacing the state layer underneath it.

A Cloudflare-native stack is compatible with the current deployment shape; the exact persistence choice is implemented in Phase 2.

## 9. Phase 2 implementation order

1. Introduce database schema and migrations.
2. Add Telegram/user session resolution.
3. Add service catalogue API.
4. Convert booking creation from localStorage to backend.
5. Convert rides from hard-coded cards to backend data.
6. Convert Rider Cabinet to backend data.
7. Protect and connect Admin.
8. Add notifications/events.
9. Remove demo state and fixtures.
10. Run end-to-end test of:
   User -> Surf Check -> Service -> Ride -> Booking -> Admin confirmation -> Rider Cabinet.

## 10. Items that need client-side operational confirmation before final hard-coding

These are intentionally configurable until TRUE SURF confirms them:
- exact booking approval rules;
- actual ride capacity and pickup zones;
- instructor assignment rules;
- lesson schedule ownership;
- package consumption rules;
- cancellation/reschedule policy;
- payment flow and payment status model;
- which notifications are Telegram vs WhatsApp/manual;
- whether health/safety answers may be stored and for how long.

The architecture should not block development while these details are being finalized.
