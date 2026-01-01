# LoanAI - Advanced Neural Prediction Platform

A premium, full-stack financial technology platform that leverages multiple machine learning models to predict loan approval probabilities. Featuring a futuristic UI with 3D interactions, multi-modal document verification, and real-time risk analysis.

## 🚀 Features

### 🧠 Intelligent Core
- **Multi-Model Ensemble**: Combines Random Forest (50%), Decision Tree (30%), and Linear Models (20%) for robust predictions.
- **Multi-Modal Verification**: Support for PDF and Image uploads with simulated AI document verification.
- **Real-time Analytics**: Dynamic risk matrix calculation and confidence scoring.
- **Detailed Asset Allocation**: Visual breakdown of residential, commercial, luxury, and bank assets.

### ✨ Visual Experience
- **Futuristic UI**: Glassmorphic design with deep space aesthetics and high-fidelity gradients.
- **Interactive 3D Elements**: 3D geometric cubes with mouse-follow physics and repulsion effects.
- **Canvas Particle Engine**: High-performance background system with noise-based motion and interactive repulsion.
- **Micro-animations**: Smooth staggered reveals, hover transitions, and progress indicators using Framer Motion.

## 🛠 Tech Stack

**Frontend:**
- React 19 (Vite)
- Tailwind CSS (Vanilla CSS + Utility classes)
- Framer Motion (Advanced Animations)
- Three.js / React Three Fiber (3D Elements)
- Canvas API (Particles)
- Axios (API Communication)

**Backend:**
- FastAPI (Python)
- Scikit-learn (ML Models)
- Pandas & NumPy (Data Processing)
- Pydantic (Schema Validation)
- Uvicorn (ASGI Server)

## 📦 Installation

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd server
pip install -r requirements.txt
python app.py
```

## 📂 Project Structure

```
Loan/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI & Section components
│   │   ├── pages/       # Page layouts (Predict, Dashboard, etc.)
│   │   └── hooks/       # Custom animation & interaction hooks
├── server/              # FastAPI Backend
│   ├── app.py           # Core API & ML Ensemble logic
│   ├── model/           # Trained .pkl models
│   └── training/        # ML training scripts
└── package.json         # Root scripts for concurrent execution
```

## 📜 Authors
- **Nimit Gupta** - *Lead Developer*

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
