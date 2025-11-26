# 🇩🇪 ↔️ ਪੰਜਾਬੀ Deutsch-Punjabi Translation & Learning App

A comprehensive bidirectional German-Punjabi translation application with integrated language learning features, audio pronunciation, and spaced repetition system.

## ✨ Features

### 🔄 Translation
- **Bidirectional Translation**: Seamless translation between German and Punjabi (Gurmukhi script)
- **Romanization**: Automatic transliteration of Punjabi text to Latin script
- **Real-time Translation**: Live translation as you type with intelligent debouncing
- **Audio Pronunciation**: Text-to-speech for both languages using OpenAI TTS

### 📚 Vocabulary Learning
- **25+ Vocabulary Items**: Organized across 5 categories
  - Basics (Grundlagen)
  - Greetings (Begrüßungen)
  - Numbers (Zahlen)
  - Family (Familie)
  - Food (Essen)
- **Example Sentences**: Each word includes contextual examples in both languages
- **Difficulty Levels**: Beginner, Intermediate, and Advanced classifications
- **Audio Support**: Hear correct pronunciation for each vocabulary item

### 🎯 Spaced Repetition Learning
- **SM-2 Algorithm**: Scientifically-proven spaced repetition system
- **Smart Scheduling**: Cards appear at optimal intervals for retention
- **Progress Tracking**: Monitor your learning statistics
  - Cards reviewed
  - Accuracy percentage
  - Learning streaks
  - Total words learned
- **Quality Ratings**: 4-level review system (Wrong, Hard, Good, Easy)
- **Flashcard Sessions**: Interactive learning sessions with 20 cards each

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- OpenAI API Key

### Setup

1. **Set your OpenAI API Key**:
   - Click on the "Secrets" tab in Replit
   - Add a new secret: `OPENAI_API_KEY` with your API key value

2. **The application will automatically start** with two workflows:
   - **Backend API** (port 8000): FastAPI server
   - **Frontend** (port 5000): Vue.js application

3. **Access the application**:
   - Click the "Webview" button to open the app
   - The frontend will automatically connect to the backend

## 🏗️ Architecture

### Backend (Python FastAPI)
```
backend/
├── app/
│   ├── main.py              # FastAPI application & endpoints
│   ├── api/                 # (reserved for future modular routes)
│   ├── services/
│   │   ├── translator.py    # OpenAI translation service
│   │   ├── tts_service.py   # Text-to-speech service
│   │   └── spaced_repetition.py  # SM-2 learning algorithm
│   ├── models/
│   │   └── vocabulary.py    # Pydantic models
│   └── data/
│       ├── vocabulary_data.py    # Vocabulary database
│       └── user_progress.json    # Learning progress (auto-generated)
└── requirements.txt
```

