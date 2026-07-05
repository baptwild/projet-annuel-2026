<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260625160000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE daycare ADD price_half_day DOUBLE PRECISION NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE daycare ADD tier_hours_threshold DOUBLE PRECISION NULL');
        $this->addSql('ALTER TABLE daycare ADD tier_price DOUBLE PRECISION NULL');
        $this->addSql('ALTER TABLE daycare ADD weekly_discount_enabled TINYINT(1) NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE daycare ADD weekly_discount_threshold INT NOT NULL DEFAULT 3');
        $this->addSql('ALTER TABLE daycare ADD weekly_discount_percent DOUBLE PRECISION NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE daycare DROP price_half_day, DROP tier_hours_threshold, DROP tier_price, DROP weekly_discount_enabled, DROP weekly_discount_threshold, DROP weekly_discount_percent');
    }
}
