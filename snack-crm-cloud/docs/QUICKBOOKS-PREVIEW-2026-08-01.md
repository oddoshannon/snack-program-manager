# QuickBooks Preview — August 1, 2026

No QuickBooks file, application record, or production setting was changed.
Nothing was imported.

## Reports Reviewed

| Report | Confirmed contents | Safe use |
| --- | --- | --- |
| Statement of Financial Position | Cash basis, as of August 1, 2026 | Confirm ending cash and balance-sheet totals |
| Statement of Activity by Class | Cash basis, January 1-August 1, 2026 | Confirm year-to-date expense totals by class |
| Statement of Cash Flows | January 1-August 1, 2026 | Confirm cash movement and ending cash |
| General Ledger | Cash basis; January-December 2026 header; transactions through July 31 | Validate detailed expense rows only |
| Account List | 72 named accounts plus report headings/totals | Build an editable account-mapping list |
| Statement of Activity by Month | Cash basis, January 1-August 1, 2026 | Preferred source for monthly actual spending |

Each workbook has one worksheet. The General Ledger uses `A1:J458`, contains
413 transaction rows, and has no class or location column.

## Confirmed Results

- The reports show no 2026 income through July 31.
- All 2026 expenses are payroll: $50,984.62 in Wages and $5,139.30 in Taxes.
- Total expenses are $56,123.92.
- The General Ledger contains 66 matching expense rows: 33 Wages rows and 33
  Taxes rows. There are no exact repeated rows inside this expense group.
- The other 347 General Ledger rows belong to cash, payroll liabilities, and
  other balancing accounts. They must not be imported as additional spending.
- The monthly report, class report, and eligible General Ledger rows all total
  $56,123.92.
- Net revenue is -$56,123.92 in the activity, cash-flow, and financial-position
  reports.
- Ending cash is $110,499.59 in both the cash-flow and financial-position
  reports.
- Total assets and total liabilities plus equity both equal $111,780.87.

Monthly expense totals:

| Month | Taxes | Wages | Total |
| --- | ---: | ---: | ---: |
| January | $627.93 | $6,230.66 | $6,858.59 |
| February | $688.23 | $6,826.66 | $7,514.89 |
| March | $687.88 | $6,822.66 | $7,510.54 |
| April | $791.15 | $7,848.16 | $8,639.31 |
| May | $840.41 | $8,335.66 | $9,176.07 |
| June | $755.07 | $7,491.66 | $8,246.73 |
| July | $748.63 | $7,429.16 | $8,177.79 |
| **Total** | **$5,139.30** | **$50,984.62** | **$56,123.92** |

Class totals are $5,394.18 for HRSN, $55.04 for Kids CAN!, and $50,674.70 for
Not specified. About 90% of expense has no class, and the General Ledger cannot
connect individual transactions to a class. The approved source-name mapping is
HRSN to Clinic and Kids CAN! to Kitchen. Not specified requires a private manual
review and must never be forced into General Operations.

## QuickBooks Expense Accounts

The Account List contains 38 editable expense or cost accounts. Only Wages and
Taxes have activity in the supplied 2026 reports, but future imports must be
able to map every applicable account rather than hardcode those two.

Cost of goods sold accounts:

- Cost of Goods Sold
- Shipping

Expense accounts:

- Advertising/Promotional
- Ask My Accountant
- Bank Charges & Fees
- Benefits
- CAM
- Conferences/Meeting
- Contractors
- Insurance
- Interest Paid
- Job Supplies
- Legal & Professional Services
- Meals & Entertainment
- Member benefit
- Office Supplies & Software
- Other Business Expenses
- Payroll Expense - Other
- Payroll Expenses
- Payroll Expenses:Taxes
- Payroll Expenses:Wages
- Payroll Expenses-Exec Director
- Payroll Tax
- Printing
- Purchases
- Recruiting
- Reimbursable Expenses
- Rent & Lease
- Repairs & Maintenance
- Supplies & Materials - misc programs
- Supplies & Materials-cooking lessons
- Taxes & Licenses
- Travel
- Unapplied Cash Bill Payment Expense
- Uncategorized Expense
- Utilities

