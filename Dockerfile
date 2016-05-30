FROM 128.no:8080/backend-comm
MAINTAINER Pål Karlsrud <paal@128.no>

ENV BASE_DIR /var/frontend

RUN git clone https://github.com/microserv/frontend ${BASE_DIR}
RUN apk-install python nginx

RUN cp ${BASE_DIR}/frontend.ini /etc/supervisor.d/
RUN curl -o /etc/supervisor.d/nginx.ini https://128.no/f/nginx.ini

RUN cp ${BASE_DIR}/frontend.conf /etc/nginx/conf.d/
RUN curl -o /etc/nginx/nginx.conf https://128.no/f/nginx.conf

RUN virtualenv ${BASE_DIR}/venv
ENV PATH ${BASE_DIR}/venv/bin:$PATH

WORKDIR ${BASE_DIR}
RUN pip install -r requirements.txt
RUN pip install gunicorn

WORKDIR ${BASE_DIR}/editor_backend
RUN python manage.py collectstatic --noinput

ENV SERVICE_NAME frontend

EXPOSE 80
