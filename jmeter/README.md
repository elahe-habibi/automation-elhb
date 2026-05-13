# JMeter Performance Test Suite

This directory contains **Apache JMeter performance test plans** used for evaluating the
performance, scalability, and stability of backend services under different load conditions.

The goal of these tests is to simulate real‑world traffic patterns and identify potential
bottlenecks before production deployment.

---

## 🚀 Key Features

- Load testing with multiple concurrent users  
- Stress & endurance testing  
- API performance validation  
- Response time measurement  
- Error rate monitoring  
- Supports CLI execution for CI/CD pipelines  

---

## 📁 Project Structure

| File | Description |
|------|-------------|
| **TestPlan.jmx** | Main JMeter test plan containing overall configuration |
| **Thread Group.jmx** | Defines virtual users, ramp‑up time, and iterations |
| **3000.jmx** | Heavy load simulation using 3000 virtual users |
| **trackevent.jmx** | Performance test for specific API endpoints |
| **initCrash_clean.jmx / initCrash_updated.jmx** | Stability test under repeated requests |
| **secrets.properties.example** | Sample environment configuration |

---

## ▶️ How to Run Tests (JMeter GUI)

1. Open **Apache JMeter**
2. Go to: **File → Open**
3. Select any `.jmx` test plan
4. Click **Start**
5. Monitor the performance metrics in:
   - View Results Tree  
   - Summary Report  
   - Aggregate Report  

---

## 🖥️ How to Run Tests (CLI – Recommended)

### Run test in non‑GUI mode
```bash
jmeter -n -t TestPlan.jmx -l results.jtl
Parameters
-n → Run in non‑GUI mode
-t → Path to the test plan
-l → Log results to a file
📊 Generate HTML Performance Report
bash
jmeter -g results.jtl -o report
This report includes:

Response times (avg, min, max)
Percentiles (90, 95, 99)
Throughput
Error rate
Performance trends
💡 Best Practices
Always run performance tests in non‑GUI mode
Increase users gradually to avoid server overload
Monitor server metrics:
CPU
Memory
Network I/O
Database connections
Use realistic think‑time in Thread Groups
Use property files for configuring environments
👤 Author
Elahe Habibi

QA Automation Engineer
