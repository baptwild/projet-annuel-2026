<?php

namespace App\Tests\Functional;

class TenantIsolationTest extends ApiTestCase
{
    public function testAdminCannotSeeAnotherDaycareBookingsInCollection(): void
    {
        $daycareA = $this->createDaycare('daycare-a');
        $daycareB = $this->createDaycare('daycare-b');

        $adminA = $this->createUser($daycareA, 'admin-a@example.com', ['ROLE_ADMIN']);
        $ownerB = $this->createUser($daycareB, 'owner-b@example.com');
        $dogB = $this->createDog($ownerB, $daycareB, 'Dino');

        $this->authenticatedRequest($ownerB, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $dogB->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);

        $this->authenticatedRequest($adminA, 'GET', '/api/bookings');
        $this->assertResponseStatus(200);

        $body = $this->jsonResponse();
        $members = $body['member'] ?? $body['hydra:member'] ?? [];
        $this->assertCount(0, $members, 'Admin of daycare A should not see bookings from daycare B');
    }

    public function testAdminCannotAccessAnotherDaycareBookingDirectly(): void
    {
        $daycareA = $this->createDaycare('daycare-a');
        $daycareB = $this->createDaycare('daycare-b');

        $adminA = $this->createUser($daycareA, 'admin-a@example.com', ['ROLE_ADMIN']);
        $ownerB = $this->createUser($daycareB, 'owner-b@example.com');
        $dogB = $this->createDog($ownerB, $daycareB, 'Dino');

        $this->authenticatedRequest($ownerB, 'POST', '/api/bookings', [
            'dog' => '/api/dogs/' . $dogB->getId(),
            'startDate' => '2026-08-10T09:00:00+00:00',
            'endDate' => '2026-08-10T13:00:00+00:00',
        ]);
        $this->assertResponseStatus(201);
        $bookingIri = $this->jsonResponse()['@id'];

        $this->authenticatedRequest($adminA, 'GET', $bookingIri);
        $this->assertResponseStatus(404);
    }

    public function testRegularUserOnlySeesOwnDogsNotOtherUsersInSameDaycare(): void
    {
        $daycare = $this->createDaycare();
        $alice = $this->createUser($daycare, 'alice@example.com');
        $bob = $this->createUser($daycare, 'bob@example.com');
        $this->createDog($alice, $daycare, 'Rex');
        $this->createDog($bob, $daycare, 'Bella');

        $this->authenticatedRequest($alice, 'GET', '/api/dogs');
        $this->assertResponseStatus(200);

        $members = $this->jsonResponse()['member'] ?? [];
        $names = array_map(fn($d) => $d['name'], $members);

        $this->assertContains('Rex', $names);
        $this->assertNotContains('Bella', $names);
    }

    public function testAdminSeesAllDogsWithinOwnDaycareOnly(): void
    {
        $daycareA = $this->createDaycare('daycare-a');
        $daycareB = $this->createDaycare('daycare-b');

        $adminA = $this->createUser($daycareA, 'admin-a@example.com', ['ROLE_ADMIN']);
        $ownerA = $this->createUser($daycareA, 'owner-a@example.com');
        $ownerB = $this->createUser($daycareB, 'owner-b@example.com');
        $this->createDog($ownerA, $daycareA, 'Rex');
        $this->createDog($ownerB, $daycareB, 'Dino');

        $this->authenticatedRequest($adminA, 'GET', '/api/dogs');
        $this->assertResponseStatus(200);

        $members = $this->jsonResponse()['member'] ?? [];
        $names = array_map(fn($d) => $d['name'], $members);

        $this->assertContains('Rex', $names);
        $this->assertNotContains('Dino', $names);
    }
}
