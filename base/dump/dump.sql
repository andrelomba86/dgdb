/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: dg
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(60) DEFAULT NULL,
  `funcao` varchar(60) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `referencia` varchar(45) DEFAULT NULL,
  `docente_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`docente_id`),
  KEY `fk_cargo_docente1_idx` (`docente_id`),
  CONSTRAINT `fk_cargo_docente1` FOREIGN KEY (`docente_id`) REFERENCES `docente` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES
(1,'Professor Assistente','Professor Assistente Doutor','2018-01-01','REF001',1),
(2,'Professor Adjunto','Professor Adjunto','2010-03-15','REF002',1),
(3,'Pesquisador','Pesquisa em IA','2016-05-10','REF003',3),
(4,'Orientador','Orientação de TCC','2013-02-01','REF004',4),
(5,'Tutor','Acompanhamento de alunos','2011-09-20','REF005',5),
(6,'Professor Titular','Professor Titular','2022-03-03','MS6',2),
(7,'Professor Associado','Professor Associado','2018-03-03','MS5.1',2),
(8,'Professor Assistente','Professor Assistente Doutor','2015-12-30','MS3.2',2);
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conta_bancaria`
--

DROP TABLE IF EXISTS `conta_bancaria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `conta_bancaria` (
  `id` int(11) NOT NULL,
  `banco` varchar(3) DEFAULT NULL,
  `agencia` varchar(8) DEFAULT NULL,
  `conta` varchar(15) DEFAULT NULL,
  `docente_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`docente_id`),
  KEY `fk_conta_bancaria_docente1_idx` (`docente_id`),
  CONSTRAINT `fk_conta_bancaria_docente1` FOREIGN KEY (`docente_id`) REFERENCES `docente` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conta_bancaria`
--

LOCK TABLES `conta_bancaria` WRITE;
/*!40000 ALTER TABLE `conta_bancaria` DISABLE KEYS */;
INSERT INTO `conta_bancaria` VALUES
(1,'001','1234-5','000123-4',5),
(2,'237','5678-9','000567-8',4),
(3,'104','0001-2','000789-0',3),
(5,'033','4321-0','000987-1',1);
/*!40000 ALTER TABLE `conta_bancaria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato`
--

DROP TABLE IF EXISTS `contrato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `regime_juridico` varchar(15) DEFAULT NULL,
  `regime_trabalho` varchar(15) DEFAULT NULL,
  `regime_data_aplicacao` date DEFAULT NULL,
  `data_admissao` date DEFAULT NULL,
  `docente_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contrato_docente_FK` (`docente_id`),
  CONSTRAINT `contrato_docente_FK` FOREIGN KEY (`docente_id`) REFERENCES `docente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato`
--

LOCK TABLES `contrato` WRITE;
/*!40000 ALTER TABLE `contrato` DISABLE KEYS */;
INSERT INTO `contrato` VALUES
(1,'CLT','40h','2010-03-15',NULL,1),
(2,'Estatutário','20h','2008-07-01',NULL,2),
(3,'CLT','40h','2015-01-10',NULL,3),
(4,'Estatutário','30h','2012-06-20',NULL,4),
(5,'CLT','40h','2009-09-01',NULL,5),
(6,NULL,NULL,NULL,NULL,6);
/*!40000 ALTER TABLE `contrato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docente`
--

DROP TABLE IF EXISTS `docente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `docente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `matricula` varchar(10) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docente`
--

LOCK TABLES `docente` WRITE;
/*!40000 ALTER TABLE `docente` DISABLE KEYS */;
INSERT INTO `docente` VALUES
(1,'Carlos Silva','Rua A, 123','1980-05-10','D001','carlos@exemplo.com'),
(2,'Maria Souza','Av. B, 456','1975-11-22','D002','maria@exemplo.com'),
(3,'João Pereira','Rua C, 789','1990-01-30','D003','joao@exemplo.com'),
(4,'Ana Lima','Trav. D, 321','1988-09-12','D004','ana@exemplo.com'),
(5,'Paulo Rocha','Rua E, 654','1982-03-05','D005','paulo@exemplo.com'),
(6,'Marcus Cesar Avezum Alves de Castro','Rua 20, 012391023 - Vl Jatai','2022-10-01','1293890','marcus.castro@unesp.br');
/*!40000 ALTER TABLE `docente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento`
--

DROP TABLE IF EXISTS `documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(25) DEFAULT NULL,
  `documento` varchar(45) DEFAULT NULL,
  `docente_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`docente_id`),
  KEY `fk_documentos_docente1_idx` (`docente_id`),
  CONSTRAINT `fk_documentos_docente1` FOREIGN KEY (`docente_id`) REFERENCES `docente` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento`
--

LOCK TABLES `documento` WRITE;
/*!40000 ALTER TABLE `documento` DISABLE KEYS */;
INSERT INTO `documento` VALUES
(1,'CPF','123.456.789-00',1),
(2,'RG','12.345.678-9',2),
(3,'CPF','987.654.321-00',3),
(4,'RG','98.765.432-1',1),
(5,'CPF','456.789.123-00',5),
(6,'PIS','1237481283819',1);
/*!40000 ALTER TABLE `documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefone`
--

DROP TABLE IF EXISTS `telefone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `telefone` varchar(11) NOT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `docente_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`docente_id`),
  KEY `fk_telefone_docentes1_idx` (`docente_id`),
  CONSTRAINT `fk_telefone_docentes1` FOREIGN KEY (`docente_id`) REFERENCES `docente` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefone`
--

LOCK TABLES `telefone` WRITE;
/*!40000 ALTER TABLE `telefone` DISABLE KEYS */;
INSERT INTO `telefone` VALUES
(1,'11999990001','Celular',1),
(2,'21999990002','Residencial',2),
(3,'31999990003','Comercial',3),
(4,'41999990004','Celular',4),
(5,'51999990005','Celular',5),
(6,'14199931231','Celular',3),
(7,'19199990042','Residencial',1),
(8,'31991239953','Comercial',1),
(9,'41999134004','Celular',5),
(10,'51123126005','Celular',2);
/*!40000 ALTER TABLE `telefone` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-13 12:31:11