### Frontend (Vue 3 + Vite)
```
frontend/
├── src/
│   ├── App.vue              # Main application component
│   ├── components/
│   │   ├── TranslatorPanel.vue   # Translation interface
│   │   ├── FlashcardSystem.vue   # Vocabulary browser
│   │   └── LearningModule.vue    # Spaced repetition system
│   ├── stores/
│   │   └── appStore.js      # Pinia state management
│   ├── services/
│   │   └── api.js           # Backend API client
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

## 🔌 API Endpoints

### Translation
- `POST /api/v1/translate` - Translate text
- `POST /api/v1/tts` - Generate speech audio

### Vocabulary
- `GET /api/v1/vocabulary/categories` - List all categories
- `GET /api/v1/vocabulary` - Get vocabulary items (filterable by category)
- `GET /api/v1/vocabulary/{id}` - Get specific vocabulary item

### Learning
- `GET /api/v1/learn/daily-cards/{user_id}` - Get due flashcards
- `POST /api/v1/learn/review` - Submit flashcard review
- `GET /api/v1/learn/progress/{user_id}` - Get learning statistics
- `GET /api/v1/learn/start/{user_id}` - Initialize learning session

## 🎨 User Interface

### 1. Translator Tab
- Side-by-side input/output panels
- Language swap button
- Audio playback buttons for pronunciation
- Real-time translation as you type

### 2. Vokabeln (Vocabulary) Tab
- Category filter buttons
- Grid view of vocabulary cards
- Difficulty badges
- Example sentences in both languages
- Audio pronunciation buttons

### 3. Lernen (Learning) Tab
- Progress dashboard with statistics
- Interactive flashcard sessions
- 4-level quality rating system
- Session completion tracking

## 🧠 Spaced Repetition Algorithm

The app uses the **SuperMemo 2 (SM-2)** algorithm:

1. **New Cards**: Start with 1-day interval
2. **Review Schedule**: 1 → 3 → 7 → 14 → 30 → 60+ days
3. **Ease Factor**: Adjusts based on performance (minimum 1.3)
4. **Quality Ratings**:
   - 0-2: Reset to beginning
   - 3: Correct with difficulty
   - 4: Correct with ease
   - 5: Perfect recall

## 🌐 Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI API** - GPT-4o-mini for translation, TTS-1 for audio
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Axios** - HTTP client

## 📝 Adding More Vocabulary

To add more vocabulary items, edit `backend/app/data/vocabulary_data.py`:

```python
{
    "id": "unique_id",
    "german": "German word",
    "punjabi": "ਪੰਜਾਬੀ ਸ਼ਬਦ",
    "punjabi_romanized": "Romanized version",
    "category": "category_name",
    "difficulty": "beginner|intermediate|advanced",
    "example_de": "German example sentence",
    "example_pa": "ਪੰਜਾਬੀ ਉਦਾਹਰਨ ਵਾਕ"
}
```

## 🔧 Configuration

### Backend Configuration
- **Host**: 0.0.0.0
- **Port**: 8000
- **CORS**: Enabled for all origins
- **OpenAI Model**: gpt-4o-mini (translation), tts-1 (audio)

### Frontend Configuration
- **Host**: 0.0.0.0
- **Port**: 5000
- **API Base URL**: Auto-detected based on environment

## 📊 Progress Tracking

User progress is stored in `backend/app/data/user_progress.json`:
- Cards reviewed count
- Correct answers
- Accuracy percentage
- Learning streak days
- Individual card statistics (interval, ease factor, next review date)

## 🎯 Future Enhancements

Potential features for future development:
- Speech-to-text for pronunciation practice
- More vocabulary categories (business, travel, emotions)
- User authentication and multi-user support
- Offline mode with cached data
- Mobile app version
- Progress export/import
- Custom vocabulary lists
- Achievement system and gamification

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 🙏 Acknowledgments

- OpenAI for providing translation and TTS capabilities
- The Vue.js and FastAPI communities
- Punjabi language resources and Gurmukhi script support

---

**Note**: Make sure to set your `OPENAI_API_KEY` in the Secrets tab before using translation and audio features.
use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

const checklist = [
  { id: "auth", label: "Supabase Auth funktioniert" },
  { id: "rls", label: "Row Level Security aktiv" },
  { id: "profiles", label: "Profiles Tabelle korrekt" },
  { id: "quests", label: "Quests Tabelle korrekt" },
  { id: "daily-api", label: "/api/daily-quests gibt 3 Quests zurück" },
  { id: "complete-api", label: "/api/complete-quest aktualisiert XP & Streak" },
  { id: "encrypt", label: "PGP-Verschlüsselung aktiv" },
  { id: "frontend", label: "Daily Quests rendern im Frontend" },
  { id: "streak", label: "Streak oben rechts wird angezeigt" },
  { id: "xp", label: "XP-Bar animiert korrekt" },
  { id: "translate", label: "/api/translate funktioniert" },
  { id: "env", label: ".env Keys vollständig" },
  { id: "deployment", label: "Vercel Deployment OK" },
];

export default function GoLiveAdminPage() {
  const [status, setStatus] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setStatus((s) => ({ ...s, [id]: !s[id] }));

  const allCompleted = Object.keys(status).length === checklist.length &&
                       Object.values(status).every(Boolean);

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">Go-Live Dashboard</h1>

      <div className="space-y-3">
        {checklist.map((item) => {
          const done = status[item.id];
          return (
            <div
              key={item.id}
              className={clsx(
                "flex items-center justify-between p-4 rounded-md cursor-pointer",
                done ? "bg-green-700" : "bg-gray-800"
              )}
              onClick={() => toggle(item.id)}
            >
              <span className="text-lg">{item.label}</span>
              {done ? (
                <CheckCircle className="text-green-300" />
              ) : (
                <XCircle className="text-red-300" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-md text-center text-xl font-bold 
        bg-gray-900 border border-gray-700">
        {allCompleted ? (
          <span className="text-green-400">🔥 PunjabiQuest ist bereit für den Go-Live!</span>
        ) : (
          <span className="text-yellow-400">🔍 