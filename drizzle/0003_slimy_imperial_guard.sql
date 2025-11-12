ALTER TABLE `registrations` MODIFY COLUMN `status` enum('pending','contacted','scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `registrations` ADD `preferredDate` varchar(20);--> statement-breakpoint
ALTER TABLE `registrations` ADD `preferredTime` varchar(20);--> statement-breakpoint
ALTER TABLE `registrations` ADD `scheduledDate` timestamp;--> statement-breakpoint
ALTER TABLE `registrations` ADD `technicianName` varchar(100);--> statement-breakpoint
ALTER TABLE `registrations` ADD `technicianPhone` varchar(20);