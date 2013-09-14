<!DOCTYPE html>
<html>

<head>
	<title>deepjs : Layered AOP/OCM Asynch programmation</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- Sofia|Nova+Mono|Lobster|Redressed|Ubuntu+Condensed|Pathway+Gothic+One|Sansita+One|Geo|Cookie -->
	<link href='http://fonts.googleapis.com/css?family=Abel|Pathway+Gothic+One|Strait' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/gh-fork-ribbon.css" />
    <!--[if IE]>
        <link rel="stylesheet" href="/css/gh-fork-ribbon.ie.css" />
    <![endif]-->
    <link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css" rel="stylesheet"></link>
</head>

<body>
	<div class="github-fork-ribbon-wrapper right">
        <div class="github-fork-ribbon">
            <a href="https://github.com/simonwhitaker/github-fork-ribbon-css">Fork me on GitHub</a>
        </div>
    </div>
	<div id="header">
		<h1 ><span class="deep-title">deep</span><span class="deep-js">js</span><span class="deep-baseline">{&nbsp;&nbsp;&nbsp;Made with love...&nbsp;&nbsp;&nbsp;}</span></h1>
		<!--<h2 class="deep-baseline">Please callBack later...</h2>-->
		<!--<h2 class="deep-baseline">Will do it for you !</h2>-->
		<!--<h2 class="deep-baseline">A whole new world !</h2>-->
	</div>
	<div id="main-menu">
		<ul>
			<li class="{% if menuActive == 'home' %} active {% endif %}"> <a href="/">home</a> </li>
			<li class="{% if menuActive == 'tutos' %} active {% endif %}"> <a href="/tutos">tutorials</a> </li>
			<li class="{% if menuActive == 'API' %} active {% endif %}"> <a href="/API">API</a> </li>
			<li class="{% if menuActive == 'about' %} active {% endif %}"> <a href="/about">about</a> </li>
		</ul>
	</div>
	<div id="content">
		{{ content|raw }}
	</div>
	<div id="footer">
		deep.js : <a href="/">home</a> - <a href="/tutos">tutorials</a> - <a href="/api">api</a> - <a href="/about">about</a>
	</div>
</body>
</head>