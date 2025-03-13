<?php

namespace App\Controller;

use App\Entity\Products;
use App\Repository\ProductsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class AccueilController extends AbstractController
{
    #[Route('/api/all', name: 'api_all', methods: ['GET'])]
    public function index(ProductsRepository $productsRepository): Response
    {
        $products = $productsRepository->findAll();

        $data = [];

        foreach ($products as $product) {
            $productData = [
                'id' => $product->getId(),
                'title' => $product->getTitle(),
                'description' => $product->getDesc(),
                'quantity' => $product->getStock(),
                'price' => $product->getPrice(),
                'promo' => $product->getPromo(),
                'width' => $product->getWidth(),
                'weight' => $product->getWeight(),
                'height' => $product->getHeight(),
                'length'=> $product->getLength(),
                'category' => $product->getCategory()->getName(),
                'images' => [],
                'vues' => $product->getVues(),
                'date' => $product->getDate(),
                'avg_score' => $product->getAvgscore(),
            ];

            foreach ($product->getImages() as $image) {
                $productData['images'][] = $image->getImgname();
            }

            $data[] = $productData;
        }

        return new JsonResponse($data);
    }
}
