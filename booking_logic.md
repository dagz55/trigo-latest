# Fixing “Confirm Booking” Logic

📌 TASK: Fix and enhance the "Confirm Booking" button inside the TriGo Passenger Dashboard.

🧠 GOAL: When a user confirms a booking, it must:
1. Send a booking request notification to:
   - All online Triders nearby the passenger's current location
   - The online Dispatcher
2. Allow the Dispatcher to assign the booking to one of the online Triders
3. Once assigned, the selected Trider must:
   - See the passenger's booking info appear in their dashboard in real time
   - Be able to accept or decline
4. Upon acceptance, finalize the booking and lock it from other Triders

🧭 TECH CONTEXT:
- Map rendering is done via Mapbox GL JS
- Supabase Realtime for presence + live updates
- Using VSCode and React/Next.js frontend
- AUGMENT handles coding environment and CI

---

## ✅ TRIGGER FUNCTION
Hook: `onClick` of `Confirm Booking` button

### 🔁 STEPS:

1. **Get Passenger’s Current Location & Dropoff Location**
   - Use Mapbox GL's `getCenter()` or reverse geocode
   - Get: `pickup_lat`, `pickup_lng`, `dropoff_lat`, `dropoff_lng`

2. **Get List of Online Triders**
   - Query Supabase `users` table:
     ```sql
     SELECT * FROM users WHERE role = 'trider' AND online = true;
     ```

3. **Calculate Distance from Each Trider to Passenger**
   - Formula:
     ```js
     const getDistanceKm = (lat1, lng1, lat2, lng2) => {
       const R = 6371;
       const dLat = (lat2 - lat1) * Math.PI / 180;
       const dLng = (lng2 - lng1) * Math.PI / 180;
       const a = Math.sin(dLat / 2) ** 2 +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLng / 2) ** 2;
       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
       return R * c;
     };
     ```

4. **Prepare Booking Payload**
   ```js
   {
     passenger_id,
     name,
     cp_number,
     pickup_coords: [lat, lng],
     dropoff_coords: [lat, lng],
     estimated_fare: 25-35,
     status: 'pending',
     assigned_to: null,
     created_at: new Date().toISOString()
   }

	5.	Insert into bookings table

INSERT INTO bookings (...) VALUES (...);


	6.	Notify Dispatcher + Nearby Triders
	•	Use Supabase Realtime to send booking request to:
	•	All online Triders within 1.5–2km radius
	•	Dispatcher UI as assignable booking card

⸻

✅ DISPATCHER FLOW:
	•	UI shows unassigned bookings
	•	Dispatcher assigns it via dropdown to trider_id
	•	Status updates to assigned, assigned_to: <trider_id>

⸻

✅ TRIDER FLOW:
	•	Assigned Trider gets a booking popup:
	•	Passenger name, phone
	•	Pickup location
	•	Dropoff destination
	•	Fare in PHP
	•	Real-time computed distance (via formula above)
	•	Accept button → updates status: accepted, timestamped

⸻

🗃️ TABLES TO TOUCH:
	•	bookings
	•	users
	•	(Optional) notifications

🎨 TOOLS:
	•	Mapbox GL JS for geolocation and UI route visualization
	•	Supabase (PostgreSQL, Realtime)
	•	React (Next.js App Router)

⸻

💡 FINAL REMARK:
Fix the schema cache error: public.find_nearest_toda(lat, lng) by either:
	•	Re-adding the Postgres function (was likely dropped or not migrated)
	•	Or replacing with raw coordinate filtering via Supabase + client-side Mapbox
