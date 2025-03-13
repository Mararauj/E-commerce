<?php

namespace App\Entity;

use App\Repository\CbRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CbRepository::class)]
class Cb
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?string $number = null;

    #[ORM\Column(nullable: true)]
    private ?string $cvv = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fullname = null;

    #[ORM\ManyToOne(inversedBy: 'cbs')]
    private ?User $user = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_ex = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumber(): ?string
    {
        return $this->number;
    }

    public function setNumber(?string $number): static
    {
        $this->number = $number;

        return $this;
    }

    public function getCvv(): ?string
    {
        return $this->cvv;
    }

    public function setCvv(?string $cvv): static
    {
        $this->cvv = $cvv;

        return $this;
    }

    public function getFullname(): ?string
    {
        return $this->fullname;
    }

    public function setFullname(?string $fullname): static
    {
        $this->fullname = $fullname;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getDateEx(): ?\DateTimeInterface
    {
        return $this->date_ex;
    }

    public function setDateEx(?\DateTimeInterface $date_ex): static
    {
        $this->date_ex = $date_ex;

        return $this;
    }
}
