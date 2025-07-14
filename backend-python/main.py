from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import random
import json
from pydantic import BaseModel, ValidationError, EmailStr
from fastapi import HTTPException
from typing import List, Optional, Dict, Any
from enum import Enum

# Import routers
from routers import security, analytics, fraud

load_dotenv()

# Configure CORS
app = FastAPI(
    title="🛡️ DarkShepherd.ai Security API",
    description="""
    ## 🔒 DarkShepherd.ai - Advanced Security & Fraud Detection for Shopify
    
    This API provides comprehensive security monitoring, fraud detection, and analytics for Shopify stores.
    Built with cutting-edge machine learning and real-time threat analysis.
    
    ### 🚀 Features:
    - **Real-time Fraud Detection** - ML-powered order analysis
    - **Customer Risk Assessment** - Behavioral analysis and scoring
    - **Security Alerts** - Proactive threat monitoring
    - **Analytics Dashboard** - Comprehensive reporting and insights
    - **Pattern Recognition** - Advanced fraud pattern detection
    - **User Management** - Role-based access control
    - **Store Management** - Multi-store support
    - **Reports & Analytics** - Detailed insights and metrics
    - **Notifications** - Real-time alert system
    - **Settings & Configuration** - Customizable security rules
    
    ### 🔧 Quick Start:
    1. Test the health endpoint: `/health`
    2. View security alerts: `/security/alerts`
    3. Get fraud analysis: `/security/fraud/order/{order_id}`
    4. Check analytics: `/analytics/overview`
    5. Manage users: `/users`
    6. Configure stores: `/stores`
    
    ---
    *DarkShepherd.ai • Built with FastAPI • Powered by ML • Securing Shopify*
    """,
    version="1.0.0",
    contact={
        "name": "DarkShepherd.ai",
        "email": "security@darkshepherd.ai",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs-dark",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    swagger_ui_parameters={
        "defaultModelsExpandDepth": 1,
        "defaultModelExpandDepth": 1,
        "displayRequestDuration": True,
        "docExpansion": "list",
        "filter": True,
        "showExtensions": True,
        "showCommonExtensions": True,
        "tryItOutEnabled": True,
        "syntaxHighlight.theme": "monokai",
    },
    custom_css="""
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; }
        
        /* Main background - matches home page gradient */
        body { 
            background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #0f172a 100%) !important; 
            color: #ffffff !important; 
            font-family: 'Inter', sans-serif !important; 
            min-height: 100vh !important;
        }
        
        /* Topbar - matches home page dark theme */
        .swagger-ui .topbar { 
            background: #1f2937 !important; 
            border-bottom: 2px solid #4ade80 !important; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Main wrapper - matches home page card styling */
        .swagger-ui .wrapper { 
            background: rgba(31, 41, 55, 0.8) !important; 
            border: 1px solid #374151 !important; 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; 
            backdrop-filter: blur(10px) !important;
        }
        
        /* Sidebar - matches home page dark theme */
        .swagger-ui .sidebar { 
            background: #111827 !important; 
            border-right: 1px solid #374151 !important;
        }
        
        /* Operation blocks - matches home page card styling */
        .swagger-ui .opblock { 
            border: 1px solid #374151 !important; 
            background: rgba(31, 41, 55, 0.5) !important; 
            border-radius: 12px !important; 
            margin-bottom: 16px !important;
            backdrop-filter: blur(10px) !important;
        }
        
        .swagger-ui .opblock .opblock-summary { 
            background: #111827 !important; 
            border-radius: 12px 12px 0 0 !important;
        }
        
        /* Execute button - matches home page green gradient */
        .swagger-ui .btn.execute { 
            background: linear-gradient(to right, #16a34a, #4ade80) !important; 
            color: #ffffff !important; 
            font-weight: 600 !important; 
            border-radius: 8px !important; 
            border: none !important;
            padding: 8px 16px !important;
            transition: all 0.3s ease !important;
        }
        
        .swagger-ui .btn.execute:hover { 
            background: linear-gradient(to right, #15803d, #16a34a) !important; 
            transform: translateY(-2px) !important; 
            box-shadow: 0 8px 25px rgba(74, 222, 128, 0.4) !important; 
        }
        
        /* Response areas */
        .swagger-ui .responses-wrapper { 
            background: rgba(31, 41, 55, 0.8) !important; 
            border: 1px solid #374151 !important; 
            border-radius: 0 0 12px 12px !important;
        }
        
        .swagger-ui .model { 
            background: rgba(31, 41, 55, 0.8) !important; 
            border: 1px solid #374151 !important; 
            border-radius: 8px !important;
        }
        
        /* Headers and titles */
        .swagger-ui .opblock-tag-section h3 { 
            color: #ffffff !important; 
            font-weight: 700 !important; 
            font-size: 1.5rem !important;
        }
        
        /* Sidebar navigation */
        .swagger-ui .sidebar .sidebar-list li a { 
            color: #d1d5db !important; 
            font-weight: 500 !important; 
            padding: 8px 12px !important;
            border-radius: 6px !important;
            transition: all 0.3s ease !important;
        }
        
        .swagger-ui .sidebar .sidebar-list li a:hover { 
            background: #4ade80 !important; 
            color: #ffffff !important; 
            transform: translateX(4px) !important;
        }
        
        /* Operation descriptions */
        .swagger-ui .opblock-summary-description { 
            color: #d1d5db !important; 
            font-weight: 500 !important; 
        }
        
        .swagger-ui .opblock-summary-method { 
            font-weight: 700 !important; 
            font-size: 0.875rem !important; 
            border-radius: 6px !important;
        }
        
        /* Tables */
        .swagger-ui .responses-table th { 
            background: #111827 !important; 
            color: #ffffff !important; 
            font-weight: 600 !important; 
        }
        
        /* Model titles */
        .swagger-ui .model-title { 
            color: #ffffff !important; 
            font-weight: 600 !important; 
        }
        
        /* Control icons - green accent */
        .swagger-ui .opblock-summary-control svg, 
        .swagger-ui .opblock-summary-control svg path, 
        .swagger-ui .opblock-summary-control > svg, 
        .swagger-ui .opblock-summary-control > svg > path { 
            fill: #4ade80 !important; 
            stroke: #4ade80 !important; 
            color: #4ade80 !important; 
            filter: drop-shadow(0 0 4px #4ade80) !important; 
        }
        
        .swagger-ui .opblock-summary-control { 
            color: #4ade80 !important; 
        }
        
        .swagger-ui .opblock-summary-control svg, 
        .swagger-ui .opblock-summary-control svg path { 
            color: #4ade80 !important; 
            fill: #4ade80 !important; 
            stroke: #4ade80 !important; 
            filter: drop-shadow(0 0 4px #4ade80) !important; 
        }
        
        .swagger-ui .opblock-summary-control svg { 
            filter: invert(40%) sepia(100%) saturate(1000%) hue-rotate(120deg) brightness(1.2) !important; 
        }
        
        .swagger-ui .arrow { 
            fill: #4ade80 !important; 
            color: #4ade80 !important; 
            stroke: #4ade80 !important; 
        }
        
        /* Model boxes */
        .swagger-ui .model-title, 
        .swagger-ui .model-title span, 
        .swagger-ui .model-box, 
        .swagger-ui .model-box *, 
        .swagger-ui .models-control, 
        .swagger-ui .models-control label, 
        .swagger-ui .models-control label span { 
            color: #ffffff !important; 
        }
        
        /* Additional styling for better consistency */
        .swagger-ui .info .title { 
            color: #4ade80 !important; 
            font-weight: 700 !important; 
        }
        
        .swagger-ui .info .description { 
            color: #d1d5db !important; 
        }
        
        .swagger-ui .scheme-container { 
            background: rgba(31, 41, 55, 0.8) !important; 
            border: 1px solid #374151 !important; 
            border-radius: 8px !important;
        }
        
        .swagger-ui .auth-wrapper { 
            background: rgba(31, 41, 55, 0.8) !important; 
            border: 1px solid #374151 !important; 
            border-radius: 8px !important;
        }
        
        /* Input fields */
        .swagger-ui input[type=text], 
        .swagger-ui textarea { 
            background: #111827 !important; 
            border: 1px solid #374151 !important; 
            color: #ffffff !important; 
            border-radius: 6px !important;
        }
        
        .swagger-ui input[type=text]:focus, 
        .swagger-ui textarea:focus { 
            border-color: #4ade80 !important; 
            box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2) !important;
        }
    """
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# ============================================================================
# ENUMS
# ============================================================================

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    ANALYST = "analyst"
    VIEWER = "viewer"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertType(str, Enum):
    FRAUD = "fraud"
    SECURITY = "security"
    SYSTEM = "system"
    PERFORMANCE = "performance"

class StoreStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    MAINTENANCE = "maintenance"

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class OrderData(BaseModel):
    order_id: str
    order_data: dict

class CustomerData(BaseModel):
    customer_id: str
    customer_data: dict

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    role: UserRole
    store_ids: Optional[List[str]] = []

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    store_ids: Optional[List[str]] = None
    is_active: Optional[bool] = None

class StoreCreate(BaseModel):
    name: str
    shopify_domain: str
    api_key: str
    webhook_secret: str

class StoreUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[StoreStatus] = None
    settings: Optional[Dict[str, Any]] = None

class AlertCreate(BaseModel):
    type: AlertType
    title: str
    message: str
    severity: RiskLevel
    store_id: Optional[str] = None

class ReportRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    store_ids: Optional[List[str]] = None
    report_type: str

class NotificationSettings(BaseModel):
    email_enabled: bool = True
    webhook_enabled: bool = False
    webhook_url: Optional[str] = None
    alert_types: List[AlertType] = [AlertType.FRAUD, AlertType.SECURITY]

# Validation models for schema generation
class HTTPValidationError(BaseModel):
    detail: List[dict]

class ValidationError(BaseModel):
    loc: List[str]
    msg: str
    type: str

class ErrorResponse(BaseModel):
    detail: str

class SuccessResponse(BaseModel):
    success: bool
    message: str

# ============================================================================
# CUSTOM DOCS ENDPOINT
# ============================================================================

@app.get("/docs-custom", response_class=HTMLResponse)
async def custom_docs():
    """Custom dark-themed API documentation"""
    html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🛡️ DarkShepherd.ai - API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; 
            }
            
            /* Main background - matches home page gradient exactly */
            body { 
                background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #0f172a 100%) !important; 
                color: #ffffff !important; 
                font-family: 'Inter', sans-serif !important; 
                min-height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Topbar - matches home page dark theme */
            .swagger-ui .topbar { 
                background: #111827 !important; 
                border-bottom: 2px solid #4ade80 !important; 
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Main wrapper - matches home page card styling */
            .swagger-ui .wrapper { 
                background: rgba(17, 24, 39, 0.5) !important; 
                border: 1px solid #374151 !important; 
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; 
                backdrop-filter: blur(10px) !important;
            }
            
            /* Sidebar - matches home page dark theme */
            .swagger-ui .sidebar { 
                background: #111827 !important; 
                border-right: 1px solid #374151 !important;
            }
            
            /* Operation blocks - matches home page card styling */
            .swagger-ui .opblock { 
                border: 1px solid #374151 !important; 
                background: rgba(17, 24, 39, 0.5) !important; 
                border-radius: 12px !important; 
                margin-bottom: 16px !important;
                backdrop-filter: blur(10px) !important;
            }
            
            .swagger-ui .opblock .opblock-summary { 
                background: #111827 !important; 
                border-radius: 12px 12px 0 0 !important;
            }
            
            /* Execute button - matches home page green gradient */
            .swagger-ui .btn.execute { 
                background: linear-gradient(to right, #16a34a, #4ade80) !important; 
                color: #ffffff !important; 
                font-weight: 600 !important; 
                border-radius: 8px !important; 
                border: none !important;
                padding: 8px 16px !important;
                transition: all 0.3s ease !important;
            }
            
            .swagger-ui .btn.execute:hover { 
                background: linear-gradient(to right, #15803d, #16a34a) !important; 
                transform: translateY(-2px) !important; 
                box-shadow: 0 8px 25px rgba(74, 222, 128, 0.4) !important; 
            }
            
            /* Response areas */
            .swagger-ui .responses-wrapper { 
                background: rgba(17, 24, 39, 0.5) !important; 
                border: 1px solid #374151 !important; 
                border-radius: 0 0 12px 12px !important;
            }
            
            .swagger-ui .model { 
                background: rgba(17, 24, 39, 0.5) !important; 
                border: 1px solid #374151 !important; 
                border-radius: 8px !important;
            }
            
            /* Headers and titles */
            .swagger-ui .opblock-tag-section h3 { 
                color: #ffffff !important; 
                font-weight: 700 !important; 
                font-size: 1.5rem !important;
            }
            
            /* Sidebar navigation */
            .swagger-ui .sidebar .sidebar-list li a { 
                color: #d1d5db !important; 
                font-weight: 500 !important; 
                padding: 8px 12px !important;
                border-radius: 6px !important;
                transition: all 0.3s ease !important;
            }
            
            .swagger-ui .sidebar .sidebar-list li a:hover { 
                background: #4ade80 !important; 
                color: #ffffff !important; 
                transform: translateX(4px) !important;
            }
            
            /* Operation descriptions */
            .swagger-ui .opblock-summary-description { 
                color: #d1d5db !important; 
                font-weight: 500 !important; 
            }
            
            .swagger-ui .opblock-summary-method { 
                font-weight: 700 !important; 
                font-size: 0.875rem !important; 
                border-radius: 6px !important;
            }
            
            /* Tables */
            .swagger-ui .responses-table th { 
                background: #111827 !important; 
                color: #ffffff !important; 
                font-weight: 600 !important; 
            }
            
            /* Model titles */
            .swagger-ui .model-title { 
                color: #ffffff !important; 
                font-weight: 600 !important; 
            }
            
            /* Control icons - green accent */
            .swagger-ui .opblock-summary-control svg, 
            .swagger-ui .opblock-summary-control svg path, 
            .swagger-ui .opblock-summary-control > svg, 
            .swagger-ui .opblock-summary-control > svg > path { 
                fill: #4ade80 !important; 
                stroke: #4ade80 !important; 
                color: #4ade80 !important; 
                filter: drop-shadow(0 0 4px #4ade80) !important; 
            }
            
            .swagger-ui .opblock-summary-control { 
                color: #4ade80 !important; 
            }
            
            .swagger-ui .opblock-summary-control svg, 
            .swagger-ui .opblock-summary-control svg path { 
                color: #4ade80 !important; 
                fill: #4ade80 !important; 
                stroke: #4ade80 !important; 
                filter: drop-shadow(0 0 4px #4ade80) !important; 
            }
            
            .swagger-ui .opblock-summary-control svg { 
                filter: invert(40%) sepia(100%) saturate(1000%) hue-rotate(120deg) brightness(1.2) !important; 
            }
            
            .swagger-ui .arrow { 
                fill: #4ade80 !important; 
                color: #4ade80 !important; 
                stroke: #4ade80 !important; 
            }
            
            /* Model boxes */
            .swagger-ui .model-title, 
            .swagger-ui .model-title span, 
            .swagger-ui .model-box, 
            .swagger-ui .model-box *, 
            .swagger-ui .models-control, 
            .swagger-ui .models-control label, 
            .swagger-ui .models-control label span { 
                color: #ffffff !important; 
            }
            
            /* Additional styling for better consistency */
            .swagger-ui .info .title { 
                color: #4ade80 !important; 
                font-weight: 700 !important; 
            }
            
            .swagger-ui .info .description { 
                color: #d1d5db !important; 
            }
            
            .swagger-ui .scheme-container { 
                background: rgba(17, 24, 39, 0.5) !important; 
                border: 1px solid #374151 !important; 
                border-radius: 8px !important;
            }
            
            /* Override any remaining light elements */
            .swagger-ui * { 
                color: inherit !important; 
            }
            
            .swagger-ui input, 
            .swagger-ui textarea, 
            .swagger-ui select { 
                background: #111827 !important; 
                border: 1px solid #374151 !important; 
                color: #ffffff !important; 
            }
            
            /* Ensure all text is visible */
            .swagger-ui .opblock-summary-path, 
            .swagger-ui .opblock-summary-path__deprecated { 
                color: #ffffff !important; 
            }
            
            .swagger-ui .opblock-summary-method { 
                color: #ffffff !important; 
            }
            
            /* Fix any remaining background issues */
            .swagger-ui .opblock-summary { 
                background: #111827 !important; 
            }
            
            .swagger-ui .opblock-summary-description { 
                color: #d1d5db !important; 
            }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function() {
                const ui = SwaggerUIBundle({
                    url: '/openapi.json',
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "StandaloneLayout",
                    docExpansion: 'list',
                    defaultModelsExpandDepth: 1,
                    defaultModelExpandDepth: 1,
                    displayRequestDuration: true,
                    filter: true,
                    showExtensions: true,
                    showCommonExtensions: true,
                    tryItOutEnabled: true,
                    requestInterceptor: function(request) {
                        return request;
                    },
                    responseInterceptor: function(response) {
                        return response;
                    }
                });
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html)

# ============================================================================
# HEALTH & SYSTEM
# ============================================================================

@app.get("/health", tags=["System"])
async def health_check():
    """Check API health status"""
    return {
        "status": "healthy",
        "service": "shopify-security-python",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/system/status", tags=["System"])
async def system_status():
    """Get detailed system status"""
    return {
        "status": "operational",
        "uptime": "99.9%",
        "last_maintenance": "2024-01-15T00:00:00Z",
        "next_maintenance": "2024-02-15T00:00:00Z",
        "active_stores": 150,
        "active_users": 25,
        "alerts_today": 12
    }

# ============================================================================
# USER MANAGEMENT
# ============================================================================

@app.get("/users", tags=["User Management"])
async def get_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of users to return"),
    role: Optional[UserRole] = Query(None, description="Filter by user role")
):
    """Get list of users with pagination and filtering"""
    # Simulate user data
    users = [
        {
            "id": "user_1",
            "email": "admin@darkshepherd.ai",
            "name": "Admin User",
            "role": UserRole.ADMIN,
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "last_login": "2024-01-15T10:30:00Z"
        },
        {
            "id": "user_2", 
            "email": "analyst@darkshepherd.ai",
            "name": "Security Analyst",
            "role": UserRole.ANALYST,
            "is_active": True,
            "created_at": "2024-01-05T00:00:00Z",
            "last_login": "2024-01-15T09:15:00Z"
        }
    ]
    
    if role:
        users = [u for u in users if u["role"] == role]
    
    return {
        "users": users[skip:skip+limit],
        "total": len(users),
        "skip": skip,
        "limit": limit
    }

@app.post("/users", tags=["User Management"])
async def create_user(user: UserCreate):
    """Create a new user"""
    return {
        "success": True,
        "message": "User created successfully",
        "user_id": f"user_{random.randint(1000, 9999)}",
        "user": user.dict()
    }

@app.get("/users/{user_id}", tags=["User Management"])
async def get_user(user_id: str = Path(..., description="User ID")):
    """Get user by ID"""
    return {
        "id": user_id,
        "email": "user@example.com",
        "name": "Example User",
        "role": UserRole.ANALYST,
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-15T10:30:00Z"
    }

@app.put("/users/{user_id}", tags=["User Management"])
async def update_user(user_id: str, user_update: UserUpdate):
    """Update user information"""
    return {
        "success": True,
        "message": "User updated successfully",
        "user_id": user_id,
        "updates": user_update.dict(exclude_unset=True)
    }

@app.delete("/users/{user_id}", tags=["User Management"])
async def delete_user(user_id: str):
    """Delete a user"""
    return {
        "success": True,
        "message": f"User {user_id} deleted successfully"
    }

# ============================================================================
# STORE MANAGEMENT
# ============================================================================

@app.get("/stores", tags=["Store Management"])
async def get_stores(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[StoreStatus] = Query(None)
):
    """Get list of stores with pagination and filtering"""
    stores = [
        {
            "id": "store_1",
            "name": "Fashion Store",
            "shopify_domain": "fashion-store.myshopify.com",
            "status": StoreStatus.ACTIVE,
            "created_at": "2024-01-01T00:00:00Z",
            "last_sync": "2024-01-15T10:30:00Z",
            "order_count": 1250,
            "fraud_alerts": 3
        },
        {
            "id": "store_2",
            "name": "Electronics Store", 
            "shopify_domain": "electronics-store.myshopify.com",
            "status": StoreStatus.ACTIVE,
            "created_at": "2024-01-05T00:00:00Z",
            "last_sync": "2024-01-15T09:15:00Z",
            "order_count": 890,
            "fraud_alerts": 1
        }
    ]
    
    if status:
        stores = [s for s in stores if s["status"] == status]
    
    return {
        "stores": stores[skip:skip+limit],
        "total": len(stores),
        "skip": skip,
        "limit": limit
    }

@app.post("/stores", tags=["Store Management"])
async def create_store(store: StoreCreate):
    """Add a new store"""
    return {
        "success": True,
        "message": "Store added successfully",
        "store_id": f"store_{random.randint(1000, 9999)}",
        "store": store.dict()
    }

@app.get("/stores/{store_id}", tags=["Store Management"])
async def get_store(store_id: str):
    """Get store by ID"""
    return {
        "id": store_id,
        "name": "Example Store",
        "shopify_domain": "example.myshopify.com",
        "status": StoreStatus.ACTIVE,
        "created_at": "2024-01-01T00:00:00Z",
        "last_sync": "2024-01-15T10:30:00Z",
        "order_count": 1250,
        "fraud_alerts": 3,
        "settings": {
            "fraud_threshold": 0.7,
            "auto_block": True,
            "notifications_enabled": True
        }
    }

@app.put("/stores/{store_id}", tags=["Store Management"])
async def update_store(store_id: str, store_update: StoreUpdate):
    """Update store configuration"""
    return {
        "success": True,
        "message": "Store updated successfully",
        "store_id": store_id,
        "updates": store_update.dict(exclude_unset=True)
    }

@app.delete("/stores/{store_id}", tags=["Store Management"])
async def delete_store(store_id: str):
    """Remove a store"""
    return {
        "success": True,
        "message": f"Store {store_id} removed successfully"
    }

@app.post("/stores/{store_id}/sync", tags=["Store Management"])
async def sync_store(store_id: str):
    """Trigger store data synchronization"""
    return {
        "success": True,
        "message": f"Store {store_id} sync initiated",
        "sync_id": f"sync_{random.randint(10000, 99999)}"
    }

# ============================================================================
# ALERTS & NOTIFICATIONS
# ============================================================================

@app.get("/alerts", tags=["Alerts & Notifications"])
async def get_alerts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[AlertType] = Query(None),
    severity: Optional[RiskLevel] = Query(None),
    store_id: Optional[str] = Query(None)
):
    """Get list of alerts with filtering"""
    alerts = [
        {
            "id": "alert_1",
            "type": AlertType.FRAUD,
            "title": "High Risk Order Detected",
            "message": "Order #12345 has a fraud risk score of 0.85",
            "severity": RiskLevel.HIGH,
            "store_id": "store_1",
            "created_at": "2024-01-15T10:30:00Z",
            "resolved": False
        },
        {
            "id": "alert_2",
            "type": AlertType.SECURITY,
            "title": "Suspicious Login Attempt",
            "message": "Multiple failed login attempts detected",
            "severity": RiskLevel.MEDIUM,
            "store_id": "store_2",
            "created_at": "2024-01-15T09:15:00Z",
            "resolved": True
        }
    ]
    
    if type:
        alerts = [a for a in alerts if a["type"] == type]
    if severity:
        alerts = [a for a in alerts if a["severity"] == severity]
    if store_id:
        alerts = [a for a in alerts if a["store_id"] == store_id]
    
    return {
        "alerts": alerts[skip:skip+limit],
        "total": len(alerts),
        "skip": skip,
        "limit": limit
    }

@app.post("/alerts", tags=["Alerts & Notifications"])
async def create_alert(alert: AlertCreate):
    """Create a new alert"""
    return {
        "success": True,
        "message": "Alert created successfully",
        "alert_id": f"alert_{random.randint(1000, 9999)}",
        "alert": alert.dict()
    }

@app.put("/alerts/{alert_id}/resolve", tags=["Alerts & Notifications"])
async def resolve_alert(alert_id: str):
    """Mark alert as resolved"""
    return {
        "success": True,
        "message": f"Alert {alert_id} marked as resolved"
    }

@app.get("/notifications/settings", tags=["Alerts & Notifications"])
async def get_notification_settings():
    """Get notification settings"""
    return {
        "email_enabled": True,
        "webhook_enabled": False,
        "webhook_url": None,
        "alert_types": [AlertType.FRAUD, AlertType.SECURITY],
        "email_recipients": ["admin@darkshepherd.ai"]
    }

@app.put("/notifications/settings", tags=["Alerts & Notifications"])
async def update_notification_settings(settings: NotificationSettings):
    """Update notification settings"""
    return {
        "success": True,
        "message": "Notification settings updated",
        "settings": settings.dict()
    }

# ============================================================================
# REPORTS & ANALYTICS
# ============================================================================

@app.post("/reports/generate", tags=["Reports & Analytics"])
async def generate_report(report_request: ReportRequest):
    """Generate a custom report"""
    return {
        "success": True,
        "message": "Report generation started",
        "report_id": f"report_{random.randint(10000, 99999)}",
        "estimated_completion": "2024-01-15T11:00:00Z"
    }

@app.get("/reports/{report_id}", tags=["Reports & Analytics"])
async def get_report(report_id: str):
    """Get report by ID"""
    return {
        "id": report_id,
        "type": "fraud_analysis",
        "status": "completed",
        "created_at": "2024-01-15T10:00:00Z",
        "completed_at": "2024-01-15T10:05:00Z",
        "data": {
            "total_orders": 1250,
            "fraud_attempts": 15,
            "fraud_rate": "1.2%",
            "total_loss_prevented": "$12,500"
        },
        "download_url": f"/reports/{report_id}/download"
    }

@app.get("/analytics/overview", tags=["Reports & Analytics"])
async def get_analytics_overview(
    store_id: Optional[str] = Query(None),
    days: int = Query(30, ge=1, le=365)
):
    """Get analytics overview"""
    return {
        "period": f"Last {days} days",
        "total_orders": 12500,
        "fraud_attempts": 150,
        "fraud_rate": "1.2%",
        "total_loss_prevented": "$125,000",
        "active_stores": 15,
        "alerts_generated": 45,
        "avg_response_time": "2.3s"
    }

@app.get("/analytics/fraud-trends", tags=["Reports & Analytics"])
async def get_fraud_trends(
    store_id: Optional[str] = Query(None),
    days: int = Query(30, ge=1, le=365)
):
    """Get fraud trend analysis"""
    return {
        "period": f"Last {days} days",
        "trends": [
            {"date": "2024-01-01", "fraud_attempts": 5, "successful_fraud": 1},
            {"date": "2024-01-02", "fraud_attempts": 3, "successful_fraud": 0},
            {"date": "2024-01-03", "fraud_attempts": 7, "successful_fraud": 2}
        ],
        "patterns": [
            "Most fraud attempts occur on weekends",
            "High-value orders are targeted more frequently",
            "International orders show higher risk"
        ]
    }

# ============================================================================
# SECURITY & FRAUD DETECTION
# ============================================================================

@app.post("/analyze-order", tags=["Security & Fraud"])
async def analyze_order(order_data: OrderData, background_tasks: BackgroundTasks):
    """Analyze order for fraud detection"""
    try:
        order_id = order_data.order_id
        order = order_data.order_data
        # Add to background tasks for processing
        background_tasks.add_task(process_order_analysis, order_id, order)
        return {
            "success": True,
            "message": f"Order {order_id} queued for analysis",
            "order_id": order_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-customer", tags=["Security & Fraud"])
async def analyze_customer(customer_data: CustomerData, background_tasks: BackgroundTasks):
    """Analyze customer for risk assessment"""
    try:
        customer_id = customer_data.customer_id
        customer = customer_data.customer_data
        # Add to background tasks for processing
        background_tasks.add_task(process_customer_analysis, customer_id, customer)
        return {
            "success": True,
            "message": f"Customer {customer_id} queued for analysis",
            "customer_id": customer_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/security/patterns", tags=["Security & Fraud"])
async def get_fraud_patterns():
    """Get known fraud patterns"""
    return {
        "patterns": [
            {
                "id": "pattern_1",
                "name": "High-Value Order Pattern",
                "description": "Orders with value > $1000 from new customers",
                "risk_score": 0.8,
                "detection_rate": "95%"
            },
            {
                "id": "pattern_2", 
                "name": "Rapid Order Pattern",
                "description": "Multiple orders in short time period",
                "risk_score": 0.7,
                "detection_rate": "88%"
            }
        ]
    }

@app.post("/security/patterns", tags=["Security & Fraud"])
async def create_fraud_pattern(pattern: dict):
    """Create a new fraud pattern"""
    return {
        "success": True,
        "message": "Fraud pattern created",
        "pattern_id": f"pattern_{random.randint(1000, 9999)}"
    }

# ============================================================================
# SETTINGS & CONFIGURATION
# ============================================================================

@app.get("/settings", tags=["Settings & Configuration"])
async def get_settings():
    """Get system settings"""
    return {
        "fraud_detection": {
            "enabled": True,
            "threshold": 0.7,
            "auto_block": True,
            "review_required": True
        },
        "notifications": {
            "email_enabled": True,
            "webhook_enabled": False,
            "alert_types": ["fraud", "security"]
        },
        "analytics": {
            "data_retention_days": 90,
            "real_time_processing": True
        }
    }

@app.put("/settings", tags=["Settings & Configuration"])
async def update_settings(settings: dict):
    """Update system settings"""
    return {
        "success": True,
        "message": "Settings updated successfully",
        "settings": settings
    }

@app.get("/settings/backup", tags=["Settings & Configuration"])
async def backup_settings():
    """Create settings backup"""
    return {
        "success": True,
        "message": "Settings backup created",
        "backup_id": f"backup_{random.randint(10000, 99999)}",
        "created_at": datetime.now().isoformat()
    }

@app.post("/settings/restore", tags=["Settings & Configuration"])
async def restore_settings(backup_id: str):
    """Restore settings from backup"""
    return {
        "success": True,
        "message": f"Settings restored from backup {backup_id}"
    }

# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def process_order_analysis(order_id: str, order: dict):
    """Background task to process order analysis"""
    # Simulate fraud detection logic
    risk_score = random.uniform(0, 1)
    is_suspicious = risk_score > 0.7
    
    # Store results (in production, save to database)
    print(f"Order {order_id} analysis complete - Risk: {risk_score:.2f}, Suspicious: {is_suspicious}")

async def process_customer_analysis(customer_id: str, customer: dict):
    """Background task to process customer analysis"""
    # Simulate risk assessment logic
    risk_score = random.uniform(0, 1)
    risk_level = "high" if risk_score > 0.7 else "medium" if risk_score > 0.3 else "low"
    
    # Store results (in production, save to database)
    print(f"Customer {customer_id} analysis complete - Risk: {risk_score:.2f}, Level: {risk_level}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    ) 