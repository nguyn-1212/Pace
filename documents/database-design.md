# 📦 Lazy Travel — Database Design Document
**Version:** 2.0  
**Database:** MySQL 8.x  
**ORM:** Entity Framework Core (.NET 10)  
**Framework:** URF.Core.EF.Trackable  
**Namespace:** `Lazy.Travel.Api`  
**Updated:** 2026-04-28

---

## 📋 Tổng quan

| Nhóm | Bảng | Mô tả |
|------|------|--------|
| Framework (có sẵn) | ~24 | User, Role, Team, Permission, Notify, Audit, EmailTemplate... |
| **Users mở rộng** | 4 | UserProfile, UserInterest, UserBadge, UserBankAccount |
| **Friends** | 1 | Friendship |
| **Trips** | 5 | Trip, TripMember, TripDay, TripActivity, TripDestination |
| **Places** | 4 | Place, PlaceTag, PlaceWeather, PlaceReview |
| **Check-in** | 2 | CheckIn, CheckInReaction |
| **Expenses** | 4 | Expense, ExpenseSplit, ExpenseSettlement, TripSettlement |
| **Media** | 5 | TripPhoto, PhotoAlbum, PhotoComment, PhotoReaction, PhotoTag |
| **Social** | 4 | Vote, VoteOption, VoteResponse, TripAnnouncement |
| **Chat** | 3 | TripChat, ChatMessage, ChatMessageAttachment |
| **Documents** | 2 | TripDoc, TripDocTag |
| **Timeline** | 1 | TimelineEntry |
| **Explore** | 3 | ExploreArticle, TripTemplate, TripTemplateActivity |
| **Notifications** | 1 | NotificationSetting |
| **Settings** | 2 | UserPrivacySetting, UserAppSetting |
| **Invite** | 1 | TripInviteLink |
| **Stats** | 2 | UserActivityStat, UserLocationHistory |
| **Tổng mới** | **48** | |

---

## 🔷 NHÓM 1: Users mở rộng

### `UserProfile`
```sql
Id INT PK, UserId INT UNIQUE FK→Users, Bio TEXT, TravelStyle VARCHAR(50),
HomeCity VARCHAR(100), TotalTrips INT DEFAULT 0, TotalKm INT DEFAULT 0,
IsPublic BIT DEFAULT 1, IsActive BIT, IsDelete BIT,
CreatedBy INT, UpdatedBy INT, CreatedDate DATETIME, UpdatedDate DATETIME
```
*TravelStyle: backpacker | luxury | adventure | family | budget*

### `UserInterest`
```sql
Id INT PK, UserId INT FK→Users, Interest VARCHAR(50) NOT NULL,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```
*Interest: beach | mountain | food | culture | adventure | city | nature | history*

### `UserBadge`
```sql
Id INT PK, UserId INT FK→Users, BadgeType VARCHAR(50) NOT NULL,
EarnedDate DATETIME, TripId INT NULL FK→Trip,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```
*BadgeType: first_trip | explorer_10 | photo_master | debt_free | group_leader | road_trip | international*

### `UserBankAccount`
```sql
Id INT PK, UserId INT FK→Users, BankName VARCHAR(100),
AccountNumber VARCHAR(50), AccountName VARCHAR(200),
IsDefault BIT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 2: Friends

### `Friendship`
```sql
Id INT PK, RequesterId INT FK→Users, AddresseeId INT FK→Users,
Status TINYINT DEFAULT 0,
-- 0=Pending, 1=Accepted, 2=Declined, 3=Blocked
UNIQUE (RequesterId, AddresseeId),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 3: Trips

