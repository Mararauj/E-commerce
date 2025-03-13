<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240801123350 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE info DROP FOREIGN KEY FK_CB8931579D86650F');
        $this->addSql('DROP INDEX IDX_CB8931579D86650F ON info');
        $this->addSql('ALTER TABLE info ADD nom_complet VARCHAR(255) NOT NULL, CHANGE user_id_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE info ADD CONSTRAINT FK_CB893157A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_CB893157A76ED395 ON info (user_id)');
        $this->addSql('ALTER TABLE user ADD prenom VARCHAR(255) NOT NULL, CHANGE nom_complet nom VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user ADD nom_complet VARCHAR(255) NOT NULL, DROP nom, DROP prenom');
        $this->addSql('ALTER TABLE info DROP FOREIGN KEY FK_CB893157A76ED395');
        $this->addSql('DROP INDEX IDX_CB893157A76ED395 ON info');
        $this->addSql('ALTER TABLE info DROP nom_complet, CHANGE user_id user_id_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE info ADD CONSTRAINT FK_CB8931579D86650F FOREIGN KEY (user_id_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_CB8931579D86650F ON info (user_id_id)');
    }
}
