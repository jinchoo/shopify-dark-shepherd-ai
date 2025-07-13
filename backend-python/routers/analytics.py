from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
import json

router = APIRouter()

@router.get("/overview")
async def get_analytics_overview(period: str = "30d"):
    """Get analytics overview for the specified period"""
    # Generate mock analytics data
    days = 30 if period == "30d" else 7 if period == "7d" else 90
    
    return {
        "success": True,
        "data": {
            "period": period,
            "total_orders": random.randint(100, 1000),
            "total_revenue": round(random.uniform(10000, 100000), 2),
            "average_order_value": round(random.uniform(50, 200), 2),
            "fraud_rate": round(random.uniform(0.01, 0.05), 4),
            "blocked_orders": random.randint(5, 50),
            "suspicious_activity": random.randint(10, 100),
            "security_score": round(random.uniform(0.7, 0.95), 3),
            "trends": {
                "orders_trend": generate_trend_data(days),
                "revenue_trend": generate_trend_data(days),
                "fraud_trend": generate_trend_data(days)
            }
        }
    }

@router.get("/fraud-trends")
async def get_fraud_trends(period: str = "30d"):
    """Get fraud detection trends"""
    days = 30 if period == "30d" else 7 if period == "7d" else 90
    
    return {
        "success": True,
        "data": {
            "period": period,
            "total_fraud_attempts": random.randint(20, 100),
            "successful_fraud": random.randint(5, 25),
            "blocked_fraud": random.randint(15, 75),
            "fraud_types": {
                "payment_fraud": random.randint(10, 40),
                "account_takeover": random.randint(5, 20),
                "friendly_fraud": random.randint(3, 15),
                "identity_theft": random.randint(2, 10)
            },
            "daily_trends": generate_daily_fraud_trends(days),
            "risk_distribution": {
                "low_risk": random.randint(60, 80),
                "medium_risk": random.randint(15, 30),
                "high_risk": random.randint(5, 15)
            }
        }
    }

@router.get("/customer-insights")
async def get_customer_insights(limit: int = 100):
    """Get customer behavior insights"""
    customers = []
    
    for i in range(min(limit, 100)):
        customer = {
            "customer_id": f"customer_{i+1}",
            "risk_score": round(random.uniform(0, 1), 3),
            "total_orders": random.randint(1, 50),
            "total_spent": round(random.uniform(50, 5000), 2),
            "last_order": (datetime.now() - timedelta(days=random.randint(1, 90))).isoformat(),
            "suspicious_orders": random.randint(0, 3),
            "payment_methods": random.randint(1, 3),
            "shipping_addresses": random.randint(1, 2),
            "account_age_days": random.randint(1, 365)
        }
        customers.append(customer)
    
    return {
        "success": True,
        "data": {
            "customers": customers,
            "insights": {
                "high_risk_customers": len([c for c in customers if c["risk_score"] > 0.7]),
                "new_customers": len([c for c in customers if c["account_age_days"] < 30]),
                "repeat_customers": len([c for c in customers if c["total_orders"] > 5]),
                "average_risk_score": round(sum(c["risk_score"] for c in customers) / len(customers), 3)
            }
        }
    }

@router.get("/order-patterns")
async def get_order_patterns(period: str = "30d"):
    """Get order pattern analysis"""
    days = 30 if period == "30d" else 7 if period == "7d" else 90
    
    return {
        "success": True,
        "data": {
            "period": period,
            "total_orders": random.randint(100, 1000),
            "patterns": {
                "time_distribution": {
                    "morning": random.randint(20, 40),
                    "afternoon": random.randint(30, 50),
                    "evening": random.randint(20, 40),
                    "night": random.randint(5, 20)
                },
                "day_distribution": {
                    "monday": random.randint(10, 20),
                    "tuesday": random.randint(10, 20),
                    "wednesday": random.randint(10, 20),
                    "thursday": random.randint(10, 20),
                    "friday": random.randint(15, 25),
                    "saturday": random.randint(15, 25),
                    "sunday": random.randint(10, 20)
                },
                "value_distribution": {
                    "low_value": random.randint(40, 60),
                    "medium_value": random.randint(25, 40),
                    "high_value": random.randint(10, 25)
                }
            },
            "suspicious_patterns": {
                "rapid_orders": random.randint(5, 20),
                "high_value_orders": random.randint(3, 15),
                "multiple_addresses": random.randint(2, 10),
                "unusual_timing": random.randint(1, 8)
            }
        }
    }

def generate_trend_data(days: int):
    """Generate mock trend data"""
    trend = []
    base_value = random.uniform(10, 100)
    
    for i in range(days):
        value = base_value + random.uniform(-10, 10)
        trend.append({
            "date": (datetime.now() - timedelta(days=days-i-1)).strftime("%Y-%m-%d"),
            "value": round(max(0, value), 2)
        })
    
    return trend

def generate_daily_fraud_trends(days: int):
    """Generate mock daily fraud trends"""
    trends = []
    
    for i in range(days):
        trends.append({
            "date": (datetime.now() - timedelta(days=days-i-1)).strftime("%Y-%m-%d"),
            "fraud_attempts": random.randint(0, 10),
            "blocked": random.randint(0, 8),
            "successful": random.randint(0, 3)
        })
    
    return trends 