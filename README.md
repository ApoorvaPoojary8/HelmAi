# HelmAi

HelmAi is an AI-based project that detects two-wheeler riders not wearing helmets using CCTV footage.  
It uses **YOLOv8** and **OpenCV** for real-time helmet detection and helps traffic authorities by generating automatic violation reports.

---

## Problem Statement
Road safety in India is a major concern.  
Most accidents involve two-wheeler riders who don’t wear helmets.  
Manual monitoring is inefficient and cannot cover all areas.  
HelmAi aims to solve this by using AI to automatically detect helmet violations.

---

## Features
- Detects riders without helmets in real time  
- Captures image, timestamp, and location  
- Stores violation details in a database  
- Dashboard for traffic authorities to view live reports  
- Can predict high-risk zones and repeat violators  

---

## Tools & Technologies
- **AI/ML:** YOLOv8, OpenCV, TensorFlow / PyTorch  
- **Backend:** Python Flask / Django  
- **Frontend:** React / Streamlit / HTML  
- **Database:** MySQL / MongoDB  

---

## How It Works
1. CCTV camera gives live video feed.  
2. AI model checks frames and detects riders without helmets.  
3. Violation details (image + time + location) are saved in the database.  
4. Dashboard displays all reports and statistics.

---

## Setup
```bash
git clone https://github.com/ApoorvaPoojary8/HelmAi.git
cd HelmAi
pip install -r requirements.txt
python app.py
