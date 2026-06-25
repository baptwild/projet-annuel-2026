<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Booking;

final class BookingProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $inner,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Booking && $data->getDaycare() === null && $data->getDog() !== null) {
            $data->setDaycare($data->getDog()->getDaycare());
        }

        return $this->inner->process($data, $operation, $uriVariables, $context);
    }
}