### `Trip`
```sql
Id INT PK, Code VARCHAR(20) UNIQUE NOT NULL,
Name VARCHAR(200) NOT NULL, Description TEXT,
CoverEmoji VARCHAR(10) DEFAULT '✈️',
StartDate DATE NOT NULL, EndDate DATE NOT NULL,
Status TINYINT DEFAULT 0,
-- 0=Planning, 1=Active, 2=Completed, 3=Cancelled
OwnerId INT FK→Users, TotalBudget DECIMAL(15,2),
Currency VARCHAR(10) DEFAULT 'VND', IsPublic BIT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripMember`
```sql
Id INT PK, TripId INT FK→Trip, UserId INT FK→Users,
Role TINYINT DEFAULT 0, -- 0=Member, 1=Leader, 2=CoLeader
Status TINYINT DEFAULT 0, -- 0=Invited, 1=Joined, 2=Left, 3=Removed
JoinedDate DATETIME, InvitedBy INT FK→Users,
UNIQUE (TripId, UserId),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripDay`
```sql
Id INT PK, TripId INT FK→Trip, DayNumber INT NOT NULL,
Date DATE NOT NULL, Title VARCHAR(200), Note TEXT,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripActivity`
```sql
Id INT PK, TripId INT FK→Trip, TripDayId INT FK→TripDay,
Title VARCHAR(200) NOT NULL, Description TEXT,
StartTime TIME, EndTime TIME,
PlaceId INT NULL FK→Place, Address VARCHAR(500),
Latitude DECIMAL(10,8), Longitude DECIMAL(11,8),
Type TINYINT DEFAULT 0,
-- 0=Activity, 1=Food, 2=Transport, 3=Accommodation, 4=Free
Status TINYINT DEFAULT 0,
-- 0=Planned, 1=Active, 2=Done, 3=Skipped
OrderIndex INT DEFAULT 0, EstCost DECIMAL(15,2),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripDestination`
```sql
Id INT PK, TripId INT FK→Trip, PlaceId INT NULL FK→Place,
Name VARCHAR(200) NOT NULL, OrderIndex INT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 4: Places

### `Place`
```sql
Id INT PK, Name VARCHAR(200) NOT NULL, NameEn VARCHAR(200),
Slug VARCHAR(250) UNIQUE, Description TEXT,
Type TINYINT DEFAULT 0,
-- 0=City, 1=Attraction, 2=Restaurant, 3=Cafe, 4=Hotel, 5=Park, 6=Beach
Country VARCHAR(100), Province VARCHAR(100), City VARCHAR(100),
Address VARCHAR(500), Latitude DECIMAL(10,8), Longitude DECIMAL(11,8),
CoverEmoji VARCHAR(10), Rating DECIMAL(3,2) DEFAULT 0,
ReviewCount INT DEFAULT 0, CheckinCount INT DEFAULT 0,
IsVerified BIT DEFAULT 0, Website VARCHAR(300),
OpenTime VARCHAR(50), CloseTime VARCHAR(50),
PriceRange VARCHAR(100),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `PlaceTag`
```sql
Id INT PK, PlaceId INT FK→Place, Tag VARCHAR(100) NOT NULL,
TagType TINYINT DEFAULT 0, -- 0=Category, 1=Seasonal, 2=Trending
Priority INT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `PlaceWeather`
```sql
Id INT PK, PlaceId INT FK→Place, Date DATE NOT NULL,
TempHigh INT, TempLow INT,
Condition VARCHAR(50), -- sunny|cloudy|rain|storm
Humidity INT, WindSpeed INT,
SeasonLabel VARCHAR(100),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `PlaceReview`
```sql
Id INT PK, PlaceId INT FK→Place, UserId INT FK→Users,
TripId INT NULL FK→Trip, Rating TINYINT NOT NULL,
Comment TEXT,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 5: Check-in

### `CheckIn`
```sql
Id INT PK, TripId INT FK→Trip, UserId INT FK→Users,
PlaceId INT NULL FK→Place, PlaceName VARCHAR(200),
Note TEXT, Latitude DECIMAL(10,8), Longitude DECIMAL(11,8),
CheckInTime DATETIME DEFAULT NOW(),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `CheckInReaction`
```sql
Id INT PK, CheckInId INT FK→CheckIn, UserId INT FK→Users,
Type TINYINT DEFAULT 0, -- 0=MeToo, 1=Like
UNIQUE (CheckInId, UserId, Type),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 6: Expenses

### `Expense`
```sql
Id INT PK, TripId INT FK→Trip,
Title VARCHAR(200) NOT NULL, Description TEXT,
Amount DECIMAL(15,2) NOT NULL,
Currency VARCHAR(10) DEFAULT 'VND',
Category TINYINT DEFAULT 0,
-- 0=Food, 1=Transport, 2=Accommodation, 3=Activity, 4=Shopping, 5=Health, 6=Other
PaidBy INT FK→Users,
SplitType TINYINT DEFAULT 0, -- 0=Equal, 1=Custom, 2=Percent
ReceiptUrl VARCHAR(500), Date DATE NOT NULL,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `ExpenseSplit`
```sql
Id INT PK, ExpenseId INT FK→Expense, UserId INT FK→Users,
Amount DECIMAL(15,2) NOT NULL, Percent DECIMAL(5,2),
IsPaid BIT DEFAULT 0, PaidDate DATETIME,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripSettlement`
```sql
Id INT PK, TripId INT UNIQUE FK→Trip,
Status TINYINT DEFAULT 0, -- 0=Open, 1=Locked
LockedBy INT NULL FK→Users, LockedDate DATETIME,
TotalAmount DECIMAL(15,2),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `ExpenseSettlement`
```sql
Id INT PK, TripId INT FK→Trip,
FromUserId INT FK→Users, ToUserId INT FK→Users,
Amount DECIMAL(15,2) NOT NULL,
Status TINYINT DEFAULT 0, -- 0=Pending, 1=Paid, 2=Confirmed
PaidDate DATETIME, Note TEXT,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 7: Media

