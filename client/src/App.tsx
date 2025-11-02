import { RouterProvider } from "react-router";
import { router } from "./router/router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-left" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
