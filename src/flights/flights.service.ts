import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom, catchError, timeout, retry } from 'rxjs'

import { Flight } from './interfaces/flight'
import { sources } from './data/sources'
import { Source } from './interfaces/source'

@Injectable()
export class FlightsService {
  constructor(readonly httpService: HttpService) {}

  async fetchFromAllSources(): Promise<Flight[]> {
    const requests: Promise<Flight[]>[] = []
    sources.forEach((source) => {
      requests.push(this.getFlightFromSource(source))
    })
    const results = await Promise.all(requests)

    const flights = this.mergeAndRemoveDuplicates(results)

    return flights
  }

  async getFlightFromSource(source: Source): Promise<Flight[]> {
    const { data } = await firstValueFrom<{ data: any }>(
      this.httpService.get(source.url).pipe(
        retry(3),
        timeout(1000),
        catchError((error: unknown) => {
          console.error(
            `Error fetching flights from source ${source.id}:`,
            error,
          )
          return []
        }),
      ),
    )

    return source.dataMapping(data)
  }

  private mergeAndRemoveDuplicates(list: Flight[][]): Flight[] {
    const flattenedList = list.flat()

    const uniqueList = flattenedList.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.id === value.id),
    )

    return uniqueList
  }
}
