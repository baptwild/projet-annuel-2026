<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class LoginController extends AbstractController
{
    // The firewall's json_login listener intercepts this route before it executes.
    #[Route('/auth/login', name: 'auth_login', methods: ['POST'])]
    public function __invoke(): JsonResponse
    {
        throw new \LogicException('The json_login firewall listener should handle this route.');
    }
}
