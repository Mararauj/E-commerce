<?php

namespace App\Entity;

use App\Repository\ColisRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ColisRepository::class)]
class Colis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[ORM\Column]
    private ?string $trackingnbr = null;
    #[ORM\Column]
    private ?string $status = null;
    #[ORM\Column]
    private ?string $destination = null;
    #[ORM\Column(type: 'datetime')]
    private DateTime $date;

    #[ORM\ManyToOne(inversedBy: 'allcolis')]
    private ?User $user = null;

    #[ORM\OneToMany(targetEntity: ColisItem::class, mappedBy: 'colis')]
    private Collection $allitems;

    #[ORM\Column]
    private ?bool $cadeau = false;

    #[ORM\Column(length: 255)]
    private ?string $livraison = null;

    #[ORM\Column]
    private ?float $total = null;

    #[ORM\Column]
    private ?float $price_of_shipping = null;
    #[ORM\Column]
    private ?string $payment= null;

    public function __construct()
    {
        $this->allitems = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getTracking(): ?string
    {
        return $this->trackingnbr;
    }
    public function setTracking(string $trackingnbr)
    {
        $this->trackingnbr = $trackingnbr;
        return $this;
    }
    public function getStatus(): ?string
    {
        return $this->status;
    }
    public function setStatus(string $status)
    {
        $this->status = $status;
        return $this;
    }
    public function getDestination(): ?string
    {
        return $this->destination;
    }
    public function setDestination(string $destination)
    {
        $this->destination = $destination;
        return $this;
    }
    public function getDate(): DateTime
    {
        return $this->date;
    }
    public function setDate(DateTime $date): void
    {
        $this->date = $date;
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

    /**
     * @return Collection<int, ColisItem>
     */
    public function getAllitems(): Collection
    {
        return $this->allitems;
    }

    public function addAllitem(ColisItem $allitem): static
    {
        if (!$this->allitems->contains($allitem)) {
            $this->allitems->add($allitem);
            $allitem->setColis($this);
        }

        return $this;
    }

    public function removeAllitem(ColisItem $allitem): static
    {
        if ($this->allitems->removeElement($allitem)) {
            if ($allitem->getColis() === $this) {
                $allitem->setColis(null);
            }
        }

        return $this;
    }

    public function isCadeau(): ?bool
    {
        return $this->cadeau;
    }

    public function setCadeau(bool $cadeau): static
    {
        $this->cadeau = $cadeau;

        return $this;
    }

    public function getLivraison(): ?string
    {
        return $this->livraison;
    }

    public function setLivraison(string $livraison): static
    {
        $this->livraison = $livraison;

        return $this;
    }

    public function getTotal(): ?float
    {
        return $this->total;
    }

    public function setTotal(float $total): static
    {
        $this->total = $total;

        return $this;
    }

    public function getPriceOfShipping(): ?float
    {
        return $this->price_of_shipping;
    }

    public function setPriceOfShipping(float $price_of_shipping): static
    {
        $this->price_of_shipping = $price_of_shipping;

        return $this;
    }
    public function getPayment(): ?string
    {
        return $this->payment;
    }
    public function setPayment(string $payment)
    {
        $this->payment = $payment;
        return $this;
    }
}
