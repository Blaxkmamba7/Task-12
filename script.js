// ================================
//  SAFRecords GPA Calculator
//  script.js
// ================================

const GRADE_SCALE = {
  // Nigerian 5-point scale
  5.0: 'A',
  4.0: 'B',
  3.0: 'C',
  2.0: 'D',
  1.0: 'E',
  0.0: 'F'
};

// ── DOM References ──
const courseBody    = document.getElementById('courseBody');
const addRowBtn     = document.getElementById('addRowBtn');
const resetBtn      = document.getElementById('resetBtn');
const calculateBtn  = document.getElementById('calculateBtn');
const resultSection = document.getElementById('resultSection');
const advisorSection= document.getElementById('advisorSection');
const printBtn      = document.getElementById('printBtn');
const adviseBtn     = document.getElementById('adviseBtn');

let rowCount = 0;

// ── Initialise with 5 rows ──
window.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  if (rowCount === 0) {
    for (let i = 0; i < 5; i++) addRow();
  }
});

// ── Add a new course row ──
function addRow(data = {}) {
  rowCount++;
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', rowCount);

  tr.innerHTML = `
    <td><span class="row-num">${String(rowCount).padStart(2, '0')}</span></td>
    <td><input type="text"   class="course-name"  placeholder="e.g. Mathematics 101" value="${data.name || ''}" /></td>
    <td><input type="number" class="course-grade" placeholder="0 – 5" min="0" max="5" step="0.01" value="${data.grade ?? ''}" /></td>
    <td><input type="number" class="course-credit" placeholder="e.g. 3" min="1" max="6" step="1" value="${data.credit || ''}" /></td>
    <td><button class="btn btn-danger remove-btn" title="Remove row">✕</button></td>
  `;

  tr.querySelector('.remove-btn').addEventListener('click', () => {
    tr.remove();
    reNumberRows();
    saveToStorage();
  });

  // Auto-save on input
  tr.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', saveToStorage);
  });

  courseBody.appendChild(tr);
}

// ── Renumber rows after deletion ──
function reNumberRows() {
  const rows = courseBody.querySelectorAll('tr');
  rows.forEach((row, i) => {
    row.setAttribute('data-id', i + 1);
    row.querySelector('.row-num').textContent = String(i + 1).padStart(2, '0');
  });
  rowCount = rows.length;
}

