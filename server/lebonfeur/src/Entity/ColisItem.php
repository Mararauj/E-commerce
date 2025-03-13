<?php

namespace App\Entity;

use App\Repository\ColisItemRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ColisItemRepository::class)]
class ColisItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'allitems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Colis $colis = null;

    #[ORM\ManyToOne(inversedBy: 'colisItems')]
    #[ORM\JoinColumn(onDelete:"SET NULL")]
    private ?Products $product_id = null;

    #[ORM\Column(length: 255)]
    private ?string $product_name = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\Column]
    private ?float $price_at_purchase = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getColis(): ?Colis
    {
        return $this->colis;
    }

    public function setColis(?Colis $colis): static
    {
        $this->colis = $colis;

        return $this;
    }

    public function getProductId(): ?Products
    {
        return $this->product_id;
    }

    public function setProductId(?Products $product_id): static
    {
        $this->product_id = $product_id;

        return $this;
    }

    public function getProductName(): ?string
    {
        return $this->product_name;
    }

    public function setProductName(string $product_name): static
    {
        $this->product_name = $product_name;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getPriceAtPurchase(): ?float
    {
        return $this->price_at_purchase;
    }

    public function setPriceAtPurchase(float $price_at_purchase): static
    {
        $this->price_at_purchase = $price_at_purchase;

        return $this;
    }
}
