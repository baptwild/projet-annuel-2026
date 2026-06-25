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
    #[Groups(['daycare:list', 'daycare:read'])]
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

    #[ORM\Column(length: 5)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private string $openingTime = '08:00';

    #[ORM\Column(length: 5)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private string $closingTime = '19:00';

    #[ORM\Column(type: 'json')]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private array $openDays = [1, 2, 3, 4, 5];

    #[ORM\Column(length: 20)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private string $billingMode = 'hourly';

    #[ORM\Column(type: 'float')]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private float $pricePerUnit = 0.0;

    #[ORM\Column(type: 'float')]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private float $priceHalfDay = 0.0;

    #[ORM\Column(type: 'float', nullable: true)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private ?float $tierHoursThreshold = null;

    #[ORM\Column(type: 'float', nullable: true)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private ?float $tierPrice = null;

    #[ORM\Column]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private bool $weeklyDiscountEnabled = false;

    #[ORM\Column]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private int $weeklyDiscountThreshold = 3;

    #[ORM\Column(type: 'float')]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private float $weeklyDiscountPercent = 0.0;

    #[ORM\Column(nullable: true)]
    #[Groups(['daycare:list', 'daycare:read', 'daycare:write'])]
    private ?int $maxDogsPerDay = null;

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

    public function getOpeningTime(): string { return $this->openingTime; }
    public function setOpeningTime(string $openingTime): static { $this->openingTime = $openingTime; return $this; }

    public function getClosingTime(): string { return $this->closingTime; }
    public function setClosingTime(string $closingTime): static { $this->closingTime = $closingTime; return $this; }

    public function getOpenDays(): array { return $this->openDays; }
    public function setOpenDays(array $openDays): static { $this->openDays = $openDays; return $this; }

    public function getBillingMode(): string { return $this->billingMode; }
    public function setBillingMode(string $billingMode): static { $this->billingMode = $billingMode; return $this; }

    public function getPricePerUnit(): float { return $this->pricePerUnit; }
    public function setPricePerUnit(float $pricePerUnit): static { $this->pricePerUnit = $pricePerUnit; return $this; }

    public function getPriceHalfDay(): float { return $this->priceHalfDay; }
    public function setPriceHalfDay(float $priceHalfDay): static { $this->priceHalfDay = $priceHalfDay; return $this; }

    public function getTierHoursThreshold(): ?float { return $this->tierHoursThreshold; }
    public function setTierHoursThreshold(?float $tierHoursThreshold): static { $this->tierHoursThreshold = $tierHoursThreshold; return $this; }

    public function getTierPrice(): ?float { return $this->tierPrice; }
    public function setTierPrice(?float $tierPrice): static { $this->tierPrice = $tierPrice; return $this; }

    public function isWeeklyDiscountEnabled(): bool { return $this->weeklyDiscountEnabled; }
    public function setWeeklyDiscountEnabled(bool $weeklyDiscountEnabled): static { $this->weeklyDiscountEnabled = $weeklyDiscountEnabled; return $this; }

    public function getWeeklyDiscountThreshold(): int { return $this->weeklyDiscountThreshold; }
    public function setWeeklyDiscountThreshold(int $weeklyDiscountThreshold): static { $this->weeklyDiscountThreshold = $weeklyDiscountThreshold; return $this; }

    public function getWeeklyDiscountPercent(): float { return $this->weeklyDiscountPercent; }
    public function setWeeklyDiscountPercent(float $weeklyDiscountPercent): static { $this->weeklyDiscountPercent = $weeklyDiscountPercent; return $this; }

    public function getMaxDogsPerDay(): ?int { return $this->maxDogsPerDay; }
    public function setMaxDogsPerDay(?int $maxDogsPerDay): static { $this->maxDogsPerDay = $maxDogsPerDay; return $this; }

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
