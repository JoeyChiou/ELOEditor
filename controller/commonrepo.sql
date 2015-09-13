-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: DB.J.MINE
-- Generation Time: Jul 13, 2015 at 07:18 PM
-- Server version: 5.5.38-log
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `commonrepo`
--
CREATE DATABASE IF NOT EXISTS `commonrepo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `commonrepo`;

-- --------------------------------------------------------

--
-- Table structure for table `elos`
--

CREATE TABLE IF NOT EXISTS `elos` (
  `elo_id` int(10) NOT NULL,
  `name` varchar(256) NOT NULL,
  `author_id` int(10) NOT NULL,
  `create_date` date NOT NULL,
  `update_date` date NOT NULL,
  `base_elo_id` int(10) NOT NULL,
  `original_type` tinyint(4) NOT NULL,
  PRIMARY KEY (`elo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`group_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groups_info`
--

CREATE TABLE IF NOT EXISTS `groups_info` (
  `group_id` int(10) NOT NULL,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE IF NOT EXISTS `organizations` (
  `organization_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`organization_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `organizations_info`
--

CREATE TABLE IF NOT EXISTS `organizations_info` (
  `organizations_id` int(10) NOT NULL,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`organizations_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(10) NOT NULL,
  `name` varchar(128) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
