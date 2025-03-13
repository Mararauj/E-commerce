<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Nom = null;

    #[ORM\Column(length: 255)]
    private ?string $Prenom = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $mdp = null;

    #[ORM\Column(nullable: true)]
    private ?bool $ad = null;

    #[ORM\Column(nullable: true)]
    private ?string $payment = null;
    #[ORM\OneToMany(targetEntity: Avis::class, mappedBy: "user")]
    private Collection $useravis;
    #[ORM\OneToMany(targetEntity: Info::class, mappedBy: "user")]
    private Collection $userinfo;

    #[ORM\OneToMany(targetEntity: Cb::class, mappedBy: 'user')]
    private Collection $cbs;

    #[ORM\OneToMany(targetEntity: Colis::class, mappedBy: 'user')]
    private Collection $allcolis;
    public function __construct()
    {
        $this->useravis = new ArrayCollection();
        $this->userinfo = new ArrayCollection();
        $this->cbs = new ArrayCollection();
        $this->allcolis = new ArrayCollection();
    }
    public function getId(): ?int
    {
        return $this->id;
    }
    public function getUseravis(): Collection
    {
        return $this->useravis;
    }
    public function getUserInfo(): Collection
    {
        return $this->userinfo;
    }

    public function getNom(): ?string
    {
        return $this->Nom;
    }

    public function setNom(string $Nom): static
    {
        $this->Nom = $Nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->Prenom;
    }

    public function setPrenom(string $Prenom): static
    {
        $this->Prenom = $Prenom;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getMdp(): ?string
    {
        return $this->mdp;
    }

    public function setMdp(string $mdp): static
    {
        $this->mdp = $mdp;

        return $this;
    }

    public function isAd(): ?bool
    {
        return $this->ad;
    }

    public function setAd(?bool $ad): static
    {
        $this->ad = $ad;

        return $this;
    }
    public function getPayment()
    {
        return $this->payment;
    }
    public function setPayment(?string $payment): static
    {
        $this->payment = $payment;
        return $this;
    }
    /**
     * @return Collection<int, Cb>
     */
    public function getCbs(): Collection
    {
        return $this->cbs;
    }

    public function addCb(Cb $cb): static
    {
        if (!$this->cbs->contains($cb)) {
            $this->cbs->add($cb);
            $cb->setUser($this);
        }

        return $this;
    }

    public function removeCb(Cb $cb): static
    {
        if ($this->cbs->removeElement($cb)) {
            if ($cb->getUser() === $this) {
                $cb->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Colis>
     */
    public function getAllcolis(): Collection
    {
        return $this->allcolis;
    }

    public function addAllcoli(Colis $allcoli): static
    {
        if (!$this->allcolis->contains($allcoli)) {
            $this->allcolis->add($allcoli);
            $allcoli->setUser($this);
        }

        return $this;
    }

    public function removeAllcoli(Colis $allcoli): static
    {
        if ($this->allcolis->removeElement($allcoli)) {
            // set the owning side to null (unless already changed)
            if ($allcoli->getUser() === $this) {
                $allcoli->setUser(null);
            }
        }

        return $this;
    }
}
