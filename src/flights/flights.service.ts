import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom, retry } from 'rxjs'
import { CacheTTL, CacheKey, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

import { Flight } from './interfaces/flight'
import { sources } from './data/sources'
import { Source } from './interfaces/source'
import { getResponsesBeforeTimeout } from './utils/getResponsesBeforeTimeout'

@Injectable()
export class FlightsService {
  constructor(
    readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async fetchFromAllSources(): Promise<Flight[]> {
    const requests: Promise<Flight[]>[] = []
    sources.forEach((source) => {
      requests.push(this.getFlightFromSource(source))
    })
    const results = await getResponsesBeforeTimeout(requests, 1000)

    const flights = this.mergeAndRemoveDuplicates(results)

    return flights
  }

  @CacheTTL(3600000) // Cache for 1 hour
  @CacheKey('flights-source') // Cache key
  async getFlightFromSource(source: Source): Promise<Flight[]> {
    const cachedFlight: Flight[] = await this.cacheManager.get(
      'source:' + source.id,
    )
    // no need to test cache :)
    /* istanbul ignore next */
    if (cachedFlight) {
      return cachedFlight
    }

    const { data } = await firstValueFrom<{ data: any }>(
      this.httpService.get(source.url).pipe(retry(3)),
    )

    const flights = source.dataMapping(data)
    await this.cacheManager.set('source:' + source.id, flights, 3600000) // Cache for 1 hour
    return flights
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
