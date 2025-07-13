from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
import json

router = APIRouter()

# Mock data storage (replace with database)
security_alerts = []
fraud_analyses = {}

@router.get("/alerts")
async def get_security_alerts():
    """Get recent security alerts"""
    # Generate mock alerts
    if not security_alerts:
        generate_mock_alerts()
    
    return {
        "success": True,
        "data": {
            "alerts": security_alerts[-10:],  # Last 10 alerts
            "total": len(security_alerts),
            "critical": len([a for a in security_alerts if a["severity"] == "critical"]),
            "high": len([a for a in security_alerts if a["severity"] == "high"]),
            "medium": len([a for a in security_alerts if a["severity"] == "medium"])
        }
    }

@router.get("/dashboard")
async def get_security_dashboard():
    """Get security dashboard data"""
    # Generate mock dashboard data
    return {
        "success": True,
        "data": {
            "total_alerts": random.randint(50, 200),
            "fraud_attempts": random.randint(10, 50),
            "blocked_orders": random.randint(5, 25),
            "suspicious_customers": random.randint(20, 80),
            "security_score": random.uniform(0.7, 0.95),
            "recent_activity": [
                {
                    "type": "fraud_detected",
                    "message": "High-risk order detected",
                    "timestamp": datetime.now().isoformat(),
                    "severity": "high"
                },
                {
                    "type": "suspicious_login",
                    "message": "Multiple failed login attempts",
                    "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
                    "severity": "medium"
                },
                {
                    "type": "unusual_activity",
                    "message": "Unusual order pattern detected",
                    "timestamp": (datetime.now() - timedelta(hours=4)).isoformat(),
                    "severity": "low"
                }
            ]
        }
    }

@router.get("/fraud/order/{order_id}")
async def get_fraud_analysis(order_id: str):
    """Get fraud analysis for specific order"""
    # Generate mock fraud analysis
    risk_score = random.uniform(0, 1)
    is_suspicious = risk_score > 0.7
    
    analysis = {
        "order_id": order_id,
        "risk_score": round(risk_score, 3),
        "is_suspicious": is_suspicious,
        "risk_level": "high" if risk_score > 0.7 else "medium" if risk_score > 0.3 else "low",
        "factors": generate_risk_factors(),
        "recommendation": "block" if is_suspicious else "allow",
        "timestamp": datetime.now().isoformat()
    }
    
    fraud_analyses[order_id] = analysis
    
    return {
        "success": True,
        "data": analysis
    }

@router.get("/risk/customer/{customer_id}")
async def get_customer_risk(customer_id: str):
    """Get risk assessment for specific customer"""
    # Generate mock risk assessment
    risk_score = random.uniform(0, 1)
    risk_level = "high" if risk_score > 0.7 else "medium" if risk_score > 0.3 else "low"
    
    assessment = {
        "customer_id": customer_id,
        "risk_score": round(risk_score, 3),
        "risk_level": risk_level,
        "risk_factors": generate_customer_risk_factors(),
        "order_history": {
            "total_orders": random.randint(1, 50),
            "suspicious_orders": random.randint(0, 5),
            "total_spent": random.uniform(100, 10000),
            "average_order_value": random.uniform(50, 500)
        },
        "recommendation": "monitor" if risk_level == "high" else "normal",
        "timestamp": datetime.now().isoformat()
    }
    
    return {
        "success": True,
        "data": assessment
    }

def generate_mock_alerts():
    """Generate mock security alerts"""
    alert_types = [
        "fraud_detected",
        "suspicious_login",
        "unusual_activity",
        "multiple_failed_attempts",
        "high_value_order",
        "new_device_login"
    ]
    
    severities = ["low", "medium", "high", "critical"]
    
    for i in range(50):
        alert = {
            "id": f"alert_{i+1}",
            "type": random.choice(alert_types),
            "severity": random.choice(severities),
            "message": f"Security alert #{i+1}",
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 168))).isoformat(),
            "resolved": random.choice([True, False])
        }
        security_alerts.append(alert)

def generate_risk_factors():
    """Generate mock risk factors for orders"""
    factors = [
        "high_value_order",
        "new_customer",
        "unusual_shipping_address",
        "multiple_payment_methods",
        "rapid_order_placement",
        "international_shipping"
    ]
    
    return random.sample(factors, random.randint(1, 4))

def generate_customer_risk_factors():
    """Generate mock risk factors for customers"""
    factors = [
        "new_account",
        "multiple_addresses",
        "high_order_frequency",
        "payment_declines",
        "suspicious_ip",
        "unusual_browsing_pattern"
    ]
    
    return random.sample(factors, random.randint(1, 3)) 