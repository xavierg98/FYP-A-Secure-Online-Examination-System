import pymysql
from app import app
from db import mysql
from flask import jsonify
from flask import flash, request
#from werkzeug import generate_password_hash, check_password_hash
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, Response, request
import cv2
import datetime, time
import os, sys
import face_recognition
import numpy as np
from threading import Thread
from flask import Flask, url_for




global capture,rec_frame, grey, switch, neg, face, rec, out 
capture=0
grey=0
neg=0
face=0
switch=1
rec=0

#make shots directory to save pics
try:
    os.mkdir('./shots')
except OSError as error:
    pass

#Load pretrained face detection model    
net = cv2.dnn.readNetFromCaffe('./saved_model/deploy.prototxt.txt', './saved_model/res10_300x300_ssd_iter_140000.caffemodel')

#instatiate flask app  
#app = Flask(__name__, template_folder='./templates')


camera = cv2.VideoCapture(0)

# Load a sample picture and learn how to recognize it.
xavier_image = face_recognition.load_image_file("Xavier/xavier.jpg")
xavier_face_encoding = face_recognition.face_encodings(xavier_image)[0]

# Load a second sample picture and learn how to recognize it.
bradley_image = face_recognition.load_image_file("Bradley/bradley.jpg")
bradley_face_encoding = face_recognition.face_encodings(bradley_image)[0]

# Create arrays of known face encodings and their names
known_face_encodings = [
    xavier_face_encoding,
    bradley_face_encoding
]
known_face_names = [
    "Xavier",
    "Bradly"
]
# Initialize some variables
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True


def record(out):
    global rec_frame
    while(rec):
        time.sleep(0.05)
        out.write(rec_frame)


def detect_face(frame):
    global net
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
        (300, 300), (104.0, 177.0, 123.0))   
    net.setInput(blob)
    detections = net.forward()
    confidence = detections[0, 0, 0, 2]

    if confidence < 0.5:            
            return frame           

    box = detections[0, 0, 0, 3:7] * np.array([w, h, w, h])
    (startX, startY, endX, endY) = box.astype("int")
    try:
        frame=frame[startY:endY, startX:endX]
        (h, w) = frame.shape[:2]
        r = 480 / float(h)
        dim = ( int(w * r), 480)
        frame=cv2.resize(frame,dim)
    except Exception as e:
        pass
    return frame
 

def gen_frameface():  
    while True:
        success, frame = camera.read()  # read the camera frame
        if not success:
            break
        else:
            # Resize frame of video to 1/4 size for faster face recognition processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_small_frame = small_frame[:, :, ::-1]

            # Only process every other frame of video to save time
           
            # Find all the faces and face encodings in the current frame of video
            face_locations = face_recognition.face_locations(rgb_small_frame)
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
            face_names = []
            for face_encoding in face_encodings:
                # See if the face is a match for the known face(s)
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"
                # Or instead, use the known face with the smallest distance to the new face
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]

                face_names.append(name)
            

            # Display the results
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                # Draw a box around the face
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Draw a label with a name below the face
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def gen_frames():  # generate frame by frame from camera
    global out, capture,rec_frame
    while True:
        success, frame = camera.read() 
        if success:
            if(face):                
                frame= detect_face(frame)
            if(grey):
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            if(neg):
                frame=cv2.bitwise_not(frame)    
            if(capture):
                capture=0
                now = datetime.datetime.now()
                p = os.path.sep.join(['shots', "shot_{}.png".format(str(now).replace(":",''))])
                cv2.imwrite(p, frame)
            
            if(rec):
                rec_frame=frame
                frame= cv2.putText(cv2.flip(frame,1),"Recording...", (0,25), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255),4)
                frame=cv2.flip(frame,1)
                
            try:
                ret, buffer = cv2.imencode('.jpg', cv2.flip(frame,1))
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            except Exception as e:
                pass
                
        else:
            pass

def closeframe():
	camera.release()
	cv2.destroyAllWindows()	

@app.route('/urls')
def get_urls():
    return jsonify({
        'video_feed': url_for('video_feed', _external=True),
        'video_feedreg' : url_for('video_feedreg', _external=True),
		'requeststu' : url_for('requeststu', _external=True)
    })



@app.route('/')
def index():
    return render_template('index.html')
   
@app.route('/add_inst')
def add_inst():
    return render_template('add_inst.html')

@app.route('/stu_photo')
def stu_photo():
    return render_template('stu_photo.html')

@app.route('/id_veri')
def id_veri():
    return render_template('id_veri.html')  

@app.route('/envi_check')
def envi_check():
    return render_template('envi_check.html')    

