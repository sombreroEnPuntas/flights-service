import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import * as request from 'supertest'

import { AppModule } from './../src/app.module'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let httpService: HttpService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    httpService = app.get<HttpService>(HttpService)
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  it('/flights (GET) OK', () => {
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

    return request(app.getHttpServer())
      .get('/flights')
      .expect(200)
      .expect(
        '[{"id":"ABC001-today_ABC002-tomorrow","price":"1","slices":[{"origin_name":"MDZ","destination_name":"SCL","departure_date_time_utc":"today","arrival_date_time_utc":"tomorrow","flight_number":"ABC001","duration":"5"},{"origin_name":"SCL","destination_name":"AMS","departure_date_time_utc":"tomorrow","arrival_date_time_utc":"after-tomorrow","flight_number":"ABC002","duration":"5"}]}]',
      )
  })

  it('/flights (GET) 500 Error', () => {
    const response: AxiosResponse<any> = {
      status: 500,
      statusText: 'Internal server error',
      data: { statusCode: 500, message: 'Internal server error' },
      headers: undefined,
      config: undefined,
    }

    jest.spyOn(httpService, 'get').mockReturnValue(of(response))

    return request(app.getHttpServer())
      .get('/flights')
      .expect(500)
      .expect('{"statusCode":500,"message":"Internal server error"}')
  })
})
