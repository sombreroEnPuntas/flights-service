import { Flight } from '../interfaces/flight'
import { Source } from '../interfaces/source'

interface SourceResponse {
  flights: Array<{
    slices: Array<{
      origin_name: string
      destination_name: string
      departure_date_time_utc: string
      arrival_date_time_utc: string
      flight_number: string
      duration: string // in minutes
    }>
    price: string
  }>
}
const source1IdBuilder = (flight: SourceResponse['flights'][0]): string => {
  let id = ''

  flight.slices.forEach(
    (slice, index) =>
      (id +=
        slice.flight_number +
        '-' +
        slice.departure_date_time_utc +
        (index < flight.slices.length - 1 ? '_' : '')),
  )

  return id
}
const dataMappingSource1 = (response: SourceResponse): Flight[] => {
  const flights: Flight[] = []
  response.flights.forEach((flight) => {
    flights.push({
      id: source1IdBuilder(flight),
      price: flight.price,
      slices: flight.slices,
    })
  })

  return flights
}

export const sources: Source[] = [
  {
    id: 'source1',
    url: 'https://coding-challenge.powerus.de/flight/source1',
    dataMapping: dataMappingSource1,
  },
  {
    id: 'source2',
    url: 'https://coding-challenge.powerus.de/flight/source2',
    dataMapping: dataMappingSource1,
  },
]
