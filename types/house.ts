export interface UnsavedHouse {
  address1: string;
  address2: string | undefined;
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

export interface House extends UnsavedHouse {
  id: number;
  userId: string;
}