// ── Add row button ──
addRowBtn.addEventListener('click', () => {
  addRow();
  // Scroll to new row
  courseBody.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ── Reset ──
resetBtn.addEventListener('click', () => {
  if (!confirm('Reset all course data?')) return;
  courseBody.innerHTML = '';
  rowCount = 0;
  for (let i = 0; i < 5; i++) addRow();
  resultSection.style.display = 'none';
  advisorSection.style.display = 'none';
  clearStorage();
});

// ── Calculate GPA ──
calculateBtn.addEventListener('click', () => {
  const rows = courseBody.querySelectorAll('tr');
  let totalQP = 0;
  let totalCredits = 0;
  let hasError = false;
  const breakdown = [];

  rows.forEach(row => {
    const nameEl   = row.querySelector('.course-name');
    const gradeEl  = row.querySelector('.course-grade');
    const creditEl = row.querySelector('.course-credit');

    // Clear previous error
    [nameEl, gradeEl, creditEl].forEach(el => el.classList.remove('error'));

    const name   = nameEl.value.trim();
    const grade  = parseFloat(gradeEl.value);
    const credit = parseInt(creditEl.value);

    // Skip completely empty rows
    if (!name && isNaN(grade) && isNaN(credit)) return;

    // Validate
    let rowError = false;

    if (!name) { nameEl.classList.add('error'); rowError = true; }
    if (isNaN(grade) || grade < 0 || grade > 5) { gradeEl.classList.add('error'); rowError = true; }
    if (isNaN(credit) || credit < 1) { creditEl.classList.add('error'); rowError = true; }

    if (rowError) { hasError = true; return; }

    const qp = grade * credit;
    totalQP += qp;
    totalCredits += credit;
    breakdown.push({ name, grade, credit, qp });
  });

  if (hasError) {
    showToast('⚠ Please fix the highlighted fields before calculating.', 'error');
    return;
  }

  if (breakdown.length === 0) {
    showToast('⚠ Please enter at least one valid course.', 'error');
    return;
  }

  const gpa = totalQP / totalCredits;

  // ── Display Results ──
  document.getElementById('gpaValue').textContent     = gpa.toFixed(2);
  document.getElementById('totalCredits').textContent  = totalCredits;
  document.getElementById('totalCourses').textContent  = breakdown.length;
  document.getElementById('classification').textContent = classify(gpa);

  // Summary table
  const summaryBody = document.getElementById('summaryBody');
  summaryBody.innerHTML = '';
  breakdown.forEach(item => {
    const letterGrade = getLetterGrade(item.grade);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.grade.toFixed(2)} (${letterGrade})</td>
      <td>${item.credit}</td>
      <td>${item.qp.toFixed(2)}</td>
    `;
    summaryBody.appendChild(tr);
  });

  // Show sections
  resultSection.style.display = 'block';
  advisorSection.style.display = 'block';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Animate GPA value
  animateValue('gpaValue', 0, gpa, 800);

  showToast('✓ GPA calculated successfully!', 'success');
  saveToStorage();
});

// ── GPA Classification ──
function classify(gpa) {
  if (gpa >= 4.50) return 'First Class Honours 🎖';
  if (gpa >= 3.50) return 'Second Class Upper 🥇';
  if (gpa >= 2.40) return 'Second Class Lower 🥈';
  if (gpa >= 1.50) return 'Third Class 🥉';
  if (gpa >= 1.00) return 'Pass';
  return 'Fail ❌';
}

// ── Letter Grade from point ──
function getLetterGrade(point) {
  if (point >= 4.5) return 'A';
  if (point >= 3.5) return 'B';
  if (point >= 2.4) return 'C';
  if (point >= 1.5) return 'D';
  if (point >= 1.0) return 'E';
  return 'F';
}

// ── Animated counter ──
function animateValue(id, start, end, duration) {
  const el = document.getElementById(id);
  const range = end - start;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (start + range * eased).toFixed(2);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// ── Performance Advisor ──
adviseBtn.addEventListener('click', () => {
  const targetInput = document.getElementById('targetGPA');
  const target = parseFloat(targetInput.value);
  const currentGPA = parseFloat(document.getElementById('gpaValue').textContent);
  const output = document.getElementById('advisorOutput');

  if (isNaN(target) || target < 0 || target > 5) {
    targetInput.style.borderColor = 'var(--danger)';
    showToast('⚠ Please enter a valid target GPA (0–5).', 'error');
    return;
  }

  targetInput.style.borderColor = '';

  const diff = target - currentGPA;
  let advice = '';

  if (diff <= 0) {
    advice = `
      <strong>🎉 You've already met or exceeded your target GPA!</strong><br>
      Your current GPA of <strong>${currentGPA.toFixed(2)}</strong> is ${Math.abs(diff).toFixed(2)} points 
      ${diff < 0 ? 'above' : 'equal to'} your target of <strong>${target.toFixed(2)}</strong>.<br><br>
      <ul>
        <li>Keep maintaining your performance across all courses.</li>
        <li>Focus on consistency in high-credit courses.</li>
        <li>Consider challenging yourself with more advanced subjects.</li>
      </ul>
    `;
  } else {
    const neededPerCourse = (target * getEstimatedTotalCredits() - currentGPA * getEstimatedTotalCredits()) / 3;
    advice = `
      <strong>📈 You need to improve by ${diff.toFixed(2)} GPA points.</strong><br>
      Current GPA: <strong>${currentGPA.toFixed(2)}</strong> → Target: <strong>${target.toFixed(2)}</strong><br><br>
      <ul>
        <li>Aim for grades of <strong>${getTargetGradeLabel(target)}</strong> or above in your upcoming courses.</li>
        <li>Prioritise high-credit-hour courses — they have the most impact on your GPA.</li>
        <li>Retake any failed or low-grade courses where possible.</li>
        <li>Consistent improvement across <strong>3–5 courses</strong> can significantly lift your GPA.</li>
        ${diff > 1.5 ? '<li>Consider speaking with your academic advisor for a personalised study plan.</li>' : ''}
      </ul>
    `;
  }

  output.innerHTML = advice;
  output.classList.add('show');
});

function getEstimatedTotalCredits() {
  const val = parseInt(document.getElementById('totalCredits').textContent);
  return isNaN(val) || val === 0 ? 15 : val;
}

function getTargetGradeLabel(target) {
  if (target >= 4.5) return 'A (4.5–5.0)';
  if (target >= 3.5) return 'B (3.5–4.4)';
  if (target >= 2.4) return 'C (2.4–3.4)';
  return 'D or above';
}

// ── Print ──
printBtn.addEventListener('click', () => window.print());

// ── Toast Notification ──
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    background: type === 'error' ? 'var(--danger)' : 'var(--accent)',
    color: '#0a0a0f',
    padding: '0.9rem 1.4rem',
    borderRadius: '10px',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '0.9rem',
    zIndex: '9999',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    animation: 'fadeUp 0.3s ease'
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── LocalStorage ──
function saveToStorage() {
  const rows = courseBody.querySelectorAll('tr');
  const data = [];
  rows.forEach(row => {
    data.push({
      name:   row.querySelector('.course-name')?.value  || '',
      grade:  row.querySelector('.course-grade')?.value || '',
      credit: row.querySelector('.course-credit')?.value|| ''
    });
  });
  try {
    localStorage.setItem('safrecords_gpa_data', JSON.stringify(data));
  } catch (e) { /* storage unavailable */ }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('safrecords_gpa_data');
    if (!raw) return;
    const data = JSON.parse(raw);
    data.forEach(item => addRow(item));
  } catch (e) { /* invalid data */ }
}

function clearStorage() {
  try { localStorage.removeItem('safrecords_gpa_data'); } catch (e) {}
}
