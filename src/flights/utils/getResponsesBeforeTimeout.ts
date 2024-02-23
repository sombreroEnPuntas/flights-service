export async function getResponsesBeforeTimeout(
  promises: Promise<any>[],
  timeout: number,
): Promise<any[]> {
  // Map each promise to a new promise that resolves with its result or null if it times out
  const promisesWithTimeout = promises.map(async (promise) => {
    try {
      // Await for either the promise to resolve or the timeout to occur
      return await Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(null), timeout)),
      ])
    } catch (error) {
      return null // Handle errors gracefully
    }
  })

  // Wait for all promises to settle
  const results = await Promise.all(promisesWithTimeout)

  // Filter out null values (those that timed out) and return the resolved responses
  return results.filter((result) => result !== null)
}
