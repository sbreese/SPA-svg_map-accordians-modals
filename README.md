# Marriott Breaks

Project for Marriott Hotels - Allows the client to convert .csv files to JSON, which is then consumed by the Angular App and deals ("breaks") are shown to the users in a useful way.

### Setup
##### Prerequisites
- [Install Node and npm](https://nodejs.org) - npm installs automatically with Node, unless specified otherwise
- Install Gulp globally

    ```
    $ npm install -g gulp
    ```
    
- (Optional) - Install Nodemon globally
    
    ```
    $ npm install -g nodemon
    ```
    
    Nodemon monitors the Node server files and restarts Node automatically when a file is changed. This is optional, but required if you are going to use the gulp tasks to start the server. Otherwise, manually start the server via Node:
    
    ```
    $ node server/server.js
    ```
    
- (Optional) - [Install Chrome LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) (used to manually reload Chrome when files are compiled/changed)

##### Install and Build
Clone the repo, and then from the root folder:

- Install all dependencies
    
    ```
    $ npm install
    ```
- Compile and Run
    
    ```
    $ gulp
    ```
    
### Main Gulp Tasks
- Default - Lints and compiles all code, starts a file watch, and starts the server via Nodemon
    
    ```
    $ gulp
    ```
- lintAll - Lints all source files
    
    ```
    $ gulp lintAll
    ```
- compile - Lints and compiles all code
    
    ```
    $ gulp compile
    ```
- compile:watch or compile-watch - Lints and compiles all code and starts a file watch
    
    ```
    $ gulp compile:watch
    ```
- server - Starts the Node server via Nodemon
    
    ```
    $ gulp server
    ```
    
### Development
- Frontend: All frontend code is served from the "public" folder. However, these files are compiled, concatenated, and eventually minified versions of the source files, and are all ignored by Git. So all frontend development should be done in the "src" folder. Gulp will compile and copy all necessary files into the "public" folder
- Server: All server code is in the "server" folder
- Gulp: All gulp development should be done in the "gulp" folder. This is broken up by tasks and constants