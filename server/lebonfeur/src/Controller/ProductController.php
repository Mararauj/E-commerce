<?php

namespace App\Controller;

use App\Entity\Products;
use App\Entity\ColisItem;
use App\Entity\Colis;
use App\Repository\ProductsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;

class ProductController extends AbstractController
{
    #[Route('/api/product/{id}', name: 'api_product', methods: ['GET'])]
    public function getProductById(int $id, ProductsRepository $productsRepository, EntityManagerInterface $entityManager): Response
    {

        $product = $productsRepository->find($id);

        if (!$product) {
            return new JsonResponse(['message' => 'Aucun produit'], Response::HTTP_NOT_FOUND);
        }

        $product->setVues($product->getVues() + 1);

        $entityManager->persist($product);
        $entityManager->flush();

        $productData = [
            'id' => $product->getId(),
            'title' => $product->getTitle(),
            'description' => $product->getDesc(),
            'price' => $product->getPrice(),
            'quantity' => $product->getStock(),
            'category' => $product->getCategory()->getName(),
            'promo' => $product->getPromo(),
            'width' => $product->getWidth(),
            'weight' => $product->getWeight(),
            'height' => $product->getHeight(),
            'length' => $product->getLength(),
            'date' => $product->getDate(),
            'images' => [],
            'avgscore' => $product->getAvgscore(),
        ];

        foreach ($product->getImages() as $image) {
            $productData['images'][] = $image->getImgname();
        }

        return new JsonResponse($productData);
    }

    #[Route('/api/similarproducts/{id}', name: 'api_similar', methods: ['GET'])]
    public function getSimilarProducts(int $id, ProductsRepository $productsRepository, EntityManagerInterface $entityManager): Response
    {
        $product = $productsRepository->find($id);
        if (!$product) {
            return new JsonResponse(['message' => 'Aucun produit'], Response::HTTP_NOT_FOUND);
        }

        $category = $product->getCategory();
        $similarProducts = $productsRepository->findBy(['category' => $category]);

        $similarProductsData = [];

        foreach ($similarProducts as $similarProduct) {
            if ($similarProduct->getId() !== $product->getId()) {
                $similarProductsData[] = [
                    'id' => $similarProduct->getId(),
                    'title' => $similarProduct->getTitle(),
                    'description' => $similarProduct->getDesc(),
                    'price' => $similarProduct->getPrice(),
                    'quantity' => $similarProduct->getStock(),
                    'category' => $similarProduct->getCategory()->getName(),
                    'images' => array_map(function ($image) {
                        return $image->getImgname();
                    }, $similarProduct->getImages()->toArray()),
                    "avg_score" => $similarProduct->getAvgscore(),
                ];
            }
        }

        return new JsonResponse($similarProductsData);

    }

    #[Route('/api/recommend/{id}', name: 'api_add_views', methods: ['PUT'])]
    public function addViews(int $id, ProductsRepository $productsRepository, EntityManagerInterface $entityManager): Response
    {
        $product = $productsRepository->find($id);

        $product->setVues($product->getVues() + 500);
        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Produit recommandé']);
    }

    #[Route('/api/unrecommend/{id}', name: 'api_remove_views', methods: ['PUT'])]
    public function removeViews(int $id, ProductsRepository $productsRepository, EntityManagerInterface $entityManager): Response
    {
        $product = $productsRepository->find($id);

        $newViews = max(0, $product->getVues() - 500);
        $product->setVues($newViews);
        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Produit non recommandé']);
    }

    #[Route('/api/mostbuy', name: 'api_mostbuy', methods: ['GET'])]
    public function mostBuy(EntityManagerInterface $entityManager): Response
    {
        $panierItems = $entityManager->getRepository(ColisItem::class)->findAll();

        $productCounts = [];
        $productNames = [];

        foreach ($panierItems as $item) {
            $product = $item->getProductId();

            if ($product) {
                $productId = $product->getId();
                $productName = $product->getTitle();

                if (isset($productCounts[$productId])) {
                    $productCounts[$productId] += $item->getQuantity();
                } else {
                    $productCounts[$productId] = $item->getQuantity();
                    $productNames[$productId] = $productName;
                }
            }
        }

        $mostFrequentProductId = null;
        $maxCount = 0;

        foreach ($productCounts as $productId => $count) {
            if ($count > $maxCount) {
                $mostFrequentProductId = $productId;
                $maxCount = $count;
            }
        }

        if ($mostFrequentProductId !== null) {
            return new JsonResponse([
                'productName' => $productNames[$mostFrequentProductId],
                'total' => $maxCount
            ]);
        } else {
            return new JsonResponse(['message' => 'Aucun produit trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }
    }

    #[Route('/api/buyer', name: 'api_buyer', methods: ['GET'])]
    public function mostBuyer(EntityManagerInterface $entityManager): Response
    {
        $commandes = $entityManager->getRepository(Colis::class)->findAll();

        $userOrderCount = [];

        foreach ($commandes as $colis) {
            $user = $colis->getUser();
            if ($user) {
                $userId = $user->getId();
                if (!isset($userOrderCount[$userId])) {
                    $userOrderCount[$userId] = [
                        'user' => $user,
                        'count' => 0
                    ];
                }
                $userOrderCount[$userId]['count']++;
            }
        }
        $maxUser = null;
        $maxOrders = 0;
        foreach ($userOrderCount as $userId => $data) {
            if ($data['count'] > $maxOrders) {
                $maxOrders = $data['count'];
                $maxUser = $data['user'];
            }
        }

        $responseData = [
            'id' => $maxUser->getId(),
            'prenom' => $maxUser->getPrenom(),
            'nom' => $maxUser->getNom(),
            'email' => $maxUser->getEmail(),
            'total' => $maxOrders
        ];

        return new JsonResponse($responseData);
    }

}
