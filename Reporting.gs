function getKpiSummary(filters) {
  const safeFilters = filters || {};
  const rows = getRows_(SNACK.SHEETS.KPI_DATA).filter((row) => {
    if (safeFilters.programId && row.ProgramID !== safeFilters.programId) {
      return false;
    }
    if (safeFilters.startDate && row.Date < safeFilters.startDate) {
      return false;
    }
    if (safeFilters.endDate && row.Date > safeFilters.endDate) {
      return false;
    }
    return true;
  });

  return rows.reduce((summary, row) => {
    const key = `${row.ProgramID || 'Unassigned'}::${row['KPI Name'] || 'Unknown'}`;
    if (!summary[key]) {
      summary[key] = {
        ProgramID: row.ProgramID || 'Unassigned',
        'KPI Name': row['KPI Name'] || 'Unknown',
        Total: 0,
        Entries: 0
      };
    }
    summary[key].Total += Number(row['KPI Value']) || 0;
    summary[key].Entries += 1;
    return summary;
  }, {});
}

function recordKpi(entry) {
  const now = timestamp_();
  const record = Object.assign({
    EntryID: makeId_('KPI'),
    Date: today_(),
    Staff: Session.getActiveUser().getEmail(),
    'Created At': now,
    'Updated At': now
  }, entry || {});

  appendRow_(SNACK.SHEETS.KPI_DATA, record);
  return record;
}

function recordOutreach(outreach) {
  const now = timestamp_();
  const record = Object.assign({
    OutreachID: makeId_('OUT'),
    Date: today_(),
    'Created At': now,
    'Updated At': now
  }, outreach || {});

  appendRow_(SNACK.SHEETS.OUTREACH, record);

  if (Number(record['Leads Generated']) > 0) {
    createTask({
      'Task Type': 'Outreach Follow-Up',
      Description: `Follow up on leads from ${record['Event Name']}`,
      Priority: 'Normal',
      'Due Date': dateDaysFromNow_(3),
      'Created By Automation': true,
      Notes: `${record['Leads Generated']} leads generated. Partner: ${record['Partner Organization'] || ''}`
    });
  }

  return record;
}
