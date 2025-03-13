<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240821081508 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE avis ADD product_id INT DEFAULT NULL, DROP product');
        $this->addSql('ALTER TABLE avis ADD CONSTRAINT FK_8F91ABF04584665A FOREIGN KEY (product_id) REFERENCES products (id)');
        $this->addSql('CREATE INDEX IDX_8F91ABF04584665A ON avis (product_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE avis DROP FOREIGN KEY FK_8F91ABF04584665A');
        $this->addSql('DROP INDEX IDX_8F91ABF04584665A ON avis');
        $this->addSql('ALTER TABLE avis ADD product VARCHAR(255) DEFAULT NULL, DROP product_id');
    }
}
