<?php

namespace App\Entity;

use App\Repository\InfoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InfoRepository::class)]
class Info
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[ORM\Column]
    private ?string $adresse = null;
    #[ORM\Column]
    private ?string $ville = null;
    #[ORM\Column]
    private ?string $pays = null;
    #[ORM\Column]
    private ?int $codepostal = null;
    #[ORM\Column]
    private ?int $telephone = null;
    #[ORM\Column(length: 255)]
    private ?string $NomComplet = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'userinfo')]
    private User $user;
    public function getId(): ?int
    {
        return $this->id;
    }
    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function getCodePost(): ?int
    {
        return $this->codepostal;
    }
    public function getTelephone(): ?int
    {
        return $this->telephone;
    }
    public function getNomComplet(): ?string
    {
        return $this->NomComplet;
    }
    public function setNomComplet(string $nomcomplet)
    {
        $this->NomComplet = $nomcomplet;
        return $this;
    }
    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user_id = null): self
    {
        $this->user = $user_id;
        return $this;
    }

    public function setAdresse(string $adresse)
    {
        $this->adresse = $adresse;
        return $this;
    }
    public function setPays(string $pays)
    {
        $this->pays = $pays;
        return $this;
    }

    public function setVille(string $ville)
    {
        $this->ville = $ville;
        return $this;
    }
    public function setCodePost(int $codepost)
    {
        $this->codepostal = $codepost;
        return $this;
    }

    public function setTelephone(int $telephone)
    {
        $this->telephone = $telephone;
        return $this;
    }


}
