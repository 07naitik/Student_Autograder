from flask import Flask, request, render_template, jsonify
import numpy as np
from sklearn.cluster import KMeans

app = Flask(__name__)

def assign_grades(marks):
    marks_array = np.array(marks).reshape(-1, 1)
    kmeans = KMeans(n_clusters=6)
    kmeans.fit(marks_array)
    
    clusters = kmeans.predict(marks_array)
    cluster_labels = {i: grade for i, grade in enumerate(['A', 'A-', 'B', 'B-', 'C', 'D', 'E'])}
    
    grades = [cluster_labels[c] for c in clusters]
    return grades

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/grade', methods=['POST'])
def grade():
    data = request.json
    marks = data.get('marks', [])
    if not marks:
        return jsonify({'error': 'No marks provided'}), 400
    
    grades = assign_grades(marks)
    return jsonify({'grades': grades})

if __name__ == '__main__':
    app.run()
