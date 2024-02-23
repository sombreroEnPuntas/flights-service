export interface Flight {
  id: string
  slices: Slice[]
  price: string
}

export interface Slice {
  origin_name: string
  destination_name: string
  departure_date_time_utc: string
  arrival_date_time_utc: string
  flight_number: string
  duration: string // in minutes
}
