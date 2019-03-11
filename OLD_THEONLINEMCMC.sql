-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 11, 2019 at 12:02 PM
-- Server version: 8.0.15
-- PHP Version: 7.2.15-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `old_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `TABLE 2`
--

CREATE TABLE `TABLE 2` (
  `id` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `uid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `model function` varchar(57) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `variables` varchar(21) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `nvariables` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `success` varchar(7) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `TABLE 2`
--

INSERT INTO `TABLE 2` (`id`, `uid`, `model function`, `variables`, `nvariables`, `success`) VALUES
('Id', 'uid', 'modelfunction', 'variables', 'nvariables', 'success'),
('1', '2c40a75790c3eb6e966ab640246eb4da', 'a*x**2+b*x+c', 'a,b', '2', '1'),
('2', '6bcd1944821ec18af5dc7aa74d95c3fd', 'x**2+cos(y*t)', 'x,y', '2', '1'),
('3', 'fac7572bf9f25bd6b9f7b92de72a76b7', 'x*t', 'x,sigma_gauss', '2', '1'),
('4', '38c7d79e104abe38ea9495609ae21bb9', 'm*x+c', 'm,c', '2', '1'),
('5', '237adc1346ebc7d4098fa14dc02cd427', 'M*x+c', 'M,c', '2', '1'),
('6', '79e83dd1d818b4e8cca414047225d392', 'm*x+c', 'm,c', '2', '1'),
('7', '03e9df5e63550006e61e75ceb54c9c11', 'm*x', 'm', '1', '1'),
('8', 'cb49bca96ed37a5b816f6a900bab8694', 'm*x+c', 'm,c', '2', '1'),
('9', 'c48cc952daac3b4e0aa737836d6751f2', 'm*t+c', 'm,c', '2', '1'),
('10', '5ec3c2a00affa18b11929bf7b7788bd4', 'm*x+c', 'm,c', '2', '1'),
('11', '44dbda5632a9863c0ca4359476f4c90d', 'm*x+c', 'm,c', '2', '1'),
('12', 'f847430de2fdfa11feb44538e15852e4', 'm*x+c', 'm,c', '2', '0'),
('13', '960e08dfef60ec3363a6f8806b88f311', 'm*x', 'm', '1', '0'),
('14', '6d142a67cd2d37cd58defe9f1fbafd27', 'm*x', 'm', '1', '1'),
('15', '7d86482763c50d4978fa8b3eb191aef4', 'k*v', 'k', '1', '1'),
('16', '2f79e9dfbb69313490d6b291eb4e67af', 'a*x+4', 'a', '1', '0'),
('17', '05156e919389777fc980f8f2cd53b229', 'a*x+4', 'a', '1', '0'),
('18', '5404d3d4cb2bfb9a15d75d9d395f2a1c', 'a*x+4', 'a', '1', '1'),
('19', '80051eae1c1cd52ef01625ebe87b75bf', 'm*x+c', 'm,c', '2', '1'),
('20', '5046a5a810c2fd02351d474d2bf904cb', 'M*x+c', 'M,c', '2', '1'),
('21', '2b4adb35cde86a71a64184d347667a53', 'm*x+c', 'm,c', '2', '1'),
('22', '259a12ed18438242e9e8d05accd8ef0e', 'm*x+c', 'm,c', '2', '1'),
('23', '852546ba59b54876ab701360679029d8', 'm*x+c', 'm,c', '2', '1'),
('24', '064dfbab7119732a4b82c4546b4339e4', 'm*x+c', 'm,c', '2', '1'),
('25', 'baa2602b4aee307e78877a89af5c92d6', 'm*x**2+k*x', 'm,k', '2', '1'),
('26', 'bf73ac4e5a70217739fe963b4c1d30db', 'm*x+c', 'm,c', '2', '0'),
('27', 'fe58a100e24d6fff23aca9ed66e80652', 'm*x+c', 'm,c', '2', '1'),
('28', 'ebb53a1048a511556cf68cffeabb58a3', 'b/x**(b+1)', 'b', '1', '0'),
('29', '0c08cd2fa6910f7141530c1df14f0085', 'b/x**(b+1)', 'b', '1', '0'),
('30', '4d246b46aca748df801efc041b03e1e6', 'm*x+b', 'm,b', '2', '0'),
('31', 'f3a783123f6e71a8c80b0478846f0485', 'b/x**(b+1)', 'b', '1', '0'),
('32', 'fb034a405a45fe1f5cd7d6b8c64589dd', 'b/x**(b+1)', 'b', '1', '1'),
('33', '291423b654f749486584002b833c12fc', 'b/x**(b+1)', 'b', '1', '1'),
('34', '6b65b786aabbb0bd0ab68c09f2a51e68', 'mu**x*exp(-mu)/factorial(x)', 'mu', '1', '0'),
('35', 'b99f7c2d43ec98c59535cfcae4619d60', 'b/x**(b+1)', 'b', '1', '1'),
('36', '236327702779c500b0d795d655ce89b3', 'm*x+b', 'm,b', '2', '1'),
('37', '3e1f501107657965e39864410c61e5a4', 'm*x+c', 'm,c', '2', '1'),
('38', '0bd363c4a5c5b53d4023dbacfa5b05ca', 'M*x+c', 'M,c', '2', '0'),
('39', '1b91507e3cebe06582acbddc694307d1', 'M*x', 'M', '1', '1'),
('40', '682136e17890a6947d41e9b7cc35dba2', '0.5*Pdot*(x**2.0)+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('41', '3b6454a163ca2415f9d8b80a2eede838', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('42', 'dfbe236fd5b93dc91e671ade3c4eead8', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('43', 'a2ffa22d53d87923a659105e98d4cc1c', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('44', '36e3bb02bc26fdfebc65378caaeeb07a', 'Pb*x+T', 'Pb,T', '2', '1'),
('45', '38052c2ba5d8acc40a5b9d0adf000ad5', 'Pb*x+T', 'Pb,T', '2', '1'),
('46', 'b8525a40971673aa549fd779215644f4', 'Pb*x+T', 'Pb,T', '2', '1'),
('47', 'd858a26c89b409234105f72a5f6ef121', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('48', '7c064e17511a7ba528f7a8655ea9367c', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('49', 'e76c3f9e4351e6931e41d4d0efd13729', 'Pb*x+T', 'Pb,T', '2', '1'),
('50', '1287b4dee2a4912e80d3e7424c771dd9', 'Pb*x+T', 'Pb,T', '2', '0'),
('51', 'e4f54c71da836efe7d39c800d0ff50a5', 'Pb*x+T', 'Pb,T', '2', '0'),
('52', '79e42cd3c6cbe4ee3a988ac8a10a5ce7', 'Pb*x+T', 'Pb,T', '2', '1'),
('53', '7000d20e12780daa626dae3b3f78d84e', 'Pb*x+T', 'Pb,T', '2', '1'),
('54', '0ba52ba0349dad04c2b43d261bedc0fd', 'Pb*x+T', 'Pb,T', '2', '1'),
('55', 'e7977535a1a23e540a0dec3a9d559e3e', 'Pb*x+T', 'Pb,T', '2', '1'),
('56', '76984f0aa0160382c2b49bf2f42e7096', 'Pb*x+T', 'Pb,T', '2', '1'),
('57', '8e5b31fce8b37e003735a97fb81ed3d7', 'Pb*x+T', 'Pb,T', '2', '1'),
('58', '627c00723fba5c8d3a95e0cb4f4232bd', 'Pb*x+T', 'Pb,T', '2', '1'),
('59', 'bb585fe590e652ea3b6f5be6286ef4dd', 'Pb*x+T', 'Pb,T', '2', '1'),
('60', '63b07abcddceef63696c5a48bdff2815', 'Pb*x+T', 'Pb,T', '2', '1'),
('61', 'c7d71fa24acb5fc984a6d5162a97dfc2', 'Pb*x+T', 'Pb,T', '2', '1'),
('62', 'e8d0889a2f34d846a49b7392cd2ebc78', 'Pb*x+T', 'Pb,T', '2', '1'),
('63', 'a54d0a650170c5bc680f4af948a41703', 'Pb*x+T', 'Pb,T', '2', '1'),
('64', 'cf1a0731eb87cc0da32fdbdea50c9a7c', 'a*x+b', 'a,b', '2', '1'),
('65', '334e316daa021d006207c4c0a7ff8db8', 'Pb*x+T', 'Pb,T', '2', '1'),
('66', '54a44cfb1c15f51df96bba9f37864238', 'Pb*x+T', 'Pb,T', '2', '1'),
('67', '4f4d30b8324f311d4dc8e2a6d6b9a30f', 'Pb*x+T', 'Pb,T', '2', '1'),
('68', '9f89d7e27dc0e649105e00017109d8f8', 'Pb*x+T', 'Pb,T', '2', '1'),
('69', '3ec80f8a576bca6cae61a059dc6edebe', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('70', 'c615521b0ce1c816680c5f500479bc9f', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('71', '82f7b22091c26a8d1b2b6157837bca93', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('72', 'ac0c76951b4ec771af1cbe322c6ddbfa', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('73', 'd2af69089d206dc53d626d54ad456116', 'Pb*x+T', 'Pb,T', '2', '1'),
('74', '8273f0e2bacfbca038283b399a1aabf8', 'Pb*x+T', 'Pb,T', '2', '1'),
('75', 'bde459fad3462bae2f51a037e28b06bf', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('76', '037ab7f17e65ca2fba947e1a85dd5402', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('77', '85e2c484cddc8106c37c519372d891bf', 'Pb*x+T', 'Pb,T', '2', '1'),
('78', '1297d44b063c796f2a18bb0887e5b9a6', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('79', '812adbffc0b9ab8d6479e719f362d079', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('80', 'd34820c13fcdbe2de15e751f8897be73', 'm*x+c', 'm,c', '2', '0'),
('81', '2adfe925cca3378d565969ba83f90cb8', 'Pb*x+T', 'Pb,T', '2', '0'),
('82', 'a1862a6425a0d11ed8b4c08ddf09c805', 'Pb*x+T', 'Pb,T', '2', '1'),
('83', '21bf3fa3af97c7db6b9f7d6063c35ab0', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('84', 'e5add1c95a9fea4010c28c06dbf3ec95', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('85', '030470bd4342910b7015bc8c3ef63747', 'Pb*x+T', 'Pb,T', '2', '0'),
('86', 'e547a165c766facda4acb8ca121b038f', 'Pb*x+T', 'Pb,T', '2', '1'),
('87', '1f7d7141458ddd54b1f180da72739ed6', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('88', 'bb9d755146444b0c02331846e6b3c5a7', 'Pb*x+T', 'Pb,T', '2', '1'),
('89', 'a8237e8781043fd9189f90eb8d08114f', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('90', '67227d65b956426a9e43d6031e7a5c3e', 'm*x+c', 'm,c', '2', '1'),
('91', 'd62e4afa327cb2e134c8c6ffdbea9bdc', 'x**2+c', 'c,sigma_gauss', '2', '1'),
('92', '67ce717fb68c76f3ae3f093b20bc009c', 'x**2+', 'c', 'c', '1'),
('93', 'b62bfd2a4f68fd7b1c774b598649a103', 'm*x+c', 'm,c', '2', '0'),
('94', '51e6fa4deddc93f96c096a68fa455bfa', 'm*x+c', 'm,c,sigma_gauss', '3', '1'),
('95', '01b672ffbb18dbc870f22c6f450c545e', 'm*x+c', 'm,c', '2', '1'),
('96', '117c6356716da82b16161668fb486280', 'm*(x**3)+c', 'm,c', '2', '1'),
('97', 'f679abbe86ba0b8345a5c706cc7f48eb', 'm*(x**3)+c', 'm,c', '2', '1'),
('98', '740face92d23809e08ee66fd0c4bedba', 'm*(x**3)+c', 'm,c', '2', '1'),
('99', '0a367cdc2c2b3eab0c7df00dc1ade8bd', 'm*x+c', 'm,c,sigma_gauss', '3', '1'),
('100', 'b52fb28ca9ec1039bfee7327644366ef', 'm*x+c', 'm,c,sigma_gauss', '3', '1'),
('101', '8335ab5588c510947beaafaca74666e0', 'm*x+c', 'm,c', '2', '1'),
('102', '5515ff44a9b9f2b2886a0decd722be17', 'm*x+c', 'm,c', '2', '1'),
('103', '13ec6b541300bf438a9da8d9dd601604', 'm*x*x+c', 'm,c', '2', '1'),
('104', '5e78717102995fd2849c59e9e43ce5c6', 'm*x+c', 'm,c', '2', '1'),
('105', '8fa7e295436b409975fa30f0fcdd8a09', 'c*x', 'c', '1', '0'),
('106', '190bb243caab284a0387a0fb27c1f06a', 'm*x', 'm', '1', '1'),
('107', '095d269b7ebc2e278c5e067ffdbd0965', 'Pb*x+T', 'Pb,T', '2', '1'),
('108', '9e38d77e2eafa4a922e3285cb5fa39ed', 'Pb*x+T', 'Pb,T', '2', '1'),
('109', '8cd6241f80d1c776061d361471863dc5', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('110', '6ec44586f6ecdae8092d30fda01241e5', 'Pb*x+T', 'Pb,T', '2', '1'),
('111', '2f6f636586eaad8e58ad6d4a5e330df2', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('112', '2fa36b758cb9a7a185aa847d407b4a9d', 'Pb*x+T', 'Pb,T', '2', '1'),
('113', 'd1db614f44a83026a75d1ef5cb71b74e', 'm*x*x+c', 'm,c', '2', '1'),
('114', 'e128b5272bcf029a4477fb4c477d0806', 'm*x*x+c', 'm', '1', '1'),
('115', 'b7ea97dc2c9f86b6fadb2a459add1727', 'm*x*x+C', 'C', '1', '1'),
('116', '501a712453c83856f62d6f34ba5a89bd', 'm*x*x+c', 'm', '1', '1'),
('117', '26460c4cd2680f2b2e88dbdd4f507acd', 'm*x*x+C', 'm', '1', '1'),
('118', 'd39af05efc3e4fdb4b9f95aa06f21b76', 'm*x*x+C', 'm', '1', '1'),
('119', '7487e1b35b3ab136eec1212894d5f9db', 'm*x*x+C', 'm', '1', '1'),
('120', 'b17b7f4fc36b5b4bb6a300d76fa2a6b1', 'm*x', 'm', '1', '1'),
('121', 'ec2b9aceba8b6c0578d728322aa62757', 'm*x*x+C', 'm', '1', '1'),
('122', '5089cc4b8c31bd2128cd5d224e8665c8', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('123', '421b174e1662c822fd58d18475a0e059', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('124', '029315d0891806a08765716d4c095e94', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('125', 'dfe77e7517d46f3104cf70f206f0bff3', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('126', 'c6c131e5007a8d8440140eaccb5de334', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '0'),
('127', 'fc97a776dd1ecc82c01286e6bab0ce2a', '0.5*Pdot*x**2+Pb*x+T', 'Pdot,Pb,T', '3', '1'),
('128', '1dee3859946b1201460eb5b72d67759c', 'm*x', 'm', '1', '0'),
('129', '7f0dcff38fc02be965ad3596aa502b81', 'm*x', 'm', '1', '1'),
('130', '5fc50e64bb16925e30ff3e9faec050af', 'm*x*x+c', 'c', '1', '1'),
('131', '9d2db8799c85fee2f84ca9cdc2241124', 'm*x*x+C', 'C', '1', '1'),
('132', 'ef1843cf1e10629f74726d5a2813253f', 'm*x**5', 'm', '1', '1'),
('133', 'be3dd55850ece6dd42e1f5ca8e2ea865', '(x-m)**2', 'm', '1', '1'),
('134', '4b489717f94cb97058861a54e11068d6', 'x**5+(x-m)^2+C', 'm,C', '2', '0'),
('135', '8da28381f954ae8b4aa0e8f34beae3d4', '(x-m)**2', 'm', '1', '1'),
('136', '5c7ff164f4ebcc9143d4dd9a808c6b21', 'x**5+(x-m)^2', 'm', '1', '0'),
('137', '46bca26fcf83be1d447983aeb11cc8db', 'x**3+x^2+c', 'c', '1', '0'),
('138', '90fa178852c926149e98e13a731ad6cc', 'm*x', 'm', '1', '1'),
('139', 'c85a11eb2f5668b6591b4260ef2cb7f0', 'sin(x)+m', 'm', '1', '1'),
('140', '6fa611d2c9a05740a3307920840e5deb', 'm*x', 'm', '1', '1'),
('141', 'bcb52ee7c2b2f46f94b1f2a8443e69b4', 'm*x', 'm', '1', '0'),
('142', '6ad27dec0b70a00a18407a9d20986155', 'm*x', 'm', '1', '0'),
('143', 'bcb52ee7c2b2f46f94b1f2a8443e69b4', 'm*x', 'm', '1', '1'),
('144', '6ad27dec0b70a00a18407a9d20986155', 'm*x', 'm', '1', '0'),
('145', '6ad27dec0b70a00a18407a9d20986155', 'm*x', 'm', '1', '0'),
('146', '6ad27dec0b70a00a18407a9d20986155', 'm*x', 'm', '1', '0'),
('147', '6ad27dec0b70a00a18407a9d20986155', 'm*x', 'm', '1', '0'),
('148', '820058fa2090e76a4d9ee76300f3c272', 'm*x', 'm', '1', '1'),
('149', '464d36039dec1e23b3afcf8a116fe883', 'm*x', 'm', '1', '0'),
('150', 'a9471919c100548fb46aec49fb975b1e', 'm*X', 'm', '1', '0'),
('151', '4be4199903d7e19c0b28c44077059b8d', 'm*x', 'm', '1', '1'),
('152', '6ad27dec0b70a00a18407a9d20986155', 'm*x', 'm', '1', '0'),
('153', '820058fa2090e76a4d9ee76300f3c272', 'm*x', 'm', '1', '1'),
('154', '8890d6b146db4e1b15bfc2247f22fd0b', 'm*x*x+c', 'm,c', '2', '1'),
('155', '7f3ff961daf22c4f3a0a2875316c837e', 'm*x', 'm', '1', '1'),
('156', 'c268debd3730cf519115e95263217e1b', 'm*x', 'm', '1', '1'),
('157', 'bcb52ee7c2b2f46f94b1f2a8443e69b4', 'm*x', 'm', '1', '1'),
('158', '820058fa2090e76a4d9ee76300f3c272', 'm*x', 'm', '1', '1'),
('159', 'bcb52ee7c2b2f46f94b1f2a8443e69b4', 'm*x', 'm', '1', '1'),
('160', 'd2d867e0a5ff122fd3a29a426eb6f474', 'm*x', 'm', '1', '1'),
('161', 'a987cef2d78203466449956ca6e991b2', 'm*x', 'm', '1', '0'),
('162', 'a987cef2d78203466449956ca6e991b2', 'm*x', 'm', '1', '0'),
('163', 'a987cef2d78203466449956ca6e991b2', 'm*x', 'm', '1', '0'),
('164', 'a987cef2d78203466449956ca6e991b2', 'm*x', 'm', '1', '0'),
('165', '1c12edb44cef6b505414b91cfc9e49f5', 'm*x', 'm', '1', '0'),
('166', '1c12edb44cef6b505414b91cfc9e49f5', 'm*x', 'm', '1', '0'),
('167', '1c12edb44cef6b505414b91cfc9e49f5', 'm*x', 'm', '1', '0'),
('168', '63aee2c6cb61ef64537cc8a33c243b37', 'm*x', 'm', '1', '0'),
('169', '63aee2c6cb61ef64537cc8a33c243b37', 'm*x', 'm', '1', '0'),
('170', '5c83d9a2703b4ee333976019f1909dae', 'm*x', 'm', '1', '1'),
('171', 'f088d55f4ff8fbc217e8b0c4a52dd790', 'm*x+c', 'm,c', '2', '1'),
('172', '103e4d07e2566285e3bd736b89b0bd6e', 'm*x', 'm', '1', '0'),
('173', '72c842337bf7cd3a12a35f5b9a1588d1', 'm*x', 'm', '1', '0'),
('174', '72c842337bf7cd3a12a35f5b9a1588d1', 'm*x', 'm', '1', '0'),
('175', '2bc9c47ecd10bcd8b48cb549506a58b6', 'm*x', 'm', '1', '1'),
('176', '31fa0d2cb281521ef6fb95df3f3bcfdf', 'm*x', 'm', '1', '1'),
('177', '63bf4ecefd4ac188d6fe62b6fe5f3a08', 'm*x', 'm', '1', '0'),
('178', '63bf4ecefd4ac188d6fe62b6fe5f3a08', 'm*x', 'm', '1', '0'),
('179', '63bf4ecefd4ac188d6fe62b6fe5f3a08', 'm*x', 'm', '1', '0'),
('180', '63bf4ecefd4ac188d6fe62b6fe5f3a08', 'm*x', 'm', '1', '0'),
('181', 'd5cdbe38fdc5bcc7a50fcc6ac5eac62d', 'm*x', 'm', '1', '1'),
('182', '6e9862ee700597a553d49d891e04bfe6', 'm*x', 'm', '1', '0'),
('183', 'b86bc39000a5782b8d53c3ac833f00f5', 'm*x', 'm', '1', '1'),
('184', '6e9862ee700597a553d49d891e04bfe6', 'm*x', 'm', '1', '0'),
('185', '6e9862ee700597a553d49d891e04bfe6', 'm*x', 'm', '1', '0'),
('186', '6e9862ee700597a553d49d891e04bfe6', 'm*x', 'm', '1', '0'),
('187', 'aedecdc854cedd29c367045a657de644', 'm*x', 'm', '1', '1'),
('188', 'f44877be9342ba70c7c7d7d35f4160be', 'm*x', 'm', '1', '1'),
('189', '23bdec565dca206b9a55a084dcebaf4f', 'm*x', 'm', '1', '1'),
('190', '6e8ea92c0b3914a7352d42790ee904d2', 'm*x', 'm', '1', '1'),
('191', 'a8007ed87050a3e03a5001f699484542', 'm*x', 'm', '1', '0'),
('192', 'e5c5ccb36e456fd43ab50893eab5c147', 'm*x', 'm', '1', '1'),
('193', 'aa72d5ea85cef66599667255de1dc9e5', 'm*x', 'm', '1', '1'),
('194', '97043d973bcae6ac5336dce414297f4d', 'm*x', 'm', '1', '1'),
('195', '019fb199b942db376d74c2bba4145a8a', 'm*x', 'm', '1', '1'),
('196', 'c754efad9eedcc952a1a6d13d84c964e', 'm*x', 'm', '1', '0'),
('197', 'c754efad9eedcc952a1a6d13d84c964e', 'm*x', 'm', '1', '0'),
('198', 'c754efad9eedcc952a1a6d13d84c964e', 'm*x', 'm', '1', '0'),
('199', 'c754efad9eedcc952a1a6d13d84c964e', 'm*x', 'm', '1', '0'),
('200', '67c6e8f7bae16e42983debee2776b83f', 'm*x', 'm', '1', '0'),
('201', 'f9b80477a8d17c3a66bbaed860f13c09', 'm*x', 'm', '1', '0'),
('202', 'b4f01e2a422b0cec385a8f9f22c3befe', 'm*x', 'm', '1', '1'),
('203', 'f9b80477a8d17c3a66bbaed860f13c09', 'm*x', 'm', '1', '0'),
('204', '46f892055f85b1505d68461d44840c27', 'm*x', 'm', '1', '0'),
('205', 'f9b80477a8d17c3a66bbaed860f13c09', 'm*x', 'm', '1', '1'),
('206', 'd8bdb45457828b9da502c5ac802045f3', 'm*x', 'm', '1', '0'),
('207', 'd8bdb45457828b9da502c5ac802045f3', 'm*x', 'm', '1', '0'),
('208', 'd8bdb45457828b9da502c5ac802045f3', 'm*x', 'm', '1', '0'),
('209', 'd8bdb45457828b9da502c5ac802045f3', 'm*x', 'm', '1', '0'),
('210', 'd8bdb45457828b9da502c5ac802045f3', 'm*x', 'm', '1', '0'),
('211', 'd8bdb45457828b9da502c5ac802045f3', 'm*x', 'm', '1', '0'),
('212', '5ebb777892f0d861b44be2367254b335', 'm*x', 'm', '1', '0'),
('213', '5ebb777892f0d861b44be2367254b335', 'm*x', 'm', '1', '0'),
('214', '5ebb777892f0d861b44be2367254b335', 'm*x', 'm', '1', '0'),
('215', 'c2e771879dc971e7ada2899bf74122a9', 'm*x', 'm', '1', '0'),
('216', 'ee80b9797a188e29fbd0ed37e9bb741d', 'm*x', 'm', '1', '0'),
('217', '54d29469aebdbd376ea310de9fecdef7', 'm*x', 'm', '1', '1'),
('218', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '0'),
('219', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '0'),
('220', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '0'),
('221', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '0'),
('222', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '0'),
('223', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '0'),
('224', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '0'),
('225', '844ed47f0b79e4a55849788f410be080', 'm*x', 'm', '1', '1'),
('226', 'b4abc72d05b052860a265ffbb3cad284', 'm*x', 'm', '1', '0'),
('227', '9c7d2984947f9fe33cb58cdf6528f52c', 'm*x', 'm', '1', '0'),
('228', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '1'),
('229', '5e9a3d9dc009302da858cefd7260cd34', 'm*x', 'm', '1', '1'),
('230', '586ecedf56e2124c4e063482b578404c', 'm*x', 'm', '1', '1'),
('231', '58a706ff6e8991d5890ea9c13ad875fd', 'm*x', 'm', '1', '0'),
('232', '3e74674bc3ef99cd87cf49c6b118186a', 'm*x', 'm', '1', '0'),
('233', '60b5e49cdf96cf7849a0d7697e95b59c', 'm*x', 'm', '1', '0'),
('234', '9032abe2ddba9d66454395e1978e6f53', 'm*x', 'm', '1', '0'),
('235', 'e7a86160e353d11c2510406dc9a7c4a6', 'm*x', 'm', '1', '1'),
('236', '0742788a6c705ac3b35060848ce8a4c0', 'm*x', 'm', '1', '0'),
('237', '0742788a6c705ac3b35060848ce8a4c0', 'm*x', 'm', '1', '1'),
('238', '0742788a6c705ac3b35060848ce8a4c0', 'm*x', 'm', '1', '1'),
('239', '0742788a6c705ac3b35060848ce8a4c0', 'm*x', 'm', '1', '1'),
('240', '0742788a6c705ac3b35060848ce8a4c0', 'm*x', 'm', '1', '1'),
('241', '0742788a6c705ac3b35060848ce8a4c0', 'm*x', 'm', '1', '0'),
('242', '0742788a6c705ac3b35060848ce8a4c0', 'm*x', 'm', '1', '0'),
('243', '511dbd317d38ac281019a6f4812d0f2e', 'm*x', 'm', '1', '0'),
('244', 'c74a6ff2b6dba3dc7c879b7366cee55d', 'm*x', 'm', '1', '1'),
('245', 'cfe7cb37d99df6f6e02c7f9f075f4135', 'm*x', 'm', '1', '1'),
('246', '97b68fa7c71085ffc536d44ec15d5d15', 'm*x', 'm', '1', '1'),
('247', 'b34b4d7b82bf71f6a1c9f6b56de2feb2', 'm*x', 'm', '1', '1'),
('248', 'e95e8892fa73e515e946fca4b61436e4', 'm*x', 'm', '1', '1'),
('249', '7df8cefdf0e3d02d3f7f003cd6b0a67a', 'm*x+c', 'm,c', '2', '1'),
('250', 'a5a8dd66a41e2d5933b009576f5861a6', 'm*sin(2*pi*day/365+alpha)+c', 'm,alpha,c,sigma_gauss', '4', '1'),
('251', 'e18d298041c459521e98cb91d3439590', 'm*x+c', 'm,c,sigma_gauss', '3', '1'),
('252', 'e12f5320dba25df151112bac27d353b1', 'm*x+c', 'm,c', '2', '1'),
('253', 'fd3078cdba3f73214038c1c2921a038d', 'm*x+c', 'm,c', '2', '1'),
('254', '334b884c8b01635fb9e4239cec71eba0', 'm*x', 'm', '1', '1'),
('255', 'b2e9d28cf7f40b0888180e33a0db64f0', 'm*x', 'm', '1', '1'),
('256', '8978b96ae948bdf1aedce19bdb10cdf3', 'm*x', 'm', '1', '1'),
('257', 'c7842c9f0172ae7c42a521083cb98a60', 'm*sin(x)+c', 'm,c', '2', '1'),
('258', '95fca99c17bc73d5facc500b6b0aaf29', 'm*x', 'm', '1', '1'),
('259', '7cedb2e68b558fb7c4fbae2533eddd62', 'm*x', 'm', '1', '1'),
('260', '57b29e2ae8e95f7e55837a840f2c99a2', 'm*x*x', 'm', '1', '1'),
('261', '849e8cee32a24877c3e8ce11046ee8d9', 'piecewise(x,[x<=5,x>5],[lambda x:x**a1,  lambda  x:x**1])', 'a', '1', '0'),
('262', '849e8cee32a24877c3e8ce11046ee8d9', 'piecewise(x,[x<=5,x>5],[lambda x:x**a1,  lambda  x:x**1])', 'a', '1', '0'),
('263', '849e8cee32a24877c3e8ce11046ee8d9', 'piecewise(x,[x<=5,x>5],[lambda x:x**a1,  lambda  x:x**1])', 'a', '1', '0'),
('264', '849e8cee32a24877c3e8ce11046ee8d9', 'piecewise(x,[x<=5,x>5],[lambda x:x**a1,  lambda  x:x**1])', 'a', '1', '0'),
('265', '853ddc32ca987595a506db4620f5a23c', 'piecewise(x,[x<=2,x>2],[lambda x:x**3,  lambda  x:x**a])', 'a', '1', '1'),
('266', 'c6127b51c4ac474ba23e1a51635c349e', 'piecewise(x,[x<=5,x>5],[lambda x:x**a,   lambda  x:x**2])', 'a', '1', '1'),
('267', '9c5821c35bd64c92deeba777621ea805', 'm*x', 'm', '1', '1'),
('268', '6a131bc23ab1546a6d05fac8bca25766', 'a*sin(m*x)', 'a,m', '2', '1'),
('269', 'ea06b85b18017168a28c1a128a649abc', 'm*x', 'm', '1', '1'),
('270', 'c82e254d57b5e5e1ec60011a6e5519a7', 'm*x+c', 'm,c', '2', '1'),
('271', 'c4ee9bf151936c3acfb52dbc443b9d57', 'ma*x**2+mb*x+mc', 'ma,mb,mc', '3', '1'),
('272', '30b5c90b0bafa05b224a58026f201688', 'm*x+C', 'm,C', '2', '1'),
('273', '9868680b597b585e16c831b2956de9b6', 'a*x**2+b*x+c', 'a,b,c', '3', '1'),
('274', '350c1fee08fe1b50a388bdd11b486fd1', 'm*x+c', 'm,c', '2', '1');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
