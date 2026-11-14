const fs = require('fs');

let content = fs.readFileSync("src/AdminDashboard.jsx", "utf-8");

const old_overview_wrapper = `{payrollTab === "overview" && (
                      <>
                        {!isPayrollDetailOpen ? (
                          <>
                            <div className="payroll-main">`;

const new_overview_wrapper = `{payrollTab === "overview" && (() => {
                      const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
                      const currentYear = new Date().getFullYear();
                      const lastDayOfMonth = new Date(currentYear, new Date().getMonth() + 1, 0).getDate();
                      const activeStaffCount = staffs.length;
                      
                      const totalGross = staffs.reduce((acc, s) => acc + (parseInt(String(s.salary || '0').replace(/[^\\d]/g, '')) || 0), 0);
                      const totalEPF = activeStaffCount * 1800;
                      const totalESI = totalGross * 0.0075;
                      const totalTDS = activeStaffCount * 650;
                      
                      const totalNetPay = staffs.reduce((acc, s) => {
                        const gross = parseInt(String(s.salary || '0').replace(/[^\\d]/g, '')) || 0;
                        const daily = gross / 30;
                        const leaveDed = daily * (s.leaves || 0);
                        const permDed = (daily / 8) * (s.permissions || 0);
                        return acc + (gross - leaveDed - permDed - 2450);
                      }, 0);
                      const pendingLeavesCount = leaves ? leaves.filter(l => l.status === 'PENDING').length : 0;

                      return (
                        <>
                          {!isPayrollDetailOpen ? (
                            <>
                              <div className="payroll-main">`;
content = content.replace(old_overview_wrapper, new_overview_wrapper);

content = content.replace("<span>Process Pay Run for May 2024</span>", "<span>Process Pay Run for {currentMonthName} {currentYear}</span>");

const old_amount = `<div className="amount">
                                        ₹{staffs.reduce((acc, s) => {
                                          const gross = parseInt(String(s.salary || '0').replace(/[^\\d]/g, '')) || 0;
                                          const daily = gross / 30;
                                          const leaveDed = daily * (s.leaves || 0);
                                          const permDed = (daily / 8) * (s.permissions || 0);
                                          return acc + (gross - leaveDed - permDed - 2450);
                                        }, 0).toLocaleString()}
                                      </div>`;
const new_amount = `<div className="amount">₹{Math.floor(totalNetPay).toLocaleString()}</div>`;
content = content.replace(old_amount, new_amount);

content = content.replace('<div className="date">31 May 2024</div>', '<div className="date">{lastDayOfMonth} {currentMonthName} {currentYear}</div>');
content = content.replace('<div className="count">1308</div>', '<div className="count">{activeStaffCount}</div>');
content = content.replace('<Clock size={12} /> Pay your employees on 31/05/2024. Record it here once you made the payment.', '<Clock size={12} /> Pay your employees on {lastDayOfMonth}/{String(new Date().getMonth() + 1).padStart(2, \'0\')}/{currentYear}. Record it here once you made the payment.');
content = content.replace('<select className="small-select"><option>Previous Month</option></select>', '<select className="small-select"><option>Current Month</option></select>');
content = content.replace('<div className="val">₹39,73,913.00</div>', '<div className="val">₹{Math.floor(totalEPF).toLocaleString()}</div>');
content = content.replace('<div className="val">₹91,010.00</div>', '<div className="val">₹{Math.floor(totalESI).toLocaleString()}</div>');
content = content.replace('<div className="val">₹1,15,89,089.00</div>', '<div className="val">₹{Math.floor(totalTDS).toLocaleString()}</div>');

content = content.replace('<div className="big-count">1308</div>', '<div className="big-count">{activeStaffCount}</div>');
content = content.replace('<span className="link">View Employees</span>', '<span className="link" onClick={() => setIsPayrollDetailOpen(true)} style={{cursor: \'pointer\'}}>View Employees</span>');

