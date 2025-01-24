# Table Management System

This is a simple table management system built with **Node.js** and **Express** for handling data and file uploads. The application allows users to view, add, update, and delete rows in a table, including file uploads and downloads. The table data is dynamically displayed using **JavaScript** and styled using **CSS** to make it responsive for both desktop and mobile devices.

## Features

- **Add a new row**: Add new rows with fields for name, version, description, and file.
- **Edit a row**: Edit existing rows and replace the file if necessary.
- **Delete a row**: Delete a row from the table.
- **Download file**: Download the file associated with a row.
- **Mobile-responsive design**: The table and modal form adjust automatically for better user experience on mobile devices.

## Tech Stack

- **Backend**: Node.js, Express, and Multer for file uploads
- **Frontend**: HTML, CSS, JavaScript
- **File Storage**: Local file system (stored in the `public/uploads` folder)
- **JSON Storage**: Data is stored in a `data.json` file
