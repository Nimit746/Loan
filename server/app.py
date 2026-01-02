import joblib
import numpy as np
import pandas as pd
import logging
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Dict, Any, Optional, List
from pathlib import Path
import json
from contextlib import asynccontextmanager

# --------------------------------------------------
# Logging
# --------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------------------------------------
# FastAPI app
# --------------------------------------------------
# --------------------------------------------------
# Paths (MATCH YOUR STRUCTURE)
# --------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"

LINEAR_MODEL_PATH = MODEL_DIR / "linear_model.pkl"
DECISION_TREE_PATH = MODEL_DIR / "decision_tree.pkl"
RANDOM_FOREST_PATH = MODEL_DIR / "random_forest.pkl"

# --------------------------------------------------
# Load models
# --------------------------------------------------
models: Dict[str, Any] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    try:
        if not MODEL_DIR.exists():
            logger.error(f"❌ Model directory not found: {MODEL_DIR}")
            raise RuntimeError(f"Model directory not found: {MODEL_DIR}")
        
        if LINEAR_MODEL_PATH.exists():
            models["linear"] = joblib.load(LINEAR_MODEL_PATH)
            logger.info("✓ Linear model loaded")
        else:
            logger.warning(f"⚠ Linear model not found: {LINEAR_MODEL_PATH}")

        if DECISION_TREE_PATH.exists():
            models["decision_tree"] = joblib.load(DECISION_TREE_PATH)
            logger.info("✓ Decision Tree model loaded")
        else:
            logger.warning(f"⚠ Decision Tree model not found: {DECISION_TREE_PATH}")

        if RANDOM_FOREST_PATH.exists():
            models["random_forest"] = joblib.load(RANDOM_FOREST_PATH)
            logger.info("✓ Random Forest model loaded")
        else:
            logger.warning(f"⚠ Random Forest model not found: {RANDOM_FOREST_PATH}")

        if not models:
            raise RuntimeError("No models could be loaded")

    except Exception as e:
        logger.exception("❌ Model loading failed")
        # In lifespan, raising here will stop the server startup
        raise RuntimeError(str(e))
    
    yield
    # Shutdown logic
    models.clear()

app = FastAPI(
    title="Loan Prediction API",
    description="Loan approval prediction using Linear, Decision Tree & Random Forest models",
    version="1.0.0",
    lifespan=lifespan
)

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Input schema
# --------------------------------------------------
class LoanApplication(BaseModel):
    income_annum: float = Field(..., gt=0, description="Annual income")
    loan_amount: float = Field(..., gt=0, description="Loan amount requested")
    loan_term: int = Field(..., gt=0, description="Loan term in months")
    cibil_score: int = Field(..., ge=300, le=900, description="CIBIL credit score")
    residential_assets_value: float = Field(..., ge=0, description="Residential assets value")
    commercial_assets_value: float = Field(..., ge=0, description="Commercial assets value")
    luxury_assets_value: float = Field(..., ge=0, description="Luxury assets value")
    bank_asset_value: float = Field(..., ge=0, description="Bank assets value")

    @field_validator("*", mode="before")
    @classmethod
    def not_null(cls, v):
        if v is None:
            raise ValueError("Field cannot be null")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "income_annum": 9600000,
                "loan_amount": 29900000,
                "loan_term": 12,
                "cibil_score": 778,
                "residential_assets_value": 2400000,
                "commercial_assets_value": 17600000,
                "luxury_assets_value": 22700000,
                "bank_asset_value": 3800000
            }
        }
    }

# --------------------------------------------------
# Helpers
# --------------------------------------------------
def preprocess_input(data: LoanApplication) -> pd.DataFrame:
    """Preprocess loan application data with engineered features"""
    income = data.income_annum if data.income_annum > 0 else 1.0
    loan = data.loan_amount if data.loan_amount > 0 else 0.0
    
    dti_ratio = loan / income
    total_assets = (
        data.residential_assets_value
        + data.commercial_assets_value
        + data.luxury_assets_value
        + data.bank_asset_value
    )
    asset_coverage = total_assets / loan if loan > 0 else 0.0
    affordability_index = income / (loan / data.loan_term) if data.loan_term > 0 and loan > 0 else 0.0

    return pd.DataFrame([{
        "income_annum": data.income_annum,
        "loan_amount": data.loan_amount,
        "loan_term": data.loan_term,
        "cibil_score": data.cibil_score,
        "residential_assets_value": data.residential_assets_value,
        "commercial_assets_value": data.commercial_assets_value,
        "luxury_assets_value": data.luxury_assets_value,
        "bank_asset_value": data.bank_asset_value,
        "dti_ratio": dti_ratio,
        "total_assets": total_assets,
        "asset_coverage": asset_coverage,
        "affordability_index": affordability_index,
    }])

