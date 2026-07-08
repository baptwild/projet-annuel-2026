<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\Exception\ValidationException;
use App\Entity\Booking;
use App\Repository\BookingRepository;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;

final class BookingProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $inner,
        private readonly BookingRepository $bookingRepo,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Booking) {
            return $this->inner->process($data, $operation, $uriVariables, $context);
        }

        if ($data->getDaycare() === null && $data->getDog() !== null) {
            $data->setDaycare($data->getDog()->getDaycare());
        }

        if (($operation instanceof Post || $operation instanceof Patch) && $data->getDog() !== null && $data->getStartDate() !== null) {
            $dayStart = \DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data->getStartDate()->format('Y-m-d') . ' 00:00:00');
            $dayEnd   = \DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data->getStartDate()->format('Y-m-d') . ' 23:59:59');

            $conflict = $this->bookingRepo->findActiveDogBookingOnDay($data->getDog(), $dayStart, $dayEnd, $data->getId());

            if ($conflict !== null) {
                $violations = new ConstraintViolationList([
                    new ConstraintViolation(
                        sprintf('%s a déjà une réservation ce jour-là.', $data->getDog()->getName()),
                        null, [], $data, 'dog', $data->getDog()
                    ),
                ]);
                throw new ValidationException($violations);
            }
        }

        return $this->inner->process($data, $operation, $uriVariables, $context);
    }
}
