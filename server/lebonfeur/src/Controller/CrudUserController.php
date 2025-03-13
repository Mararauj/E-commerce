<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Info;
use App\Entity\Cb;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;


class CrudUserController extends AbstractController
{
  #[Route('/api/modifyUser', name: 'api_modifyUser', methods: ['POST'])]
  public function modifyUSer(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $id = $data["id"];
    $newPrenom = $data["newPrenom"];
    $newNom = $data["newNom"];

    $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

    if($user){
      if (empty($newPrenom)) {
        $newPrenom = $user->getPrenom();
      }
      if (empty($newNom)) {
        $newNom = $user->getNom();
      }

      $user->setPrenom($newPrenom);
      $user->setNom($newNom);
      $entityManager->persist($user);
      $entityManager->flush();
      return new JsonResponse(['message' => 'User names has been changed', 'prenom' => $newPrenom, 'nom' => $newNom], Response::HTTP_OK);
    }else{
      return new JsonResponse(['prenom' => $newPrenom, 'nom' => $newNom]);
    }
  }


  #[Route('/api/modifyEmail', name: 'api_modifyEmail', methods: ['POST'])]
  public function modifyEmail(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $id = $data["id"];
    $newEmail = $data["newEmail"];

    $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

    if($user){
      $user->setEmail($newEmail);
      $entityManager->persist($user);
      $entityManager->flush();
      return new JsonResponse(['message' => 'Email has been changed'], Response::HTTP_OK);
    }else{
      return new JsonResponse(['message' => 'No user found']);
    }
  }

  #[Route('/api/modifyPassword', name: 'api_modifyPassword', methods: ['POST'])]
  public function modifyPassword(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $id = $data["id"];
    $actualPassword = $data["actualPassword"];
    $newPassword = $data["newPassword"];
    $confirmPassword = $data["confirmPassword"];

    $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

    if($user){
      if(password_verify($actualPassword, $user->getMdp())){
        if ($newPassword == $confirmPassword) {
          $user->setMdp(password_hash($newPassword, PASSWORD_DEFAULT));
          $entityManager->persist($user);
          $entityManager->flush();
          return new JsonResponse(['message' => 'Password has been changed'], Response::HTTP_OK);
        }else{
          return new JsonResponse(['message' => 'Vos mots de passe ne sont pas correct']);
        }
      }else{
        return new JsonResponse(['message' => 'Votre mot de passe actuel est incorrect']);
      }
    }else{
      return new JsonResponse(['message' => 'No user found']);
    }
  }

  #[Route('/api/allAddress', name: 'api_allAddress', methods: ['POST'])]
  public function allAddress(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $id = $data["id"];

    $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

    if ($user) {
      $infos = $user->getUserInfo();
      $allAddressUser = [];

      foreach ($infos as $info) {
        $allAddressUser[] = [
          'id_adresse' => $info->getId(),
          'adresse' => $info->getAdresse(),
          'ville' => $info->getVille(),
          'pays' => $info->getPays(),
          'codepostal' => $info->getCodePost(),
          'telephone' => $info->getTelephone(),
          'nom_complet' => $info->getNomComplet()
        ];
      }

      return new JsonResponse($allAddressUser);
    } else {
      return new JsonResponse(['message' => 'No user found'], Response::HTTP_NOT_FOUND);
    }
  }

  #[Route('/api/addAddress', name: 'api_addAddress', methods: ['POST'])]
  public function addAddress(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $id = $data["id"];
    $newPays = $data["newPays"];
    $newFullnameAdresse = $data["newFullnameAdresse"];
    $newPhone = $data["newPhoneAdresse"];
    $newAddress = $data["newAdresse"];
    $newCodePostal = $data["newCodePostal"];
    $newVille = $data["newVille"];

    $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

    if($user){
      $address = New Info();
      $address->setUser($user);
      $address->setPays($newPays);
      $address->setNomComplet($newFullnameAdresse);
      $address->setTelephone($newPhone);
      $address->setAdresse($newAddress);
      $address->setCodePost($newCodePostal);
      $address->setVille($newVille);

      $entityManager->persist($address);
      $entityManager->flush();
      return new JsonResponse(['message' => 'Address Confirmed']);
    }else{
      return new JsonResponse(['message' => 'No user found']);
    }
  }

  #[Route('/api/modifyAddress', name: 'api_modifyAddress', methods: ['POST'])]
  public function modifyAddress(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $addressId = $data["addressId"];
    $modifyPays = $data["modifyPays"];
    $modifyFullnameAdresse = $data["modifyFullnameAdresse"];
    $modifyPhone = $data["modifyPhoneAdresse"];
    $modifyAddress = $data["modifyAdresse"];
    $modifyCodePostal = $data["modifyCodePostal"];
    $modifyVille = $data["modifyVille"];
    $selectedAddress = $data["selectedAddress"];

    $address = $entityManager->getRepository(Info::class)->findOneBy(['id' => $addressId]);

    if($address){
      $address->setPays($modifyPays);
      $address->setNomComplet($modifyFullnameAdresse);
      $address->setTelephone($modifyPhone);
      $address->setAdresse($modifyAddress);
      $address->setCodePost($modifyCodePostal);
      $address->setVille($modifyVille);

      $entityManager->persist($address);
      $entityManager->flush();
      return new JsonResponse(['message' => 'Address Confirmed']);
    }else{
      return new JsonResponse(['message' => 'No user found']);
    }
  }

