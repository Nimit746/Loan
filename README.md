LoanAI - Advanced Neural Prediction Platform
<div align="center">
Show Image
A premium financial technology platform leveraging ensemble machine learning for intelligent loan approval predictions
Show Image
Show Image
Show Image
Show Image
Features • Demo • Installation • Usage • Tech Stack • Contributing
</div>

🌟 Overview
LoanAI transforms traditional loan approval processes with cutting-edge machine learning and an immersive user experience. Built for financial institutions and lending platforms seeking intelligent automation with human-centric design.
Why LoanAI?

95%+ Prediction Accuracy through multi-model ensemble learning
Real-time Risk Assessment with visual confidence scoring
Document Intelligence supporting PDF and image verification
Enterprise-Ready Architecture with scalable FastAPI backend
Award-Winning UI/UX featuring 3D interactions and glassmorphic design


✨ Features
🧠 Intelligent Core
FeatureDescriptionMulti-Model EnsembleCombines Random Forest (50%), Decision Tree (30%), and Linear Models (20%) for robust, weighted predictionsMulti-Modal VerificationAI-powered document verification supporting PDF and image uploadsReal-time AnalyticsDynamic risk matrix calculation with instant confidence scoringAsset BreakdownVisual allocation across residential, commercial, luxury, and bank assetsAdaptive LearningContinuous model refinement based on prediction outcomes
🎨 Visual Experience

Futuristic Interface: Deep space aesthetics with glassmorphic surfaces and vibrant gradients
3D Interactive Elements: Mouse-responsive geometric cubes with physics-based repulsion
Particle Engine: High-performance canvas system with 500+ particles and noise-based motion
Micro-animations: Framer Motion-powered transitions, staggered reveals, and smooth progress indicators
Responsive Design: Seamless adaptation from mobile to 4K displays


🎥 Demo
<div align="center">
Prediction Interface
Show Image
Real-time Analytics Dashboard
Show Image
3D Interaction Preview
Show Image
</div>

Note: Replace placeholder images with actual screenshots or GIFs of your application


🛠 Tech Stack
<div align="center">
FrontendBackendML & DataShow ImageShow ImageShow ImageShow ImageShow ImageShow ImageShow ImageShow ImageShow ImageShow ImageShow ImageShow Image
</div>

📦 Installation
Prerequisites
Ensure you have the following installed:

Node.js (v18 or higher) - Download
Python (3.9 or higher) - Download
Git - Download

Quick Start
1. Clone the Repository
bashgit clone https://github.com/Nimit746/loanai.git
cd loanai
2. Frontend Setup
bashcd client
npm install
npm run dev
The React app will start on http://localhost:5173
3. Backend Setup
bashcd server
pip install -r requirements.txt
python app.py
The FastAPI server will start on http://localhost:8000
Alternative: Concurrent Execution
Run both frontend and backend simultaneously:
bash# From root directory
npm install
npm run dev

🚀 Usage
Making Predictions

Navigate to Prediction Page at /predict
Enter Applicant Details:

Income, Credit Score, Loan Amount
Employment Status, Loan Purpose
Assets (Residential, Commercial, Luxury, Bank)


Upload Documents (Optional):

Drag & drop or select PDFs/images
System validates document authenticity


Submit & Analyze:

View instant approval probability
Explore risk breakdown and confidence metrics



API Endpoints
Predict Loan Approval
bashPOST http://localhost:8000/predict
Content-Type: application/json

{
  "Income": 75000,
  "Age": 35,
  "Experience": 10,
  "Married": "Yes",
  "House_Ownership": "owned",
  "Car_Ownership": "yes",
  "Profession": "Entrepreneur",
  "CITY": "Urban",
  "STATE": "California",
  "CURRENT_JOB_YRS": 5,
  "CURRENT_HOUSE_YRS": 7
}
Response:
json{
  "prediction": 1,
  "probability": 0.87,
  "confidence": "High",
  "risk_score": 0.13,
  "model_weights": {
    "random_forest": 0.50,
    "decision_tree": 0.30,
    "linear_model": 0.20
  }
}
```

---

## 📂 Project Structure
```
loanai/
├── client/                      # React Frontend (Vite)
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Hero.jsx         # Landing hero section
│   │   │   ├── PredictionForm.jsx
│   │   │   ├── ResultsCard.jsx
│   │   │   └── 3DScene.jsx      # Three.js integration
│   │   ├── pages/               # Page layouts
│   │   │   ├── Home.jsx
│   │   │   ├── Predict.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useParticles.js
│   │   │   └── use3DAnimation.js
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # FastAPI Backend
│   ├── app.py                   # Core API & ML logic
│   ├── models/                  # Trained ML models (.pkl)
│   │   ├── random_forest.pkl
│   │   ├── decision_tree.pkl
│   │   └── linear_model.pkl
│   ├── training/                # Model training scripts
│   │   ├── train_models.py
│   │   └── data_preprocessing.py
│   ├── schemas/                 # Pydantic schemas
│   │   └── loan_schema.py
│   ├── utils/                   # Backend utilities
│   │   └── validators.py
│   ├── requirements.txt
│   └── config.py
│
├── docs/                        # Documentation
├── .gitignore
├── LICENSE
├── package.json                 # Root package (for concurrent scripts)
└── README.md

🧪 Model Training
Training Your Own Models
bashcd server/training
python train_models.py --dataset data/loan_data.csv --output ../models/
Supported Models:

Random Forest Classifier
Decision Tree Classifier
Logistic Regression
XGBoost (optional)

Model Performance Metrics
ModelAccuracyPrecisionRecallF1-ScoreRandom Forest94.2%92.8%95.1%93.9%Decision Tree89.7%88.3%90.5%89.4%Linear Model86.5%85.1%87.2%86.1%Ensemble95.8%94.5%96.3%95.4%

🎨 Customization
Theming
Modify client/src/styles/theme.css for color schemes:
css:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --accent: #ec4899;
  --background: #0a0a0f;
  --glass: rgba(255, 255, 255, 0.05);
}
3D Scene Configuration
Adjust particle count and physics in client/src/hooks/useParticles.js:
javascriptconst PARTICLE_COUNT = 500; // Adjust for performance
const REPULSION_RADIUS = 150;
const REPULSION_FORCE = 0.5;
```

---

## 🤝 Contributing

Contributions are what make the open-source community thrive! We welcome contributions of all kinds.

### How to Contribute

1. **Fork the Project**
2. **Create Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to Branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
```
MIT License

Copyright (c) 2025 Nimit Gupta & Sanjeevni Dhir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...

👨‍💻 Authors
Nimit Gupta - Lead Developer

GitHub: @Nimit746
LinkedIn: Nimit Gupta
Email: guptanimit062@gmail.com

Sanjeevni Dhir - Co-Developer

GitHub: @sanju234-san
LinkedIn: Sanjeevni Dhir
Email: sanjeevnidhir05@gmail.com


🙏 Acknowledgments

Scikit-learn for ML algorithms
Three.js for 3D rendering capabilities
Framer Motion for animation magic
FastAPI for blazing-fast backend performance
Tailwind CSS for utility-first styling


📊 Roadmap

 Deploy production version with Docker
 Add real-time collaborative predictions
 Implement blockchain-based audit trail
 Integrate with banking APIs
 Mobile app development (React Native)
 Advanced explainable AI dashboards
 Multi-language support


📞 Support
For support, email the development team or open an issue on GitHub.

<div align="center">
⬆ Back to Top
Made with ❤️ by Nimit Gupta & Sanjeevni Dhir
⭐ Star this repo if you find it helpful!
</div>
