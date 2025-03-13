<?php

namespace App\Controller;

use App\Entity\Products;
use App\Entity\Images;
use App\Entity\Categories;
use App\Entity\Panier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class CrudProductsController extends AbstractController
{
    #[Route('/api/add', name: 'api_add', methods: ['POST'])]
    public function addProduct(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $product = new Products();
        $product->setTitle($data['title']);
        $product->setDesc($data['description']);
        $product->setPrice($data['price']);
        $product->setStock($data['quantity']);
        $product->setPromo($data['promo']);
        $product->setWidth($data['width']);
        $product->setWeight($data['weight']);
        $product->setHeight($data['height']);
        $product->setLength($data['length']);
        $product->setDate(new \DateTime());
        
        $category = $entityManager->getRepository(Categories::class)->findOneBy(['name' => $data['category']]);
        if (!$category) {
            $category = new Categories();
            $category->setName($data['category']);
            $entityManager->persist($category);
            $entityManager->flush();
        }

        $product->setCategory($category);

        $entityManager->persist($product);

        foreach ($data['images'] as $imgName) {
            $image = new Images();
            $image->setImgname($imgName);
            $image->setProduct($product);

            $entityManager->persist($image);
        }

        $entityManager->flush();

        return new JsonResponse(['status' => 'Product created'], Response::HTTP_CREATED);
    }

    #[Route('/api/delete/{id}', name: 'api_delete', methods: ['DELETE'])]
    public function deleteProduct(int $id, Request $request, EntityManagerInterface $entityManager): Response
    {
        $product = $entityManager->getRepository(Products::class)->findOneBy(['id' => $id]);

        $images = $product->getImages();
        foreach ($images as $image) {
            $entityManager->remove($image);
        }

        $cartItems = $entityManager->getRepository(Panier::class)->findBy(['produit' => $product]);
        foreach ($cartItems as $cartItem) {
            $entityManager->remove($cartItem);
        }

        $entityManager->remove($product);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Product deleted'], Response::HTTP_OK);
    }

    #[Route('/api/addCategory', name: 'api_add_category', methods: ['POST'])]
    public function addCategory(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $category = $entityManager->getRepository(Categories::class)->findOneBy(['name' => $data['name']]);
        if ($category) {
            return new JsonResponse(['status' => 'Category not created', 'message' => 'Category already exists'], Response::HTTP_BAD_REQUEST);
        }

        $category = new Categories();
        $category->setName($data['name']);
    
        $entityManager->persist($category);
        $entityManager->flush();
    
        return new JsonResponse(['status' => 'Category created'], Response::HTTP_CREATED);
    }

    #[Route('/api/categories', name: 'api_get_categories', methods: ['GET'])]
    public function getCategories(EntityManagerInterface $entityManager): Response
    {
        $categories = $entityManager->getRepository(Categories::class)->findAll();
        $categoriesArray = [];

        foreach ($categories as $category) {
            $categoriesArray[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
            ];
        }

        return new JsonResponse($categoriesArray, Response::HTTP_OK);
    }

    #[Route('/api/deleteImage/{id<\d+>}', name: 'api_delete_image', methods: ['DELETE'])]
    public function deleteImage(int $id, EntityManagerInterface $entityManager): Response
    {
        $image = $entityManager->getRepository(Images::class)->findOneBy(['id' => $id]);
        if ($image) {
            $entityManager->remove($image);
            $entityManager->flush();
            return new JsonResponse(['status' => 'Image deleted'], Response::HTTP_OK);
        }
        return new JsonResponse(['status' => 'Image not found'], Response::HTTP_NOT_FOUND);
    }

    #[Route('/api/img/product/{id}', name: 'api_product_images', methods: ['GET'])]
    public function getProductImages(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $product = $entityManager->getRepository(Products::class)->find($id);
        
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $images = [];
        foreach ($product->getImages() as $image) {
            $images[] = [
                'id' => $image->getId(),
                'imgname' => $image->getImgname(),
            ];
        }

        return new JsonResponse($images, Response::HTTP_OK);
    }

    #[Route('/api/update/{id}', name: 'api_update', methods: ['PUT'])]
    public function updateProduct(int $id, Request $request, EntityManagerInterface $entityManager): Response
    {
        $product = $entityManager->getRepository(Products::class)->find($id);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $product->setTitle($data['title']);
        $product->setDesc($data['description']);
        $product->setPromo($data['promo']);
        $product->setPrice($data['price']);
        $product->setStock($data['quantity']);
        $product->setWidth($data['width']);
        $product->setWeight($data['weight']);
        $product->setHeight($data['height']);
        $product->setLength($data['length']);
        
        $category = $entityManager->getRepository(Categories::class)->findOneBy(['name' => $data['category']]);
        if (!$category) {
            $category = new Categories();
            $category->setName($data['category']);
            $entityManager->persist($category);
            $entityManager->flush();
        }

        $product->setCategory($category);

    
        foreach ($data['images'] as $imageName) {
            $imageExists = false;
            foreach ($product->getImages() as $existingImage) {
                if ($existingImage->getImgname() === $imageName) {
                    $imageExists = true;
                    break;
                }
            }

            if (!$imageExists) {
                $image = new Images();
                $image->setImgname($imageName);
                $image->setProduct($product);
                $entityManager->persist($image);
            }
        }

        $entityManager->flush();

        return new JsonResponse(['status' => 'Product updated'], Response::HTTP_OK);
    }

    #[Route('/api/deleteCategory/{id}', name: 'api_deleteCat', methods: ['DELETE'])]
    public function deleteCategory(int $id, EntityManagerInterface $entityManager): Response
    {
        $category = $entityManager->getRepository(Categories::class)->find($id);
        $products = $entityManager->getRepository(Products::class)->findBy(['category' => $category]);

        if (count($products) > 0) {
            $category->setName('none');
            $entityManager->flush();

            return new JsonResponse(['status' => 'Category deleted'], Response::HTTP_OK);
        } else {
            $entityManager->remove($category);
            $entityManager->flush();

            return new JsonResponse(['status' => 'Category deleted'], Response::HTTP_OK);
        }
    }

}
