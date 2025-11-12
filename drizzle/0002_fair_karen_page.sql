ALTER TABLE `registrations` ADD `latitude` varchar(50);--> statement-breakpoint
ALTER TABLE `registrations` ADD `longitude` varchar(50);--> statement-breakpoint
ALTER TABLE `registrations` ADD `locationShared` varchar(10) DEFAULT 'no';