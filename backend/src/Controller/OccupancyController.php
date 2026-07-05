<?php

namespace App\Controller;

use App\Entity\Daycare;
use App\Repository\BookingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class OccupancyController extends AbstractController
{
    public function __construct(private BookingRepository $bookingRepo) {}

    #[Route('/api/daycares/{id}/occupancy', name: 'daycare_occupancy', methods: ['GET'])]
    public function __invoke(Daycare $daycare, Request $request): JsonResponse
    {
        $dateStr = $request->query->get('date');
        if (!$dateStr || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) {
            return $this->json(['message' => 'date parameter required (YYYY-MM-DD)'], Response::HTTP_BAD_REQUEST);
        }

        $dayStart = new \DateTimeImmutable($dateStr . ' 00:00:00');
        $dayEnd   = new \DateTimeImmutable($dateStr . ' 23:59:59');

        $bookings = $this->bookingRepo->findByDaycareAndDateRange($daycare, $dayStart, $dayEnd);

        $dogs = array_map(fn($b) => [
            'name'  => $b->getDog()->getName(),
            'breed' => $b->getDog()->getBreed(),
        ], $bookings);

        $count = count($dogs);
        $max   = $daycare->getMaxDogsPerDay();

        return $this->json([
            'date'   => $dateStr,
            'count'  => $count,
            'max'    => $max,
            'isFull' => $max !== null && $count >= $max,
            'dogs'   => $dogs,
        ]);
    }
}
