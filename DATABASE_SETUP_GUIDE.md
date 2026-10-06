# D-TEL Mobile Shop - Database & Login Setup

## 1. Start the server
Use XAMPP/WAMP (or another PHP + MySQL server):
- Start **Apache**
- Start **MySQL**
- Put the whole `D-TEL-Mobile-Shop-PayHere` folder inside the server web root (for XAMPP: `htdocs`).

**Do not open `index.html` directly with `file://`.** PHP and MySQL only work when the project is served through Apache.

## 2. Create the database
Open phpMyAdmin and import:

`database.sql`

The script creates the database:

`dtel_mobile_shop`

and all required tables/data.

## 3. Default database login accounts
Customer:
- Email: `kasun@gmail.com`
- Password: `user123`

Admin:
- Email: `dtel@gmail.com`
- Password: `Dtel@123`

## 4. Open the website
If the folder is directly inside XAMPP `htdocs`, open:

`http://localhost/D-TEL-Mobile-Shop-PayHere-FIXED-v2/D-TEL-Mobile-Shop-PayHere/`

Then use **Sign In**.

## 5. Database credentials
The default configuration uses:
- Host: `127.0.0.1`
- Database: `dtel_mobile_shop`
- User: `root`
- Password: `1234` (configured in `api/config.local.php`)

If your MySQL root account has a different password, edit `api/config.local.php`.

## 6. Test the connection
With Apache/MySQL running, open:

`http://localhost/D-TEL-Mobile-Shop-PayHere-FIXED-v2/D-TEL-Mobile-Shop-PayHere/api/health.php`

You should receive JSON with:

`"status":"success"`

If it reports a database error, check MySQL is running and the credentials in `api/config.local.php`.
