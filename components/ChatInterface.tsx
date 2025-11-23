import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { DEV_INFO, APP_NAME } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hallo bro welcome to ${APP_NAME} VX. System online.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Trigger syntax highlighting when messages change
  useEffect(() => {
    if ((window as any).Prism) {
      (window as any).Prism.highlightAll();
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages
        .filter(m => !m.isError)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const responseText = await sendMessageToGemini(input, history);
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Connection interrupted. Switching protocols...", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDevCommand = () => {
    const devMsg: Message = { role: 'user', text: "Siapa developer atau pencipta kamu?" };
    setMessages(prev => [...prev, devMsg]);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', text: DEV_INFO }]);
    }, 500);
  };

  // Helper function to render message content with code highlighting
  const renderMessageContent = (text: string) => {
    // Split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language and code
        const match = part.match(/```(\w+)?\s*([\s\S]*?)```/);
        if (match) {
          const lang = match[1] || 'plaintext';
          const code = match[2];
          return (
            <div key={index} className="my-3 relative group">
              <div className="absolute -top-3 right-2 text-[10px] font-bold text-red-400 bg-black px-2 border border-red-900/50 rounded-t uppercase tracking-wider">
                {lang}
              </div>
              <pre className="!m-0 rounded-md overflow-x-auto">
                <code className={`language-${lang}`}>{code}</code>
              </pre>
            </div>
          );
        }
      }
      // Regular text - preserve newlines
      return (
        <span key={index} dangerouslySetInnerHTML={{ 
          __html: part.replace(/\n/g, '<br/>') 
        }} />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="terminal">
      {/* Window Header */}
      <div className="bg-red-900 rounded-t-lg p-3 flex items-center justify-between border-x-2 border-t-2 border-red-700 shadow-[0_0_15px_rgba(139,0,0,0.3)]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-50"></div>
        </div>
        <div className="text-white font-['JetBrains_Mono'] text-xs opacity-90 font-bold tracking-widest">bash -- central_gpt.exe</div>
        <div className="w-4"></div>
      </div>

      {/* Chat Area */}
      <div className="bg-black/95 border-x-2 border-b-2 border-red-900 h-[600px] flex flex-col relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {/* Scanlines overlay */}
        <div className="scanlines absolute inset-0 pointer-events-none opacity-15"></div>
        
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        {/* Messages Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-['JetBrains_Mono'] custom-scrollbar z-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div 
                className={`max-w-[90%] md:max-w-[80%] rounded-lg p-4 border ${
                  msg.role === 'user' 
                    ? 'bg-red-950/30 border-red-600/50 text-red-100 ml-8' 
                    : 'bg-gray-900/80 border-gray-700/50 text-gray-300 mr-8'
                } ${msg.isError ? 'border-red-500 text-red-500' : ''} relative backdrop-blur-sm`}
                style={{ boxShadow: msg.role === 'user' ? '4px 4px 0px 0px rgba(139,0,0,0.3)' : '4px 4px 0px 0px rgba(50,50,50,0.3)' }}
              >
                <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-1">
                  <div className="text-[10px] font-bold opacity-70 uppercase tracking-wider flex items-center gap-2">
                    <i className={`fas ${msg.role === 'user' ? 'fa-user-secret' : 'fa-robot'}`}></i>
                    {msg.role === 'user' ? 'User@Host' : 'CentralGPT::Core'}
                  </div>
                  <div className="text-[9px] opacity-40">{new Date().toLocaleTimeString()}</div>
                </div>
                <div className="leading-relaxed text-sm md:text-base">
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex justify-start animate-pulse">
               <div 
                 className="bg-black/80 border border-red-900 p-4 rounded-lg mr-8 relative overflow-hidden group w-64"
                 style={{ boxShadow: '4px 4px 0px 0px rgba(100,0,0,0.2)' }}
               >
                 {/* Header */}
                 <div className="flex items-center justify-between text-[10px] text-red-400 font-['JetBrains_Mono'] mb-3 border-b border-red-900/30 pb-2">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-network-wired animate-pulse"></i>
                      <span>PROCESSING</span>
                    </div>
                    <span className="animate-blink">...</span>
                 </div>
                 
                 {/* Pixel Art Animation */}
                 <div className="flex items-center justify-center gap-4 py-2">
                    {/* 3x3 Grid Animation */}
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 bg-red-600"
                          style={{
                            animation: 'blink 1s infinite',
                            animationDelay: `${Math.random() * 0.5}s`,
                            opacity: 0
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="font-['Press_Start_2P'] text-[8px] text-red-500 leading-loose">
                      <div>DECRYPTING</div>
                      <div>PACKETS...</div>
                    </div>
                 </div>
                 
                 {/* Scanline effect specific to loader */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_50%,rgba(0,0,0,0)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
               </div>
             </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900/95 border-t border-red-900 z-20 backdrop-blur">
          
          {/* Dev Button floating above input */}
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="text-[10px] text-gray-500 font-mono">STATUS: <span className="text-green-500">CONNECTED</span></div>
            <button 
              onClick={handleDevCommand}
              className="text-[10px] bg-red-900/20 text-red-400 px-2 py-1 rounded border border-red-900/50 hover:bg-red-900 hover:text-white transition-colors font-['Press_Start_2P'] flex items-center gap-2"
            >
              <i className="fas fa-code"></i> DEV_MODE
            </button>
          </div>

          <div className="relative flex items-end gap-2">
            <div className="text-red-500 py-3 text-lg animate-pulse font-['Press_Start_2P'] text-sm pt-4">{'>'}</div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command sequence..."
              className="w-full bg-black text-red-100 p-3 rounded border border-red-900/60 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 resize-none h-[50px] max-h-[150px] font-['JetBrains_Mono'] shadow-inner placeholder-red-900/50"
              rows={1}
              style={{ minHeight: '50px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="h-[50px] w-[50px] flex items-center justify-center bg-red-900/80 hover:bg-red-700 text-white rounded border border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_10px_rgba(139,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
            >
              <i className="fa-solid fa-terminal text-sm group-hover:scale-110 transition-transform"></i>
            </button>
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-gray-600 font-mono">
            <span>Secure Channel: ENCRYPTED</span>
            <span>Shift+Enter: New Line | Enter: Execute</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;