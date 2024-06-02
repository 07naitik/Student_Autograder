from flask import Flask, request, render_template, jsonify, send_file
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import os

app = Flask(__name__)

def assign_grades(df):
    marks = df[['Marks']].values
    num_grades = 8
    kmeans = KMeans(n_clusters=num_grades, random_state=42)
    df['Cluster'] = kmeans.fit_predict(marks)
    
    grades = ['A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'E']
    cluster_means = df.groupby('Cluster')['Marks'].mean().sort_values(ascending=False)
    cluster_to_grade = {cluster: grade for cluster, grade in zip(cluster_means.index, grades)}
    
    df['Grade'] = df['Cluster'].map(cluster_to_grade)
    df = df.drop(columns=['Cluster'])
    df.to_csv('students_with_grades.csv', index=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/grade', methods=['POST'])
def grade():
    if 'csv-file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['csv-file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    df = pd.read_csv(file)
    try:
        assign_grades(df)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download')
def download():
    return send_file('students_with_grades.csv', as_attachment=True)

if __name__ == '__main__':
    app.run()
