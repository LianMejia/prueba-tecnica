import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromReadingList,
  selectSelectedBooks,
  selectCachedImages,
} from "../redux/readingListSlice";

const ReadingList = () => {
  const dispatch = useDispatch();
  // Obtenemos los libros seleccionados del estado Redux
  const selectedBooks = useSelector(selectSelectedBooks);
  // Obtenemos las imagenes almacenadas en cache del estado Redux
  const cachedImages = useSelector(selectCachedImages);
  const [stackTop, setStackTop] = useState(0);

  const handleRemoveBook = (bookTitle: string) => {
    dispatch(removeFromReadingList({ title: bookTitle }));
  };

  useEffect(() => {
    const topOffset = 20; // Espacio superior entre libros
    const initialTop = 20; // Posición superior inicial del primer libro seleciconado
    const stackHeight = selectedBooks.length * topOffset;
    setStackTop(initialTop + stackHeight);
  }, [selectedBooks]);

  // si no hay libros seleccionados no se muestra esta pantalla
  if (selectedBooks.length === 0) return null;

  // ordenamos la forma en la cual mostramos los libros para que siempre se muestre la portada del primero que hemos seleccionado
  // y detras se situen los demas libros
  const reversedList = [...selectedBooks].reverse();

  return (
    <div className="md:col-span-2 relative">
      <div className="fixed top-0 right-0 h-full w-full md:w-1/6 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Reading List</h2>
        {reversedList.map((bookTitle: string, index: number) => (
          <div key={index} className="absolute top-[${stackTop}px]">
            <div
              style={{ position: "relative", width: "200px", height: "auto" }}
              className="book-container"
            >
              <img
                src={cachedImages[bookTitle]}
                alt={bookTitle}
                className="w-full h-auto mb-2"
                style={{ marginTop: `${index * 25}%`, borderRadius: "10px" }}
              />{" "}
              {/* Mostrar la portada del libro usando la URL que hemos almacenado en el cache del navegador */}
              <button
                className="text-red-500 absolute top-0 right-0"
                style={{ zIndex: 1, width: "100%", height: "100%" }}
              ></button>{" "}
              {/* Boton para eliminar el libro de la lista y devolverlo a la lista inicial */}
              <button
                className="text-red-500 absolute top-0 right-0"
                onClick={() => handleRemoveBook(bookTitle)}
                style={{ zIndex: 1 }}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingList;
