import { useEffect, useState, type ChangeEvent } from "react";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { getSearchContacts } from "@/service/chatService";
import type { User } from "@/types/User";
import { useDebounce } from "@/hooks/Debouncer/useBouncer";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import type { Chat } from "@/types/Chat";

export const SearchInput = () => {
  const { user } = useAuth();
  const { handleActiveChat } = useChat();

  const [renderUser, setRenderUser] = useState<User[] | null>();

  const [searchContact, setSearchContact] = useState<string | null>("");

  const debouncedSearch = useDebounce({
    value: searchContact || "",
    delay: 500,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["contact"],
    queryFn: getSearchContacts,
  });

  useEffect(() => {
    setRenderUser(data);
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

  const searchResult = renderUser?.filter((contact) => {
    if (contact.userId === user?.userId) return false;

    const searchTerm = debouncedSearch.toLowerCase() || "";
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    return fullName.includes(searchTerm);
  });

  return (
    <div>
      <Input
        placeholder="search for a new Contact"
        onChange={(e) => userSearchInput(e)}
      />
      {debouncedSearch && (
        <div className="border rounded shadow">
          {searchResult?.map((contact) => (
            <div
              key={contact.userId}
              className="p-2 flex justify-end hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleActiveChat(contact as Chat | User);
              }}
            >
              <p>
                {contact.avatarUrl}
                {contact.firstName} {contact.lastName}
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
