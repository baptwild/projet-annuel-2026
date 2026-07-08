<?php

namespace App\Tests\Functional;

class AuthTest extends ApiTestCase
{
    public function testRegisterCreatesUser(): void
    {
        $daycare = $this->createDaycare();

        $this->client->request('POST', '/auth/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'firstName' => 'New',
            'lastName' => 'User',
            'daycareId' => $daycare->getId(),
        ]));

        $this->assertResponseStatus(201);
    }

    public function testRegisterRejectsShortPassword(): void
    {
        $daycare = $this->createDaycare();

        $this->client->request('POST', '/auth/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'newuser@example.com',
            'password' => 'short',
            'daycareId' => $daycare->getId(),
        ]));

        $this->assertResponseStatus(422);
    }

    public function testRegisterRejectsUnknownDaycare(): void
    {
        $this->client->request('POST', '/auth/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'daycareId' => 999999,
        ]));

        $this->assertResponseStatus(404);
    }

    public function testLoginWithValidCredentialsReturnsToken(): void
    {
        $daycare = $this->createDaycare();
        $this->createUser($daycare, 'alice@example.com', [], 'password123');

        $this->client->request('POST', '/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'alice@example.com',
            'password' => 'password123',
        ]));

        $this->assertResponseStatus(200);
        $this->assertArrayHasKey('token', $this->jsonResponse());
    }

    public function testLoginWithWrongPasswordFails(): void
    {
        $daycare = $this->createDaycare();
        $this->createUser($daycare, 'alice@example.com', [], 'password123');

        $this->client->request('POST', '/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'alice@example.com',
            'password' => 'wrong-password',
        ]));

        $this->assertResponseStatus(401);
    }

    public function testMeRequiresAuthentication(): void
    {
        $this->client->request('GET', '/auth/me');

        $this->assertResponseStatus(401);
    }

    public function testMeReturnsCurrentUser(): void
    {
        $daycare = $this->createDaycare();
        $user = $this->createUser($daycare, 'alice@example.com');

        $this->authenticatedRequest($user, 'GET', '/auth/me');

        $this->assertResponseStatus(200);
        $this->assertSame('alice@example.com', $this->jsonResponse()['email']);
    }
}
