
export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity?: number;
  icon?: string;
  description?: string;
  lastUpdated: Date;
  // Added to support mandatory grounding link display
  sources?: { title: string; uri: string }[];
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}