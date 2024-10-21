import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type User = {
  id: string;
  role: string;
  username: string;
};
//Type the user object

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};
//Type the context

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //Creae he global state variables
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
