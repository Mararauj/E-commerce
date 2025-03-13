<?php

namespace App\Repository;

use App\Entity\Whitelist;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Whitelist>
 *
 * @method Whitelist|null find($id, $lockMode = null, $lockVersion = null)
 * @method Whitelist|null findOneBy(array $criteria, array $orderBy = null)
 * @method Whitelist[]    findAll()
 * @method Whitelist[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WhitelistRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Whitelist::class);
    }

//    /**
//     * @return Whitelist[] Returns an array of Whitelist objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('w')
//            ->andWhere('w.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('w.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Whitelist
//    {
//        return $this->createQueryBuilder('w')
//            ->andWhere('w.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
