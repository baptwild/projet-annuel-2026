<?php

namespace App\Tests\Functional;

class BookingApiTest extends ApiTestCase
{
    public function testCreateBookingSucceeds(): void
    {
        $daycare = $this->createDaycare();
        $alice = $this->createUser($daycare, 'alice@example.com');
        $rex = $this->createDog($alice, $daycare, 'Rex');

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);

        $this->assertResponseStatus(201);
    }

    public function testCreateBookingRejectsSameDogSameDayOverlap(): void
    {
        $daycare = $this->createDaycare();
        $alice = $this->createUser($daycare, 'alice@example.com');
        $rex = $this->createDog($alice, $daycare, 'Rex');

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);

        // Same dog, same day, different hours -> still rejected (one active booking per dog per day)
        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T14:00:00+00:00',
            'endDate' => '2026-08-10T17:00:00+00:00',
        ]);

        $this->assertResponseStatus(422);
    }

    public function testCreateBookingAllowsSameDogDifferentDay(): void
    {
        $daycare = $this->createDaycare();
        $alice = $this->createUser($daycare, 'alice@example.com');
        $rex = $this->createDog($alice, $daycare, 'Rex');

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-11T09:00:00+00:00',
            'endDate' => '2026-08-11T13:00:00+00:00',
        ]);

        $this->assertResponseStatus(201);
    }

    public function testCreateBookingRequiresAuthentication(): void
    {
        $this->client->request('POST', '/api/bookings', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]));

        $this->assertResponseStatus(401);
    }

    public function testPatchCanKeepBookingOnSameDayWithoutFalseConflict(): void
    {
        $daycare = $this->createDaycare();
        $alice = $this->createUser($daycare, 'alice@example.com');
        $rex = $this->createDog($alice, $daycare, 'Rex');

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);
        $bookingIri = $this->jsonResponse()['@id'];

        // Editing the time on the same day must not conflict with itself
        $this->authenticatedRequest($alice, 'PATCH', $bookingIri, [
            'startDate' => '2026-08-10T10:00:00+00:00',
            'endDate' => '2026-08-10T14:00:00+00:00',
        ], ['CONTENT_TYPE' => 'application/merge-patch+json']);

        $this->assertResponseStatus(200);
    }

    public function testPatchRejectsMovingBookingOntoAnotherActiveBookingSameDay(): void
    {
        $daycare = $this->createDaycare();
        $alice = $this->createUser($daycare, 'alice@example.com');
        $rex = $this->createDog($alice, $daycare, 'Rex');

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-11T09:00:00+00:00',
            'endDate' => '2026-08-11T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);
        $secondBookingIri = $this->jsonResponse()['@id'];

        // Moving the second booking onto the first booking's day must be rejected
        $this->authenticatedRequest($alice, 'PATCH', $secondBookingIri, [
            'startDate' => '2026-08-10T14:00:00+00:00',
            'endDate' => '2026-08-10T17:00:00+00:00',
        ], ['CONTENT_TYPE' => 'application/merge-patch+json']);

        $this->assertResponseStatus(422);
    }
}
