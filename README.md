
# 🛒 Shopify Dark Shepherd AI



[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![AI Powered](https://img.shields.io/badge/AI-GPT%204-blue)](#)

> **Shopify Dark Shepherd AI** is an AI-powered assistant designed to help small and mid-sized Shopify merchants automate customer support, track sales insights, and manage inventory—without the need for enterprise infrastructure or pricing.

---

## 🚀 Features

- 🤖 GPT-based AI chatbot trained for e-commerce use cases
- 🔍 Query order status, sales performance, and product data
- 📦 Inventory and low-stock alerts
- 🧾 FAQ & return policy auto-replies
- 🐳 Dockerized backend & frontend for local or cloud deployment
- 💡 Dual backend support (Node.js + Python)
- 🔐 Environment-ready for OAuth & Shopify API keys

---

## 🧠 How It Works

1. **Frontend** – React + Tailwind UI for user interface
2. **Backend** – Python (Flask/FastAPI) or Node.js to process requests
3. **AI Engine** – Uses OpenAI GPT (or local LLM) to interpret questions
4. **Data** – Connects to Shopify via REST Admin API (coming soon)

---

## 📁 Project Structure

```bash
.
├── backend/             # Node.js backend server
├── backend-python/      # Python AI backend (Flask or FastAPI)
├── public/              # Static frontend assets
├── src/                 # React frontend components
├── docker-compose.yml   # Dev container orchestration
├── Dockerfile           # Backend container config
├── start_both.sh        # Helper script to run frontend/backend
└── .env.example         # Environment variables template
````

---

## 🛠️ Setup & Installation

### 🐳 Run with Docker (Recommended)

```bash
git clone https://github.com/jinchoo/shopify-dark-shepherd-ai.git
cd shopify-dark-shepherd-ai
cp .env.example .env
docker-compose up --build
```

> 💡 You can also run `./start_both.sh` to spin up both services.

### ⚙️ Run Without Docker

Install frontend:

```bash
cd src
npm install
npm run dev
```

Install Python backend:

```bash
cd backend-python
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🔐 Environment Setup

Here’s a sample `.env.example` file:

```env
OPENAI_API_KEY=sk-xxxxxx
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_STORE=my-shop-name
SHOPIFY_ACCESS_TOKEN=your_access_token
PORT=3000
```

Update `.env` with your real keys.

---

## 💡 Example Use Cases

| Scenario                | Example Prompt                               |
| ----------------------- | -------------------------------------------- |
| Order Tracking          | "Where is order #1234?"                      |
| Product Performance     | "What are the best-selling items this week?" |
| Inventory Status        | "Which items have fewer than 10 units?"      |
| Return Policy Questions | "What’s your return window?"                 |

---

## 🧩 Tech Stack

* **Frontend**: React, Tailwind CSS
* **Backend**: Node.js OR Python (FastAPI or Flask)
* **AI Model**: OpenAI GPT API (customizable for local LLM)
* **Data Layer**: Shopify Admin REST API (planned)
* **Infrastructure**: Docker, Docker Compose

---

## 🧪 Testing (Coming Soon)

* [ ] Frontend unit testing (Jest)
* [ ] Backend API testing (pytest / supertest)
* [ ] End-to-end integration test
* [ ] Shopify webhook simulations

---

## 🛤 Roadmap

* [x] Frontend + Docker support
* [ ] Shopify OAuth integration
* [ ] Admin dashboard for store owners
* [ ] AI memory and session context
* [ ] Chat UI with real-time updates

---

## 🖼️ Screenshots / Diagrams

> Add your UI screenshots or flowcharts in `/docs` and link them here.

![placeholder](https://via.placeholder.com/800x400.png?text=Chatbot+UI+Demo)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions welcome! Please open an issue or pull request.

> Planned: `CONTRIBUTING.md` with style guide and API contracts.

---

## 📬 Contact

**Author:** [Jin Choo](https://github.com/jinchoo)<br>
📧 Email: [jinchoo315@gmail.com](mailto:jinchoo315@gmail.com)<br>
🌐 Site: [DarkShepherd.ai](https://darkshepherd.ai) *(coming soon)*

---

## 🧭 Architecture Overview

> *(Replace this with a diagram in `/docs` folder if you create one)*

```text
[Frontend: React + Tailwind]
         |
         v
[Backend: Node.js OR Python (FastAPI)]
         |
         v
[AI: OpenAI GPT API]
         |
         v
[Data Layer: Shopify API]
```