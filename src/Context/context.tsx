import { createContext } from "react";

type favoriteTaskObj = {
  id: number;
  task: string;
  isComplete: string;
};

type contextType = {
  theme: boolean;
  favoriteTasksList: favoriteTaskObj[];
  chageFavoriteTaskList: (obj: favoriteTaskObj[]) => void;
  chnageTheme: () => void;
};

const AppContext = createContext<contextType>({
  theme: false,
  favoriteTasksList: [],
  chageFavoriteTaskList: () => {},
  chnageTheme: () => {},
});

export default AppContext;
