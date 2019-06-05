SELECT
	min(TIME) as STARTUP_TIME, 
	max(TIME) as end_time, 
	PROGRAM_NUMBER, 
	concat('',timediff(max(time),min(time))) as duration,
	ifnull(timediff(min(TIME),(select max(time) from fr06 where program_number!=0 and table1.program_number!=0 and program_number=table1.program_number-1 group by program_number)),0) as pause,
	ifnull(TIMESTAMPDIFF(Second,max(TIME), now()),0) as currentWork
from  
	fr06 table1
where
	year(date(time))=year(now())
group by 
	PROGRAM_NUMBER
order by
	min(TIME);