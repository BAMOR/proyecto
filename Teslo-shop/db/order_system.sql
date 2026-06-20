-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-06-2026 a las 20:37:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `order_system`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Electrónica', 'Productos tecnológicos y gadgets', 'activo'),
(2, 'Ropa', 'Vestimenta y accesorios', 'activo'),
(3, 'Hogar', 'Artículos para el hogar', 'activo'),
(4, 'Deportes', 'Equipamiento deportivo', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `pais` varchar(50) DEFAULT 'Colombia',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `usuario_id`, `nombre`, `email`, `telefono`, `direccion`, `ciudad`, `codigo_postal`, `pais`, `fecha_registro`) VALUES
(1, 3, 'Juan Pérez', 'juan.perez@email.com', '3001234567', 'Calle 123 #45-67', 'Bogotá', '110111', 'Colombia', '2026-03-23 00:53:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_estados`
--

CREATE TABLE `historial_estados` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) NOT NULL,
  `estado_anterior` varchar(50) DEFAULT NULL,
  `estado_nuevo` varchar(50) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `numero_pedido` varchar(50) DEFAULT NULL,
  `estado` enum('pendiente','confirmado','enviado','entregado','cancelado') DEFAULT 'pendiente',
  `subtotal` decimal(10,2) NOT NULL,
  `impuesto` decimal(10,2) DEFAULT 0.00,
  `envio` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` enum('efectivo','tarjeta','transferencia','paypal') DEFAULT 'efectivo',
  `estado_pago` enum('pendiente','pagado','reembolsado') DEFAULT 'pendiente',
  `notas` text DEFAULT NULL,
  `direccion_envio` varchar(255) DEFAULT NULL,
  `ciudad_envio` varchar(100) DEFAULT NULL,
  `telefono_envio` varchar(20) DEFAULT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_entrega` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `sku` varchar(50) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `estado` enum('disponible','agotado','inactivo') DEFAULT 'disponible',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `categoria_id`, `nombre`, `descripcion`, `precio`, `stock`, `sku`, `imagen_url`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 'Laptop HP', 'Laptop 15 pulgadas, 8GB RAM, 256GB SSD', 1500.00, 10, 'LAP-HP-001', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'disponible', '2026-03-23 00:53:09', '2026-03-25 04:00:58'),
