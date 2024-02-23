import { getResponsesBeforeTimeout } from './getResponsesBeforeTimeout'

describe('getResponsesBeforeTimeout', () => {
  test('should return responses that resolve before timeout', async () => {
    let unfinished: NodeJS.Timeout
    const promises: Promise<any>[] = [
      new Promise((resolve) => setTimeout(() => resolve('Response 1'), 50)),
      new Promise((resolve) => setTimeout(() => resolve('Response 2'), 80)),
      new Promise((resolve) => {
        unfinished = setTimeout(() => resolve('Response 3'), 120)
      }),
    ]

    const responses = await getResponsesBeforeTimeout(promises, 100)

    expect(responses).toEqual(['Response 1', 'Response 2'])
    unfinished.unref()
  })

  test('should handle errors gracefully', async () => {
    const promises: Promise<any>[] = [
      new Promise((resolve) => setTimeout(() => resolve('Response 1'), 50)),
      Promise.reject('Error occurred in a promise'),
    ]

    const responses = await getResponsesBeforeTimeout(promises, 100)

    expect(responses).toEqual(['Response 1'])
  })
})
