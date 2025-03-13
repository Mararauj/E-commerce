<?php

namespace App\Controller;

use App\Entity\Whitelist;
use App\Repository\WhitelistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WhitelistController extends AbstractController
{
    #[Route('/api/whitelist', name: 'app_whitelist')]
    public function index(WhitelistRepository $whitelistRepository): Response
    {
        $whitelist = $whitelistRepository->findAll();
        $countries = [];
        foreach ($whitelist as $country) {
            $countryData = [
                'id' => $country->getId(),
                'name' => $country->getCountry(),
                'price' => $country->getPrice(),
            ];
            $countries[] = $countryData;
        }
        return new JsonResponse($countries);
    }
    #[Route('/api/addwhitelist', name: 'app_addwhitelist', methods: ['POST'])]
    public function addWhitelist(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $whitelist = $entityManager->getRepository(Whitelist::class)->findOneBy(['country' => $data['country']]);
        if ($whitelist) {
            return new JsonResponse(['status' => 'Country not added', 'message' => 'Country already in list'], Response::HTTP_BAD_REQUEST);
        }

        $whitelist = new Whitelist();
        $whitelist->setCountry($data['country']);
        $whitelist->setPrice($data['price']);

        $entityManager->persist($whitelist);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Country  added'], Response::HTTP_CREATED);
    }
    #[Route('/api/delwhitelist/{id}', name: 'app_delwhitelist', methods: ['DELETE'])]
    public function deleteWhitelist(int $id, EntityManagerInterface $entityManager): Response
    {
        $country = $entityManager->getRepository(Whitelist::class)->find($id);
        $entityManager->remove($country);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Country deleted from list'], Response::HTTP_OK);
    }
    #[Route('/api/updwhitelist/{id}', name: 'app_updwhitelist', methods: ['PUT'])]
    public function updateCountry(int $id, Request $request, EntityManagerInterface $entityManager): Response
    {
        $country = $entityManager->getRepository(Whitelist::class)->find($id);

        if (!$country) {
            return new JsonResponse(['error' => 'Country not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $country->setPrice($data['price']);
        $entityManager->persist($country);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Country updated'], Response::HTTP_OK);
    }
}
