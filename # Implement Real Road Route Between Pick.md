# Implement Real Road Route Between Pickup & Dropoff

🧠 GOAL:
Implement dynamic road-based route tracing between pickup and dropoff points on the Passenger Dashboard map using Mapbox Directions API. The route should follow actual roads, not a straight line.

🗺️ CONTEXT:
- Framework: React (Next.js)
- Map Library: @rnmapbox/maps or Mapbox GL JS
- Data: pickupLat, pickupLng, dropoffLat, dropoffLng
- Target View: Passenger Dashboard map
- Token: Mapbox Access Token (already available in env)

---

✅ FUNCTIONAL REQUIREMENTS:
1. Call the Mapbox Directions API with the following structure:

https://api.mapbox.com/directions/v5/mapbox/driving/{pickupLng},{pickupLat};{dropoffLng},{dropoffLat}?geometries=geojson&access_token=YOUR_MAPBOX_ACCESS_TOKEN

2. Extract `geometry.coordinates` from the response:
- Save this in a `LineString` format for Mapbox ShapeSource

3. Render the road route line between the two points using `LineLayer`:
- Style:
  - lineColor: `#00BFFF` (Sky Blue)
  - lineWidth: 5
  - lineJoin: round
  - lineCap: round
  - lineOpacity: 0.9

4. Also render the two point markers:
- Green for Pickup
- Red for Dropoff

5. Auto-focus the map camera to the pickup location

---

📦 BONUS (Optional for Next Step):
- Extract `distance` and `duration` from API response
- Save to Supabase or use in UI display (e.g., estimated fare & time)
- Reuse routes for booking logs or dispatcher dashboards

---

💡 CODE STUB STARTER:
Use this as a starting point:

```tsx
const [routeCoords, setRouteCoords] = useState(null);

useEffect(() => {
const fetchRoute = async () => {
 const res = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
 const data = await res.json();
 setRouteCoords(data.routes[0].geometry.coordinates);
};

if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
 fetchRoute();
}
}, [pickupLat, pickupLng, dropoffLat, dropoffLng]);



⸻

📍RENDERING ON MAP:

{routeCoords && (
  <MapboxGL.ShapeSource id="routeShape" shape={{
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routeCoords
    }
  }}>
    <MapboxGL.LineLayer
      id="routeLine"
      style={{
        lineColor: '#00BFFF',
        lineWidth: 5,
        lineJoin: 'round',
        lineCap: 'round',
        lineOpacity: 0.9
      }}
    />
  </MapboxGL.ShapeSource>
)}



⸻

🎯 OBJECTIVE:
Make the passenger UX visually intuitive and map-accurate by drawing road-matching paths between locations using Mapbox Directions API.

Please complete and integrate this behavior inside the current /passenger dashboard map view.