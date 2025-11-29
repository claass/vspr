from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.draw import router as draw_router
from api.routes.interpret import router as interpret_router
from api.routes.notifications import router as notifications_router

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(draw_router)
app.include_router(interpret_router)
app.include_router(notifications_router)

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}