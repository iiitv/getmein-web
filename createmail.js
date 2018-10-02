const createMail = function (username, email) {
  return `
        <!DOCTYPE html>
        <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <meta http-equiv='X-UA-Compatible' content='ie=edge'>
                <title>Welcome to IIITV Organization</title>
                <!-- Stylesheet -->
                <style type='text/css'>
                * {
                    margin: 0px;
                }
                
                #root {
                    width: 100%;
                }
                
                body {
                    color: rgb(68, 68, 68);
                    -webkit-font-smoothing: antialiased;
                    text-shadow: rgba(0,0,0,.01) 0 0 1px;
                    transition: 0.1s linear;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                
                #header {
                    width: 100%;
                }
                
                #brand-logo {
                    width: 75px;
                }
                
                #brand-logo-cont {
                    width: max-content;
                    margin: 0 auto;
                }
                
                h2, p, h3, h4 {
                    text-align: center;
                }
                
                .divider {
                    width: 45%;
                    margin: 15px auto;
                }
                
                main, footer {
                    width: 60%;
                    margin: 0 auto;
                    padding: 10px;
                    text-align: center;
                }
                
                #verify {
                    display: block;
                    padding: 10px 20px;
                    background-color: rgb(43, 150, 43);
                    border: 0px;
                    border-radius: 3px;
                    color: white;
                    font-weight: bold;
                    font-size: 17px;
                    margin: 20px auto;
                    box-shadow: 3px 3px 20px 0px grey;
                    width: max-content;
                    text-decoration: none;
                }
                
                #verify:hover {
                    box-shadow: 3px 3px 20px 2px grey;
                    cursor: pointer;
                    background-color: rgb(46, 196, 0);
                }
                
                #verify:active {
                    box-shadow: 3px 3px 20px 0px grey;
                    cursor: pointer;
                    background-color: rgb(18, 77, 0);
                }
                
                .social-link {
                    text-decoration: none;
                    font-size: 15px;
                    color: rgb(38, 102, 141);
                }
                </style>
            </head>
            <body>
                <div id='root'>
                    <div id='header'>
                        <div id='brand-logo-cont' >
                            <img id='brand-logo' src='https://scontent.fbom3-2.fna.fbcdn.net/v/t1.0-9/21616257_1209956105817094_7242516145331503157_n.png?_nc_cat=104&oh=c9f5720edd43b2b55f50d0f7e463e69d&oe=5C15672F' alt='IIITV Organization Logo'>
                        </div>
                        <h2>Welcome to IIITV Open Source Organization</h2>
                    </div>
                    <hr class='divider' />
                    <main>
                        <h3>We're glad to have you with us, ${username}!</h3>
                        <p>Click on the button below to verify you E-Mail ID,<br>and you are good to go!</p>
                        <a href='${email}'id='verify'>Verify E-Mail</a>
                        <p>With regards,<br>IIITV Open Source Organization</p>
                    </main>
                    <hr class='divider' />
                    <footer>
                        <p>E-Mail us at codingclub@iiitvadodara.ac.in</p>
                        <h4>Find us on</h4>
                        <a target='_blank' class='social-link' href='https://www.facebook.com/iiitvcc/'>Facebook</a> |
                        <a target='_blank' class='social-link' href='https://twitter.com/iiitvcc'>Twitter</a>
                    </footer>
                </div>
            </body>
        </html>    
    `;
};

module.exports.createMail = createMail;
