from flask import Flask, render_template, send_from_directory
import argparse

# Parse command-line arguments
parser = argparse.ArgumentParser(description="Run Flask app in test or normal mode.")
parser.add_argument(
    "--test",
    action="store_true",
    help="Run the app in test mode using static JSON data.",
)

args = parser.parse_args()

app = Flask(__name__)

@app.route('/fetch-log')
def fetch_log():
    log_path = 'static/media/test-data/sample_log.txt'
    return send_from_directory('static/media/test-data', 'sample_log.txt')

@app.route("/dashboard")
def messages():
    """Renders the initial HTML page."""
    return render_template("dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)
