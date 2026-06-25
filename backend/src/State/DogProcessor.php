<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Dog;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

final class DogProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $inner,
        private readonly Security $security,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Dog && $data->getOwner() === null) {
            /** @var User $user */
            $user = $this->security->getUser();
            $data->setOwner($user);
            $data->setDaycare($user->getDaycare());
        }

        return $this->inner->process($data, $operation, $uriVariables, $context);
    }
}
