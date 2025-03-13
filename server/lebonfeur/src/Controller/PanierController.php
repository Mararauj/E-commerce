<?php

namespace App\Controller;

use App\Entity\Panier;
use App\Entity\Products;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class PanierController extends AbstractController
{
    #[Route('/api/addpanier', name: 'api_add_panier', methods: ['POST'])]
    public function addProduct(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $product = $entityManager->getRepository(Products::class)->find($data['product_id']);
        $user = $entityManager->getRepository(User::class)->find($data['user_id']);

        $panier = $entityManager->getRepository(Panier::class)->findOneBy([
            'produit' => $product,
            'user' => $user,
        ]);


        $requestedQuantity = $data['quantity'];
        $currentQuantityInCart = $panier ? $panier->getQuantity() : 0;
        $totalQuantity = $currentQuantityInCart + $requestedQuantity;

        if ($totalQuantity > $product->getStock()) {
            return new JsonResponse(['error' => 'Requested quantity exceeds stock'], Response::HTTP_BAD_REQUEST);
        }

        if ($panier) {
            $panier->setQuantity($totalQuantity);
        }
        else {
            $panier = new Panier();
            $panier->setProduit($product);
            $panier->setUser($user);
            $panier->setQuantity($data['quantity']);
            $entityManager->persist($panier);
        }

        $entityManager->flush();

        return new JsonResponse(['status' => 'Product added to cart'], Response::HTTP_CREATED);
    }

    #[Route('/api/cart/{userId}', name: 'api_get_cart', methods: ['GET'])]
    public function getCart(int $userId, EntityManagerInterface $entityManager): Response
    {
        $user = $entityManager->getRepository(User::class)->find($userId);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $paniers = $entityManager->getRepository(Panier::class)->findBy(['user' => $user]);

        foreach ($paniers as $panier) {
            $product = $panier->getProduit();
            $stock = $product->getStock();
            $quantity = $panier->getQuantity();


            if ($quantity > $stock) {
                $panier->setQuantity($stock);
                $entityManager->persist($panier);
            }

            if ($panier->getQuantity() <= 0) {
                $entityManager->remove($panier);
            }
        }
        $entityManager->flush();

        $paniers = $entityManager->getRepository(Panier::class)->findBy(['user' => $user]);

        $items = array_map(function (Panier $panier) {
            $product = $panier->getProduit();
            $images = $product->getImages();
            $image = $images[0]->getImgname();

            return [
                'id' => $panier->getId(),
                'product_id' => $product->getId(),
                'name' => $product->getTitle(),
                'stock' => $product->getStock(),
                'price' => $product->getPrice(),
                'quantity' => $panier->getQuantity(),
                'width' => $product->getWidth(),
                'weight' => $product->getWeight(),
                'height' => $product->getHeight(),
                'length'=> $product->getLength(),
                'image' => $image,
                'avg_score' => $product->getAvgscore(),
            ];
        }, $paniers);

        return new JsonResponse($items, Response::HTTP_OK);
    }

    #[Route('/api/cart/{itemId}', name: 'api_remove_item', methods: ['DELETE'])]
    public function removeItem(int $itemId, EntityManagerInterface $entityManager): Response
    {
        $panier = $entityManager->getRepository(Panier::class)->find($itemId);

        if (!$panier) {
            return new JsonResponse(['error' => 'Item not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($panier);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Item removed from cart'], Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/cart/{itemId}', name: 'api_update_cart_item', methods: ['PUT'])]
    public function updateCartItem(int $itemId, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $item = $entityManager->getRepository(Panier::class)->find($itemId);
        $item->setQuantity($data['quantity']);

        $entityManager->flush();

        return new JsonResponse(['status' => 'Item updated'], Response::HTTP_OK);
    }

    #[Route('/api/cart/user/{userId}', name: 'api_clear_cart', methods: ['DELETE'])]
    public function clearCart(int $userId, EntityManagerInterface $entityManager): Response
    {
        $panierItems = $entityManager->getRepository(Panier::class)->findBy(['user' => $userId]);

        if (count($panierItems) !== 0) {

            foreach ($panierItems as $item) {
                $entityManager->remove($item);
            }

            $entityManager->flush();
        }


        return new JsonResponse(['status' => 'All items removed from cart'], Response::HTTP_NO_CONTENT);
    }
}