### `PhotoAlbum`
```sql
Id INT PK, TripId INT FK→Trip, Name VARCHAR(200) NOT NULL,
CoverUrl VARCHAR(500),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripPhoto`
```sql
Id INT PK, TripId INT FK→Trip, AlbumId INT NULL FK→PhotoAlbum,
UploadedBy INT FK→Users, FileUrl VARCHAR(500) NOT NULL,
ThumbUrl VARCHAR(500), Caption TEXT,
TakenAt DATETIME, CheckInId INT NULL FK→CheckIn,
Latitude DECIMAL(10,8), Longitude DECIMAL(11,8),
LikeCount INT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `PhotoComment`
```sql
Id INT PK, PhotoId INT FK→TripPhoto, UserId INT FK→Users,
Content TEXT NOT NULL, ParentId INT NULL FK→PhotoComment,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `PhotoReaction`
```sql
Id INT PK, PhotoId INT FK→TripPhoto, UserId INT FK→Users,
ReactionType TINYINT DEFAULT 0,
-- 0=Like, 1=Love, 2=Wow, 3=Haha
UNIQUE (PhotoId, UserId, ReactionType),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `PhotoTag`
```sql
Id INT PK, PhotoId INT FK→TripPhoto,
TaggedUserId INT FK→Users, TaggedBy INT FK→Users,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 8: Social

