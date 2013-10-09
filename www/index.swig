<!DOCTYPE html>
<html>
<head>
	<title>deepjs : Layered - AOP - OCM - Query - Chained - Asynch - Restful based javascipt. For browser and server...</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- Sofia|Nova+Mono|Lobster|Redressed|Ubuntu+Condensed|Pathway+Gothic+One|Sansita+One|Geo|Cookie -->
	<link href='http://fonts.googleapis.com/css?family=Abel|Pathway+Gothic+One|Strait' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/gh-fork-ribbon.css" />
    <link rel="stylesheet" href="/css/friendly.css" />
    <!--[if IE]>
        <link rel="stylesheet" href="/css/gh-fork-ribbon.ie.css" />
    <![endif]-->
    <link rel="stylesheet" href="/css/markdown.css" ></link>
</head>

<body>
	<div class="github-fork-ribbon-wrapper right">
        <div class="github-fork-ribbon">
            <a href="https://github.com/nomocas/deepjs">Fork me on GitHub</a>
        </div>
    </div>
	<div id="header">
		<h1 ><span class="deep-title">deep</span><span class="deep-js">js</span> <span class="deep-baseline-brackets">{</span><span class="deep-baseline">{{ baseline|randomItem }}</span><span class="deep-baseline-brackets">}</span></h1>
	</div>
	<div id="main-menu" class="menu">
		<ul>
			<li class="{% if menuActive == 'home' %} active {% endif %}"><a href="/">home</a></li>
			<li class="{% if menuActive == 'tutos' %} active {% endif %}"><a href="/DOCS/">tutorials</a></li>
			<li class="{% if menuActive == 'API' %} active {% endif %}"><a href="/API/">API</a></li>
			<li class="{% if menuActive == 'download' %} active {% endif %}"><a href="https://github.com/nomocas/deepjs">download</a></li>
			<li class="{% if menuActive == 'modules' %} active {% endif %}"><a href="/modules">modules</a></li>
			<li class="{% if menuActive == 'community' %} active {% endif %}"><a href="/community">community</a></li>
			<li class="{% if menuActive == 'about' %} active {% endif %}"><a href="/about">about</a></li>
		</ul>
		<div id="current-version">
			current version : <strong>{{ version }}</strong>
		</div>
	</div>	
	&nbsp;
	<div id="content">
		{{ content|raw }}
	</div>
	<div id="footer" class="menu">
		<ul>
			<li class="{% if menuActive == 'home' %} active {% endif %}"><a href="/">home</a></li>
			<li class="{% if menuActive == 'tutos' %} active {% endif %}"><a href="/DOCS/">tutorials</a></li>
			<li class="{% if menuActive == 'API' %} active {% endif %}"><a href="/API/">API</a></li>
			<li class="{% if menuActive == 'download' %} active {% endif %}"><a href="https://github.com/nomocas/deepjs">download</a></li>
			<li class="{% if menuActive == 'modules' %} active {% endif %}"><a href="/modules">modules</a></li>
			<li class="{% if menuActive == 'community' %} active {% endif %}"><a href="/community">community</a></li>
			<li class="{% if menuActive == 'about' %} active {% endif %}"><a href="/about">about</a></li>
		</ul>
	</div>
	<div class="copyright">All rights reserved. Powered by <a href="http://www.deepjs.org">deep.js</a>.</div>
</body>
</html>
