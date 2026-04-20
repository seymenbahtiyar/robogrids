import { addDays, setHours, setMinutes, format, isWeekend } from 'date-fns';

export function generateDemoCsv(type: 'hostIdentity' | 'hostname'): string {
  const headers = [
    'Key', 'Process', 'Robot', 'Machine', 'Hostname', 'Host Identity', 
    'Job type', 'Runtime type/license', 'State', 'Priority', 
    'Started (absolute)', 'Ended (absolute)', 'Source', 'Created (absolute)'
  ];
  
  const rows: string[][] = [];
  // Use a fixed start date for the demo data (one month period)
  const startDate = new Date('2026-04-01T00:00:00');
  
  const processes = ['Invoice_Processing', 'Payroll_Sync', 'Daily_Report', 'System_Check', 'Data_Scraping', 'Email_Campaign'];
  // Weighting states to be mostly successful
  const states = ['Successful', 'Successful', 'Successful', 'Successful', 'Successful', 'Successful', 'Successful', 'Successful', 'Faulted', 'Stopped'];
  
  // If testing Host Identity, we want distinct identities but maybe shared hostnames.
  // If testing Hostname, we want distinct hostnames but maybe a shared generic identity.
  const identities = type === 'hostIdentity' 
    ? ['Robot_User_1', 'Robot_User_2', 'Robot_User_3', 'Robot_User_4']
    : ['Robot_User_Generic', 'Robot_User_Generic', 'Robot_User_Generic', 'Robot_User_Generic'];
    
  const hostnames = type === 'hostname'
    ? ['VM_1', 'VM_2', 'VM_3', 'VM_4']
    : ['VM_1', 'VM_1', 'VM_2', 'VM_2'];

  let keyCounter = 1000;

  for (let day = 0; day < 30; day++) {
    const currentDate = addDays(startDate, day);
    const isDayWeekend = isWeekend(currentDate);
    
    // Generate jobs sequentially for each robot to prevent overlapping
    for (let robotIdx = 0; robotIdx < 4; robotIdx++) {
      // On weekends, randomly skip some robots completely so activity naturally drops
      if (isDayWeekend && Math.random() > 0.4) {
        continue;
      }

      const hostIdentity = identities[robotIdx];
      const hostname = hostnames[robotIdx];
      
      // Start the robot's day between 06:00 and 08:00 (or later on weekends)
      const startHourOffset = isDayWeekend ? 8 : 6;
      let currentTime = setMinutes(setHours(currentDate, startHourOffset + Math.floor(Math.random() * 3)), Math.floor(Math.random() * 60));
      
      // Stop generating jobs earlier on weekends
      const endOfDay = setHours(currentDate, isDayWeekend ? 17 : 22); 
      
      while (currentTime < endOfDay) {
        const process = processes[Math.floor(Math.random() * processes.length)];
        const state = states[Math.floor(Math.random() * states.length)];
        
        // Duration between 15 mins and 120 mins
        const durationMins = 15 + Math.floor(Math.random() * 105);
        const ended = new Date(currentTime.getTime() + durationMins * 60000);
        
        // If the job would end after our endOfDay cutoff, stop generating for this robot today
        if (ended > endOfDay) break;
        
        const startedStr = format(currentTime, 'yyyy-MM-dd HH:mm:ss.SSS');
        const endedStr = format(ended, 'yyyy-MM-dd HH:mm:ss.SSS');
        
        rows.push([
          `demo-key-${keyCounter++}`,
          process,
          '', // Robot column is often empty in these exports
          hostname, // Machine
          hostname,
          hostIdentity,
          'Service unattended',
          'Production (Unattended)',
          state,
          'Medium',
          startedStr,
          endedStr,
          'Manual',
          startedStr
        ]);
        
        // Advance current time to the end of this job, plus a gap
        // Weekends have much longer idle gaps
        const gapMins = isDayWeekend 
            ? 60 + Math.floor(Math.random() * 180)  // 1 to 3 hours gap on weekends
            : 1 + Math.floor(Math.random() * 30);   // 1 to 30 mins gap on weekdays
        currentTime = new Date(ended.getTime() + gapMins * 60000);
      }
    }
  }

  // Sort rows by start time to make it realistic
  rows.sort((a, b) => new Date(a[10]).getTime() - new Date(b[10]).getTime());

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}
