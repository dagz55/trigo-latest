declare module 'mapbox-gl' {
  export interface Map {
    getLayer(layer: string): any;
    removeLayer(layer: string): void;
    getSource(source: string): any;
    removeSource(source: string): void;
    addSource(id: string, source: AnySourceData): void;
    addLayer(layer: AnyLayer): void;
    fitBounds(bounds: LngLatBounds, options?: FitBoundsOptions): void;
  }

  export class Map {
    constructor(options: MapboxOptions);
    remove(): void;
    getLayer(layer: string): any;
    removeLayer(layer: string): void;
    getSource(source: string): any;
    removeSource(source: string): void;
    addSource(id: string, source: AnySourceData): void;
    addLayer(layer: AnyLayer): void;
    fitBounds(bounds: LngLatBounds, options?: FitBoundsOptions): void;
  }

  export class Marker {
    constructor();
    setLngLat(lnglat: [number, number]): this;
    addTo(map: Map): this;
  }

  export class LngLatBounds {
    extend(lnglat: [number, number]): this;
  }

  export interface MapboxOptions {
    container: string | HTMLElement;
    style: string;
    center?: [number, number];
    zoom?: number;
    accessToken?: string;
  }

  export interface FitBoundsOptions {
    padding?: number;
  }

  export interface AnySourceData {
    type: string;
    data?: any;
  }

  export interface AnyLayer {
    id: string;
    type: string;
    source: string;
    layout?: {
      [key: string]: any;
    };
    paint?: {
      [key: string]: any;
    };
  }
}

declare module '@mapbox/mapbox-gl-geocoder' {
  import { Control } from 'mapbox-gl';
  export default class MapboxGeocoder extends Control {
    constructor(options: any);
  }
}
