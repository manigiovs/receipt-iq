USE `receipt_iq_db`;

ALTER TABLE `expenses_tbl`
  ADD COLUMN IF NOT EXISTS `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS `deleted_at` timestamp NULL DEFAULT NULL;
