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
    6: ["egg", "meat", "bread", "burger", "breakfast", "chocolate", "again", "alien", "angry", "beach"],
    7: ["milk", "food", "cheese", "carrot", "coconut", "pineapple", "blood", "board", "bread", "break"],
    8: ["cake", "rice", "banana", "tomato", "sausage", "watermelon", "carry", "catch", "cause", "check"],
    9: ["pie", "pear", "lemon", "orange", "lemonade", "ice cream", "cloud", "coast", "count", "cover"],
    10: ["bean", "pea", "fruit", "juice", "meatballs", "favourite", "crowd", "crown", "cruel", "crush"],
    11: ["bag", "book", "board", "ruler", "alphabet", "classroom", "horse", "mouse", "elephant", "crocodile"],
    12: ["desk", "pen", "clock", "paper", "bookcase", "computer", "tiger", "monkey", "dinosaur", "jellyfish"],
    13: ["page", "test", "class", "school", "classmate", "understand", "sheep", "lizard", "hippo", "animal"],
    14: ["read", "word", "spell", "letter", "question", "sentence", "spider", "snake", "giraffe", "donkey"],
    15: ["line", "part", "answer", "learn", "example", "English", "alien", "dragon", "monster", "creature"],
    16: ["bed", "room", "table", "chair", "bedroom", "bathroom", "bread", "burger", "breakfast", "chocolate"],
    17: ["door", "wall", "floor", "window", "apartment", "armchair", "cheese", "carrot", "coconut", "pineapple"],
    18: ["bath", "rug", "house", "mirror", "cupboard", "bookcase", "banana", "tomato", "sausage", "watermelon"],
    19: ["hall", "home", "radio", "phone", "television", "picture", "lemon", "orange", "lemonade", "ice cream"],
    20: ["lamp", "sofa", "tablet", "camera", "painting", "drawing", "fruit", "juice", "meatballs", "favourite"],
    21: ["boot", "shoe", "shirt", "dress", "clothes", "trousers", "board", "ruler", "alphabet", "classroom"],
    22: ["hat", "sock", "skirt", "shorts", "glasses", "handbag", "clock", "paper", "bookcase", "computer"],
    23: ["coat", "wear", "watch", "jacket", "baseball", "basketball", "class", "school", "classmate", "understand"],
    24: ["eye", "ear", "mouth", "tooth", "badminton", "football", "spell", "letter", "question", "sentence"],
    25: ["arm", "leg", "hair", "smile", "keyboard", "skateboard", "answer", "learn", "example", "English"],
    26: ["face", "head", "hand", "clean", "afternoon", "evening", "table", "chair", "bedroom", "bathroom"],
    27: ["foot", "body", "dirty", "catch", "morning", "tomorrow", "floor", "window", "apartment", "armchair"],
    28: ["boy", "girl", "brother", "sister", "children", "grandfather", "house", "mirror", "cupboard", "bookcase"],
    29: ["dad", "mum", "cousin", "family", "grandmother", "grandparent", "radio", "phone", "television", "picture"],
    30: ["man", "men", "child", "person", "daughter", "beautiful", "tablet", "camera", "painting", "drawing"],
    31: ["car", "bus", "train", "plane", "helicopter", "motorbike", "shirt", "dress", "clothes", "trousers"],
    32: ["bike", "boat", "drive", "lorry", "passenger", "transport", "skirt", "shorts", "glasses", "handbag"],
    33: ["run", "walk", "jump", "throw", "playground", "skateboarding", "watch", "jacket", "baseball", "basketball"],
    34: ["swim", "fly", "sport", "catch", "badminton", "baseball", "mouth", "tooth", "badminton", "football"],
    35: ["play", "kick", "bounce", "stand", "fantastic", "favourite", "hair", "smile", "keyboard", "skateboard"],
    36: ["hit", "ride", "drive", "climb", "carefully", "completely", "hand", "clean", "afternoon", "evening"],
    37: ["blue", "red", "black", "green", "purple", "yellow", "dirty", "catch", "morning", "tomorrow"],
    38: ["gray", "pink", "white", "brown", "colour", "orange", "brother", "sister", "children", "grandfather"],
    39: ["good", "bad", "great", "happy", "angry", "hungry", "cousin", "family", "grandmother", "grandparent"],
    40: ["big", "sad", "small", "short", "double", "thirsty", "child", "person", "daughter", "beautiful"],
    41: ["old", "new", "young", "clean", "closed", "dirty", "train", "plane", "helicopter", "motorbike"],
    42: ["hot", "cold", "warm", "cool", "correct", "wrong", "drive", "lorry", "passenger", "transport"],
    43: ["long", "nice", "sweet", "scary", "careful", "terrible", "jump", "throw", "playground", "skateboarding"],
    44: ["day", "year", "month", "night", "weekend", "holiday", "sport", "catch", "badminton", "baseball"],
    45: ["sun", "sea", "beach", "water", "weather", "raining", "bounce", "stand", "fantastic", "favourite"],
    46: ["tree", "wood", "flower", "garden", "ground", "outside", "drive", "climb", "carefully", "completely"],
    47: ["park", "zoo", "shop", "store", "bookshop", "hospital", "black", "green", "purple", "yellow"],
    48: ["out", "in", "under", "behind", "between", "inside", "white", "brown", "colour", "orange"],
    49: ["on", "at", "next", "front", "cross", "across", "great", "happy", "angry", "hungry"],
    50: ["to", "for", "about", "with", "through", "around", "small", "short", "double", "thirsty"],
    51: ["a", "an", "the", "some", "many", "those", "young", "clean", "closed", "dirty"],
    52: ["my", "our", "their", "your", "these", "theirs", "warm", "cool", "correct", "wrong"],
    53: ["he", "she", "they", "them", "yours", "myself", "sweet", "scary", "careful", "terrible"],
    54: ["it", "its", "his", "hers", "which", "whose", "month", "night", "weekend", "holiday"],
    55: ["I", "me", "you", "who", "where", "what", "beach", "water", "weather", "raining"],
    56: ["do", "be", "have", "make", "choose", "complete", "flower", "garden", "ground", "outside"],
    57: ["am", "is", "are", "was", "were", "count", "shop", "store", "bookshop", "hospital"],
    58: ["can", "get", "give", "know", "point", "close", "under", "behind", "between", "inside"],
    59: ["go", "see", "look", "find", "enjoy", "listen", "next", "front", "cross", "across"],
    60: ["say", "tell", "ask", "talk", "laugh", "shout", "about", "with", "through", "around"],
    61: ["yes", "no", "well", "then", "there", "today", "the", "some", "many", "those"],
    62: ["too", "very", "much", "lot", "really", "again", "their", "your", "these", "theirs"],
    63: ["here", "now", "soon", "often", "never", "always", "they", "them", "yours", "myself"],
    64: ["but", "and", "or", "because", "anything", "something", "his", "hers", "which", "whose"],
    65: ["bye", "hi", "cool", "sorry", "goodbye", "pardon", "you", "who", "where", "what"],
    66: ["cat", "dog", "horse", "mouse", "elephant", "crocodile", "have", "make", "choose", "complete"],
    67: ["bird", "bear", "tiger", "monkey", "dinosaur", "jellyfish", "are", "was", "were", "count"],
    68: ["cow", "duck", "sheep", "lizard", "hippo", "animal", "give", "know", "point", "close"],
    69: ["bat", "bee", "spider", "snake", "giraffe", "donkey", "look", "find", "enjoy", "listen"],
    70: ["fish", "frog", "alien", "dragon", "monster", "creature", "ask", "talk", "laugh", "shout"],
    71: ["egg", "meat", "bread", "burger", "breakfast", "chocolate", "well", "then", "there", "today"],
    72: ["milk", "food", "cheese", "carrot", "coconut", "pineapple", "much", "lot", "really", "again"],
    73: ["cake", "rice", "banana", "tomato", "sausage", "watermelon", "soon", "often", "never", "always"],
    74: ["pie", "pear", "lemon", "orange", "lemonade", "ice cream", "or", "because", "anything", "something"],
    75: ["bean", "pea", "fruit", "juice", "meatballs", "favourite", "cool", "sorry", "goodbye", "pardon"],
    76: ["skateboarding", "grandfather", "grandmother", "grandparent", "basketball", "helicopter", "understand", "watermelon", "background", "beautiful"],
    77: ["dictionary", "motorcycle", "strawberry", "television", "vocabulary", "afternoon", "alphabet", "apartment", "badminton", "bookcase"],
    78: ["bookshop", "breakfast", "chocolate", "classmate", "classroom", "crocodile", "elephant", "fantastic", "favourite", "meatballs"],
    79: ["pineapple", "playground", "question", "sentence", "skateboard", "trousers", "armchair", "bathroom", "bedroom", "birthday"],
    80: ["chicken", "children", "coconut", "complete", "computer", "correct", "cupboard", "drawing", "English", "evening"],
    81: ["example", "fishing", "football", "glasses", "goodbye", "morning", "motorbike", "painting", "sausage", "armchair"],
    82: ["balloon", "baseball", "between", "brother", "clothes", "brother", "teacher", "student", "mother", "father"],
    83: ["animal", "answer", "apples", "banana", "burger", "camera", "carrot", "cheese", "closed", "colour"],
    84: ["cousin", "crayon", "dinner", "double", "family", "flower", "friend", "garden", "giraffe", "guitar"],
    85: ["hungry", "jacket", "lesson", "letter", "listen", "lizard", "mirror", "monkey", "number", "orange"],
    86: ["pardon", "pencil", "person", "people", "phone", "photo", "piano", "please", "poster", "potato"],
    87: ["purple", "really", "rubber", "ruler", "school", "shorts", "sister", "soccer", "spider", "street"],
    88: ["tablet", "tennis", "thanks", "tomato", "window", "yellow", "afraid", "almost", "always", "around"],
    89: ["asleep", "autumn", "awake", "baking", "basket", "before", "behind", "better", "boring", "bottle"],
    90: ["bottom", "bought", "branch", "bridge", "bright", "broken", "butter", "button", "called", "castle"],
    91: ["caught", "center", "choose", "circle", "clever", "coffee", "coming", "cooked", "crying", "dancer"],
    92: ["danger", "doctor", "dollar", "double", "dream", "driven", "easily", "eating", "either", "eleven"],
    93: ["enough", "escape", "fallen", "famous", "farmer", "faster", "finish", "flying", "forest", "forgot"],
    94: ["giving", "golden", "ground", "happen", "inside", "invite", "island", "kicked", "kitten", "laptop"],
    95: ["little", "living", "looked", "loudly", "lovely", "making", "market", "matter", "middle", "minute"],
    96: ["moving", "nature", "nearly", "nobody", "online", "opened", "parent", "parrot", "passed", "picnic"],
    97: ["pirate", "places", "played", "pocket", "police", "pulled", "rabbit", "rained", "riding", "rocket"],
    98: ["sailed", "seeing", "seeing", "shower", "skated", "slowly", "smiled", "sneezed", "snowing", "sorted"],
    99: ["spring", "square", "stairs", "starts", "stayed", "strong", "summer", "supper", "taking", "talked"],
    100: ["tasted", "taught", "thirty", "ticket", "travel", "turned", "twenty", "waited", "walked", "wanted"],
    101: ["washed", "waving", "winter", "worked", "writing", "across", "again", "alien", "angry", "beach"],
    102: ["begin", "below", "black", "blank", "blind", "block", "blood", "board", "bread", "break"],
    103: ["bring", "broad", "brown", "build", "built", "burst", "carry", "catch", "cause", "check"],
    104: ["child", "clean", "clear", "climb", "clock", "close", "cloud", "coast", "count", "cover"],
    105: ["crack", "crash", "crawl", "crazy", "cream", "cross", "crowd", "crown", "cruel", "crush"],
  },
  Flyer: {
    1: ["date", "gate", "lazy", "same", "amazing", "stadium", "trouble", "unhappy", "untidy", "unusual"],
    2: ["deep", "feel", "eagle", "beetle", "creature", "magazine", "weekend", "whisper", "whistle", "winning"],
    3: ["act", "job", "actor", "pilot", "mechanic", "manager", "active", "afraid", "almost", "always"],
    4: ["bank", "club", "corner", "office", "factory", "airport", "baking", "balloon", "banana", "basket"],
    5: ["taxi", "tour", "bridge", "engine", "bicycle", "passenger", "bought", "branch", "bridge", "bright"],
    6: ["card", "game", "chess", "puzzle", "cartoon", "channel", "caught", "center", "cheese", "choose"],
    7: ["art", "math", "study", "score", "college", "student", "cousin", "crying", "dancer", "danger"],
    8: ["fire", "burn", "match", "smoke", "chemist", "medicine", "easily", "eating", "either", "eleven"],
    9: ["air", "wind", "storm", "cloud", "weather", "environment", "faster", "father", "finish", "flower"],
    10: ["dark", "hard", "rough", "heavy", "expensive", "delicious", "golden", "ground", "guitar", "happen"],
    11: ["gold", "ring", "silver", "metal", "necklace", "bracelet", "amazing", "stadium", "lazy", "same"],
    12: ["east", "west", "north", "south", "journey", "everywhere", "creature", "magazine", "eagle", "beetle"],
    13: ["fog", "hill", "pond", "stream", "pyramid", "dinosaur", "mechanic", "manager", "actor", "pilot"],
    14: ["fur", "wild", "camel", "insect", "butterfly", "tortoise", "factory", "airport", "corner", "office"],
    15: ["a.m.", "p.m.", "midday", "minute", "century", "tomorrow", "bicycle", "passenger", "bridge", "engine"],
    16: ["fast", "slow", "early", "ready", "suddenly", "already", "cartoon", "channel", "chess", "puzzle"],
    17: ["camp", "tent", "sleep", "spend", "backpack", "rucksack", "college", "student", "study", "score"],
    18: ["cook", "meal", "spoon", "butter", "biscuit", "chopsticks", "chemist", "medicine", "match", "smoke"],
    19: ["cut", "glue", "paper", "piece", "scissors", "envelope", "weather", "environment", "storm", "cloud"],
    20: ["deep", "high", "empty", "front", "enormous", "excellent", "expensive", "delicious", "rough", "heavy"],
    21: ["far", "near", "above", "across", "anywhere", "straight", "necklace", "bracelet", "silver", "metal"],
    22: ["fall", "drop", "break", "broken", "accident", "ambulance", "journey", "everywhere", "north", "south"],
    23: ["gym", "golf", "catch", "throw", "volleyball", "competition", "pyramid", "dinosaur", "pond", "stream"],
    24: ["half", "bit", "large", "group", "million", "thousand", "butterfly", "tortoise", "camel", "insect"],
    25: ["hope", "wish", "agree", "decide", "believe", "remember", "century", "tomorrow", "midday", "minute"],
    26: ["join", "meet", "invite", "visit", "meeting", "invitation", "suddenly", "already", "early", "ready"],
    27: ["keep", "save", "pocket", "wallet", "business", "businessman", "backpack", "rucksack", "sleep", "spend"],
    28: ["key", "lock", "secret", "clear", "important", "information", "biscuit", "chopsticks", "spoon", "butter"],
    29: ["lie", "rest", "quiet", "tired", "unhappy", "unfriendly", "scissors", "envelope", "paper", "piece"],
    30: ["mix", "stir", "sugar", "taste", "strawberry", "chocolate", "enormous", "excellent", "empty", "front"],
    31: ["news", "word", "speak", "voice", "conversation", "journalist", "anywhere", "straight", "above", "across"],
    32: ["pull", "push", "heavy", "light", "untidy", "unusual", "accident", "ambulance", "break", "broken"],
    33: ["race", "win", "prize", "score", "winner", "champion", "volleyball", "competition", "catch", "throw"],
    34: ["rock", "sand", "desert", "ocean", "planet", "space", "million", "thousand", "large", "group"],
    35: ["sell", "buy", "cheap", "money", "customer", "expensive", "believe", "remember", "agree", "decide"],
    36: ["ski", "snow", "winter", "freeze", "snowboard", "snowball", "meeting", "invitation", "invite", "visit"],
    37: ["soap", "wash", "brush", "clean", "shampoo", "shower", "business", "businessman", "pocket", "wallet"],
    38: ["song", "tune", "singer", "sound", "concert", "instrument", "important", "information", "secret", "clear"],
    39: ["spot", "line", "stripe", "shape", "spotted", "striped", "unhappy", "unfriendly", "quiet", "tired"],
    40: ["step", "walk", "follow", "hurry", "forward", "backward", "strawberry", "chocolate", "sugar", "taste"],
    41: ["swan", "bird", "wing", "feather", "penguin", "ostrich", "conversation", "journalist", "speak", "voice"],
    42: ["team", "club", "member", "join", "together", "everyone", "untidy", "unusual", "heavy", "light"],
    43: ["tidy", "neat", "clean", "clear", "carefully", "perfectly", "winner", "champion", "prize", "score"],
    44: ["toe", "foot", "knee", "elbow", "finger", "shoulder", "planet", "space", "desert", "ocean"],
    45: ["turn", "spin", "round", "circle", "forward", "straight", "customer", "expensive", "cheap", "money"],
    46: ["use", "make", "build", "create", "project", "program", "snowboard", "snowball", "winter", "freeze"],
    47: ["view", "look", "sight", "watch", "photographer", "binoculars", "shampoo", "shower", "brush", "clean"],
    48: ["way", "path", "road", "street", "motorway", "highway", "concert", "instrument", "singer", "sound"],
    49: ["wing", "fly", "flight", "plane", "helicopter", "spaceship", "spotted", "striped", "stripe", "shape"],
    50: ["zero", "math", "count", "number", "fraction", "quarter", "forward", "backward", "follow", "hurry"],
    51: ["ago", "past", "history", "future", "yesterday", "calendar", "penguin", "ostrich", "wing", "feather"],
    52: ["also", "too", "beside", "behind", "opposite", "against", "together", "everyone", "member", "join"],
    53: ["away", "gone", "leave", "arrive", "disappear", "anywhere", "carefully", "perfectly", "clean", "clear"],
    54: ["bad", "poor", "worry", "sorry", "horrible", "terrible", "finger", "shoulder", "knee", "elbow"],
    55: ["bin", "trash", "waste", "clean", "garbage", "rubbish", "forward", "straight", "round", "circle"],
    56: ["boot", "shoe", "glove", "scarf", "uniform", "trainers", "project", "program", "build", "create"],
    57: ["boy", "girl", "adult", "child", "teenager", "married", "photographer", "binoculars", "sight", "watch"],
    58: ["bus", "train", "ticket", "travel", "platform", "railway", "motorway", "highway", "road", "street"],
    59: ["car", "drive", "wheel", "tyre", "traffic", "mechanic", "helicopter", "spaceship", "flight", "plane"],
    60: ["cat", "dog", "pet", "animal", "creature", "puppy", "fraction", "quarter", "count", "number"],
    61: ["city", "town", "village", "place", "capital", "country", "yesterday", "calendar", "history", "future"],
    62: ["cold", "cool", "warm", "hot", "freezing", "boiling", "opposite", "against", "beside", "behind"],
    63: ["cow", "pig", "farm", "field", "tractor", "farmer", "disappear", "anywhere", "leave", "arrive"],
    64: ["cup", "mug", "plate", "bowl", "glass", "saucer", "horrible", "terrible", "worry", "sorry"],
    65: ["dad", "mom", "parent", "family", "husband", "wife", "garbage", "rubbish", "waste", "clean"],
    66: ["day", "week", "month", "year", "century", "decade", "uniform", "trainers", "glove", "scarf"],
    67: ["dog", "pet", "tail", "bark", "friendly", "playful", "teenager", "married", "adult", "child"],
    68: ["door", "gate", "enter", "exit", "entrance", "opening", "platform", "railway", "ticket", "travel"],
    69: ["dry", "wet", "rain", "snow", "weather", "climate", "traffic", "mechanic", "wheel", "tyre"],
    70: ["ear", "eye", "face", "head", "hear", "listen", "creature", "puppy", "animal", "creature"],
    71: ["egg", "food", "bread", "meat", "breakfast", "dinner", "capital", "country", "village", "place"],
    72: ["end", "start", "begin", "finish", "beginning", "completely", "freezing", "boiling", "warm", "hot"],
    73: ["eye", "see", "look", "watch", "glasses", "sunglasses", "tractor", "farmer", "farm", "field"],
    74: ["fly", "bug", "insect", "spider", "butterfly", "mosquito", "glass", "saucer", "plate", "bowl"],
    75: ["fun", "joy", "happy", "glad", "excited", "pleased", "husband", "wife", "family", "parent"],
    76: ["hat", "cap", "coat", "jacket", "sweater", "trousers", "century", "decade", "month", "year"],
    77: ["hit", "kick", "push", "pull", "strike", "punch", "friendly", "playful", "tail", "bark"],
    78: ["hot", "cold", "warm", "cool", "degree", "temperature", "entrance", "opening", "enter", "exit"],
    79: ["ice", "snow", "melt", "freeze", "snowman", "iceberg", "weather", "climate", "rain", "snow"],
    80: ["joy", "fun", "laugh", "smile", "cheerful", "delighted", "hear", "listen", "face", "head"],
    81: ["leg", "arm", "foot", "hand", "body", "stomach", "breakfast", "dinner", "bread", "meat"],
    82: ["map", "plan", "guide", "route", "compass", "direction", "beginning", "completely", "begin", "finish"],
    83: ["net", "web", "catch", "trap", "spider", "network", "glasses", "sunglasses", "look", "watch"],
    84: ["nut", "seed", "plant", "tree", "flower", "blossom", "butterfly", "mosquito", "insect", "spider"],
    85: ["pen", "ink", "write", "draw", "pencil", "crayon", "excited", "pleased", "happy", "glad"],
    86: ["pet", "dog", "cat", "bird", "rabbit", "hamster", "sweater", "trousers", "coat", "jacket"],
    87: ["pie", "cake", "bake", "oven", "pastry", "dessert", "strike", "punch", "push", "pull"],
    88: ["red", "blue", "color", "paint", "yellow", "purple", "degree", "temperature", "warm", "cool"],
    89: ["date", "gate", "lazy", "same", "amazing", "stadium", "snowman", "iceberg", "melt", "freeze"],
    90: ["deep", "feel", "eagle", "beetle", "creature", "magazine", "cheerful", "delighted", "laugh", "smile"],
    91: ["businesswoman", "photographer", "conversation", "environment", "competition", "temperature", "comfortable", "information", "dictionary", "university"],
    92: ["businessman", "strawberry", "dictionary", "basketball", "skateboard", "motorcycle", "helicopter", "completely", "understand", "everything"],
    93: ["sunglasses", "volleyball", "instrument", "invitation", "journalist", "kilometre", "downstairs", "everywhere", "background", "adventure"],
    94: ["toothbrush", "toothpaste", "chocolates", "frightened", "dangerous", "different", "difficult", "excellent", "expensive", "geography"],
    95: ["restaurant", "everywhere", "sometimes", "something", "somewhere", "surprised", "important", "favourite", "beautiful", "delicious"],
    96: ["television", "basketball", "volleyball", "motorcycle", "helicopter", "understand", "everything", "downstairs", "background", "adventure"],
    97: ["umbrella", "language", "tomorrow", "dinosaur", "mechanic", "medicine", "midnight", "necklace", "passenger", "platform"],
    98: ["envelope", "scissors", "shoulder", "straight", "surprise", "thousand", "tomorrow", "friendly", "together", "suddenly"],
    99: ["tortoise", "business", "calendar", "century", "channel", "chemist", "college", "concert", "creature", "cushion"],
    100: ["pyjamas", "biscuit", "autumn", "stomach", "through", "address", "another", "because", "blanket", "brought"],
    101: ["builder", "careful", "carried", "caught", "changed", "chemist", "cleaned", "climbed", "clothes", "cloudy"],
    102: ["thought", "collect", "college", "concert", "cooked", "corner", "country", "crossed", "crowded", "decided"],
    103: ["dessert", "diamond", "dropped", "dressed", "enjoyed", "entered", "excited", "factory", "farming", "feeling"],
    104: ["find out", "finished", "fire station", "followed", "getting", "history", "holiday", "hospital", "hundred", "husband"],
    105: ["instead", "journey", "jumping", "kitchen", "knowing", "laughed", "learned", "leaving", "library", "looking"],
    106: ["luggage", "machine", "manager", "married", "meaning", "meeting", "message", "missing", "mistake", "morning"],
    107: ["nothing", "outside", "painted", "parents", "partner", "perhaps", "volleyball", "playing", "popular", "present"],
    108: ["problem", "program", "promise", "pulling", "pushing", "putting", "quarter", "quietly", "reading", "running"],
    109: ["sailing", "science", "selling", "sending", "showing", "singing", "sitting", "smiling", "snowing", "sounded"],
    110: ["special", "spotted", "started", "station", "stopped", "student", "subject", "talking", "teacher", "telling"],
    111: ["theatre", "thought", "through", "tonight", "tractor", "traffic", "trouble", "unhappy", "untidy", "unusual"],
    112: ["usually", "waiting", "walking", "washing", "weather", "website", "weekend", "whisper", "whistle", "winning"],
    113: ["without", "working", "writing", "yellow", "young", "zebra", "active", "afraid", "almost", "always"],
    114: ["animal", "answer", "around", "asleep", "autumn", "awake", "baking", "balloon", "banana", "basket"],
    115: ["before", "behind", "better", "boring", "bottle", "bottom", "bought", "branch", "bridge", "bright"],
    116: ["broken", "butter", "button", "camera", "called", "castle", "caught", "center", "cheese", "choose"],
    117: ["circle", "clever", "coffee", "colour", "coming", "cooked", "cousin", "crying", "dancer", "danger"],
    118: ["dinner", "doctor", "dollar", "double", "dream", "driven", "easily", "eating", "either", "eleven"],
    119: ["enough", "escape", "fallen", "family", "famous", "farmer", "faster", "father", "finish", "flower"],
    120: ["flying", "forest", "forgot", "friend", "garden", "giving", "golden", "ground", "guitar", "happen"],
  }
};

