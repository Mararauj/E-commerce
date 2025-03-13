<?php

namespace App\Entity;

use App\Repository\WhitelistRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WhitelistRepository::class)]
class Whitelist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[ORM\Column]
    private ?string $country = null;
    #[ORM\Column]
    private ?int $price = null;
    public function getId(): ?int
    {
        return $this->id;
    }
    public function getCountry(): ?string
    {
        return $this->country;
    }
    public function setCountry(string $country)
    {
        $this->country = $country;
        return $this;
    }
    public function getPrice(): ?int
    {
        return $this->price;
    }
    public function setPrice(int $price)
    {
        $this->price = $price;
        return $this;
    }
}
