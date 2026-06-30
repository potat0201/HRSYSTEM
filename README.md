# Attendance Management System

## 1. Giới thiệu

Attendance Management System là hệ thống backend dùng để quản lý nhân viên, điểm danh hằng ngày và yêu cầu xin đi muộn.

## 2. Công nghệ

- Java 17
- Spring Boot 3
- Maven
- Spring Web
- Spring Data JPA
- MySQL
- Lombok
- Validation

## 3. Cấu trúc thư mục

```text
common    -> chứa phần dùng chung
config    -> chứa cấu hình hệ thống
modules   -> chứa các module nghiệp vụ
scheduler -> chứa các job chạy định kỳ
```

## 4. Cách tạo database

```sql
CREATE DATABASE hr_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 5. Cách chạy project

```bash
mvn spring-boot:run
```

## 6. Cách build project

```bash
mvn clean package
```

## 7. Roadmap code sau này

```text
Bước 1: Tạo enum, entity và repository
Bước 2: Code Employee CRUD
Bước 3: Code Authentication
Bước 4: Code Check-in / Check-out
Bước 5: Code Late Request
Bước 6: Code Scheduler cuối ngày
Bước 7: Thêm RabbitMQ + MongoDB log
Bước 8: Thêm Redis cache
Bước 9: Thêm report shell script
Bước 10: Thêm Nginx load balancer
```
