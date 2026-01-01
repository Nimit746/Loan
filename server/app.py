import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Loan Prediction API",
    description="ML-powered loan approval prediction using ensemble of Linear Regression, Decision Tree, and Random Forest",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
LINEAR_MODEL_PATH = os.path.join(MODEL_DIR, "linear.pkl")
DECISION_TREE_PATH = os.path.join(MODEL_DIR, "decision.pkl")
RANDOM_FOREST_PATH = os.path.join(MODEL_DIR, "randomforest.pkl")

# Load models on startup
models = {}

@app.on_event("startup")
async def load_models():
    """Load all ML models on application startup"""
    try:
        models['linear'] = joblib.load(LINEAR_MODEL_PATH)
        logger.info("✓ Linear Regression model loaded successfully")
        
        models['decision_tree'] = joblib.load(DECISION_TREE_PATH)
        logger.info("✓ Decision Tree model loaded successfully")
        
        models['random_forest'] = joblib.load(RANDOM_FOREST_PATH)
        logger.info("✓ Random Forest model loaded successfully")
        
        logger.info("All models loaded successfully!")
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        raise


# Pydantic models for request/response validation
class LoanApplication(BaseModel):
    """
    Loan application input data
    Based on the preprocessed features from your dataset
    """
    income_annum: float = Field(..., gt=0, description="Annual income")
    loan_amount: float = Field(..., gt=0, description="Loan amount requested")
    loan_term: int = Field(..., gt=0, description="Loan term in months")
    cibil_score: int = Field(..., ge=300, le=900, description="CIBIL credit score")
    residential_assets_value: float = Field(..., ge=0, description="Value of residential assets")
    commercial_assets_value: float = Field(..., ge=0, description="Value of commercial assets")
    luxury_assets_value: float = Field(..., ge=0, description="Value of luxury assets")
    bank_asset_value: float = Field(..., ge=0, description="Bank asset value")
    
    @validator('*', pre=True)
    def check_not_null(cls, v):
        if v is None:
            raise ValueError('Field cannot be null')
        return v
    
    class Config:
        schema_extra = {
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


class PredictionResponse(BaseModel):
    """Response model for loan prediction"""
    approved: bool
    confidence: float
    loan_status: float
    predictions: Dict[str, float]
    ensemble_method: str
    recommendation: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    models_loaded: List[str]
    total_models: int


def preprocess_input(data: LoanApplication):
    """
    Preprocess input data to match training data format
    Adds engineered features: dti_ratio, total_assets, asset_coverage, affordability_index
    Returns: pandas DataFrame with proper column names (eliminates sklearn warnings)
    """
    # Calculate engineered features (same as preprocessing.py)
    dti_ratio = data.loan_amount / data.income_annum
    total_assets = (data.residential_assets_value + 
                   data.commercial_assets_value + 
                   data.luxury_assets_value + 
                   data.bank_asset_value)
    asset_coverage = total_assets / data.loan_amount if data.loan_amount > 0 else 0
    affordability_index = data.income_annum / (data.loan_amount / data.loan_term) if data.loan_term > 0 else 0
    
    # Create DataFrame with proper column names (matches training data)
    # This eliminates sklearn warnings about missing feature names
    features_dict = {
        'income_annum': data.income_annum,
        'loan_amount': data.loan_amount,
        'loan_term': data.loan_term,
        'cibil_score': data.cibil_score,
        'residential_assets_value': data.residential_assets_value,
        'commercial_assets_value': data.commercial_assets_value,
        'luxury_assets_value': data.luxury_assets_value,
        'bank_asset_value': data.bank_asset_value,
        'dti_ratio': dti_ratio,
        'total_assets': total_assets,
        'asset_coverage': asset_coverage,
        'affordability_index': affordability_index
    }
    
    features_df = pd.DataFrame([features_dict])
    return features_df


def weighted_ensemble_prediction(predictions: Dict[str, float]) -> tuple:
    """
    Weighted ensemble method for combining predictions
    Random Forest > Decision Tree > Linear Regression
    
    Returns: (final_prediction, confidence_score)
    """
    # Weights based on typical model performance
    # Random Forest usually performs best, followed by Decision Tree, then Linear Regression
    weights = {
        'random_forest': 0.5,     # 50% weight
        'decision_tree': 0.3,     # 30% weight
        'linear': 0.2             # 20% weight
    }
    
    # Calculate weighted average
    weighted_sum = sum(predictions[model] * weight for model, weight in weights.items())
    
    # Calculate confidence based on agreement
    # If all models agree, confidence is high
    pred_values = list(predictions.values())
    variance = np.var(pred_values)
    
    # Convert to binary decision (threshold 0.5)
    final_prediction = 1 if weighted_sum >= 0.5 else 0
    
    # Confidence calculation: lower variance = higher confidence
    confidence = 1 - min(variance, 1.0)
    confidence = max(0.5, min(confidence * 100, 100))  # Scale to 50-100%
    
    return final_prediction, confidence


@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "Loan Prediction API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify models are loaded"""
    loaded_models = list(models.keys())
    return {
        "status": "healthy" if len(loaded_models) == 3 else "degraded",
        "models_loaded": loaded_models,
        "total_models": len(loaded_models)
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_loan(application: LoanApplication):
    """
    Predict loan approval using ensemble of three ML models
    
    Uses weighted ensemble approach:
    - Random Forest: 50% weight
    - Decision Tree: 30% weight  
    - Linear Regression: 20% weight
    """
    try:
        # Validate models are loaded
        if len(models) != 3:
            raise HTTPException(
                status_code=503, 
                detail=f"Not all models are loaded. Loaded: {list(models.keys())}"
            )
        
        # Preprocess input
        features = preprocess_input(application)
        
        # Get predictions from all models
        predictions = {}
        predictions['linear'] = float(models['linear'].predict(features)[0])
        predictions['decision_tree'] = float(models['decision_tree'].predict(features)[0])
        predictions['random_forest'] = float(models['random_forest'].predict(features)[0])
        
        # Apply weighted ensemble
        final_prediction, confidence = weighted_ensemble_prediction(predictions)
        
        # Generate recommendation
        if final_prediction == 1:
            if confidence >= 80:
                recommendation = "Strongly recommended for approval - High confidence across all models"
            elif confidence >= 65:
                recommendation = "Recommended for approval - Good confidence"
            else:
                recommendation = "Recommended for approval - Consider manual review"
        else:
            if confidence >= 80:
                recommendation = "Not recommended for approval - High confidence rejection"
            elif confidence >= 65:
                recommendation = "Not recommended for approval - Consider alternative terms"
            else:
                recommendation = "Borderline case - Manual review strongly recommended"
        
        return {
            "approved": bool(final_prediction),
            "confidence": round(confidence, 2),
            "loan_status": float(final_prediction),
            "predictions": {
                "linear_regression": round(predictions['linear'], 4),
                "decision_tree": round(predictions['decision_tree'], 4),
                "random_forest": round(predictions['random_forest'], 4)
            },
            "ensemble_method": "weighted_average",
            "recommendation": recommendation
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/individual/{model_name}")
async def predict_individual_model(model_name: str, application: LoanApplication):
    """
    Get prediction from a specific model
    Available models: linear, decision_tree, random_forest
    """
    if model_name not in models:
        raise HTTPException(
            status_code=404,
            detail=f"Model '{model_name}' not found. Available: {list(models.keys())}"
        )
    
    try:
        features = preprocess_input(application)
        prediction = float(models[model_name].predict(features)[0])
        
        return {
            "model": model_name,
            "prediction": round(prediction, 4),
            "approved": bool(prediction >= 0.5)
        }
    except Exception as e:
        logger.error(f"Prediction error for {model_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/models")
async def list_models():
    """List all available models and their status"""
    return {
        "models": [
            {
                "name": "linear",
                "full_name": "Linear Regression",
                "weight": 0.2,
                "status": "loaded" if "linear" in models else "not_loaded"
            },
            {
                "name": "decision_tree",
                "full_name": "Decision Tree",
                "weight": 0.3,
                "status": "loaded" if "decision_tree" in models else "not_loaded"
            },
            {
                "name": "random_forest",
                "full_name": "Random Forest",
                "weight": 0.5,
                "status": "loaded" if "random_forest" in models else "not_loaded"
            }
        ],
        "ensemble_method": "weighted_average"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
