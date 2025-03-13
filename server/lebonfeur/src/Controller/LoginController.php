<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class LoginController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email']) || !isset($data['mdp'])) {
            return new JsonResponse(['message' => 'Invalid input'], Response::HTTP_BAD_REQUEST);
        }

        $email = $data['email'];
        $mdp = $data['mdp'];

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user || !password_verify($mdp, $user->getMdp())) {
            return new JsonResponse(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse(['message' => 'Login successful', 'id' => $user->getId(), 'prenom' => $user->getPrenom(), 'nom' => $user->getNom(), 'email' => $user->getEmail(), 'admin' => $user->isAd()], Response::HTTP_OK);
    }
}