@app.route('/facial_reg')
def facial_reg():
    return render_template('facial_reg.html') 

@app.route('/exam_page',methods=['GET',"POST"])
def exam_page():
	closeframe()
	return render_template('exam_page.html')


@app.route('/success')
def success():
    return render_template('success.html')


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feedreg')
def video_feedreg():
    return Response(gen_frameface(), mimetype='multipart/x-mixed-replace; boundary=frame')    

@app.route('/requeststu',methods=['POST','GET'])
def taskstu():
    global switch,camera
    if request.method == 'POST':
        if request.form.get('click') == 'Capture':
            global capture
            capture=1
                                                           
    elif request.method=='GET':
        return render_template('stu_photo.html')
    return render_template('stu_photo.html')

@app.route('/requestid',methods=['POST','GET'])
def taskid():
    global switch,camera
    if request.method == 'POST':
        if request.form.get('click') == 'Capture':
            global capture
            capture=1
                                                           
    elif request.method=='GET':
        return render_template('id_veri.html')
    return render_template('id_veri.html')

@app.route('/requestrec',methods=['POST','GET'])
def taskrec():
    global switch,camera
    if request.method == 'POST':
        if  request.form.get('rec') == 'Start/Stop Recording':
            global rec, out
            rec= not rec
            if(rec):
                now=datetime.datetime.now() 
                fourcc = cv2.VideoWriter_fourcc(*'XVID')
                out = cv2.VideoWriter('vid_{}.avi'.format(str(now).replace(":",'')), fourcc, 20.0, (640, 480))
                #Start new thread for recording the video
                thread = Thread(target = record, args=[out,])
                thread.start()
            elif(rec==False):
                out.release()
                          
                 
    elif request.method=='GET':
        return render_template('envi_check.html')
    return render_template('envi_check.html')


    
############User################

@app.route('/login', methods=['GET','POST'])
def login():
	conn = None
	cursor = None
	try:
		_json = request.json
		_name = _json['name']
		_password = _json['pwd']
		# validate the received values
		if _name and _password and request.method == 'POST':
			conn = mysql.connect()
			cursor = conn.cursor(pymysql.cursors.DictCursor)
			cursor.execute("SELECT user_id id, user_name name, user_email email, user_password pwd FROM tbl_user WHERE user_name=%s ", (_name))
			data = cursor.fetchone()
			if data:
				hashpwd=data['pwd']
				if check_password_hash(hashpwd, _password):
					resp = jsonify(data)
					resp.status_code = 200
					return resp
				else:
					return not_found()
			else:
				return not_found()

		else:
			return not_found()
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



@app.route('/add', methods=['POST'])
def add_user():
	conn = None
	cursor = None
	try:
		_json = request.json
		_name = _json['name']
		_email = _json['email']
		_password = _json['pwd']
		_type = _json['type']
		_contact = _json['contact']
		# validate the received values
		if _name and _email and _password and request.method == 'POST':
			#do not save password as a plain text
			_hashed_password = generate_password_hash(_password)
			# save edits
			sql = "INSERT INTO tbl_user(user_name, user_email, user_password, user_type, user_contact) VALUES(%s, %s, %s, %s, %s)"
			data = (_name, _email, _hashed_password, _type, _contact)
			conn = mysql.connect()
			cursor = conn.cursor()
			cursor.execute(sql, data)
			conn.commit()
			resp = jsonify('User added successfully!')
			resp.status_code = 200
			return resp
		else:
			return not_found()
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()

@app.route('/examadd', methods=['POST'])
def add_exam():
	conn = None
	cursor = None
	try:
		_json = request.json
		_examName = _json['examName']
		_examType = _json['examType']
		_startDate = _json['startDate']
		_examStatus = _json['examStatus']
		_examPaperId = _json['examPaperId']
		_examReportId = _json['examReportId']
		_examCreator = _json['examCreator']
		
		# validate the received values
		if _examName and _examType and _startDate and _examStatus and _examPaperId and _examReportId and _examStatus and _examCreator and request.method == 'POST':
			# save edits
			sql = "INSERT INTO exams(ExamName, ExamType, StartDate, ExamStatus, ExamPaperId, ExamReportId, ExamCreator) VALUES(%s, %s, %s, %s, %s, %s, %s)"
			data = (_examName, _examType, _startDate, _examStatus, _examPaperId, _examReportId, _examCreator)
			conn = mysql.connect()
			cursor = conn.cursor()
			cursor.execute(sql, data)
			conn.commit()
			resp = jsonify('Exam added successfully!')
			resp.status_code = 200
			return resp
		else:
			return not_found()
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()
		
