<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Booking;
use App\Enum\BookingStatus;
use PHPUnit\Framework\TestCase;

class BookingTest extends TestCase
{
    public function testIsPendingReturnsTrueOnlyForPendingStatus(): void
    {
        $booking = new Booking();

        $booking->setStatus(BookingStatus::Pending);
        $this->assertTrue($booking->isPending());

        $booking->setStatus(BookingStatus::Confirmed);
        $this->assertFalse($booking->isPending());
    }

    public function testIsCancellableRequiresPendingOrConfirmedStatus(): void
    {
        $booking = new Booking();
        $booking->setStartDate(new \DateTimeImmutable('+3 days'));
        $booking->setEndDate(new \DateTimeImmutable('+3 days +1 hour'));

        $booking->setStatus(BookingStatus::Pending);
        $this->assertTrue($booking->isCancellable());

        $booking->setStatus(BookingStatus::Confirmed);
        $this->assertTrue($booking->isCancellable());

        $booking->setStatus(BookingStatus::Completed);
        $this->assertFalse($booking->isCancellable());

        $booking->setStatus(BookingStatus::Cancelled);
        $this->assertFalse($booking->isCancellable());
    }

    public function testIsCancellableRequiresMoreThanOneDayNotice(): void
    {
        $booking = new Booking();
        $booking->setStatus(BookingStatus::Confirmed);

        $booking->setStartDate(new \DateTimeImmutable('+2 hours'));
        $booking->setEndDate(new \DateTimeImmutable('+3 hours'));
        $this->assertFalse($booking->isCancellable());

        $booking->setStartDate(new \DateTimeImmutable('+2 days'));
        $booking->setEndDate(new \DateTimeImmutable('+2 days +1 hour'));
        $this->assertTrue($booking->isCancellable());
    }
}
