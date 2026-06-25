<?php

namespace App\Controller;

use App\Entity\Daycare;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegisterController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $hasher,
        private readonly ValidatorInterface $validator,
    ) {}

    #[Route('/auth/register', name: 'auth_register', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'], $data['daycareId'])) {
            return $this->json(['message' => 'email, password and daycareId are required'], Response::HTTP_BAD_REQUEST);
        }

        $daycare = $this->em->find(Daycare::class, $data['daycareId']);
        if (!$daycare || !$daycare->isActive()) {
            return $this->json(['message' => 'Daycare not found or inactive'], Response::HTTP_NOT_FOUND);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->hasher->hashPassword($user, $data['password']));
        $user->setDaycare($daycare);
        if (!empty($data['firstName'])) $user->setFirstName($data['firstName']);
        if (!empty($data['lastName'])) $user->setLastName($data['lastName']);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $messages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->em->persist($user);
        $this->em->flush();

        return $this->json(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }
}
