<?php

namespace App\Tests\Functional;

use App\Entity\Daycare;
use App\Entity\Dog;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

abstract class ApiTestCase extends WebTestCase
{
    protected KernelBrowser $client;
    protected EntityManagerInterface $em;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = static::getContainer()->get(EntityManagerInterface::class);
    }

    protected function createDaycare(string $slug = 'test-daycare', int $maxDogsPerDay = 5): Daycare
    {
        $daycare = new Daycare();
        $daycare->setName('Test Daycare ' . $slug);
        $daycare->setSlug($slug);
        $daycare->setIsActive(true);
        $daycare->setBillingMode('hourly');
        $daycare->setPricePerUnit(4.0);
        $daycare->setMaxDogsPerDay($maxDogsPerDay);

        $this->em->persist($daycare);
        $this->em->flush();

        return $daycare;
    }

    protected function createUser(Daycare $daycare, string $email, array $roles = [], string $password = 'password123'): User
    {
        $user = new User();
        $user->setEmail($email);
        $user->setRoles($roles);
        $user->setDaycare($daycare);

        $hasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        $user->setPassword($hasher->hashPassword($user, $password));

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    protected function createDog(User $owner, Daycare $daycare, string $name = 'Rex'): Dog
    {
        $dog = new Dog();
        $dog->setName($name);
        $dog->setBreed('Labrador');
        $dog->setOwner($owner);
        $dog->setDaycare($daycare);

        $this->em->persist($dog);
        $this->em->flush();

        return $dog;
    }

    /** Returns Authorization header value ("Bearer <jwt>") for the given user, without hitting /auth/login. */
    protected function tokenFor(User $user): string
    {
        $jwtManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        return 'Bearer ' . $jwtManager->create($user);
    }

    protected function authenticatedRequest(User $user, string $method, string $uri, ?array $payload = null, array $extraHeaders = []): void
    {
        $server = array_merge([
            'HTTP_AUTHORIZATION' => $this->tokenFor($user),
            'CONTENT_TYPE' => 'application/ld+json',
            'HTTP_ACCEPT' => 'application/ld+json',
        ], $extraHeaders);

        $this->client->request($method, $uri, [], [], $server, $payload !== null ? json_encode($payload) : null);
    }

    protected function jsonResponse(): array
    {
        return json_decode($this->client->getResponse()->getContent(), true) ?? [];
    }

    protected function assertResponseStatus(int $expected): void
    {
        $this->assertSame($expected, $this->client->getResponse()->getStatusCode(), $this->client->getResponse()->getContent());
    }
}
