# Errors

The avatarMate API uses the following error codes:

Error Code | Meaning
---------- | -------
400 | Bad Request -- Your request is invalid.
401 | Unauthorized -- Your API key or the credentials you supplied are wrong.
409 | Resource Conflict -- You tried to create a user with an email that already has an account.
404 | Not Found -- The specified endpoint or resource could not be found.
429 | Too Many Requests -- You're send too many requests... Slow down!
500 | Internal Server Error -- We had a problem with our server. Try again later.
503 | Application Error -- Heroku blew up, the world is ending, prepare for the apocalypse.