const old_task_list = `<div className="task-list">
                                {[
                                  { label: "136 Reimbursement Claim(s)", sub: "Pending Approval" },
                                  { label: "96 Proof of Investment(s)", sub: "Pending Approval" },
                                  { label: "55 Salary Revision(s)", sub: "Pending Approval" }
                                ].map((task, i) => (
                                  <div key={i} className="task-item">
                                    <div className="task-info"><h6>{task.label}</h6><p>{task.sub}</p></div>
                                    <button className="btn-outline">Approve</button>
                                  </div>
                                ))}
                              </div>`;
const new_task_list = `<div className="task-list">
                                {pendingLeavesCount > 0 ? (
                                  <div className="task-item">
                                    <div className="task-info"><h6>{pendingLeavesCount} Leave Request(s)</h6><p>Pending Approval</p></div>
                                    <button className="btn-outline" onClick={() => setPayrollTab('attendance')}>Review</button>
                                  </div>
                                ) : (
                                  <div className="task-item">
                                    <div className="task-info"><h6 className="text-muted">All Caught Up!</h6><p>No pending leaves</p></div>
                                  </div>
                                )}
                                <div className="task-item">
                                  <div className="task-info"><h6>0 Reimbursement Claim(s)</h6><p>Pending Approval</p></div>
                                  <button className="btn-outline">Review</button>
                                </div>
                                <div className="task-item">
                                  <div className="task-info"><h6>0 Salary Revision(s)</h6><p>Pending Approval</p></div>
                                  <button className="btn-outline">Review</button>
                                </div>
                              </div>`;
content = content.replace(old_task_list, new_task_list);

content = content.replace('<h2>Payroll <small>DETAILS / MAY 2024</small></h2>', '<h2>Payroll <small>DETAILS / {currentMonthName.toUpperCase()} {currentYear}</small></h2>');

const old_overview_close = `                          </div>
                        )}
                      </>
                    )}`;
const new_overview_close = `                          </div>
                        )}
                      </>
                      );
                    })()}`;
content = content.replace(old_overview_close, new_overview_close);

const old_payruns = `{payrollTab === "payruns" && (
                      <div className="payroll-main animate-in">
                        <header className="payroll-header">
                          <h1 className="welcome">Pay Runs</h1>
                          <button className="btn-black"><Plus size={18} /> Create Pay Run</button>
                        </header>
                        <div className="payrun-list">
                          {[
                            { month: "May 2024", status: "PROCESSING", amount: "₹17,25,230", employees: 1308, date: "May 31, 2024" },
                            { month: "April 2024", status: "COMPLETED", amount: "₹16,80,450", employees: 1295, date: "Apr 30, 2024" },
                            { month: "March 2024", status: "COMPLETED", amount: "₹16,50,000", employees: 1280, date: "Mar 31, 2024" }
                          ].map((run, i) => (
                            <div key={i} className="payrun-card">
                              <div className="run-info">
                                <h3>{run.month}</h3>
                                <p>Scheduled for {run.date}</p>
                              </div>
                              <div className="run-stats">
                                <div><label>NET PAY</label><strong>{run.amount}</strong></div>
                                <div><label>EMPLOYEES</label><strong>{run.employees}</strong></div>
                              </div>
                              <div className="run-status">
                                <span className={\`badge \${run.status === 'COMPLETED' ? 'bg-success-light' : 'bg-primary-light'}\`}>{run.status}</span>
                              </div>
                              <button className="btn-outline">View Details</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}`;

