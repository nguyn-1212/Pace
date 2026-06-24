/*
 Navicat Premium Data Transfer

 Source Server         : CMS OneFin [DEV]
 Source Server Type    : MySQL
 Source Server Version : 80033
 Source Host           : 172.16.15.131:3306
 Source Schema         : onefin

 Target Server Type    : MySQL
 Target Server Version : 80033
 File Encoding         : 65001

 Date: 04/07/2023 16:46:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for AspNetUserLogins
-- ----------------------------
DROP TABLE IF EXISTS `AspNetUserLogins`;
CREATE TABLE `AspNetUserLogins`  (
  `LoginProvider` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ProviderKey` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ProviderDisplayName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `UserId` int NOT NULL,
  PRIMARY KEY (`LoginProvider`, `ProviderKey`) USING BTREE,
  INDEX `IX_AspNetUserLogins_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_AspNetUserLogins_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of AspNetUserLogins
-- ----------------------------

-- ----------------------------
-- Table structure for AspNetUserTokens
-- ----------------------------
DROP TABLE IF EXISTS `AspNetUserTokens`;
CREATE TABLE `AspNetUserTokens`  (
  `UserId` int NOT NULL,
  `LoginProvider` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  PRIMARY KEY (`UserId`, `LoginProvider`, `Name`) USING BTREE,
  CONSTRAINT `FK_AspNetUserTokens_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of AspNetUserTokens
-- ----------------------------

-- ----------------------------
-- Table structure for Bank
-- ----------------------------
DROP TABLE IF EXISTS `Bank`;
CREATE TABLE `Bank`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `FullName` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Bank_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Bank_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_Bank_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Bank_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Bank
-- ----------------------------

-- ----------------------------
-- Table structure for Branch
-- ----------------------------
DROP TABLE IF EXISTS `Branch`;
CREATE TABLE `Branch`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `BankId` int NULL DEFAULT NULL,
  `Phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Branch_BankId`(`BankId`) USING BTREE,
  INDEX `IX_Branch_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Branch_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_Branch_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Branch_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Branchss_BankId` FOREIGN KEY (`BankId`) REFERENCES `Bank` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Branch
-- ----------------------------

-- ----------------------------
-- Table structure for City
-- ----------------------------
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_City_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_City_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_City_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_City_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of City
-- ----------------------------

-- ----------------------------
-- Table structure for Department
-- ----------------------------
DROP TABLE IF EXISTS `Department`;
CREATE TABLE `Department`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Department_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Department_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_Department_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Department_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Department
-- ----------------------------
INSERT INTO `Department` VALUES (1, 'Phòng Kinh doanh TT1', 'KN_KINHDOANH1', NULL, 1, 0, 1, NULL, 'onefin', '2023-07-04 16:26:33.556300', NULL);

-- ----------------------------
-- Table structure for District
-- ----------------------------
DROP TABLE IF EXISTS `District`;
CREATE TABLE `District`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CityId` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_District_CityId`(`CityId`) USING BTREE,
  INDEX `IX_District_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_District_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_District_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_District_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Districts_CityId` FOREIGN KEY (`CityId`) REFERENCES `City` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of District
-- ----------------------------

-- ----------------------------
-- Table structure for EmailTemplate
-- ----------------------------
DROP TABLE IF EXISTS `EmailTemplate`;
CREATE TABLE `EmailTemplate`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(550) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `SmtpAccountId` int NULL DEFAULT NULL,
  `Type` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_EmailTemplate_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_EmailTemplate_SmtpAccountId`(`SmtpAccountId`) USING BTREE,
  INDEX `IX_EmailTemplate_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_EmailTemplate_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_EmailTemplate_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_EmailTemplates_SmtpAccountId` FOREIGN KEY (`SmtpAccountId`) REFERENCES `SmtpAccount` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of EmailTemplate
-- ----------------------------
INSERT INTO `EmailTemplate` VALUES (1, 'Hệ thống tạo tài khoản cho CMS OneFin', '<p>Ch&agrave;o bạn {{FullName}}!</p>\n<p>&nbsp;</p>\n<p>T&agrave;i khoản đăng nhập: {{Email}}</p>\n<p>Mật khẩu đăng nhập: {{Password}}</p>\n<p>&nbsp;</p>\n<p>Cảm ơn!</p>', 1, 6, 1, 0, 1, 1, 'onefin', '2023-06-08 14:19:38.368807', '2023-07-04 16:28:04.514613');

-- ----------------------------
-- Table structure for GenderType
-- ----------------------------
DROP TABLE IF EXISTS `GenderType`;
CREATE TABLE `GenderType`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_GenderType_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_GenderType_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_GenderType_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_GenderType_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of GenderType
-- ----------------------------

-- ----------------------------
-- Table structure for LinkPermission
-- ----------------------------
DROP TABLE IF EXISTS `LinkPermission`;
CREATE TABLE `LinkPermission`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Order` int NULL DEFAULT NULL,
  `Name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Link` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Group` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ParentId` int NULL DEFAULT NULL,
  `CssIcon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `GroupOrder` int NULL DEFAULT NULL,
  `PermissionId` int NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_LinkPermission_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_LinkPermission_Order`(`Order`) USING BTREE,
  INDEX `IX_LinkPermission_ParentId`(`ParentId`) USING BTREE,
  INDEX `IX_LinkPermission_PermissionId`(`PermissionId`) USING BTREE,
  INDEX `IX_LinkPermission_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_LinkPermission_LinkPermission_ParentId` FOREIGN KEY (`ParentId`) REFERENCES `LinkPermission` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LinkPermission_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LinkPermission_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LinkPermissions_PermissionId` FOREIGN KEY (`PermissionId`) REFERENCES `Permission` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of LinkPermission
-- ----------------------------
INSERT INTO `LinkPermission` VALUES (1, NULL, 'Chức năng', '/admin/permission', '', 3, 'la la-cogs', 1, 1, 1, 0, 1, 1, 'onefin', '2023-06-08 10:38:48.196229', '2023-06-08 11:00:15.097028');
INSERT INTO `LinkPermission` VALUES (2, 1, 'Đường dẫn', '/admin/linkpermission', '', 3, 'la la-link', NULL, 5, 1, 0, 1, 1, 'onefin', '2023-06-08 10:51:48.899830', '2023-06-08 11:00:08.037887');
INSERT INTO `LinkPermission` VALUES (3, NULL, 'Cấu hình', '/', 'Quản trị hệ thống', NULL, 'la la-cog', 100, 1, 1, 0, 1, NULL, 'onefin', '2023-06-08 10:59:52.881076', NULL);
INSERT INTO `LinkPermission` VALUES (4, NULL, 'Quản trị tài khoản', '/', 'Quản trị hệ thống', NULL, 'la la-users', NULL, 9, 1, 0, 1, NULL, 'onefin', '2023-06-08 11:13:33.666455', NULL);
INSERT INTO `LinkPermission` VALUES (5, NULL, 'Tài khoản', '/admin/user', NULL, 4, NULL, NULL, 9, 1, 0, 1, NULL, 'onefin', '2023-06-08 11:14:23.495512', NULL);
INSERT INTO `LinkPermission` VALUES (6, NULL, 'Phân quyền', '/admin/role', NULL, 4, NULL, NULL, 15, 1, 0, 1, NULL, 'onefin', '2023-06-08 11:15:19.452420', NULL);
INSERT INTO `LinkPermission` VALUES (7, NULL, 'Nhật ký', '/', 'Quản trị hệ thống', NULL, 'la la-list', NULL, 20, 1, 0, 1, 1, 'onefin', '2023-06-08 11:23:18.001862', '2023-06-08 11:25:12.872623');
INSERT INTO `LinkPermission` VALUES (8, NULL, 'Nhật ký lỗi', '/admin/logexception', NULL, 7, NULL, NULL, 19, 1, 0, 1, NULL, 'onefin', '2023-06-08 11:24:03.068823', NULL);
INSERT INTO `LinkPermission` VALUES (9, NULL, 'Nhật ký hoạt động', '/admin/logactivity', NULL, 7, NULL, NULL, 20, 1, 0, 1, NULL, 'onefin', '2023-06-08 11:24:41.512388', NULL);
INSERT INTO `LinkPermission` VALUES (10, 3, 'Mẫu Email', '/admin/emailtemplate', NULL, 3, NULL, NULL, 21, 1, 0, 1, NULL, 'onefin', '2023-06-08 15:18:01.449490', NULL);
INSERT INTO `LinkPermission` VALUES (11, 4, 'Tài khoản Smtp', '/admin/smtpaccount', NULL, 3, NULL, NULL, 25, 1, 0, 1, NULL, 'onefin', '2023-06-08 15:18:36.595237', NULL);
INSERT INTO `LinkPermission` VALUES (12, 3, 'Nhóm', '/admin/team', NULL, 4, '', NULL, 29, 1, 0, 1, 1, 'onefin', '2023-07-04 16:31:12.997458', '2023-07-04 16:31:26.072851');
INSERT INTO `LinkPermission` VALUES (13, 4, 'Phòng ban', '/admin/department', NULL, 4, NULL, NULL, 33, 1, 0, 1, NULL, 'onefin', '2023-07-04 16:31:58.103703', NULL);

-- ----------------------------
-- Table structure for LogActivity
-- ----------------------------
DROP TABLE IF EXISTS `LogActivity`;
CREATE TABLE `LogActivity`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Ip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Url` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `UserId` int NULL DEFAULT NULL,
  `Body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `Notes` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Method` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Action` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ObjectId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `DateTime` datetime(6) NOT NULL,
  `Controller` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_LogActivity_Controller`(`Controller`) USING BTREE,
  INDEX `IX_LogActivity_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_LogActivity_ObjectId`(`ObjectId`) USING BTREE,
  INDEX `IX_LogActivity_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_LogActivity_Url`(`Url`) USING BTREE,
  INDEX `IX_LogActivity_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_LogActivities_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LogActivity_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LogActivity_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of LogActivity
-- ----------------------------

-- ----------------------------
-- Table structure for LogException
-- ----------------------------
DROP TABLE IF EXISTS `LogException`;
CREATE TABLE `LogException`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NULL DEFAULT NULL,
  `Exception` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `DateTime` datetime(6) NOT NULL,
  `StackTrace` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `InnerException` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_LogException_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_LogException_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_LogException_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_LogException_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LogException_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LogExceptions_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of LogException
-- ----------------------------

-- ----------------------------
-- Table structure for Notify
-- ----------------------------
DROP TABLE IF EXISTS `Notify`;
CREATE TABLE `Notify`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NULL DEFAULT NULL,
  `IsRead` tinyint(1) NOT NULL,
  `Title` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Content` varchar(550) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Type` int NOT NULL,
  `DateTime` datetime(6) NOT NULL,
  `JsonObject` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Notify_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Notify_IsActive`(`IsActive`) USING BTREE,
  INDEX `IX_Notify_IsDelete`(`IsDelete`) USING BTREE,
  INDEX `IX_Notify_IsRead`(`IsRead`) USING BTREE,
  INDEX `IX_Notify_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_Notify_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_Notify_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Notify_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Notify_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of Notify
-- ----------------------------
INSERT INTO `Notify` VALUES (1, 1, 0, 'Thay đổi mật khẩu', 'Lý do: Bạn hoặc ai đó đã thay đổi mật khẩu', 12, '2023-06-08 09:50:19.364588', NULL, 1, 0, 1, NULL, NULL, '2023-06-08 09:50:19.364691', NULL);
INSERT INTO `Notify` VALUES (2, 2, 0, 'Admin update role', NULL, 11, '2023-06-08 14:21:37.284213', NULL, 1, 0, 1, NULL, 'onefin', '2023-06-08 14:21:37.284275', NULL);
INSERT INTO `Notify` VALUES (3, 2, 0, 'Admin update role', NULL, 11, '2023-07-04 16:27:38.671532', NULL, 1, 0, 1, NULL, 'onefin', '2023-07-04 16:27:38.671573', NULL);

-- ----------------------------
-- Table structure for Permission
-- ----------------------------
DROP TABLE IF EXISTS `Permission`;
CREATE TABLE `Permission`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Title` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Group` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Types` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Action` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Controller` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Permission_Action`(`Action`) USING BTREE,
  INDEX `IX_Permission_Controller`(`Controller`) USING BTREE,
  INDEX `IX_Permission_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Permission_Name`(`Name`) USING BTREE,
  INDEX `IX_Permission_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_Permission_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Permission_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of Permission
-- ----------------------------
INSERT INTO `Permission` VALUES (1, 'Xem', 'Chức năng', '	\r\nQuản trị hệ thống', '[1]', 'View', 'Permission', 1, 0, 1, 1, 'onefin', '2023-06-07 19:18:50.632415', '2023-06-08 10:29:27.817962');
INSERT INTO `Permission` VALUES (2, 'Thêm mới', 'Chức năng', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'Permission', 1, 0, 1, 1, 'onefin', '2023-06-07 19:19:39.742036', '2023-06-08 10:29:23.658999');
INSERT INTO `Permission` VALUES (3, 'Sửa', 'Chức năng', '	\r\nQuản trị hệ thống', '[1]', 'Edit', 'Permission', 1, 0, 1, 1, 'onefin', '2023-06-07 19:20:09.010117', '2023-06-08 10:29:19.552017');
INSERT INTO `Permission` VALUES (4, 'Xóa', 'Chức năng', '	\r\nQuản trị hệ thống', '[1]', 'Delete', 'Permission', 1, 0, 1, 1, 'onefin', '2023-06-07 19:20:25.540721', '2023-06-08 10:29:15.006660');
INSERT INTO `Permission` VALUES (5, 'Xem', 'Đường dẫn', '	\r\nQuản trị hệ thống', '[1]', 'View', 'LinkPermission', 1, 0, 1, NULL, 'onefin', '2023-06-08 10:31:16.159135', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (6, 'Thêm mới', 'Đường dẫn', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'LinkPermission', 1, 0, 1, 1, 'onefin', '2023-06-08 10:31:46.829457', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (7, 'Sửa', 'Đường dẫn', '	\r\nQuản trị hệ thống', '[1]', 'Edit', 'LinkPermission', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:20.015926', '2023-06-08 10:33:26.578168');
INSERT INTO `Permission` VALUES (8, 'Xóa', 'Đường dẫn', '	\r\nQuản trị hệ thống', '[1]', 'Delete', 'LinkPermission', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:46.555544', '2023-06-08 10:33:52.229982');
INSERT INTO `Permission` VALUES (9, 'Xem', 'Tài khoản', '	\r\nQuản trị hệ thống', '[1]', 'View', 'User', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (10, 'Sửa', 'Tài khoản', '	\r\nQuản trị hệ thống', '[1]', 'Edit', 'User', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (11, 'Thêm mới', 'Tài khoản', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'User', 1, 0, 1, 1, 'onefin', '2023-06-08 10:31:46.829457', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (12, 'Xóa', 'Tài khoản', '	\r\nQuản trị hệ thống', '[1]', 'Delete', 'User', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:46.555544', '2023-06-08 10:33:52.229982');
INSERT INTO `Permission` VALUES (13, 'Khóa tài khoản', 'Tài khoản', '	\r\nQuản trị hệ thống', '[1]', 'Lock Account', 'User', 1, 0, 1, NULL, 'onefin', '2023-06-08 11:08:31.142992', NULL);
INSERT INTO `Permission` VALUES (14, 'Mở khóa tài khoản', 'Tài khoản', '	\r\nQuản trị hệ thống', '[1]', 'Unlock Account', 'User', 1, 0, 1, NULL, 'onefin', '2023-06-08 11:08:58.384733', NULL);
INSERT INTO `Permission` VALUES (15, 'Xem', 'Phân quyền', '	\r\nQuản trị hệ thống', '[1,2,3,4]', 'View', 'Role', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-07-04 16:45:14.750196');
INSERT INTO `Permission` VALUES (16, 'Sửa', 'Phân quyền', '	\r\nQuản trị hệ thống', '[1,2,3,4]', 'Edit', 'Role', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-07-04 16:45:20.128195');
INSERT INTO `Permission` VALUES (17, 'Thêm mới', 'Phân quyền', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'Role', 1, 0, 1, 1, 'onefin', '2023-06-08 10:31:46.829457', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (18, 'Xóa', 'Phân quyền', '	\r\nQuản trị hệ thống', '[1,2,3,4]', 'Delete', 'Role', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:46.555544', '2023-07-04 16:45:32.015023');
INSERT INTO `Permission` VALUES (19, 'Xem', 'Nhật ký lỗi', 'Quản trị hệ thống', '[1]', 'View', 'LogException', 1, 0, 1, 1, 'onefin', '2023-06-08 11:22:09.745214', '2023-06-08 11:22:20.422499');
INSERT INTO `Permission` VALUES (20, 'Xem', 'Nhật ký hoạt động', 'Quản trị hệ thống', '[1]', 'View', 'LogActivity', 1, 0, 1, NULL, 'onefin', '2023-06-08 11:22:37.135567', NULL);
INSERT INTO `Permission` VALUES (21, 'Xem', 'Mẫu email', 'Quản trị hệ thống', '[1]', 'View', 'EmailTemplate', 1, 0, 1, NULL, 'onefin', '2023-06-08 15:09:44.894673', NULL);
INSERT INTO `Permission` VALUES (22, 'Sửa', 'Mẫu email', '	\r\nQuản trị hệ thống', '[1]', 'Edit', 'EmailTemplate', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (23, 'Thêm mới', 'Mẫu email', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'EmailTemplate', 1, 0, 1, 1, 'onefin', '2023-06-08 10:31:46.829457', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (24, 'Xóa', 'Mẫu email', '	\r\nQuản trị hệ thống', '[1]', 'Delete', 'EmailTemplate', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:46.555544', '2023-06-08 10:33:52.229982');
INSERT INTO `Permission` VALUES (25, 'Xem', 'Tài khoản Smtp', 'Quản trị hệ thống', '[1]', 'View', 'SmtpAccount', 1, 0, 1, NULL, 'onefin', '2023-06-08 15:09:44.894673', NULL);
INSERT INTO `Permission` VALUES (26, 'Sửa', 'Tài khoản Smtp', '	\r\nQuản trị hệ thống', '[1]', 'Edit', 'SmtpAccount', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (27, 'Thêm mới', 'Tài khoản Smtp', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'SmtpAccount', 1, 0, 1, 1, 'onefin', '2023-06-08 10:31:46.829457', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (28, 'Xóa', 'Tài khoản Smtp', '	\r\nQuản trị hệ thống', '[1]', 'Delete', 'SmtpAccount', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:46.555544', '2023-06-08 10:33:52.229982');
INSERT INTO `Permission` VALUES (29, 'Xem', 'Nhóm', 'Quản trị hệ thống', '[1]', 'View', 'Team', 1, 0, 1, NULL, 'onefin', '2023-06-08 15:09:44.894673', NULL);
INSERT INTO `Permission` VALUES (30, 'Sửa', 'Nhóm', '	\r\nQuản trị hệ thống', '[1]', 'Edit', 'Team', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (31, 'Thêm mới', 'Nhóm', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'Team', 1, 0, 1, 1, 'onefin', '2023-06-08 10:31:46.829457', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (32, 'Xóa', 'Nhóm', '	\r\nQuản trị hệ thống', '[1]', 'Delete', 'Team', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:46.555544', '2023-06-08 10:33:52.229982');
INSERT INTO `Permission` VALUES (33, 'Xem', 'Phòng Ban', 'Quản trị hệ thống', '[1]', 'View', 'Department', 1, 0, 1, NULL, 'onefin', '2023-06-08 15:09:44.894673', NULL);
INSERT INTO `Permission` VALUES (34, 'Sửa', 'Phòng Ban', '	\r\nQuản trị hệ thống', '[1]', 'Edit', 'Department', 1, 0, 1, 1, 'onefin', '2023-06-08 11:04:43.646156', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (35, 'Thêm mới', 'Phòng Ban', '	\r\nQuản trị hệ thống', '[1]', 'Add new', 'Department', 1, 0, 1, 1, 'onefin', '2023-06-08 10:31:46.829457', '2023-06-08 10:32:00.353221');
INSERT INTO `Permission` VALUES (36, 'Xóa', 'Phòng Ban', '	\r\nQuản trị hệ thống', '[1]', 'Delete', 'Department', 1, 0, 1, 1, 'onefin', '2023-06-08 10:33:46.555544', '2023-06-08 10:33:52.229982');

-- ----------------------------
-- Table structure for RequestFilter
-- ----------------------------
DROP TABLE IF EXISTS `RequestFilter`;
CREATE TABLE `RequestFilter`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Controller` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `FilterData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_RequestFilter_Controller`(`Controller`) USING BTREE,
  INDEX `IX_RequestFilter_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_RequestFilter_Name`(`Name`) USING BTREE,
  INDEX `IX_RequestFilter_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_RequestFilter_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_RequestFilter_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_RequestFilter_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_RequestFilters_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of RequestFilter
-- ----------------------------

-- ----------------------------
-- Table structure for Role
-- ----------------------------
DROP TABLE IF EXISTS `Role`;
CREATE TABLE `Role`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NormalizedName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE INDEX `RoleNameIndex`(`NormalizedName`) USING BTREE,
  INDEX `IX_Role_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Role_Name`(`Name`) USING BTREE,
  INDEX `IX_Role_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_Role_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Role_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of Role
-- ----------------------------
INSERT INTO `Role` VALUES (1, 'Manager', 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:38.724916', NULL, NULL, 'Quản lý', NULL, NULL);

-- ----------------------------
-- Table structure for RoleClaim
-- ----------------------------
DROP TABLE IF EXISTS `RoleClaim`;
CREATE TABLE `RoleClaim`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` int NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_RoleClaim_RoleId`(`RoleId`) USING BTREE,
  CONSTRAINT `FK_RoleClaim_Role_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Role` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of RoleClaim
-- ----------------------------

-- ----------------------------
-- Table structure for RolePermission
-- ----------------------------
DROP TABLE IF EXISTS `RolePermission`;
CREATE TABLE `RolePermission`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` int NOT NULL,
  `Allow` tinyint(1) NULL DEFAULT NULL,
  `PermissionId` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_RolePermission_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_RolePermission_PermissionId`(`PermissionId`) USING BTREE,
  INDEX `IX_RolePermission_RoleId`(`RoleId`) USING BTREE,
  INDEX `IX_RolePermission_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_RolePermission_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_RolePermission_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_RolePermissions_PermissionId` FOREIGN KEY (`PermissionId`) REFERENCES `Permission` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_RolePermissions_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Role` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of RolePermission
-- ----------------------------
INSERT INTO `RolePermission` VALUES (1, 1, 1, 9, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.028838', NULL);
INSERT INTO `RolePermission` VALUES (2, 1, 1, 10, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054270', NULL);
INSERT INTO `RolePermission` VALUES (3, 1, 1, 11, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054765', NULL);
INSERT INTO `RolePermission` VALUES (4, 1, 1, 12, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054801', NULL);
INSERT INTO `RolePermission` VALUES (5, 1, 1, 13, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054839', NULL);
INSERT INTO `RolePermission` VALUES (6, 1, 1, 14, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054862', NULL);
INSERT INTO `RolePermission` VALUES (7, 1, 1, 15, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054886', NULL);
INSERT INTO `RolePermission` VALUES (8, 1, 1, 16, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054910', NULL);
INSERT INTO `RolePermission` VALUES (9, 1, 1, 17, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054930', NULL);
INSERT INTO `RolePermission` VALUES (10, 1, 1, 18, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054954', NULL);
INSERT INTO `RolePermission` VALUES (11, 1, 1, 19, 1, 0, 1, NULL, 'onefin', '2023-06-08 13:33:40.054977', NULL);

-- ----------------------------
-- Table structure for SmtpAccount
-- ----------------------------
DROP TABLE IF EXISTS `SmtpAccount`;
CREATE TABLE `SmtpAccount`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Port` int NULL DEFAULT NULL,
  `Host` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EnableSsl` tinyint(1) NULL DEFAULT NULL,
  `UserName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailFrom` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_SmtpAccount_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_SmtpAccount_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_SmtpAccount_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_SmtpAccount_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of SmtpAccount
-- ----------------------------
INSERT INTO `SmtpAccount` VALUES (1, 587, 'smtp.gmail.com', 1, 'notifications@meeyland.com', '3A%ugK4D1', 'notifications@meeyland.com', 1, 0, 1, NULL, 'onefin', '2023-06-08 14:17:26.797656', NULL);

-- ----------------------------
-- Table structure for Team
-- ----------------------------
DROP TABLE IF EXISTS `Team`;
CREATE TABLE `Team`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Team_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Team_Name`(`Name`) USING BTREE,
  INDEX `IX_Team_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_Team_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Team_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Team
-- ----------------------------
INSERT INTO `Team` VALUES (1, 'Nhóm Sale', 'SALE', NULL, 1, 0, 1, NULL, 'onefin', '2023-07-04 16:25:13.724935', NULL);
INSERT INTO `Team` VALUES (2, 'Nhóm Chăm sóc khách hàng', 'Support', NULL, 1, 0, 1, NULL, 'onefin', '2023-07-04 16:25:41.848303', NULL);

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Locked` tinyint(1) NULL DEFAULT NULL,
  `Avatar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `IsAdmin` tinyint(1) NULL DEFAULT NULL,
  `Address` varchar(550) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `FullName` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `VerifyCode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `UserType` int NOT NULL,
  `ReasonLock` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `DepartmentId` int NULL DEFAULT NULL,
  `Gender` int NULL DEFAULT NULL,
  `Birthday` datetime(6) NULL DEFAULT NULL,
  `VerifyTime` datetime(6) NULL DEFAULT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `UserName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `NormalizedEmail` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `SecurityStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `PhoneNumber` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) NULL DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE INDEX `UserNameIndex`(`NormalizedUserName`) USING BTREE,
  INDEX `EmailIndex`(`NormalizedEmail`) USING BTREE,
  INDEX `IX_User_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_User_DepartmentId`(`DepartmentId`) USING BTREE,
  INDEX `IX_User_Email`(`Email`) USING BTREE,
  INDEX `IX_User_FullName`(`FullName`) USING BTREE,
  INDEX `IX_User_IsActive`(`IsActive`) USING BTREE,
  INDEX `IX_User_IsDelete`(`IsDelete`) USING BTREE,
  INDEX `IX_User_Locked`(`Locked`) USING BTREE,
  INDEX `IX_User_PhoneNumber`(`PhoneNumber`) USING BTREE,
  INDEX `IX_User_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_User_UserName`(`UserName`) USING BTREE,
  CONSTRAINT `FK_User_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_User_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Users_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Department` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of User
-- ----------------------------
INSERT INTO `User` VALUES (1, 0, NULL, 1, NULL, 'Admin', NULL, 1, NULL, NULL, NULL, '2023-07-04 16:07:10.777736', NULL, 1, 0, NULL, NULL, 'onefin', '2023-07-04 16:07:10.777829', NULL, 'admin', 'ADMIN', 'admin@onefine.vn', 'ADMIN@ONEFINE.VN', 1, 'AQAAAAIAAYagAAAAECQqF3UOGeIiH4DCeOPqc4py/qY7rmCBCShk2OHMmKdE4WJfyR/mDMLoqRICQNiI6Q==', 'S76RIPOYNZ77OQHCFMAK5OH7UH4S2RBO', 'ac42c2d7-55e6-4b76-abd8-5a6ec53afbb2', '888888888', 0, 0, NULL, 1, 0);
INSERT INTO `User` VALUES (2, NULL, '', NULL, NULL, 'Nguyễn Văn A', '9UtPZoOq3J', 1, NULL, 1, 1, '2020-05-05 17:00:00.000000', '2023-07-04 16:27:35.856837', 1, 0, 1, NULL, 'onefin', '2023-07-04 16:27:35.856937', NULL, 'nguyenvana@onefin.com', 'NGUYENVANA@ONEFIN.COM', 'nguyenvana@onefin.com', 'NGUYENVANA@ONEFIN.COM', 0, 'AQAAAAIAAYagAAAAEMxzovdyLkiWfZBAxpVbA+UhfS6OrKWhsVqHBaytzqTmx1DI0cT/7YU+TD26APR+8A==', 'EUGZTEBC3LSBFV4INKCMLGIJ52X5VT64', '7a27f3f3-0f1c-461d-b66d-b22519618d62', '0987875745', 1, 0, NULL, 1, 0);

-- ----------------------------
-- Table structure for UserActivity
-- ----------------------------
DROP TABLE IF EXISTS `UserActivity`;
CREATE TABLE `UserActivity`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Os` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `UserId` int NOT NULL,
  `Country` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `Browser` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Incognito` tinyint(1) NOT NULL,
  `DateTime` datetime(6) NOT NULL,
  `Type` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_UserActivity_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_UserActivity_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_UserActivity_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_UserActivity_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserActivity_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserActivity_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of UserActivity
-- ----------------------------
INSERT INTO `UserActivity` VALUES (1, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 16:17:54.613684', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 16:17:54.609722', NULL);
INSERT INTO `UserActivity` VALUES (2, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 16:20:09.221117', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 16:20:09.220955', NULL);
INSERT INTO `UserActivity` VALUES (3, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 16:33:11.971889', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 16:33:11.971054', NULL);
INSERT INTO `UserActivity` VALUES (4, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 16:34:36.186294', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 16:34:36.185583', NULL);
INSERT INTO `UserActivity` VALUES (5, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 16:37:03.285094', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 16:37:03.284233', NULL);
INSERT INTO `UserActivity` VALUES (6, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 17:36:49.543935', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 17:36:49.543001', NULL);
INSERT INTO `UserActivity` VALUES (7, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 18:35:03.373273', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 18:35:03.372318', NULL);
INSERT INTO `UserActivity` VALUES (8, NULL, 'Windows [Version: 10]', 1, NULL, 'Edge [Version: 114.0.1823.37]', 0, '2023-06-07 18:35:06.186482', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 18:35:06.185450', NULL);
INSERT INTO `UserActivity` VALUES (9, '27.72.29.113', 'Windows [Version: 10]', 1, 'VN', 'Edge [Version: 114.0.1823.37]', 0, '2023-06-07 18:37:38.977958', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 18:37:38.977100', NULL);
INSERT INTO `UserActivity` VALUES (10, '27.72.29.113', 'Windows [Version: 10]', 1, 'VN', 'Edge [Version: 114.0.1823.37]', 0, '2023-06-07 18:41:24.084448', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 18:41:24.083792', NULL);
INSERT INTO `UserActivity` VALUES (11, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 18:42:25.031285', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 18:42:25.030560', NULL);
INSERT INTO `UserActivity` VALUES (12, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-07 18:44:51.778677', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 18:44:51.778646', NULL);
INSERT INTO `UserActivity` VALUES (13, '27.72.29.113', 'Windows [Version: 10]', 1, 'VN', 'Edge [Version: 114.0.1823.37]', 0, '2023-06-07 18:46:57.667828', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-07 18:46:57.667115', NULL);
INSERT INTO `UserActivity` VALUES (14, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 09:42:19.915071', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 09:42:19.913979', NULL);
INSERT INTO `UserActivity` VALUES (15, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 09:50:18.567203', 4, 1, 0, 1, NULL, NULL, '2023-06-08 09:50:18.566358', NULL);
INSERT INTO `UserActivity` VALUES (16, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 10:08:25.263390', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 10:08:25.262825', NULL);
INSERT INTO `UserActivity` VALUES (17, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 10:08:36.979560', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 10:08:36.978797', NULL);
INSERT INTO `UserActivity` VALUES (18, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 10:09:16.898570', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 10:09:16.898539', NULL);
INSERT INTO `UserActivity` VALUES (19, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 10:09:40.493144', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 10:09:38.349109', NULL);
INSERT INTO `UserActivity` VALUES (20, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 10:10:02.376268', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 10:10:02.376209', NULL);
INSERT INTO `UserActivity` VALUES (21, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 10:20:55.797017', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 10:20:55.796156', NULL);
INSERT INTO `UserActivity` VALUES (22, NULL, 'Windows [Version: 10]', 1, NULL, 'Chrome [Version: 114.0.0.0]', 0, '2023-06-08 10:23:13.295140', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 10:23:13.294333', NULL);
INSERT INTO `UserActivity` VALUES (23, NULL, 'Windows [Version: 10]', 1, NULL, 'Edge [Version: 114.0.1823.37]', 0, '2023-06-08 14:15:46.472532', 2, 1, 0, NULL, NULL, 'onefin', '2023-06-08 14:15:46.471831', NULL);

-- ----------------------------
-- Table structure for UserClaim
-- ----------------------------
DROP TABLE IF EXISTS `UserClaim`;
CREATE TABLE `UserClaim`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_UserClaim_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_UserClaim_User_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of UserClaim
-- ----------------------------

-- ----------------------------
-- Table structure for UserPermission
-- ----------------------------
DROP TABLE IF EXISTS `UserPermission`;
CREATE TABLE `UserPermission`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Allow` tinyint(1) NULL DEFAULT NULL,
  `PermissionId` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_UserPermission_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_UserPermission_PermissionId`(`PermissionId`) USING BTREE,
  INDEX `IX_UserPermission_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_UserPermission_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_UserPermission_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserPermission_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserPermissions_PermissionId` FOREIGN KEY (`PermissionId`) REFERENCES `Permission` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserPermissions_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of UserPermission
-- ----------------------------

-- ----------------------------
-- Table structure for UserRole
-- ----------------------------
DROP TABLE IF EXISTS `UserRole`;
CREATE TABLE `UserRole`  (
  `UserId` int NOT NULL,
  `RoleId` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`UserId`, `RoleId`) USING BTREE,
  INDEX `IX_UserRole_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_UserRole_RoleId`(`RoleId`) USING BTREE,
  INDEX `IX_UserRole_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_UserRole_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_UserRole_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Role` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserRole_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserRole_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserRole_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of UserRole
-- ----------------------------
INSERT INTO `UserRole` VALUES (2, 1, 0, 0, 1, NULL, 'onefin', '2023-06-08 14:21:36.100726', NULL);

-- ----------------------------
-- Table structure for UserTeam
-- ----------------------------
DROP TABLE IF EXISTS `UserTeam`;
CREATE TABLE `UserTeam`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `TeamId` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_UserTeam_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_UserTeam_TeamId`(`TeamId`) USING BTREE,
  INDEX `IX_UserTeam_UpdatedBy`(`UpdatedBy`) USING BTREE,
  INDEX `IX_UserTeam_UserId`(`UserId`) USING BTREE,
  CONSTRAINT `FK_UserTeam_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserTeam_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserTeams_TeamId` FOREIGN KEY (`TeamId`) REFERENCES `Team` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_UserTeams_UserId` FOREIGN KEY (`UserId`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of UserTeam
-- ----------------------------
INSERT INTO `UserTeam` VALUES (1, 2, 1, 1, 0, 1, NULL, 'onefin', '2023-07-04 16:27:38.525601', NULL);

-- ----------------------------
-- Table structure for Ward
-- ----------------------------
DROP TABLE IF EXISTS `Ward`;
CREATE TABLE `Ward`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `DistrictId` int NOT NULL,
  `IsActive` tinyint(1) NULL DEFAULT NULL,
  `IsDelete` tinyint(1) NULL DEFAULT NULL,
  `CreatedBy` int NULL DEFAULT NULL,
  `UpdatedBy` int NULL DEFAULT NULL,
  `TenantId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `CreatedDate` datetime(6) NULL DEFAULT NULL,
  `UpdatedDate` datetime(6) NULL DEFAULT NULL,
  `Name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Ward_CreatedBy`(`CreatedBy`) USING BTREE,
  INDEX `IX_Ward_DistrictId`(`DistrictId`) USING BTREE,
  INDEX `IX_Ward_UpdatedBy`(`UpdatedBy`) USING BTREE,
  CONSTRAINT `FK_Ward_User_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Ward_User_UpdatedBy` FOREIGN KEY (`UpdatedBy`) REFERENCES `User` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_Wards_DistrictId` FOREIGN KEY (`DistrictId`) REFERENCES `District` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of Ward
-- ----------------------------

-- ----------------------------
-- Table structure for __EFMigrationsHistory
-- ----------------------------
DROP TABLE IF EXISTS `__EFMigrationsHistory`;
CREATE TABLE `__EFMigrationsHistory`  (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MigrationId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of __EFMigrationsHistory
-- ----------------------------
INSERT INTO `__EFMigrationsHistory` VALUES ('20230607083333_init-db', '7.0.5');
INSERT INTO `__EFMigrationsHistory` VALUES ('20230607121534_add-request-filter', '7.0.5');

SET FOREIGN_KEY_CHECKS = 1;