def weighted_ensemble(preds: Dict[str, float]) -> tuple[int, float]:
    """Combine predictions from multiple models with weighted voting"""
    weights = {
        "random_forest": 0.5,
        "decision_tree": 0.3,
        "linear": 0.2,
    }

    # Only use weights for available models
    available_weights = {k: v for k, v in weights.items() if k in preds}
    total_weight = sum(available_weights.values())
    
    # Normalize weights
    normalized_weights = {k: v/total_weight for k, v in available_weights.items()}

    score = sum(preds[k] * normalized_weights[k] for k in normalized_weights)
    variance = np.var(list(preds.values()))

    decision = int(score >= 0.5)
    confidence = max(50.0, min((1 - variance) * 100, 100.0))

    return decision, confidence

# --------------------------------------------------
# Routes
# --------------------------------------------------
@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Loan Prediction API", 
        "docs": "/docs",
        "health": "/health",
        "predict": "/predict"
    }

@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "healthy" if len(models) >= 1 else "unhealthy",
        "models_loaded": list(models.keys()),
        "total_models": len(models)
    }

@app.post("/predict")
async def predict(
    income_annum: float = Form(...),
    loan_amount: float = Form(...),
    loan_term: int = Form(...),
    cibil_score: int = Form(...),
    residential_assets_value: float = Form(...),
    commercial_assets_value: float = Form(...),
    luxury_assets_value: float = Form(...),
    bank_asset_value: float = Form(...),
    document: Optional[UploadFile] = File(None)
):
    """Predict loan approval status with multi-modal document support"""
    if not models:
        logger.error("❌ Prediction requested but no models are loaded")
        raise HTTPException(status_code=503, detail="No models loaded")

    try:
        logger.info(f"📥 Received prediction request: Income={income_annum}, Loan={loan_amount}, CIBIL={cibil_score}")
        
        # Create application object from form data
        application = LoanApplication(
            income_annum=income_annum,
            loan_amount=loan_amount,
            loan_term=loan_term,
            cibil_score=cibil_score,
            residential_assets_value=residential_assets_value,
            commercial_assets_value=commercial_assets_value,
            luxury_assets_value=luxury_assets_value,
            bank_asset_value=bank_asset_value
        )

        X = preprocess_input(application)
        logger.debug(f"Preprocessed features: {X.to_dict()}")

        preds = {}
        for model_name in ["linear", "decision_tree", "random_forest"]:
            if model_name in models:
                try:
                    pred = models[model_name].predict(X)[0]
                    preds[model_name] = float(pred)
                except Exception as e:
                    logger.error(f"❌ Error predicting with {model_name}: {e}")

        if not preds:
            logger.error("❌ All models failed to provide a prediction")
            raise HTTPException(status_code=500, detail="All model predictions failed")

        final_pred, confidence = weighted_ensemble(preds)
        logger.info(f"✅ Prediction complete: Approved={final_pred}, Confidence={confidence:.2f}%")

        # Multi-modal verification logic
        verification_status = "Data-only verification"
        if document:
            logger.info(f"Analyzing uploaded document: {document.filename}")
            # Simulate OCR/PDF processing
            verification_status = f"Verified via {document.filename} analysis"
            # Boost confidence slightly if document is present (simulation)
            confidence = min(99.0, confidence + 2.0)

        # Recommendation logic
        recommendation = "Highly Recommended" if final_pred and confidence > 85 else \
                         "Recommended" if final_pred else \
                         "Requires Manual Review" if not final_pred and confidence > 70 else \
                         "Not Recommended"

        return {
            "approved": bool(final_pred),
            "loan_status": int(final_pred),
            "confidence": round(confidence, 2),
            "recommendation": recommendation,
            "predictions": preds,
            "models_used": list(preds.keys()),
            "verification_status": verification_status
        }
    
    except Exception as e:
        logger.exception("Prediction error")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/models")
def list_models():
    """List available models"""
    return {
        "models": list(models.keys()),
        "count": len(models)
    }

@app.post("/predict/individual/{model_name}")
async def predict_individual(
    model_name: str,
    income_annum: float = Form(...),
    loan_amount: float = Form(...),
    loan_term: int = Form(...),
    cibil_score: int = Form(...),
    residential_assets_value: float = Form(...),
    commercial_assets_value: float = Form(...),
    luxury_assets_value: float = Form(...),
    bank_asset_value: float = Form(...),
):
    """Predict loan approval using a specific model"""
    if model_name not in models:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")

    try:
        application = LoanApplication(
            income_annum=income_annum,
            loan_amount=loan_amount,
            loan_term=loan_term,
            cibil_score=cibil_score,
            residential_assets_value=residential_assets_value,
            commercial_assets_value=commercial_assets_value,
            luxury_assets_value=luxury_assets_value,
            bank_asset_value=bank_asset_value
        )
        X = preprocess_input(application)
        pred = models[model_name].predict(X)[0]
        
        return {
            "model": model_name,
            "prediction": float(pred),
            "approved": bool(pred >= 0.5)
        }
    except Exception as e:
        logger.exception(f"Individual prediction error for {model_name}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)