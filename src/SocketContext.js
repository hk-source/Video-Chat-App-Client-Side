import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("https://web-rtc-app-tau.vercel.app/");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [Me, setMe] = useState("");
  const [call, setCall] = useState({}); // this is a useState where setCall is the function and call is the object initilized to an empty object
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  useEffect(() => {
    // used to get camera and audio permissions from 'me'
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        //console.log(currentStream);
        console.log(myVideo);
        console.log(myVideo.current);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
          console.log(myVideo.current.srcObject);
        } // populate our video iframe once we include it in our code it has reference to a video tag so that we can create a reference to a video element. Basically to get hold and manipulate the DOM element directly rather than using queryselectors
      });
    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      // we are destructuring the object we recieved from the 'calluser' event from the server and setting it using useState
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  useEffect(() => {
    // this useEffect is not in the youtube video rather it is from chatGPT
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]); /*
  The reason why myVideo.current is getting undefined is because it is being accessed before the useEffect hook finishes executing.

In your code, you are trying to set srcObject on myVideo.current inside the useEffect hook, but at the same time, you are trying to access myVideo.current outside the hook. Since myVideo is a useRef, it will be initialized as undefined until the component is mounted, which means that it will be undefined when you try to access it outside the useEffect hook.

To solve this issue, you can check if myVideo.current exists before trying to set srcObject on it. You can also move the code that tries to access myVideo.current inside another useEffect hook that has stream as a dependency, so that it is executed only when stream changes. Here's how you can modify your code:

The main reason is this that the myVideo.current is initilazied until the hook is executed fully and we are try to access its srcObject when the hook has not finished executing thats why myVideo.current is undefined so no srcObject can be used of it. We should  first let that useEffect hook run and then we should access the myVideo.current.srcObject of that

Also one of the most important point we have to first run our backend server only then our video will be loaded as it is using WebRTC
  */

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", function (data) {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      // this is the user end side not our side of the stream
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: Me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current = null;
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        Me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
