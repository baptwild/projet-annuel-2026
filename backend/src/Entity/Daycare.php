<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\DaycareRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        // Public: list active daycares so users can choose one at register
        new GetCollection(normalizationContext: ['groups' => ['daycare:list']]),
        new Get(
            security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_SUPER_ADMIN')",
            normalizationContext: ['groups' => ['daycare:read']],
        ),
        new Post(security: "is_granted('ROLE_SUPER_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_SUPER_ADMIN')"),
        new Delete(security: "is_granted('ROLE_SUPER_ADMIN')"),
    ],
    normalizationContext: ['groups' => ['daycare:read']],
    denormalizationContext: ['groups' => ['daycare:write']],
)]
#[ORM\Entity(repositoryClass: DaycareRepository::class)]
class Daycare
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private ?string $slug = null;

    #[ORM\Column]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private ?bool $isActive = null;

    #[ORM\Column]
    #[Groups(['daycare:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToMany(targetEntity: User::class, mappedBy: 'daycare')]
    private Collection $users;

    #[ORM\OneToMany(targetEntity: Dog::class, mappedBy: 'daycare')]
    private Collection $dogs;

    #[ORM\OneToMany(targetEntity: Booking::class, mappedBy: 'daycare')]
    private Collection $bookings;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->users = new ArrayCollection();
        $this->dogs = new ArrayCollection();
        $this->bookings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /** @return Collection<int, User> */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setDaycare($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            if ($user->getDaycare() === $this) {
                $user->setDaycare(null);
            }
        }

        return $this;
    }

    /** @return Collection<int, Dog> */
    public function getDogs(): Collection
    {
        return $this->dogs;
    }

    public function addDog(Dog $dog): static
    {
        if (!$this->dogs->contains($dog)) {
            $this->dogs->add($dog);
            $dog->setDaycare($this);
        }

        return $this;
    }

    public function removeDog(Dog $dog): static
    {
        if ($this->dogs->removeElement($dog)) {
            if ($dog->getDaycare() === $this) {
                $dog->setDaycare(null);
            }
        }

        return $this;
    }

    /** @return Collection<int, Booking> */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    public function addBooking(Booking $booking): static
    {
        if (!$this->bookings->contains($booking)) {
            $this->bookings->add($booking);
            $booking->setDaycare($this);
        }

        return $this;
    }

    public function removeBooking(Booking $booking): static
    {
        if ($this->bookings->removeElement($booking)) {
            if ($booking->getDaycare() === $this) {
                $booking->setDaycare(null);
            }
        }

        return $this;
    }
}
