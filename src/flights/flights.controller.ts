import { Controller, Get } from '@nestjs/common'

import { FlightsService } from './flights.service'
import { Flight } from './interfaces/flight'

@Controller('flights')
export class FlightsController {
  constructor(private flightsService: FlightsService) {}

  @Get()
  findAll(): Promise<Flight[]> {
    return this.flightsService.fetchFromAllSources()
  }
}
