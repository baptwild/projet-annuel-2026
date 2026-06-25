<?php

namespace App\Repository;

use App\Entity\Booking;
use App\Entity\Daycare;
use App\Enum\BookingStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    /** Returns the first active (confirmed or pending) booking for a dog on a given day, or null. */
    public function findActiveDogBookingOnDay(\App\Entity\Dog $dog, \DateTimeImmutable $start, \DateTimeImmutable $end): ?Booking
    {
        return $this->createQueryBuilder('b')
            ->where('b.dog = :dog')
            ->andWhere('b.startDate <= :end')
            ->andWhere('b.endDate >= :start')
            ->andWhere('b.status IN (:statuses)')
            ->setParameter('dog', $dog)
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->setParameter('statuses', [BookingStatus::Confirmed, BookingStatus::Pending])
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /** Bookings confirmed or pending for a daycare on a given day (for occupancy check). */
    public function findByDaycareAndDateRange(Daycare $daycare, \DateTimeImmutable $start, \DateTimeImmutable $end): array
    {
        return $this->createQueryBuilder('b')
            ->where('b.daycare = :daycare')
            ->andWhere('b.startDate <= :end')
            ->andWhere('b.endDate >= :start')
            ->andWhere('b.status IN (:statuses)')
            ->setParameter('daycare', $daycare)
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->setParameter('statuses', [BookingStatus::Confirmed, BookingStatus::Pending])
            ->getQuery()
            ->getResult();
    }
}
