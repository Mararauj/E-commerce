<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240725130258 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Drop the foreign key constraint
        $this->addSql('ALTER TABLE panier DROP FOREIGN KEY FK_24CC0DF2A76ED395');

        // Drop the unique index on user_id
        $this->addSql('ALTER TABLE panier DROP INDEX UNIQ_24CC0DF2A76ED395');

        // Add a unique index on the combination of user_id and produit_id
        $this->addSql('CREATE UNIQUE INDEX UNIQ_USER_PRODUCT ON panier (user_id, produit_id)');

        // Ensure the table structure and constraints are as needed
        $this->addSql('ALTER TABLE panier MODIFY produit_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE panier MODIFY user_id INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // Drop the unique index on the combination of user_id and produit_id
        $this->addSql('ALTER TABLE panier DROP INDEX UNIQ_USER_PRODUCT');

        // Re-add the original unique index on user_id
        $this->addSql('CREATE UNIQUE INDEX UNIQ_24CC0DF2A76ED395 ON panier (user_id)');

        // Re-add the foreign key constraint
        $this->addSql('ALTER TABLE panier ADD CONSTRAINT FK_24CC0DF2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');

        // Ensure the table structure and constraints are as they were originally
        $this->addSql('ALTER TABLE panier MODIFY produit_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE panier MODIFY user_id INT DEFAULT NULL');
    }
}
