export interface UnsavedProperty {
  address_1: string;
  address_2: string | undefined;
  city: string;
  country: string;
  name: string;
  notes: string | undefined;
  price: number;
  size: number;
  state: string;
  type: string | undefined;
  url: string | undefined;
  zip: string;
}

export interface Property extends UnsavedProperty {
  id: number;
  address_1: string;
  address_2: string | undefined;
  city: string;
  country: string;
  name: string;
  notes: string | undefined;
  price: number;
  size: number;
  state: string;
  type: string | undefined;
  url: string | undefined;
  zip: string;
}