  #[Route('/api/deleteAddress', name: 'api_deleteAddress', methods: ['POST'])]
  public function deleteAddress(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $addressId = $data["addressId"];

    $address = $entityManager->getRepository(Info::class)->findOneBy(['id' => $addressId]);

    if($address){
      $entityManager->remove($address);
      $entityManager->flush();
      return new JsonResponse(['message' => 'Address Confirmed']);
    }else{
      return new JsonResponse(['message' => 'No user found']);
    }
  }

  #[Route('/api/allCards', name: 'api_allCards', methods: ['POST'])]
  public function allCards(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $id = $data["id"];

    $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

    if ($user) {
      $cbs = $user->getCbs();
      $allCardsUser = [];

      foreach ($cbs as $cb) {
        $allCardsUser[] = [
          'id_card' => $cb->getId(),
          'fullname_card' => $cb->getFullname(),
          'number_card' => $cb->getNumber(),
          'dateEx_card' => $cb->getDateEx(),
          'cvv_card' => $cb->getCvv(),
          'digits' => substr($cb->getNumber(), -4)
        ];
      }

      return new JsonResponse($allCardsUser);
    } else {
      return new JsonResponse(['message' => 'No user found'], Response::HTTP_NOT_FOUND);
    }
  }

  #[Route('/api/addCard', name: 'api_addCard', methods: ['POST'])]
  public function addCard(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);

    $id = $data["id"];
    $fullnameCb = $data["fullname_cb"];
    $numberCb = $data["number_cb"];
    $dateExpCb = $data["dateExp_cb"];
    $cvvCb = $data["cvv_cb"];

    $user = $entityManager->getRepository(User::class)->find($id);

    if ($user) {
      $cb = new Cb();
      $cb->setFullname($fullnameCb);
      $cb->setNumber(password_hash($numberCb, PASSWORD_DEFAULT) . substr($numberCb, -4));
      $cb->setDateEx(new \DateTime($dateExpCb));
      $cb->setCvv(password_hash($cvvCb, PASSWORD_DEFAULT));
      $cb->setUser($user);

      $entityManager->persist($cb);
      $entityManager->flush();

      return new JsonResponse(['message' => 'Card added successfully']);
    } else {
      return new JsonResponse(['message' => 'No user found']);
    }
  }

  #[Route('/api/deleteCard', name: 'api_deleteCard', methods: ['POST'])]
  public function deleteCard(Request $request, EntityManagerInterface $entityManager): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $id_card = $data["id_card"];

    $cb = $entityManager->getRepository(Cb::class)->findOneBy(['id' => $id_card]);

    if($cb){
      $entityManager->remove($cb);
      $entityManager->flush();
      return new JsonResponse(['message' => 'Cb deleted']);
    }else{
      return new JsonResponse(['message' => 'No user found']);
    }
  }

  #[Route('/api/users', name: 'api_users', methods: ['GET'])]
  public function users(EntityManagerInterface $entityManager): JsonResponse
  {
      $users = $entityManager->getRepository(User::class)->findAll();

      $userData = array_map(function($user) {
          return [
              'id' => $user->getId(),
              'nom' => $user->getNom(),
              'prenom' => $user->getPrenom(),
              'email' => $user->getEmail(),
              'payment' => $user->getPayment(),
          ];
      }, $users);

      return new JsonResponse(['users' => $userData], Response::HTTP_OK);
  }

     
  #[Route('/api/user-payment/{userId}', name: 'api_user-paiment', methods: ['POST'])]
  public function updatePayment(Request $request, $userId, EntityManagerInterface $em): Response
  {
      $data = json_decode($request->getContent(), true);
      $payment = $data['payment'];
      $user = $em->getRepository(User::class)->findOneBy(['id' => $userId]);

      if($payment === 'none'){
        $user->setPayment(null);
      }
      else{
        $user->setPayment($payment);
      }
      $em->flush();

      return new Response('Payment method updated', Response::HTTP_OK);
  }

  #[Route('/api/user_payment/{userId}', name: 'api_user_payment', methods: ['GET'])]
  public function getpayment(Request $request, $userId, EntityManagerInterface $em): Response
  {
     
      $user = $em->getRepository(User::class)->findOneBy(['id' => $userId]);

      return new Response($user->getPayment());
  }
}
