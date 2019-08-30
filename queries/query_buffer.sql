'NOT RUNNABLE QUERY!!!'
'ONLY OPTIMISING EXPERIMENTAL PURPOSES'

DELIMITER  //
CREATE DEFINER = 'root'@'localhost' PROCEDURE `gtml`()
    SQL SECURITY DEFINER
    COMMENT ''
BEGIN

	DROP TABLE IF EXISTS raisa_generaltimeline_buffer;
	DROP TABLE IF EXISTS temp1;

	CREATE temporary TABLE temp1 
		SELECT
			TIME AS STARTUP_TIME,
			max(time) as end_time,
			PROGRAM_NUMBER, 
			avg(gp_n2_pv) as n2,
			round(avg(waterflow)*hour(timediff(max(time),min(time))),2) as waterQuant,
			round((avg(current_l1)*avg(voltage_l1)+avg(current_l2)*avg(voltage_l2)+avg(current_l3)*avg(voltage_l3))/1000*hour(timediff(max(time),min(time))),2) as powerVAh,
			round((avg(current_l1)*avg(voltage_l1)+avg(current_l2)*avg(voltage_l2)+avg(current_l3)*avg(voltage_l3))/1000*0.6*hour(timediff(max(time),min(time))),2) as powerkWh,
			concat('',timediff(max(time),min(time))) as duration,
			concat('',timediff(min(time),ifnull((select max(time) from KILN_WORK_FINAL_LAST3 where program_number=mt1.program_number-1 and year(date(time))=year(now())),min(time)))) as pause,
			ifnull(TIMESTAMPDIFF(SECOND,(Select max(time) from KILN_WORK_FINAL_LAST3 where program_number=mt1.program_number and year(date(time))=year(now()) and (month(now())-month(date(time))<2)), now()),0)  as currentWork 
		FROM 
			KILN_WORK_FINAL_LAST3 mt1
		WHERE
			year(date(time))=year(now())
		GROUP BY
				PROGRAM_NUMBER 
		ORDER BY 
				TIME;

	CREATE table raisa_generaltimeline_buffer as (
		SELECT
			now() as inserted,
			PROGRAM_NUMBER,
			pause,
			n2,
			STARTUP_TIME,    
			end_time,
			substring(PROGRAMS_HEAT.PROGRAM_NAME,1,locate(char(0),PROGRAMS_HEAT.PROGRAM_NAME)-1) as PROGRAM_NAME,
			max(PROGRAMS_HEAT.step_NO) as heat_st,
			waterQuant, 
			powerVAh,
			powerkWh,
			duration,
			max(PROGRAMS_gas.step_no) as gas_st, currentWork
		FROM
			temp1
		LEFT JOIN
			PROGRAMS_HEAT
		USING 
			(PROGRAM_NUMBER) 
		LEFT JOIN
			PROGRAMS_GAS
		USING 
			(PROGRAM_NUMBER)
		WHERE
			year(date(PROGRAMS_HEAT.inserted))=year(now()) 
			and year(date(PROGRAMS_gas.inserted))=year(now()) 
		GROUP BY
			PROGRAM_NUMBER
		ORDER BY
			STARTUP_TIME
	);

	drop table IF EXISTS temp1;

END//

DELIMITER ;



CREATE EVENT `raisa_generaltimeline_buffer_fullfilment_event`
  ON SCHEDULE EVERY 1 DAY STARTS '2019-08-14 06:00:00'
  ON COMPLETION NOT PRESERVE
  ENABLE
  COMMENT ''  DO
call gtml();