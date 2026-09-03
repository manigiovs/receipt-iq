CREATE DATABASE IF NOT EXISTS medisked_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medisked_db;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('patient', 'caregiver', 'admin') NOT NULL DEFAULT 'patient',
  status ENUM('active', 'suspended', 'deactivated') NOT NULL DEFAULT 'active',
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  profile_image_path VARCHAR(500) DEFAULT NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role_status (role, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_sessions_token_hash (token_hash),
  KEY idx_user_sessions_user_expiry (user_id, expires_at),
  CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE medications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  generic_name VARCHAR(200) DEFAULT NULL,
  strength VARCHAR(100) DEFAULT NULL,
  dosage_form VARCHAR(100) DEFAULT NULL,
  instructions TEXT DEFAULT NULL,
  status ENUM('active', 'paused', 'completed', 'archived') NOT NULL DEFAULT 'active',
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_medications_owner_status (owner_user_id, status),
  KEY idx_medications_owner_updated (owner_user_id, updated_at),
  CONSTRAINT fk_medications_owner FOREIGN KEY (owner_user_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prescriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  medication_id BIGINT UNSIGNED NOT NULL,
  prescription_number VARCHAR(100) DEFAULT NULL,
  quantity DECIMAL(10,2) DEFAULT NULL,
  prescriber_name VARCHAR(200) DEFAULT NULL,
  pharmacy_name VARCHAR(200) DEFAULT NULL,
  issued_date DATE DEFAULT NULL,
  expiry_date DATE DEFAULT NULL,
  source_type ENUM('manual', 'scanned') NOT NULL DEFAULT 'manual',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_prescriptions_medication (medication_id),
  CONSTRAINT fk_prescriptions_medication FOREIGN KEY (medication_id) REFERENCES medications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE medication_schedules (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  medication_id BIGINT UNSIGNED NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  dose_amount DECIMAL(10,2) NOT NULL,
  dose_unit VARCHAR(50) NOT NULL,
  scheduled_time TIME NOT NULL,
  days_of_week SET('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat') DEFAULT NULL,
  start_date DATE NOT NULL,
  end_date DATE DEFAULT NULL,
  status ENUM('active', 'paused', 'ended') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_schedules_medication_status (medication_id, status),
  KEY idx_schedules_due_lookup (status, start_date, end_date, scheduled_time),
  CONSTRAINT fk_schedules_medication FOREIGN KEY (medication_id) REFERENCES medications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dose_records (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  schedule_id BIGINT UNSIGNED NOT NULL,
  scheduled_for DATETIME NOT NULL,
  status ENUM('scheduled', 'taken', 'missed', 'skipped') NOT NULL DEFAULT 'scheduled',
  confirmed_at DATETIME NULL,
  confirmed_by_user_id BIGINT UNSIGNED DEFAULT NULL,
  notes VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_dose_records_schedule_time (schedule_id, scheduled_for),
  KEY idx_dose_records_status_time (status, scheduled_for),
  KEY idx_dose_records_confirmed_by (confirmed_by_user_id),
  CONSTRAINT fk_dose_records_schedule FOREIGN KEY (schedule_id) REFERENCES medication_schedules (id) ON DELETE CASCADE,
  CONSTRAINT fk_dose_records_confirmer FOREIGN KEY (confirmed_by_user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE medication_inventory (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  medication_id BIGINT UNSIGNED NOT NULL,
  quantity_remaining DECIMAL(10,2) NOT NULL DEFAULT 0,
  reorder_threshold DECIMAL(10,2) DEFAULT NULL,
  unit VARCHAR(50) NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inventory_medication (medication_id),
  CONSTRAINT fk_inventory_medication FOREIGN KEY (medication_id) REFERENCES medications (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refills (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  medication_id BIGINT UNSIGNED NOT NULL,
  requested_by_user_id BIGINT UNSIGNED NOT NULL,
  quantity DECIMAL(10,2) DEFAULT NULL,
  requested_date DATE NOT NULL,
  expected_date DATE DEFAULT NULL,
  completed_date DATE DEFAULT NULL,
  status ENUM('needed', 'requested', 'received', 'cancelled') NOT NULL DEFAULT 'needed',
  notes VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_refills_medication_status (medication_id, status),
  KEY idx_refills_requester (requested_by_user_id),
  CONSTRAINT fk_refills_medication FOREIGN KEY (medication_id) REFERENCES medications (id) ON DELETE CASCADE,
  CONSTRAINT fk_refills_requester FOREIGN KEY (requested_by_user_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE caregiver_relationships (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_user_id BIGINT UNSIGNED NOT NULL,
  caregiver_user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending', 'active', 'revoked') NOT NULL DEFAULT 'pending',
  requested_by_user_id BIGINT UNSIGNED NOT NULL,
  approved_at DATETIME NULL,
  revoked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_caregiver_relationship (patient_user_id, caregiver_user_id),
  KEY idx_relationships_caregiver_status (caregiver_user_id, status),
  KEY idx_relationships_patient_status (patient_user_id, status),
  CONSTRAINT fk_relationships_patient FOREIGN KEY (patient_user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_relationships_caregiver FOREIGN KEY (caregiver_user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_relationships_requester FOREIGN KEY (requested_by_user_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message VARCHAR(1000) NOT NULL,
  related_entity_type VARCHAR(50) DEFAULT NULL,
  related_entity_id BIGINT UNSIGNED DEFAULT NULL,
  status ENUM('unread', 'read', 'dismissed') NOT NULL DEFAULT 'unread',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_notifications_user_status_created (user_id, status, created_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id BIGINT UNSIGNED DEFAULT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT UNSIGNED DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  details JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_actor_created (actor_user_id, created_at),
  KEY idx_audit_logs_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ai_jobs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  status ENUM('queued', 'processing', 'completed', 'failed', 'reviewed') NOT NULL DEFAULT 'queued',
  provider VARCHAR(100) DEFAULT NULL,
  model VARCHAR(100) DEFAULT NULL,
  error_message VARCHAR(1000) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_ai_jobs_owner_status (owner_user_id, status),
  KEY idx_ai_jobs_status_created (status, created_at),
  CONSTRAINT fk_ai_jobs_owner FOREIGN KEY (owner_user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ai_results (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ai_job_id BIGINT UNSIGNED NOT NULL,
  extracted_data JSON NOT NULL,
  field_confidence JSON DEFAULT NULL,
  review_status ENUM('pending', 'approved', 'rejected', 'corrected') NOT NULL DEFAULT 'pending',
  reviewed_by_user_id BIGINT UNSIGNED DEFAULT NULL,
  reviewed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ai_results_job (ai_job_id),
  KEY idx_ai_results_review_status (review_status),
  CONSTRAINT fk_ai_results_job FOREIGN KEY (ai_job_id) REFERENCES ai_jobs (id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_results_reviewer FOREIGN KEY (reviewed_by_user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
