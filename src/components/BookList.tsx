import React, { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  addToReadingList,
  selectSelectedBooks,
} from "../redux/readingListSlice";

const BookList = () => {
  const dispatch = useDispatch();
  // Obtenemos la lista de libros seleccionados
  const selectedBooks = useSelector(selectSelectedBooks);

  // Estados para almacenar los filtros
  const [filters, setFilters] = useState({
    genre: "",
    name: "",
    pages: "",
    year: "",
  });

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery("books", async () => {
    const response = await fetch(
      "https://jelou-prueba-tecnica1-frontend.rsbmk.workers.dev"
    );
    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    const data = await response.json();
    return data.default.library.map((item: { book: any }) => item.book);
  });

  const handleBookClick = (book: any) => {
    dispatch(addToReadingList(book));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  // Función para validar que solo se ingresen números en el filtro de páginas y no letras ni caracteres especiales
  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === "") {
      setFilters({ ...filters, pages: value });
    }
  };

  // Función para validar que solo se ingresen números en el filtro de año y no letras ni caracteres especiales
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === "") {
      setFilters({ ...filters, year: value });
    }
  };

  // Función para manejar el cambio en el filtro de nombre y no caracteres especiales
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(value) || value === "") {
      setFilters({ ...filters, name: value });
    }
  };

  // Función para filtrar libros mediante el filtro establecido
  const filteredBooks = books.filter((book: any) => {
    // Filtro género
    if (filters.genre !== "" && book.genre !== filters.genre) return false;
    // Filtrar por nombre (independientemente de mayúsculas o minúsculas)
    if (
      filters.name !== "" &&
      !book.title.toLowerCase().includes(filters.name.toLowerCase())
    )
      return false;
    // Filtro numero de paginas
    if (filters.pages !== "") {
      if (!book.pages.toString().includes(filters.pages)) return false;
    }
    // Filtro año
    if (filters.year !== "") {
      if (!book.year.toString().includes(filters.year)) return false;
    }
    return true;
  });

  // Usamos esta variable para poder almacenar los libros que hemos filtrado
  let filteredBooksElements = filteredBooks.map((book: any, index: number) => {
    // SI el libro no esta agregado en la lista de 'Reading List' entonces renderizamos la imagen del libro
    if (selectedBooks.includes(book.title)) return null;
    return (
      <div key={index} className="mb-4">
        <img
          onClick={() => handleBookClick(book)}
          src={book.cover}
          alt={book.title}
          className="book-cover w-full h-auto cursor-pointer"
        />
      </div>
    );
  });

  return (
    <div className="md:col-span-2">
      {/* Select para filtrar por genero */}
      <select
        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={filters.genre}
        onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
      >
        <option value="">Todos los géneros</option>
        <option value="Fantasía">Fantasía</option>
        <option value="Ciencia ficción">Ciencia ficción</option>
        <option value="Terror">Terror</option>
        <option value="Zombies">Zombies</option>
      </select>
      <div className="mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Buscador por nombre */}
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={filters.name}
          onChange={handleNameChange}
        />

        {/* Buscador por paginas */}
        <input
          type="text"
          placeholder="Páginas"
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={filters.pages}
          onChange={handlePagesChange}
          maxLength={5} // Limitamos a 5 caracteres
        />

        {/* Buscador por año */}
        <input
          type="text"
          placeholder="Año"
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={filters.year}
          onChange={handleYearChange}
          maxLength={4} // Limitamos a 4 caracteres
        />
      </div>

      {/* Lista de libros filtrados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {filteredBooksElements}
      </div>
    </div>
  );
};

export default BookList;
