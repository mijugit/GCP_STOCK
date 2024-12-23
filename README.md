Write code in python that uses the yfinance library to retrieve data for the selected ticker, interval and date range. Let this code be a CloudFunction in GCP. Let the downloaded data be uploaded to the indicated CloudBucket in GCP in the form of a CSV file called ticker+data. The front part, launched as index.htm from GCP Cloud Storage, is to list all objects in the indicated bucket and draw a chart based on the file indicated by the user. The application's color scheme will be the same as before - dark.


GitHub Copilot

Step-by-step plan:
GCP Cloud Function (Python)

Set up environment and dependencies
Create function to fetch data from yfinance
Upload data to Cloud Storage bucket
Handle error scenarios
Frontend (HTML/JS)

Create HTML interface
List files from bucket
Draw chart using selected data
Implement dark theme

To deploy:

Deploy Cloud Function to GCP
Create public Cloud Storage bucket
Update CLOUD_FUNCTION_URL and BUCKET_NAME in app.js
Upload frontend files to Cloud Storage bucket
Configure bucket for static website hosting
Enable CORS on the bucket
