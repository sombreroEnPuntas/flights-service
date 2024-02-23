import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule, HttpService } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'

import { FlightsService } from './flights.service'
import { FlightsController } from './flights.controller'
import { Flight } from './interfaces/flight'
import { sources } from './data/sources'

describe('FlightsService', () => {
  let flightsService: FlightsService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register()],
      controllers: [FlightsController],
      providers: [FlightsService],
    }).compile()

    flightsService = module.get<FlightsService>(FlightsService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should be defined', () => {
    expect(flightsService).toBeDefined()
  })

  describe('fetchFromAllSources', () => {
    it('should return a merged array of flights from all sources, with no dupes', async () => {
      const normalisedFlights: Flight[] = [
        {
          id: '1',
          price: '1',
          slices: [
            {
              origin_name: 'MDZ',
              destination_name: 'SCL',
              departure_date_time_utc: 'today',
              arrival_date_time_utc: 'tomorrow',
              flight_number: 'ABC001',
              duration: '5',
            },
            {
              origin_name: 'SCL',
              destination_name: 'AMS',
              departure_date_time_utc: 'tomorrow',
              arrival_date_time_utc: 'after-tomorrow',
              flight_number: 'ABC002',
              duration: '5',
            },
          ],
        },
      ]
      const normalisedFlightsDuped: Flight[] = [...normalisedFlights]

      jest
        .spyOn(flightsService, 'getFlightFromSource')
        .mockResolvedValueOnce(normalisedFlights)
      jest
        .spyOn(flightsService, 'getFlightFromSource')
        .mockResolvedValueOnce(normalisedFlightsDuped)

      const result = await flightsService.fetchFromAllSources()

      expect(result).toEqual([...normalisedFlights])
    })
  })

  describe('getFlightFromSource', () => {
    it('should return an array of normalised flights, matching Flight[] interface', async () => {
      const flightsFromSource: any = {
        flights: [
          {
            price: '1',
            slices: [
              {
                origin_name: 'MDZ',
                destination_name: 'SCL',
                departure_date_time_utc: 'today',
                arrival_date_time_utc: 'tomorrow',
                flight_number: 'ABC001',
                duration: '5',
              },
              {
                origin_name: 'SCL',
                destination_name: 'AMS',
                departure_date_time_utc: 'tomorrow',
                arrival_date_time_utc: 'after-tomorrow',
                flight_number: 'ABC002',
                duration: '5',
              },
            ],
          },
        ],
      }

      const response: AxiosResponse<any> = {
        data: flightsFromSource,
        status: 200,
        statusText: 'OK',
        headers: undefined,
        config: undefined,
      }

      jest.spyOn(httpService, 'get').mockReturnValue(of(response))

      const result = await flightsService.getFlightFromSource(sources[0])

      expect(result).toEqual([
        {
          id: 'ABC001-today_ABC002-tomorrow',
          price: '1',
          slices: [
            {
              origin_name: 'MDZ',
              destination_name: 'SCL',
              departure_date_time_utc: 'today',
              arrival_date_time_utc: 'tomorrow',
              flight_number: 'ABC001',
              duration: '5',
            },
            {
              origin_name: 'SCL',
              destination_name: 'AMS',
              departure_date_time_utc: 'tomorrow',
              arrival_date_time_utc: 'after-tomorrow',
              flight_number: 'ABC002',
              duration: '5',
            },
          ],
        },
      ])
    })

    // it('should handle errors from sources gracefully', async () => {
    //   const response: AxiosResponse<any> = {
    //     status: 500,
    //     statusText: 'Internal server error',
    //     data: { statusCode: 500, message: 'Internal server error' },
    //     headers: undefined,
    //     config: undefined,
    //   }

    //   jest.spyOn(httpService, 'get').mockReturnValue(of(response))
    //   jest.spyOn(console, 'error')

    //   const result = await flightsService.getFlightFromSource(sources[0])

    //   expect(result).toStrictEqual([])

    //   expect(console.error).toHaveBeenCalledWith(
    //     `Error fetching flights from source ${sources[0].id}:`,
    //     new Error('Failed to fetch flights'),
    //   )
    // })
  })
})
