ALTER TABLE `registrations` ADD `contractSigned` varchar(10) DEFAULT 'no';--> statement-breakpoint
ALTER TABLE `registrations` ADD `contractSignedAt` timestamp;--> statement-breakpoint
ALTER TABLE `registrations` ADD `signatureData` text;--> statement-breakpoint
ALTER TABLE `registrations` ADD `contractPdfUrl` text;