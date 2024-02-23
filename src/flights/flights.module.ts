import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'

import { FlightsController } from './flights.controller'
import { FlightsService } from './flights.service'

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}
