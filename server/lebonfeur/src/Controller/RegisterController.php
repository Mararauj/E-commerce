<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setEmail($data['email']);
        $user->setMdp(password_hash($data['mdp'], PASSWORD_DEFAULT));
        $user->setAd(0);

        $entityManager->persist($user);
        $entityManager->flush();

        $email = (new Email())
            ->from(new Address('m.figueiredo367@gmail.com', 'LeBonFeuxRouge'))
            ->to($data['email'])
            ->subject('Confirmation d\'inscription')
            ->text('Merci de vous être inscrit sur notre site!')
            ->html('<p>Bonjour ' . htmlspecialchars($data['prenom']) . ',</p><p>Merci de vous être inscrit sur LeBonFeuxRouge !</p><p>Nous sommes ravis de vous compter parmi nous et espérons que vous apprécierez votre expérience.</p><p>À très bientôt,</p><p>L’équipe LeBonFeuxRouge</p>');

        $mailer->send($email);

        return new JsonResponse(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }
}
