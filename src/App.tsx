import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './redux/store';
import BookList from './components/BookList';
import ReadingList from './components/ReadingList';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-semibold mb-4">Lista de Libros</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BookList />
            <ReadingList />
          </div>
        </div>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;