import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AdminProvider } from './admin/context/AdminContext';

export default function App() {
  return (
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  );
}