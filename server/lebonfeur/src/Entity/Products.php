<?php

namespace App\Entity;

use App\Repository\ProductsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: ProductsRepository::class)]
class Products
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[ORM\Column]
    private ?string $title = null;
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;
    #[ORM\Column]
    private ?int $price = null;
    #[ORM\ManyToOne(targetEntity: Categories::class, inversedBy: 'products')]
    private Categories $category;
    private ?int $category_id = null;
    #[ORM\OneToMany(targetEntity: Images::class, mappedBy: "product")]
    private Collection $images;
    #[ORM\Column]
    private ?int $stock = null;
    #[ORM\Column]
    private ?int $vues = 0;

    #[ORM\OneToMany(targetEntity: Avis::class, mappedBy: "product", cascade: ["remove"], orphanRemoval: true)]
    private Collection $avis;
    #[ORM\Column]
    private ?int $width = 0;
    #[ORM\Column]
    private ?float $weight = 0;
    #[ORM\Column]
    private ?int $height = 0;
    #[ORM\Column]
    private ?int $length = 0;
    #[ORM\Column]
    private ?bool $promo = false;
    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->avis = new ArrayCollection();
        $this->paniers = new ArrayCollection();
        $this->colisItems = new ArrayCollection();
    }
    #[ORM\OneToMany(targetEntity: Panier::class, mappedBy: "produit")]
    private Collection $paniers;

    #[ORM\OneToMany(targetEntity: ColisItem::class, mappedBy: 'product_id')]
    private Collection $colisItems;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column]
    private ?float $avgscore = 0;
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }
    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }
    public function getDesc(): ?string
    {
        return $this->description;
    }
    public function setDesc(string $description): self
    {
        $this->description = $description;

        return $this;
    }
    public function getPrice(): ?int
    {
        return $this->price;
    }
    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }
    public function getCategory(): ?Categories
    {
        return $this->category;
    }

    public function setCategory(?Categories $category): self
    {
        $this->category = $category;

        return $this;
    }
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function getAvis(): Collection
    {
        return $this->avis;
    }
    public function setStock($stock)
    {
        $this->stock = $stock;
        return $this;
    }
    public function getStock()
    {
        return $this->stock;
    }
    public function setVues($vues)
    {
        $this->vues = $vues;
        return $this;
    }
    public function getVues()
    {
        return $this->vues;
    }
    public function getPanier(): Collection
    {
        return $this->paniers;
    }
    public function getWidth(): ?int
    {
        return $this->width;
    }
    public function setWidth(int $width): self
    {
        $this->width = $width;

        return $this;
    }
    public function getWeight(): ?float
    {
        return $this->weight;
    }
    public function setWeight(float $weight): self
    {
        $this->weight = $weight;

        return $this;
    }
    public function getHeight(): ?int
    {
        return $this->height;
    }
    public function setHeight(int $height): self
    {
        $this->height = $height;

        return $this;
    }
    public function getLength(): ?int
    {
        return $this->length;
    }
    public function setLength(int $length): self
    {
        $this->length = $length;

        return $this;
    }
    public function getPromo(): ?bool
    {
        return $this->promo;
    }
    public function setPromo(bool $promo): self
    {
        $this->promo = $promo;

        return $this;
    }

    /**
     * @return Collection<int, ColisItem>
     */
    public function getColisItems(): Collection
    {
        return $this->colisItems;
    }

    public function addColisItem(ColisItem $colisItem): static
    {
        if (!$this->colisItems->contains($colisItem)) {
            $this->colisItems->add($colisItem);
            $colisItem->setProductId($this);
        }

        return $this;
    }

    public function removeColisItem(ColisItem $colisItem): static
    {
        if ($this->colisItems->removeElement($colisItem)) {
            // set the owning side to null (unless already changed)
            if ($colisItem->getProductId() === $this) {
                $colisItem->setProductId(null);
            }
        }

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getAvgscore(): ?float
    {
        return $this->avgscore;
    }

    public function setAvgscore(float $avgscore): static
    {
        $this->avgscore = $avgscore;

        return $this;
    }
    public function updateAvgScore(): void
    {
        $totalRating = 0;
        $count = 0;

        foreach ($this->avis as $avis) {
            if ($avis->getRating() >= 0) {
                $totalRating += $avis->getRating();
                $count++;
            }
        }

        if ($count > 0) {
            $this->avgscore = $totalRating / $count;
        } else {
            $this->avgscore = 0;
        }
    }
}
