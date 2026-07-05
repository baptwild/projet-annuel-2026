<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260619121601 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE booking (id INT AUTO_INCREMENT NOT NULL, start_date DATETIME NOT NULL, end_date DATETIME NOT NULL, status VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, dog_id INT NOT NULL, daycare_id INT NOT NULL, INDEX IDX_E00CEDDE634DFEB (dog_id), INDEX IDX_E00CEDDEAC9DF11B (daycare_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE daycare (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(100) DEFAULT NULL, is_active TINYINT NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE dog (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, breed VARCHAR(100) DEFAULT NULL, birth_date DATETIME DEFAULT NULL, owner_id INT NOT NULL, daycare_id INT NOT NULL, INDEX IDX_812C397D7E3C61F9 (owner_id), INDEX IDX_812C397DAC9DF11B (daycare_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, daycare_id INT NOT NULL, INDEX IDX_8D93D649AC9DF11B (daycare_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE634DFEB FOREIGN KEY (dog_id) REFERENCES dog (id)');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDEAC9DF11B FOREIGN KEY (daycare_id) REFERENCES daycare (id)');
        $this->addSql('ALTER TABLE dog ADD CONSTRAINT FK_812C397D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE dog ADD CONSTRAINT FK_812C397DAC9DF11B FOREIGN KEY (daycare_id) REFERENCES daycare (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649AC9DF11B FOREIGN KEY (daycare_id) REFERENCES daycare (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE garderie (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, slug VARCHAR(100) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_0900_ai_ci`, is_active TINYINT NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE booking DROP FOREIGN KEY FK_E00CEDDE634DFEB');
        $this->addSql('ALTER TABLE booking DROP FOREIGN KEY FK_E00CEDDEAC9DF11B');
        $this->addSql('ALTER TABLE dog DROP FOREIGN KEY FK_812C397D7E3C61F9');
        $this->addSql('ALTER TABLE dog DROP FOREIGN KEY FK_812C397DAC9DF11B');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649AC9DF11B');
        $this->addSql('DROP TABLE booking');
        $this->addSql('DROP TABLE daycare');
        $this->addSql('DROP TABLE dog');
        $this->addSql('DROP TABLE user');
    }
}
