import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Check, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface UserRequirements {
  name: string;
  eventType: string;
  services: string[];
  date: string;
  guests: string;
  budget: string;
  notes: string;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const [requirements, setRequirements] = useState<UserRequirements>({
    name: '',
    eventType: '',
    services: [],
    date: '',
    guests: '',
    budget: '',
    notes: '',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const phoneNumber = '919876543210'; // Client's WhatsApp number

  // Lock body scroll on mobile when chatbot is open
  useEffect(() => {
    if (isOpen) {
      // Add classes or style to body to prevent double scrollbars and scrolling behind
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input when step changes or chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current && window.innerWidth >= 768) {
      // Only auto-focus on desktop to prevent mobile keyboard from jumping up unexpectedly
      inputRef.current.focus();
    }
  }, [isOpen, step]);

  // Start chatbot conversation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendBotMessage("Hi there! I'm your Eventique Assistant. ✨ I'm here to help gather your requirements and design your dream invitation suite!");
      setTimeout(() => {
        sendBotMessage("To get started, what is your name?");
      }, 1000);
    }
  }, [isOpen]);

  const sendBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'bot',
          text,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'user',
        text,
        timestamp: new Date(),
      },
    ]);
    setInputValue('');

    // Process next steps
    processNextStep(text);
  };

  const processNextStep = (userResponse: string) => {
    if (step === 0) {
      setRequirements((prev) => ({ ...prev, name: userResponse }));
      setStep(1);
      sendBotMessage(`Lovely to meet you, ${userResponse}! 🌸 What kind of special event are you planning?`);
    } else if (step === 1) {
      setRequirements((prev) => ({ ...prev, eventType: userResponse }));
      setStep(2);
      sendBotMessage("Wonderful! Which of our services or products are you looking for? You can choose multiple.");
    } else if (step === 2) {
      const selectedText = selectedServices.length > 0 ? selectedServices.join(', ') : userResponse;
      setRequirements((prev) => ({ ...prev, services: selectedServices.length > 0 ? selectedServices : [userResponse] }));
      setStep(3);
      sendBotMessage("Got it. 📅 Approximately when is your big day? (e.g. October 2026, or a specific date if finalized)");
    } else if (step === 3) {
      setRequirements((prev) => ({ ...prev, date: userResponse }));
      setStep(4);
      sendBotMessage("Perfect! About how many guests are you expecting to invite to the event?");
    } else if (step === 4) {
      setRequirements((prev) => ({ ...prev, guests: userResponse }));
      setStep(5);
      sendBotMessage("Excellent. Do you have an approximate budget in mind for your design or printing services?");
    } else if (step === 5) {
      setRequirements((prev) => ({ ...prev, budget: userResponse }));
      setStep(6);
      sendBotMessage("Almost done! 🎨 Lastly, do you have any specific design themes, color palettes, or ideas in mind? (e.g., pastel florals, modern minimalist, royal gold)");
    } else if (step === 6) {
      const finalRequirements = { ...requirements, notes: userResponse };
      setRequirements(finalRequirements);
      setStep(7);
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'bot',
            text: "All set! 🌟 I've compiled your event requirements. Let's review them below.",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const confirmServices = () => {
    if (selectedServices.length === 0) return;
    handleSendMessage(`Services: ${selectedServices.join(', ')}`);
  };

  const skipStep = (label: string) => {
    handleSendMessage(label);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const restartChat = () => {
    setMessages([]);
    setStep(0);
    setSelectedServices([]);
    setRequirements({
      name: '',
      eventType: '',
      services: [],
      date: '',
      guests: '',
      budget: '',
      notes: '',
    });
    setIsOpen(true);
  };

  const getWhatsAppLink = () => {
    const msg = `Hi Eventique! I'd like to share my event requirements:
    
👤 *Client Name:* ${requirements.name}
🎉 *Event Type:* ${requirements.eventType}
✨ *Services:* ${requirements.services.join(', ')}
📅 *Event Date:* ${requirements.date}
👥 *Expected Guests:* ${requirements.guests}
💰 *Budget:* ${requirements.budget}
🎨 *Themes/Notes:* ${requirements.notes || 'None specified'}

Looking forward to hearing from you!`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200 hover:shadow-2xl cursor-pointer touch-manipulation"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <MessageCircle className="w-7 h-7 transition-transform duration-200" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed z-[1000] bg-white flex flex-col overflow-hidden transition-all duration-300 ease-out border-[#f0ece4]
            /* Mobile layout: Fullscreen */
            inset-0 w-full h-[100dvh] rounded-none
            /* Tablet & Desktop layout: Floating */
            sm:inset-auto sm:bottom-24 sm:right-6 sm:w-96 sm:h-[600px] sm:max-h-[82vh] sm:rounded-2xl sm:border sm:shadow-2xl
            /* Entry animation */
            animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-6 sm:fade-in duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-[#a85a5a] text-white px-5 py-4 flex items-center justify-between shadow-md select-none">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-secondary" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">Eventique Concierge</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-secondary animate-pulse" /> Ready to design
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer active:scale-90"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 overscroll-behavior-contain touch-auto [webkit-overflow-scrolling:touch]"
            style={{ overscrollBehavior: 'contain' }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0 border shadow-sm select-none ${
                    msg.sender === 'user'
                      ? 'bg-secondary border-secondary/20 text-white'
                      : 'bg-white border-gray-200 text-primary'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[80%] select-none">
                <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {/* Dynamic Interactive Input helpers */}
            {!isTyping && (
              <div className="space-y-3">
                {/* Step 1: Event Type Suggestions */}
                {step === 1 && (
                  <div className="flex flex-wrap gap-2 justify-start pl-9">
                    {['Wedding', 'Engagement', 'Anniversary', 'Birthday', 'Corporate', 'Other'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleSendMessage(type)}
                        className="px-3.5 py-2 bg-white hover:bg-secondary/10 border border-gray-200 hover:border-secondary text-gray-700 hover:text-primary rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Multi-select Services */}
                {step === 2 && (
                  <div className="space-y-3 pl-9">
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Digital Invitations',
                        'Printed Invites',
                        'Wedding Website',
                        'Event Stationery',
                        'Gifts & Favors',
                        'Full Design Package',
                      ].map((service) => {
                        const isSelected = selectedServices.includes(service);
                        return (
                          <button
                            key={service}
                            onClick={() => handleServiceToggle(service)}
                            className={`px-3.5 py-2 rounded-full text-xs font-semibold shadow-sm border transition-all cursor-pointer touch-manipulation active:scale-95 ${
                              isSelected
                                ? 'bg-primary border-primary text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-secondary hover:text-primary'
                            }`}
                          >
                            {service}
                            {isSelected && <Check className="inline-block w-3.5 h-3.5 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={confirmServices}
                      disabled={selectedServices.length === 0}
                      className="w-full py-2.5 bg-secondary text-white rounded-lg text-xs font-bold shadow hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation active:scale-98"
                    >
                      Confirm Services
                    </button>
                  </div>
                )}

                {/* Step 3: Date Suggestions */}
                {step === 3 && (
                  <div className="flex flex-wrap gap-2 justify-start pl-9">
                    {['Next Month', 'Within 3 Months', 'In 6 Months', 'Not Fixed'].map((dateOpt) => (
                      <button
                        key={dateOpt}
                        onClick={() => handleSendMessage(dateOpt)}
                        className="px-3.5 py-2 bg-white hover:bg-secondary/10 border border-gray-200 hover:border-secondary text-gray-700 hover:text-primary rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                      >
                        {dateOpt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: Guest Suggestions */}
                {step === 4 && (
                  <div className="flex flex-wrap gap-2 justify-start pl-9">
                    {['Under 100', '100 - 250', '250 - 500', '500+', 'Not sure'].map((gOpt) => (
                      <button
                        key={gOpt}
                        onClick={() => handleSendMessage(gOpt)}
                        className="px-3.5 py-2 bg-white hover:bg-secondary/10 border border-gray-200 hover:border-secondary text-gray-700 hover:text-primary rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                      >
                        {gOpt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 5: Budget Suggestions */}
                {step === 5 && (
                  <div className="flex flex-wrap gap-2 justify-start pl-9">
                    {['Under ₹20k', '₹20k - ₹50k', '₹50k - ₹1L', '₹1L+', 'Flexible'].map((bOpt) => (
                      <button
                        key={bOpt}
                        onClick={() => handleSendMessage(bOpt)}
                        className="px-3.5 py-2 bg-white hover:bg-secondary/10 border border-gray-200 hover:border-secondary text-gray-700 hover:text-primary rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                      >
                        {bOpt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 6: Notes Suggestions */}
                {step === 6 && (
                  <div className="flex gap-2 justify-start pl-9">
                    <button
                      onClick={() => skipStep('No specific theme yet')}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-semibold hover:border-secondary active:scale-95 cursor-pointer touch-manipulation"
                    >
                      Skip / No preference
                    </button>
                  </div>
                )}

                {/* Step 7: Completed Summary Card */}
                {step === 7 && (
                  <div className="bg-white border border-[#f0ece4] rounded-xl p-4 shadow-md space-y-3 mx-1 animate-in fade-in-50 zoom-in-95 duration-200 overscroll-behavior-contain">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary pb-2 border-b border-gray-100 select-none">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      Your Design Brief Summary
                    </div>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Client</span>
                        <span className="font-semibold text-gray-700">{requirements.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Event Type</span>
                        <span className="font-semibold text-gray-700">{requirements.eventType}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block text-[10px]">Services</span>
                        <span className="font-semibold text-gray-700 break-words">
                          {requirements.services.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Date</span>
                        <span className="font-semibold text-gray-700">{requirements.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Guest Count</span>
                        <span className="font-semibold text-gray-700">{requirements.guests}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Budget</span>
                        <span className="font-semibold text-gray-700">{requirements.budget}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block text-[10px]">Design Notes</span>
                        <span className="font-semibold text-gray-700 italic block max-h-16 overflow-y-auto pr-1">
                          "{requirements.notes || 'None'}"
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer touch-manipulation"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" /> Send Brief to WhatsApp
                      </a>
                      <button
                        onClick={restartChat}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium text-center transition-all cursor-pointer"
                      >
                        Edit Details / Start Over
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Sticky Input Panel at bottom */}
          <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2 select-none safe-bottom pb-[calc(12px+env(safe-area-inset-bottom))]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={step === 7 || step === 2}
              placeholder={
                step === 7
                  ? "Brief ready!"
                  : step === 2
                  ? "Select services above..."
                  : "Type your answer..."
              }
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-secondary bg-gray-50 focus:bg-white disabled:opacity-60 text-gray-800"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || step === 7 || step === 2}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-all hover:scale-105 active:scale-90 hover:bg-primary/95 cursor-pointer touch-manipulation"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
