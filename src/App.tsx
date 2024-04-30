import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AppContext from "./Context/context";
import Register from "./components/Register";
import FavoriteTasks from "./components/FavoriteTasks";
import PrivateRoutes from "./components/ProtectedRoute";
import { useState } from "react";
type favoriteTaskObj = {
  id: number;
  task: string;
  isComplete: string;
};
const App = () => {
  const [theme, setThemeFunc] = useState(false);
  const [favoriteTasksList, setFavoriteTasks] = useState<favoriteTaskObj[]>([]);

  const chnageTheme = () => {
    setThemeFunc(!theme);
  };
  //

  const chageFavoriteTaskList = (data: favoriteTaskObj[]) => {
    setFavoriteTasks((prevState) => [...favoriteTasksList, ...data]);
  };

  return (
    <AppContext.Provider
      value={{ theme, favoriteTasksList, chageFavoriteTaskList, chnageTheme }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/favorite" element={<FavoriteTasks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
};
export default App;
