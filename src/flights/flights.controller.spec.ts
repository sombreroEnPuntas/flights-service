import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'

import { FlightsController } from './flights.controller'
import { FlightsService } from './flights.service'
import { Flight } from './interfaces/flight'

describe('FlightsController', () => {
  let flightsController: FlightsController
  let flightsService: FlightsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register()],
      controllers: [FlightsController],
      providers: [FlightsService],
    }).compile()

    flightsController = module.get<FlightsController>(FlightsController)
    flightsService = module.get<FlightsService>(FlightsService)
  })

  it('should be defined', () => {
    expect(flightsController).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of flights', async () => {
      const flights: Flight[] = []
      jest
        .spyOn(flightsService, 'fetchFromAllSources')
        .mockResolvedValueOnce(flights)

      expect(await flightsController.findAll()).toStrictEqual([])
    })
  })
})
