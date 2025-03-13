<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240819094918 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE colis_item (id INT AUTO_INCREMENT NOT NULL, colis_id INT NOT NULL, product_id_id INT DEFAULT NULL, product_name VARCHAR(255) NOT NULL, quantity VARCHAR(255) NOT NULL, price_at_purchase DOUBLE PRECISION NOT NULL, INDEX IDX_CA40F8C54D268D70 (colis_id), INDEX IDX_CA40F8C5DE18E50B (product_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE colis_item ADD CONSTRAINT FK_CA40F8C54D268D70 FOREIGN KEY (colis_id) REFERENCES colis (id)');
        $this->addSql('ALTER TABLE colis_item ADD CONSTRAINT FK_CA40F8C5DE18E50B FOREIGN KEY (product_id_id) REFERENCES products (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE colis_item DROP FOREIGN KEY FK_CA40F8C54D268D70');
        $this->addSql('ALTER TABLE colis_item DROP FOREIGN KEY FK_CA40F8C5DE18E50B');
        $this->addSql('DROP TABLE colis_item');
    }
}
