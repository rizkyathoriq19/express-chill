CREATE TABLE `users` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) UNIQUE NOT NULL,
    `password` varchar(255) NOT NULL,
    `phone` varchar(14) DEFAULT NULL,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL,
    `deleted_at` timestamp(3) DEFAULT NULL
);

CREATE TABLE `genres` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL
);

CREATE TABLE `packages` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    `price` int NOT NULL,
    `duration` int DEFAULT 0,
    `description` text DEFAULT NULL,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL,
    `deleted_at` timestamp(3) DEFAULT NULL
);

CREATE TABLE `movies` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `title` varchar(255) NOT NULL,
    `duration` int DEFAULT 0,
    `release_date` date DEFAULT NULL,
    `rating` int DEFAULT 0,
    `genre_id` int NOT NULL,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL,
    `deleted_at` timestamp(3) DEFAULT NULL
);

CREATE TABLE `series` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `title` varchar(255) NOT NULL,
    `total_episode` int DEFAULT 0,
    `release_date` date DEFAULT NULL,
    `rating` int DEFAULT 0,
    `genre_id` int NOT NULL,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL,
    `deleted_at` timestamp(3) DEFAULT NULL
);

CREATE TABLE `episodes` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `series_id` int NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `duration` int DEFAULT 0,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL,
    `deleted_at` timestamp(3) DEFAULT NULL
);

CREATE TABLE `user_payment` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `user_id` int NOT NULL,
    `method` varchar(255) NOT NULL,
    `bank` varchar(255) NOT NULL,
    `bank_number` varchar(50) NOT NULL,
    `status` ENUM('pending', 'success', 'failed', 'canceled', 'expired') DEFAULT 'pending',
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL,
    `deleted_at` timestamp(3) DEFAULT NULL
);

CREATE TABLE `user_orders` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `user_id` int NOT NULL,
    `package_id` int NOT NULL,
    `order_date` date DEFAULT current_date(),
    `status` ENUM('pending', 'success', 'failed', 'canceled') DEFAULT 'pending',
    `total_amount` int DEFAULT 0,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL,
    `deleted_at` timestamp(3) DEFAULT NULL
);

CREATE TABLE `user_wishlist` (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `user_id` int NOT NULL,
    `movie_id` int DEFAULT NULL,
    `series_id` int DEFAULT NULL,
    `created_at` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
    `updated_at` timestamp(3) DEFAULT NULL
);

-- FOREIGN KEYS

ALTER TABLE `movies` ADD FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`);

ALTER TABLE `series` ADD FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`);

ALTER TABLE `user_payment` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_orders` ADD FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`);

ALTER TABLE `user_wishlist` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_wishlist` ADD FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);

ALTER TABLE `user_wishlist` ADD FOREIGN KEY (`series_id`) REFERENCES `series` (`id`);

ALTER TABLE `episodes` ADD FOREIGN KEY (`series_id`) REFERENCES `series` (`id`);
