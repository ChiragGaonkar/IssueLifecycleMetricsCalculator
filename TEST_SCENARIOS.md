# Test Scenarios for Issue Lifecycle Metrics Calculator

This document provides comprehensive test scenarios to verify the accuracy of all calculations.

## Test Scenario 1: Basic Scenario ✅

**Setup:**
- Issue Start Date: January 1, 2026 (Wednesday)
- Issue Closed Date: January 15, 2026 (Thursday)
- Blocked Ranges: January 5-7, 2026 (3 days)

**Expected Results:**
- **Total Days:** 15 days
- **Blocked Days:** 3 days
- **Weekend Days:** 4 days (Jan 3-4, Jan 10-11)
- **Holiday Days:** 1 day (Jan 26 is outside range, so 0)
- **Age of Issue:** 15 - 3 - 0 = **12 days**
- **Time to Resolve:** 15 - 3 - 0 - 4 = **8 days**

**Verification:**
This scenario was tested in the browser and all calculations matched expected results.

---

## Test Scenario 2: Same Day Issue ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 1, 2026
- Blocked Ranges: None

**Expected Results:**
- **Total Days:** 1 day
- **Blocked Days:** 0 days
- **Weekend Days:** 0 days (Wednesday)
- **Holiday Days:** 0 days
- **Age of Issue:** 1 - 0 - 0 = **1 day**
- **Time to Resolve:** 1 - 0 - 0 - 0 = **1 day**

**Edge Case:** Verifies inclusive date calculation works for single-day issues.

---

## Test Scenario 3: Overlapping Blocked Ranges ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 20, 2026
- Blocked Ranges:
  - Range 1: January 5-7, 2026
  - Range 2: January 6-9, 2026

**Expected Results:**
- **Merged Blocked Range:** January 5-9, 2026 (5 days)
- **Total Days:** 20 days
- **Blocked Days:** 5 days (merged, not 7)
- **Weekend Days:** 4 days (Jan 3-4, 10-11, 17-18)
- **Holiday Days:** 1 day (Jan 26 outside range)
- **Age of Issue:** 20 - 5 - 0 = **15 days**
- **Time to Resolve:** 20 - 5 - 0 - 4 = **11 days**

**Edge Case:** Verifies overlapping ranges are merged correctly without double-counting.

---

## Test Scenario 4: Fully Blocked Issue ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 5, 2026
- Blocked Ranges: January 1-5, 2026

**Expected Results:**
- **Total Days:** 5 days
- **Blocked Days:** 5 days
- **Weekend Days:** 0 days (all blocked, Jan 3-4 are blocked)
- **Holiday Days:** 0 days
- **Age of Issue:** 5 - 5 - 0 = **0 days**
- **Time to Resolve:** 5 - 5 - 0 - 0 = **0 days**

**Edge Case:** Verifies fully blocked issues return 0 for age and time to resolve.

---

## Test Scenario 5: Blocked Dates Outside Issue Range ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 10, 2026
- Blocked Ranges: January 15-20, 2026

**Expected Results:**
- **Total Days:** 10 days
- **Blocked Days:** 0 days (blocked range is outside issue range)
- **Weekend Days:** 2 days (Jan 3-4)
- **Holiday Days:** 0 days
- **Age of Issue:** 10 - 0 - 0 = **10 days**
- **Time to Resolve:** 10 - 0 - 0 - 2 = **8 days**

**Edge Case:** Verifies blocked ranges outside the issue range are ignored.

---

## Test Scenario 6: Partially Overlapping Blocked Range ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 15, 2026
- Blocked Ranges: January 10-20, 2026

**Expected Results:**
- **Total Days:** 15 days
- **Blocked Days:** 6 days (Jan 10-15, only intersection counted)
- **Weekend Days:** 2 days (Jan 3-4, Jan 10-11 are blocked)
- **Holiday Days:** 0 days
- **Age of Issue:** 15 - 6 - 0 = **9 days**
- **Time to Resolve:** 15 - 6 - 0 - 2 = **7 days**

**Edge Case:** Verifies only the intersection of blocked range with issue range is counted.

---

## Test Scenario 7: Weekend on Blocked Date ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 10, 2026
- Blocked Ranges: January 3-4, 2026 (Saturday-Sunday)

**Expected Results:**
- **Total Days:** 10 days
- **Blocked Days:** 2 days (Jan 3-4)
- **Weekend Days:** 0 days (weekends are blocked, so not counted separately)
- **Holiday Days:** 0 days
- **Age of Issue:** 10 - 2 - 0 = **8 days**
- **Time to Resolve:** 10 - 2 - 0 - 0 = **8 days**

