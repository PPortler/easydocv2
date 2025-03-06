"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../component/myfile/Navbar";
import Navbar2 from "../component/myfile/Navbar2";
import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";

// firebase
import { db } from "../firebaseConfig.js";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function ChatPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  // Early return หาก session ยังไม่พร้อม
  if (status === "loading") return <div>Loading...</div>;
  if (!session || !session.user?.email) {
    router.replace("/login");
    return null;
  }

  // State
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  // สำหรับการค้นหา (Suggestion)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  // Helper: แปลงอีเมลเป็นชื่อ
  const formatName = (email: string): string => {
    if (!email) return "";
    const namePart = email.split("@")[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  // Debug
  useEffect(() => {
    console.log("Current session email:", session.user.email);
  }, [session]);

  // 1) ดึง conversations ที่ผู้ใช้เป็น participants
  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", session.user.email),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convs);

      if (!selectedConversation && convs.length > 0) {
        setSelectedConversation(convs[0]);
      }
    });
    return () => unsubscribe();
  }, [session, selectedConversation]);

  // 2) ดึง messages ของห้องที่เลือก
  useEffect(() => {
    if (!selectedConversation) return;
    const messagesRef = collection(
      db,
      "conversations",
      selectedConversation.id,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [selectedConversation]);

  // 3) ดึง suggestion ผู้ใช้จาก API เมื่อ searchQuery เปลี่ยน (realtime)
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `/api/users?search=${encodeURIComponent(searchQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error fetching user suggestions", error);
      }
    };
    fetchSuggestions();
  }, [searchQuery]);

  // Focus/Blur handlers สำหรับช่องค้นหา
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
  };

  // เมื่อคลิกเลือก suggestion: ตรวจสอบว่ามีห้องแชทกับ user นี้อยู่แล้วหรือไม่
  const handleUserSelect = async (user: any) => {
    setSearchQuery("");
    setSearchResults([]);

    // ตรวจสอบว่ามี conversation กับ user นี้อยู่แล้วหรือไม่
    const existingConversation = conversations.find((conv) => {
      return (
        conv.participants.includes(session.user.email) &&
        conv.participants.includes(user.email)
      );
    });

    if (existingConversation) {
      setSelectedConversation(existingConversation);
      return;
    }

    // ถ้ายังไม่มี ให้สร้างใหม่
    const docRef = await addDoc(collection(db, "conversations"), {
      participants: [session.user.email, user.email],
      createdAt: serverTimestamp(),
    });
    const newConversation = {
      id: docRef.id,
      participants: [session.user.email, user.email],
      createdAt: new Date(),
    };
    setSelectedConversation(newConversation);
  };

  // ส่งข้อความ
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;
    await addDoc(
      collection(db, "conversations", selectedConversation.id, "messages"),
      {
        text: messageInput,
        sender: session.user.email,
        createdAt: serverTimestamp(),
      }
    );
    setMessageInput("");
  };

  // ดึงชื่อของคู่สนทนา
  const getOtherParticipantName = (): string => {
    const otherEmail = selectedConversation?.participants.find(
      (email: string) => email !== session.user.email
    );
    return formatName(otherEmail);
  };

  return (
    <div className="p-5 flex">
      {/* Sidebar */}
      <Navbar status="message" />

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-10 min-h-screen w-full flex flex-col">
        <Navbar2 title="ข้อความ" />

        <div className="flex flex-1 mt-10 overflow-hidden">
          {/* Left Sidebar: Chat List + Search */}
          <div className="w-1/3 border-r pr-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">รายการแชท</h3>

            {/* Search Input */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="ค้นหาชื่อหรืออีเมล..."
                className="w-full border p-2 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {isFocused && searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-md">
                  {searchResults.map((user: any) => (
                    <div
                      key={user.email}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleUserSelect(user)}
                      className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <Icon
                          path={mdiAccountCircle}
                          size={1}
                          className="mr-2"
                        />
                      )}
                      <span>{user.name || user.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat List */}
            {conversations.length === 0 && (
              <p className="text-gray-500">ยังไม่มีห้องแชท</p>
            )}
            {conversations.map((conv) => {
              const otherEmail = conv.participants.find(
                (email: string) => email !== session.user.email
              );
              const otherName = formatName(otherEmail);
              const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                otherName
              )}`;
              return (
                <div
                  key={conv.id}
                  className={`p-3 rounded-md cursor-pointer mb-2 flex items-center ${
                    selectedConversation &&
                    selectedConversation.id === conv.id
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <img
                    src={avatarUrl}
                    alt={otherName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{otherName}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Pane: Chat Window */}
          <div className="flex-1 pl-4 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header: แสดงชื่อคู่สนทนา */}
                <h3 className="text-lg font-bold mb-4">
                  {getOtherParticipantName()}
                </h3>
                {/* Chat Messages */}
                <div className="flex-1 border p-3 rounded mb-4 overflow-y-auto flex flex-col gap-2">
                  {messages.map((msg) => {
                    const msgAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      formatName(msg.sender)
                    )}`;
                    const displayTime = msg.createdAt?.toDate
                      ? new Date(msg.createdAt.toDate()).toLocaleTimeString()
                      : "";
                    return (
                      <div
                        key={msg.id}
                        className={`p-2 rounded flex items-start gap-2 ${
                          msg.sender === session.user.email
                            ? "bg-blue-100 self-end text-right"
                            : "bg-gray-100 self-start text-left"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        {msg.sender !== session.user.email && (
                          <img
                            src={msgAvatar}
                            alt={formatName(msg.sender)}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <div>
                          <p className="text-sm text-gray-600">
                            {msg.sender === session.user.email
                              ? "คุณ"
                              : formatName(msg.sender)}
                          </p>
                          <p>{msg.text}</p>
                          {displayTime && (
                            <p className="text-xs text-gray-500">
                              {displayTime}
                            </p>
                          )}
                        </div>
                        {msg.sender === session.user.email && (
                          <img
                            src={msgAvatar}
                            alt="คุณ"
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Message Input */}
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none"
                    placeholder="พิมพ์ข้อความ..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-5 rounded-lg"
                  >
                    ส่ง
                  </button>
                </form>
              </>
            ) : (
              <p className="text-gray-500">เลือกห้องแชทจากรายการด้านซ้าย</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
