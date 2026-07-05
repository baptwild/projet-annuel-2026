<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260625120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add openingTime and closingTime to daycare';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE daycare ADD opening_time VARCHAR(5) NOT NULL DEFAULT '08:00', ADD closing_time VARCHAR(5) NOT NULL DEFAULT '19:00'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE daycare DROP opening_time, DROP closing_time');
    }
}
