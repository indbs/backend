create temporary table temp1 
SELECT 
	TIME AS STARTUP_TIME, 
	max(time) as end_time, 
	PROGRAM_NUMBER, 
	round(avg(TEMPERATURE),2) as TEMPERATURE,
	round(avg(SP),2) as SP,
	round(avg(OUTPUT_POWER),2) as OUTPUT_POWER, 
	concat('',timediff(max(time),min(time))) as duration,
    concat('',timediff(min(time),ifnull((select max(time)FROM fr05 where program_number=mt1.program_number-1 and year(date(time))=year(now())),
	min(time)))) as pause,
    ifnull(TIMESTAMPDIFF(SECOND,(Select max(time)from fr05 where (program_number=mt1.program_number) and (year(date(time))=year(now())) and (month(now())-month(date(time))<2)),now()),0)  as currentWork 
FROM
	fr05 mt1
WHERE
	year(date(time))=year(now()) and (month(now())-month(date(time))<2)
GROUP BY 
	PROGRAM_NUMBER 
ORDER BY TIME;
    	
SELECT 
	PROGRAM_NUMBER,
	STARTUP_TIME, 
	end_time, 
	duration, 
	currentWork, 
	pause, 
	TEMPERATURE, 
	SP, 
	OUTPUT_POWER 
FROM 
	temp1
GROUP BY 
	PROGRAM_NUMBER
ORDER BY 
	STARTUP_TIME;