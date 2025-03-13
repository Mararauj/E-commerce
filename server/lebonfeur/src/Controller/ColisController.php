<?php

namespace App\Controller;

use App\Entity\Colis;
use App\Entity\Whitelist;
use App\Entity\User;
use App\Entity\ColisItem;
use App\Entity\Products;
use App\Entity\Cb;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

class ColisController extends AbstractController
{

    #[Route('/api/shipping', name: 'api_shipping', methods: ['POST'])]
    public function shipping(Request $request, EntityManagerInterface $em, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $send = $data['send'];
        $weight = $data['weight'];
        $destinationCountry = $data['destinationCountry'];
        $length = $data['length'];
        $width = $data['width'];
        $height = $data['height'];

        $destinationCountry = explode(";",$destinationCountry);
        $destinationCountry = end($destinationCountry);


        // Calcul des frais de port
        $whitelistEntry = $em->getRepository(Whitelist::class)->findOneBy(['country' => $destinationCountry]);

        if (!$whitelistEntry) {
            return new JsonResponse([
                'error' => 'Destination country not in the whitelist'
            ], 400);
        }


        $baseCost = 3.0; // Coût de base
        $costPerKg = 1.0; // Coût par kg
        $volume = $length * $width * $height / 1000000; // Calcul du volume en mètres cubes
        $costPerCubicMeter = 0.05; // Coût par mètre cube

        // Définir un coût supplémentaire en fonction du pays de destination
        $countryCostMultiplier = $whitelistEntry->getPrice();

        $shippingCost = $baseCost + (($costPerKg * $weight) + ($costPerCubicMeter * $volume)) * $countryCostMultiplier;

        if($send === 'true'){
            $user_id = $data['userId'];
            if(!$user_id){
                $user = null;
                $mail = $data['email'];
                $nom = $data['nom'];
            }
            else{
                $user = $em->getRepository(User::class)->find($user_id);
                $us = true;
            }
            $cadeau = $data['cadeau'];
            $livraison = $data['livraison'];
            $total = $data['total'];
            $prixLivraison = $data['prixLivraison'];
            $moyen = $data['moyen'];

            //Création de numero de suivi
            $uuid = Uuid::uuid4()->toString();
            $trackingNumber = preg_replace('/\D/', '', $uuid);
            $trackingNumber = substr($trackingNumber, 0, 12);

            $colis = new Colis();
            $colis->setTracking($trackingNumber);
            $colis->setStatus('En préparation');
            $colis->setDestination($data['destinationCountry']);
            $dateTime = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
            $colis->setDate($dateTime);
            $colis->setCadeau($cadeau);
            $colis->setLivraison($livraison);
            $colis->setUser($user);
            $colis->setTotal($total);
            $colis->setPriceOfShipping($prixLivraison);
            $colis->setPayment($moyen);

            $cartItems = $data['cart'] ?? [];
            foreach ($cartItems as $item) {
                $product = $em->getRepository(Products::class)->find($item['product_id']);
                if ($product) {
                    $product->setStock($product->getStock() - $item['quantity']);
                    $colisItem = new ColisItem();
                    $colisItem->setColis($colis);
                    $colisItem->setProductId($product);
                    $colisItem->setProductName($item['name']);
                    $colisItem->setQuantity($item['quantity']);
                    $colisItem->setPriceAtPurchase($item['price']);
                    $em->persist($colisItem);
                }
            }

            $em->persist($colis);
            $em->flush();
            $trackingUrl = 'http://localhost:3000/tracking/' . $trackingNumber;
            if(isset($us)){
                $email = (new Email())
                    ->from(new Address('m.figueiredo367@gmail.com', 'LeBonFeuxRouge'))
                    ->to($user->getEmail())
                    ->subject('Confirmation de votre commande')
                    ->text('Merci pour votre commande sur notre site ! Votre numéro de suivi est : ' . $trackingNumber)
                    ->html('<p>Bonjour ' . htmlspecialchars($user->getPrenom()) . ',</p>
                            <p>Merci pour votre commande sur LeBonFeuxRouge !</p>
                            <p>Nous sommes heureux de vous informer que votre commande est en préparation.</p>
                            <p>Vous pouvez suivre l\'avancement de votre livraison avec le numéro de suivi suivant :
                            <a href="' . htmlspecialchars($trackingUrl, ENT_QUOTES, 'UTF-8') . '" target="_blank" rel="noopener noreferrer">
                            <strong>' . htmlspecialchars($trackingNumber, ENT_QUOTES, 'UTF-8') . '</strong>
                            </a></p>
                            <p>Nous espérons que vous serez satisfait de votre achat. Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                            <p>À très bientôt,</p>
                            <p>L’équipe LeBonFeuxRouge</p>');

                $mailer->send($email);
            }
            else{
                $email = (new Email())
                    ->from(new Address('m.figueiredo367@gmail.com', 'LeBonFeuxRouge'))
                    ->to($mail)
                    ->subject('Confirmation de votre commande')
                    ->text('Merci pour votre commande sur notre site ! Votre numéro de suivi est : ' . $trackingNumber)
                    ->html('<p>Bonjour ' . htmlspecialchars($nom) . ',</p>
                            <p>Merci pour votre commande sur LeBonFeuxRouge ! Nous sommes heureux de vous informer que votre commande est en préparation.</p>
                            <p>Vous pouvez suivre l\'avancement de votre livraison avec le numéro de suivi suivant :
                            <p>Vous pouvez suivre l\'avancement de votre livraison avec le numéro de suivi suivant :
                            <a href="' . htmlspecialchars($trackingUrl, ENT_QUOTES, 'UTF-8') . '" target="_blank" rel="noopener noreferrer">
                            <strong>' . htmlspecialchars($trackingNumber, ENT_QUOTES, 'UTF-8') . '</strong>
                            </a></p>
                            <p>Nous espérons que vous serez satisfait de votre achat. Si vous avez des questions, n\'hésitez pas à nous contacter.</p>
                            <p>À très bientôt,</p>
                            <p>L’équipe LeBonFeuxRouge</p>');

                $mailer->send($email);
            }
            return new JsonResponse([
                'message' => $trackingNumber
            ]);

        }
        else{
            return new JsonResponse([
                'shippingCost' => round($shippingCost, 2)
            ]);
        }
    }


    #[Route('/api/track/{trackingNumber}', name: 'api_track', methods: ['GET'])]
    public function track($trackingNumber, EntityManagerInterface $em): JsonResponse
    {
        $colis = $em->getRepository(Colis::class)->findOneBy(['trackingnbr' => $trackingNumber]);

        if (!$colis) {
            return new JsonResponse(['error' => 'Tracking number not found'], 404);
        }

        $createdAt = $colis->getDate();
        $timezone = new \DateTimeZone('Europe/Paris');
        $now = new \DateTime('now', $timezone);
        $nowString = $now->format('Y-m-d H:i:s');
        $createdAtString = $createdAt->format('Y-m-d H:i:s');
        $nowTimestamp = strtotime($nowString);
        $createdAtTimestamp = strtotime($createdAtString);
        $difference_in_seconds = abs($createdAtTimestamp - $nowTimestamp);
        $minutesElapsed =  round($difference_in_seconds / 60,1);

        if ($minutesElapsed > 8 && $colis->getStatus() !== 'Livré') {
            $colis->setStatus('Livré');
        }
        elseif (($minutesElapsed <= 8 && $minutesElapsed >= 6) && $colis->getStatus() !== 'En cours de livraison') {
            $colis->setStatus('En cours de livraison');
        }
        elseif (($minutesElapsed <= 6 && $minutesElapsed >= 4) && $colis->getStatus() !== 'Arrivé à votre centre de distribution') {
            $colis->setStatus('Arrivé à votre centre de distribution');
        }
        elseif (($minutesElapsed >= 2 && $minutesElapsed <= 4) && $colis->getStatus() !== 'Remis au transporteur') {
            $colis->setStatus('Remis au transporteur');
        }

        $em->flush();

        return new JsonResponse([
            'status' => $colis->getStatus(),
            'country' => $colis->getDestination(),
            'delivery' => $colis->getLivraison()
        ]);
    }

    #[Route('/api/order', name: 'api_order', methods: ['POST'])]
    public function getOrder(Request $request, EntityManagerInterface $em): JsonResponse
    {

        $data = json_decode($request->getContent(), true);
        $orderId = $data['orderId'];

        $colis = $em->getRepository(Colis::class)->find($orderId);

        if (!$colis) {
            return new JsonResponse(['error' => 'Order not found'], 404);
        }

        $orderData = [
            'orderId' => $colis->getId(),
            'trackingNumber' => $colis->getTracking(),
            'date' => $colis->getDate()->format('Y-m-d H:i:s'),
            'delivery' => $colis->getLivraison(),
            'total' => $colis->getTotal(),
            'shippingCost' => $colis->getPriceOfShipping(),
            'payment' => $colis->getPayment(),
            'destination' => $colis->getDestination(),
            'products' => []
        ];

        foreach ($colis->getAllitems() as $item) {
            $orderData['products'][] = [
                'productName' => $item->getProductName(),
                'quantity' => $item->getQuantity(),
                'priceAtPurchase' => $item->getPriceAtPurchase(),
            ];
        }

        return new JsonResponse($orderData);
    }

    #[Route('/api/user/orders', name: 'api_user_orders', methods: ['POST'])]
    public function getUserOrders(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $data['userId'];

        $orders = $em->getRepository(Colis::class)->findBy(['user' => $user]);

        $ordersData = [];
        foreach ($orders as $order) {
            $ordersData[] = [
                'orderId' => $order->getId(),
                'trackingNumber' => $order->getTracking(),
            ];
        }

        return new JsonResponse($ordersData);
    }

    #[Route('/api/check_cvv', name: 'api_check_cvv', methods: ['POST'])]
    public function check_cvv(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $cardId = $data['cardId'];
        $cardCvv = $data['cardCvv'];

        $card = $em->getRepository(Cb::class)->findOneBy(['id' => $cardId]);

        if (!$card || !password_verify($cardCvv, $card->getCvv())) {
          return new JsonResponse(['message' => 'Wrong Cvv']);
        }

      return new JsonResponse(true);
    }

    #[Route('/api/orders', name: 'api_orders', methods: ['GET'])]
    public function Orders(EntityManagerInterface $em): JsonResponse
    {
        $colisList = $em->getRepository(Colis::class)->findAll();

        $orderDataList = [];

        foreach ($colisList as $colis) {
            $orderData = [
                'orderId' => $colis->getId(),
                'trackingNumber' => $colis->getTracking(),
                'date' => $colis->getDate()->format('Y-m-d H:i:s'),
                'delivery' => $colis->getLivraison(),
                'user_id' => $colis->getUser() ? $colis->getUser()->getId() : null,
                'payment' => $colis->getPayment(),
                'products' => []
            ];

            foreach ($colis->getAllitems() as $item) {
                $orderData['products'][] = [
                    'productName' => $item->getProductName(),
                    'quantity' => $item->getQuantity(),
                    'priceAtPurchase' => $item->getPriceAtPurchase(),
                ];
            }

            $orderDataList[] = $orderData;
        }

        return new JsonResponse($orderDataList);

    }

    //Envoie email Support

    #[Route('/api/support_send', name: 'api_support_send', methods: ['POST'])]
    public function support_send(Request $request, EntityManagerInterface $em, MailerInterface $mailer): JsonResponse
    {
      $data = json_decode($request->getContent(), true);

      $name = $data["name_support"];
      $email = $data["email_support"];
      $subject = $data["subject_support"];
      $message = $data["message_support"];

      $email = (new Email())
                    ->from(new Address('m.figueiredo367@gmail.com', 'LeBonFeuxRouge'))
                    ->to("m.figueiredo367@gmail.com")
                    ->subject($subject)
                    ->html($message . "<br><br><br>" . "<p>Nom du client : $name</p><p>Email du client : $email</p>");
                $mailer->send($email);

                return new JsonResponse(["message", "email send"]);
    }


}
