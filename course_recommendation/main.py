# -*- coding: utf-8 -*-

import os
import pickle
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
from flask import Flask, request

app = Flask(__name__)


courses_list = pickle.load(open('C:/Users/marwe/OneDrive/Desktop/Course Recommendation/courses.pkl', 'rb'))
similarity = pickle.load(open('C:/Users/marwe/OneDrive/Desktop/Course Recommendation/similarity.pkl', 'rb'))


@app.route('/predict', methods=['POST'])
def recommend():
    course = request.args.get('course')
    #li = list(course.split(" "))
    #d = pd.DataFrame(li)
    index = courses_list[courses_list['course_name'] == course].index[0]
    #print(index)
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_course_names = []
    for i in distances[1:7]:
        course_name = courses_list.iloc[i[0]].course_name
        recommended_course_names.append(course_name)

    return recommended_course_names.__str__()


if __name__ == "__main__":
    app.run(debug=True)