// Construct new payruns carefully to avoid string literal interpolation issues in Node
const new_payruns = '{payrollTab === "payruns" && (() => {\n' +
'  const currentDate = new Date();\n' +
'  const runs = [0, 1, 2].map(offset => {\n' +
'    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - offset, 1);\n' +
'    const monthName = d.toLocaleString(\'default\', { month: \'long\' });\n' +
'    const year = d.getFullYear();\n' +
'    const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();\n' +
'    const shortMonth = d.toLocaleString(\'default\', { month: \'short\' });\n' +
'    const totalNetPay = staffs.reduce((acc, s) => {\n' +
'      const gross = parseInt(String(s.salary || \'0\').replace(/[^\\d]/g, \'\')) || 0;\n' +
'      return acc + (gross - 2450);\n' +
'    }, 0);\n' +
'    return {\n' +
'      month: monthName + " " + year,\n' +
'      status: offset === 0 ? "PROCESSING" : "COMPLETED",\n' +
'      amount: "₹" + Math.floor(totalNetPay).toLocaleString(),\n' +
'      employees: staffs.length,\n' +
'      date: shortMonth + " " + lastDay + ", " + year\n' +
'    };\n' +
'  });\n' +
'  return (\n' +
'    <div className="payroll-main animate-in">\n' +
'      <header className="payroll-header">\n' +
'        <h1 className="welcome">Pay Runs</h1>\n' +
'        <button className="btn-black"><Plus size={18} /> Create Pay Run</button>\n' +
'      </header>\n' +
'      <div className="payrun-list">\n' +
'        {runs.map((run, i) => (\n' +
'          <div key={i} className="payrun-card">\n' +
'            <div className="run-info">\n' +
'              <h3>{run.month}</h3>\n' +
'              <p>Scheduled for {run.date}</p>\n' +
'            </div>\n' +
'            <div className="run-stats">\n' +
'              <div><label>NET PAY</label><strong>{run.amount}</strong></div>\n' +
'              <div><label>EMPLOYEES</label><strong>{run.employees}</strong></div>\n' +
'            </div>\n' +
'            <div className="run-status">\n' +
'              <span className={"badge " + (run.status === \'COMPLETED\' ? \'bg-success-light\' : \'bg-primary-light\')}>{run.status}</span>\n' +
'            </div>\n' +
'            <button className="btn-outline">View Details</button>\n' +
'          </div>\n' +
'        ))}\n' +
'      </div>\n' +
'    </div>\n' +
'  );\n' +
'})()}';

content = content.replace(old_payruns, new_payruns);

const old_attendance = `{payrollTab === "attendance" && (
                      <div className="payroll-main animate-in">
                        <header className="payroll-header">
                          <h1 className="welcome">Leave & Attendance</h1>
                          <div className="d-flex gap-2">
                            <button className="btn-outline">Attendance Logs</button>
                            <button className="btn-black">Leave Policy</button>
                          </div>
                        </header>
                        <div className="attendance-grid">
                          <div className="grid-card">
                            <h5>Pending Leave Requests</h5>
                            <div className="request-list">
                              {leaves && leaves.filter(l => l.status === 'PENDING').length > 0 ? (
                                leaves.filter(l => l.status === 'PENDING').slice(0, 5).map((req, i) => (
                                  <div key={i} className="request-item">
                                    <div className="req-profile">
                                      <div className="avatar-small">{(req.staffName || "S").charAt(0)}</div>
                                      <div><strong>{req.staffName}</strong><p>{req.leaveType}</p></div>
                                    </div>
                                    <div className="req-details">
                                      <span className="type">{req.reason}</span>
                                      <span className="dates">{req.startDate} to {req.endDate}</span>
                                    </div>
                                    <div className="req-actions">
                                      <button className="btn-icon text-success" onClick={() => updateLeaveStatus(req.id, 'APPROVED')}><CheckCircle size={18} /></button>
                                      <button className="btn-icon text-danger" onClick={() => updateLeaveStatus(req.id, 'REJECTED')}><XCircle size={18} /></button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No pending leave requests.</div>
                              )}
                            </div>
                          </div>
                          <div className="grid-card">
                            <h5>Monthly Attendance Summary</h5>
                            <div className="summary-list">
                              <div className="summary-item"><span>Present Today</span> <strong>128/130</strong></div>
                              <div className="summary-item"><span>On Leave</span> <strong>2</strong></div>
                              <div className="summary-item"><span>Late Arrivals</span> <strong>5</strong></div>
                            </div>
                            <button className="btn-outline w-100 mt-3">View Full Report</button>
                          </div>
                        </div>
                      </div>
                    )}`;