Other expense accounts:

- Other Miscellaneous Expense
- Reconciliation Discrepancies

Parent accounts and their subaccounts must not both be counted. Uncategorized,
unapplied, Ask My Accountant, and reconciliation-discrepancy entries must be
held for review rather than automatically categorized.

## Recommended Monthly Import Design

Use the private General Ledger review to classify true expense rows, and use the
Statement of Activity by Month to confirm the account totals. Save one total for
each year, month, QuickBooks expense account, and SNACK program. Before program
allocation, this file has 14 account totals: Wages and Taxes for each month from
January through July.

Use a unique combination of year, month, QuickBooks account, and SNACK program
so that a later cumulative report updates the same monthly total instead of
creating a second copy. Keep every account-to-expense-category mapping editable.

Use the detailed General Ledger only in a private Admin classification review
and to prove that monthly totals are supported. It contains employee-level
payroll information and no dependable unique transaction number. Do not store
those detailed rows or expose them in the ordinary staff interface.

For payroll, the director can provide each employee's hours and hourly rate by
program. The review will calculate wage amounts and percentages, then apply the
approved wage split to related payroll taxes. Nonpayroll expenses will be
assigned directly to a program or split across programs. Anything unresolved
stays visibly Unallocated until reviewed.

Keep QuickBooks spending separate from Financial Activity. Financial Activity
is the app's revenue ledger, so placing expenses there would make revenue totals
wrong. A future expense-actuals area should feed the Budget calculations without
changing the existing revenue records or annual budget amounts.

Use the other reports only as checks:

- Activity by Class: year-to-date class check; no automatic program allocation.
- Financial Position and Cash Flows: ending-cash checks.
- Account List: editable mapping choices and exception rules.
- General Ledger: detailed proof during preview, not normal stored app data.

## Required Safety Checks

Before any future write, the preview must show:

1. Report name, reporting period, and cash basis.
2. Every accepted account and its approved SNACK budget category.
3. Every excluded account and the excluded total.
4. Monthly totals tied to the eligible General Ledger rows.
5. Year-to-date total tied to the class report.
6. Ending cash tied between the financial-position and cash-flow reports.
7. Assets tied to liabilities plus equity.
8. Any repeated month/account combination or changed prior-month value.
9. A final no-write confirmation before a separate import approval.

Billable-expense income and other questionable income accounts should be held
for review by default. Revenue mapping is deferred because these reports contain
no 2026 revenue transactions.

## Values That Cannot Be Produced Yet

- Budget variance: QuickBooks has no Budget vs. Actual report, and no other
  approved budget source was supplied.
- Accounts receivable or payable aging: both aging reports were empty.
- Restricted months of cash: the reports do not separate restricted and
  unrestricted cash. Total cash divided by the latest three-month average
  expense is about 12.95 months, but this is only a preview estimate and must not
  be stored as the approved metric.
- 90-day cash projection: no approved future inflow or outflow source exists.
- Direct program cost per participant: most expense has no class, and the
  General Ledger has no class or location field.

## Approved Design And Remaining Setup

Approved August 4:

1. Store summarized monthly actual spending, not employee-level ledger rows.
2. Keep the full QuickBooks expense-category mapping editable.
3. Map QuickBooks HRSN to Clinic and Kids CAN! to Kitchen.
4. Limit actual spending and classification information to Admin users.
5. Use employee hours and hourly rates to help calculate payroll allocations.

Remaining setup before building the importer:

- Classify the current payroll rows by employee, month, and program.
- Approve how payroll taxes and any shared employee time follow wage splits.
- Map the 38 QuickBooks expense accounts to editable SNACK budget categories.
- Classify future nonpayroll ledger expenses by program, leaving uncertain rows
  Unallocated until reviewed.

The Admin Data Center coverage repair passed locally on August 4. No QuickBooks
importer has been added and no data has been imported.
