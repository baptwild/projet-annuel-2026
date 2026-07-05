<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260625130000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add openDays JSON column to daycare';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE daycare ADD open_days JSON NULL");
        $this->addSql("UPDATE daycare SET open_days = '[1,2,3,4,5]'");
        $this->addSql("ALTER TABLE daycare MODIFY open_days JSON NOT NULL");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE daycare DROP open_days');
    }
}
