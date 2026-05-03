FROM python:3.10

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

ENV FLASK_ENV=development
ENV FLASK_APP=app.py

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]