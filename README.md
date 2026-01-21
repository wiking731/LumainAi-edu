# ⚖️ AdvoAI — O'zbekiston Huquqiy Super-App

<div align="center">

![AdvoAI Logo](https://img.shields.io/badge/AdvoAI-Legal_Super_App-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDN2MTgiLz48cGF0aCBkPSJNNSA2aDMiLz48cGF0aCBkPSJNMTYgNmgzIi8+PHBhdGggZD0iTTEyIDZjLTQgMC01IDMtNSA2czEgNiA1IDYgNS0zIDUtNi0xLTYtNS02eiIvPjwvc3ZnPg==)

**O'zbekiston uchun AI-asosida huquqiy yordamchi**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Groq AI](https://img.shields.io/badge/Groq-Llama_3.3-orange?style=flat-square)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Demo](http://localhost:3000) • [Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack)

</div>

---

## 🎯 About

**AdvoAI** is a comprehensive legal super-app for Uzbekistan, combining AI-powered legal assistance with a professional marketplace. Built for the hackathon, it provides citizens with accessible legal guidance in Uzbek and Russian.

## ✨ Features

### 🤖 AI Chat Modes
| Mode | Description |
|------|-------------|
| **⚖️ Legal Chat** | General legal advice with Uzbek law citations |
| **💰 Imtiyoz (T-3)** | Find business subsidies and tax benefits |
| **📝 Shartnoma** | Contract analysis with risk assessment |
| **🔍 Blind Sign** | ToS/Privacy Policy scanner for hidden traps |

### 📱 Key Pages
- **`/`** — Chat-first landing with Google-style search
- **`/marketplace`** — Browse lawyers & accountants
- **`/marketplace/[id]`** — Professional profiles with click-to-call
- **`/partners/register`** — Partner registration form
- **`/admin/scout`** — Law scanning demo (secret page)

### 🎨 UI/UX Highlights
- **9-dot App Launcher** — Quick access to all tools
- **Smart Cards** — Beautiful JSON response rendering
- **Auto-expanding Input** — ChatGPT-style textarea
- **Mobile Responsive** — Works on all devices
- **Bilingual** — Full Uzbek & Russian support

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **Groq AI** | Llama 3.3-70B for fast inference |
| **React 19** | UI components |
| **Vanilla CSS** | Custom Glassmorphism design system |
| **React Markdown** | AI response formatting |

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/T6rabek/advoai.git
cd advoai

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create `.env.local` in the root directory:

```env
# Required: Get from https://console.groq.com/keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# Optional: Google Gemini (alternative)
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Chat-first landing
│   ├── marketplace/         # Partner directory
│   ├── partners/register/   # Registration form
│   ├── admin/scout/         # Scout demo
│   └── api/
│       ├── analyze/         # AI chat endpoint
│       ├── partners/        # Partners CRUD
│       └── scout/trigger/   # Scout mock
├── components/
│   ├── Navbar.js            # Global navigation
│   ├── AppLauncher.js       # 9-dot menu
│   ├── ChatHero.js          # Landing search
│   └── SmartCard.js         # JSON renderer
├── data/
│   ├── privileges.json      # T-3 subsidies
│   ├── lawyers.json         # Partner data
│   └── scout_logs.json      # Scout logs
└── lib/
    ├── groq.js              # Groq client
    └── prompts/             # AI system prompts
```

## 🌐 Languages

| Language | Status |
|----------|--------|
| 🇺🇿 O'zbek (Lotin) | ✅ Full Support |
| 🇷🇺 Русский | ✅ Full Support |

## 📸 Screenshots

| Landing | Marketplace |
|---------|-------------|
| Chat-first design | Partner directory |

## 🔮 Roadmap

- [ ] User authentication
- [ ] Real partner database
- [ ] RAG with Uzbek law corpus
- [ ] Mobile app (React Native)
- [ ] Payment integration

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**⚠️ Disclaimer**

*AdvoAI yuridik maslahatchi emas. Jiddiy holatlarda advokatga murojaat qiling.*

*AdvoAI не является юридическим консультантом. В серьёзных случаях обратитесь к адвокату.*

---

Made with ❤️ for Uzbekistan Hackathon 2026

</div>
