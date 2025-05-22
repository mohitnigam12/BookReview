Book Review Application --> A full-stack web application that allows users to register, log in, add books, write reviews, rate books, and search for books by title, author, or genre.

Features
--> User registration and login with JWT authentication
--> Add books with title, author, genre, and description
--> Search for books by title, author, or genre
--> View book details, average ratings, and reviews
--> Write reviews and rate books (1 to 5 stars)
--> Prevent duplicate reviews/ratings from the same user
--> Fully responsive frontend using Angular Material

Technologies Used :
--> Backend :
ASP.NET Core WebAPI
Entity Framework Core (Code First)
ASP.NET Core Identity
JWT Authentication
SQL Server 
--> Frontend :
Angular
Angular Material

Setup Instructions
--> Prerequisites : 
.NET SDK
SQL Server
Node.js and npm
Angular CLI

--> Backend Setup :
cd BookReviewApp.API
dotnet restore
dotnet ef database update
dotnet run

--> Frontend Setup :
cd BookReviewApp.Client
npm install
ng serve

--> Authentication :
JWT tokens are used for securing the API.
Only authenticated users can add books, reviews, or ratings.


Challenges Faced :
--> Database migration errors with foreign key constraints were resolved by seeding categories before applying relationships
--> Implementing secure JWT-based authentication and token handling in Angular
--> Preventing users from submitting multiple reviews or ratings
