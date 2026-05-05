/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy,
  ChevronRight,
  School,
  Play
} from 'lucide-react';

// --- Data Structure ---
type WordData = {
  [level: string]: {
    [row: number]: string[];
  };
};

const wordData: WordData = {
  Starter: {
    1: ["cat", "dog", "horse", "mouse", "elephant", "crocodile", "parent", "parrot", "passed", "picnic"],
    2: ["bird", "bear", "tiger", "monkey", "dinosaur", "jellyfish", "rabbit", "rained", "riding", "rocket"],
    3: ["cow", "duck", "sheep", "lizard", "hippo", "animal", "smiled", "sneezed", "snowing", "sorted"],
    4: ["bat", "bee", "spider", "snake", "giraffe", "donkey", "summer", "supper", "taking", "talked"],
    5: ["fish", "frog", "alien", "dragon", "monster", "creature", "twenty", "waited", "walked", "wanted"],
    11: ["bag", "book", "board", "ruler", "alphabet", "classroom", "horse", "mouse", "elephant", "crocodile"]
  },
  Flyer: {
    1: ["dictionary", "motorcycle", "strawberry", "television", "vocabulary", "afternoon", "alphabet", "apartment", "badminton", "bookcase"],
    2: ["bookshop", "breakfast", "chocolate", "classmate", "classroom", "crocodile", "elephant", "fantastic", "favourite", "meatballs"]
  }
};

// Primary Student Friendly Content (Cambridge Learner's Dictionary Style)
const primaryContent: { [key: string]: { def: string, ex: string } } = {
  cat: { def: "A small animal with soft fur that people keep as a pet.", ex: "I like dogs, but my sister likes her cute white cat." },
  dog: { def: "A common pet that has four legs and barks.", ex: "My neighbor has a big yellow dog that loves to run." },
  horse: { def: "A large animal that people can ride on.", ex: "The cowboy is riding a fast brown horse across the field." },
  mouse: { def: "A very small animal with a long tail.", ex: "The little gray mouse loves to eat cheese in the kitchen." },
  elephant: { def: "A very big gray animal with a very long nose called a trunk.", ex: "The elephant is the largest animal we saw at the zoo." },
  crocodile: { def: "A big green animal with a long body and very sharp teeth.", ex: "Be careful! The crocodile is swimming in the river." },
  parent: { def: "Your mother or your father.", ex: "I love my parents very much because they take care of me." },
  parrot: { def: "A colorful bird that can learn to say some words.", ex: "The green parrot can say 'Hello' to everyone it sees." },
  picnic: { def: "A meal that you eat outside, usually on the grass in a park.", ex: "We are having a picnic today because the sun is shining." },
  bird: { def: "An animal that has wings and can fly.", ex: "The blue bird is singing a happy song on the tree." },
  fish: { def: "An animal that lives and swims in the water.", ex: "The gold fish is swimming happily in the small glass bowl." },
  school: { def: "A place where children go to learn new things.", ex: "I go to school every morning to meet my friends and teacher." },
  apple: { def: "A hard round fruit that is red, green, or yellow.", ex: "An apple a day is very good for your health." },
  water: { def: "The clear liquid that we drink to stay alive.", ex: "I am very thirsty, so I want to drink a cup of cold water." },
  bag: { def: "Something used for carrying things, like books for school.", ex: "I put my colorful pencils and books inside my school bag." },
  book: { def: "Pieces of paper with words and pictures that people read.", ex: "Every night, my mom reads a fun story book to me." },
  tiger: { def: "A large wild cat that is orange with black stripes.", ex: "The tiger is a very strong and fast runner in the forest." },
  monkey: { def: "An animal with a long tail that likes to climb trees.", ex: "The funny monkey is eating a yellow banana." },
  butterfly: { def: "An insect with large, beautiful, colorful wings.", ex: "A pretty butterfly is flying over the colorful flowers." },
};

enum Mode {
  DICTATION = "聽寫測驗",
  TRANSLATION = "英譯提示",
  FILL_BLANK = "填空測驗"
}

enum View {
  ENTRY = "entry",
  PRACTICE = "practice",
  SUMMARY = "summary"
}

interface Result {
  word: string;
  isCorrect: boolean;
  userInput: string;
}

