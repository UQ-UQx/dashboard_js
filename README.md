dashboard_js
============


dashboard in angular (with yeoman)

Installation
============
sudo apt-get install npm
npm install -g yeo grunt-cli bower
npm install -g generator-angular


Dashboard
========
The dashboard is a Javascript web application (built in AngularJS) which leverages the UQx API 
(https://github.com/UQ-UQx/uqx_api) to provide a series of commonly requested data visualisations 
of the edX research data exports.  The dashboard requires that a working UQx API is running to 
retrieve data.  

Requirements
---------------------
A working instance of the UQx API - https://github.com/UQ-UQx/uqx_api.

Installation
---------------------
[BASE_PATH] is the path where you want the dashboard installed (such as /var/www/html)

Clone the repository
```bash
git clone https://github.com/UQ-UQx/dashboard_js.git [BASE_PATH]
```
Install NPM (Ubuntu)
```bash
sudo apt-get install npm
```
Configure javascript libraries
```bash
npm install -g yeo grunt-cli bower
npm install -g generator-angular
```
Configure the web server to use the [BASE_PATH] as the web root

Architecture
---------------------
The architecture for the dashboard is not meant to be standalone, but work with the UQx API. 

Running Tests
---------------------
Currently the project is at an early stage and does not have reliable tests created.

License
---------------------
This project is licensed under the terms of the MIT license.

How to Contribute
---------------------
Currently the injestor project is at a very early stage and unlikely to accept pull requests
in a timely fashion as the structure may change without notice.
However feel free to open issues that you run into and we can look at them ASAP.

Contact
---------------------
The best contact point apart from opening github issues or comments is to email 
technical@uqx.uq.edu.au