import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Copy, Check } from "lucide-react";

import { useState } from "react";
// import { ChangePw } from "./Auth-Pages/ChangePw";

export const Settings = () => {
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState(false);

  const copyIdToClipboard = async () => {
    if (!user?.userId) return;
    await navigator.clipboard.writeText(user.userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="login&security">Login & security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 w-full xl:w-1/2 ">
          <Card>
            <CardHeader>
              <CardTitle>User-Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="border-b-5 border-b-forderground"></p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Label>User-ID :</Label>
                  <p className="text-sm md:text-md text-blue-400">
                    {user?.userId}
                  </p>
                </div>
                <button
                  onClick={copyIdToClipboard}
                  className={`p-1 rounded-lg transition-all duration-300 cursor-pointer ${
                    copiedId
                      ? "bg-green-100 text-green-600 scale-110"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:scale-105"
                  }`}
                >
                  {copiedId ? (
                    <Check size={15} className="animate-pulse" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              </div>

              <div className="flex gap-3">
                <Label>User-Role :</Label>
                <p className="text-sm md:text-md text-blue-400">
                  {user?.userRole}
                </p>
              </div>
              <p className="border-b-5 border-b-forderground"></p>

              <div className="flex gap-3">
                <Label>Name :</Label>
                <p className="text-sm md:text-md text-blue-400">
                  {user?.firstName}
                </p>
                <p className="text-sm md:text-md text-blue-400">
                  {user?.lastName}
                </p>
              </div>
              <p className="border-b-5 border-b-forderground"></p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login&security" className="mt-4">
          {user?.userRole === "guest" ? (
            <Card className="w-fit p-2 flex justify-self-center text-lg">
              <p>Not Allowed for your Account</p>
            </Card>
          ) : (
            // <ChangePw />
            <></>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
