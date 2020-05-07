pg_ctl restart
dropdb ts-2020
heroku pg:pull DATABASE ts-2020 --app ts-2020