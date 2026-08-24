-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 23, 2026 at 03:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `receipt_iq_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_tbl`
--

CREATE TABLE `ai_tbl` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `merchant_name` varchar(255) DEFAULT NULL,
  `receipt_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `ai_processing_activity` varchar(255) DEFAULT NULL,
  `ai_extracted_text` text DEFAULT NULL,
  `ai_confidence` decimal(5,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses_tbl`
--

CREATE TABLE `expenses_tbl` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `merchant_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `receipt_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses_tbl`
--

INSERT INTO `expenses_tbl` (`id`, `user_id`, `merchant_name`, `category`, `amount`, `receipt_date`, `description`, `image_path`, `created_at`, `is_deleted`, `deleted_at`) VALUES
(1, 2, 'Jollibee', 'Food & Dining', 750.00, '2026-09-15', '', '', '2026-08-22 03:46:19', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `recordstbl`
--

CREATE TABLE `recordstbl` (
  `id` int(11) NOT NULL,
  `fullname_user` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review_tbl`
--

CREATE TABLE `review_tbl` (
  `id` int(11) NOT NULL,
  `receipt_image` varchar(255) NOT NULL,
  `merchant_name` varchar(255) NOT NULL,
  `total` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullname_user` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fullname_user`, `password`, `email`, `price`, `role`) VALUES
(1, 'Admin User', '$2y$10$EpvObQweRPwKwL7nxIgZS./DZsMNHXkl5sUX7Ue/01Xq6tfWmqAd2', 'admin@gmail.com', 0.00, 'admin'),
(2, 'Demo User', '$2y$10$EpvObQweRPwKwL7nxIgZS./DZsMNHXkl5sUX7Ue/01Xq6tfWmqAd2', 'user@gmail.com', 0.00, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_tbl`
--
ALTER TABLE `ai_tbl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses_tbl`
--
ALTER TABLE `expenses_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_date` (`user_id`,`receipt_date`);

--
-- Indexes for table `recordstbl`
--
ALTER TABLE `recordstbl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `review_tbl`
--
ALTER TABLE `review_tbl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_tbl`
--
ALTER TABLE `ai_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses_tbl`
--
ALTER TABLE `expenses_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `recordstbl`
--
ALTER TABLE `recordstbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review_tbl`
--
ALTER TABLE `review_tbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