### `Vote`
```sql
Id INT PK, TripId INT FK→Trip,
Title VARCHAR(500) NOT NULL, Description TEXT,
Type TINYINT DEFAULT 0, -- 0=SingleChoice, 1=MultiChoice
Status TINYINT DEFAULT 0, -- 0=Open, 1=Closed
IsAnonymous BIT DEFAULT 0,
AllowSuggest BIT DEFAULT 0,
DeadLine DATETIME,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `VoteOption`
```sql
Id INT PK, VoteId INT FK→Vote,
Label VARCHAR(200) NOT NULL, Emoji VARCHAR(10),
SuggestedBy INT NULL FK→Users,
OrderIndex INT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `VoteResponse`
```sql
Id INT PK, VoteId INT FK→Vote,
OptionId INT FK→VoteOption, UserId INT FK→Users,
UNIQUE (VoteId, OptionId, UserId),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripAnnouncement`
```sql
Id INT PK, TripId INT FK→Trip,
Title VARCHAR(300) NOT NULL, Content TEXT,
Priority TINYINT DEFAULT 0, -- 0=Normal, 1=Important, 2=Urgent
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 9: Chat

### `TripChat`
```sql
Id INT PK, TripId INT UNIQUE FK→Trip, GroupId INT FK→Group(framework),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `ChatMessage`
```sql
Id INT PK, TripId INT FK→Trip, SenderId INT FK→Users,
Content TEXT,
Type TINYINT DEFAULT 0,
-- 0=Text, 1=Image, 2=Video, 3=Voice, 4=File, 5=System
-- 6=TripCard, 7=ExpenseCard, 8=VoteCard
ReplyToId INT NULL FK→ChatMessage,
CardType TINYINT NULL, CardRefId INT NULL,
IsEdited BIT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `ChatMessageAttachment`
```sql
Id INT PK, MessageId INT FK→ChatMessage,
FileUrl VARCHAR(500) NOT NULL,
FileType TINYINT DEFAULT 0,
-- 0=Image, 1=Video, 2=Voice, 3=File
FileName VARCHAR(300), FileSize BIGINT,
Duration INT NULL, ThumbUrl VARCHAR(500),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 10: Documents

### `TripDoc`
```sql
Id INT PK, TripId INT FK→Trip,
Title VARCHAR(300) NOT NULL,
Type TINYINT DEFAULT 0,
-- 0=General, 1=Ticket, 2=Hotel, 3=Visa, 4=Insurance, 5=Other
Content TEXT, FileUrl VARCHAR(500),
ForUserId INT NULL FK→Users,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripDocTag`
```sql
Id INT PK, DocId INT FK→TripDoc, Tag VARCHAR(100) NOT NULL,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 11: Timeline

### `TimelineEntry`
```sql
Id INT PK, TripId INT FK→Trip,
EntryType TINYINT NOT NULL,
-- 0=CheckIn, 1=Photo, 2=Expense, 3=Vote, 4=Announcement, 5=MemberJoin
RefId INT NOT NULL, -- Id của record gốc
UserId INT FK→Users,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 12: Explore & Templates

### `ExploreArticle`
```sql
Id INT PK, Title VARCHAR(300) NOT NULL, Slug VARCHAR(350) UNIQUE,
Summary TEXT, Content LONGTEXT,
CoverEmoji VARCHAR(10),
Category VARCHAR(50),
PlaceId INT NULL FK→Place,
Author VARCHAR(100), ViewCount INT DEFAULT 0,
IsPublished BIT DEFAULT 0, PublishedDate DATETIME,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripTemplate`
```sql
Id INT PK, Name VARCHAR(200) NOT NULL,
Description TEXT, Destination VARCHAR(200),
Duration INT NOT NULL, -- số ngày
EstCostPerPerson DECIMAL(15,2),
Currency VARCHAR(10) DEFAULT 'VND',
Tags VARCHAR(500), CoverEmoji VARCHAR(10),
UsedCount INT DEFAULT 0, IsOfficial BIT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `TripTemplateActivity`
```sql
Id INT PK, TemplateId INT FK→TripTemplate,
DayNumber INT NOT NULL, StartTime TIME,
Title VARCHAR(200) NOT NULL,
PlaceId INT NULL FK→Place,
Type TINYINT DEFAULT 0, OrderIndex INT DEFAULT 0,
EstCost DECIMAL(15,2),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 13: Notifications & Settings

### `NotificationSetting`
```sql
Id INT PK, UserId INT FK→Users,
NotifyType INT NOT NULL,
-- 0=System, 1=TripInvite, 2=TripJoined ... 15=NewMessage
IsEnabled BIT DEFAULT 1,
Channel TINYINT DEFAULT 0, -- 0=Push, 1=Email, 2=Both
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
UNIQUE (UserId, NotifyType)
```

