"""
Test script for Loan Prediction API
Tests all endpoints with sample data
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# Sample test data
test_application_approved = {
    "income_annum": 9600000,
    "loan_amount": 2990000,  # Lower loan amount - likely to be approved
    "loan_term": 12,
    "cibil_score": 778,
    "residential_assets_value": 2400000,
    "commercial_assets_value": 17600000,
    "luxury_assets_value": 22700000,
    "bank_asset_value": 3800000
}

test_application_rejected = {
    "income_annum": 1200000,  # Low income
    "loan_amount": 29900000,  # Very high loan amount
    "loan_term": 12,
    "cibil_score": 450,  # Low credit score
    "residential_assets_value": 100000,
    "commercial_assets_value": 0,
    "luxury_assets_value": 0,
    "bank_asset_value": 50000
}

def print_separator():
    print("\n" + "="*80 + "\n")

def test_root():
    """Test root endpoint"""
    print("Testing ROOT endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print_separator()

def test_health():
    """Test health check endpoint"""
    print("Testing HEALTH endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print_separator()

def test_models():
    """Test models listing endpoint"""
    print("Testing MODELS LIST endpoint...")
    response = requests.get(f"{BASE_URL}/models")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print_separator()

def test_predict_ensemble(data, label):
    """Test ensemble prediction endpoint"""
    print(f"Testing ENSEMBLE PREDICTION ({label})...")
    try:
        # Use data= instead of json= to send as form-data
        response = requests.post(f"{BASE_URL}/predict", data=data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error Response: {response.text}")
            return

        result = response.json()
        print(json.dumps(result, indent=2))
        
        # Display summary
        print("\n--- SUMMARY ---")
        print(f"Approved: {'✓ YES' if result.get('approved') else '✗ NO'}")
        print(f"Confidence: {result.get('confidence')}%")
        print(f"Recommendation: {result.get('recommendation')}")
    except Exception as e:
        print(f"An error occurred: {e}")
    print_separator()

def test_individual_models(data, label):
    """Test individual model predictions"""
    print(f"Testing INDIVIDUAL MODEL PREDICTIONS ({label})...")
    
    models = ['linear', 'decision_tree', 'random_forest']
    
    for model in models:
        try:
            # Use data= instead of json= to send as form-data
            response = requests.post(f"{BASE_URL}/predict/individual/{model}", data=data)
            print(f"\n{model.upper()}:")
            print(f"  Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"  Error: {response.text}")
                continue

            result = response.json()
            print(f"  Prediction: {result.get('prediction')}")
            print(f"  Approved: {'✓ YES' if result.get('approved') else '✗ NO'}")
        except Exception as e:
            print(f"  Error testing {model}: {e}")
    
    print_separator()

def run_all_tests():
    """Run all API tests"""
    try:
        print("\n🚀 Starting Loan Prediction API Tests...\n")
        
        # Basic endpoints
        test_root()
        test_health()
        test_models()
        
        # Ensemble predictions
        test_predict_ensemble(test_application_approved, "LIKELY APPROVAL")
        test_predict_ensemble(test_application_rejected, "LIKELY REJECTION")
        
        # Individual model tests
        test_individual_models(test_application_approved, "LIKELY APPROVAL")
        test_individual_models(test_application_rejected, "LIKELY REJECTION")
        
        print("\n✅ All tests completed successfully!\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to the API server.")
        print("Make sure the server is running on http://localhost:8000")
        print("\nTo start the server, run:")
        print("  python app.py")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

if __name__ == "__main__":
    run_all_tests()
