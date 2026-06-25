<?php

namespace App\DataFixtures;

use App\Entity\Booking;
use App\Entity\Daycare;
use App\Entity\Dog;
use App\Entity\User;
use App\Enum\BookingStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $hasher) {}

    public function load(ObjectManager $manager): void
    {
        $daycare = new Daycare();
        $daycare->setName('Happy Paws Daycare');
        $daycare->setSlug('happy-paws');
        $daycare->setIsActive(true);
        $manager->persist($daycare);

        $admin = new User();
        $admin->setEmail('admin@happy-paws.com');
        $admin->setFirstName('Sophie');
        $admin->setLastName('Martin');
        $admin->setPassword($this->hasher->hashPassword($admin, 'admin1234'));
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setDaycare($daycare);
        $manager->persist($admin);

        $usersData = [
            ['alice@example.com', 'Alice', 'Dupont', 'Rex', 'Labrador', '2020-03-15', BookingStatus::Confirmed],
            ['bob@example.com', 'Bob', 'Bernard', 'Bella', 'Golden Retriever', '2019-07-22', BookingStatus::Pending],
            ['carol@example.com', 'Carol', 'Leclerc', 'Max', 'Beagle', '2021-11-05', BookingStatus::Cancelled],
        ];

        foreach ($usersData as [$email, $firstName, $lastName, $dogName, $breed, $birthDate, $bookingStatus]) {
            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
            $user->setPassword($this->hasher->hashPassword($user, 'password'));
            $user->setDaycare($daycare);
            $manager->persist($user);

            $dog = new Dog();
            $dog->setName($dogName);
            $dog->setBreed($breed);
            $dog->setBirthDate(new \DateTimeImmutable($birthDate));
            $dog->setOwner($user);
            $dog->setDaycare($daycare);
            $manager->persist($dog);

            $booking = new Booking();
            $booking->setDog($dog);
            $booking->setDaycare($daycare);
            $booking->setStartDate(new \DateTimeImmutable('+7 days'));
            $booking->setEndDate(new \DateTimeImmutable('+9 days'));
            $booking->setStatus($bookingStatus);
            $manager->persist($booking);
        }

        $manager->flush();
    }
}
