
Overview
=========

This is an ultra simple all-test-framework friendly utility, meant to be used 
with the test framework of your choice, decorates the built-in assert object 
with a new method responseLike(res,exp,msg)


 * * *

Usage
======

usage : 

```
    var assert = require("assert");
      , request = require('your favorite http request lib')
      , test  = require('your favorite test function of your favorite framework')
      ;
     
    require("assert-responseLike"); 

    test( "foo", function() {
      request(url, function(response){
          assert.responseLike( response
           , { status : 200 //throws 'Invalid response code - expected ... got ...'
             , statusCode : 200 //same like status, for the explicitness lovers..
             , headers :                      
               { "Content-Type" : "text/plain" //throws 'response-header - expected ... got ...' 
               }
             , body : "run vows for full spec" //throws 'Invalid response body - expected ... got ...'
             }
          );
      });
    });
```

Installation
============

npm package will be supported (hopefully) soon
untill then - download the [zip](https://github.com/osher/assert-responseLike/zipball/master) from github, 
and extract it to your ./node_modules/ directory.


Testing
============
after extracting first you have to :

`npm install`

esample of output:

```
D:\work\assert-responseLike>npm install
npm http GET https://registry.npmjs.org/vows
npm http 304 https://registry.npmjs.org/vows
npm http GET https://registry.npmjs.org/eyes
npm http 304 https://registry.npmjs.org/eyes
npm WARN eyes@0.1.7 dependencies field should be hash of <name>:<version-range> pairs
vows@0.6.3 ./node_modules/vows
└── eyes@0.1.7
```

and then `vows --spec`
* if you're a windows user - you'll want to add to your PATH variable '.\node_modules\.bin'
* alternatively - just run `node ./node_modules/vows/bin/vows --spec`


Specifications
===============

```
  ? assert response

  API
    √ assert should be decorated with the method:

        assert.responseLike ( oActualResponse, oExpectedDescr, sCustomMessage )

  check status code with attribute 'status'
    √ providing correct numner should work
    √ providing wrong number should throw

  check status code with attribute 'statusCode'
    √ providing correct number should work
    √ providing wrong number should throw

  check response headers
    √ providing existing headers should work - case insensitive
    √ providing wrong headers throw on the first mismatch
    √ providing missing headers throw on the first misfound

  check response body
    √ regexp body descriptor that matches should not throw
    √ regexp body descriptor that does not match should throw
    √ when descriptor is not a RegExp, and body is object - deep equal match should not throw
    √ when descriptor is not a RegExp, and body is object - deep equal difference should throw

  check response headers - provide expected content
    √ equal string - should pass
    √ different string - should throw
    √ matching regexp - should pass
    √ non-matching regexp - should throw

  thrown errors - when providing a message
    √ should trail status-code error messages
    √ should trail response-header error messages
    √ should trail response-body error messages

  thrown errors - a status-code check error message
    √ should start with 'Invalid response status code'
    √ should contain the expected response code
    √ should contain the actual response code

  thrown errors - a missing response-header check error message
    √ should start with 'response header'
    √ should contain the expected response header name
    √ should contain the expected response header value
    √ should contain the actual response value

  thrown errors - a mismatching response-header check error message
    √ should start with 'response header'
    √ should contain the expected response header name
    √ should contain the expected response header value
    √ should contain the actual response value

√ OK » 30 honored (0.183s)

```

Misc
=====
It's not the most genious utility or anything, it is meant to be my first git hub project.
I use it to test responses of web-requests to web projects, with [vows](http://vowsjs.org/).

The basis of the implementation is taken from from expresso, that did not work well for me
on windows, and the implementation there is coupled with the request firing itself - and I 
did not like that.
  so now I can use the same assert description language with any test-framework i like, and 
  use whatever request tools I want.


Lisence
=======

I don't know what i need to do to make it officual under whatever lisence is up there...
I took from 'the community' so I give back.
Take it, as is, I give no warantee. 
Do with it whatever you want on your own responsibility.
