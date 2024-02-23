# CODING CHALLENGE

Please plan and implement a service in NestJS as a framework and Jest for testing.

## Requirements

Your service should get flights from these 2 routes, merge them, remove duplicates and send them to the client.

1. https://coding-challenge.powerus.de/flight/source1
1. https://coding-challenge.powerus.de/flight/source2

- As the identifier of the flight, the combination of `slice flight numbers` and `slice dates` can be used.
- The flight sources are not stable, i.e. it can sometimes fail or reply after a couple of seconds.
- The response time of your service shouldn't take longer than 1 second.
- Please write tests for your implementation.

## Details

1. Think that this service will be used in a flight search page for the customers.
1. There will be many other flight source services added in the future.
1. We can assume any information that we get from the endpoints remains valid for an hour.
1. It is always better to show more results to the end-user as much as possible, but never invalid information.

## Expectations

The main aim is to send a repository that has as high quality as possible.

- Clean code, easy to read
- Scalability
- Simplicity
