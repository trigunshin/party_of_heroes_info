from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

if __name__ == '__main__':
    app.run(host='0.0.0.0')