import React, { useState, useEffect } from 'react';

const BookForm = ({ bookToEdit, onAddBook, onUpdateBook }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [category, setCategory] = useState('Grožinė literatūra');

    useEffect(() => {
        if (bookToEdit) {
            setTitle(bookToEdit.title);
            setAuthor(bookToEdit.author);
            setYear(bookToEdit.year);
            setCategory(bookToEdit.category || 'Grožinė literatūra');
        }
    }, [bookToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const book = { title, author, year: Number(year), category };

        try {
            if (bookToEdit) {
                await onUpdateBook(bookToEdit._id, book);
            } else {
                await onAddBook(book);
            }
            setTitle('');
            setAuthor('');
            setYear('');
            setCategory('Grožinė literatūra');
        } catch (err) {
            console.error('Klaida pridedant knygą:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Pavadinimas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Autorius"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Metai"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="Grožinė literatūra">Grožinė literatūra</option>
                <option value="Asmenybės tobulėjimas">Asmenybės tobulėjimas</option>
                <option value="Mokslinė literatūra">Mokslinė literatūra</option>
                <option value="Istorija">Istorija</option>
            </select>
            <button type="submit">{bookToEdit ? 'Atnaujinti knygą' : 'Pridėti knygą'}</button>
        </form>
    );
};

export default BookForm;