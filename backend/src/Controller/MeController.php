<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class MeController extends AbstractController
{
    #[Route('/auth/me', name: 'auth_me', methods: ['GET'])]
    public function __invoke(#[CurrentUser] User $user): JsonResponse
    {
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
            'daycare' => [
                'id' => $user->getDaycare()->getId(),
                'name' => $user->getDaycare()->getName(),
                'slug' => $user->getDaycare()->getSlug(),
                'openingTime' => $user->getDaycare()->getOpeningTime(),
                'closingTime' => $user->getDaycare()->getClosingTime(),
                'openDays' => $user->getDaycare()->getOpenDays(),
                'billingMode' => $user->getDaycare()->getBillingMode(),
                'pricePerUnit' => $user->getDaycare()->getPricePerUnit(),
                'priceHalfDay' => $user->getDaycare()->getPriceHalfDay(),
                'tierHoursThreshold' => $user->getDaycare()->getTierHoursThreshold(),
                'tierPrice' => $user->getDaycare()->getTierPrice(),
                'weeklyDiscountEnabled' => $user->getDaycare()->isWeeklyDiscountEnabled(),
                'weeklyDiscountThreshold' => $user->getDaycare()->getWeeklyDiscountThreshold(),
                'weeklyDiscountPercent' => $user->getDaycare()->getWeeklyDiscountPercent(),
                'maxDogsPerDay' => $user->getDaycare()->getMaxDogsPerDay(),
            ],
        ]);
    }
}
