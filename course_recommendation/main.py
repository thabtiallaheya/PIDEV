# -*- coding: utf-8 -*-

import os
import pickle
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


courses_list = pickle.load(open('C:/Users/Asus/Desktop/PIDEV-main/course_recommendation/courses.pkl', 'rb'))
similarity = pickle.load(open('C:/Users/Asus/Desktop/PIDEV-main/course_recommendation/similarity.pkl', 'rb'))
list_c = pickle.load(open('C:/Users/Asus/Desktop/PIDEV-main/course_recommendation/course_list.pkl', 'rb'))



@app.route('/predict', methods=['POST'])
def recommend():
    course = request.args.get('course')
    # li = list(course.split(" "))
    # d = pd.DataFrame(li)
    # convertedDict = json.loads(course)
    c = courses_list['course_name']
    index = courses_list[courses_list['course_name'].str.contains(course)].index[0]
    # url = list_c[index].str.strip()
    # print(url)
    # print(index)
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_course_names = []
    for i in distances[1:7]:
        course_name = courses_list.iloc[i[0]].course_name
        recommended_course_names.append(course_name)
    return recommended_course_names.__str__()


if __name__ == "__main__":
    app.run(debug=True)