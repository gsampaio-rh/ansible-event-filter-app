
# Ansible Event Filter Application

The Ansible Event Filter Application is a Flask-based web application designed to integrate with Ansible for filtering and managing system events. It provides a real-time dashboard to monitor and react to various system events, leveraging a visual network of interactions and a series of management tools for comprehensive oversight.

## Features

- **Real-time Event Monitoring**: Visualize and monitor system events as they happen.
- **Event Handling**: Use predefined rules to handle events automatically.
- **Interactive Dashboard**: An interactive web-based dashboard to view and manage events.
- **Integration with Various Services**: Supports integration with AWS CloudWatch, Azure DevOps, Datadog, and more.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

```bash
Python 3.8+
pip
Flask
```

### Installing

A step-by-step series of examples that tell you how to get a development environment running:

1. **Clone the repository**

   ```bash
   git clone https://github.com/gsampaio-rh/ansible-event-filter-app
   cd ansible-event-filter-app
   ```

2. **Install required packages**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   Adjust the `.env` file or export necessary environment variables, such as:

   ```bash
   export FLASK_APP=app.py
   export FLASK_ENV=development
   ```

4. **Run the application**

   ```bash
   flask run
   ```

   Access the application at `http://localhost:5000/`.

## Usage

Describe how to use the application with examples of functionalities. Include screenshots or code blocks for more clarity.

## Development

### Adding New Features

Describe the process for adding new features for developers. Include any relevant code snippets or architecture diagrams that might be helpful.

### Running Tests

Explain how to run the automated tests for this system.

```bash
python -m unittest discover -s tests
```

## Built With

- [Flask](http://flask.palletsprojects.com/) - The web framework used
- [vis.js](https://visjs.org/) - For creating dynamic, browser-based visualizations
- [Bootstrap](https://getbootstrap.com/) - For responsive front-end templates

## Authors

- **Gabriel Sampaio**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
