import { useEffect, useState, type ChangeEvent } from "react";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { getAllContacts } from "@/service/chatService";
import type { User } from "@/types/User";
import { useDebounce } from "@/hooks/Debouncer/useBouncer";
import { useChat } from "@/context/ChatContext";

export const SearchInput = () => {
  const [renderUser, setRenderUser] = useState<User[] | null>();

  const [searchContact, setSearchContact] = useState<string | null>("");

  const debouncedSearch = useDebounce({
    value: searchContact || "",
    delay: 500,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["contact"],
    queryFn: getAllContacts,
  });

  useEffect(() => {
    setRenderUser(data);
    console.log(data);
  }, [data]);

  if (isLoading) {
    <p>loading User</p>;
  }
  if (error) {
    <p>no User found</p>;
  }

  const userSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchContact(e.currentTarget.value);
  };

  const searchResult = renderUser?.filter((user) => {
    const searchTerm = debouncedSearch.toLowerCase() || "";
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm);
  });

  const { handleActiveChat } = useChat();

  return (
    <div>
      <Input
        placeholder="search for a new Contact"
        onChange={(e) => userSearchInput(e)}
      />
      {debouncedSearch && (
        <div className="border rounded shadow">
          {searchResult?.map((user) => (
            <div
              key={user.userId}
              className="p-2 flex justify-end hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleActiveChat(user);
              }}
            >
              <p>
                {user.avatarUrl}
                {user.firstName} {user.lastName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// suchfunktion fertig machen und beim click auf contact setActiveChat über props triggern
// send messsage anpassen
