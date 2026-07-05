<?php

namespace App\DataFixtures;

use App\Entity\Booking;
use App\Entity\Daycare;
use App\Entity\Dog;
use App\Entity\User;
use App\Enum\BookingStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $hasher) {}

    private \DateTimeImmutable $w0; // Lundi de la semaine courante

    /**
     * Retourne un DateTimeImmutable à partir du lundi de la semaine courante.
     * $wk  = offset semaine (-2 = il y a 2 semaines, +3 = dans 3 semaines)
     * $dow = jour de la semaine (0=Lun, 1=Mar, 2=Mer, 3=Jeu, 4=Ven)
     */
    private function d(int $wk, int $dow, string $time): \DateTimeImmutable
    {
        [$h, $m] = explode(':', $time);
        return $this->w0
            ->modify(sprintf('%+d weeks', $wk))
            ->modify(sprintf('+%d days', $dow))
            ->setTime((int)$h, (int)$m, 0);
    }

    /**
     * Statut automatique selon la date du créneau au moment du chargement des fixtures :
     * - Semaines passées           → completed
     * - Jours passés cette semaine → confirmed  (l'admin a validé, peut cliquer "Terminer")
     * - Aujourd'hui et futur       → pending    (l'admin doit encore valider)
     */
    private function statusFor(int $wk, int $dow): BookingStatus
    {
        if ($wk < 0) return BookingStatus::Completed;
        $slotEnd = $this->d($wk, $dow, '23:59');
        if ($slotEnd < new \DateTimeImmutable()) return BookingStatus::Confirmed;
        return BookingStatus::Pending;
    }

    private function book(
        Dog $dog,
        Daycare $dc,
        int $wk,
        int $dow,
        string $start,
        string $end,
        ObjectManager $m,
        ?BookingStatus $status = null
    ): void {
        $b = new Booking();
        $b->setDog($dog);
        $b->setDaycare($dc);
        $b->setStartDate($this->d($wk, $dow, $start));
        $b->setEndDate($this->d($wk, $dow, $end));
        $b->setStatus($status ?? $this->statusFor($wk, $dow));
        $m->persist($b);
    }

    public function load(ObjectManager $manager): void
    {
        // Lundi de la semaine courante
        $now = new \DateTimeImmutable();
        $dayOfWeek = (int)$now->format('N');
        $this->w0 = $now->modify('-' . ($dayOfWeek - 1) . ' days')->setTime(0, 0, 0);

        // ══════════════════════════════════════════════════════════════════
        // DAYCARE 1 : Happy Paws
        // ══════════════════════════════════════════════════════════════════
        $hp = new Daycare();
        $hp->setName('Happy Paws Daycare');
        $hp->setSlug('happy-paws');
        $hp->setIsActive(true);
        $hp->setOpeningTime('08:00');
        $hp->setClosingTime('19:00');
        $hp->setOpenDays([1, 2, 3, 4, 5]);
        $hp->setBillingMode('hourly');
        $hp->setPricePerUnit(4.0);
        $hp->setPriceHalfDay(0.0);
        $hp->setTierHoursThreshold(6.0);
        $hp->setTierPrice(3.0);
        $hp->setWeeklyDiscountEnabled(true);
        $hp->setWeeklyDiscountThreshold(3);
        $hp->setWeeklyDiscountPercent(10.0);
        $hp->setMaxDogsPerDay(5);
        $manager->persist($hp);

        // DAYCARE 2 : Woof Valley
        $wv = new Daycare();
        $wv->setName('Woof Valley');
        $wv->setSlug('woof-valley');
        $wv->setIsActive(true);
        $wv->setOpeningTime('07:30');
        $wv->setClosingTime('18:30');
        $wv->setOpenDays([1, 2, 3, 4, 5, 6]);
        $wv->setBillingMode('daily');
        $wv->setPricePerUnit(25.0);
        $wv->setPriceHalfDay(15.0);
        $wv->setTierHoursThreshold(null);
        $wv->setTierPrice(null);
        $wv->setWeeklyDiscountEnabled(false);
        $wv->setWeeklyDiscountThreshold(3);
        $wv->setWeeklyDiscountPercent(0.0);
        $wv->setMaxDogsPerDay(8);
        $manager->persist($wv);

        // ── Admin Happy Paws ───────────────────────────────────────────────
        $admin = $this->user('admin@happy-paws.com', 'Sophie', 'Martin', 'admin1234', ['ROLE_ADMIN'], $hp, $manager);

        // ── Utilisateurs Happy Paws ────────────────────────────────────────
        $alice  = $this->user('alice@example.com',     'Alice',     'Dupont',   'password', [], $hp, $manager);
        $bob    = $this->user('bob@example.com',       'Bob',       'Bernard',  'password', [], $hp, $manager);
        $carol  = $this->user('carol@example.com',     'Carol',     'Leclerc',  'password', [], $hp, $manager);
        $david  = $this->user('david@example.com',     'David',     'Moreau',   'password', [], $hp, $manager);
        $emma   = $this->user('emma@example.com',      'Emma',      'Petit',    'password', [], $hp, $manager);
        $franck = $this->user('francois@example.com',  'François',  'Durand',   'password', [], $hp, $manager);
        $gabby  = $this->user('gabrielle@example.com', 'Gabrielle', 'Simon',    'password', [], $hp, $manager);
        $hugo   = $this->user('hugo@example.com',      'Hugo',      'Lambert',  'password', [], $hp, $manager);
        $isa    = $this->user('isabelle@example.com',  'Isabelle',  'Martin',   'password', [], $hp, $manager);
        $jules  = $this->user('jules@example.com',     'Jules',     'Petit',    'password', [], $hp, $manager);
        $karine = $this->user('karine@example.com',    'Karine',    'Blanc',    'password', [], $hp, $manager);

        // ── Chiens Happy Paws ─────────────────────────────────────────────
        $rex    = $this->dog('Rex',    'Labrador',               '2020-03-15', $alice,  $hp, $manager);
        $bella  = $this->dog('Bella',  'Golden Retriever',       '2019-07-22', $bob,    $hp, $manager);
        $max    = $this->dog('Max',    'Beagle',                 '2021-11-05', $carol,  $hp, $manager);
        $chloe  = $this->dog('Chloé',  'Cavalier King Charles',  '2022-04-18', $carol,  $hp, $manager);
        $luna   = $this->dog('Luna',   'Border Collie',          '2022-01-10', $david,  $hp, $manager);
        $milo   = $this->dog('Milo',   'Teckel',                 '2021-06-20', $david,  $hp, $manager);
        $nala   = $this->dog('Nala',   'Husky',                  '2023-03-05', $emma,   $hp, $manager);
        $oscar  = $this->dog('Oscar',  'Berger Allemand',        '2020-09-15', $franck, $hp, $manager);
        $perle  = $this->dog('Perle',  'Caniche',                '2022-07-30', $gabby,  $hp, $manager);
        $filou  = $this->dog('Filou',  'Bichon Frisé',           '2023-01-12', $gabby,  $hp, $manager);
        $rocky  = $this->dog('Rocky',  'Rottweiler',             '2019-12-01', $hugo,   $hp, $manager);
        $titou  = $this->dog('Titou',  'Yorkshire',              '2023-04-08', $isa,    $hp, $manager);
        $ulysse = $this->dog('Ulysse', 'Dalmatien',              '2021-04-22', $jules,  $hp, $manager);
        $venus  = $this->dog('Venus',  'Shih Tzu',               '2022-11-30', $karine, $hp, $manager);

        // ══════════════════════════════════════════════════════════════════
        // RÉSERVATIONS HAPPY PAWS
        // Règle statut : wk < 0 → Completed | wk = 0,1 → Confirmed | wk ≥ 2 → Pending
        // Remise hebdo Rex : dès la 3e résa dans la semaine (−10%)
        // Journée pleine (5/5) : W+1 mardi
        // ══════════════════════════════════════════════════════════════════

        // ── Semaine −2 (il y a 2 semaines) — Completed ────────────────────
        // Lundi : Rex, Bella, Luna (3/5)
        $this->book($rex,   $hp, -2, 0, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($bella, $hp, -2, 0, '09:00', '14:00', $manager); // 5h 20€
        $this->book($luna,  $hp, -2, 0, '09:00', '16:00', $manager); // 7h tier 27€
        // Mardi : Oscar, Nala, Max (3/5)
        $this->book($oscar, $hp, -2, 1, '09:00', '13:00', $manager); // 4h 16€
        $this->book($nala,  $hp, -2, 1, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($max,   $hp, -2, 1, '09:00', '12:00', $manager); // 3h 12€
        // Mercredi : Rocky, Milo, Perle (3/5)
        $this->book($rocky, $hp, -2, 2, '09:00', '16:00', $manager); // 7h tier 27€
        $this->book($milo,  $hp, -2, 2, '13:00', '17:00', $manager); // 4h 16€
        $this->book($perle, $hp, -2, 2, '09:00', '13:00', $manager); // 4h 16€
        // Jeudi : Rex (2e semaine), Bella, Titou (3/5)
        $this->book($rex,   $hp, -2, 3, '09:00', '12:00', $manager); // 3h 12€ — Rex W-2, 2e
        $this->book($bella, $hp, -2, 3, '14:00', '18:00', $manager); // 4h 16€
        $this->book($titou, $hp, -2, 3, '09:00', '14:00', $manager); // 5h 20€
        // Vendredi : Ulysse, Venus, Filou (3/5)
        $this->book($ulysse, $hp, -2, 4, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($venus,  $hp, -2, 4, '09:00', '12:00', $manager); // 3h 12€
        $this->book($filou,  $hp, -2, 4, '13:00', '17:00', $manager); // 4h 16€

        // ── Semaine −1 (semaine dernière) — Completed ─────────────────────
        // Lundi : Rex, Luna, Max (3/5)
        $this->book($rex,   $hp, -1, 0, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($luna,  $hp, -1, 0, '09:00', '13:00', $manager); // 4h 16€
        $this->book($max,   $hp, -1, 0, '09:00', '16:00', $manager); // 7h tier 27€
        // Mardi : Bella, Oscar, Nala + Chloé cancelled (4 slots dont 1 annulé)
        $this->book($bella, $hp, -1, 1, '09:00', '14:00', $manager); // 5h 20€
        $this->book($oscar, $hp, -1, 1, '14:00', '18:00', $manager); // 4h 16€
        $this->book($nala,  $hp, -1, 1, '09:00', '12:00', $manager); // 3h 12€
        $this->book($chloe, $hp, -1, 1, '09:00', '17:00', $manager, BookingStatus::Cancelled);
        // Mercredi : Rex (2e), Milo, Rocky (3/5)
        $this->book($rex,   $hp, -1, 2, '09:00', '16:00', $manager); // 7h tier 27€ — Rex W-1, 2e
        $this->book($milo,  $hp, -1, 2, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($rocky, $hp, -1, 2, '09:00', '13:00', $manager); // 4h 16€
        // Jeudi : Rex (3e, REMISE!), Perle, Venus (3/5)
        $this->book($rex,   $hp, -1, 3, '14:00', '18:00', $manager); // 4h 16€ → -10% = 14,40€ — Rex W-1, 3e REMISE
        $this->book($perle, $hp, -1, 3, '09:00', '13:00', $manager); // 4h 16€
        $this->book($venus, $hp, -1, 3, '09:00', '17:00', $manager); // 8h tier 30€
        // Vendredi : Titou, Filou, Ulysse (3/5)
        $this->book($titou,  $hp, -1, 4, '09:00', '12:00', $manager); // 3h 12€
        $this->book($filou,  $hp, -1, 4, '09:00', '16:00', $manager); // 7h tier 27€
        $this->book($ulysse, $hp, -1, 4, '14:00', '18:00', $manager); // 4h 16€

        // ── Semaine 0 (semaine courante) — Confirmed ──────────────────────
        // Lundi : Rex, Bella, Luna, Oscar, Nala → 5/5 PLEIN !
        $this->book($rex,   $hp, 0, 0, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($bella, $hp, 0, 0, '09:00', '14:00', $manager); // 5h 20€
        $this->book($luna,  $hp, 0, 0, '09:00', '16:00', $manager); // 7h tier 27€
        $this->book($oscar, $hp, 0, 0, '14:00', '18:00', $manager); // 4h 16€
        $this->book($nala,  $hp, 0, 0, '09:00', '13:00', $manager); // 4h 16€
        // Mardi : Rex (2e), Bella, Max (3/5)
        $this->book($rex,   $hp, 0, 1, '09:00', '12:00', $manager); // 3h 12€ — Rex W0, 2e
        $this->book($bella, $hp, 0, 1, '13:00', '17:00', $manager); // 4h 16€
        $this->book($max,   $hp, 0, 1, '09:00', '16:00', $manager); // 7h tier 27€
        // Mercredi : Rex (3e, REMISE!), Titou, Filou (3/5)
        $this->book($rex,   $hp, 0, 2, '09:00', '17:00', $manager); // 8h tier 30€ → -10% = 27€ — Rex W0, 3e REMISE
        $this->book($titou, $hp, 0, 2, '09:00', '12:00', $manager); // 3h 12€
        $this->book($filou, $hp, 0, 2, '13:00', '17:00', $manager); // 4h 16€
        // Jeudi : Rocky, Milo, Perle (3/5)
        $this->book($rocky, $hp, 0, 3, '09:00', '16:00', $manager); // 7h tier 27€
        $this->book($milo,  $hp, 0, 3, '09:00', '13:00', $manager); // 4h 16€
        $this->book($perle, $hp, 0, 3, '14:00', '18:00', $manager); // 4h 16€
        // Vendredi : Venus, Ulysse, Chloé (3/5)
        $this->book($venus,  $hp, 0, 4, '09:00', '13:00', $manager); // 4h 16€
        $this->book($ulysse, $hp, 0, 4, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($chloe,  $hp, 0, 4, '14:00', '18:00', $manager); // 4h 16€

        // ── Semaine +1 — Confirmed ────────────────────────────────────────
        // Lundi : Rex, Bella, Luna, Oscar (4/5)
        $this->book($rex,   $hp, 1, 0, '09:00', '13:00', $manager); // 4h 16€
        $this->book($bella, $hp, 1, 0, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($luna,  $hp, 1, 0, '14:00', '18:00', $manager); // 4h 16€
        $this->book($oscar, $hp, 1, 0, '09:00', '12:00', $manager); // 3h 12€
        // Mardi : Rex (2e), Nala, Max, Rocky, Milo → 5/5 PLEIN ! (jour demo)
        $this->book($rex,   $hp, 1, 1, '09:00', '16:00', $manager); // 7h tier 27€ — Rex W+1, 2e
        $this->book($nala,  $hp, 1, 1, '09:00', '13:00', $manager); // 4h 16€
        $this->book($max,   $hp, 1, 1, '14:00', '18:00', $manager); // 4h 16€
        $this->book($rocky, $hp, 1, 1, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($milo,  $hp, 1, 1, '09:00', '12:00', $manager); // 3h 12€
        // Mercredi : Rex (3e, REMISE!), Titou, Venus (3/5)
        $this->book($rex,   $hp, 1, 2, '09:00', '13:00', $manager); // 4h 16€ → -10% = 14,40€ — Rex W+1, 3e REMISE
        $this->book($titou, $hp, 1, 2, '09:00', '16:00', $manager); // 7h tier 27€
        $this->book($venus, $hp, 1, 2, '14:00', '18:00', $manager); // 4h 16€
        // Jeudi : Perle, Ulysse, Filou (3/5)
        $this->book($perle,  $hp, 1, 3, '09:00', '14:00', $manager); // 5h 20€
        $this->book($ulysse, $hp, 1, 3, '09:00', '17:00', $manager); // 8h tier 30€
        $this->book($filou,  $hp, 1, 3, '13:00', '17:00', $manager); // 4h 16€
        // Vendredi : Coco... attends Coco n'existe plus, Luna, Bella + Oscar annulé
        $this->book($luna,  $hp, 1, 4, '09:00', '13:00', $manager); // 4h 16€
        $this->book($bella, $hp, 1, 4, '14:00', '18:00', $manager); // 4h 16€
        $this->book($oscar, $hp, 1, 4, '09:00', '17:00', $manager, BookingStatus::Cancelled);

        // ── Semaine +2 — Pending ──────────────────────────────────────────
        // Lundi : Rex, Bella, Luna (3/5)
        $this->book($rex,   $hp, 2, 0, '09:00', '17:00', $manager);
        $this->book($bella, $hp, 2, 0, '09:00', '13:00', $manager);
        $this->book($luna,  $hp, 2, 0, '09:00', '16:00', $manager);
        // Mardi : Rex (2e), Oscar, Max (3/5)
        $this->book($rex,   $hp, 2, 1, '09:00', '12:00', $manager);
        $this->book($oscar, $hp, 2, 1, '14:00', '18:00', $manager);
        $this->book($max,   $hp, 2, 1, '09:00', '16:00', $manager);
        // Mercredi : Rex (3e, REMISE!), Nala, Rocky (3/5)
        $this->book($rex,   $hp, 2, 2, '14:00', '18:00', $manager);
        $this->book($nala,  $hp, 2, 2, '09:00', '17:00', $manager);
        $this->book($rocky, $hp, 2, 2, '09:00', '13:00', $manager);
        // Jeudi : Milo, Perle, Titou (3/5)
        $this->book($milo,  $hp, 2, 3, '09:00', '14:00', $manager);
        $this->book($perle, $hp, 2, 3, '09:00', '12:00', $manager);
        $this->book($titou, $hp, 2, 3, '14:00', '18:00', $manager);
        // Vendredi : Venus, Ulysse, Filou (3/5)
        $this->book($venus,  $hp, 2, 4, '09:00', '13:00', $manager);
        $this->book($ulysse, $hp, 2, 4, '09:00', '17:00', $manager);
        $this->book($filou,  $hp, 2, 4, '09:00', '14:00', $manager);

        // ── Semaine +3 — Pending ──────────────────────────────────────────
        $this->book($rex,   $hp, 3, 0, '09:00', '16:00', $manager);
        $this->book($bella, $hp, 3, 0, '09:00', '14:00', $manager);
        $this->book($luna,  $hp, 3, 1, '09:00', '13:00', $manager);
        $this->book($oscar, $hp, 3, 1, '14:00', '18:00', $manager);
        $this->book($rex,   $hp, 3, 2, '09:00', '12:00', $manager); // Rex 2e
        $this->book($max,   $hp, 3, 2, '09:00', '17:00', $manager);
        $this->book($nala,  $hp, 3, 3, '09:00', '16:00', $manager);
        $this->book($rex,   $hp, 3, 3, '14:00', '18:00', $manager); // Rex 3e REMISE
        $this->book($rocky, $hp, 3, 4, '09:00', '13:00', $manager);
        $this->book($titou, $hp, 3, 4, '09:00', '17:00', $manager);

        // ── Semaine +4 — Pending ──────────────────────────────────────────
        $this->book($rex,   $hp, 4, 0, '09:00', '17:00', $manager);
        $this->book($bella, $hp, 4, 0, '09:00', '13:00', $manager);
        $this->book($luna,  $hp, 4, 1, '14:00', '18:00', $manager);
        $this->book($max,   $hp, 4, 1, '09:00', '12:00', $manager);
        $this->book($rex,   $hp, 4, 2, '09:00', '14:00', $manager); // Rex 2e
        $this->book($oscar, $hp, 4, 2, '14:00', '18:00', $manager);
        $this->book($nala,  $hp, 4, 3, '09:00', '16:00', $manager);
        $this->book($milo,  $hp, 4, 4, '09:00', '13:00', $manager);
        $this->book($venus, $hp, 4, 4, '14:00', '18:00', $manager);

        // ── Semaine +6 — Pending ──────────────────────────────────────────
        $this->book($rex,   $hp, 6, 0, '09:00', '17:00', $manager);
        $this->book($bella, $hp, 6, 0, '14:00', '18:00', $manager);
        $this->book($luna,  $hp, 6, 0, '09:00', '13:00', $manager);
        $this->book($rex,   $hp, 6, 2, '09:00', '12:00', $manager); // Rex 2e
        $this->book($nala,  $hp, 6, 2, '09:00', '16:00', $manager);
        $this->book($oscar, $hp, 6, 3, '09:00', '17:00', $manager);
        $this->book($rex,   $hp, 6, 3, '14:00', '18:00', $manager); // Rex 3e REMISE
        $this->book($perle, $hp, 6, 4, '09:00', '13:00', $manager);
        $this->book($rocky, $hp, 6, 4, '09:00', '17:00', $manager);

        // ── Semaine +8 — Pending (~2 mois) ───────────────────────────────
        $this->book($rex,    $hp, 8, 0, '09:00', '16:00', $manager);
        $this->book($bella,  $hp, 8, 0, '09:00', '13:00', $manager);
        $this->book($luna,   $hp, 8, 1, '14:00', '18:00', $manager);
        $this->book($oscar,  $hp, 8, 1, '09:00', '17:00', $manager);
        $this->book($rex,    $hp, 8, 2, '09:00', '14:00', $manager); // Rex 2e
        $this->book($max,    $hp, 8, 3, '09:00', '12:00', $manager);
        $this->book($nala,   $hp, 8, 3, '13:00', '17:00', $manager);
        $this->book($ulysse, $hp, 8, 4, '09:00', '17:00', $manager);

        // ── Semaine +12 — Pending (~3 mois) ──────────────────────────────
        $this->book($rex,   $hp, 12, 0, '09:00', '17:00', $manager);
        $this->book($bella, $hp, 12, 0, '09:00', '12:00', $manager);
        $this->book($luna,  $hp, 12, 1, '09:00', '16:00', $manager);
        $this->book($max,   $hp, 12, 1, '14:00', '18:00', $manager);
        $this->book($rex,   $hp, 12, 2, '09:00', '13:00', $manager); // Rex 2e
        $this->book($nala,  $hp, 12, 3, '09:00', '17:00', $manager);
        $this->book($oscar, $hp, 12, 4, '09:00', '14:00', $manager);
        $this->book($venus, $hp, 12, 4, '14:00', '18:00', $manager);

        // ══════════════════════════════════════════════════════════════════
        // WOOF VALLEY (autre tenant — isolation)
        // ══════════════════════════════════════════════════════════════════
        $adminWv = $this->user('admin@woof-valley.com', 'Marc',   'Petit',    'admin1234', ['ROLE_ADMIN'], $wv, $manager);
        $eve     = $this->user('eve@example.com',       'Eve',    'Morin',    'password',  [], $wv, $manager);
        $felix   = $this->user('felix@example.com',     'Félix',  'Rousseau', 'password',  [], $wv, $manager);
        $grace   = $this->user('grace@example.com',     'Grace',  'Fontaine', 'password',  [], $wv, $manager);

        $lola  = $this->dog('Lola',  'Husky',                '2022-05-10', $eve,   $wv, $manager);
        $dino  = $this->dog('Dino',  'Bouledogue Français',  '2021-08-15', $felix, $wv, $manager);
        $paco  = $this->dog('Paco',  'Jack Russell',         '2020-11-20', $felix, $wv, $manager);
        $caramel = $this->dog('Caramel', 'Labrador',         '2023-02-28', $grace, $wv, $manager);

        // Bookings Woof Valley (facturation journée/demi-journée)
        $this->book($lola,    $wv, -2, 0, '08:00', '12:00', $manager); // 4h = journée 25€
        $this->book($dino,    $wv, -2, 1, '09:00', '14:00', $manager); // 5h = journée 25€
        $this->book($lola,    $wv, -1, 0, '08:00', '11:00', $manager); // 3h = demi-j 15€
        $this->book($paco,    $wv, -1, 2, '09:00', '14:00', $manager); // 5h = journée 25€
        $this->book($dino,    $wv, -1, 3, '08:00', '12:00', $manager); // 4h = journée 25€
        $this->book($lola,    $wv, 0, 1, '09:00', '13:00', $manager);  // Confirmée
        $this->book($caramel, $wv, 0, 2, '08:00', '12:00', $manager);
        $this->book($paco,    $wv, 0, 3, '09:00', '17:00', $manager);
        $this->book($lola,    $wv, 1, 0, '08:00', '14:00', $manager);
        $this->book($dino,    $wv, 1, 1, '09:00', '12:00', $manager);
        $this->book($caramel, $wv, 1, 2, '09:00', '16:00', $manager);
        $this->book($lola,    $wv, 2, 0, '08:00', '13:00', $manager);
        $this->book($paco,    $wv, 2, 2, '09:00', '11:00', $manager); // 2h = demi-j 15€
        $this->book($caramel, $wv, 3, 1, '09:00', '15:00', $manager);
        $this->book($lola,    $wv, 4, 0, '08:00', '12:00', $manager);
        $this->book($dino,    $wv, 4, 3, '09:00', '17:00', $manager);

        $manager->flush();
    }

    private function user(string $email, string $first, string $last, string $pwd, array $roles, Daycare $dc, ObjectManager $m): User
    {
        $u = new User();
        $u->setEmail($email);
        $u->setFirstName($first);
        $u->setLastName($last);
        $u->setPassword($this->hasher->hashPassword($u, $pwd));
        $u->setRoles($roles);
        $u->setDaycare($dc);
        $m->persist($u);
        return $u;
    }

    private function dog(string $name, string $breed, string $birthDate, User $owner, Daycare $dc, ObjectManager $m): Dog
    {
        $d = new Dog();
        $d->setName($name);
        $d->setBreed($breed);
        $d->setBirthDate(new \DateTimeImmutable($birthDate));
        $d->setOwner($owner);
        $d->setDaycare($dc);
        $m->persist($d);
        return $d;
    }
}
