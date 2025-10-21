from fastapi import FastAPI
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service_account.json"

app = FastAPI()

@app.get("/token")
def get_token():
    credentials = service_account.Credentials.from_service_account_file(
        "service_account.json",
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    credentials.refresh(Request())
    
    return {
        "access_token": credentials.token,
        "expires_in": int(credentials.expiry.timestamp())
    }
