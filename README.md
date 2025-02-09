# My Book Library  

## Introduction  
My Book Library is a web application that enables users to search for books using the Google Books API, view detailed information, and manage a personal reading list stored in the browser's Local Storage. The app features a colorful and responsive design with interactive elements for an engaging user experience.  

## Features  
- **Centralized Search Bar:** On initial load, the search bar is prominently displayed in the center of the page.  
- **Random Book Recommendations:** Before any search is conducted, the app displays recommended books below the search bar.  
- **Dynamic Search Experience:** After performing a search, the search bar moves to the top of the page, and search results are displayed below.  
- **Book Details Modal:** Users can view detailed information about a book in a modal window.  
- **Personal Reading List:** Ability to add books to a personal reading list, which is saved using the browser's local storage.  
- **Responsive Design:** The app adapts to different screen sizes for optimal viewing on desktops, tablets, and mobile devices.  

## Technologies Used  
- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Google Books API  
- Local Storage API  

## Setup Instructions  

### Download or Clone the Project Files  
- Obtain the `index.html`, `styles.css`, and `script.js` files.  

### Set Up a Local Server  

**Option 1: Use VS Code Live Server Extension**  
1. Install the Live Server extension in Visual Studio Code.  
2. Open the project folder in VS Code.  
3. Right-click on `index.html` and select "Open with Live Server".  

**Option 2: Use Python Simple HTTP Server**  
1. Open a terminal in the project directory.  
2. Run the following command:  

   ```bash  
   python -m http.server 8000
