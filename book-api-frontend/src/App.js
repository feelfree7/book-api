import React, { useState, useEffect } from 'react';
import './App.css';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import CategoryFilter from './components/CategoryFilter'; 

const App = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [bookToEdit, setBookToEdit] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All'); 

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(books.filter(book => book.category === selectedCategory));
        }
    }, [books, selectedCategory]);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:3001/books');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Klaida gaunant knygas:', error);
        }
    };

    const handleAddBook = async (book) => {
        try {
            const response = await fetch('http://localhost:3001/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            });
            const newBook = await response.json();
            setBooks([...books, newBook]);
        } catch (error) {
            console.error('Klaida pridedant knygą:', error);
        }
    };

    const handleUpdateBook = async (id, updatedBook) => {
        try {
            const response = await fetch(`http://localhost:3001/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBook)
            });
            const book = await response.json();
            setBooks(books.map(b => b._id === id ? book : b));
            setBookToEdit(null);
        } catch (error) {
            console.error('Klaida atnaujinant knygą:', error);
        }
    };

    const handleDeleteBook = async (id) => {
        try {
            await fetch(`http://localhost:3001/books/${id}`, {
                method: 'DELETE'
            });
            setBooks(books.filter(book => book._id !== id));
        } catch (error) {
            console.error('Klaida trinant knygą:', error);
        }
    };

    return (
        <div className="container">
            <header>
                <h1>Knygų mugė</h1>
            </header>
            <BookForm bookToEdit={bookToEdit} onAddBook={handleAddBook} onUpdateBook={handleUpdateBook} />
            <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            <BookList books={filteredBooks} onEditBook={setBookToEdit} onDeleteBook={handleDeleteBook} />
        </div>
    );
};

export default App;