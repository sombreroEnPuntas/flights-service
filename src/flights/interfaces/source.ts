import { Flight } from './flight'

export interface Source {
  id: string
  url: string
  dataMapping: (response: any) => Flight[]
}
