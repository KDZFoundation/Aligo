import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage, Project } from '../types';
import { Send, X, MessageSquare, User } from 'lucide-react';
import { Button } from './ui/button';

interface ChatProps {
  project: Project;
  onClose: () => void;
}

export default function Chat({ project, onClose }: ChatProps) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project.id) return;

    const q = query(
      collection(db, 'messages'),
      where('projectId', '==', project.id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(msgs);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'messages');
    });

    return () => unsubscribe();
  }, [project.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !profile || !project.id) return;

    try {
      await addDoc(collection(db, 'messages'), {
        projectId: project.id,
        senderId: user.uid,
        senderName: profile.organizationName || profile.firstName || 'Użytkownik',
        text: newMessage.trim(),
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'messages');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Komunikator Projektowy</h2>
              <p className="text-xs text-blue-100 opacity-80">Projekt: {project.title}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="p-2 h-auto text-white hover:bg-white/10">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50"
        >
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Brak wiadomości. Rozpocznij konwersację!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.uid;
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    {!isMe && <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">{msg.senderName}</p>}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
            className="flex-grow p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
