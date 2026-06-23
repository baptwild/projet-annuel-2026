<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Booking;
use App\Entity\Daycare;
use App\Entity\Dog;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

class TenantExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    public function __construct(private readonly Security $security) {}

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        $user = $this->security->getUser();

        // Not logged in or super admin sees everything
        if (!$user instanceof User || $this->security->isGranted('ROLE_SUPER_ADMIN')) {
            return;
        }

        // Daycare resource: only super admin can list all, handled by access_control
        if ($resourceClass === Daycare::class) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $daycareId = $user->getDaycare()->getId();

        match ($resourceClass) {
            User::class => $queryBuilder
                ->andWhere("$alias.daycare = :daycare")
                ->setParameter('daycare', $daycareId),

            Dog::class => $queryBuilder
                ->andWhere("$alias.daycare = :daycare")
                ->setParameter('daycare', $daycareId),

            Booking::class => $queryBuilder
                ->andWhere("$alias.daycare = :daycare")
                ->setParameter('daycare', $daycareId),

            default => null,
        };

        // Regular users only see their own dogs and bookings
        if (!$this->security->isGranted('ROLE_ADMIN')) {
            match ($resourceClass) {
                Dog::class => $queryBuilder
                    ->andWhere("$alias.owner = :me")
                    ->setParameter('me', $user->getId()),

                Booking::class => $queryBuilder
                    ->join("$alias.dog", 'dog_filter')
                    ->andWhere('dog_filter.owner = :me')
                    ->setParameter('me', $user->getId()),

                default => null,
            };
        }
    }
}
