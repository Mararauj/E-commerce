<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240801121443 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE info DROP FOREIGN KEY FK_CB893157A76ED395');
        $this->addSql('DROP INDEX UNIQ_CB893157A76ED395 ON info');
        $this->addSql('ALTER TABLE info CHANGE user_id user_id_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE info ADD CONSTRAINT FK_CB8931579D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_CB8931579D86650F ON info (user_id_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE info DROP FOREIGN KEY FK_CB8931579D86650F');
        $this->addSql('DROP INDEX IDX_CB8931579D86650F ON info');
        $this->addSql('ALTER TABLE info CHANGE user_id_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE info ADD CONSTRAINT FK_CB893157A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_CB893157A76ED395 ON info (user_id)');
    }
}
