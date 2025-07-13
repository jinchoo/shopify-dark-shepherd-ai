from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
import json

router = APIRouter()

@router.post("/analyze")
async def analyze_fraud_potential(data: dict):
    """Analyze data for fraud potential using ML models"""
    try:
        # Mock ML analysis
        risk_score = calculate_risk_score(data)
        fraud_probability = calculate_fraud_probability(data)
        
        analysis = {
            "risk_score": round(risk_score, 3),
            "fraud_probability": round(fraud_probability, 3),
            "risk_level": get_risk_level(risk_score),
            "fraud_type": predict_fraud_type(data),
            "confidence": round(random.uniform(0.7, 0.95), 3),
            "factors": analyze_risk_factors(data),
            "recommendation": get_recommendation(risk_score, fraud_probability),
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models/status")
async def get_ml_models_status():
    """Get status of ML models"""
    return {
        "success": True,
        "data": {
            "fraud_detection_model": {
                "status": "active",
                "version": "1.2.0",
                "accuracy": round(random.uniform(0.85, 0.95), 3),
                "last_updated": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                "training_samples": random.randint(10000, 100000)
            },
            "risk_assessment_model": {
                "status": "active",
                "version": "1.1.5",
                "accuracy": round(random.uniform(0.80, 0.90), 3),
                "last_updated": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                "training_samples": random.randint(8000, 80000)
            },
            "pattern_recognition_model": {
                "status": "active",
                "version": "1.0.8",
                "accuracy": round(random.uniform(0.75, 0.85), 3),
                "last_updated": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                "training_samples": random.randint(5000, 50000)
            }
        }
    }

@router.get("/patterns/{pattern_type}")
async def get_fraud_patterns(pattern_type: str):
    """Get specific fraud patterns"""
    patterns = {
        "payment": [
            {
                "pattern": "multiple_payment_methods",
                "description": "Customer uses multiple payment methods in short time",
                "risk_level": "high",
                "frequency": random.randint(10, 50)
            },
            {
                "pattern": "declined_payments",
                "description": "Multiple payment declines followed by successful payment",
                "risk_level": "medium",
                "frequency": random.randint(20, 80)
            }
        ],
        "behavioral": [
            {
                "pattern": "rapid_ordering",
                "description": "Multiple orders placed in very short time intervals",
                "risk_level": "high",
                "frequency": random.randint(5, 25)
            },
            {
                "pattern": "unusual_timing",
                "description": "Orders placed at unusual hours",
                "risk_level": "medium",
                "frequency": random.randint(15, 45)
            }
        ],
        "geographic": [
            {
                "pattern": "multiple_addresses",
                "description": "Customer uses multiple shipping addresses",
                "risk_level": "high",
                "frequency": random.randint(8, 30)
            },
            {
                "pattern": "international_shipping",
                "description": "High-value orders shipped internationally",
                "risk_level": "medium",
                "frequency": random.randint(12, 40)
            }
        ]
    }
    
    return {
        "success": True,
        "data": {
            "pattern_type": pattern_type,
            "patterns": patterns.get(pattern_type, []),
            "total_patterns": len(patterns.get(pattern_type, []))
        }
    }

@router.post("/train")
async def train_ml_models():
    """Trigger ML model training"""
    # Mock training process
    training_results = {
        "fraud_detection_model": {
            "status": "training",
            "progress": 0,
            "estimated_completion": (datetime.now() + timedelta(hours=2)).isoformat(),
            "new_accuracy": round(random.uniform(0.88, 0.96), 3)
        },
        "risk_assessment_model": {
            "status": "training",
            "progress": 0,
            "estimated_completion": (datetime.now() + timedelta(hours=1.5)).isoformat(),
            "new_accuracy": round(random.uniform(0.82, 0.92), 3)
        }
    }
    
    return {
        "success": True,
        "message": "ML model training initiated",
        "data": training_results
    }

def calculate_risk_score(data: dict) -> float:
    """Calculate risk score based on input data"""
    base_score = 0.5
    
    # Mock risk factors
    if data.get("order_value", 0) > 1000:
        base_score += 0.2
    if data.get("new_customer", False):
        base_score += 0.15
    if data.get("international_shipping", False):
        base_score += 0.1
    if data.get("multiple_payment_methods", False):
        base_score += 0.2
    
    return min(1.0, base_score + random.uniform(-0.1, 0.1))

def calculate_fraud_probability(data: dict) -> float:
    """Calculate fraud probability using ML model"""
    # Mock ML prediction
    base_prob = 0.1
    
    risk_factors = [
        data.get("high_value", False),
        data.get("new_customer", False),
        data.get("unusual_timing", False),
        data.get("multiple_addresses", False)
    ]
    
    for factor in risk_factors:
        if factor:
            base_prob += 0.15
    
    return min(1.0, base_prob + random.uniform(-0.05, 0.05))

def get_risk_level(risk_score: float) -> str:
    """Get risk level based on score"""
    if risk_score > 0.7:
        return "high"
    elif risk_score > 0.3:
        return "medium"
    else:
        return "low"

def predict_fraud_type(data: dict) -> str:
    """Predict type of fraud"""
    fraud_types = [
        "payment_fraud",
        "account_takeover",
        "friendly_fraud",
        "identity_theft",
        "none"
    ]
    
    # Mock prediction logic
    if data.get("high_value", False):
        return "payment_fraud"
    elif data.get("new_customer", False):
        return "account_takeover"
    else:
        return random.choice(fraud_types)

def analyze_risk_factors(data: dict) -> list:
    """Analyze and return risk factors"""
    factors = []
    
    if data.get("high_value", False):
        factors.append("high_order_value")
    if data.get("new_customer", False):
        factors.append("new_customer_account")
    if data.get("unusual_timing", False):
        factors.append("unusual_order_timing")
    if data.get("multiple_addresses", False):
        factors.append("multiple_shipping_addresses")
    if data.get("international_shipping", False):
        factors.append("international_shipping")
    
    return factors

def get_recommendation(risk_score: float, fraud_probability: float) -> str:
    """Get recommendation based on risk and fraud probability"""
    if risk_score > 0.8 or fraud_probability > 0.7:
        return "block"
    elif risk_score > 0.5 or fraud_probability > 0.4:
        return "review"
    else:
        return "allow" 