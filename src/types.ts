export type CityType = {
  id: string;
  cityName: string;
  country: string;
  emoji: string;
  date: Date;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
};

export type CountryType = {
  country: string;
  emoji: string;
};

export type UserType = {
  name: string;
  email: string;
  avatar: string;
};
