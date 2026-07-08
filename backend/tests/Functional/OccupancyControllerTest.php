<?php

namespace App\Tests\Functional;

class OccupancyControllerTest extends ApiTestCase
{
    public function testOccupancyCountsActiveBookingsOnGivenDay(): void
    {
        $daycare = $this->createDaycare('daycare-occ', maxDogsPerDay: 5);
        $alice = $this->createUser($daycare, 'alice@example.com');
        $rex = $this->createDog($alice, $daycare, 'Rex');
        $bella = $this->createDog($alice, $daycare, 'Bella');

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $bella->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);

        $this->authenticatedRequest($alice, 'GET', '/api/daycares/' . $daycare->getId() . '/occupancy?date=2026-08-10');
        $this->assertResponseStatus(200);

        $data = $this->jsonResponse();
        $this->assertSame(2, $data['count']);
        $this->assertSame(5, $data['max']);
        $this->assertFalse($data['isFull']);
    }

    public function testOccupancyReportsFullWhenMaxReached(): void
    {
        $daycare = $this->createDaycare('daycare-full', maxDogsPerDay: 1);
        $alice = $this->createUser($daycare, 'alice@example.com');
        $rex = $this->createDog($alice, $daycare, 'Rex');

        $this->authenticatedRequest($alice, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $rex->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);

        $this->authenticatedRequest($alice, 'GET', '/api/daycares/' . $daycare->getId() . '/occupancy?date=2026-08-10');
        $this->assertResponseStatus(200);

        $this->assertTrue($this->jsonResponse()['isFull']);
    }

    public function testOccupancyRequiresDateParameter(): void
    {
        $daycare = $this->createDaycare();
        $alice = $this->createUser($daycare, 'alice@example.com');

        $this->authenticatedRequest($alice, 'GET', '/api/daycares/' . $daycare->getId() . '/occupancy');

        $this->assertResponseStatus(400);
    }
}
