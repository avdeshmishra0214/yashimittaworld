@echo off
echo Starting Kids Games Backend...
cd /d "%~dp0backend"

REM Set JAVA_HOME to JDK 11 (found on this machine)
set JAVA_HOME=C:\Users\yashmishra\jdk-11

REM Use Maven wrapper from .m2 cache
set MVN=C:\Users\yashmishra\.m2\wrapper\dists\apache-maven-3.8.6-bin\1ks0nkde5v1pk9vtc31i9d0lcd\apache-maven-3.8.6\bin\mvn.cmd

if not exist "%MVN%" (
    echo ERROR: Maven not found at %MVN%
    echo Please install Maven or check the path.
    pause
    exit /b 1
)

"%MVN%" spring-boot:run -Dhttps.protocols=TLSv1.2
