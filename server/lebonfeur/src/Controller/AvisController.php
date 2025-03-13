<?php

namespace App\Controller;

use App\Entity\Avis;
use App\Entity\Products;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AvisController extends AbstractController
{
    #[Route('/api/addavis', name: 'app_addavis', methods: ['POST'])]
    public function addAvis(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['product_id'], $data['user_id'], $data['avis'])) {
            return new JsonResponse(['message' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $product = $entityManager->getRepository(Products::class)->find($data['product_id']);
        $user = $entityManager->getRepository(User::class)->find($data['user_id']);

        if (!$product || !$user) {
            return new JsonResponse(['message' => 'Product or User not found'], Response::HTTP_NOT_FOUND);
        }

        $existingAvis = $entityManager->getRepository(Avis::class)->findOneBy([
            'product' => $product,
            'user' => $user
        ]);

        if ($existingAvis) {
            return new JsonResponse(['message' => 'You have already reviewed this product'], Response::HTTP_CONFLICT);
        }

        $avis = new Avis();
        $avis->setComment($data['avis']);
        $avis->setProduct($product);
        $avis->setUser($user);
        if (isset($data['rating']) && $data['rating'] >= 0 || $data['rating'] <= 5) {
            $avis->setRating($data['rating']);
        }
        $entityManager->persist($avis);
        $entityManager->flush();
        $product->updateAvgScore();
        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Comment registered successfully'], Response::HTTP_CREATED);
    }


    #[Route('/api/avis/{id}', name: 'app_avis', methods: ['GET'])]
    public function Avis(int $id, EntityManagerInterface $entityManager): JsonResponse
    {

        $avisList = $entityManager->getRepository(Avis::class)->findBy(['product' => $id]);

        $responseData = [];
        foreach ($avisList as $avis) {

            $user = $avis->getUser();

            $responseData[] = [
                'avis_id' => $avis->getId(),
                'comment' => $avis->getComment(),
                'rating' => $avis->getRating(),
                'user_id' => $user ? $user->getId() : null,
                'user_name' => $user ? $user->getPrenom() : null,
            ];
        }
        return new JsonResponse($responseData, Response::HTTP_OK);
    }

    #[Route('/api/modifyAvis/{id}', name: 'api_modifyAvis', methods: ['PUT'])]
    public function modifyAvis(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $avisId = $data["avisid"];
        $newComment = $data["comment"];
        $newRating = $data["rating"];

        $user = $entityManager->getRepository(User::class)->find($id);
        $avis = $entityManager->getRepository(Avis::class)->find($avisId);

        if ($user && $avis) {
            if ($avis->getUser()->getId() === $user->getId()) {
                if (empty($newComment)) {
                    $newComment = $avis->getComment();
                }
                $avis->setComment($newComment);
                if ($newRating !== $avis->getRating() && $newRating >= 0 && $newRating <= 5) {
                    $avis->setRating($newRating);
                }
                $entityManager->persist($avis);
                $avis->getProduct()->updateAvgScore();
                $entityManager->persist($avis->getProduct());
                $entityManager->flush();
                return new JsonResponse(['message' => 'Comment has been changed', 'comment' => $newComment], Response::HTTP_OK);
            } else {
                return new JsonResponse(['message' => 'Unauthorized action'], Response::HTTP_FORBIDDEN);
            }
        } else {
            return new JsonResponse(['message' => 'User or comment not found'], Response::HTTP_NOT_FOUND);
        }
    }

    #[Route('/api/deleteAvis/{id}', name: 'api_deleteAvis', methods: ['DELETE'])]
    public function deleteAvis(int $id, EntityManagerInterface $entityManager): Response
    {
        $avis = $entityManager->getRepository(Avis::class)->find($id);
        $product = $entityManager->getRepository(Products::class)->find($avis->getProduct());

        $entityManager->remove($avis);
        $entityManager->flush();
        $product->updateAvgScore();
        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Comment deleted'], Response::HTTP_OK);
    }
}