(2, 1, 'Mouse Inalámbrico', 'Mouse ergonómico con receptor USB', 25.00, 50, 'MOU-001', 'https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'disponible', '2026-03-23 00:53:09', '2026-03-25 04:03:35'),
(3, 1, 'Teclado Mecánico', 'Teclado RGB con switches azules', 75.00, 30, 'TEC-001', 'https://images.unsplash.com/photo-1634554423386-494bc98e26a8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'disponible', '2026-03-23 00:53:09', '2026-03-25 04:03:55'),
(4, 2, 'Camiseta Básica', 'Camiseta 100% algodón, varios colores', 15.00, 100, 'CAM-001', 'https://images.unsplash.com/photo-1586363090844-099253d6a1cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'disponible', '2026-03-23 00:53:09', '2026-03-25 04:04:27'),
(5, 2, 'Jeans Slim Fit', 'Jeans talla 30-40, color azul', 45.00, 40, 'JEA-001', 'https://images.unsplash.com/photo-1637069585336-827b298fe84a?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'disponible', '2026-03-23 00:53:09', '2026-03-25 04:04:47'),
(6, 3, 'Lámpara LED', 'Lámpara de escritorio ajustable', 30.00, 25, 'LAM-001', 'https://images.unsplash.com/photo-1621447980929-6638614633c8?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'disponible', '2026-03-23 00:53:09', '2026-03-25 04:05:12'),
(7, 4, 'Balón de Fútbol', 'Balón oficial talla 5', 35.00, 20, 'BAL-001', 'https://plus.unsplash.com/premium_photo-1714573001914-3d5d0d7bd293?q=80&w=1258&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'disponible', '2026-03-23 00:53:09', '2026-03-25 04:05:38'),
(8, 1, 'Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido', 80.00, 0, 'AUD-001', 'https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'agotado', '2026-03-23 00:53:09', '2026-03-25 04:05:57'),
(10, 1, 'xiomi 11t pro', 'el mejor telefono gama media alta', 5000.00, 2, 'XIA-11-T', 'https://www.teknofilo.com/wp-content/uploads/2021/10/Analisis-Xiaomi-11T-Pro-Teknofilo-1.jpg', 'disponible', '2026-06-13 03:19:03', '2026-06-13 03:19:03'),
(11, NULL, 'figura de accion', 'figura de accion ', 500.00, 90, 'fu-pa-1', 'https://tse4.mm.bing.net/th/id/OIP.vQvLE6o3a-BmL5LtbqPEbQHaL_?cb=thfvnextfalcon2&rs=1&pid=ImgDetMain&o=7&rm=3', 'disponible', '2026-06-14 17:44:08', '2026-06-14 17:44:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','vendedor','cliente') DEFAULT 'cliente',
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Administrador', 'admin@sistema.com', '123', 'admin', 'activo', '2026-03-23 00:53:09', '2026-05-24 03:51:18'),
(2, 'Vendedor 1', 'vendedor@sistema.com', 'vendedor123', 'vendedor', 'activo', '2026-03-23 00:53:09', '2026-03-23 00:53:09'),
(3, 'Cliente Demo', 'cliente@sistema.com', 'cliente123', 'cliente', 'activo', '2026-03-23 00:53:09', '2026-03-23 00:53:09'),
(5, 'Paulo Morales', 'paulo@test.com', '$2b$10$6FgEeBzIN6NmTiYMA/GgUuagDaFA65pCV0hcwf9p519Epx8o0c8p6', 'admin', 'activo', '2026-05-17 20:37:00', '2026-05-17 20:37:00'),
(6, 'Moises Barahona', 'Moises@test.com', '$2b$10$.zfiyWV3loLgKyEwCzq26.ViMv7Q4vk.FtRoQN8IhmxkhdBeKbhzK', 'admin', 'activo', '2026-05-17 21:21:47', '2026-05-17 21:21:47'),
(7, 'Joel Foncea', 'joel@gmail.com', '$2b$10$c6Hndo95lE30kizfVgD4NefFVi54xUBp3wQumITVal0SJDH.F7mge', 'admin', 'activo', '2026-05-17 21:28:55', '2026-06-13 02:47:45'),
(8, 'juana', 'juana@gmail.com', '$2b$10$vIQGv4gQFM/JKVZ2T2grXuiSt.kZuTe7FzCaA0Ln1G2EjuYADG.n2', 'cliente', 'activo', '2026-05-17 21:42:45', '2026-05-17 21:42:45'),
(9, 'orlando', 'orlando@gmail.com', '$2b$10$BECxOc5W6y7ZFjK.kKkHA.yNGNZCf5XzspwPpy/08HjHstHRgmPCC', 'cliente', 'activo', '2026-05-17 22:31:44', '2026-05-17 22:31:44'),
(10, 'Administrador ICE', 'admin@icesa.com', '$2b$10$.FqtoqsfyAe45tIp/pOrtOPrg3g27J6hjY5Q9PbBpGlDWHJ9KNe4i', 'admin', 'activo', '2026-05-24 04:00:35', '2026-05-24 04:00:35'),
(11, 'josue', 'josue@gmail.com', '$2b$10$9B9M91/L8VKeJPLURSZAHu0F0.aA9ERETQlekHx4Ez.ZDhhpHVvUu', 'cliente', 'activo', '2026-05-24 04:03:08', '2026-05-24 04:03:08');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_pedidos_completo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_pedidos_completo` (
`id` int(11)
,`numero_pedido` varchar(50)
,`estado` enum('pendiente','confirmado','enviado','entregado','cancelado')
,`total` decimal(10,2)
,`fecha_pedido` timestamp
,`cliente` varchar(100)
,`email_cliente` varchar(100)
,`telefono_cliente` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_productos_completo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_productos_completo` (
`id` int(11)
,`nombre` varchar(200)
,`descripcion` text
,`precio` decimal(10,2)
,`stock` int(11)
,`sku` varchar(50)
,`estado` enum('disponible','agotado','inactivo')
,`categoria` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_pedidos_completo`
--
DROP TABLE IF EXISTS `vista_pedidos_completo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_pedidos_completo`  AS SELECT `ped`.`id` AS `id`, `ped`.`numero_pedido` AS `numero_pedido`, `ped`.`estado` AS `estado`, `ped`.`total` AS `total`, `ped`.`fecha_pedido` AS `fecha_pedido`, `cli`.`nombre` AS `cliente`, `cli`.`email` AS `email_cliente`, `cli`.`telefono` AS `telefono_cliente` FROM (`pedidos` `ped` left join `clientes` `cli` on(`ped`.`cliente_id` = `cli`.`id`)) ORDER BY `ped`.`fecha_pedido` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_productos_completo`
--
DROP TABLE IF EXISTS `vista_productos_completo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_productos_completo`  AS SELECT `p`.`id` AS `id`, `p`.`nombre` AS `nombre`, `p`.`descripcion` AS `descripcion`, `p`.`precio` AS `precio`, `p`.`stock` AS `stock`, `p`.`sku` AS `sku`, `p`.`estado` AS `estado`, `c`.`nombre` AS `categoria` FROM (`productos` `p` left join `categorias` `c` on(`p`.`categoria_id` = `c`.`id`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `idx_detalle_pedido_pedido` (`pedido_id`);

--
-- Indices de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_pedido` (`numero_pedido`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_pedidos_cliente` (`cliente_id`),
  ADD KEY `idx_pedidos_estado` (`estado`),
  ADD KEY `idx_pedidos_fecha` (`fecha_pedido`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_productos_estado` (`estado`),
  ADD KEY `idx_productos_categoria` (`categoria_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD CONSTRAINT `historial_estados_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_estados_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
