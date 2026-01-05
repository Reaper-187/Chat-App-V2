import { useLogout } from "@/hooks/AuthHooks/useLogout";
import { Button } from "../ui/button";

export const LogoutButton = () => {
  const { mutate } = useLogout();
  const handleLogout = () => {
    mutate();
  };
  return (
    <>
      <Button className="bg-red-400 w-full" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};