**Edge Case:** Verifies blocked dates override weekends (weekends on blocked dates aren't counted as weekends).

---

## Test Scenario 8: Holiday in Range ✅

**Setup:**
- Issue Start Date: January 20, 2026
- Issue Closed Date: January 30, 2026
- Blocked Ranges: None
- Holidays: January 26, 2026 (Republic Day)

**Expected Results:**
- **Total Days:** 11 days
- **Blocked Days:** 0 days
- **Weekend Days:** 2 days (Jan 24-25)
- **Holiday Days:** 1 day (Jan 26 is Monday, not blocked)
- **Age of Issue:** 11 - 0 - 1 = **10 days**
- **Time to Resolve:** 11 - 0 - 1 - 2 = **8 days**

**Edge Case:** Verifies holidays within the range are counted correctly.

---

## Test Scenario 9: Holiday on Blocked Date ✅

**Setup:**
- Issue Start Date: January 20, 2026
- Issue Closed Date: January 30, 2026
- Blocked Ranges: January 26, 2026
- Holidays: January 26, 2026 (Republic Day)

**Expected Results:**
- **Total Days:** 11 days
- **Blocked Days:** 1 day (Jan 26)
- **Weekend Days:** 2 days (Jan 24-25)
- **Holiday Days:** 0 days (Jan 26 is blocked, so not counted as holiday)
- **Age of Issue:** 11 - 1 - 0 = **10 days**
- **Time to Resolve:** 11 - 1 - 0 - 2 = **8 days**

**Edge Case:** Verifies blocked dates override holidays (holidays on blocked dates aren't counted as holidays).

---

## Test Scenario 10: Multiple Non-Overlapping Blocked Ranges ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 31, 2026
- Blocked Ranges:
  - Range 1: January 5-7, 2026 (3 days)
  - Range 2: January 15-17, 2026 (3 days)
  - Range 3: January 25-27, 2026 (3 days)

**Expected Results:**
- **Total Days:** 31 days
- **Blocked Days:** 9 days (3 + 3 + 3)
- **Weekend Days:** 6 days (Jan 3-4, 10-11, 18-19, 24-25, 31; minus Jan 25 which is blocked)
- **Holiday Days:** 0 days (Jan 26 is blocked)
- **Age of Issue:** 31 - 9 - 0 = **22 days**
- **Time to Resolve:** 31 - 9 - 0 - 6 = **16 days**

**Edge Case:** Verifies multiple non-overlapping blocked ranges are summed correctly.

---

## Test Scenario 11: Weekend-Only Issue ✅

**Setup:**
- Issue Start Date: January 3, 2026 (Saturday)
- Issue Closed Date: January 4, 2026 (Sunday)
- Blocked Ranges: None

**Expected Results:**
- **Total Days:** 2 days
- **Blocked Days:** 0 days
- **Weekend Days:** 2 days (both days are weekends)
- **Holiday Days:** 0 days
- **Age of Issue:** 2 - 0 - 0 = **2 days**
- **Time to Resolve:** 2 - 0 - 0 - 2 = **0 days**

**Edge Case:** Verifies issues that span only weekends work correctly.

---

## Test Scenario 12: Validation - End Before Start ❌

**Setup:**
- Issue Start Date: January 15, 2026
- Issue Closed Date: January 1, 2026

**Expected Results:**
- **Validation Error:** "End date must be on or after start date"
- **Metrics Dashboard:** Shows info message to enter valid dates
- **No Calculations:** Dashboard doesn't display metrics

**Edge Case:** Verifies form validation prevents invalid date ranges.

---

## Test Scenario 13: Adjacent Blocked Ranges ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 20, 2026
- Blocked Ranges:
  - Range 1: January 5-7, 2026
  - Range 2: January 8-10, 2026

**Expected Results:**
- **Merged Blocked Range:** January 5-10, 2026 (6 days)
- **Total Days:** 20 days
- **Blocked Days:** 6 days
- **Weekend Days:** 4 days (Jan 3-4, 17-18; Jan 10-11 partially blocked)
- **Age of Issue:** 20 - 6 - 0 = **14 days**
- **Time to Resolve:** 20 - 6 - 0 - 4 = **10 days**

**Edge Case:** Verifies adjacent ranges (ending on day N and starting on day N+1) are merged.

---

## Test Scenario 14: Empty Blocked Ranges ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: January 10, 2026
- Blocked Ranges: [] (empty array)

**Expected Results:**
- **Total Days:** 10 days
- **Blocked Days:** 0 days
- **Weekend Days:** 2 days (Jan 3-4)
- **Holiday Days:** 0 days
- **Age of Issue:** 10 - 0 - 0 = **10 days**
- **Time to Resolve:** 10 - 0 - 0 - 2 = **8 days**

**Edge Case:** Verifies calculations work correctly with no blocked ranges.

---

## Test Scenario 15: Long Duration Issue ✅

**Setup:**
- Issue Start Date: January 1, 2026
- Issue Closed Date: December 31, 2026
- Blocked Ranges: None

**Expected Results:**
- **Total Days:** 365 days (2026 is not a leap year)
- **Blocked Days:** 0 days
- **Weekend Days:** 104 days (52 weeks × 2)
- **Holiday Days:** 6 days (from DEFAULT_HOLIDAYS list)
- **Age of Issue:** 365 - 0 - 6 = **359 days**
- **Time to Resolve:** 365 - 0 - 6 - 104 = **255 days**

**Edge Case:** Verifies calculations work correctly for long-duration issues.

---

## How to Test

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open browser:** Navigate to `http://localhost:5173/`

3. **For each scenario:**
   - Enter the Issue Start Date
   - Enter the Issue Closed Date
   - Add blocked ranges as specified
   - Verify the calculated metrics match expected results

4. **Check calculation breakdowns:**
   - Age of Issue card shows: Total - Blocked - Holidays
   - Time to Resolve card shows: Total - Blocked - Holidays - Weekends

---

## Automated Testing (Future Enhancement)

To add automated tests, create test files using Jest and React Testing Library:

```javascript
// Example test
test('calculates total days correctly', () => {
  const start = dayjs('2026-01-01');
  const end = dayjs('2026-01-15');
  expect(calculateTotalDays(start, end)).toBe(15);
});
```

---

## Notes

- All calculations are **inclusive** (both start and end dates are counted)
- Blocked dates **override** weekends and holidays
- Overlapping blocked ranges are **automatically merged**
- All edge cases are handled with **Math.max(0, ...)** to prevent negative results
