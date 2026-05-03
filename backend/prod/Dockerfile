FROM python:3.10

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

ENV FLASK_ENV=production

EXPOSE 5001

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "app:app"]