// --- Data Sanitization Helper ---
const sanitizeString = (str: string) => {
  if (!str) return "";
  // 1. 移除隱形字元 (Zero Width Characters)
  // 2. trim() 只修剪「前後」空白，保留單字中間的空格
  // 3. 轉小寫進行比對
  return str
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .toLowerCase();
};

// Clean the entire word database globally once
Object.keys(wordData).forEach(lvl => {
  Object.keys(wordData[lvl]).forEach(r => {
    const rowNum = Number(r);
    wordData[lvl][rowNum] = wordData[lvl][rowNum].map(sanitizeString);
  });
});

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

  // Hidden Input Ref for Mobile Keyboard
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input helper
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const checkAnswer = useCallback((forcedValue?: string) => {
    if (isLocked) return;
    
    // 優先使用傳入的最新值，否則才用 State
    const finalInput = forcedValue !== undefined ? forcedValue : userInput;
    const normalizedInput = sanitizeString(finalInput);
    const normalizedTarget = sanitizeString(currentWord);
    
    // 打開瀏覽器 F12 看看這兩行輸出，它是抓出錯誤的關鍵
    console.log(`[比對測試] 輸入: "${normalizedInput}" | 目標: "${normalizedTarget}"`);
    
    const isCorrect = normalizedInput === normalizedTarget;
    
    setIsLocked(true);
    setResults(prev => [...prev, {
      word: currentWord,
      isCorrect,
      userInput: finalInput
    }]);

    if (isCorrect) {
      setFeedback({ type: 'correct', msg: "太棒了！答對了 ✨" });
    } else {
      // 不再強制使用 toUpperCase()，依照資料庫原始顯示（通常為小寫）顯示正確答案
      setFeedback({ type: 'wrong', msg: `哎呀，應該是: ${currentWord}` });
    }

    setTimeout(() => {
      handleNextWord();
      // Ensure input stays focused after transition
      setTimeout(focusInput, 50);
    }, 2000);
  }, [userInput, currentWord, isLocked, handleNextWord, focusInput]);

  // --- Keyboard & Input Handling ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    const value = e.target.value;
    
    // 允許英文字母、空格與連字號，並限制輸入長度不得超過單字長度
    if (/^[a-zA-Z\s\-]*$/.test(value) && value.length <= currentWord.length) {
      setUserInput(value);
      
      // 當長度剛好等於目標單字長度時
      if (value.length === currentWord.length && value.length > 0) {
        // 關鍵：直接把 value 傳進去，不要等 State 更新
        checkAnswer(value);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.length > 0) {
      checkAnswer();
    }
  };

  // Auto-focus logic
  useEffect(() => {
    if (view === View.PRACTICE) {
      const timer = setTimeout(focusInput, 300); // Small delay to allow transition
      return () => clearTimeout(timer);
    }
  }, [view, focusInput, currentWordIndex]);

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
      className="max-w-md mx-auto w-full"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border-4 border-brand-blue text-center">
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
    <div 
      className="min-h-screen flex flex-col p-6 cursor-text"
      onClick={focusInput}
    >
      {/* Hidden input to trigger mobile keyboard */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
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
        <div className="bg-brand-blue px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-base text-slate-600 shadow-sm border-2 border-white whitespace-nowrap">
          {level} - Row {row} ( {currentWordIndex + 1} / {currentWordList.length} )
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <motion.div 
          key={currentWordIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white rounded-3xl sm:p-12 p-6 shadow-soft border-4 border-brand-blue relative"
        >
          {/* Hint Section */}
          <div className="mb-8 sm:mb-12 text-center">
            {/* Audio Button - Available in all modes as requested */}
            <button 
              onClick={() => speak(currentWord)}
              className="sm:w-20 sm:h-20 w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-105 active:scale-95 transition-transform shadow-sm border-4 border-white"
            >
              <Volume2 className="text-slate-700 w-8 h-8 sm:w-10 sm:h-10" />
            </button>

            {mode === Mode.TRANSLATION && (
              <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border-2 border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">英文定義</span>
                <p className="text-lg sm:text-xl font-medium text-slate-600 italic">"{wordInfo.definition}"</p>
              </div>
            )}
            {mode === Mode.FILL_BLANK && (
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border-2 border-slate-100 min-h-[100px] flex items-center justify-center">
                <p className="text-lg sm:text-2xl font-bold text-slate-700 leading-relaxed">
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
          <div className="relative mb-12 sm:mb-16 h-20 sm:h-24 flex items-center justify-center gap-1 sm:gap-3 flex-wrap">
            {currentWord.split('').map((char, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-10 sm:h-14 font-black text-2xl sm:text-4xl text-slate-800 min-w-[20px] sm:min-w-[30px] text-center select-none">
                  {userInput[i] || ""}
                </div>
                <div className={`h-1 sm:h-1.5 w-6 sm:w-10 rounded-full transition-all duration-300 ${
                  userInput.length === i 
                    ? "bg-brand-pink w-8 sm:w-12" 
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
        className="max-w-2xl mx-auto w-full"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border-4 border-brand-yellow text-center">
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
                  <div className="flex flex-wrap items-center gap-2">
                    {res.isCorrect ? (
                      <span className="text-xl font-bold text-slate-700">
                        {res.word}
                      </span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-rose-500 line-through opacity-60">
                          {res.userInput || "(空白)"}
                        </span>
                        <ArrowLeft className="text-slate-300 rotate-180" size={16} />
                        <span className="text-xl font-bold text-emerald-600">
                          {res.word}
                        </span>
                      </>
                    )}
                  </div>
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
