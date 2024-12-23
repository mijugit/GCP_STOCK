import yfinance as yf
from google.cloud import storage
from datetime import datetime
import pandas as pd

def fetch_stock_data(request):
    """
    Cloud Function to fetch stock data and save to GCS
    """
    try:
        request_json = request.get_json()
        
        ticker = request_json['ticker']
        interval = request_json['interval']
        start_date = request_json['start_date']
        end_date = request_json['end_date']
        bucket_name = request_json['bucket_name']
        
        # Fetch data from Yahoo Finance
        data = yf.download(ticker, interval=interval, start=start_date, end=end_date)
        
        if data.empty:
            return {'error': 'No data available for given parameters'}, 400
            
        # Reset index to get DateTime column
        data.reset_index(inplace=True)
        
        # Create filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{ticker}_{timestamp}.csv"
        
        # Save to temporary file
        data.to_csv(f"/tmp/{filename}", index=False)
        
        # Upload to GCS
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(filename)
        blob.upload_from_filename(f"/tmp/{filename}")
        
        return {
            'success': True,
            'filename': filename
        }
        
    except Exception as e:
        return {'error': str(e)}, 500