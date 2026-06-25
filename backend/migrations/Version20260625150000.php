<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260625150000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE daycare ADD billing_mode VARCHAR(20) NOT NULL DEFAULT 'hourly'");
        $this->addSql('ALTER TABLE daycare ADD price_per_unit DOUBLE PRECISION NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE daycare DROP billing_mode, DROP price_per_unit');
    }
}
