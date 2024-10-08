CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`balance` integer DEFAULT 0,
	`description` text,
	`type` text NOT NULL,
	`is_favorite` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`datetime` integer NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`description` text,
	`is_excluded` integer,
	`from_account_id` text NOT NULL,
	`from_account_name` text NOT NULL,
	`to_account_id` text,
	`to_account_name` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`from_account_id`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`from_account_name`) REFERENCES `accounts`(`name`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`to_account_id`) REFERENCES `accounts`(`id`) ON UPDATE cascade ON DELETE no action,
	FOREIGN KEY (`to_account_name`) REFERENCES `accounts`(`name`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_name_unique` ON `accounts` (`name`);--> statement-breakpoint
CREATE INDEX `is_favoritex` ON `accounts` (`is_favorite`);--> statement-breakpoint
CREATE INDEX `account_idx` ON `transactions` (`from_account_id`);--> statement-breakpoint
CREATE INDEX `typex` ON `transactions` (`type`);