const new_attendance = `{payrollTab === "attendance" && (() => {
                      const todayStr = new Date().toISOString().split('T')[0];
                      const todayAttendance = attendance.filter(a => ((a.date || a.attendanceDate) === todayStr) && a.staff?.id);
                      
                      const presentToday = todayAttendance.filter(a => a.status === 'PRESENT' || a.status === 'P' || !a.status).length;
                      const onLeaveToday = todayAttendance.filter(a => a.status === 'LEAVE' || a.status === 'L').length;
                      const lateArrivals = todayAttendance.filter(a => a.checkInTime && a.checkInTime > '09:00:00').length;
                      const totalActiveStaff = staffs.length;

                      return (
                      <div className="payroll-main animate-in">
                        <header className="payroll-header">
                          <h1 className="welcome">Leave & Attendance</h1>
                          <div className="d-flex gap-2">
                            <button className="btn-outline">Attendance Logs</button>
                            <button className="btn-black">Leave Policy</button>
                          </div>
                        </header>
                        <div className="attendance-grid">
                          <div className="grid-card">
                            <h5>Pending Leave Requests</h5>
                            <div className="request-list">
                              {leaves && leaves.filter(l => l.status === 'PENDING').length > 0 ? (
                                leaves.filter(l => l.status === 'PENDING').slice(0, 5).map((req, i) => (
                                  <div key={i} className="request-item">
                                    <div className="req-profile">
                                      <div className="avatar-small">{(req.staffName || "S").charAt(0)}</div>
                                      <div><strong>{req.staffName}</strong><p>{req.leaveType}</p></div>
                                    </div>
                                    <div className="req-details">
                                      <span className="type">{req.reason}</span>
                                      <span className="dates">{req.startDate} to {req.endDate}</span>
                                    </div>
                                    <div className="req-actions">
                                      <button className="btn-icon text-success" onClick={() => updateLeaveStatus(req.id, 'APPROVED')}><CheckCircle size={18} /></button>
                                      <button className="btn-icon text-danger" onClick={() => updateLeaveStatus(req.id, 'REJECTED')}><XCircle size={18} /></button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No pending leave requests.</div>
                              )}
                            </div>
                          </div>
                          <div className="grid-card">
                            <h5>Daily Attendance Summary</h5>
                            <div className="summary-list">
                              <div className="summary-item"><span>Present Today</span> <strong>{presentToday}/{totalActiveStaff}</strong></div>
                              <div className="summary-item"><span>On Leave</span> <strong>{onLeaveToday}</strong></div>
                              <div className="summary-item"><span>Late Arrivals</span> <strong>{lateArrivals}</strong></div>
                            </div>
                            <button className="btn-outline w-100 mt-3">View Full Report</button>
                          </div>
                        </div>
                      </div>
                      );
                    })()}`;
content = content.replace(old_attendance, new_attendance);

const old_tax = `{payrollTab === "tax" && (
                      <div className="payroll-main animate-in">
                        <header className="payroll-header">
                          <h1 className="welcome">Tax & Forms</h1>
                          <button className="btn-outline"><FileText size={18} /> Tax Calendar</button>
                        </header>
                        <div className="tax-grid">
                          <div className="grid-card">
                            <h5>Statutory Compliances</h5>
                            <div className="tax-list-mini">
                              <div className="tax-item-mini">
                                <div className="tax-icon"><FileCheck size={18} /></div>
                                <div className="tax-info"><strong>EPF Filing</strong><p>Due: June 15, 2024</p></div>
                                <button className="btn-link">Pay Now</button>
                              </div>
                              <div className="tax-item-mini">
                                <div className="tax-icon"><FileCheck size={18} /></div>
                                <div className="tax-info"><strong>ESI Filing</strong><p>Due: June 15, 2024</p></div>
                                <button className="btn-link">Pay Now</button>
                              </div>
                              <div className="tax-item-mini">
                                <div className="tax-icon"><FileCheck size={18} /></div>
                                <div className="tax-info"><strong>TDS Return (Q1)</strong><p>Due: July 31, 2024</p></div>
                                <button className="btn-link disabled">Upcoming</button>
                              </div>
                            </div>
                          </div>
                          <div className="grid-card">
                            <h5>Employee Tax Forms</h5>
                            <div className="form-downloads">
                              <div className="form-item">
                                <span>Form 16 (FY 2023-24)</span>
                                <button className="btn-icon"><ArrowUpRight size={16} /></button>
                              </div>
                              <div className="form-item">
                                <span>Investment Declarations</span>
                                <button className="btn-icon"><ArrowUpRight size={16} /></button>
                              </div>
                              <div className="form-item">
                                <span>Salary Certificates</span>
                                <button className="btn-icon"><ArrowUpRight size={16} /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}`;