@app.route('/users')
def users():
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor(pymysql.cursors.DictCursor)
		cursor.execute("SELECT user_id id, user_name name, user_email email, user_password pwd, user_type type, user_contact contact FROM tbl_user")
		rows = cursor.fetchall()
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()
		
@app.route('/user/<int:id>')
def user(id):
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor(pymysql.cursors.DictCursor)
		cursor.execute("SELECT user_id id, user_name name, user_email email, user_password pwd, user_type type, user_contact contact FROM tbl_user WHERE user_id=%s", id)
		row = cursor.fetchone()
		resp = jsonify(row)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



@app.route('/update', methods=['PUT'])
def update_user():
	conn = None
	cursor = None
	try:
		_json = request.json
		_id = _json['id']
		_name = _json['name']
		_email = _json['email']
		_password = _json['pwd']
		_type = _json['type']
		_contact = _json['contact']		
		# validate the received values
		if _name and _email and _password and _id and request.method == 'PUT':
			#do not save password as a plain text
			_hashed_password = generate_password_hash(_password)
			# save edits
			sql = "UPDATE tbl_user SET user_name=%s, user_email=%s, user_password=%s, user_type=%s, user_contact=%s WHERE user_id=%s"
			data = (_name, _email, _hashed_password, _type, _contact, _id)
			conn = mysql.connect()
			cursor = conn.cursor()
			cursor.execute(sql, data)
			conn.commit()
			resp = jsonify('User updated successfully!')
			resp.status_code = 200
			return resp
		else:
			return not_found()
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()



		
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_user(id):
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor()
		cursor.execute("DELETE FROM tbl_user WHERE user_id=%s", (id,))
		conn.commit()
		resp = jsonify('User deleted successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
		return not_found()
	finally:
		cursor.close() 
		conn.close()
		


############Exam#################################

#  StartTime startTime, EndTime endTime
@app.route('/exams')
def exams():
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor(pymysql.cursors.DictCursor)
		cursor.execute("SELECT ExamID examID, ExamName examName, ExamType examType, StartDate startDate, ExamStatus examStatus, ExamPaperId examPaperId, ExamReportId examReportId, ExamCreator examCreator FROM exams")
		rows = cursor.fetchall()
		resp = jsonify(rows)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/exam/<int:id>')
def exam(id):
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor(pymysql.cursors.DictCursor)
		cursor.execute("SELECT ExamID examID, ExamName examName, ExamType examType, StartDate startDate, ExamStatus examStatus, ExamPaperId examPaperId, ExamReportId examReportId, ExamCreator examCreator FROM exams WHERE ExamID=%s", id)
		row = cursor.fetchone()
		resp = jsonify(row)
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


		
@app.route('/examedit', methods=['PUT'])
def update_exam():
	conn = None
	cursor = None
	try:
		_json = request.json
		_examID = _json['examID']
		_examName = _json['examName']
		_examType = _json['examType']
		_startDate = _json['startDate']
		_examStatus = _json['examStatus']
		_examPaperId = _json['examPaperId']
		_examReportId = _json['examReportId']
		_examCreator = _json['examCreator']		
		# validate the received values
		if _examName and _examType and _examStatus and _examCreator and request.method == 'PUT':
			# save edits
			sql = "UPDATE exams SET ExamName=%s, ExamType=%s, StartDate=%s, ExamStatus=%s, ExamPaperId=%s, ExamReportId=%s, ExamCreator=%s WHERE ExamID=%s"
			data = (_examName, _examType, _startDate, _examStatus, _examPaperId, _examReportId, _examCreator, _examID)
			conn = mysql.connect()
			cursor = conn.cursor()
			cursor.execute(sql, data)
			conn.commit()
			resp = jsonify('User updated successfully!')
			resp.status_code = 200
			return resp
		else:
			return not_found()
	except Exception as e:
		print(e)
	finally:
		cursor.close() 
		conn.close()


@app.route('/examdelete/<int:id>', methods=['DELETE'])
def delete_exam(id):
	conn = None
	cursor = None
	try:
		conn = mysql.connect()
		cursor = conn.cursor()
		cursor.execute("DELETE FROM exams WHERE ExamID=%s", (id,))
		conn.commit()
		resp = jsonify('Exam deleted successfully!')
		resp.status_code = 200
		return resp
	except Exception as e:
		print(e)
		return not_found()
	finally:
		cursor.close() 
		conn.close()
		

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp	

if __name__ == "__main__":
    app.run()

camera.release()
cv2.destroyAllWindows()	