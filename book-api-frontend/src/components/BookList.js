import React from 'react';

const BookList = ({ books, onEditBook, onDeleteBook }) => {
    return (
        <ul>
            {books.map((book) => (
                <li key={book._id}>
                    {book.title} {}
                    <div>
                        <button onClick={() => onEditBook(book)}>Redaguoti</button>
                        <button onClick={() => onDeleteBook(book._id)}>Ištrinti</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default BookList;