const new_tax = '{payrollTab === "tax" && (() => {\n' +
'  const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);\n' +
'  const monthName = nextMonth.toLocaleString(\'default\', { month: \'long\' });\n' +
'  const year = nextMonth.getFullYear();\n' +
'  const qMonth = new Date().getMonth();\n' +
'  const quarterEnds = [2, 5, 8, 11];\n' +
'  const nextQEnd = quarterEnds.find(m => m >= qMonth) ?? 2;\n' +
'  const nextQEndDate = new Date(new Date().getFullYear() + (nextQEnd === 2 && qMonth > 11 ? 1 : 0), nextQEnd + 1, 31);\n' +
'  const tdsDate = nextQEndDate.toLocaleString(\'default\', { month: \'long\' }) + " 31, " + nextQEndDate.getFullYear();\n' +
'  return (\n' +
'    <div className="payroll-main animate-in">\n' +
'      <header className="payroll-header">\n' +
'        <h1 className="welcome">Tax & Forms</h1>\n' +
'        <button className="btn-outline"><FileText size={18} /> Tax Calendar</button>\n' +
'      </header>\n' +
'      <div className="tax-grid">\n' +
'        <div className="grid-card">\n' +
'          <h5>Statutory Compliances</h5>\n' +
'          <div className="tax-list-mini">\n' +
'            <div className="tax-item-mini">\n' +
'              <div className="tax-icon"><FileCheck size={18} /></div>\n' +
'              <div className="tax-info"><strong>EPF Filing</strong><p>Due: {monthName} 15, {year}</p></div>\n' +
'              <button className="btn-link">Pay Now</button>\n' +
'            </div>\n' +
'            <div className="tax-item-mini">\n' +
'              <div className="tax-icon"><FileCheck size={18} /></div>\n' +
'              <div className="tax-info"><strong>ESI Filing</strong><p>Due: {monthName} 15, {year}</p></div>\n' +
'              <button className="btn-link">Pay Now</button>\n' +
'            </div>\n' +
'            <div className="tax-item-mini">\n' +
'              <div className="tax-icon"><FileCheck size={18} /></div>\n' +
'              <div className="tax-info"><strong>TDS Return (Quarterly)</strong><p>Due: {tdsDate}</p></div>\n' +
'              <button className="btn-link disabled">Upcoming</button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div className="grid-card">\n' +
'          <h5>Employee Tax Forms</h5>\n' +
'          <div className="form-downloads">\n' +
'            <div className="form-item">\n' +
'              <span>Form 16 (FY {new Date().getFullYear()-1}-{String(new Date().getFullYear()).slice(2)})</span>\n' +
'              <button className="btn-icon"><ArrowUpRight size={16} /></button>\n' +
'            </div>\n' +
'            <div className="form-item">\n' +
'              <span>Investment Declarations</span>\n' +
'              <button className="btn-icon"><ArrowUpRight size={16} /></button>\n' +
'            </div>\n' +
'            <div className="form-item">\n' +
'              <span>Salary Certificates</span>\n' +
'              <button className="btn-icon"><ArrowUpRight size={16} /></button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>\n' +
'    </div>\n' +
'  );\n' +
'})()}';

content = content.replace(old_tax, new_tax);

fs.writeFileSync("src/AdminDashboard.jsx", content, "utf-8");
