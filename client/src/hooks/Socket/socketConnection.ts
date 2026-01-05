// import { io, Socket } from "socket.io-client";

// export function socketConnectCheck({socketRef}: Socket | null) {

//   if (!socketRef.current) {
//       socketRef.current = io("http://localhost:5000", {
//         withCredentials: true,
//       });
//     }
//     return () => {
//       socketRef.current?.disconnect();
//     };
// }
