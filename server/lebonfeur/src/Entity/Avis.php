<?php

namespace App\Entity;

use App\Repository\AvisRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AvisRepository::class)]
class Avis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Products::class, inversedBy: 'avis')]
    private Products $product;

    #[ORM\Column]
    private ?string $comment = null;
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'useravis')]
    private User $user;

    #[ORM\Column(nullable: true)]
    private ?int $rating = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getProduct(): ?Products
    {
        return $this->product;
    }

    public function setProduct(?Products $product): self
    {
        $this->product = $product;

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
    public function getComment(): ?string
    {
        return $this->comment;
    }
    public function setComment($comment)
    {
        $this->comment = $comment;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(?int $rating): static
    {
        $this->rating = $rating;
        
        return $this;
    }
}
