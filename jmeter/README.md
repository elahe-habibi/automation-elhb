JMeter Performance Testing Suite
This directory contains Apache JMeter performance test plans designed to evaluate the stability, scalability, and response time of backend APIs under load.

The goal of these tests is to simulate realistic user traffic and analyze system behavior under different load conditions.

Overview
The test plans included in this folder are used to perform load and stress testing on API endpoints.

They simulate multiple concurrent users sending requests to the system and help identify:

Performance bottlenecks
Response time degradation
System stability under heavy load
Potential failure points
Tools & Technologies
Apache JMeter
HTTP Request Samplers
Thread Groups
Performance Listeners
Load Testing Scenarios
Project Structure
Test Plan.jmx

Main JMeter test plan containing the overall configuration and test structure.

Thread Group.jmx

Defines the number of virtual users, ramp‑up period, and iteration count for load simulation.

3000.jmx

Load testing scenario designed to simulate a high number of concurrent users.

trackevent.jmx

Performance test targeting specific API endpoints.

initCrash_clean.jmx / initCrash_updated.jmx

Test scenarios used to validate system stability under repeated requests.

secrets.properties.example

Example configuration file for environment variables or secrets used during test execution.

Running the Tests
Run a test plan using the JMeter GUI
Open Apache JMeter
Select File → Open
Choose one of the .jmx test plans
Click Start to execute the test
Run a test from the command line (recommended for performance testing)
bash
jmeter -n -t TestPlan.jmx -l results.jtl
Where:

-n runs JMeter in non‑GUI mode
-t specifies the test plan file
-l specifies the result log file
Performance Reports
After executing a test, you can generate an HTML performance report:

bash
jmeter -g results.jtl -o report
This report provides insights into:

Response times
Throughput
Error rates
System performance trends
Best Practices
Always run performance tests in non‑GUI mode for accurate results.
Gradually increase the number of users to observe system behavior.
Monitor server resources (CPU, memory, database connections) during testing.
👤 Author: Elahe Habibi

QA Automation Engineer

:::