### `UserPrivacySetting`
```sql
Id INT PK, UserId INT UNIQUE FK→Users,
ShareLocation TINYINT DEFAULT 1,
-- 0=Never, 1=TripOnly, 2=Always
ShowOnlineStatus BIT DEFAULT 1,
WhoCanFind TINYINT DEFAULT 1,
-- 0=Everyone, 1=FriendsOfFriends, 2=FriendsOnly
ShowTripHistory TINYINT DEFAULT 1,
-- 0=Everyone, 1=FriendsOnly, 2=OnlyMe
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `UserAppSetting`
```sql
Id INT PK, UserId INT UNIQUE FK→Users,
Theme TINYINT DEFAULT 0, -- 0=Light, 1=Dark, 2=Auto
Language VARCHAR(10) DEFAULT 'vi',
Currency VARCHAR(10) DEFAULT 'VND',
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🔷 NHÓM 14: Invite & Stats

### `TripInviteLink`
```sql
Id INT PK, TripId INT FK→Trip,
Code VARCHAR(20) UNIQUE NOT NULL,
ExpiresAt DATETIME, MaxUses INT DEFAULT 0,
UsedCount INT DEFAULT 0, IsRevoked BIT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `UserActivityStat`
```sql
Id INT PK, UserId INT UNIQUE FK→Users,
TotalTrips INT DEFAULT 0, TotalFriends INT DEFAULT 0,
TotalCheckins INT DEFAULT 0, TotalPhotos INT DEFAULT 0,
TotalKm INT DEFAULT 0, TotalCountries INT DEFAULT 0,
TotalProvinces INT DEFAULT 0,
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

### `UserLocationHistory`
```sql
Id INT PK, TripId INT FK→Trip, UserId INT FK→Users,
Latitude DECIMAL(10,8) NOT NULL, Longitude DECIMAL(11,8) NOT NULL,
PlaceName VARCHAR(200), RecordedAt DATETIME DEFAULT NOW(),
IsActive BIT, IsDelete BIT, CreatedBy INT, UpdatedBy INT,
CreatedDate DATETIME, UpdatedDate DATETIME
```

---

## 🗝️ Indexes

```sql
-- Trip
INDEX idx_trip_status (Status), INDEX idx_trip_owner (OwnerId), INDEX idx_trip_dates (StartDate, EndDate)
-- TripMember
INDEX idx_tripmember_user (UserId), INDEX idx_tripmember_trip (TripId)
-- Expense
INDEX idx_expense_trip (TripId), INDEX idx_expense_paidby (PaidBy), INDEX idx_expense_date (Date)
-- CheckIn
INDEX idx_checkin_trip (TripId), INDEX idx_checkin_user (UserId), INDEX idx_checkin_time (CheckInTime)
-- TripPhoto
INDEX idx_photo_trip (TripId), INDEX idx_photo_uploader (UploadedBy), INDEX idx_photo_album (AlbumId)
-- ChatMessage
INDEX idx_chat_trip (TripId), INDEX idx_chat_sender (SenderId), INDEX idx_chat_created (CreatedDate)
-- Place
INDEX idx_place_type (Type), INDEX idx_place_location (Country, Province, City)
FULLTEXT INDEX idx_place_search (Name, NameEn, Address)
-- TimelineEntry
INDEX idx_timeline_trip (TripId), INDEX idx_timeline_type (EntryType), INDEX idx_timeline_created (CreatedDate)
-- Friendship
INDEX idx_friend_requester (RequesterId), INDEX idx_friend_addressee (AddresseeId), INDEX idx_friend_status (Status)
-- Vote
INDEX idx_vote_trip (TripId), INDEX idx_vote_status (Status)
```

---

## 📊 Tổng số bảng

| Nguồn | Số bảng |
|-------|---------|
| Framework URF (có sẵn) | ~24 |
| Lazy Travel mới | **48** |
| **Tổng** | **~72** |

---

*Tài liệu v2.0 — cập nhật dựa trên phân tích đầy đủ 53 màn hình UI trong `designs/`*
