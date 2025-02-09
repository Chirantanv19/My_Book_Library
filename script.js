// script.js

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const searchSection = document.getElementById('search-section');
    const readingListSection = document.getElementById('reading-list-section');
    const searchLink = document.getElementById('search-link');
    const readingListLink = document.getElementById('reading-list-link');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const results = document.getElementById('results');
    const readingList = document.getElementById('reading-list');

    const recommendationsSection = document.getElementById('recommendations');
    const recommendedBooksContainer = document.getElementById('recommended-books');

    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');

    // Fetch recommended books on page load
    fetchRecommendedBooks();

    // Event listeners for navigation
    searchLink.addEventListener('click', () => {
        searchSection.style.display = 'block';
        readingListSection.style.display = 'none';

        // Reset to before-search state
        searchSection.classList.remove('after-search');
        searchSection.classList.add('before-search');

        // Hide search results
        results.innerHTML = '';
        results.style.display = 'none';

        // Show recommendations
        recommendationsSection.style.display = 'block';
        if (recommendedBooksContainer.innerHTML === '') {
            fetchRecommendedBooks();
        }
    });

    readingListLink.addEventListener('click', () => {
        searchSection.style.display = 'none';
        readingListSection.style.display = 'block';
        displayReadingList();
    });

    // Search button event listener
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            // Change layout to after-search
            searchSection.classList.remove('before-search');
            searchSection.classList.add('after-search');
            // Hide recommendations
            recommendationsSection.style.display = 'none';
            // Show results section
            results.style.display = 'flex';
            searchBooks(query);
        }
    });

    // Function to fetch and display recommended books
    function fetchRecommendedBooks() {
        recommendedBooksContainer.innerHTML = '';

        // Fetch random books (e.g., from a popular category)
        const randomQueries = ['fiction', 'adventure', 'history', 'science', 'fantasy', 'mystery'];
        const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];

        fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(randomQuery)}&maxResults=8`)
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    data.items.forEach(book => {
                        displayBook(book, recommendedBooksContainer, true);
                    });
                } else {
                    recommendedBooksContainer.innerHTML = '<p>No recommendations available.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
                recommendedBooksContainer.innerHTML = '<p>Error fetching recommendations. Please try again later.</p>';
            });
    }

    // Function to search books using Google Books API
    function searchBooks(query) {
        results.innerHTML = '';
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`)
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    data.items.forEach(book => {
                        displayBook(book, results, true);
                    });
                } else {
                    results.innerHTML = '<p>No results found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                results.innerHTML = '<p>Error fetching data. Please try again later.</p>';
            });
    }

    // Function to display a book card
    function displayBook(book, container, includeAddButton) {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';

        const title = book.volumeInfo.title || 'No Title Available';
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';

        // Book thumbnail
        const img = document.createElement('img');
        img.src = thumbnail;
        img.alt = title;

        // Book title
        const bookTitle = document.createElement('h3');
        bookTitle.textContent = title;

        // Book author
        const bookAuthor = document.createElement('p');
        bookAuthor.textContent = authors;

        // View Details button
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'View Details';
        detailsButton.addEventListener('click', () => {
            openModal(book);
        });

        bookCard.appendChild(img);
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(detailsButton);

        // Include Add or Remove button based on context
        if (includeAddButton) {
            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Reading List';
            addButton.addEventListener('click', () => {
                addToReadingList(book);
            });
            bookCard.appendChild(addButton);
        } else {
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove from List';
            removeButton.addEventListener('click', () => {
                removeFromReadingList(book.id);
            });
            bookCard.appendChild(removeButton);
        }

        container.appendChild(bookCard);
    }

    // Function to open the modal with book details
    function openModal(book) {
        modal.style.display = 'block';
        modalBody.innerHTML = '';

        const title = book.volumeInfo.title || 'No Title Available';
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const description = book.volumeInfo.description || 'No Description Available';

        // Book title
        const bookTitle = document.createElement('h2');
        bookTitle.textContent = title;

        // Book thumbnail
        const img = document.createElement('img');
        img.src = thumbnail;
        img.alt = title;

        // Book author
        const bookAuthor = document.createElement('h3');
        bookAuthor.textContent = `Authors: ${authors}`;

        // Book description
        const bookDescription = document.createElement('p');
        bookDescription.innerHTML = description;

        modalBody.appendChild(bookTitle);
        modalBody.appendChild(img);
        modalBody.appendChild(bookAuthor);
        modalBody.appendChild(bookDescription);
    }

    // Close modal when the close span is clicked
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', event => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Function to add a book to the reading list in localStorage
    function addToReadingList(book) {
        let readingList = JSON.parse(localStorage.getItem('readingList')) || [];
        if (!readingList.find(b => b.id === book.id)) {
            readingList.push(book);
            localStorage.setItem('readingList', JSON.stringify(readingList));
            alert(`${book.volumeInfo.title} has been added to your reading list.`);
        } else {
            alert('This book is already in your reading list.');
        }
    }

    // Function to remove a book from the reading list
    function removeFromReadingList(bookId) {
        let readingListData = JSON.parse(localStorage.getItem('readingList')) || [];
        readingListData = readingListData.filter(book => book.id !== bookId);
        localStorage.setItem('readingList', JSON.stringify(readingListData));
        displayReadingList();
    }

    // Function to display the reading list from localStorage
    function displayReadingList() {
        readingList.innerHTML = '';
        let storedBooks = JSON.parse(localStorage.getItem('readingList')) || [];
        if (storedBooks.length > 0) {
            storedBooks.forEach(book => {
                displayBook(book, readingList, false);
            });
        } else {
            readingList.innerHTML = '<p>Your reading list is empty.</p>';
        }
    }
});