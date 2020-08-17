-- MySQL dump 10.13  Distrib 5.7.30, for macos10.14 (x86_64)
--
-- Host: db-0730.c4kzp7dzumub.us-east-2.rds.amazonaws.com    Database: boarder
-- ------------------------------------------------------
-- Server version	5.7.28-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED='';

--
-- Current Database: `boarder`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `boarder` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `boarder`;

--
-- Table structure for table `postit`
--

DROP TABLE IF EXISTS `postit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postit` (
  `postit_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wb_id` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latest_update` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_x` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_y` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bg_color` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `width` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `font_size` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `font_color` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `img` varchar(400) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zIndex` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `del` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`postit_id`),
  KEY `FK_wbPostit` (`wb_id`),
  CONSTRAINT `FK_wbPostit` FOREIGN KEY (`wb_id`) REFERENCES `wb` (`wb_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postit`
--

LOCK TABLES `postit` WRITE;
/*!40000 ALTER TABLE `postit` DISABLE KEYS */;
INSERT INTO `postit` VALUES ('id_1594793948528','11','2020/7/24 18:18:01','425px','67px','It\'s me!','rgb(255, 194, 194)','123px','82px','24px','rgb(13, 13, 13)',NULL,'4','deleted'),('id_1595225740882','11','2020/7/27 18:26:56','196px','298px','HELLO!!\n\n\n\n\n\n\n\n','rgb(255, 239, 15)','241px','125px','24px','rgb(66, 66, 66)',NULL,'0','deleted'),('id_1595227572079','11','2020/7/29 13:32:41','387px','160px','I was wondering if after all these years you\'d like to meet','rgb(76, 61, 61)','590px','50px','24px','rgb(255, 153, 153)',NULL,'42',NULL),('id_1595232659453','11','2020/7/27 11:50:55','420px','442px','backend : javascript ','rgb(59, 144, 181)','224px','109px','24px','rgb(255, 255, 255)',NULL,'0',NULL),('id_1595382598804','11','2020/7/29 13:22:11','101px','47px','testing this post-it now\nError Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.  To disable safe mode, toggle the option in Preferences -> SQL Editor and reconnect 123123123123123123123123123123123123123123123112312312312312312312312312312312312312312312312312312312312312312312311231231231231231231212312312312\n\n\n\n\n\n\n\n\n\n\n\n\n','rgb(13, 13, 13)','340px','228px','24px','rgb(228, 103, 103)',NULL,'0',NULL),('id_1595408807496','11','2020/7/22 17:11:50','523px','325.75px','1231231231','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1595488326032','11','2020/7/24 15:59:19','847px','303px','3123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123','rgb(6, 53, 3)','322px','279px','24px','rgb(255, 226, 36)',NULL,'1','deleted'),('id_1595489161680','11','2020/7/23 15:29:09','810px','33.25px','123123','rgb(55, 27, 27)','146px','129px','24px','rgb(242, 202, 202)',NULL,'0','deleted'),('id_1595489194623','11','2020/7/29 13:22:24','543.5px','96px','3123122131231231231233123123','rgb(192, 48, 48)','139px','126px','24px','rgb(252, 248, 248)',NULL,'0',NULL),('id_1595489638464','11','2020/7/23 15:54:24','593.5px','60.625px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1595536097513','11','2020/7/24 04:28:35','403px','124.25px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1595538355073','11','2020/7/24 05:05:59','247.5px','124.25px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1595539681320','11','2020/7/24 05:28:32','322px','124.25px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'6','deleted'),('id_1595562131501','11','2020/7/29 11:27:50','700px','354.375px','dfdfadfafadfsdfsdfdsf1231231231231231231231231231231112312312312312312312312312123123123123123123123123123','rgb(52, 223, 172)','214px','178px','24px','rgb(0, 0, 0)',NULL,'1',NULL),('id_1595562257126','11','2020/7/24 11:47:01','635px','302.375px','1231123123123','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1595562343166','11','2020/7/24 12:48:15','836px','249px','1231231231231231231231231123123123123123123123123123123','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1596361192653','1596360115206','2020/8/2 17:39:55','337px','93.2344px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1596361926634','1596360115206','2020/8/2 17:52:09','735px','195.234px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1596361941076','1596360115206','2020/8/2 17:52:26','266px','128.234px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0','deleted'),('id_1596361943768','1596360115206','2020/8/2 18:03:28','402px','93.2188px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0',NULL),('id_1596361947695','1596360115206','2020/8/2 18:04:02','653px','188.219px','','rgb(255, 255, 136)','150px','150px','24px','rgb(0, 0, 0)',NULL,'0',NULL),('popover83736','11','2020/7/24 05:23:20','0px','0px',NULL,'rgb(255, 255, 255)','195.562px','245px',NULL,NULL,NULL,'1060','deleted'),('popover936956','11','2020/7/24 05:02:09','0px','0px',NULL,'rgb(255, 255, 255)','195.562px','245px',NULL,NULL,NULL,'1060','deleted');
/*!40000 ALTER TABLE `postit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pwd` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `access_token` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('104638','raymond@test.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiIxMjM0NTYiLCJpYXQiOjE1OTU5MjA2MjYsImV4cCI6MTU5OTUyMDYyNn0.qDnsfZtM-Rv6_XZqUapnY7uZhPkGjLM7el3826lpcH0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJheW1vbmRAdGVzdC5jb20iLCJpYXQiOjE1OTU5MjA2MjYsImV4cCI6MTU5OTUyMDYyNn0.otHIuMIGN6T_N9akOgOefgnecGwZsVeG7MXEjIJCeKk'),('141605','yoshikachuang@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJ0YW55YSIsImlhdCI6MTU5NTkyMTIwNCwiZXhwIjoxNTk5NTIxMjA0fQ.eeRpC5Gg--twpbzCw0apV8gNHK3peQv7EbRGGjxA9WE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inlvc2hpa2FjaHVhbmdAZ21haWwuY29tIiwiaWF0IjoxNTk1OTIxMjA0LCJleHAiOjE1OTk1MjEyMDR9.Jm8wbYZCfoLVXVhqH80gV1QS7t5PPPW4LDjbbGltjgg'),('1596359488984','stack@stack.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJzdGFjayIsImlhdCI6MTU5NjM1OTQ4OCwiZXhwIjoxNTk5OTU5NDg4fQ.zcu4TwWWf3r3GUkJegozgs8oqmjQjtFNOLnHmCuaU9w','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWNrQHN0YWNrLmNvbSIsImlhdCI6MTU5NjM1OTQ4OCwiZXhwIjoxNTk5OTU5NDg4fQ.16q07ckQ1VJnj0ShKOVkHp_lx6qxY2sGNaeNG1QIKYo'),('214349','aaa@aaa.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJhYWEiLCJpYXQiOjE1OTU5MDgzNTQsImV4cCI6MTU5OTUwODM1NH0.C0qkE8HkoPWOp9OVlgpN02xfZ1IzJ96Zb_SLGOSM-hI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhYUBhYWEuY29tIiwiaWF0IjoxNTk1OTA4MzU0LCJleHAiOjE1OTk1MDgzNTR9.esCu5_M57Q8J3qoSHs2X_RV0ViKtY8XvS5E3ZIgVMFs'),('217669','bobo@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJib2JvIiwiaWF0IjoxNTk1ODc1NzUxLCJleHAiOjE1OTk0NzU3NTF9.3MIGiAn5P-6Mbsobt5AUFMOexayrikc4nKVW8Wq13cg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJvYm9AZ21haWwuY29tIiwiaWF0IjoxNTk1ODc1NzUxLCJleHAiOjE1OTk0NzU3NTF9.0-koO0D03TWxWGTPKKx21xaPmgflR64xF6N0nw_TuFI'),('410716','arthur@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiIxMjM0IiwiaWF0IjoxNTk1NDA1Mjg4LCJleHAiOjE1OTkwMDUyODh9.5LP-eD9egLF41ces6Hz59Ot_k6rvc992M_w7bdDnpuA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFydGh1ckBnbWFpbC5jb20iLCJpYXQiOjE1OTU0MDUyODgsImV4cCI6MTU5OTAwNTI4OH0.E5SnNP_zPoczcY8f7YSLeicDQJ40mS-vakuK7ZlpkI8'),('439367','john@hotmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJqb2huIiwiaWF0IjoxNTk1OTA4NDQ0LCJleHAiOjE1OTk1MDg0NDR9.b-CLHGfinMy8zRzHwDQ4IbUqEiGYz4fVCoOc_XisVlw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AaG90bWFpbC5jb20iLCJpYXQiOjE1OTU5MDg0NDQsImV4cCI6MTU5OTUwODQ0NH0.0rOii5W0PZWgStLzUCenZ3-vXImudCGl_QNb4j0IxsI'),('445805','shirney@appworks.tw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJ0ZXN0LTEyMzQiLCJpYXQiOjE1OTU5MDg0MDQsImV4cCI6MTU5OTUwODQwNH0.e7SjJy7om_yQaekCMXXzLHrEbDbBlRHiqU5wE3Wjr98','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaXJuZXlAYXBwd29ya3MudHciLCJpYXQiOjE1OTU5MDg0MDQsImV4cCI6MTU5OTUwODQwNH0.LKj8mwOrWI1lDnhz7e2AlDOyEj0Xq-H6HyF2iG_70Zw'),('524418','123@123.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiIxMjMiLCJpYXQiOjE1OTU5MDg0MDgsImV4cCI6MTU5OTUwODQwOH0.vBzr0BEqUbKwIUOZ97_9wKidgmKtsHyXLYM5eo7VAWQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyM0AxMjMuY29tIiwiaWF0IjoxNTk1OTA4NDA4LCJleHAiOjE1OTk1MDg0MDh9.hEUIY2X9_5gKYNHWZsC8JmhrqFwl-M9NubTu-f9M1Dw'),('593072','bobo@test.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJib2JvIiwiaWF0IjoxNTk1NDk0NjYyLCJleHAiOjE1OTkwOTQ2NjJ9.dCeuEGn2NFYPKuKpRpX6RJsn2Kx32YfVGEFQqQtwUoE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJvYm9AdGVzdC5jb20iLCJpYXQiOjE1OTU0OTQ2NjIsImV4cCI6MTU5OTA5NDY2Mn0.TbRTNcZNwggEFVbgzWrzVowRzswR9rHZiydPzeP-hFc'),('629548','handsome@mail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiIxMjM0NTYiLCJpYXQiOjE1OTU5MDM1MjksImV4cCI6MTU5OTUwMzUyOX0.ooG8ELytozGOZ4Y41edP3U124Nqej4IjkFSMrjE4v2I','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbmRzb21lQG1haWwuY29tIiwiaWF0IjoxNTk1OTAzNTI5LCJleHAiOjE1OTk1MDM1Mjl9.3Ct7QkRlD13kFFw6q4mm8aAwiqcZ0kiqQ33NmCkHxsI'),('641026','NangangPengYuYen@mail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiIxMjM0NTYiLCJpYXQiOjE1OTU5MDcxMTYsImV4cCI6MTU5OTUwNzExNn0.WaGlxrRorGXI-ITiIxz8Z7wnjh1K6yD4oinw-_6-Oag','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ik5hbmdhbmdQZW5nWXVZZW5AbWFpbC5jb20iLCJpYXQiOjE1OTU5MDcxMTYsImV4cCI6MTU5OTUwNzExNn0.zhV3kYxdZ8AfJjH0sP5JhgBiP01BjsmIR6dKPAS69Kk'),('684704','yk@mail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJ5ayIsImlhdCI6MTU5NTkwODM1MywiZXhwIjoxNTk5NTA4MzUzfQ.GcFMJqi6L2C4rg8_Qni_NCM9rMzZfwavtOFQwkHeBHA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlrQG1haWwuY29tIiwiaWF0IjoxNTk1OTA4MzUzLCJleHAiOjE1OTk1MDgzNTN9.Djtz6zEfqYzWJPJtBNz0Fc1rxRcHzGIX4zpKJX3PLHc'),('763610','test123456789@test.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJ0ZXN0MTIzNDU2Nzg5IiwiaWF0IjoxNTk1NTc1MDQ2LCJleHAiOjE1OTkxNzUwNDZ9.8S_DQuB7mG30_MfsGVq9WDVN8p0nSATNbzPfrmzk24U','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMjM0NTY3ODlAdGVzdC5jb20iLCJpYXQiOjE1OTU1NzUwNDYsImV4cCI6MTU5OTE3NTA0Nn0.Guh4zR_BwYsss9l4AgH9ng0-5EnRYabTra5bu8KGPfo'),('852453','stackovergrass@grass.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJ0ZXN0IiwiaWF0IjoxNTk2MDE1NjQ2LCJleHAiOjE1OTk2MTU2NDZ9.fsoQdKdRpwbi6AFo1LKn0UoLxqfuJJ3TCn5mwJIekwk','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0YWNrb3ZlcmdyYXNzQGdyYXNzLmNvbSIsImlhdCI6MTU5NjAxNTY0NiwiZXhwIjoxNTk5NjE1NjQ2fQ.BVTOzuoas-wunDVir53oGKbi2SGn7VEhlHWYcfI1M1o'),('993142','stackoverflower@flower.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwd2QiOiJ0ZXN0IiwiaWF0IjoxNTk0NjQ3NzAyLCJleHAiOjE1OTgyNDc3MDJ9.bVyu5iz3RRypPNHhzsJtNwy-4_2Ju4UNvw8WtLcw0k8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNTk0NjQ3NzAyLCJleHAiOjE1OTgyNDc3MDJ9.q2ohQpxoMS9BoZBBOIhmCAOBwMH0UPdvWhSSsFqGhSE');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_wb`
--

DROP TABLE IF EXISTS `user_wb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_wb` (
  `user_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wb_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`,`wb_id`),
  KEY `FK_wb` (`wb_id`),
  CONSTRAINT `FK_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_wb` FOREIGN KEY (`wb_id`) REFERENCES `wb` (`wb_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_wb`
--

LOCK TABLES `user_wb` WRITE;
/*!40000 ALTER TABLE `user_wb` DISABLE KEYS */;
INSERT INTO `user_wb` VALUES ('1596359488984','1595874369004','guest'),('993142','1','host'),('993142','11','host'),('993142','111','host'),('993142','1595873176461','host'),('993142','1595874236507','host'),('993142','1595874369004','host'),('993142','1596360115206','host');
/*!40000 ALTER TABLE `user_wb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wb`
--

DROP TABLE IF EXISTS `wb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wb` (
  `wb_id` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `host` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `bookmark` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wb_img` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`wb_id`),
  KEY `user_id` (`host`) USING BTREE,
  CONSTRAINT `FK_wbUser` FOREIGN KEY (`host`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wb`
--

LOCK TABLES `wb` WRITE;
/*!40000 ALTER TABLE `wb` DISABLE KEYS */;
INSERT INTO `wb` VALUES ('1','993142','Hellooooo!~~','2020-07-27 19:38:19','null','null'),('11','993142','Black Lives Matter','2020-07-13 13:47:18',NULL,NULL),('111','993142','7/21 DEMO','2020-07-28 04:24:44','null','null'),('1595873176461','993142','Happy Tree Friends','2020-07-28 04:24:22','bookmarked','null'),('1595874236507','993142','Run Forest Run','2020-07-28 04:24:25','bookmarked','null'),('1595874369004','993142','Dumb Ways to Die','2020-07-28 04:24:17','null','null'),('1596360115206','993142','Silicon Valley','2020-08-02 09:22:03','null','null');
/*!40000 ALTER TABLE `wb` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-02 18:39:19
