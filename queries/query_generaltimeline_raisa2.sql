Create temporary table temp1 SELECT  
	TIME1 AS STARTUP_TIME, 
	max(TIME1) as end_time, 
	PROGRAM_NUMBER,
	avg(gp_n2_pv) as n2,
	round(avg(WaterFlow)*hour(timediff(max(TIME1),min(TIME1))),2) as waterQuant,
	round((avg(Current_L1)*avg(VOLTAGE_L1)+avg(Current_L2)*avg(VOLTAGE_L2)+avg(Current_L3)*avg(VOLTAGE_L3))/1000*hour(timediff(max(TIME1),min(TIME1))),2) as powerVAh,
	round((avg(current_l1)*avg(voltage_l1)+avg(current_l2)*avg(voltage_l2)+avg(current_l3)*avg(voltage_l3))/1000*0.6*hour(timediff(max(TIME1),min(TIME1))),2) as powerkWh,
	concat('',timediff(greatest(max(TIME1),min(TIME1)),least(min(TIME1),max(TIME1)))) as duration,
	concat(
		'',timediff(
				greatest(min(TIME1),ifnull(
						(
							select max(TIME1) from raisa_2 where program_number=mt1.program_number-1 and year(date(time1))=year(now())
						),
						min(TIME1)
					)
				),
				ifnull(
					(
						select max(TIME1) from raisa_2 where program_number=mt1.program_number-1 and year(date(time1))=year(now())
					),
					min(TIME1)
				)
			)
		) as pause,
	ifnull(TIMESTAMPDIFF(SECOND,(Select max(TIME1) from raisa_2 where program_number=mt1.program_number and year(date(time1))=year(now()) and (month(now())-month(date(time1))<2)), now()),0)  as currentWork 
FROM
	raisa_2 mt1 
WHERE 
	year(date(time1))=year(now()) and (month(now())-month(date(time1))<2) and program_number>0
GROUP BY
	PROGRAM_NUMBER
ORDER BY 
	TIME1;

SELECT 
	STARTUP_TIME,
	PROGRAM_NUMBER,
	substring(PROGRAMS_HEAT_RAISA_2.PROGRAM_NAME,1,locate(char(0),PROGRAMS_HEAT_RAISA_2.PROGRAM_NAME)-1) as PROGRAM_NAME,
	max(PROGRAMS_HEAT_RAISA_2.step_NO) as heat_st,
	max(PROGRAMS_GAS_RAISA_2.step_no) as gas_st, 
	pause,
	n2,
	end_time,
	waterQuant, 
	powerVAh, 
	powerkWh,
	duration,
	currentWork 
FROM
	temp1
LEFT JOIN
	PROGRAMS_HEAT_RAISA_2
USING 
  (PROGRAM_NUMBER) 
LEFT JOIN
  PROGRAMS_GAS_RAISA_2
USING 
	(PROGRAM_NUMBER)
WHERE
	year(date(PROGRAMS_HEAT_RAISA_2.inserted))=year(now()) 
		and year(date(PROGRAMS_GAS_RAISA_2.inserted))=year(now()) 
		and (month(now())-month(date(PROGRAMS_GAS_RAISA_2.inserted))<2)
		and (month(now())-month(date(PROGRAMS_HEAT_RAISA_2.inserted))<2) 
GROUP BY 
	PROGRAM_NUMBER 
ORDER BY
	STARTUP_TIME;