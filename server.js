const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");


dotenv.config();

const app = express();
const port = process.env.PORT || 3001; 

// Middleware skirtas JSON duomenų parsiruošimui
app.use(cors());
app.use(express.json());

// Prisijungimas prie MongoDB naudojant aplinkos kintamąjį arba nurodytą URL
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Prisijungta prie MongoDB');
    seedDatabase();  
}).catch(err => {
    console.error('Nepavyko prisijungti prie MongoDB:', err.message);
});

// Knygos schema ir modelis
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true }
});

const Book = mongoose.model('Book', bookSchema);

// Funkcija, kuri užpildo duomenų bazę pradiniais duomenimis
async function seedDatabase() {
    const books = [
        { title: 'Karas ir taika', author: 'Levas Tolstojus', year: 1869, category: 'Klasika' },
        { title: 'Demonas', author: 'Michailas Lermontovas', year: 1842, category: 'Poezija' },
        { title: 'Vienuolis, kuris pardavė savo "Ferrarį"', author: 'Robin Sharma', year: 1997, category: 'Asmenybės tobulėjimas' },
        { title: 'Atomic Habits', author: 'James Clear', year: 2018, category: 'Asmenybės tobulėjimas' },
        { title: 'Vargsas tėtis ir turtingas tėtis', author: 'Robert Kiyosaki', year: 1997, category: 'Verslas' },
        { title: 'Pushkin', author: 'Aleksandras Puškinas', year: 1837, category: 'Poezija' },
        { title: 'Pep Guardiola: Apie Manchester City', author: 'Lu Martinas ir Pol Ballus', year: 2019, category: 'Biografija' }
    ];

    try {
        // Išvalome esamus įrašus ir įdedame naujus
        await Book.deleteMany({});
        console.log('Esami įrašai ištrinti.');
        await Book.insertMany(books);
        console.log('Duomenų bazė užpildyta pradiniais duomenimis.');
    } catch (err) {
        console.error('Klaida užpildant duomenų bazę:', err.message);
    }
}

// GET visos knygos
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error('Klaida gaunant knygas:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// GET konkreti knyga pagal ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Knyga nerasta' });
        }
    } catch (err) {
        console.error('Klaida gaunant knygą pagal ID:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// POST nauja knyga
app.post('/books', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        category: req.body.category
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        console.error('Klaida įdedant naują knygą:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// PUT knygos atnaujinimas pagal ID
app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            book.title = req.body.title;
            book.author = req.body.author;
            book.year = req.body.year;
            book.category = req.body.category;
            const updatedBook = await book.save();
            res.json(updatedBook);
        } else {
            res.status(404).json({ message: 'Knyga nerasta' });
        }
    } catch (err) {
        console.error('Klaida atnaujinant knygą:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// DELETE knygos ištrynimas pagal ID
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Knyga nerasta' });
        }
    } catch (err) {
        console.error('Klaida trinant knygą:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Paleidžiame serverį
app.listen(port, () => {
    console.log(`Serveris veikia adresu http://localhost:${port}`);
});