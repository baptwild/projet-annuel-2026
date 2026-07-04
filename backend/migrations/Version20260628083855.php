<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260628083855 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE daycare ADD address VARCHAR(255) DEFAULT NULL, ADD phone VARCHAR(50) DEFAULT NULL, ADD email VARCHAR(255) DEFAULT NULL, ADD facebook VARCHAR(255) DEFAULT NULL, ADD instagram VARCHAR(255) DEFAULT NULL, ADD color_primary VARCHAR(20) DEFAULT NULL, ADD color_secondary VARCHAR(20) DEFAULT NULL, ADD color_tertiary VARCHAR(20) DEFAULT NULL, CHANGE opening_time opening_time VARCHAR(5) NOT NULL, CHANGE closing_time closing_time VARCHAR(5) NOT NULL, CHANGE billing_mode billing_mode VARCHAR(20) NOT NULL, CHANGE price_per_unit price_per_unit DOUBLE PRECISION NOT NULL, CHANGE price_half_day price_half_day DOUBLE PRECISION NOT NULL, CHANGE weekly_discount_enabled weekly_discount_enabled TINYINT NOT NULL, CHANGE weekly_discount_threshold weekly_discount_threshold INT NOT NULL, CHANGE weekly_discount_percent weekly_discount_percent DOUBLE PRECISION NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE daycare DROP address, DROP phone, DROP email, DROP facebook, DROP instagram, DROP color_primary, DROP color_secondary, DROP color_tertiary, CHANGE opening_time opening_time VARCHAR(5) DEFAULT \'08:00\' NOT NULL, CHANGE closing_time closing_time VARCHAR(5) DEFAULT \'19:00\' NOT NULL, CHANGE billing_mode billing_mode VARCHAR(20) DEFAULT \'hourly\' NOT NULL, CHANGE price_per_unit price_per_unit DOUBLE PRECISION DEFAULT \'0\' NOT NULL, CHANGE price_half_day price_half_day DOUBLE PRECISION DEFAULT \'0\' NOT NULL, CHANGE weekly_discount_enabled weekly_discount_enabled TINYINT DEFAULT 0 NOT NULL, CHANGE weekly_discount_threshold weekly_discount_threshold INT DEFAULT 3 NOT NULL, CHANGE weekly_discount_percent weekly_discount_percent DOUBLE PRECISION DEFAULT \'0\' NOT NULL');
    }
}
