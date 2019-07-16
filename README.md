# Project Title

TT Pointer 

## Description

This project will do your work point marks

## Getting Started

### Dependencies

* Node 8.10 or higher

### Installing

* Clone the repository (git clone)
* Install the dependecies (npm i)
* Create a JWT token (token.json) with the following fields:
* * user: your user
* * pass: your password
* * url: the url of the website


### Executing program

* If it is your first run, you should create the user credentials:
```
npm run config:user
```
* * For this case you should fill the prompt with your user information and the url to access.
* * * Ps: The url value should be without the "*https://*" and "*.com*" e.g. "google"

* How to run the program:
```
npm run start
```

* How to run the program in debug mode:
```
npm run start:debug
```

## Help

Any advise for common problems or issues.
```
npm run help
```

## Authors

Contributors names and contact info

Lucas Baldin - lucas.sbaldin@gmail.com

## Version History

* 0.1
    * Initial Release
* 1.0
    * Different files for the functions
* 1.1
    * Added user interface
    * Added JWT creation
    * Added help command
    * Added external lib
    * Updated packages
