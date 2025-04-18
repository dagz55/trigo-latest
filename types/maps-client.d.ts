declare module '@/lib/maps-client' {
  export function getMapboxToken(): string | null;
  export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
  export function formatDistance(distance: number): string;
}
