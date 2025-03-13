<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
class Images
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?string $imgname = null;

    #[ORM\ManyToOne(targetEntity: Products::class, inversedBy: 'images')]
    private Products $product;

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
    public function getImgname(): ?string
    {
        return $this->imgname;
    }
    public function setImgname($imgname)
    {
        $this->imgname = $imgname;
    }
}