export default function App() {
  // Navigation & Config
  const [view, setView] = useState<View>(View.ENTRY);
  const [level, setLevel] = useState<string>("Starter");
  const [row, setRow] = useState<number>(1);
  const [mode, setMode] = useState<Mode>(Mode.DICTATION);

  // Practice State
  const [currentWordList, setCurrentWordList] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null, msg: string }>({ type: null, msg: "" });
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // API Content State
  const [wordInfo, setWordInfo] = useState<{ definition?: string, example?: string }>({});

  const currentWord = currentWordList[currentWordIndex] || "";

  // --- Voice Engine ---
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  // --- Fetch Dictionary Info ---
  const fetchWordInfo = async (word: string) => {
    const lowerWord = word.toLowerCase();
    
    // Check local simplified content first
    if (primaryContent[lowerWord]) {
      setWordInfo({ 
        definition: primaryContent[lowerWord].def, 
        example: primaryContent[lowerWord].ex 
      });
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${lowerWord}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        // Try to get a simple definition
        const definition = entry.meanings?.[0]?.definitions?.[0]?.definition || "A common word to learn.";
        const example = entry.meanings?.[0]?.definitions?.find((d: any) => d.example)?.example || `Let's practice the word '${word}'.`;
        setWordInfo({ definition, example });
      } else {
        setWordInfo({ definition: "A fun word to learn in English!", example: `Can you type the word ${word}?` });
      }
    } catch (error) {
      setWordInfo({ definition: "Practice mode active.", example: `Time to learn: ${word}` });
    }
  };

  // --- Handle Action Logic ---
  const handleStartPractice = () => {
    let list = [...(wordData[level]?.[row] || wordData["Starter"][1])];
    
    // Fisher-Yates Shuffle algorithm
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    setCurrentWordList(list);
    setCurrentWordIndex(0);
    setResults([]);
    setUserInput("");
    setIsLocked(false);
    setView(View.PRACTICE);
  };

  const handleNextWord = useCallback(() => {
    if (currentWordIndex < currentWordList.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setUserInput("");
      setFeedback({ type: null, msg: "" });
      setIsLocked(false);
    } else {
      setView(View.SUMMARY);
    }
  }, [currentWordIndex, currentWordList.length]);

  const checkAnswer = useCallback(() => {
    if (isLocked) return;
    
    setIsLocked(true);
    const isCorrect = userInput.toLowerCase().trim() === currentWord.toLowerCase().trim();
    
    setResults(prev => [...prev, {
      word: currentWord,
      isCorrect,
      userInput
    }]);

    if (isCorrect) {
      setFeedback({ type: 'correct', msg: "太棒了！答對了 ✨" });
    } else {
      setFeedback({ type: 'wrong', msg: `哎呀，應該是: ${currentWord.toUpperCase()}` });
    }

    setTimeout(() => {
      handleNextWord();
    }, 2000);
  }, [userInput, currentWord, isLocked, handleNextWord]);

  // --- Global Keyboard Listener ---
  useEffect(() => {
    if (view !== View.PRACTICE || isLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (userInput.length > 0) checkAnswer();
      } else if (e.key === "Backspace") {
        setUserInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1 && /^[a-zA-Z\s\-]$/.test(e.key)) {
        if (userInput.length < currentWord.length) {
          setUserInput(prev => prev + e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, isLocked, userInput, currentWord.length, checkAnswer]);

  // --- Practice View Initialization ---
  useEffect(() => {
    if (view === View.PRACTICE && currentWord) {
      fetchWordInfo(currentWord);
      if (mode === Mode.DICTATION) {
        speak(currentWord);
      }
    }
  }, [view, currentWord, mode, speak]);

  // --- Renderers ---

  const renderEntry = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-8"
    >
      <div className="bg-white rounded-2xl p-10 shadow-soft border-4 border-brand-blue text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-brand-yellow rounded-full mx-auto flex items-center justify-center mb-4">
            <School className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">MomoTyped</h1>
          <p className="text-slate-400 mt-2">個人化單字練習工具</p>
        </div>

        <div className="space-y-6 text-left">
          {/* Level Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">選擇程度</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(wordData).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                    level === lvl 
                    ? "bg-brand-blue border-brand-blue text-slate-700" 
                    : "border-slate-100 text-slate-300 hover:border-brand-blue/30"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Row Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">選擇範圍 (Row)</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setRow(prev => Math.max(1, prev - 1))}
                className="w-14 h-14 flex items-center justify-center bg-brand-blue rounded-2xl font-black text-2xl text-slate-600 hover:scale-105 active:scale-95 transition-all shadow-sm border-2 border-white"
              >
                -
              </button>
              <input 
                type="number" 
                value={row}
                onChange={(e) => setRow(Math.max(1, Number(e.target.value)))}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-blue outline-none font-bold text-xl text-center text-slate-700 transition-colors"
                min="1"
              />
              <button 
                onClick={() => setRow(prev => prev + 1)}
                className="w-14 h-14 flex items-center justify-center bg-brand-blue rounded-2xl font-black text-2xl text-slate-600 hover:scale-105 active:scale-95 transition-all shadow-sm border-2 border-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">練習模式</label>
            <div className="space-y-2">
              {Object.values(Mode).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`w-full py-3 px-6 rounded-xl font-bold border-2 text-left flex items-center justify-between transition-all ${
                    mode === m 
                    ? "bg-brand-pink border-brand-pink text-slate-700" 
                    : "border-slate-100 text-slate-300 hover:border-brand-pink/30"
                  }`}
                >
                  {m}
                  {mode === m && <Play size={18} fill="currentColor" />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartPractice}
            className="w-full mt-6 py-4 bg-brand-yellow text-slate-800 font-black text-xl rounded-2xl shadow-cute hover:-translate-y-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            開始練習 <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderPractice = () => (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header - Back Button and Progress */}
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        {/* Back Button (Left) */}
        <button 
          onClick={() => {
            window.speechSynthesis.cancel();
            setView(View.ENTRY);
          }}
          className="flex items-center gap-2 py-2 px-5 bg-white rounded-full shadow-soft text-slate-400 hover:text-brand-pink hover:shadow-md transition-all group border-2 border-transparent hover:border-brand-pink/20"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Back</span>
        </button>
        
        {/* Progress (Right) */}
        <div className="bg-brand-blue px-6 py-2 rounded-full font-bold text-slate-600 shadow-sm border-2 border-white">
          {level} - Row {row} ( {currentWordIndex + 1} / {currentWordList.length} )
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <motion.div 
          key={currentWordIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white rounded-3xl p-12 shadow-soft border-4 border-brand-blue relative"
        >
          {/* Hint Section */}
          <div className="mb-12 text-center">
            {/* Audio Button - Available in all modes as requested */}
            <button 
              onClick={() => speak(currentWord)}
              className="w-20 h-20 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-105 active:scale-95 transition-transform shadow-sm border-4 border-white"
            >
              <Volume2 size={36} className="text-slate-700" />
            </button>

            {mode === Mode.TRANSLATION && (
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">英文定義</span>
                <p className="text-xl font-medium text-slate-600 italic">"{wordInfo.definition}"</p>
              </div>
            )}
            {mode === Mode.FILL_BLANK && (
              <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 min-h-[120px] flex items-center justify-center">
                <p className="text-2xl font-bold text-slate-700 leading-relaxed">
                  {wordInfo.example ? (
                    wordInfo.example.split(new RegExp(`(${currentWord})`, 'gi')).map((part, i) => (
                      <span key={i}>
                        {part.toLowerCase() === currentWord.toLowerCase() ? (
                          <span className="text-brand-pink mx-2 px-4 py-1 border-b-2 border-brand-pink bg-pink-50 rounded-lg">
                            [ ______ ]
                          </span>
                        ) : part}
                      </span>
                    ))
                  ) : "正在尋找例句..."}
                </p>
              </div>
            )}
          </div>

          {/* Typing Area */}
          <div className="relative mb-16 h-24 flex items-center justify-center gap-3">
            {currentWord.split('').map((char, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-14 font-black text-4xl text-slate-800 min-w-[30px] text-center select-none">
                  {userInput[i] || ""}
                </div>
                <div className={`h-1.5 w-10 rounded-full transition-all duration-300 ${
                  userInput.length === i 
                    ? "bg-brand-pink w-12" 
                    : i < userInput.length ? "bg-brand-blue" : "bg-slate-200"
                }`} />
              </div>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback.type && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-x-0 bottom-6 text-center text-xl font-black ${
                  feedback.type === 'correct' ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <p className="mt-8 text-slate-400 font-medium">使用鍵盤直接輸入字母，按 Enter 送出</p>
      </div>
    </div>
  );

  const renderSummary = () => {
    const correctCount = results.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctCount / results.length) * 100);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="bg-white rounded-3xl p-10 shadow-soft border-4 border-brand-yellow text-center">
          <Trophy size={64} className="text-brand-yellow mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-800 mb-1">學習結算</h2>
          
          {/* 顯示範圍資訊 */}
          <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-slate-500 font-bold text-sm mb-4">
            {level} - 範圍第 {row} 區
          </div>

          <div className="text-6xl font-black text-brand-pink mb-8">{accuracy}%</div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-3">
            {results.map((res, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-2">
                <div className="flex gap-4 items-center">
                  <span className="text-slate-300 font-mono text-sm">#{idx+1}</span>
                  <span className={`text-xl font-bold ${res.isCorrect ? "text-slate-700" : "text-slate-400 line-through"}`}>
                    {res.word}
                  </span>
                  {!res.isCorrect && (
                    <span className="text-rose-500 font-bold ml-2">{res.userInput}</span>
                  )}
                </div>
                {res.isCorrect ? (
                  <CheckCircle2 className="text-emerald-500" size={24} />
                ) : (
                  <XCircle className="text-rose-500" size={24} />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setView(View.ENTRY)}
            className="w-full py-4 bg-brand-blue text-slate-700 font-black text-xl rounded-2xl shadow-cute hover:-translate-y-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            Back to Home <ArrowLeft size={24} />
          </button>
          
          <button
            onClick={handleStartPractice}
            className="w-full mt-4 py-4 bg-slate-100 text-slate-500 font-bold text-lg rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            重新練習一次 <RotateCcw size={20} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 px-4">
      <AnimatePresence mode="wait">
        {view === View.ENTRY && renderEntry()}
        {view === View.PRACTICE && renderPractice()}
        {view === View.SUMMARY && renderSummary()}
      </AnimatePresence>
    </div>
  );
}
