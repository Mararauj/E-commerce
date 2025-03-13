<?php

namespace App\Repository;

use App\Entity\ColisItem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ColisItem>
 *
 * @method ColisItem|null find($id, $lockMode = null, $lockVersion = null)
 * @method ColisItem|null findOneBy(array $criteria, array $orderBy = null)
 * @method ColisItem[]    findAll()
 * @method ColisItem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ColisItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ColisItem::class);
    }

//    /**
//     * @return ColisItem[] Returns an array of ColisItem objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ColisItem
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
