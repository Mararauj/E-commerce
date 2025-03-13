<?php

namespace App\Entity;

use App\Repository\PanierRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PanierRepository::class)]
class Panier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Products::class, inversedBy: 'paniers')]
    #[ORM\JoinColumn(nullable: false)]
    private Products $produit;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "user_id", nullable: true, referencedColumnName: "id")]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getProduit(): ?Products
    {
        return $this->produit;
    }

    public function setProduit(Products $produit): self
    {
        $this->produit = $produit;
        return $this;
    }
}
